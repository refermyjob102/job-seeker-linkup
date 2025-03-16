
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Award, DollarSign, Users, BarChart } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";

const WhyRefer = () => {
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
            <span className="text-foreground">Why Refer</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Why Become a Referrer</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how referring quality candidates through our platform can benefit your career and help others succeed.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-2">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-3">Build Your Professional Brand</h2>
                <p className="text-muted-foreground">
                  Establish yourself as a valuable connector in your industry. Increase your visibility and reputation within your company and professional network.
                </p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-6">
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-3">Earn Referral Bonuses</h2>
                <p className="text-muted-foreground">
                  Many companies offer substantial referral bonuses for successful hires. Some of our referrers have earned thousands of dollars through company referral programs.
                </p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-3">Expand Your Network</h2>
                <p className="text-muted-foreground">
                  Connect with talented professionals across various industries and roles. Build meaningful relationships that can benefit your career in the long term.
                </p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-6">
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <h2 className="text-xl font-bold mb-3">Help Shape Your Company</h2>
                <p className="text-muted-foreground">
                  Influence your company's culture and success by helping bring in talented people who align with your organization's values and goals.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <div className="bg-card border rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works for Referrers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Sign up and verify your current employment. Specify which roles and departments you can refer candidates to.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">Connect with Candidates</h3>
                <p className="text-muted-foreground text-sm">
                  Review profiles of job seekers interested in your company. Message them to learn more about their experience and goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">Submit Referrals</h3>
                <p className="text-muted-foreground text-sm">
                  Refer qualified candidates through your company's referral system. Track the status of your referrals on our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <h2 className="text-2xl font-bold mb-6 text-center">What Referrers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/150?img=45" alt="Michael Brown" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">Michael Brown</h3>
                  <p className="text-sm text-muted-foreground">Engineering Manager at Facebook</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "I've referred 12 engineers through JobReferral, and 8 of them are now my colleagues. The platform makes it easy to find candidates who are actually qualified, and my company has paid me over $20,000 in referral bonuses."
              </p>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img src="https://i.pravatar.cc/150?img=22" alt="Aisha Johnson" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">Aisha Johnson</h3>
                  <p className="text-sm text-muted-foreground">Product Marketing at Microsoft</p>
                </div>
              </div>
              <p className="text-muted-foreground italic">
                "Being a referrer on this platform has actually helped me advance my own career. It demonstrated my commitment to company growth and connected me with talented professionals across the industry."
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="bg-card border rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Does it cost anything to be a referrer?</h3>
                <p className="text-muted-foreground">
                  No, being a referrer on JobReferral is completely free. We never charge referrers for connecting with candidates or submitting referrals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Am I obligated to refer everyone who contacts me?</h3>
                <p className="text-muted-foreground">
                  Not at all. You have full discretion over who you choose to refer. We encourage referrers to only recommend candidates they genuinely believe would be a good fit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Will my company know I'm active on JobReferral?</h3>
                <p className="text-muted-foreground">
                  Your profile is only visible to job seekers on our platform. We do not contact your employer or share your information with them.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How many people can I refer?</h3>
                <p className="text-muted-foreground">
                  There's no limit to how many candidates you can refer through our platform. However, we encourage quality over quantity to maintain high standards.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our community of professionals helping talented candidates find their way to great companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=referrer">
                <Button size="lg">
                  Become a Referrer
                </Button>
              </Link>
              <Link to="/rewards">
                <Button size="lg" variant="outline">
                  Learn About Rewards
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

export default WhyRefer;
