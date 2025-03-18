import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/fileUpload";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { CompanySection } from "@/components/profile/CompanySection";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  location: string;
  bio: string;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [userCompany, setUserCompany] = useState<Company | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      location: user?.location || "",
      bio: user?.bio || "",
    }
  });

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const { data: skillsData } = await supabase
          .from('user_skills')
          .select(`
            skills (
              id,
              name,
              category
            )
          `)
          .eq('user_id', user.id);

        if (skillsData) {
          setUserSkills(skillsData.map(item => item.skills));
        }

        if (user.role === 'referrer') {
          const { data: companyData } = await supabase
            .from('company_members')
            .select(`
              companies (
                id,
                name,
                logo_url
              )
            `)
            .eq('user_id', user.id)
            .single();

          if (companyData) {
            setUserCompany(companyData.companies);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'resume') => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileUrl = await uploadFile(file, type, user[type === 'avatar' ? 'avatar_url' : 'resume_url']);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          [type === 'avatar' ? 'avatar_url' : 'resume_url']: fileUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: `${type === 'avatar' ? 'Profile picture' : 'Resume'} updated`,
        description: `Your ${type === 'avatar' ? 'profile picture' : 'resume'} has been updated successfully.`,
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to upload ${type === 'avatar' ? 'profile picture' : 'resume'}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          location: data.location,
          bio: data.bio,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url || ''} alt={`${user.first_name} ${user.last_name}`} />
                <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  id="avatar-upload"
                  onChange={(e) => handleFileUpload(e, 'avatar')}
                />
                <Label
                  htmlFor="avatar-upload"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
                >
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : '+'}
                </Label>
              </div>
            </div>
            <CardTitle className="mt-4">{user.first_name} {user.last_name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            
            <div className="flex items-center mt-2 gap-2">
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{user.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p>{user.location || 'Not specified'}</p>
            </div>
            
            <Separator />
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  {...register("first_name", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name" 
                  {...register("last_name", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  {...register("location")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  {...register("bio")}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Right Column - Additional Info */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              {user?.role === 'referrer' && (
                <TabsTrigger value="company">Company</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        {...register("first_name", { required: true })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        {...register("last_name", { required: true })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        {...register("location")}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        {...register("bio")}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Add or remove skills from your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsSection userId={user?.id} initialSkills={userSkills} />
                </CardContent>
              </Card>
            </TabsContent>

            {user?.role === 'referrer' && (
              <TabsContent value="company" className="space-y-4 mt-4">
                <CompanySection userId={user?.id} currentCompany={userCompany || undefined} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
