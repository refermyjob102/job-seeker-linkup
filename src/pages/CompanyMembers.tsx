
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  User, 
  Users, 
  MapPin, 
  Search, 
  BriefcaseBusiness,
  Mail,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const CompanyMembers = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [company, setCompany] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompanyAndMembers = async () => {
      setLoading(true);
      try {
        // Fetch company details
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", id)
          .single();

        if (companyError) throw companyError;
        setCompany(companyData);

        // Fetch company members with their profiles
        const { data: membersData, error: membersError } = await supabase
          .from("company_members")
          .select(`
            *,
            profiles:user_id (
              id,
              first_name,
              last_name,
              email,
              role,
              bio,
              location,
              avatar_url
            )
          `)
          .eq("company_id", id);

        if (membersError) throw membersError;
        setMembers(membersData);
        setFilteredMembers(membersData);
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast({
          title: "Error",
          description: "Failed to load company data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyAndMembers();
    }
  }, [id, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
      return;
    }
    
    const results = members.filter(member => {
      const profile = member.profiles;
      if (!profile) return false;
      
      return (
        profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredMembers(results);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Company Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The company you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link to="/app/companies">Back to Companies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Link to="/app/companies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Companies
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">{company.name}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{company.name}</h1>
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {company.location || "Location not specified"}
        </div>
        <p className="text-muted-foreground max-w-3xl mb-6">
          {company.description || "No company description available."}
        </p>
        
        {company.website && (
          <Button variant="outline" size="sm" className="mb-6" asChild>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Team Members</CardTitle>
            <CardDescription>
              People working at {company.name}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            <Users className="mr-1 h-3.5 w-3.5" />
            {members.length} {members.length === 1 ? "Member" : "Members"}
          </Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, role, department..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => {
                const profile = member.profiles;
                if (!profile) return null;
                
                return (
                  <Card key={member.id} className="card-hover overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-4 p-4">
                        <div className="bg-primary/10 rounded-full p-2 h-12 w-12 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {profile.first_name} {profile.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.job_title || "Role not specified"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t p-4 space-y-3">
                        {member.department && (
                          <div className="flex items-center text-sm">
                            <BriefcaseBusiness className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{member.department}</span>
                          </div>
                        )}
                        
                        {profile.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{profile.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate">{profile.email}</span>
                        </div>
                        
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to={`/app/members/${profile.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "This company doesn't have any team members yet"}
              </p>
              {searchTerm && (
                <Button onClick={() => {
                  setSearchTerm("");
                  setFilteredMembers(members);
                }}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyMembers;
