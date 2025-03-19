
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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
  const [message, setMessage] = useState(
    `Hi${referrerName ? ` ${referrerName}` : ""},\n\nI'm interested in the ${jobTitle} position at ${company}. I believe my skills and experience make me a good fit for this role. Would you be willing to refer me?\n\nThank you for considering my request.`
  );
  const [resumeUrl, setResumeUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const isProfileComplete = () => {
    if (!user) return false;
    
    // Basic validation to check if essential profile fields are filled
    return !!(
      user.first_name && 
      user.last_name && 
      user.email &&
      user.bio && 
      user.location
    );
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request a referral.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!isProfileComplete()) {
      toast({
        title: "Incomplete Profile",
        description: "Please complete your profile before requesting a referral.",
        variant: "destructive",
      });
      onClose();
      navigate("/app/profile");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save the referral request to the database
      const { data, error } = await supabase
        .from('referrals')
        .insert([
          { 
            seeker_id: user.id,
            referrer_id: referrerId,
            company: company,
            position: jobTitle,
            notes: message,
            resume_url: resumeUrl,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      onClose();
      
      // Show success toast
      toast({
        title: "Referral Request Sent",
        description: `Your request has been sent to ${referrerName || "the referrer"}.`,
      });

      // Navigate to the referrals page
      navigate('/app/referrals');
    } catch (error) {
      console.error("Error submitting referral:", error);
      toast({
        title: "Error",
        description: "Failed to send referral request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request a Referral</DialogTitle>
          <DialogDescription>
            Send a personalized message to request a referral for the {jobTitle} position at {company}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
            <Input
              id="resumeUrl"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="Link to your resume or portfolio"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Your contact number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[200px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !message.trim()}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailedReferralRequestModal;
