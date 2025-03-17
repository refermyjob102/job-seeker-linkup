
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Globe, BadgeCheck, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Partners = () => {
  const partnerCompanies = [
    {
      id: 1,
      name: "Google",
      logo: "/placeholder.svg",
      description: "A leading technology company specializing in internet-related services and products.",
      activeReferrers: 423,
      openPositions: 156
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "/placeholder.svg",
      description: "A multinational technology corporation that develops, manufactures, licenses, supports, and sells computer software and hardware.",
      activeReferrers: 387,
      openPositions: 203
    },
    {
      id: 3,
      name: "Amazon",
      logo: "/placeholder.svg",
      description: "An American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
      activeReferrers: 516,
      openPositions: 289
    },
    {
      id: 4,
      name: "Apple",
      logo: "/placeholder.svg",
      description: "An American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.",
      activeReferrers: 352,
      openPositions: 118
    },
    {
      id: 5,
      name: "Meta",
      logo: "/placeholder.svg",
      description: "A technology conglomerate specializing in social media platforms and virtual reality technologies.",
      activeReferrers: 298,
      openPositions: 175
    },
    {
      id: 6,
      name: "Netflix",
      logo: "/placeholder.svg",
      description: "An American subscription streaming service and production company offering a library of films and television series.",
      activeReferrers: 187,
      openPositions: 83
    },
    {
      id: 7,
      name: "Tesla",
      logo: "/placeholder.svg",
      description: "An American electric vehicle and clean energy company that designs and manufactures electric cars, battery energy storage, solar panels, and more.",
      activeReferrers: 224,
      openPositions: 129
    },
    {
      id: 8,
      name: "Salesforce",
      logo: "/placeholder.svg",
      description: "An American cloud-based software company that provides customer relationship management service and enterprise applications.",
      activeReferrers: 176,
      openPositions: 92
    }
  ];

  const benefits = [
    {
      title: "Access Top Talent",
      description: "Connect with pre-screened, motivated candidates interested in your company."
    },
    {
      title: "Reduce Hiring Costs",
      description: "Lower your cost per hire by leveraging employee referrals."
    },
    {
      title: "Faster Time-to-Hire",
      description: "Fill positions more quickly with candidates who are ready to interview."
    },
    {
      title: "Higher Retention Rates",
      description: "Enjoy longer employee tenure with referred candidates."
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
            <span className="text-foreground">Partner Companies</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Our Partner Companies</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with leading companies that actively participate in our referral network.
            </p>
          </div>

          {/* Featured Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {partnerCompanies.slice(0, 4).map((company) => (
              <div key={company.id} className="bg-card rounded-lg border hover:shadow-md transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <img src={company.logo} alt={company.name} className="h-12" />
                  </div>
                  <h3 className="font-bold text-center mb-2">{company.name}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4 line-clamp-2">{company.description}</p>
                  <div className="flex justify-between text-sm pt-3 border-t">
                    <span>{company.activeReferrers} Referrers</span>
                    <span>{company.openPositions} Jobs</span>
                  </div>
                </div>
                <div className="bg-muted p-3 text-center">
                  <Link to="/login">
                    <Button variant="link" className="text-primary font-medium">
                      View Opportunities <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Why Partner With Us */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Why Companies Partner With Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-lg p-6 border flex">
                  <BadgeCheck className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Partners */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">All Partner Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partnerCompanies.map((company) => (
                <Link key={company.id} to="/login" className="bg-card group hover:bg-muted/50 rounded-lg p-4 border flex items-center">
                  <img src={company.logo} alt={company.name} className="h-8 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-medium">{company.name}</h3>
                    <p className="text-xs text-muted-foreground">{company.openPositions} open positions</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Become a Partner */}
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Become a Partner Company</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Is your company looking to improve its hiring process? Join our network of partner companies to access top talent through employee referrals.
            </p>
            <Link to="/contact?subject=partnership">
              <Button size="lg">
                Contact Us About Partnership
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

export default Partners;
