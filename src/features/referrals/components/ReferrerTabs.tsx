
import { TabsContent } from "@/components/ui/tabs";
import { ReferrerReferral } from "../data/mockReferrals";
import ReferrerReferralCard from "./ReferrerReferralCard";
import EmptyState from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

interface ReferrerTabsProps {
  outgoingReferrals: ReferrerReferral[];
  onOpenStatusModal: (referral: ReferrerReferral) => void;
  loading?: boolean;
}

const ReferrerTabs = ({ 
  outgoingReferrals, 
  onOpenStatusModal,
  loading = false
}: ReferrerTabsProps) => {
  const pendingReferrals = outgoingReferrals.filter(r => r.status === "pending");
  const acceptedReferrals = outgoingReferrals.filter(r => r.status === "accepted");

  if (loading) {
    return (
      <>
        <TabsContent value="outgoing" className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </TabsContent>
        <TabsContent value="accepted" className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </TabsContent>
      </>
    );
  }

  return (
    <>
      <TabsContent value="outgoing" className="space-y-4">
        {outgoingReferrals.length > 0 ? (
          outgoingReferrals.map(referral => (
            <ReferrerReferralCard 
              key={referral.id}
              referral={referral} 
              onOpenStatusModal={onOpenStatusModal} 
            />
          ))
        ) : (
          <EmptyState message="You haven't received any referral requests yet" />
        )}
      </TabsContent>
      
      <TabsContent value="pending" className="space-y-4">
        {pendingReferrals.length > 0 ? (
          pendingReferrals.map(referral => (
            <ReferrerReferralCard 
              key={referral.id}
              referral={referral} 
              onOpenStatusModal={onOpenStatusModal} 
            />
          ))
        ) : (
          <EmptyState message="No pending referrals" />
        )}
      </TabsContent>
      
      <TabsContent value="accepted" className="space-y-4">
        {acceptedReferrals.length > 0 ? (
          acceptedReferrals.map(referral => (
            <ReferrerReferralCard 
              key={referral.id}
              referral={referral} 
              onOpenStatusModal={onOpenStatusModal} 
            />
          ))
        ) : (
          <EmptyState message="No accepted referrals" />
        )}
      </TabsContent>
    </>
  );
};

export default ReferrerTabs;
