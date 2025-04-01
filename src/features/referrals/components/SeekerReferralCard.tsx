
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getStatusBadge } from "../utils/statusHelpers";
import { SeekerReferral } from "../data/mockReferrals";
import { MessageSquare, ThumbsUp, Users } from "lucide-react";

interface SeekerReferralCardProps {
  referral: SeekerReferral;
  onSendFollowUp?: (referrerId: string) => void;
  onSendThanks?: (referrerId: string) => void;
  onFindOthers?: () => void;
  loading?: boolean;
}

const SeekerReferralCard = ({ 
  referral, 
  onSendFollowUp, 
  onSendThanks,
  onFindOthers,
  loading = false
}: SeekerReferralCardProps) => {
  const navigate = useNavigate();

  const getCardActions = () => {
    if (loading) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          disabled
        >
          Loading...
        </Button>
      );
    }
    
    switch (referral.status) {
      case "pending":
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSendFollowUp && onSendFollowUp(referral.referrer.id)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Follow-up
          </Button>
        );
      case "accepted":
        return (
          <Button 
            size="sm" 
            onClick={() => onSendThanks && onSendThanks(referral.referrer.id)}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
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
            <Users className="h-4 w-4 mr-2" />
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
              <MessageSquare className="h-4 w-4 mr-2" />
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
