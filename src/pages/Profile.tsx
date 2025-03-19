
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileValidationAlert from "@/components/ProfileValidationAlert";
import { Briefcase, Building, CheckCheck, UserCog, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    role: user?.role || 'seeker',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [isBothRoles, setIsBothRoles] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(user?.role || 'seeker');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [currentCompany, setCurrentCompany] = useState<any>(null);
  
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        role: user.role || 'seeker',
        bio: user.bio || '',
        location: user.location || '',
      });
      setActiveRole(user.role);
    }
  }, [user]);

  // Fetch companies for referrer selection
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch user's current company if they are a referrer
  useEffect(() => {
    const fetchUserCompany = async () => {
      if (user && user.role === 'referrer') {
        try {
          const { data, error } = await supabase
            .from('company_members')
            .select(`
              *,
              companies(*)
            `)
            .eq('user_id', user.id)
            .single();
            
          if (error && error.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" - not an error for our purposes
            throw error;
          }
          
          if (data) {
            setCurrentCompany(data.companies);
            setJobTitle(data.job_title || '');
          }
        } catch (error) {
          console.error('Error fetching user company:', error);
        }
      }
    };

    fetchUserCompany();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    // Reset form data when canceling edit
    if (isEditing && user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        role: user.role || 'seeker',
        bio: user.bio || '',
        location: user.location || '',
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          bio: formData.bio,
          location: formData.location,
          role: isBothRoles ? activeRole : formData.role,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedCompany || !jobTitle) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if user already has a company
      const { data: existingData, error: checkError } = await supabase
        .from('company_members')
        .select('*')
        .eq('user_id', user.id);
        
      if (checkError) throw checkError;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('company_members')
          .update({
            company_id: selectedCompany,
            job_title: jobTitle,
          })
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('company_members')
          .insert({
            user_id: user.id,
            company_id: selectedCompany,
            job_title: jobTitle,
          });
          
        if (error) throw error;
      }
      
      // Also ensure user role is set to referrer
      if (user.role !== 'referrer') {
        const { error } = await supabase
          .from('profiles')
          .update({
            role: 'referrer',
          })
          .eq('id', user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Company Updated",
        description: "Your company information has been successfully updated.",
      });
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your company information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = () => {
    if (!user) return "JD";
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  };

  const ProfileStatus = () => {
    if (!user) return null;
    
    return (
      <div className="mb-6">
        <ProfileValidationAlert profile={user} />
        
        {user.role === 'referrer' && !currentCompany && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <UserCog className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Company Information Needed</AlertTitle>
            <AlertDescription className="text-amber-700">
              As a referrer, please select your company to help job seekers find you.
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const ReferrerCompanySection = () => {
    if (!user || (user.role !== 'referrer' && !isBothRoles)) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Add your company details to be found by job seekers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentCompany ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-muted h-16 w-16 flex items-center justify-center rounded">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{currentCompany.name}</h3>
                  <p className="text-sm text-muted-foreground">{jobTitle}</p>
                </div>
              </div>
              <div className="pt-2">
                <Button variant="outline" onClick={() => setCurrentCompany(null)}>
                  Change Company
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCompanySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Select 
                  value={selectedCompany} 
                  onValueChange={setSelectedCompany}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(company => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager" 
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Company Information"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <ProfileStatus />
      
      {user && user.role === 'referrer' && <ReferrerCompanySection />}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">Profile Details</h2>
          <Badge variant={user?.role === 'seeker' ? "secondary" : "default"}>
            {user?.role === 'seeker' ? 'Job Seeker' : 'Referrer'}
          </Badge>
        </div>
        
        {!isEditing && (
          <Button variant="outline" onClick={handleEditToggle}>
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar_url || undefined} alt="Profile Picture" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{user ? `${user.first_name} ${user.last_name}` : 'Loading...'}</CardTitle>
            <CardDescription>{user?.role === 'seeker' ? 'Job Seeker' : 'Referrer'}</CardDescription>
            
            <div className="flex items-center mt-2 gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full ${user?.role === 'seeker' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}>
                {user?.role === 'seeker' ? 'Job Seeker' : 'Referrer'}
              </span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{user?.email || 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p>{user?.location || 'Not specified'}</p>
            </div>
            
            {user?.bio && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                <p className="text-sm">{user.bio}</p>
              </div>
            )}
            
            <Separator />
            
            <div className="pt-2">
              <Button variant="outline" className="w-full" onClick={handleEditToggle}>
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Details */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      required 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="role">Account Type</Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="bothRoles" className="text-sm">Switch between roles</Label>
                        <Switch 
                          id="bothRoles" 
                          checked={showRoleSwitch}
                          onCheckedChange={setShowRoleSwitch}
                        />
                      </div>
                    </div>
                    
                    {showRoleSwitch ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          You can switch between seeker and referrer roles
                        </p>
                        <RadioGroup 
                          value={activeRole} 
                          onValueChange={(value: UserRole) => setActiveRole(value)}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="seeker" id="seeker" />
                            <Label htmlFor="seeker">Job Seeker</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="referrer" id="referrer" />
                            <Label htmlFor="referrer">Referrer</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    ) : (
                      <RadioGroup 
                        value={formData.role} 
                        onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="seeker" id="seeker" />
                          <Label htmlFor="seeker">Job Seeker</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="referrer" id="referrer" />
                          <Label htmlFor="referrer">Referrer</Label>
                        </div>
                      </RadioGroup>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      placeholder="e.g., San Francisco, CA" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleInputChange} 
                      placeholder="Tell us about yourself" 
                      className="min-h-[100px]" 
                      required 
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={handleEditToggle}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="resume">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resume" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Resume</CardTitle>
                      <CardDescription>Your professional experience and education</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Resume
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium">Experience</h3>
                      <div className="mt-2 space-y-4">
                        <div className="border p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">Senior Developer</h4>
                              <p className="text-sm text-muted-foreground">Tech Company Inc.</p>
                            </div>
                            <p className="text-sm text-muted-foreground">2020 - Present</p>
                          </div>
                          <p className="mt-2 text-sm">Led development of core product features and mentored junior developers.</p>
                        </div>
                        
                        <div className="border p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">Web Developer</h4>
                              <p className="text-sm text-muted-foreground">Digital Agency XYZ</p>
                            </div>
                            <p className="text-sm text-muted-foreground">2018 - 2020</p>
                          </div>
                          <p className="mt-2 text-sm">Built responsive web applications using React and Node.js.</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium">Education</h3>
                      <div className="mt-2 space-y-4">
                        <div className="border p-4 rounded-lg">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">B.S. Computer Science</h4>
                              <p className="text-sm text-muted-foreground">University of Technology</p>
                            </div>
                            <p className="text-sm text-muted-foreground">2014 - 2018</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="skills" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Skills</CardTitle>
                      <CardDescription>Technical skills and competencies</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Add Skills</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">React</span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">TypeScript</span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Node.js</span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">GraphQL</span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">AWS</span>
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Docker</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Soft Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Team Leadership</span>
                          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Project Management</span>
                          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Communication</span>
                          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">Problem Solving</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="applications" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Applications</CardTitle>
                    <CardDescription>Track your job application status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Senior Frontend Developer</h4>
                            <p className="text-sm text-muted-foreground">Tech Innovations Inc.</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                            In Progress
                          </span>
                        </div>
                        <p className="mt-2 text-sm">Applied on: May 15, 2023</p>
                      </div>
                      
                      <div className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Full Stack Engineer</h4>
                            <p className="text-sm text-muted-foreground">Digital Products Co.</p>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                            Interview
                          </span>
                        </div>
                        <p className="mt-2 text-sm">Applied on: May 10, 2023</p>
                      </div>
                      
                      <div className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">React Developer</h4>
                            <p className="text-sm text-muted-foreground">WebApp Studios</p>
                          </div>
                          <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300">
                            Rejected
                          </span>
                        </div>
                        <p className="mt-2 text-sm">Applied on: May 5, 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
