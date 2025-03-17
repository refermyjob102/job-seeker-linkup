
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Gift, DollarSign, Zap, Award, Calendar, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Rewards = () => {
  const rewardTiers = [
    {
      name: "Bronze",
      referrals: "1-2",
      rewards: [
        "$250 per successful hire",
        "Recognition on platform",
        "Exclusive job referral tips"
      ]
    },
    {
      name: "Silver",
      referrals: "3-5",
      rewards: [
        "$500 per successful hire",
        "Early access to new features",
        "Premium job market insights",
        "Featured referrer status"
      ]
    },
    {
      name: "Gold",
      referrals: "6-10",
      rewards: [
        "$1,000 per successful hire",
        "VIP customer support",
        "Invitation to exclusive networking events",
        "Personal career coaching session"
      ]
    },
    {
      name: "Platinum",
      referrals: "11+",
      rewards: [
        "$2,000 per successful hire",
        "One-on-one mentorship opportunities",
        "Premium partner discounts",
        "Leadership advisory board invitation",
        "Annual referrer awards eligibility"
      ]
    }
  ];

  const partnerRewards = [
    {
      name: "Amazon Gift Cards",
      description: "Redeem your points for Amazon gift cards to use for online shopping.",
      icon: <Gift className="h-10 w-10 text-primary" />
    },
    {
      name: "Cash Bonuses",
      description: "Transfer your rewards directly to your bank account as cash bonuses.",
      icon: <DollarSign className="h-10 w-10 text-primary" />
    },
    {
      name: "Premium Subscriptions",
      description: "Get complimentary subscriptions to premium services like Spotify, Netflix, or LinkedIn Premium.",
      icon: <Zap className="h-10 w-10 text-primary" />
    },
    {
      name: "Professional Development",
      description: "Use your rewards for courses, certifications, or conferences to advance your career.",
      icon: <Award className="h-10 w-10 text-primary" />
    },
    {
      name: "Charity Donations",
      description: "Donate your rewards to a charity of your choice and make a positive impact.",
      icon: <Gift className="h-10 w-10 text-primary" />
    },
    {
      name: "Exclusive Events",
      description: "Gain access to invitation-only industry events and networking opportunities.",
      icon: <Calendar className="h-10 w-10 text-primary" />
    }
  ];

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
            <span className="text-foreground">Rewards Program</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Referrer Rewards Program</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get rewarded for helping others advance their careers through your valuable referrals.
            </p>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How The Rewards Program Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-8 border relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">1</div>
                <h3 className="text-xl font-semibold mb-4">Refer Candidates</h3>
                <p className="text-muted-foreground">
                  Browse job seekers interested in your company, review their profiles, and refer those who are a good fit.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 border relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">2</div>
                <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
                <p className="text-muted-foreground">
                  Follow your referrals through the hiring process, from initial contact to interview to offer.
                </p>
              </div>
              <div className="bg-card rounded-lg p-8 border relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">3</div>
                <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
                <p className="text-muted-foreground">
                  Receive rewards when your referrals are successfully hired. The more successful referrals, the higher your tier and rewards.
                </p>
              </div>
            </div>
          </div>

          {/* Reward Tiers */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Reward Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewardTiers.map((tier, index) => (
                <div key={index} className={`bg-card rounded-lg border p-6 ${index === 3 ? 'border-primary/50 shadow-md' : ''}`}>
                  <h3 className="text-xl font-bold mb-2">{tier.name} Tier</h3>
                  <div className="text-sm text-muted-foreground mb-4">{tier.referrals} successful referrals</div>
                  <ul className="space-y-2">
                    {tier.rewards.map((reward, i) => (
                      <li key={i} className="flex items-start">
                        <div className="rounded-full bg-primary/10 p-1 mr-2 mt-0.5">
                          <ChevronRight className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm">{reward}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Rewards */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How to Redeem Your Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerRewards.map((reward, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border hover:shadow-md transition-all">
                  <div className="mb-4">
                    {reward.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{reward.name}</h3>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Success Stories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Referrer Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">JS</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">James Smith</h3>
                    <p className="text-sm text-muted-foreground">Software Engineer at Apple</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground mb-3">
                  "I earned over $5,000 in referral bonuses last year by helping my former colleagues and industry connections find opportunities at Apple. The platform made it incredibly easy to track referrals and receive rewards."
                </p>
                <div className="text-sm">
                  <span className="font-medium">Rewards earned:</span> Gold Tier ($1,000 per hire)
                </div>
              </div>
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="font-bold text-primary">LW</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Lisa Wong</h3>
                    <p className="text-sm text-muted-foreground">HR Manager at Amazon</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground mb-3">
                  "As an HR professional, I love being able to connect talented candidates with opportunities at my company. The rewards are a nice bonus, but I mostly enjoy helping others advance their careers and contributing to my company's growth."
                </p>
                <div className="text-sm">
                  <span className="font-medium">Rewards earned:</span> Platinum Tier ($2,000 per hire)
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-primary/10 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Start Earning Rewards Today</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Join our community of referrers and turn your professional network into rewards while helping others advance their careers.
            </p>
            <Link to="/register?role=referrer">
              <Button size="lg">
                Become a Referrer <ArrowRight className="ml-2 h-4 w-4" />
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

export default Rewards;
