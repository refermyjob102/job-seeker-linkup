
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check, FileText, PaperclipIcon, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";

interface DetailedReferralRequestModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  referrerId?: string;
  referrerName?: string;
}

const DetailedReferralRequestModal = ({
  open,
  onClose,
  jobTitle,
  company,
  referrerId,
  referrerName,
}: DetailedReferralRequestModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeUploaded: false,
    linkedInUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    additionalInfo: "",
    yearsOfExperience: "",
    referralType: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleResumeUpload = () => {
    // Simulate file upload
    setIsSubmitting(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        resumeUploaded: true,
      });
      setIsSubmitting(false);
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been successfully uploaded.",
      });
    }, 1000);
  };

  const handleSubmit = () => {
    if (!formData.resumeUploaded) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume before submitting your request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      
      // Show success toast
      toast({
        title: "Referral Request Sent",
        description: referrerName 
          ? `Your referral request has been sent to ${referrerName}. We'll notify you when they respond.`
          : `Your referral request has been sent. We'll notify you when someone responds.`,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Referral</DialogTitle>
          <DialogDescription>
            {referrerName
              ? `Request a referral from ${referrerName} for the ${jobTitle} position at ${company}.`
              : `Request a referral for the ${jobTitle} position at ${company}.`}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedInUrl}
                onChange={(e) => handleInputChange("linkedInUrl", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your LinkedIn profile helps the referrer understand your professional background.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile (Optional)</Label>
              <Input
                id="github"
                placeholder="https://github.com/yourusername"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange("githubUrl", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
              <Input
                id="portfolio"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                placeholder="e.g., 3"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
              />
            </div>
            
            <Button 
              type="button" 
              variant="default" 
              className="w-full mt-2"
              onClick={() => setActiveTab("documents")}
            >
              Next: Documents
            </Button>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="border rounded-md p-4">
                {formData.resumeUploaded ? (
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="h-5 w-5 mr-2" />
                    <span>resume.pdf uploaded successfully</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto"
                      onClick={() => setFormData({ ...formData, resumeUploaded: false })}
                    >
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your resume here, or click to browse
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isSubmitting}
                      onClick={handleResumeUpload}
                    >
                      <PaperclipIcon className="h-4 w-4 mr-2" />
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, DOCX, RTF (max 5MB)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Explain why you're a good fit for this position..."
                value={formData.coverLetter}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Personalize your message to increase your chances of getting a referral.
              </p>
            </div>
            
            <div className="flex justify-between mt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setActiveTab("details")}
              >
                Back
              </Button>
              <Button 
                type="button" 
                variant="default"
                onClick={() => setActiveTab("additional")}
              >
                Next: Additional Info
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="additional" className="space-y-4">
            <div className="space-y-4">
              <Label>Referral Type</Label>
              <RadioGroup 
                value={formData.referralType} 
                onValueChange={(value) => handleInputChange("referralType", value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 rounded-md border p-3">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="space-y-1">
                    <Label htmlFor="standard" className="font-medium">
                      Standard Referral
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Basic referral with your resume forwarded to the hiring team.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 rounded-md border p-3">
                  <RadioGroupItem value="strong" id="strong" />
                  <div className="space-y-1">
                    <Label htmlFor="strong" className="font-medium">
                      Strong Recommendation
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Request a personal recommendation if you know the referrer well.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Any other information you'd like to share with the referrer..."
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="bg-muted/50 p-4 rounded-md text-sm">
              <h4 className="font-medium mb-2">Before Submitting:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Make sure your resume is up-to-date and tailored for this position</li>
                <li>Personalize your cover letter for this specific opportunity</li>
                <li>Be respectful of the referrer's time and position</li>
              </ul>
            </div>
            
            <div className="flex justify-between mt-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setActiveTab("documents")}
              >
                Back
              </Button>
              <Button 
                type="button" 
                variant="default"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Referral Request"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedReferralRequestModal;
