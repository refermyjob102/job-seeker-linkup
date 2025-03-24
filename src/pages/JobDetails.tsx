
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import RequestReferralModal from "@/components/RequestReferralModal";

// Temporary job data before we implement real data fetching
const tempJobData = {
  id: "1",
  title: "Senior Frontend Developer",
  company: "TechCorp",
  company_id: "1",
  location: "San Francisco, CA (Remote)",
  type: "Full-time",
  experience_level: "Senior",
  salary_min: 120000,
  salary_max: 150000,
  posted_date: "2023-05-15",
  expires_at: "2023-06-15",
  apply_url: "https://example.com/apply",
  description: "TechCorp is looking for a Senior Frontend Developer to join our growing team. You will be responsible for building user interfaces for our web applications, ensuring they are responsive, accessible, and performant.",
  responsibilities: [
    "Build responsive user interfaces using React and TypeScript",
    "Collaborate with UX/UI designers to implement designs",
    "Write clean, maintainable, and efficient code",
    "Perform code reviews and mentor junior developers",
    "Optimize applications for maximum speed and scalability",
  ],
  requirements: [
    "5+ years of experience with frontend development",
    "Strong proficiency in JavaScript, HTML, and CSS",
    "Experience with React, Redux, and TypeScript",
    "Familiarity with modern frontend build pipelines and tools",
    "Understanding of cross-browser compatibility issues and solutions",
  ],
  benefits: [
    "Competitive salary and equity",
    "Health, dental, and vision insurance",
    "Unlimited PTO",
    "Remote work flexibility",
    "Professional development budget",
  ],
  referrers_count: 5,
  has_applied: false,
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isProfileComplete } = useAuth();
  const { toast } = useToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [savedJob, setSavedJob] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch this from the API
        // For now, we'll use the tempJobData
        setTimeout(() => {
          setJob({...tempJobData, id});
          setLoading(false);
        }, 500);

        // This is how the actual implementation would look:
        /*
        const { data, error } = await supabase
          .from('job_listings')
          .select(`
            *,
            companies(id, name, logo_url, location)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);
        */
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id, toast]);

  const handleRequestReferral = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to request a referral",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!isProfileComplete()) {
      toast({
        title: "Complete your profile",
        description: "Please complete your profile before requesting a referral",
        variant: "destructive",
      });
      navigate("/app/profile");
      return;
    }

    setReferralModalOpen(true);
  };

  const handleApplyDirectly = () => {
    if (!job?.apply_url) {
      toast({
        title: "Application link unavailable",
        description: "The direct application link for this job is not available.",
      });
      return;
    }
    
    // Open the application URL in a new tab
    window.open(job.apply_url, "_blank", "noopener,noreferrer");
    
    toast({
      title: "Application started",
      description: "You've been redirected to the company's application page.",
    });
  };

  const toggleSaveJob = () => {
    setSavedJob(!savedJob);
    toast({
      title: savedJob ? "Job removed from saved jobs" : "Job saved successfully",
      description: savedJob 
        ? "The job has been removed from your saved jobs" 
        : "The job has been added to your saved jobs",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The job listing you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/app/jobs">Back to Job Listings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Link to="/app/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Jobs
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium truncate">{job.title}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-xl sm:text-2xl">{job.title}</CardTitle>
                <div className="flex items-center mt-2">
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  <CardDescription className="text-base">
                    <Link to={`/app/companies/${job.company_id}`} className="hover:text-primary">
                      {job.company}
                    </Link>
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={toggleSaveJob}
                  className={savedJob ? "text-primary" : ""}
                >
                  <Star className="h-4 w-4" fill={savedJob ? "currentColor" : "none"} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <p className="text-sm">{job.location}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Job Type</p>
                  <div className="flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <p className="text-sm">{job.type}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Experience</p>
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <p className="text-sm">{job.experience_level}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Salary</p>
                  <div className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <p className="text-sm">${job.salary_min/1000}K - ${job.salary_max/1000}K</p>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3">Description</h3>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply for this position</CardTitle>
              <CardDescription>
                Get a referral to increase your chances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Posted on {job.posted_date}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Applications close on {job.expires_at}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {job.referrers_count} {job.referrers_count === 1 ? 'referrer' : 'referrers'} available
                </span>
              </div>
              
              <div className="pt-2 space-y-2">
                <Button className="w-full" onClick={handleRequestReferral}>
                  Request Referral
                </Button>
                <Button variant="outline" className="w-full" onClick={handleApplyDirectly}>
                  Apply Directly
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="bg-muted h-16 w-16 flex items-center justify-center rounded-md">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href="#" className="text-primary hover:underline">company-website.com</a>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/app/companies/${job.company_id}`}>
                  View Company Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <h4 className="font-medium text-sm">Frontend Developer</h4>
                  <p className="text-xs text-muted-foreground">WebDesign Corp • Remote</p>
                </div>
                <div className="border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <h4 className="font-medium text-sm">Senior UI Engineer</h4>
                  <p className="text-xs text-muted-foreground">TechGiant • New York, NY</p>
                </div>
                <div className="border rounded-md p-3 hover:bg-accent/50 transition-colors cursor-pointer">
                  <h4 className="font-medium text-sm">React Developer</h4>
                  <p className="text-xs text-muted-foreground">StartupNow • San Francisco, CA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <RequestReferralModal 
        open={referralModalOpen} 
        onOpenChange={setReferralModalOpen}
        jobId={job.id}
        jobTitle={job.title}
        companyId={job.company_id}
        companyName={job.company}
      />
    </div>
  );
};

export default JobDetails;
