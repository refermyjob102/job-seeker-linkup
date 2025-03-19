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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Users,
  Building
} from "lucide-react";
import { topCompanies } from "@/data/topCompanies";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    company: user?.company || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
    twitter_url: user?.twitter_url || "",
    website_url: user?.website_url || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        company: user.company || "",
        linkedin_url: user.linkedin_url || "",
        github_url: user.github_url || "",
        twitter_url: user.twitter_url || "",
        website_url: user.website_url || "",
      });
    }
  }, [user]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
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

  // Update to use top companies list
  const companyOptions = topCompanies.map((company) => ({
    label: company.name,
    value: company.id,
  }));

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>
            Update your profile information here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange("first_name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange("last_name", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us a bit about yourself"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Your city, state, or country"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Select onValueChange={(value) => handleInputChange("company", value)} value={formData.company}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companyOptions.map((company) => (
                    <SelectItem key={company.value} value={company.value}>
                      {company.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  type="url"
                  id="linkedinUrl"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  placeholder="Your LinkedIn profile URL"
                />
              </div>
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  type="url"
                  id="githubUrl"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                  placeholder="Your GitHub profile URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  type="url"
                  id="twitterUrl"
                  value={formData.twitter_url}
                  onChange={(e) => handleInputChange("twitter_url", e.target.value)}
                  placeholder="Your Twitter profile URL"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  type="url"
                  id="websiteUrl"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange("website_url", e.target.value)}
                  placeholder="Your personal website URL"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
