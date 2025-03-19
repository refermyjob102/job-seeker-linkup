
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Edit2,
  Github,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Bookmark,
  GraduationCap,
  Award,
  Clock,
  Languages,
  Heart,
  UserCheck,
  Building,
  BadgeCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileModal from "@/components/EditProfileModal";
import { getCompanyNameById } from "@/data/topCompanies";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock update function
  const handleUpdateProfile = async (formData: any) => {
    try {
      console.log("Profile update data:", formData);
      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated.",
      });
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

  // Parse skills, interests, education, languages if they exist
  const skills = user.skills ? user.skills.split(',').map(s => s.trim()) : [];
  const interests = user.interests ? user.interests.split(',').map(i => i.trim()) : [];
  const languages = user.languages ? user.languages.split(',').map(l => l.trim()) : [];
  
  const companyName = user.company ? getCompanyNameById(user.company) : "";

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      user.first_name,
      user.last_name,
      user.bio,
      user.location,
      user.company,
      user.job_title,
      user.education,
      user.skills,
      user.linkedin_url,
      user.github_url,
      user.twitter_url,
      user.website_url
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.floor((filledFields / fields.length) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
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
                
                {user.job_title && (
                  <p className="text-lg text-muted-foreground mb-2">{user.job_title}</p>
                )}
                
                {user.open_to_work && (
                  <Badge className="mb-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <UserCheck className="h-3 w-3 mr-1" /> Open to Work
                  </Badge>
                )}
                
                <div className="w-full space-y-2 mt-4">
                  {user.company && companyName && (
                    <div className="flex items-center text-muted-foreground">
                      <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{companyName}</span>
                    </div>
                  )}
                  
                  {user.department && (
                    <div className="flex items-center text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  
                  {user.location && (
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
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
          
          {/* Profile Completion Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-medium">{profileCompletionPercentage}%</span>
                </div>
                <Progress value={profileCompletionPercentage} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Complete your profile to increase your chances of getting noticed by referrers.
                </p>
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
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Languages Card */}
          {languages.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language, index) => (
                    <Badge key={index} variant="secondary">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Interests Card */}
          {interests.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge key={index} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Profile tabs and content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card>
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
              
              {user.education && (
                <Card className="mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap">
                      {user.education}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{user.role === "referrer" ? "My Referrals" : "My Applications"}</CardTitle>
                  <CardDescription>
                    {user.role === "referrer" 
                      ? "See all the referrals you've provided to job seekers" 
                      : "Track your job applications and referral requests"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/app/referrals")}>
                    {user.role === "referrer" ? "View My Referrals" : "View My Applications"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Experience Tab */}
            <TabsContent value="experience" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.job_title && companyName ? (
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-muted h-12 w-12 rounded-md flex items-center justify-center mr-4 mt-1">
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{user.job_title}</h3>
                          <p className="text-muted-foreground">{companyName}</p>
                          {user.department && (
                            <p className="text-muted-foreground text-sm">{user.department}</p>
                          )}
                          {user.years_experience && (
                            <div className="flex items-center mt-2 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{user.years_experience} {parseInt(user.years_experience) === 1 ? 'year' : 'years'} of experience</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator />
                      {user.available_for_referrals && (
                        <div className="flex items-center py-2">
                          <BadgeCheck className="text-green-500 h-5 w-5 mr-2" />
                          <p className="text-green-700 dark:text-green-400 font-medium">Available for Referrals</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No work experience added. Click on 'Edit Profile' to add your work experience.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="px-3 py-1 text-base"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No skills added. Click on 'Edit Profile' to add your skills.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Saved Jobs</CardTitle>
                  <CardDescription>Jobs you've bookmarked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Bookmark className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No saved jobs yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Jobs you save will appear here for easy access
                    </p>
                    <Button variant="outline" onClick={() => navigate("/app/jobs")}>
                      Browse Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
