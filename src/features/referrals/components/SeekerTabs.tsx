
import { TabsContent } from "@/components/ui/tabs";
import { SeekerReferral } from "../data/mockReferrals";
import SeekerReferralCard from "./SeekerReferralCard";
import EmptyState from "./EmptyState";

interface SeekerTabsProps {
  referrals: SeekerReferral[];
  onSendFollowUp: (referrerId: string) => void;
  onSendThanks: (referrerId: string) => void;
  onFindOthers: () => void;
}

const SeekerTabs = ({ 
  referrals, 
  onSendFollowUp, 
  onSendThanks, 
  onFindOthers 
}: SeekerTabsProps) => {
  const pendingReferrals = referrals.filter(r => r.status === "pending");
  const acceptedReferrals = referrals.filter(r => r.status === "accepted");
  const rejectedReferrals = referrals.filter(r => r.status === "rejected");

  return (
    <>
      <TabsContent value="all" className="space-y-4">
        {referrals.length > 0 ? (
          referrals.map(referral => (
            <SeekerReferralCard 
              key={referral.id} 
              referral={referral} 
              onSendFollowUp={onSendFollowUp}
              onSendThanks={onSendThanks}
              onFindOthers={onFindOthers}
            />
          ))
        ) : (
          <EmptyState 
            message="You haven't requested any referrals yet" 
            actionLabel="Find Referrers" 
            actionRoute="/app/companies" 
          />
        )}
      </TabsContent>
      
      <TabsContent value="pending" className="space-y-4">
        {pendingReferrals.length > 0 ? (
          pendingReferrals.map(referral => (
            <SeekerReferralCard 
              key={referral.id} 
              referral={referral} 
              onSendFollowUp={onSendFollowUp} 
            />
          ))
        ) : (
          <EmptyState message="No pending referrals" />
        )}
      </TabsContent>
      
      <TabsContent value="accepted" className="space-y-4">
        {acceptedReferrals.length > 0 ? (
          acceptedReferrals.map(referral => (
            <SeekerReferralCard 
              key={referral.id} 
              referral={referral} 
              onSendThanks={onSendThanks} 
            />
          ))
        ) : (
          <EmptyState message="No accepted referrals yet" />
        )}
      </TabsContent>
      
      <TabsContent value="rejected" className="space-y-4">
        {rejectedReferrals.length > 0 ? (
          rejectedReferrals.map(referral => (
            <SeekerReferralCard 
              key={referral.id} 
              referral={referral} 
              onFindOthers={onFindOthers} 
            />
          ))
        ) : (
          <EmptyState message="No rejected referrals" />
        )}
      </TabsContent>
    </>
  );
};

export default SeekerTabs;
