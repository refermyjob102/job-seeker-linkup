
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Gift, Star, Trophy, DollarSign } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const Rewards = () => {
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
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Referrer Rewards Program</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get recognized and rewarded for helping talented professionals advance their careers through your referrals.
            </p>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-primary to-primary-foreground/30 text-white rounded-lg p-8 mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-4">Earn While You Help Others</h2>
                <p className="mb-4">
                  Our referral rewards program is designed to recognize your contribution to both our community and your company's growth. Earn points, badges, and even cash rewards for successful referrals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/register?role=referrer">
                    <Button variant="default" className="bg-white text-primary hover:bg-white/90">
                      Join as a Referrer
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <Gift className="h-28 w-28 text-white/90" />
              </div>
            </div>
          </div>

          {/* How It Works */}
          <h2 className="text-2xl font-bold mb-6 text-center">How Our Rewards Program Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3">Earn Points</h3>
                <p className="text-muted-foreground text-sm">
                  Accumulate points for every referral, with bonus points for candidates who receive interviews and offers.
                </p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3">Unlock Badges</h3>
                <p className="text-muted-foreground text-sm">
                  Earn exclusive badges that showcase your expertise and commitment on your profile.
                </p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3">Redeem Rewards</h3>
                <p className="text-muted-foreground text-sm">
                  Convert your points to gift cards, premium memberships, or donate to charity.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Points System */}
          <div className="bg-card border rounded-lg p-8 mb-16">
            <h2 className="text-xl font-bold mb-6">Points System</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Submitting a referral</TableCell>
                  <TableCell className="text-right">50 points</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Candidate receives an interview</TableCell>
                  <TableCell className="text-right">100 points</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Candidate receives an offer</TableCell>
                  <TableCell className="text-right">250 points</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Candidate accepts offer</TableCell>
                  <TableCell className="text-right">500 points</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Positive candidate feedback</TableCell>
                  <TableCell className="text-right">50 points</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Badge Levels */}
          <h2 className="text-2xl font-bold mb-6 text-center">Badge Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {['Bronze', 'Silver', 'Gold', 'Platinum'].map((level, index) => (
              <div key={level} className="bg-card border rounded-lg p-6 text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  level === 'Bronze' ? 'bg-amber-700/20' :
                  level === 'Silver' ? 'bg-gray-300/20' :
                  level === 'Gold' ? 'bg-yellow-500/20' :
                  'bg-slate-400/20'
                }`}>
                  <Trophy className={`h-8 w-8 ${
                    level === 'Bronze' ? 'text-amber-700' :
                    level === 'Silver' ? 'text-gray-400' :
                    level === 'Gold' ? 'text-yellow-500' :
                    'text-slate-400'
                  }`} />
                </div>
                <h3 className="font-bold mb-2">{level} Referrer</h3>
                <p className="text-muted-foreground text-sm">{(index + 1) * 5} successful referrals</p>
              </div>
            ))}
          </div>

          {/* Reward Options */}
          <div className="bg-card border rounded-lg p-8 mb-16">
            <h2 className="text-xl font-bold mb-6 text-center">Reward Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Gift Cards</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Exchange your points for gift cards from popular retailers and restaurants.
                </p>
                <div className="text-sm font-medium">1,000 points = $25 gift card</div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Premium Membership</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Upgrade to a premium JobReferral membership with enhanced features.
                </p>
                <div className="text-sm font-medium">2,000 points = 3 months premium</div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Charity Donation</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Convert your points to donations for charitable organizations.
                </p>
                <div className="text-sm font-medium">1,000 points = $30 donation</div>
              </div>
            </div>
          </div>

          {/* Top Referrers */}
          <h2 className="text-2xl font-bold mb-6 text-center">Top Referrers This Month</h2>
          <div className="bg-card border rounded-lg p-6 mb-16">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Successful Referrals</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {name: "Alex Johnson", company: "Google", referrals: 7, points: 4350},
                  {name: "Sarah Chen", company: "Microsoft", referrals: 6, points: 3800},
                  {name: "David Kim", company: "Meta", referrals: 5, points: 3200},
                  {name: "Lisa Parker", company: "Amazon", referrals: 4, points: 2750},
                  {name: "James Wilson", company: "Apple", referrals: 4, points: 2500},
                ].map((person, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.company}</TableCell>
                    <TableCell>{person.referrals}</TableCell>
                    <TableCell className="text-right">{person.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* CTA */}
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Start Earning Rewards Today</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our referrer community and help talented professionals while earning rewards for your valuable contributions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=referrer">
                <Button size="lg">
                  Become a Referrer
                </Button>
              </Link>
              <Link to="/why-refer">
                <Button size="lg" variant="outline">
                  Learn More Benefits
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

export default Rewards;
