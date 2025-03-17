
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ReferralStatus } from "@/features/referrals/data/mockReferrals";

interface UpdateReferralStatusModalProps {
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (status: string, feedback?: string) => void;
  referralId: string;
  applicantName: string;
  jobTitle: string;
}

const UpdateReferralStatusModal = ({
  open,
  onClose,
  onUpdateStatus,
  referralId,
  applicantName,
  jobTitle,
}: UpdateReferralStatusModalProps) => {
  const [status, setStatus] = useState<ReferralStatus>("accepted");
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onUpdateStatus(status, feedback);
      onClose();
      
      // Show success toast
      toast({
        title: "Referral Status Updated",
        description: `You have ${status} the referral for ${applicantName}.`,
        variant: "default",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Referral Status</DialogTitle>
          <DialogDescription>
            Update the status of {applicantName}'s referral request for the {jobTitle} position.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <RadioGroup 
            value={status} 
            onValueChange={setStatus}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem value="accepted" id="accepted" />
              <div className="space-y-1">
                <Label htmlFor="accepted" className="font-medium">
                  Accept Referral
                </Label>
                <p className="text-sm text-muted-foreground">
                  I'll submit this referral to my company's recruiting team.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem value="rejected" id="rejected" />
              <div className="space-y-1">
                <Label htmlFor="rejected" className="font-medium">
                  Decline Referral
                </Label>
                <p className="text-sm text-muted-foreground">
                  I don't think this is a good fit or I'm unable to refer at this time.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem value="needs_info" id="needs_info" />
              <div className="space-y-1">
                <Label htmlFor="needs_info" className="font-medium">
                  Need More Information
                </Label>
                <p className="text-sm text-muted-foreground">
                  I need additional information before making a decision.
                </p>
              </div>
            </div>
          </RadioGroup>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide any additional feedback or requests..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateReferralStatusModal;
