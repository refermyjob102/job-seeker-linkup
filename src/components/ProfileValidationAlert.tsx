
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Profile } from "@/types/database";

interface ProfileValidationAlertProps {
  profile: Profile | null;
}

const ProfileValidationAlert = ({ profile }: ProfileValidationAlertProps) => {
  if (!profile) return null;

  const missingFields = [];
  
  if (!profile.first_name || profile.first_name.trim() === '') missingFields.push('First Name');
  if (!profile.last_name || profile.last_name.trim() === '') missingFields.push('Last Name');
  if (!profile.email || profile.email.trim() === '') missingFields.push('Email');
  if (!profile.location || profile.location.trim() === '') missingFields.push('Location');
  if (!profile.bio || profile.bio.trim() === '') missingFields.push('Bio');
  
  if (missingFields.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200 mb-6">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Profile Complete</AlertTitle>
        <AlertDescription className="text-green-700">
          Your profile is complete! You're all set to request referrals and apply for jobs.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Profile Incomplete</AlertTitle>
      <AlertDescription>
        Please complete the following fields to improve your matches and enable referral requests: <br />
        <span className="font-semibold">{missingFields.join(', ')}</span>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileValidationAlert;
