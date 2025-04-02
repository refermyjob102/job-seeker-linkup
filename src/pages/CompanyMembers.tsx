
import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
  UserCheck,
  Globe,
  Calendar,
  TrendingUp,
  Award,
  Mail,
  Phone
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { getCompanyById } from "@/data/topCompanies";
import ViewOpenPositionsModal from "@/components/ViewOpenPositionsModal";
import { Separator } from "@/components/ui/separator";
import { companyService } from "@/services/companyService";
import { Company, Profile } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyMemberWithProfile {
  id: string;
  company_id: string;
  user_id: string;
  job_title: string;
  department?: string;
  joined_at: string;
  profiles: Profile;
}

const CompanyMembers = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const positionFilter = searchParams.get('position');
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<CompanyMemberWithProfile[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<CompanyMemberWithProfile[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isOpenPositionsModalOpen, setIsOpenPositionsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setLoading(true);
      
      try {
        console.log("Fetching company data for ID:", id);
        
        // First run a sync to ensure all profile data is in sync with company_members
        await companyService.syncProfilesWithCompanyMembers();
        
        // Get company data
        if (id) {
          // First try to get from Supabase
          const companyData = await companyService.getCompanyById(id);
          
          if (companyData) {
            console.log("Company data retrieved:", companyData);
            setCompany(companyData);
            
            // Get company members
            console.log("Fetching company members...");
            const companyMembers = await companyService.getCompanyMembers(id);
            console.log("Company members retrieved:", companyMembers);
            
            if (companyMembers.length === 0) {
              console.warn("No company members found! This may be an error.");
            }
            
            setEmployees(companyMembers);
            setFilteredEmployees(companyMembers);
          } else {
            console.log("No company data found, falling back to mock data");
            // Fallback to mock data
            const fallbackCompany = getCompanyById(id);
            if (fallbackCompany) {
              setCompany(fallbackCompany as unknown as Company);
              // Use empty array for employees as we don't have real data
              setEmployees([]);
              setFilteredEmployees([]);
            } else {
              console.log("No mock company found for ID:", id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast({
          title: "Error",
          description: "Failed to load company data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [id, toast]);

  useEffect(() => {
    filterEmployees();
  }, [filter, searchTerm, employees, positionFilter]);

  const filterEmployees = () => {
    if (!employees.length) return;
    
    let filtered = employees;
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.profiles.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.profiles.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.department && emp.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply available for referrals filter
    if (filter === "available") {
      filtered = filtered.filter(emp => emp.profiles.available_for_referrals);
    }
    
    // Apply position filter from URL
    if (positionFilter) {
      // Filter employees who can refer for this position (those available for referrals)
      filtered = filtered.filter(emp => emp.profiles.available_for_referrals);
    }
    
    setFilteredEmployees(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterEmployees();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
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

  const referrersCount = filteredEmployees.filter(emp => emp.profiles.available_for_referrals).length;

  // Enhanced company details for LinkedIn-like experience
  const companyDetails = {
    founded: "2015",
    industry: company.description || "Technology",
    size: `${filteredEmployees.length}+ employees`,
    headquarters: company.location || "San Francisco, CA",
    website: company.website || "https://www.example.com",
    specialties: ["Software Development", "Cloud Computing", "Data Analytics", "AI/ML"],
    description: company.description || `${company.name} is a leading company in the technology industry, focused on delivering innovative solutions that transform businesses. With a team of dedicated professionals, we're committed to excellence and creating value for our clients and stakeholders. Our mission is to leverage technology to solve complex problems and drive meaningful change.`,
    foundersInfo: "Founded by tech industry veterans with a passion for innovation and problem-solving.",
    culture: "We foster a collaborative environment where creativity, diversity, and continuous learning are valued. Our team members are encouraged to take initiative and contribute to our shared success.",
    contactEmail: "info@example.com",
    contactPhone: "+1 (555) 123-4567"
  };

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
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="h-full w-full object-contain" />
                ) : (
                  <Building className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{company.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="outline">{companyDetails.industry}</Badge>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {companyDetails.size}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-muted-foreground text-sm">Company Size</span>
                    <span className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      {filteredEmployees.length || 0} employees
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
                      {parseInt(company.id) * 3 || 5} openings
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button onClick={() => setIsOpenPositionsModalOpen(true)}>
                    View Open Positions
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={company.website || `https://www.google.com/search?q=${encodeURIComponent(company.name)}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Company Details - LinkedIn-like */}
        <Card>
          <CardHeader>
            <CardTitle>About {company.name}</CardTitle>
            <CardDescription>Company profile and details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{companyDetails.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Founded</h4>
                      <p className="text-sm text-muted-foreground">{companyDetails.founded}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Headquarters</h4>
                      <p className="text-sm text-muted-foreground">{companyDetails.headquarters}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Website</h4>
                      <p className="text-sm text-muted-foreground">
                        <a href={companyDetails.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {companyDetails.website}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Industry</h4>
                      <p className="text-sm text-muted-foreground">{companyDetails.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Company size</h4>
                      <p className="text-sm text-muted-foreground">{companyDetails.size}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Specialties</h4>
                      <p className="text-sm text-muted-foreground">{companyDetails.specialties.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Company Culture</h3>
              <p className="text-sm text-muted-foreground">{companyDetails.culture}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{companyDetails.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{companyDetails.contactPhone}</span>
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
                        <AvatarImage src={employee.profiles.avatar_url || ''} alt={`${employee.profiles.first_name} ${employee.profiles.last_name}`} />
                        <AvatarFallback>{employee.profiles.first_name.charAt(0)}{employee.profiles.last_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{employee.profiles.first_name} {employee.profiles.last_name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{employee.job_title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {employee.department || 'General'} • Since {new Date(employee.joined_at).getFullYear()}
                        </p>
                        
                        <div className="flex mt-3">
                          {employee.profiles.available_for_referrals && (
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
                        <Link to={`/app/members/${employee.profiles.id}`}>
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

      {/* Open Positions Modal */}
      <ViewOpenPositionsModal
        open={isOpenPositionsModalOpen}
        onClose={() => setIsOpenPositionsModalOpen(false)}
        companyId={id || ""}
        companyName={company.name}
      />
    </div>
  );
};

export default CompanyMembers;
