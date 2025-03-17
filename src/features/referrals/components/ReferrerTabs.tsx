
import { TabsContent } from "@/components/ui/tabs";
import { ReferrerReferral } from "../data/mockReferrals";
import ReferrerReferralCard from "./ReferrerReferralCard";
import EmptyState from "./EmptyState";

interface ReferrerTabsProps {
  outgoingReferrals: ReferrerReferral[];
  onOpenStatusModal: (referral: ReferrerReferral) => void;
}

const ReferrerTabs = ({ 
  outgoingReferrals, 
  onOpenStatusModal 
}: ReferrerTabsProps) => {
  const pendingReferrals = outgoingReferrals.filter(r => r.status === "pending");
  const acceptedReferrals = outgoingReferrals.filter(r => r.status === "accepted");

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
          <EmptyState message="You haven't submitted any referrals yet" />
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
