
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getStatusBadge } from "../utils/statusHelpers";
import { SeekerReferral } from "../data/mockReferrals";

interface SeekerReferralCardProps {
  referral: SeekerReferral;
  onSendFollowUp?: (referrerId: string) => void;
  onSendThanks?: (referrerId: string) => void;
  onFindOthers?: () => void;
}

const SeekerReferralCard = ({ 
  referral, 
  onSendFollowUp, 
  onSendThanks,
  onFindOthers
}: SeekerReferralCardProps) => {
  const navigate = useNavigate();

  const getCardActions = () => {
    switch (referral.status) {
      case "pending":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSendFollowUp && onSendFollowUp(referral.referrer.id)}
          >
            Send Follow-up
          </Button>
        );
      case "accepted":
        return (
          <Button 
            size="sm" 
            onClick={() => onSendThanks && onSendThanks(referral.referrer.id)}
          >
            Send Thanks
          </Button>
        );
      case "rejected":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFindOthers}
          >
            Find Others
          </Button>
        );
      default:
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/app/chat/${referral.referrer.id}`)}
            >
              Message
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate(`/app/members/${referral.referrer.id}`)}
            >
              View Profile
            </Button>
          </div>
        );
    }
  };

  return (
    <Card key={referral.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{referral.position}</CardTitle>
            <CardDescription>{referral.company}</CardDescription>
          </div>
          {getStatusBadge(referral.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={referral.referrer.avatar} alt={referral.referrer.name} />
            <AvatarFallback>{referral.referrer.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{referral.referrer.name}</p>
            <p className="text-sm text-muted-foreground">{referral.referrer.jobTitle}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Requested on {new Date(referral.date).toLocaleDateString()}
        </p>
        {getCardActions()}
      </CardFooter>
    </Card>
  );
};

export default SeekerReferralCard;
