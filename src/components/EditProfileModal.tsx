
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { topCompanies } from "@/data/topCompanies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Profile } from "@/types/database";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  onSave: (data: Partial<Profile>) => Promise<void>;
}

const EditProfileModal = ({ 
  open, 
  onOpenChange, 
  profile, 
  onSave 
}: EditProfileModalProps) => {
  const { toast } = useToast();
  const { user, fetchProfile } = useAuth();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState<Partial<Profile>>({
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    company: "",
    job_title: "",
    department: "",
    years_experience: "",
    education: "",
    skills: "",
    languages: "",
    interests: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    website_url: "",
    available_for_referrals: false,
    open_to_work: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [companies, setCompanies] = useState<{id: string, name: string}[]>([]);
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [customCompany, setCustomCompany] = useState("");

  useEffect(() => {
    // Fetch companies from the database
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
          
        if (error) {
          console.error('Error fetching companies:', error);
          return;
        }
        
        setCompanies(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        company: profile.company || "",
        job_title: profile.job_title || "",
        department: profile.department || "",
        years_experience: profile.years_experience || "",
        education: profile.education || "",
        skills: profile.skills || "",
        languages: profile.languages || "",
        interests: profile.interests || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        twitter_url: profile.twitter_url || "",
        website_url: profile.website_url || "",
        available_for_referrals: profile.available_for_referrals || false,
        open_to_work: profile.open_to_work || false,
      });

      // Check if the company is in our list or if it's a custom one
      if (profile.company) {
        const companyExists = companies.some(c => c.id === profile.company);
        if (!companyExists) {
          setShowCustomCompany(true);
          setCustomCompany(profile.company);
        }
      }
    }
  }, [profile, companies]);

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCompanyChange = async (value: string) => {
    if (value === "other") {
      setShowCustomCompany(true);
      handleInputChange("company", "");
    } else {
      setShowCustomCompany(false);
      handleInputChange("company", value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalCompanyId = formData.company;
      
      // If user entered a custom company, create it first
      if (showCustomCompany && customCompany.trim()) {
        // Check if the company already exists with the same name
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .ilike('name', customCompany.trim())
          .single();
          
        if (existingCompany) {
          finalCompanyId = existingCompany.id;
        } else {
          // Create new company
          const { data: newCompany, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: customCompany.trim()
            })
            .select('id')
            .single();
            
          if (companyError) {
            throw new Error(`Error creating company: ${companyError.message}`);
          }
          
          if (newCompany) {
            finalCompanyId = newCompany.id;
          }
        }
      }
      
      const dataToUpdate = {
        ...formData,
        company: finalCompanyId
      };
      
      // First call the onSave prop for backward compatibility
      await onSave(dataToUpdate);
      
      // Then update the profile directly in Supabase if we have a user ID
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .update(dataToUpdate)
          .eq('id', user.id);
          
        if (error) throw error;
        
        // Fetch the updated profile to ensure UI is in sync
        await fetchProfile(user.id);
      }
      
      onOpenChange(false);
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[700px] max-h-[90vh] overflow-y-auto ${isMobile ? 'p-4' : 'p-6'}`}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information here.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs 
            defaultValue="personal" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} mb-4`}>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              {!isMobile && <TabsTrigger value="skills">Skills</TabsTrigger>}
              {!isMobile && <TabsTrigger value="social">Social</TabsTrigger>}
            </TabsList>

            {isMobile && (
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>
            )}

            {/* Personal Tab */}
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell us a bit about yourself"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  type="text"
                  id="location"
                  value={formData.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Your city, state, or country"
                />
              </div>

              <div>
                <Label htmlFor="interests">Interests</Label>
                <Input
                  type="text"
                  id="interests"
                  value={formData.interests || ""}
                  onChange={(e) => handleInputChange("interests", e.target.value)}
                  placeholder="Separate interests with commas"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="openToWork">Open to Work</Label>
                  <p className="text-sm text-muted-foreground">Show that you're actively looking for new opportunities</p>
                </div>
                <Switch
                  id="openToWork"
                  checked={formData.open_to_work || false}
                  onCheckedChange={(checked) => handleInputChange("open_to_work", checked)}
                />
              </div>
            </TabsContent>

            {/* Professional Tab */}
            <TabsContent value="professional" className="space-y-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Select 
                  onValueChange={handleCompanyChange} 
                  value={showCustomCompany ? "other" : (formData.company || "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {showCustomCompany && (
                <div>
                  <Label htmlFor="customCompany">Company Name</Label>
                  <Input
                    type="text"
                    id="customCompany"
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  type="text"
                  id="jobTitle"
                  value={formData.job_title || ""}
                  onChange={(e) => handleInputChange("job_title", e.target.value)}
                  placeholder="Your current job title"
                />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  type="text"
                  id="department"
                  value={formData.department || ""}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  placeholder="Your department"
                />
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  type="text"
                  id="yearsExperience"
                  value={formData.years_experience || ""}
                  onChange={(e) => handleInputChange("years_experience", e.target.value)}
                  placeholder="How many years of experience do you have?"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="availableForReferrals">Available for Referrals</Label>
                  <p className="text-sm text-muted-foreground">Show that you're willing to provide referrals</p>
                </div>
                <Switch
                  id="availableForReferrals"
                  checked={formData.available_for_referrals || false}
                  onCheckedChange={(checked) => handleInputChange("available_for_referrals", checked)}
                />
              </div>
            </TabsContent>

            {/* Skills & Education Tab */}
            <TabsContent value="skills" className="space-y-4">
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  value={formData.skills || ""}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder="Separate skills with commas (e.g., React, JavaScript, Project Management)"
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={formData.education || ""}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  placeholder="Your educational background"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="languages">Languages</Label>
                <Input
                  type="text"
                  id="languages"
                  value={formData.languages || ""}
                  onChange={(e) => handleInputChange("languages", e.target.value)}
                  placeholder="Languages you speak (e.g., English, Spanish, French)"
                />
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  type="url"
                  id="linkedinUrl"
                  value={formData.linkedin_url || ""}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="Your LinkedIn profile URL"
                />
              </div>

              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  type="url"
                  id="githubUrl"
                  value={formData.github_url || ""}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                  placeholder="Your GitHub profile URL"
                />
              </div>

              <div>
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  type="url"
                  id="twitterUrl"
                  value={formData.twitter_url || ""}
                  onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                  placeholder="Your Twitter profile URL"
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  type="url"
                  id="websiteUrl"
                  value={formData.website_url || ""}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  placeholder="Your personal website URL"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className={isMobile ? "flex flex-col space-y-2" : ""}>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => onOpenChange(false)}
              className={isMobile ? "w-full" : ""}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={isMobile ? "w-full" : ""}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
