
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, MapPin, Search, Star, Users, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock companies data
const companyData = [
  {
    id: "1",
    name: "Google",
    logo: "/placeholder.svg",
    description: "Google is a multinational technology company specializing in Internet-related services and products.",
    industry: "Technology",
    location: "Mountain View, CA",
    employees: "100,000+",
    referrers: 28,
    jobOpenings: 124,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Meta",
    logo: "/placeholder.svg",
    description: "Meta Platforms, Inc., doing business as Meta, is an American multinational technology conglomerate.",
    industry: "Technology",
    location: "Menlo Park, CA",
    employees: "50,000+",
    referrers: 19,
    jobOpenings: 87,
    isFeatured: true,
  },
  {
    id: "3",
    name: "Apple",
    logo: "/placeholder.svg",
    description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
    industry: "Technology",
    location: "Cupertino, CA",
    employees: "150,000+",
    referrers: 32,
    jobOpenings: 156,
    isFeatured: true,
  },
  {
    id: "4",
    name: "Amazon",
    logo: "/placeholder.svg",
    description: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.",
    industry: "E-commerce, Technology",
    location: "Seattle, WA",
    employees: "1,500,000+",
    referrers: 47,
    jobOpenings: 203,
    isFeatured: false,
  },
  {
    id: "5",
    name: "Microsoft",
    logo: "/placeholder.svg",
    description: "Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, personal computers, and related services.",
    industry: "Technology",
    location: "Redmond, WA",
    employees: "180,000+",
    referrers: 38,
    jobOpenings: 179,
    isFeatured: false,
  },
];

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(companyData);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim() === "") {
      setFilteredCompanies(companyData);
      return;
    }
    
    const results = companyData.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCompanies(results);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Companies</h1>
        <p className="text-muted-foreground">
          Find companies and connect with referrers
        </p>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies by name, industry, or location..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Featured Companies */}
        {searchTerm === "" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Featured Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {companyData.filter(company => company.isFeatured).map((company) => (
                <Card key={company.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-24 bg-muted flex items-center justify-center">
                      <Building className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{company.name}</h3>
                        <Button variant="ghost" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {company.location}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{company.industry}</Badge>
                        <Badge variant="secondary">
                          <Users className="h-3 w-3 mr-1" />
                          {company.referrers} Referrers
                        </Badge>
                      </div>
                      <Button className="w-full" asChild>
                        <Link to={`/app/companies/${company.id}`}>
                          View Company
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Companies or Search Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {searchTerm ? "Search Results" : "All Companies"}
          </h2>
          <div className="space-y-4">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <Card key={company.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="bg-muted flex items-center justify-center p-4 rounded-md h-20 w-20 shrink-0">
                        <Building className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">
                              {company.industry}
                            </Badge>
                            <Button variant="ghost" size="icon">
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {company.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {company.employees} employees
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {company.jobOpenings} job openings
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {company.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                          <div className="text-sm text-primary">
                            <Users className="h-4 w-4 inline mr-1" />
                            {company.referrers} referrers available
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-initial" asChild>
                              <Link to={`/app/companies/${company.id}`}>
                                View Referrers
                              </Link>
                            </Button>
                            <Button className="flex-1 sm:flex-initial" asChild>
                              <Link to={`/app/jobs?company=${company.name}`}>
                                View Jobs
                              </Link>
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
                <h3 className="text-lg font-medium mb-2">No companies found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setFilteredCompanies(companyData);
                }}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
