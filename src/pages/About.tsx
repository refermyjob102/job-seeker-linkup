
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Building, Users, Globe, Award } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Building className="w-6 h-6 text-primary mr-2" />
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
            <span className="text-foreground">About Us</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">About JobReferral</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Our mission is to transform the job search process through the power of personal connections.</p>
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <div className="bg-card rounded-lg p-8 border">
              <p className="mb-4">JobReferral was founded in 2020 by a team of tech professionals who experienced firsthand how difficult it can be to break into top companies without an internal referral.</p>
              <p className="mb-4">After submitting hundreds of applications with no response, our founders finally landed interviews at their dream companies through personal connections. This experience revealed a fundamental truth about hiring: referrals provide the most direct path to getting noticed by hiring managers.</p>
              <p>Today, JobReferral has helped thousands of job seekers connect with industry professionals who can refer them to positions at top companies, dramatically increasing their chances of landing interviews and receiving offers.</p>
            </div>
          </div>

          {/* Our Mission */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect People</h3>
                <p className="text-muted-foreground">Build meaningful professional connections between job seekers and industry insiders.</p>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Create Opportunity</h3>
                <p className="text-muted-foreground">Democratize access to opportunities at top companies through referrals.</p>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Reward Helpfulness</h3>
                <p className="text-muted-foreground">Recognize and reward professionals who help others advance their careers.</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="bg-muted aspect-square rounded-full mb-4 mx-auto w-32 h-32 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-muted-foreground">JP</span>
                  </div>
                  <h3 className="font-semibold">Jane Porter</h3>
                  <p className="text-sm text-muted-foreground">Co-Founder & CEO</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Be part of a growing network of professionals helping each other succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">
                  Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
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

export default About;
