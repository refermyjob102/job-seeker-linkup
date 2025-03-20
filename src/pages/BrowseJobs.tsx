import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BrowseJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hasReferrers, setHasReferrers] = useState(false);
  const [activeJobs, setActiveJobs] = useState(false);
  const [companies, setCompanies] = useState([
    {
      id: "1",
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
      description: "A multinational technology company specializing in internet-related services and products.",
      industry: "Technology",
      size: "1000+",
      location: "Mountain View, CA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "2",
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
      description: "A technology corporation that develops, manufactures, licenses, supports, and sells computer software.",
      industry: "Technology",
      size: "1000+",
      location: "Redmond, WA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "3",
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
      description: "An American multinational technology company focused on e-commerce, cloud computing, digital streaming.",
      industry: "E-commerce",
      size: "1000+",
      location: "Seattle, WA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "4",
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png",
      description: "An American multinational technology company that designs, develops, and sells consumer electronics.",
      industry: "Technology",
      size: "1000+",
      location: "Cupertino, CA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "5",
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Netflix_logo.svg/800px-Netflix_logo.svg.png",
      description: "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries.",
      industry: "Entertainment",
      size: "1000+",
      location: "Los Gatos, CA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "6",
      name: "Tesla",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_logo.svg/800px-Tesla_T_logo.svg.png",
      description: "An automotive and energy company that designs, manufactures, and sells electric vehicles, battery energy storage.",
      industry: "Automotive",
      size: "1000+",
      location: "Austin, TX",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "7",
      name: "SpaceX",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/SpaceX_Logo.svg/640px-SpaceX_Logo.svg.png",
      description: "An aerospace manufacturer and space transportation services company.",
      industry: "Aerospace",
      size: "1000+",
      location: "Hawthorne, CA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "8",
      name: "Airbnb",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png",
      description: "An online marketplace that connects people who want to rent out their homes with people who are looking for accommodations.",
      industry: "Travel",
      size: "500-1000",
      location: "San Francisco, CA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "9",
      name: "Uber",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png",
      description: "A transportation network company that offers ride-hailing, food delivery, and other services.",
      industry: "Transportation",
      size: "1000+",
      location: "San Francisco, CA",
      hasReferrers: true,
      activeJobs: true,
    },
    {
      id: "10",
      name: "Lyft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Lyft_logo.svg/2560px-Lyft_logo.svg.png",
      description: "A transportation network company that offers ride-hailing services.",
      industry: "Transportation",
      size: "500-1000",
      location: "San Francisco, CA",
      hasReferrers: true,
      activeJobs: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const industries = [...new Set(companies.map((company) => company.industry))];
  const companySizes = ["1-50", "50-200", "200-500", "500-1000", "1000+"];
  const locations = [...new Set(companies.map((company) => company.location))];

  const filteredCompanies = companies.filter((company) => {
    const searchMatch = company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const industryMatch = selectedIndustry ? company.industry === selectedIndustry : true;
    const sizeMatch = selectedSize ? company.size === selectedSize : true;
    const locationMatch = selectedLocation ? company.location === selectedLocation : true;
    const referrersMatch = hasReferrers ? company.hasReferrers : true;
    const jobsMatch = activeJobs ? company.activeJobs : true;

    return searchMatch && industryMatch && sizeMatch && locationMatch && referrersMatch && jobsMatch;
  });
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Companies</h1>
        <p className="text-muted-foreground">Find companies with employees who can refer you</p>
      </div>
      
      {/* Search & Filters - Updated for mobile */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-4 gap-6'} mb-8`}>
        <div className={`${isMobile ? 'col-span-1' : 'col-span-3'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search companies..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className={`${isMobile ? 'col-span-1 grid grid-cols-2 gap-2' : 'flex space-x-2'}`}>
          <Select
            value={selectedIndustry}
            onValueChange={setSelectedIndustry}
          >
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedSize}
            onValueChange={setSelectedSize}
          >
            <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
              <SelectValue placeholder="Company Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Size</SelectItem>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Additional Filters - Responsive for mobile */}
      <div className={`mb-8 ${isMobile ? 'grid grid-cols-1 gap-4 sm:grid-cols-2' : 'flex flex-wrap gap-2'}`}>
        <Select
          value={selectedLocation}
          onValueChange={setSelectedLocation}
        >
          <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'}`}>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Location</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className={`flex items-center ${isMobile ? 'justify-between' : 'ml-4'}`}>
          <Checkbox
            id="hasReferrers"
            checked={hasReferrers}
            onCheckedChange={(checked) => {
              setHasReferrers(checked === true);
            }}
          />
          <Label
            htmlFor="hasReferrers"
            className="ml-2 text-sm font-medium leading-none cursor-pointer"
          >
            Has active referrers
          </Label>
        </div>
        
        <div className={`flex items-center ${isMobile ? 'justify-between' : 'ml-4'}`}>
          <Checkbox
            id="activeJobs"
            checked={activeJobs}
            onCheckedChange={(checked) => {
              setActiveJobs(checked === true);
            }}
          />
          <Label
            htmlFor="activeJobs"
            className="ml-2 text-sm font-medium leading-none cursor-pointer"
          >
            Active job openings
          </Label>
        </div>
      </div>
      
      {/* Companies Grid - Responsive for all devices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center">
            Loading companies...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center">
            No companies found matching your criteria.
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>{company.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={company.logo} alt={company.name} className="h-20 w-auto mb-4" />
                <p>Industry: {company.industry}</p>
                <p>Size: {company.size}</p>
                <p>Location: {company.location}</p>
              </CardContent>
              <Button asChild>
                <Link to={`/company/${company.id}`}>View Details</Link>
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
