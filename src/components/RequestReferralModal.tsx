import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface RequestReferralModalProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  referrerId?: string;
  referrerName?: string;
}

const RequestReferralModal = ({
  open,
  onClose,
  jobTitle,
  company,
  referrerId,
  referrerName,
}: RequestReferralModalProps) => {
  const [message, setMessage] = useState(
    `Hi${referrerName ? ` ${referrerName}` : ""},\n\nI'm interested in the ${jobTitle} position at ${company}. I believe my skills and experience make me a good fit for this role. Would you be willing to refer me?\n\nThank you for considering my request.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      
      // Show success toast
      toast({
        title: "Referral Request Sent",
        description: `Your request has been sent to ${referrerName || "the referrer"}.`,
        variant: "default",
      });

      // If we have a referrer ID, navigate to chat with them
      if (referrerId) {
        navigate(`/app/chat/${referrerId}`);
      } else {
        // Otherwise navigate to the referrals page
        navigate('/app/referrals');
      }
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a Referral</DialogTitle>
          <DialogDescription>
            Send a personalized message to request a referral for the {jobTitle} position at {company}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            className="min-h-[200px]"
          />
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

export default RequestReferralModal;
