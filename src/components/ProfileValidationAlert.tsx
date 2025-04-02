
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types/database';

interface ProfileValidationAlertProps {
  profile: Profile;
}

const ProfileValidationAlert = ({ profile }: ProfileValidationAlertProps) => {
  const navigate = useNavigate();
  
  // Check what profile fields are missing
  const missingFields = [];
  
  if (!profile.bio) missingFields.push('bio');
  if (!profile.location) missingFields.push('location');
  if (profile.role === 'referrer' && !profile.company) missingFields.push('company');
  if (profile.role === 'referrer' && !profile.job_title) missingFields.push('job title');
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle>Incomplete Profile</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
        <div>
          Please complete your profile to access all features. 
          Missing: {missingFields.join(', ')}.
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="whitespace-nowrap sm:ml-auto"
          onClick={() => navigate('/app/profile')}
        >
          Complete Profile
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ProfileValidationAlert;
