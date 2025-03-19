
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Building, 
  DollarSign, 
  Star, 
  Filter, 
  Award,
  Clock,
  Calendar,
  X,
  ChevronDown
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import RequestReferralModal from "@/components/RequestReferralModal";

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
    posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: "We are looking for an experienced Frontend Developer to join our team. You will be responsible for developing and implementing user interface components using React.js and other frontend technologies.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    experience_level: "Senior",
    remote: false,
    domain: "Technology",
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
    posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    description: "As a Product Manager, you will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product requirements.",
    tags: ["Product Management", "Agile", "B2B"],
    experience_level: "Mid-level",
    remote: false,
    domain: "Product",
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
    posted_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: "We are seeking a UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows.",
    tags: ["Figma", "UI/UX", "Wireframing"],
    experience_level: "Mid-level",
    remote: true,
    domain: "Design",
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
    posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: "We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You will be responsible for deployment, configuration, and management of our services.",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    experience_level: "Senior",
    remote: false,
    domain: "Engineering",
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
    posted_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    description: "We are seeking a skilled Backend Developer to join our engineering team. You will be responsible for server-side web application logic and integration of the work front-end developers do.",
    tags: ["Node.js", "PostgreSQL", "API Development"],
    experience_level: "Mid-level",
    remote: false,
    domain: "Engineering",
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
    posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    description: "We are looking for a Marketing Specialist to develop and implement marketing strategies that support business objectives and drive growth across our digital channels.",
    tags: ["Digital Marketing", "SEO", "Content Strategy"],
    experience_level: "Entry-level",
    remote: true,
    domain: "Marketing",
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
    posted_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    description: "As a Data Scientist, you will apply your expertise in data mining, statistical analysis, and building high-quality prediction systems integrated with our products.",
    tags: ["Python", "Machine Learning", "SQL"],
    experience_level: "Senior",
    remote: false,
    domain: "Data Science",
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
    posted_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    description: "We are looking for a Technical Project Manager to plan, execute, and finalize projects according to strict deadlines and within budget. This includes acquiring resources and coordinating the efforts of team members in order to deliver projects according to plan.",
    tags: ["Project Management", "Agile", "Technical Leadership"],
    experience_level: "Senior",
    remote: false,
    domain: "Management",
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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobListings);
  const [salaryRange, setSalaryRange] = useState([50, 200]);
  const [referrersOnly, setReferrersOnly] = useState(false);
  const [location, setLocation] = useState("anywhere");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [postedWithin, setPostedWithin] = useState("any");
  const [experienceLevels, setExperienceLevels] = useState({
    entry: false,
    mid: true,
    senior: true,
    executive: false
  });
  const [domains, setDomains] = useState({
    technology: true,
    engineering: true,
    product: true,
    design: true,
    marketing: false,
    data: false,
    management: false
  });
  const [jobTypes, setJobTypes] = useState({
    fulltime: true,
    parttime: false,
    contract: false,
    internship: false
  });
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [view, setView] = useState("grid");

  // Apply company filter from URL params (if any)
  useEffect(() => {
    if (companyFilter) {
      setSearchTerm(companyFilter);
      handleFilterJobs();
    }
  }, [companyFilter]);

  const toggleFilter = (type: string, value: string, checked: boolean) => {
    if (type === 'jobType') {
      setJobTypes(prev => ({
        ...prev,
        [value]: checked
      }));
    } else if (type === 'experienceLevel') {
      setExperienceLevels(prev => ({
        ...prev,
        [value]: checked
      }));
    } else if (type === 'domain') {
      setDomains(prev => ({
        ...prev,
        [value]: checked
      }));
    }
  };

  const handleFilterJobs = () => {
    let results = jobListings;
    const activeFiltersList: string[] = [];
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      activeFiltersList.push(`Search: "${searchTerm}"`);
    }
    
    // Apply referrers only filter
    if (referrersOnly) {
      results = results.filter(job => job.hasReferrer);
      activeFiltersList.push("Has Referrers");
    }
    
    // Apply remote only filter
    if (remoteOnly) {
      results = results.filter(job => job.remote === true);
      activeFiltersList.push("Remote Only");
    }
    
    // Apply location filter
    if (location !== "anywhere") {
      results = results.filter(job => {
        if (location === "sf") {
          return job.location.includes("San Francisco");
        } else if (location === "nyc") {
          return job.location.includes("New York");
        } else if (location === "seattle") {
          return job.location.includes("Seattle");
        } else if (location === "boston") {
          return job.location.includes("Boston");
        } else if (location === "chicago") {
          return job.location.includes("Chicago");
        }
        return true;
      });
      let locationName = "";
      switch(location) {
        case "sf": locationName = "San Francisco"; break;
        case "nyc": locationName = "New York"; break;
        case "seattle": locationName = "Seattle"; break;
        case "boston": locationName = "Boston"; break;
        case "chicago": locationName = "Chicago"; break;
        default: locationName = location;
      }
      activeFiltersList.push(`Location: ${locationName}`);
    }
    
    // Apply "posted within" filter
    if (postedWithin !== "any") {
      const now = new Date();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      results = results.filter(job => {
        const jobDate = job.posted_date;
        const diffTime = Math.abs(now.getTime() - jobDate.getTime());
        const diffDays = Math.ceil(diffTime / dayInMs);
        
        if (postedWithin === "day") return diffDays <= 1;
        if (postedWithin === "week") return diffDays <= 7;
        if (postedWithin === "month") return diffDays <= 30;
        return true;
      });
      
      let periodName = "";
      switch(postedWithin) {
        case "day": periodName = "Past 24 hours"; break;
        case "week": periodName = "Past week"; break;
        case "month": periodName = "Past month"; break;
      }
      activeFiltersList.push(`Posted: ${periodName}`);
    }
    
    // Apply experience level filters
    const selectedExperienceLevels = Object.entries(experienceLevels)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => {
        switch(level) {
          case "entry": return "Entry-level";
          case "mid": return "Mid-level";
          case "senior": return "Senior";
          case "executive": return "Executive";
          default: return level;
        }
      });
      
    if (selectedExperienceLevels.length > 0 && selectedExperienceLevels.length < 4) {
      results = results.filter(job => selectedExperienceLevels.includes(job.experience_level));
      activeFiltersList.push(`Experience: ${selectedExperienceLevels.join(", ")}`);
    }
    
    // Apply domain filters
    const selectedDomains = Object.entries(domains)
      .filter(([_, isSelected]) => isSelected)
      .map(([domain]) => {
        switch(domain) {
          case "technology": return "Technology";
          case "engineering": return "Engineering";
          case "product": return "Product";
          case "design": return "Design";
          case "marketing": return "Marketing";
          case "data": return "Data Science";
          case "management": return "Management";
          default: return domain;
        }
      });
      
    if (selectedDomains.length > 0 && selectedDomains.length < 7) {
      results = results.filter(job => selectedDomains.includes(job.domain));
      activeFiltersList.push(`Domain: ${selectedDomains.join(", ")}`);
    }
    
    // Apply job type filters
    const selectedJobTypes = Object.entries(jobTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => {
        switch(type) {
          case "fulltime": return "Full-time";
          case "parttime": return "Part-time";
          case "contract": return "Contract";
          case "internship": return "Internship";
          default: return type;
        }
      });
      
    if (selectedJobTypes.length > 0 && selectedJobTypes.length < 4) {
      results = results.filter(job => selectedJobTypes.includes(job.type));
      activeFiltersList.push(`Job Type: ${selectedJobTypes.join(", ")}`);
    }
    
    // Apply salary range filter
    results = results.filter(job => 
      job.salary_min <= salaryRange[1] &&
      job.salary_max >= salaryRange[0]
    );
    
    if (salaryRange[0] > 50 || salaryRange[1] < 200) {
      activeFiltersList.push(`Salary: $${salaryRange[0]}K - $${salaryRange[1]}K`);
    }
    
    setFilteredJobs(results);
    setActiveFilters(activeFiltersList);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterJobs();
    setMobileFiltersOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setReferrersOnly(false);
    setRemoteOnly(false);
    setSalaryRange([50, 200]);
    setLocation("anywhere");
    setPostedWithin("any");
    setExperienceLevels({
      entry: false,
      mid: true,
      senior: true,
      executive: false
    });
    setDomains({
      technology: true,
      engineering: true,
      product: true,
      design: true,
      marketing: false,
      data: false,
      management: false
    });
    setJobTypes({
      fulltime: true,
      parttime: false,
      contract: false,
      internship: false
    });
    setFilteredJobs(jobListings);
    setActiveFilters([]);
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Job Listings</h1>
        <p className="text-muted-foreground">
          Find your next opportunity and connect with referrers
        </p>
      </div>

      {/* Mobile Filters Button */}
      <div className="md:hidden">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* View Switcher and Active Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Tabs value={view} onValueChange={setView} className="w-[200px]">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {filter}
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-7 px-2">
              <X className="h-3 w-3 mr-1" /> Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <Card className={`md:col-span-1 h-fit ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
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
                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox 
                    id="remoteOnly" 
                    checked={remoteOnly}
                    onCheckedChange={(checked) => setRemoteOnly(checked === true)}
                  />
                  <Label htmlFor="remoteOnly">Remote only</Label>
                </div>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anywhere">Anywhere</SelectItem>
                    <SelectItem value="sf">San Francisco, CA</SelectItem>
                    <SelectItem value="nyc">New York, NY</SelectItem>
                    <SelectItem value="seattle">Seattle, WA</SelectItem>
                    <SelectItem value="boston">Boston, MA</SelectItem>
                    <SelectItem value="chicago">Chicago, IL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Experience Level</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="entry" 
                      checked={experienceLevels.entry}
                      onCheckedChange={(checked) => toggleFilter('experienceLevel', 'entry', checked === true)}
                    />
                    <Label htmlFor="entry">Entry-level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="mid" 
                      checked={experienceLevels.mid}
                      onCheckedChange={(checked) => toggleFilter('experienceLevel', 'mid', checked === true)}
                    />
                    <Label htmlFor="mid">Mid-level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="senior" 
                      checked={experienceLevels.senior}
                      onCheckedChange={(checked) => toggleFilter('experienceLevel', 'senior', checked === true)}
                    />
                    <Label htmlFor="senior">Senior</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="executive" 
                      checked={experienceLevels.executive}
                      onCheckedChange={(checked) => toggleFilter('experienceLevel', 'executive', checked === true)}
                    />
                    <Label htmlFor="executive">Executive</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Posted Within</h3>
                <Select value={postedWithin} onValueChange={setPostedWithin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="day">Past 24 hours</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
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
                      onCheckedChange={(checked) => toggleFilter('jobType', 'fulltime', checked === true)}
                    />
                    <Label htmlFor="fulltime">Full-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="parttime" 
                      checked={jobTypes.parttime}
                      onCheckedChange={(checked) => toggleFilter('jobType', 'parttime', checked === true)}
                    />
                    <Label htmlFor="parttime">Part-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="contract" 
                      checked={jobTypes.contract}
                      onCheckedChange={(checked) => toggleFilter('jobType', 'contract', checked === true)}
                    />
                    <Label htmlFor="contract">Contract</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="internship" 
                      checked={jobTypes.internship}
                      onCheckedChange={(checked) => toggleFilter('jobType', 'internship', checked === true)}
                    />
                    <Label htmlFor="internship">Internship</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Domain</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="technology" 
                      checked={domains.technology}
                      onCheckedChange={(checked) => toggleFilter('domain', 'technology', checked === true)}
                    />
                    <Label htmlFor="technology">Technology</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="engineering" 
                      checked={domains.engineering}
                      onCheckedChange={(checked) => toggleFilter('domain', 'engineering', checked === true)}
                    />
                    <Label htmlFor="engineering">Engineering</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="product" 
                      checked={domains.product}
                      onCheckedChange={(checked) => toggleFilter('domain', 'product', checked === true)}
                    />
                    <Label htmlFor="product">Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="design" 
                      checked={domains.design}
                      onCheckedChange={(checked) => toggleFilter('domain', 'design', checked === true)}
                    />
                    <Label htmlFor="design">Design</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="marketing" 
                      checked={domains.marketing}
                      onCheckedChange={(checked) => toggleFilter('domain', 'marketing', checked === true)}
                    />
                    <Label htmlFor="marketing">Marketing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="data" 
                      checked={domains.data}
                      onCheckedChange={(checked) => toggleFilter('domain', 'data', checked === true)}
                    />
                    <Label htmlFor="data">Data Science</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="management" 
                      checked={domains.management}
                      onCheckedChange={(checked) => toggleFilter('domain', 'management', checked === true)}
                    />
                    <Label htmlFor="management">Management</Label>
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

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="md:col-span-3 space-y-4">
          {filteredJobs.length > 0 ? (
            <>
              {view === "grid" ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="card-hover h-full">
                      <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-muted flex items-center justify-center p-3 rounded-md h-12 w-12">
                            <Building className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                            <div className="text-muted-foreground text-sm">{job.company}</div>
                          </div>
                          {job.hasReferrer && (
                            <Badge variant="outline" className="text-green-600 bg-green-50 hover:bg-green-50 whitespace-nowrap">
                              Referrer Available
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {job.type}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            {job.experience_level}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {job.posted}
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
                        
                        <div className="mt-auto pt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => navigate(`/app/jobs/${job.id}`)}
                          >
                            View Details
                          </Button>
                          <Button 
                            className="flex-1"
                            onClick={() => handleRequestReferral(job)}
                          >
                            Request Referral
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="card-hover">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="bg-muted flex items-center justify-center p-4 rounded-md h-16 w-16 mx-auto md:mx-0">
                            <Building className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2 text-center md:text-left">
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <div className="flex items-center justify-center md:justify-end">
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
                            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 mb-3 text-sm text-muted-foreground">
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
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-1" />
                                {job.experience_level}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {job.posted}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-center md:text-left">
                              {job.description}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
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
                  ))}
                </div>
              )}
            </>
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
