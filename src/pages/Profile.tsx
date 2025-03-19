
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  User2,
  Edit2,
  Github,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileModal from "@/components/EditProfileModal";
import { getCompanyNameById } from "@/data/topCompanies";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock update function
  const handleUpdateProfile = async (formData: any) => {
    try {
      if (updateUser) {
        await updateUser(formData);
      } else {
        // Mock update if the real function isn't available
        console.log("Profile update data:", formData);
        toast({
          title: "Profile updated successfully",
          description: "Your profile has been updated.",
        });
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-4">Please login to view your profile</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const companyName = user.company ? getCompanyNameById(user.company) : "";

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar_url || ""} alt={user.first_name} />
                  <AvatarFallback className="text-xl">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name}
                </h2>
                
                <div className="mt-1 flex items-center text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>{user.role === "referrer" ? "Referrer" : "Job Seeker"}</span>
                </div>
                
                {user.company && companyName && (
                  <div className="mt-1 flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{companyName}</span>
                  </div>
                )}
                
                {user.location && (
                  <div className="mt-1 flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                <div className="mt-1 flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  <span>{user.email}</span>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-6 w-full"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Social Links */}
          {(user.linkedin_url || user.github_url || user.twitter_url || user.website_url) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.linkedin_url && (
                  <a 
                    href={user.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
                
                {user.github_url && (
                  <a 
                    href={user.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
                
                {user.twitter_url && (
                  <a 
                    href={user.twitter_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
                
                {user.website_url && (
                  <a 
                    href={user.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Bio and Other Info */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {user.bio ? (
                <p className="whitespace-pre-wrap">{user.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  No bio provided. Click on 'Edit Profile' to add information about yourself.
                </p>
              )}
            </CardContent>
          </Card>
          
          {user.role === "referrer" ? (
            <Card>
              <CardHeader>
                <CardTitle>My Referrals</CardTitle>
                <CardDescription>
                  See all the referrals you've provided to job seekers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/app/referrals")}>
                  View My Referrals
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>
                  Track your job applications and referral requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/app/referrals")}>
                  View My Applications
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <EditProfileModal 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
        profile={user}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};

export default Profile;
