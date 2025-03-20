
import { AlertCircle, CheckCircle2, ThumbsUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Profile } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileValidationAlertProps {
  profile: Profile | null;
}

const ProfileValidationAlert = ({ profile }: ProfileValidationAlertProps) => {
  const isMobile = useIsMobile();
  
  if (!profile) return null;

  const missingFields = [];
  
  if (!profile.first_name || profile.first_name.trim() === '') missingFields.push('First Name');
  if (!profile.last_name || profile.last_name.trim() === '') missingFields.push('Last Name');
  if (!profile.email || profile.email.trim() === '') missingFields.push('Email');
  if (!profile.location || profile.location.trim() === '') missingFields.push('Location');
  if (!profile.bio || profile.bio.trim() === '') missingFields.push('Bio');
  
  const completionPercentage = Math.floor(((5 - missingFields.length) / 5) * 100);
  
  if (missingFields.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200 mb-6">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Profile Complete!</AlertTitle>
        <AlertDescription className="text-green-700">
          <div className="flex flex-col space-y-2">
            <p>Your profile is 100% complete! You're all set to request referrals and apply for jobs.</p>
            <Progress value={100} className="h-2 bg-green-100" />
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Profile Incomplete ({completionPercentage}%)</AlertTitle>
      <AlertDescription>
        <div className="flex flex-col space-y-2">
          <p className={isMobile ? "text-sm" : "text-base"}>
            Please complete the following fields to improve your matches and enable referral requests:
          </p>
          <div className={`font-semibold ${isMobile ? "text-sm" : "text-base"}`}>
            {missingFields.join(', ')}
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileValidationAlert;
