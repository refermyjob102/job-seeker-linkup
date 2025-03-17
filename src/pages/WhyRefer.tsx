
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Building, DollarSign, Users, Award, Star } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Why Become a Referrer?</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help others advance their careers while earning rewards and building your professional network.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card rounded-lg p-8 border hover:shadow-md transition-all">
              <DollarSign className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
              <p className="text-muted-foreground mb-4">
                Receive cash bonuses, gift cards, and exclusive perks for successful referrals to your company.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Up to $2,000 per successful hire</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Premium membership benefits</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Special partner discounts</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 border hover:shadow-md transition-all">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Build Your Network</h3>
              <p className="text-muted-foreground mb-4">
                Expand your professional connections and establish yourself as a valuable resource in your industry.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Connect with top talent</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enhance your professional reputation</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Strengthen industry relationships</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 border hover:shadow-md transition-all">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Gain Recognition</h3>
              <p className="text-muted-foreground mb-4">
                Be recognized as a top referrer within your company and on our platform with special badges and features.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Featured referrer status</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Performance badges</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Leaderboard recognition</span>
                </li>
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 border hover:shadow-md transition-all">
              <Building className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Help Your Company</h3>
              <p className="text-muted-foreground mb-4">
                Contribute to your company's growth by helping attract high-quality talent that fits the culture.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Reduce hiring costs</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Improve culture fit</span>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span>Lower turnover rates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works for Referrers */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works for Referrers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">Create Your Profile</h3>
                <p className="text-sm text-muted-foreground">Sign up and indicate your current company and role. Verify your work email to become an official referrer.</p>
              </div>
              <div className="bg-card rounded-lg p-6 border text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">Browse Candidates</h3>
                <p className="text-sm text-muted-foreground">Review profiles of job seekers interested in your company. Filter by skills, experience, and role fit.</p>
              </div>
              <div className="bg-card rounded-lg p-6 border text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">Make Referrals</h3>
                <p className="text-sm text-muted-foreground">Submit referrals for promising candidates through our platform. Track their progress and earn rewards.</p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">What Referrers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">MJ</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Michael Johnson</h3>
                    <p className="text-sm text-muted-foreground">Senior Engineer at Microsoft</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "I've referred 7 people through JobReferral in the past year. Not only did I earn substantial bonuses, but I also helped build a stronger team with great talent that might have been overlooked otherwise."
                </p>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">AK</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Aisha Khan</h3>
                    <p className="text-sm text-muted-foreground">Product Manager at Google</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Being a referrer on this platform has helped me build my personal brand within my company. My managers notice my commitment to growing the team, and I've helped several talented individuals kickstart their careers."
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Become a Referrer?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Join our community of professionals helping others advance their careers while earning rewards.
            </p>
            <Link to="/register?role=referrer">
              <Button size="lg">
                Sign Up as a Referrer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
