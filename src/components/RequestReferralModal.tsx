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
import { chatService } from "@/services/chatService";

interface RequestReferralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  referrerId?: string;
  referrerName?: string;
}

const RequestReferralModal = ({
  open,
  onOpenChange,
  jobId,
  jobTitle,
  companyId,
  companyName,
  referrerId,
  referrerName,
}: RequestReferralModalProps) => {
  const defaultMessage = `Hi${referrerName ? ` ${referrerName}` : ""},\n\nI'm interested in the ${jobTitle} position at ${companyName}. I believe my skills and experience make me a good fit for this role. Would you be willing to refer me?\n\nThank you for considering my request.`;
  
  const [message, setMessage] = useState(defaultMessage);
  const [jobLink, setJobLink] = useState("");
  const [jobCode, setJobCode] = useState("");
  const [roleName, setRoleName] = useState(jobTitle);
  const [resumeUrl, setResumeUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

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

    setIsSubmitting(true);
    
    try {
      // Create the referral request in the database
      const referralData = {
        seeker_id: user.id,
        referrer_id: referrerId,
        company_id: companyId,
        position: roleName,
        notes: message,
        resume_url: resumeUrl || null,
        status: 'pending'
      };
      
      const { data: referral, error } = await supabase
        .from('referrals')
        .insert([referralData])
        .select()
        .single();
      
      if (error) throw error;
      
      // Create a notification for the referrer
      if (referrerId) {
        const notificationData = {
          recipient_id: referrerId,
          sender_id: user.id,
          type: 'referral_request',
          content: `${user.first_name} ${user.last_name} is requesting a referral for the ${roleName} position at ${companyName}.`,
          referral_id: referral.id,
          is_read: false
        };
        
        await supabase.from('notifications').insert([notificationData]);
      }
      
      // Close the modal
      onOpenChange(false);
      
      // Show success toast
      toast({
        title: "Referral Request Sent",
        description: `Your request has been sent to ${referrerName || "the referrer"}.`,
        variant: "default",
      });

      // If we have a referrer ID, navigate to chat with them
      if (referrerId) {
        // Get or create a conversation
        const conversationId = await chatService.getOrCreateConversation(user.id, referrerId);
        
        // Send an initial message in the conversation
        await chatService.sendMessage(
          conversationId,
          user.id,
          referrerId,
          `Hi! I just sent you a referral request for the ${roleName} position at ${companyName}. I appreciate your consideration.`
        );
        
        // Navigate to the chat
        navigate(`/app/chat/${referrerId}`);
      } else {
        // Otherwise navigate to the referrals page
        navigate('/app/referrals');
      }
    } catch (error) {
      console.error("Error submitting referral request:", error);
      toast({
        title: "Error",
        description: "Failed to send referral request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request a Referral</DialogTitle>
          <DialogDescription>
            Send a personalized message to request a referral for the {jobTitle} position at {companyName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter the specific role name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobLink">Job Link (Optional)</Label>
            <Input
              id="jobLink"
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              placeholder="LinkedIn or company job posting URL"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobCode">Job ID/Code (Optional)</Label>
            <Input
              id="jobCode"
              value={jobCode}
              onChange={(e) => setJobCode(e.target.value)}
              placeholder="Job ID or reference code"
            />
          </div>
          
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
            <Label htmlFor="message">Personalized Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[180px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !message.trim()}>
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestReferralModal;
