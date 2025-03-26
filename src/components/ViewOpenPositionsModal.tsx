
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BadgeCheck, Briefcase, ChevronDown, ChevronUp, MapPin, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RequestReferralModal from "@/components/RequestReferralModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Mock job data structure
interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  hasReferrers: boolean;
  referrers?: Referrer[];
}

interface Referrer {
  id: string;
  name: string;
  avatar?: string;
  jobTitle: string;
  department: string;
}

interface ViewOpenPositionsModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}

const ViewOpenPositionsModal = ({
  open,
  onClose,
  companyId,
  companyName,
}: ViewOpenPositionsModalProps) => {
  // State for managing referral request modal
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<{id: string, name: string} | null>(null);
  const [selectedJob, setSelectedJob] = useState<{id: string, title: string} | null>(null);
  const { toast } = useToast();
  
  // Mock job data - in a real app, this would come from an API call
  const mockJobs: JobOpening[] = [
    {
      id: `${companyId}-1`,
      title: "Senior Software Engineer",
      company: companyName,
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "2 days ago",
      hasReferrers: true,
      referrers: [
        {
          id: "ref1",
          name: "John Doe",
          avatar: "/placeholder.svg",
          jobTitle: "Lead Engineer",
          department: "Engineering"
        },
        {
          id: "ref2",
          name: "Jane Smith",
          avatar: "/placeholder.svg",
          jobTitle: "Senior Developer",
          department: "Engineering"
        },
        {
          id: "ref3",
          name: "Alex Johnson",
          avatar: "/placeholder.svg",
          jobTitle: "Engineering Manager",
          department: "Engineering"
        }
      ]
    },
    {
      id: `${companyId}-2`,
      title: "Product Manager",
      company: companyName,
      location: "Remote",
      type: "Full-time",
      postedDate: "1 week ago",
      hasReferrers: true,
      referrers: [
        {
          id: "ref4",
          name: "Michael Brown",
          avatar: "/placeholder.svg",
          jobTitle: "Director of Product",
          department: "Product"
        },
        {
          id: "ref5",
          name: "Sara Wilson",
          avatar: "/placeholder.svg",
          jobTitle: "Senior Product Manager",
          department: "Product"
        }
      ]
    },
    {
      id: `${companyId}-3`,
      title: "UX Designer",
      company: companyName,
      location: "New York, NY",
      type: "Full-time",
      postedDate: "3 days ago",
      hasReferrers: false,
    },
    {
      id: `${companyId}-4`,
      title: "Data Scientist",
      company: companyName,
      location: "Remote",
      type: "Contract",
      postedDate: "5 days ago",
      hasReferrers: true,
      referrers: [
        {
          id: "ref6",
          name: "David Lee",
          avatar: "/placeholder.svg",
          jobTitle: "Lead Data Scientist",
          department: "Data Science"
        }
      ]
    },
  ];

  // State to track which job cards are expanded to show referrers
  const [expandedJobs, setExpandedJobs] = useState<string[]>([]);

  // Toggle job expansion to show/hide referrers
  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  // Check if a job is expanded
  const isJobExpanded = (jobId: string) => expandedJobs.includes(jobId);
  
  // Handle opening the referral request modal
  const handleRequestReferral = (job: {id: string, title: string}, referrer: {id: string, name: string}) => {
    setSelectedJob(job);
    setSelectedReferrer(referrer);
    setReferralModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Open Positions at {companyName}</DialogTitle>
            <DialogDescription>
              View available job opportunities and connect with potential referrers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {mockJobs.map((job) => (
              <div 
                key={job.id} 
                className="border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      {job.hasReferrers && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Has Referrers
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Posted {job.postedDate}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button asChild className="flex-1 sm:flex-none">
                        <Link to={`/app/jobs/${job.id}`}>
                          View Details
                        </Link>
                      </Button>
                      
                      {job.hasReferrers ? (
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-none"
                          onClick={() => toggleJobExpansion(job.id)}
                        >
                          {isJobExpanded(job.id) ? (
                            <>Hide Referrers <ChevronUp className="ml-1 h-4 w-4" /></>
                          ) : (
                            <>Find Referrers <ChevronDown className="ml-1 h-4 w-4" /></>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1 sm:flex-none" disabled>
                          No Referrers Available
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Referrers section - displayed when expanded */}
                {isJobExpanded(job.id) && job.referrers && job.referrers.length > 0 && (
                  <div className="bg-muted/30 px-4 py-3 rounded-b-lg">
                    <Separator className="mb-3" />
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" /> 
                      Available Referrers ({job.referrers.length})
                    </h4>
                    <div className="space-y-3">
                      {job.referrers.map((referrer) => (
                        <div key={referrer.id} className="bg-background p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={referrer.avatar} alt={referrer.name} />
                              <AvatarFallback>{referrer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{referrer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {referrer.jobTitle} • {referrer.department}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                              className="flex-1 sm:flex-none"
                            >
                              <Link to={`/app/members/${referrer.id}`}>
                                View Profile
                              </Link>
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1 sm:flex-none"
                              onClick={() => handleRequestReferral({id: job.id, title: job.title}, {id: referrer.id, name: referrer.name})}
                            >
                              Request Referral
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Referral Request Modal */}
      {referralModalOpen && selectedReferrer && selectedJob && (
        <RequestReferralModal
          open={referralModalOpen}
          onOpenChange={setReferralModalOpen}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          companyId={companyId}
          companyName={companyName}
          referrerId={selectedReferrer.id}
          referrerName={selectedReferrer.name}
        />
      )}
    </>
  );
};

export default ViewOpenPositionsModal;
