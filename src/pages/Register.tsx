
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
import { topCompanies } from "@/data/topCompanies";
import { companyService } from "@/services/companyService";

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
  const [customCompany, setCustomCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [registerAttempted, setRegisterAttempted] = useState(false);
  
  const isReferrer = role === "referrer";

  // Prepare company options from topCompanies with "Others" option
  const companyOptions = [
    ...topCompanies.map((company) => ({
      label: company.name,
      value: company.id,
    })),
    { label: "Others", value: "others" }
  ];

  useEffect(() => {
    // Ensure all top companies exist in database when the component loads
    const initializeCompanies = async () => {
      try {
        console.log("Initializing top companies");
        await companyService.ensureTopCompaniesExist(topCompanies);
        console.log("Top companies initialized successfully");
      } catch (err) {
        console.error("Failed to initialize top companies:", err);
        toast({
          title: "Warning",
          description: "Failed to load company data. You can still register, but company selection may be limited.",
          variant: "destructive",
        });
      }
    };
    
    initializeCompanies();
  }, [toast]);

  const handleCompanyChange = (value: string) => {
    setCompany(value);
    setShowCustomCompany(value === "others");
    if (value !== "others") {
      setCustomCompany("");
    }
  };

  const validateInputs = (): boolean => {
    // Basic validation rules
    if (!firstName.trim()) {
      toast({
        title: "First Name Required",
        description: "Please enter your first name.",
        variant: "destructive",
      });
      return false;
    }

    if (!lastName.trim()) {
      toast({
        title: "Last Name Required",
        description: "Please enter your last name.",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (isReferrer && !company) {
      toast({
        title: "Company Required",
        description: "Please select a company.",
        variant: "destructive",
      });
      return false;
    }

    if (isReferrer && company === "others" && !customCompany.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter your company name.",
        variant: "destructive",
      });
      return false;
    }

    if (isReferrer && !jobTitle.trim()) {
      toast({
        title: "Job Title Required",
        description: "Please enter your job title.",
        variant: "destructive",
      });
      return false;
    }

    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "You must accept the terms and conditions to register.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setRegisterAttempted(true);
    
    if (!validateInputs()) {
      return;
    }

    // Determine the company value to send
    // For company dropdown selection, we'll use the ID directly
    // For custom company, we'll use the name and create/find it during registration
    let companyValue = company === "others" ? customCompany : company;
    
    try {
      console.log('Submitting registration with company:', companyValue);
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        role,
        company: isReferrer ? companyValue : undefined,
        jobTitle: isReferrer ? jobTitle : undefined,
      }, password);
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
        variant: "default",
      });
      
      // Force a sync of profiles with company_members to ensure consistency
      if (isReferrer) {
        try {
          await companyService.syncProfilesWithCompanyMembers();
        } catch (syncError) {
          console.error('Error syncing company data:', syncError);
          // We don't want to fail registration if just the sync fails
        }
      }
      
      navigate("/app");
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific errors
      if (err.message.includes('already registered')) {
        toast({
          title: "Email Already Registered",
          description: "This email is already in use. Try logging in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: err.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
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
                    showPasswordToggle
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
                        <SelectTrigger id="company" className="w-full">
                          <SelectValue placeholder="Select a company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyOptions.map((companyOption) => (
                            <SelectItem key={companyOption.value} value={companyOption.value}>
                              {companyOption.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {showCustomCompany && (
                      <div className="space-y-2">
                        <Label htmlFor="customCompany">Company Name</Label>
                        <Input 
                          id="customCompany" 
                          placeholder="Enter your company name" 
                          required={showCustomCompany}
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
                    <Link to="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="text-primary hover:underline">
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
