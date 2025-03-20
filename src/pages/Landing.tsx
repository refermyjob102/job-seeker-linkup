
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, UserCheck, Users, ChevronRight, Building, ExternalLink, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import { useState } from "react";

const Landing = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mock featured companies data
  const featuredCompanies = [
    {
      id: 1,
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
      description: "A multinational technology company specializing in internet-related services and products, including online advertising technologies, a search engine, cloud computing, software, and hardware.",
      employeesCount: 1842,
      locations: ["Mountain View", "New York", "London", "Tokyo"],
      departments: ["Engineering", "Product", "Marketing", "Sales"]
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
      description: "A technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
      employeesCount: 1347,
      locations: ["Redmond", "Seattle", "Dublin", "Singapore"],
      departments: ["Software Development", "Cloud Computing", "AI Research", "Hardware"]
    },
    {
      id: 3,
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
      description: "An American multinational technology company focused on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
      employeesCount: 1586,
      locations: ["Seattle", "Arlington", "San Francisco", "Austin"],
      departments: ["Operations", "AWS", "Software Engineering", "Logistics"]
    },
    {
      id: 4,
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png",
      description: "An American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
      employeesCount: 1123,
      locations: ["Cupertino", "Austin", "New York", "London"],
      departments: ["Hardware Engineering", "Software Engineering", "Design", "Machine Learning"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Briefcase className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">JobReferral</h1>
          </div>
          
          {isMobile ? (
            <div className="flex items-center">
              <ThemeToggle />
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-2 p-2 text-muted-foreground hover:text-foreground"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          ) : (
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
          )}
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="container mx-auto px-4 py-4 bg-background border-t animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start">
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-start">
                  Sign up
                </Button>
              </Link>
              <div className="pt-2 border-t">
                <Link to="/about" className="block py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  About Us
                </Link>
                <Link to="/browse-jobs" className="block py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Improved with better contrast */}
      <section className="bg-gradient-to-br from-primary/90 via-primary to-primary-foreground/20 text-white py-16 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 text-center md:text-left">
              <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                The #1 Referral Network for Top Jobs
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Get Referred to Your Dream Job
              </h1>
              <p className="text-base md:text-lg mb-8 text-white/90 max-w-xl mx-auto md:mx-0">
                Connect with professionals working at top companies who can refer you directly to hiring managers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register?role=seeker">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto shadow-lg">
                    Find a Referrer <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/register?role=referrer">
                  <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 w-full sm:w-auto">
                    Become a Referrer
                  </Button>
                </Link>
              </div>
            </div>
            {!isMobile && (
              <div className="md:w-1/2 relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="People collaborating" 
                  className="relative rounded-lg shadow-2xl w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Companies Section - New Section */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-medium">Join Our Network</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">Featured Companies</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto px-4">
              Connect with employees at these top companies who can refer you directly to hiring managers
            </p>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 flex items-center justify-center mr-4 overflow-hidden">
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {company.employeesCount} employees
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{company.name}</CardTitle>
                  <CardDescription className="line-clamp-3 h-[4.5rem]">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {company.departments.map((dept) => (
                      <Badge key={dept} variant="secondary" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Locations:</strong> {company.locations.join(", ")}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/login" state={{ from: `/app/companies/${company.id}` }} className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      View Details <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/browse-jobs">
              <Button variant="default" size="lg" className="bg-primary">
                Browse All Companies <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Modern Card Design */}
      <section className="py-16 md:py-20 px-4 bg-background relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold">Trusted by thousands of professionals</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Join our growing community of job seekers and referrers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 bg-card rounded-xl shadow-sm border border-border/40 hover:shadow-md transition-all">
              <Users className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center">15,000+</h3>
              <p className="text-muted-foreground text-center">Active Job Seekers</p>
            </div>
            <div className="p-6 md:p-8 bg-card rounded-xl shadow-sm border border-border/40 hover:shadow-md transition-all">
              <Briefcase className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center">5,000+</h3>
              <p className="text-muted-foreground text-center">Job Listings</p>
            </div>
            <div className="p-6 md:p-8 bg-card rounded-xl shadow-sm border border-border/40 hover:shadow-md transition-all">
              <UserCheck className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center">8,500+</h3>
              <p className="text-muted-foreground text-center">Successful Referrals</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced Design */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary font-medium">Simple Process</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">How It Works</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-muted-foreground">Sign up and build your profile with your skills, experience, and career goals</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-xl font-semibold mb-3">Find Opportunities</h3>
              <p className="text-muted-foreground">Browse job listings and connect with referrers at your target companies</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 shadow-lg group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-xl font-semibold mb-3">Get Referred</h3>
              <p className="text-muted-foreground">Receive referrals directly to hiring managers and track your applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New Premium Section */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-primary font-medium">Success Stories</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">What Our Users Say</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-card p-6 md:p-8 rounded-xl shadow-sm border border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
                  <span className="text-primary font-bold">JD</span>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer at Google</p>
                </div>
              </div>
              <p className="italic text-muted-foreground mb-4">
                "After months of applying to jobs with no response, I got a referral through JobReferral and landed an interview at Google within a week. Three weeks later, I had an offer!"
              </p>
              <div className="flex justify-center sm:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="bg-card p-6 md:p-8 rounded-xl shadow-sm border border-border/40">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 mx-auto sm:mx-0">
                  <span className="text-primary font-bold">SJ</span>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Product Manager at Facebook</p>
                </div>
              </div>
              <p className="italic text-muted-foreground mb-4">
                "As a referrer, I've helped five people get jobs at my company. The platform makes it easy to find qualified candidates who are a good culture fit. It's rewarding to help others advance their careers."
              </p>
              <div className="flex justify-center sm:justify-start">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Improved Contrast */}
      <section className="py-12 md:py-16 px-4 bg-primary text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Advance Your Career?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-white/90">Join thousands of professionals who've found their dream jobs through referrals.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto shadow-md">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white/10 w-full sm:w-auto">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Improved Layout */}
      <footer className="bg-background py-12 md:py-16 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4 justify-center sm:justify-start">
                <Briefcase className="w-5 h-5 text-primary mr-2" />
                <h3 className="font-bold">JobReferral</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 text-center sm:text-left">
                Connecting job seekers with referrers at top companies.
              </p>
              <div className="flex space-x-4 justify-center sm:justify-start">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link></li>
                <li><Link to="/browse-jobs" className="text-muted-foreground hover:text-foreground transition-colors">Browse Jobs</Link></li>
                <li><Link to="/success-stories" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4">For Referrers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/why-refer" className="text-muted-foreground hover:text-foreground transition-colors">Why Refer</Link></li>
                <li><Link to="/rewards" className="text-muted-foreground hover:text-foreground transition-colors">Rewards Program</Link></li>
                <li><Link to="/partners" className="text-muted-foreground hover:text-foreground transition-colors">Partner Companies</Link></li>
              </ul>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0 text-center md:text-left">
              © 2023 JobReferral. All rights reserved.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
