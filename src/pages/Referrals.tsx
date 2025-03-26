
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import UpdateReferralStatusModal from "@/components/UpdateReferralStatusModal";
import { 
  initialReferrals, 
  initialOutgoingReferrals, 
  ReferrerReferral, 
  SeekerReferral, 
  ReferralStatus 
} from "@/features/referrals/data/mockReferrals";
import SeekerTabs from "@/features/referrals/components/SeekerTabs";
import ReferrerTabs from "@/features/referrals/components/ReferrerTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

const Referrals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>(user?.role === "referrer" ? "outgoing" : "all");
  const [referrals, setReferrals] = useState<SeekerReferral[]>(initialReferrals);
  const [outgoingReferrals, setOutgoingReferrals] = useState<ReferrerReferral[]>(initialOutgoingReferrals);
  const [selectedReferral, setSelectedReferral] = useState<ReferrerReferral | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch referrals from the database
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        if (user.role === "seeker") {
          // Fetch referrals for job seekers
          const { data, error } = await supabase
            .from('referrals')
            .select(`
              id,
              position,
              status,
              created_at,
              companies:company_id(name),
              referrers:referrer_id(
                id,
                profiles:id(
                  first_name,
                  last_name,
                  avatar_url,
                  job_title
                )
              )
            `)
            .eq('seeker_id', user.id);
            
          if (error) throw error;
          
          if (data) {
            // Transform data to match the SeekerReferral interface
            const formattedData: SeekerReferral[] = data.map(item => ({
              id: item.id,
              company: item.companies?.name || 'Unknown Company',
              position: item.position,
              referrer: {
                id: item.referrers?.id || '',
                name: `${item.referrers?.profiles?.first_name || ''} ${item.referrers?.profiles?.last_name || ''}`.trim() || 'Unknown',
                avatar: item.referrers?.profiles?.avatar_url || '',
                jobTitle: item.referrers?.profiles?.job_title || '',
              },
              status: item.status as ReferralStatus,
              date: new Date(item.created_at).toISOString().split('T')[0],
            }));
            
            setReferrals(formattedData);
          }
        } else {
          // Fetch outgoing referrals for referrers
          const { data, error } = await supabase
            .from('referrals')
            .select(`
              id,
              position,
              status,
              created_at,
              companies:company_id(name),
              seekers:seeker_id(
                id,
                profiles:id(
                  first_name,
                  last_name,
                  avatar_url
                )
              )
            `)
            .eq('referrer_id', user.id);
            
          if (error) throw error;
          
          if (data) {
            // Transform data to match the ReferrerReferral interface
            const formattedData: ReferrerReferral[] = data.map(item => ({
              id: item.id,
              company: item.companies?.name || 'Unknown Company',
              position: item.position,
              applicant: {
                id: item.seekers?.id || '',
                name: `${item.seekers?.profiles?.first_name || ''} ${item.seekers?.profiles?.last_name || ''}`.trim() || 'Unknown',
                avatar: item.seekers?.profiles?.avatar_url || '',
              },
              status: item.status as ReferralStatus,
              date: new Date(item.created_at).toISOString().split('T')[0],
            }));
            
            setOutgoingReferrals(formattedData);
          }
        }
      } catch (error) {
        console.error('Error fetching referrals:', error);
        // Fallback to mock data if fetch fails
        if (user.role === "seeker") {
          setReferrals(initialReferrals);
        } else {
          setOutgoingReferrals(initialOutgoingReferrals);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchReferrals();
  }, [user]);

  const handleOpenStatusModal = (referral: ReferrerReferral) => {
    setSelectedReferral(referral);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = async (status: string, feedback?: string) => {
    if (!selectedReferral || !user) return;

    try {
      // Update the referral status in the database
      const { error } = await supabase
        .from('referrals')
        .update({ 
          status,
          notes: feedback || null
        })
        .eq('id', selectedReferral.id)
        .eq('referrer_id', user.id);
        
      if (error) throw error;

      // Update the referral status in our state
      const updatedReferrals = outgoingReferrals.map(ref => 
        ref.id === selectedReferral.id 
          ? { ...ref, status: status as ReferralStatus } 
          : ref
      );
      
      setOutgoingReferrals(updatedReferrals);
      
      // Show success notification
      toast({
        title: "Referral Status Updated",
        description: `You've updated the status for ${selectedReferral.applicant.name}'s referral request.`,
      });
      
      // Close the modal
      setIsUpdateModalOpen(false);
      
      // Create a notification for the seeker in the database
      const notificationPayload = {
        recipient_id: selectedReferral.applicant.id,
        sender_id: user.id,
        type: 'referral_update',
        content: `Your referral request for ${selectedReferral.position} at ${selectedReferral.company} has been ${status}`,
        referral_id: selectedReferral.id,
        is_read: false
      };
      
      await supabase.from('notifications').insert([notificationPayload]);
      
    } catch (error) {
      console.error('Error updating referral status:', error);
      toast({
        title: "Error",
        description: "Failed to update referral status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendFollowUp = (referrerId: string) => {
    navigate(`/app/chat/${referrerId}`);
  };

  const handleSendThanks = (referrerId: string) => {
    navigate(`/app/chat/${referrerId}`);
  };

  const handleFindOthers = () => {
    navigate("/app/companies");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Referrals</h1>
        {user?.role === "seeker" && (
          <Button onClick={() => navigate("/app/companies")} className="w-full sm:w-auto">
            Find Referrers
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Responsive TabsList */}
        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <TabsList className="mb-6 flex w-auto min-w-full justify-start sm:justify-center">
            {user?.role === "seeker" ? (
              <>
                <TabsTrigger value="all" className="flex-shrink-0">All Referrals</TabsTrigger>
                <TabsTrigger value="pending" className="flex-shrink-0">Pending</TabsTrigger>
                <TabsTrigger value="accepted" className="flex-shrink-0">Accepted</TabsTrigger>
                <TabsTrigger value="rejected" className="flex-shrink-0">Rejected</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="outgoing" className="flex-shrink-0">Outgoing Referrals</TabsTrigger>
                <TabsTrigger value="pending" className="flex-shrink-0">Pending</TabsTrigger>
                <TabsTrigger value="accepted" className="flex-shrink-0">Accepted</TabsTrigger>
              </>
            )}
          </TabsList>
        </div>

        {user?.role === "seeker" ? (
          <SeekerTabs 
            referrals={referrals}
            onSendFollowUp={handleSendFollowUp}
            onSendThanks={handleSendThanks}
            onFindOthers={handleFindOthers}
            loading={loading}
          />
        ) : (
          <ReferrerTabs 
            outgoingReferrals={outgoingReferrals}
            onOpenStatusModal={handleOpenStatusModal}
            loading={loading}
          />
        )}
      </Tabs>

      {/* Update Status Modal */}
      {selectedReferral && (
        <UpdateReferralStatusModal
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          referralId={selectedReferral.id}
          applicantName={selectedReferral.applicant.name}
          jobTitle={selectedReferral.position}
        />
      )}
    </div>
  );
};

export default Referrals;
