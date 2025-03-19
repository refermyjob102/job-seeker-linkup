
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Building, 
  Briefcase, 
  MapPin, 
  Users, 
  ExternalLink, 
  Search,
  BadgeCheck,
  UserCheck
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { topCompanies, getCompanyById } from "@/data/topCompanies";

// Mock employees data
const employeesData = [
  {
    id: "1",
    name: "John Smith",
    role: "Software Engineer",
    department: "Engineering",
    image: "https://i.pravatar.cc/150?img=1",
    availableForReferrals: true,
    company_id: "1",
    joined: "2020"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Product Manager",
    department: "Product",
    image: "https://i.pravatar.cc/150?img=2",
    availableForReferrals: true,
    company_id: "1",
    joined: "2019"
  },
  {
    id: "3",
    name: "Michael Brown",
    role: "Data Scientist",
    department: "Data",
    image: "https://i.pravatar.cc/150?img=3",
    availableForReferrals: false,
    company_id: "1",
    joined: "2021"
  },
  {
    id: "4",
    name: "Emily Davis",
    role: "UX Designer",
    department: "Design",
    image: "https://i.pravatar.cc/150?img=4",
    availableForReferrals: true,
    company_id: "2",
    joined: "2018"
  },
  {
    id: "5",
    name: "David Wilson",
    role: "DevOps Engineer",
    department: "Infrastructure",
    image: "https://i.pravatar.cc/150?img=5",
    availableForReferrals: false,
    company_id: "2",
    joined: "2022"
  },
  {
    id: "6",
    name: "Jessica Martinez",
    role: "Marketing Director",
    department: "Marketing",
    image: "https://i.pravatar.cc/150?img=6",
    availableForReferrals: true,
    company_id: "3",
    joined: "2017"
  },
  {
    id: "7",
    name: "Ryan Taylor",
    role: "Frontend Developer",
    department: "Engineering",
    image: "https://i.pravatar.cc/150?img=7",
    availableForReferrals: true,
    company_id: "3",
    joined: "2020"
  },
  {
    id: "8",
    name: "Amanda Thomas",
    role: "HR Manager",
    department: "Human Resources",
    image: "https://i.pravatar.cc/150?img=8",
    availableForReferrals: false,
    company_id: "4",
    joined: "2019"
  }
];

const CompanyMembers = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Get company data
    if (id) {
      const companyData = getCompanyById(id);
      if (companyData) {
        setCompany(companyData);
      }
    }
    
    // Get company employees
    const companyEmployees = employeesData.filter(emp => emp.company_id === id);
    setEmployees(companyEmployees);
    setFilteredEmployees(companyEmployees);
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    filterEmployees();
  }, [filter, searchTerm, employees]);

  const filterEmployees = () => {
    let filtered = employees;
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply available for referrals filter
    if (filter === "available") {
      filtered = filtered.filter(emp => emp.availableForReferrals);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterEmployees();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading company information...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-64 flex-col space-y-4">
        <h2 className="text-2xl font-bold">Company Not Found</h2>
        <p className="text-muted-foreground">The company you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  const referrersCount = filteredEmployees.filter(emp => emp.availableForReferrals).length;

  return (
    <div className="space-y-6">
      <Link to="/app/companies" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Companies
      </Link>

      <div className="grid gap-6">
        {/* Company Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="bg-muted flex items-center justify-center p-6 rounded-md h-24 w-24">
                <Building className="h-12 w-12 text-muted-foreground" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{company.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="outline">{company.sector}</Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground text-sm">Company Size</span>
                    <span className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {parseInt(company.id) * 100}+ employees
                    </span>
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground text-sm">Available Referrers</span>
                    <span className="font-medium flex items-center">
                      <UserCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                      {referrersCount} available
                    </span>
                  </div>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground text-sm">Open Positions</span>
                    <span className="font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                      {parseInt(company.id) * 3} openings
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button>
                    View Open Positions
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={`https://www.google.com/search?q=${encodeURIComponent(company.name)}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employees Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold">Company Members</h2>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search members..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              
              <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="all">All Members</TabsTrigger>
                  <TabsTrigger value="available">Referrers Only</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.image} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{employee.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
                        <p className="text-sm text-muted-foreground truncate">{employee.department} • Since {employee.joined}</p>
                        
                        <div className="flex mt-3">
                          {employee.availableForReferrals && (
                            <Badge className="mr-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center">
                              <BadgeCheck className="h-3 w-3 mr-1" />
                              Available for Referrals
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" asChild>
                        <Link to={`/app/members/${employee.id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Try adjusting your search criteria"
                  : filter === "available" 
                    ? "No members available for referrals at this time"
                    : "This company doesn't have any members in our system yet"
                }
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyMembers;
