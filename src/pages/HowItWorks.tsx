
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg className="w-6 h-6 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h1 className="text-xl font-bold">JobReferral</h1>
            </Link>
          </div>
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
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground">How It Works</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">How JobReferral Works</h1>
            <p className="text-xl text-muted-foreground">A simple, effective way to get referred to your dream job.</p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full inline-block mb-4">Step 1</div>
                <h2 className="text-2xl font-bold mb-4">Create Your Profile</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Sign up and verify your email address</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Complete your profile with your professional experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Upload your resume and highlight your skills</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Specify your target companies and roles</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border/40">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" 
                    alt="Creating profile" 
                    className="rounded-lg w-full"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border/40">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" 
                    alt="Browse jobs" 
                    className="rounded-lg w-full" 
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full inline-block mb-4">Step 2</div>
                <h2 className="text-2xl font-bold mb-4">Find Opportunities</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Browse job listings across top companies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Filter by location, role, seniority, and more</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Connect with referrers at your target companies</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Message potential referrers through our platform</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full inline-block mb-4">Step 3</div>
                <h2 className="text-2xl font-bold mb-4">Get Referred</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Referrers review your profile and resume</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Receive internal referrals directly to hiring managers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Track your application status</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span>Get interview prep resources and tips</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <div className="bg-card rounded-xl shadow-lg p-6 border border-border/40">
                  <img 
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop" 
                    alt="Get referred" 
                    className="rounded-lg w-full" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Join thousands of professionals who have accelerated their careers with JobReferral</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background py-8 px-4 border-t mt-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 JobReferral. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
