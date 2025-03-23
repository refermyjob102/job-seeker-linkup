
import { useState } from "react";
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

  const handleOpenStatusModal = (referral: ReferrerReferral) => {
    setSelectedReferral(referral);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = (status: string, feedback?: string) => {
    if (!selectedReferral) return;

    // Update the referral status in our state
    const updatedReferrals = outgoingReferrals.map(ref => 
      ref.id === selectedReferral.id 
        ? { ...ref, status: status as ReferralStatus } 
        : ref
    );
    
    setOutgoingReferrals(updatedReferrals);
    
    // In a real app, we would also send a notification to the applicant
    toast({
      title: "Referral Status Updated",
      description: `You've updated the status for ${selectedReferral.applicant.name}'s referral request.`,
    });
    
    // If feedback was provided, we would also send it to the applicant in a real app
    if (feedback && feedback.trim()) {
      console.log(`Feedback for ${selectedReferral.applicant.name}: ${feedback}`);
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
          />
        ) : (
          <ReferrerTabs 
            outgoingReferrals={outgoingReferrals}
            onOpenStatusModal={handleOpenStatusModal}
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
