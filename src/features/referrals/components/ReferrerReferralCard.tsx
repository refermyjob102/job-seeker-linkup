
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { getStatusBadge } from "../utils/statusHelpers";
import { ReferrerReferral } from "../data/mockReferrals";

interface ReferrerReferralCardProps {
  referral: ReferrerReferral;
  onOpenStatusModal: (referral: ReferrerReferral) => void;
}

const ReferrerReferralCard = ({ 
  referral, 
  onOpenStatusModal 
}: ReferrerReferralCardProps) => {
  const navigate = useNavigate();

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
            <AvatarImage src={referral.applicant.avatar} alt={referral.applicant.name} />
            <AvatarFallback>{referral.applicant.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{referral.applicant.name}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Submitted on {new Date(referral.date).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/app/chat/${referral.applicant.id}`)}
          >
            Message
          </Button>
          {referral.status === "pending" && (
            <Button 
              size="sm"
              onClick={() => onOpenStatusModal(referral)}
            >
              Update Status
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReferrerReferralCard;
