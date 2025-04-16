
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { topCompanies } from "@/data/topCompanies";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();
  
  const initialRole = new URLSearchParams(location.search).get("role") || "seeker";
  
  const [role, setRole] = useState<UserRole>(initialRole as UserRole);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [companyOptions, setCompanyOptions] = useState<{id: string, name: string}[]>([]);
  const [customCompany, setCustomCompany] = useState("");
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const isReferrer = role === "referrer";

  useEffect(() => {
    // Fetch companies from the database
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');
          
        if (error) {
          console.error('Error fetching companies:', error);
          return;
        }
        
        // Add the companies from the database
        setCompanyOptions(data || []);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms and conditions to register.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // If user selected "other" and entered a custom company, create it first
      let finalCompanyId = company;
      
      if (isReferrer && company === "other" && customCompany.trim()) {
        // Check if the company already exists with the same name
        const { data: existingCompany } = await supabase
          .from('companies')
          .select('id')
          .ilike('name', customCompany.trim())
          .single();
          
        if (existingCompany) {
          finalCompanyId = existingCompany.id;
        } else {
          // Create new company
          const { data: newCompany, error: companyError } = await supabase
            .from('companies')
            .insert({
              name: customCompany.trim()
            })
            .select('id')
            .single();
            
          if (companyError) {
            throw new Error(`Error creating company: ${companyError.message}`);
          }
          
          if (newCompany) {
            finalCompanyId = newCompany.id;
          }
        }
      }
      
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        role,
        company: isReferrer ? finalCompanyId : undefined,
        jobTitle: isReferrer ? jobTitle : undefined,
      }, password);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        variant: "default",
      });
      
      navigate("/app");
    } catch (err) {
      // Error is handled in auth context
    }
  };

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    setShowCustomCompany(value === "other");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <Link to="/" className="flex items-center">
              <Briefcase className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold">JobReferral</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs defaultValue={initialRole} onValueChange={(value) => {
              setRole(value as UserRole);
              clearError();
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
                <TabsTrigger value="referrer">Referrer</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      required 
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearError();
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearError();
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    required 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                  />
                </div>
                
                {isReferrer && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Select 
                        value={company} 
                        onValueChange={handleCompanyChange}
                        required={isReferrer}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyOptions.map((comp) => (
                            <SelectItem key={comp.id} value={comp.id}>
                              {comp.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Other (specify)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {showCustomCompany && (
                      <div className="space-y-2">
                        <Label htmlFor="customCompany">Company Name</Label>
                        <Input 
                          id="customCompany" 
                          placeholder="Enter company name" 
                          required={isReferrer && showCustomCompany} 
                          value={customCompany}
                          onChange={(e) => setCustomCompany(e.target.value)}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input 
                        id="jobTitle" 
                        placeholder="Software Engineer, Product Manager, etc." 
                        required={isReferrer} 
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                      />
                    </div>
                  </>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked === true);
                    }}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
            </Tabs>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
