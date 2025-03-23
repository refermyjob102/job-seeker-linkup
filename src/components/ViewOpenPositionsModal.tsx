
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Briefcase, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock job data structure
interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  hasReferrers: boolean;
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
    },
    {
      id: `${companyId}-2`,
      title: "Product Manager",
      company: companyName,
      location: "Remote",
      type: "Full-time",
      postedDate: "1 week ago",
      hasReferrers: true,
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
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Open Positions at {companyName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {mockJobs.map((job) => (
            <div 
              key={job.id} 
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
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
                  
                  <Button variant="outline" asChild className="flex-1 sm:flex-none">
                    <Link to={`/app/companies/${companyId}?position=${encodeURIComponent(job.title)}`}>
                      Find Referrers
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOpenPositionsModal;
