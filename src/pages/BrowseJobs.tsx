
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Search, BriefcaseIcon, FilterIcon, MapPinIcon, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BrowseJobs = () => {
  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120,000 - $150,000",
      posted: "2 days ago",
      tags: ["React", "TypeScript", "Tailwind CSS"],
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "DataSystems",
      location: "Remote",
      type: "Full-time",
      salary: "$130,000 - $160,000",
      posted: "1 week ago",
      tags: ["Node.js", "Python", "AWS"],
    },
    {
      id: 3,
      title: "Product Manager",
      company: "InnovateTech",
      location: "New York, NY",
      type: "Full-time",
      salary: "$110,000 - $140,000",
      posted: "3 days ago",
      tags: ["Agile", "Product Strategy", "Analytics"],
    },
    {
      id: 4,
      title: "UX/UI Designer",
      company: "CreativeMinds",
      location: "Chicago, IL",
      type: "Contract",
      salary: "$90,000 - $120,000",
      posted: "Just now",
      tags: ["Figma", "User Research", "UI Design"],
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudSolutions",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$125,000 - $155,000",
      posted: "4 days ago",
      tags: ["Kubernetes", "Docker", "CI/CD"],
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "Analytics Co",
      location: "Boston, MA",
      type: "Full-time",
      salary: "$115,000 - $145,000",
      posted: "2 weeks ago",
      tags: ["Python", "ML", "Big Data"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building className="w-6 h-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">JobReferral</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">Browse Jobs</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Browse through thousands of job opportunities from top companies. Use referrals to increase your chances of getting hired.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-muted/30 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Input 
                  placeholder="Job title, keywords, or company" 
                  className="pl-10" 
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Input 
                  placeholder="Location" 
                  className="pl-10" 
                />
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="flex items-center">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline" size="sm">
                  Remote Only
                </Button>
                <Button variant="outline" size="sm">
                  Posted Today
                </Button>
              </div>
              <Button>Search Jobs</Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">Showing {jobs.length} jobs</p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
                <SelectItem value="salary-low">Lowest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold mr-3">{job.title}</h3>
                        <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                          {job.type}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{job.company}</span> • {job.location}
                      </div>
                      <div className="text-muted-foreground mb-4">
                        <span className="font-medium text-foreground">{job.salary}</span> • Posted {job.posted}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center md:items-end">
                      <Link to="/login" state={{ from: `/app/jobs/${job.id}` }}>
                        <Button className="w-full md:w-auto mb-2">View Details</Button>
                      </Link>
                      <p className="text-sm text-muted-foreground text-center md:text-right">
                        Sign in to see referrals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">4</Button>
              <Button variant="outline" size="sm">5</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 px-4 border-t mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 JobReferral. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
              <Link to="/why-refer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why Refer</Link>
              <Link to="/rewards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rewards</Link>
              <Link to="/partners" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrowseJobs;
