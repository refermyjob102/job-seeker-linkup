import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, MapPin, Building, DollarSign, Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { RequestReferralModal } from "@/components/RequestReferralModal";

// Mock job data
const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120K - $150K",
    salary_min: 120,
    salary_max: 150,
    type: "Full-time",
    posted: "2 days ago",
    description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for developing and implementing user interface components using React.js and other frontend technologies.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    hasReferrer: true,
    company_id: "1"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    location: "New York, NY",
    salary: "$130K - $160K",
    salary_min: 130,
    salary_max: 160,
    type: "Full-time",
    posted: "3 days ago",
    description: "As a Product Manager, you will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product requirements.",
    tags: ["Product Management", "Agile", "B2B"],
    hasReferrer: true,
    company_id: "2"
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignHub",
    location: "Remote",
    salary: "$90K - $120K",
    salary_min: 90,
    salary_max: 120,
    type: "Full-time",
    posted: "1 week ago",
    description: "We are seeking a UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows.",
    tags: ["Figma", "UI/UX", "Wireframing"],
    hasReferrer: false,
    company_id: "3"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Seattle, WA",
    salary: "$140K - $170K",
    salary_min: 140,
    salary_max: 170,
    type: "Full-time",
    posted: "5 days ago",
    description: "We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You will be responsible for deployment, configuration, and management of our services.",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    hasReferrer: true,
    company_id: "4"
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "DataWorks",
    location: "Chicago, IL",
    salary: "$110K - $140K",
    salary_min: 110,
    salary_max: 140,
    type: "Contract",
    posted: "1 week ago",
    description: "We are seeking a skilled Backend Developer to join our engineering team. You will be responsible for server-side web application logic and integration of the work front-end developers do.",
    tags: ["Node.js", "PostgreSQL", "API Development"],
    hasReferrer: false,
    company_id: "5"
  },
  {
    id: 6,
    title: "Marketing Specialist",
    company: "GrowthCo",
    location: "Remote",
    salary: "$80K - $100K",
    salary_min: 80,
    salary_max: 100,
    type: "Part-time",
    posted: "3 days ago",
    description: "We are looking for a Marketing Specialist to develop and implement marketing strategies that support business objectives and drive growth across our digital channels.",
    tags: ["Digital Marketing", "SEO", "Content Strategy"],
    hasReferrer: true,
    company_id: "6"
  },
  {
    id: 7,
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Boston, MA",
    salary: "$130K - $160K",
    salary_min: 130,
    salary_max: 160,
    type: "Full-time",
    posted: "1 week ago",
    description: "As a Data Scientist, you will apply your expertise in data mining, statistical analysis, and building high-quality prediction systems integrated with our products.",
    tags: ["Python", "Machine Learning", "SQL"],
    hasReferrer: true,
    company_id: "7"
  },
  {
    id: 8,
    title: "Technical Project Manager",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120K - $150K",
    salary_min: 120,
    salary_max: 150,
    type: "Full-time",
    posted: "4 days ago",
    description: "We are looking for a Technical Project Manager to plan, execute, and finalize projects according to strict deadlines and within budget. This includes acquiring resources and coordinating the efforts of team members in order to deliver projects according to plan.",
    tags: ["Project Management", "Agile", "Technical Leadership"],
    hasReferrer: true,
    company_id: "1"
  },
];

const JobListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const companyFilter = searchParams.get("company");
  const navigate = useNavigate();
  const { user, isProfileComplete } = useAuth();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobListings);
  const [salaryRange, setSalaryRange] = useState([50, 200]);
  const [referrersOnly, setReferrersOnly] = useState(false);
  const [location, setLocation] = useState("anywhere");
  const [jobTypes, setJobTypes] = useState({
    fulltime: true,
    parttime: false,
    contract: false,
    internship: false
  });
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Apply company filter from URL params (if any)
  useEffect(() => {
    if (companyFilter) {
      setSearchTerm(companyFilter);
      handleFilterJobs();
    }
  }, [companyFilter]);

  const handleJobTypeChange = (type: string, checked: boolean) => {
    setJobTypes(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleFilterJobs = () => {
    let results = jobListings;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply referrers only filter
    if (referrersOnly) {
      results = results.filter(job => job.hasReferrer);
    }
    
    // Apply location filter
    if (location !== "anywhere") {
      results = results.filter(job => {
        if (location === "remote") {
          return job.location.toLowerCase().includes("remote");
        } else if (location === "sf") {
          return job.location.includes("San Francisco");
        } else if (location === "nyc") {
          return job.location.includes("New York");
        } else if (location === "seattle") {
          return job.location.includes("Seattle");
        }
        return true;
      });
    }
    
    // Apply job type filters
    if (!jobTypes.fulltime && !jobTypes.parttime && !jobTypes.contract && !jobTypes.internship) {
      // If no job types are selected, keep all results
    } else {
      results = results.filter(job => {
        const jobType = job.type.toLowerCase();
        return (
          (jobTypes.fulltime && jobType === "full-time") ||
          (jobTypes.parttime && jobType === "part-time") ||
          (jobTypes.contract && jobType === "contract") ||
          (jobTypes.internship && jobType === "internship")
        );
      });
    }
    
    // Apply salary range filter
    results = results.filter(job => 
      job.salary_min <= salaryRange[1] &&
      job.salary_max >= salaryRange[0]
    );
    
    setFilteredJobs(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterJobs();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setReferrersOnly(false);
    setSalaryRange([50, 200]);
    setLocation("anywhere");
    setJobTypes({
      fulltime: true,
      parttime: false,
      contract: false,
      internship: false
    });
    setFilteredJobs(jobListings);
  };

  const handleRequestReferral = (job: any) => {
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

    setSelectedJob(job);
    setReferralModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Job Listings</h1>
        <p className="text-muted-foreground">
          Find your next opportunity and connect with referrers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="md:col-span-1 h-fit">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Job titles, keywords..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Location</h3>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anywhere">Anywhere</SelectItem>
                    <SelectItem value="remote">Remote only</SelectItem>
                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                    <SelectItem value="nyc">New York, NY</SelectItem>
                    <SelectItem value="seattle">Seattle, WA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Job Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fulltime" 
                      checked={jobTypes.fulltime}
                      onCheckedChange={(checked) => handleJobTypeChange('fulltime', checked === true)}
                    />
                    <Label htmlFor="fulltime">Full-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="parttime" 
                      checked={jobTypes.parttime}
                      onCheckedChange={(checked) => handleJobTypeChange('parttime', checked === true)}
                    />
                    <Label htmlFor="parttime">Part-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contract" 
                      checked={jobTypes.contract}
                      onCheckedChange={(checked) => handleJobTypeChange('contract', checked === true)}
                    />
                    <Label htmlFor="contract">Contract</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="internship" 
                      checked={jobTypes.internship}
                      onCheckedChange={(checked) => handleJobTypeChange('internship', checked === true)}
                    />
                    <Label htmlFor="internship">Internship</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Salary Range</h3>
                  <span className="text-sm text-muted-foreground">
                    ${salaryRange[0]}K - ${salaryRange[1]}K
                  </span>
                </div>
                <Slider
                  max={250}
                  min={30}
                  step={5}
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Referrers</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasReferrer" 
                    checked={referrersOnly} 
                    onCheckedChange={(checked) => setReferrersOnly(checked === true)}
                  />
                  <Label htmlFor="hasReferrer">Has available referrers</Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="md:col-span-3 space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="bg-muted flex items-center justify-center p-4 rounded-md h-16 w-16">
                      <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <div className="flex items-center">
                          {job.hasReferrer && (
                            <Badge variant="outline" className="mr-2 text-green-600 bg-green-50 hover:bg-green-50">
                              Referrer Available
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-y-2 gap-x-4 mb-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="text-sm text-muted-foreground">
                          Posted {job.posted}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            variant="outline" 
                            className="flex-1 sm:flex-initial"
                            onClick={() => navigate(`/app/jobs/${job.id}`)}
                          >
                            View Details
                          </Button>
                          <Button 
                            className="flex-1 sm:flex-initial"
                            onClick={() => handleRequestReferral(job)}
                          >
                            Request Referral
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={handleClearFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {selectedJob && (
        <RequestReferralModal 
          open={referralModalOpen} 
          onOpenChange={setReferralModalOpen}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          companyId={selectedJob.company_id}
          companyName={selectedJob.company}
        />
      )}
    </div>
  );
};

export default JobListings;
