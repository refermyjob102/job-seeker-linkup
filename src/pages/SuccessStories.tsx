
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Star, Quote } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "David Chen",
      position: "Software Engineer at Google",
      image: "https://i.pravatar.cc/150?img=11",
      company: "Google",
      story: "After applying to Google for 2 years with no response, I connected with a Senior Engineer through JobReferral. He submitted my resume internally and I got a call from a recruiter the next day. Three weeks later, I had an offer!",
      results: "From 0 interviews to hired in 4 weeks",
      rating: 5
    },
    {
      id: 2,
      name: "Priya Sharma",
      position: "Product Manager at Amazon",
      image: "https://i.pravatar.cc/150?img=26",
      company: "Amazon",
      story: "I was switching industries from finance to tech, which is notoriously difficult without relevant experience. Through JobReferral, I found a PM who saw potential in my transferable skills and recommended me for an interview. His referral helped the hiring manager take a chance on me.",
      results: "Successfully transitioned careers",
      rating: 5
    },
    {
      id: 3,
      name: "Marcus Johnson",
      position: "Data Scientist at Meta",
      image: "https://i.pravatar.cc/150?img=53",
      company: "Meta",
      story: "As a recent graduate with no industry experience, getting noticed was nearly impossible. A referrer on this platform not only submitted my application but also prepped me for the interviews. Their insights into Meta's culture and interview process were invaluable.",
      results: "Entry-level position at a top tech company",
      rating: 5
    },
    {
      id: 4,
      name: "Sophia Rodriguez",
      position: "UX Designer at Apple",
      image: "https://i.pravatar.cc/150?img=33",
      company: "Apple",
      story: "I had a strong portfolio but wasn't getting any responses. Through JobReferral, I connected with a design manager who appreciated my work. She introduced me to the hiring team and advocated for me throughout the interview process.",
      results: "Landed dream role at Apple",
      rating: 5
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
            <span className="text-foreground">Success Stories</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real people, real referrals, real results. See how JobReferral has helped professionals land their dream jobs.
            </p>
          </div>

          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">8,500+</div>
                <p className="text-muted-foreground">Successful Referrals</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">87%</div>
                <p className="text-muted-foreground">Interview Rate with Referrals</p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">32%</div>
                <p className="text-muted-foreground">Higher Offer Rate</p>
              </div>
            </div>

            {/* Stories */}
            {stories.map((story, index) => (
              <div key={story.id} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                <div className="md:w-1/3">
                  <div className="bg-card border rounded-lg p-6 text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{story.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{story.position}</p>
                    <div className="flex justify-center mb-3">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-primary">{story.results}</p>
                  </div>
                </div>
                <div className="md:w-2/3 bg-card border rounded-lg p-8">
                  <div className="flex items-start mb-4">
                    <Quote className="w-10 h-10 text-primary/20 mr-4 flex-shrink-0" />
                    <p className="italic text-muted-foreground">{story.story}</p>
                  </div>
                  <div className="flex justify-end">
                    <img 
                      src={`/placeholder.svg`} 
                      alt={story.company} 
                      className="h-8" 
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="bg-primary/10 rounded-lg p-8 text-center mt-16">
              <h2 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of professionals who found their way to top companies through JobReferral.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg">
                    Sign Up Now
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
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

export default SuccessStories;
