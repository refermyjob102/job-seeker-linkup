
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getCompanyById } from "@/data/topCompanies";
import { Building, ExternalLink, MapPin, Search, User, Users } from "lucide-react";

const CompanyMembers = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  
  // Mock company members
  const generateMockMembers = (companyId: string, count: number) => {
    const roles = [
      "Software Engineer", "Product Manager", "UX Designer", "Data Scientist",
      "Marketing Manager", "HR Specialist", "Engineering Manager", "DevOps Engineer",
      "UI Designer", "Frontend Developer", "Backend Developer", "Full Stack Developer"
    ];
    
    const members = [];
    
    for (let i = 1; i <= count; i++) {
      members.push({
        id: `${companyId}-member-${i}`,
        name: `Team Member ${i}`,
        avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
        role: roles[Math.floor(Math.random() * roles.length)],
        yearsAtCompany: Math.floor(Math.random() * 10) + 1,
        referralsProvided: Math.floor(Math.random() * 15),
        isAvailable: Math.random() > 0.3,
      });
    }
    
    return members;
  };
  
  useEffect(() => {
    const fetchCompanyAndMembers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!id) {
          throw new Error("Company ID is required");
        }

        // Get company data from our utility
        const companyData = getCompanyById(id);
        
        if (!companyData) {
          throw new Error("Company not found");
        }
        
        // Create extended company data for display
        const extendedCompanyData = {
          ...companyData,
          logo: "/placeholder.svg",
          location: companyData.sector === "Technology" ? "Silicon Valley, CA" : 
                   companyData.sector === "Finance" ? "New York, NY" : 
                   companyData.sector === "Healthcare" ? "Boston, MA" : "USA",
          website: `https://www.${companyData.name.toLowerCase().replace(/\s+/g, '')}.com`,
          employeeCount: Math.floor(Math.random() * 100000) + 1000,
          foundedYear: Math.floor(Math.random() * 30) + 1980,
          members: generateMockMembers(id, Math.floor(Math.random() * 20) + 10)
        };
        
        setCompany(extendedCompanyData);
        setFilteredMembers(extendedCompanyData.members);
      } catch (error: any) {
        console.error("Error fetching company data:", error);
        setError(error.message || "Failed to load company details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCompanyAndMembers();
  }, [id]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company || !company.members) return;
    
    if (searchTerm.trim() === "") {
      setFilteredMembers(company.members);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const results = company.members.filter((member: any) => 
      member.name.toLowerCase().includes(searchTermLower) ||
      member.role.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredMembers(results);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading company details...</p>
      </div>
    );
  }
  
  if (error || !company) {
    return (
      <div className="flex flex-col justify-center items-center p-8 text-center">
        <Building className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
        <p className="text-muted-foreground mb-4">
          {error || "The company you're looking for doesn't exist or you don't have permission to view it."}
        </p>
        <Button as="a" href="/app/companies">
          Browse Companies
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <Link to="/app/companies" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">
          ← Back to Companies
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{company.name}</h1>
        <p className="text-muted-foreground">
          Connect with team members at {company.name}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-muted h-16 w-16 flex items-center justify-center rounded">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">{company.sector}</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{company.employeeCount.toLocaleString()}+ employees</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    {company.website.replace('https://', '')}
                  </a>
                </div>
              </div>
              
              <div className="pt-4">
                <Badge className="mr-2">{company.sector}</Badge>
                <Badge variant="outline">Founded {company.foundedYear}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Team Members */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Connect with team members who can refer you to jobs at {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name or role..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              
              <div className="space-y-4">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <Card key={member.id} className="hover:bg-accent/5 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{member.name}</h3>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {member.yearsAtCompany} {member.yearsAtCompany === 1 ? 'year' : 'years'} at {company.name} • {member.referralsProvided} referrals provided
                                </p>
                              </div>
                              
                              <div className="text-right">
                                {member.isAvailable ? (
                                  <Badge className="bg-green-500 hover:bg-green-600 mb-2">Available for Referrals</Badge>
                                ) : (
                                  <Badge variant="outline" className="mb-2">Not Available</Badge>
                                )}
                                
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    asChild
                                    className="w-full sm:w-auto"
                                  >
                                    <Link to={`/app/members/${member.id}`}>
                                      View Profile
                                    </Link>
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    disabled={!member.isAvailable}
                                    className="w-full sm:w-auto"
                                    asChild
                                  >
                                    <Link to={`/app/chat/${member.id}`}>
                                      Message
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium mb-1">No team members found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or try again later
                    </p>
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
