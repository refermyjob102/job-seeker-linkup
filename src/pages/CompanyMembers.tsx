
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building, MapPin, Search, ArrowLeft, User, Mail, MessageSquare, Users, Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock company data
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
    website: "https://google.com",
    about: "Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, artificial intelligence, and consumer electronics. It has been referred to as \"the most powerful company in the world\" and one of the world's most valuable brands due to its market dominance, data collection, and technological advantages in the area of artificial intelligence."
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
    website: "https://meta.com",
    about: "Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., and TheFacebook, Inc., is an American multinational technology conglomerate based in Menlo Park, California. The company owns Facebook, Instagram, and WhatsApp, among other products and services."
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
    website: "https://apple.com",
    about: "Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services. Apple is the largest technology company by revenue (totaling US$365.8 billion in 2021) and, as of June 2022, is the world's biggest company by market capitalization, the fourth-largest personal computer vendor by unit sales and second-largest mobile phone manufacturer."
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
    website: "https://amazon.com",
    about: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence. It has been referred to as \"one of the most influential economic and cultural forces in the world\", and is one of the world's most valuable brands."
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
    website: "https://microsoft.com",
    about: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services. Its best-known software products are the Microsoft Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers."
  },
];

// Mock referrer data
const referrerData = [
  {
    id: "1",
    userId: "2",
    companyId: "1",
    firstName: "Jane",
    lastName: "Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
    location: "Mountain View, CA",
    tenure: "4 years",
    bio: "I help teams build great products at Google. Previously worked at Meta and Amazon. I'm passionate about mentoring and helping others break into tech.",
    referralCount: 15,
    successRate: 85,
    availability: "Open to referrals",
  },
  {
    id: "2",
    userId: "5",
    companyId: "1",
    firstName: "Michael",
    lastName: "Johnson",
    avatar: "https://i.pravatar.cc/150?img=5",
    jobTitle: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    tenure: "2 years",
    bio: "Product Manager working on Google Search. I love connecting talented individuals with opportunities at Google.",
    referralCount: 8,
    successRate: 75,
    availability: "Selective referrals",
  },
  {
    id: "3",
    userId: "6",
    companyId: "1",
    firstName: "Emily",
    lastName: "Davis",
    avatar: "https://i.pravatar.cc/150?img=6",
    jobTitle: "UX Designer",
    department: "Design",
    location: "Remote",
    tenure: "3 years",
    bio: "Designer focused on creating human-centered experiences. Open to referring passionate designers to Google.",
    referralCount: 10,
    successRate: 90,
    availability: "Open to referrals",
  },
  {
    id: "4",
    userId: "7",
    companyId: "2",
    firstName: "David",
    lastName: "Wilson",
    avatar: "https://i.pravatar.cc/150?img=7",
    jobTitle: "Engineering Manager",
    department: "Infrastructure",
    location: "Menlo Park, CA",
    tenure: "5 years",
    bio: "Leading infrastructure teams at Meta. Previously at Microsoft. Looking to refer talented engineers who are passionate about scale.",
    referralCount: 20,
    successRate: 80,
    availability: "Open to referrals",
  },
  {
    id: "5",
    userId: "8",
    companyId: "2",
    firstName: "Sophia",
    lastName: "Lee",
    avatar: "https://i.pravatar.cc/150?img=8",
    jobTitle: "Data Scientist",
    department: "Analytics",
    location: "Remote",
    tenure: "2 years",
    bio: "Working on data analytics at Meta. PhD in Computer Science. Passionate about mentoring aspiring data scientists.",
    referralCount: 12,
    successRate: 85,
    availability: "Selective referrals",
  },
  {
    id: "6",
    userId: "9",
    companyId: "3",
    firstName: "James",
    lastName: "Brown",
    avatar: "https://i.pravatar.cc/150?img=9",
    jobTitle: "iOS Developer",
    department: "Mobile Apps",
    location: "Cupertino, CA",
    tenure: "4 years",
    bio: "iOS developer at Apple working on the App Store. I enjoy helping talented developers join our team.",
    referralCount: 14,
    successRate: 90,
    availability: "Open to referrals",
  },
];

const CompanyMembers = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<typeof companyData[0] | null>(null);
  const [referrers, setReferrers] = useState<typeof referrerData>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReferrers, setFilteredReferrers] = useState<typeof referrerData>([]);
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  useEffect(() => {
    // Find company by ID
    const foundCompany = companyData.find(c => c.id === id);
    if (foundCompany) {
      setCompany(foundCompany);
    }
    
    // Find referrers for this company
    const companyReferrers = referrerData.filter(r => r.companyId === id);
    setReferrers(companyReferrers);
    setFilteredReferrers(companyReferrers);
  }, [id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let results = referrers;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(referrer => 
        `${referrer.firstName} ${referrer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referrer.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referrer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referrer.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply department filter
    if (departmentFilter !== "all") {
      results = results.filter(referrer => referrer.department === departmentFilter);
    }
    
    setFilteredReferrers(results);
  };

  // Get unique departments for filter
  const departments = [...new Set(referrers.map(r => r.department))];

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/app/companies" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Companies
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="bg-muted flex items-center justify-center p-4 rounded-md h-20 w-20">
            <Building className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {company.location} • 
              <Briefcase className="h-4 w-4 mx-1" />
              {company.jobOpenings} open positions
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {company.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{company.about}</p>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Industry</h3>
                <Badge variant="outline">{company.industry}</Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Company Size</h3>
                <p className="text-sm text-muted-foreground">{company.employees} employees</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Website</h3>
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-primary hover:underline"
                >
                  {company.website}
                </a>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Referrers Available</h3>
                  <p className="text-2xl font-bold">{company.referrers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referrers List */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Referrers</CardTitle>
              <CardDescription>
                Connect with employees who can refer you to {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filter and Search */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by name, title, or department"
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={departmentFilter} 
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="submit">Filter</Button>
                </div>
              </form>

              <Separator />

              {/* Referrers Grid */}
              <div className="space-y-4">
                {filteredReferrers.length > 0 ? (
                  filteredReferrers.map((referrer) => (
                    <Card key={referrer.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={referrer.avatar} alt={`${referrer.firstName} ${referrer.lastName}`} />
                            <AvatarFallback>{`${referrer.firstName.charAt(0)}${referrer.lastName.charAt(0)}`}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                              <h3 className="font-medium text-lg">
                                {referrer.firstName} {referrer.lastName}
                              </h3>
                              <Badge>{referrer.availability}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {referrer.jobTitle} • {referrer.department} • {referrer.tenure}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {referrer.location}
                            </p>
                            <p className="text-sm mb-4 line-clamp-2">{referrer.bio}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {referrer.referralCount} Referrals
                              </Badge>
                              <Badge variant="outline" className="flex items-center">
                                {referrer.successRate}% Success Rate
                              </Badge>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-2">
                              <Button variant="outline" className="flex-1" asChild>
                                <Link to={`/app/members/${referrer.userId}`}>
                                  <User className="h-4 w-4 mr-2" />
                                  View Profile
                                </Link>
                              </Button>
                              <Button variant="outline" className="flex-1" asChild>
                                <Link to={`/app/chat/${referrer.userId}`}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Message
                                </Link>
                              </Button>
                              <Button className="flex-1">
                                <Mail className="h-4 w-4 mr-2" />
                                Request Referral
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No referrers found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button onClick={() => {
                      setSearchTerm("");
                      setDepartmentFilter("all");
                      setFilteredReferrers(referrers);
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyMembers;
