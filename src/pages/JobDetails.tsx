
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Building, DollarSign, Briefcase, Calendar, Clock, Users, User, Star, ArrowLeft, ExternalLink, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import RequestReferralModal from "@/components/RequestReferralModal";

// Mock job data - in a real app this would come from an API
const jobMock = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp",
  companyLogo: "/placeholder.svg",
  companyDescription: "TechCorp is a leading technology company focused on developing innovative solutions for enterprises. With a strong focus on user experience and cutting-edge technology, we're transforming how businesses operate in the digital age.",
  location: "San Francisco, CA",
  salary: "$120K - $150K",
  type: "Full-time",
  experience: "5+ years",
  posted: "2 days ago",
  description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for developing and implementing user interface components using React.js and other frontend technologies. The ideal candidate is proficient in JavaScript, has experience with React.js, and is familiar with responsive design principles.",
  responsibilities: [
    "Develop and implement user interface components using React.js and other frontend technologies",
    "Optimize components for maximum performance across devices and browsers",
    "Collaborate with the design team to implement visual elements",
    "Write clean, maintainable code and perform code reviews",
    "Troubleshoot and debug applications",
    "Stay up-to-date with emerging trends and technologies"
  ],
  requirements: [
    "5+ years of experience in frontend development",
    "Strong proficiency in JavaScript and TypeScript",
    "Experience with React.js and modern frontend frameworks",
    "Knowledge of responsive design principles",
    "Familiarity with RESTful APIs and GraphQL",
    "Understanding of CI/CD pipelines and testing frameworks",
    "Excellent problem-solving skills and attention to detail"
  ],
  benefits: [
    "Competitive salary and equity options",
    "Health, dental, and vision insurance",
    "Unlimited PTO policy",
    "Remote work options",
    "Professional development budget",
    "401(k) matching",
    "Flexible work hours"
  ],
  tags: ["React", "TypeScript", "Tailwind CSS", "Frontend", "JavaScript"],
  referrers: [
    {
      id: "2",
      name: "Jessica Thompson",
      title: "Engineering Manager at TechCorp",
      image: "/placeholder.svg",
      connectionDegree: 1
    },
    {
      id: "3",
      name: "Michael Chen",
      title: "Senior Developer at TechCorp",
      image: "/placeholder.svg",
      connectionDegree: 2
    }
  ]
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // In a real app, we would fetch the job details using the id
  const job = jobMock;
  
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [selectedReferrer, setSelectedReferrer] = useState<typeof job.referrers[0] | null>(null);
  
  const handleRequestReferral = (referrer?: typeof job.referrers[0]) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request a referral.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: `/app/jobs/${id}` } });
      return;
    }
    
    if (referrer) {
      setSelectedReferrer(referrer);
    } else {
      setSelectedReferrer(null);
    }
    
    setIsReferralModalOpen(true);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job link copied to clipboard",
    });
  };
  
  const handleSave = () => {
    toast({
      title: "Job Saved",
      description: "This job has been saved to your profile",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link 
          to="/app/jobs" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to jobs
        </Link>
        
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{job.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <Building className="h-4 w-4 mr-1" />
              <span className="mr-3">{job.company}</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
          </div>
          <div className="flex gap-2 self-start">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Star className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button size="sm" onClick={() => handleRequestReferral()}>Request Referral</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="referrers">Referrers ({job.referrers.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-2">Salary:</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-2">Job Type:</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-2">Experience:</span>
                      <span>{job.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="font-medium mr-2">Posted:</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-slate max-w-none">
                  <p>{job.description}</p>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Responsibilities</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {job.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Requirements</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {job.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-2">Benefits</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {job.benefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="company">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-4 space-y-0 pb-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={job.companyLogo} alt={job.company} />
                    <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{job.company}</CardTitle>
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>{job.companyDescription}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" /> Visit Website
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-2" /> View All Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="referrers">
              <Card>
                <CardHeader>
                  <CardTitle>Available Referrers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.referrers.map((referrer) => (
                    <div key={referrer.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={referrer.image} alt={referrer.name} />
                        <AvatarFallback>{referrer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{referrer.name}</h4>
                        <p className="text-sm text-muted-foreground">{referrer.title}</p>
                        <Badge variant="outline" className="mt-2">
                          <User className="h-3 w-3 mr-1" />
                          {referrer.connectionDegree === 1 ? '1st' : `${referrer.connectionDegree}nd`} connection
                        </Badge>
                      </div>
                      <Button onClick={() => handleRequestReferral(referrer)}>
                        Request Referral
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Request a Referral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Candidates who get a referral are 3x more likely to hear back from recruiters.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg text-sm">
                <p className="font-medium mb-1">About this role:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Users className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{job.referrers.length} referrers available</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>Top rated opportunity</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>Typically responds within 3 days</span>
                  </li>
                </ul>
              </div>
              
              <Button className="w-full" onClick={() => handleRequestReferral()}>
                Request Referral
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                You can request up to 5 referrals per week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Similar Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="group">
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    <Link to="#">Frontend Developer</Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">InnovateTech • Remote</p>
                </div>
                <Separator />
                <div className="group">
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    <Link to="#">React Developer</Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">DesignHub • San Francisco, CA</p>
                </div>
                <Separator />
                <div className="group">
                  <h4 className="font-medium group-hover:text-primary transition-colors">
                    <Link to="#">Senior UI Engineer</Link>
                  </h4>
                  <p className="text-sm text-muted-foreground">TechGiant • New York, NY</p>
                </div>
              </div>
              
              <Button variant="ghost" className="w-full" onClick={() => navigate("/app/jobs")}>
                View More Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Referral Request Modal */}
      <RequestReferralModal
        open={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        jobTitle={job.title}
        company={job.company}
        referrerId={selectedReferrer?.id}
        referrerName={selectedReferrer?.name}
      />
    </div>
  );
};

export default JobDetails;
