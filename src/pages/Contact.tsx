
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, Mail, Phone, MapPin } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Contact = () => {
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
            <span className="text-foreground">Contact</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full py-2 px-4 rounded-md border border-input bg-background"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full py-2 px-4 rounded-md border border-input bg-background"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full py-2 px-4 rounded-md border border-input bg-background"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select className="w-full py-2 px-4 rounded-md border border-input bg-background">
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full py-2 px-4 rounded-md border border-input bg-background"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button className="w-full sm:w-auto">Send Message</Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="bg-card border rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@jobreferral.com</p>
                      <p className="text-muted-foreground">support@jobreferral.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-muted-foreground">Mon-Fri, 9am-5pm PT</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Office</h3>
                      <p className="text-muted-foreground">123 Tech Avenue</p>
                      <p className="text-muted-foreground">San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-card border rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">How does JobReferral work?</h3>
                    <p className="text-muted-foreground text-sm">
                      JobReferral connects job seekers with professionals at top companies who can provide referrals. Learn more on our <Link to="/how-it-works" className="text-primary hover:underline">How it Works</Link> page.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Is JobReferral free to use?</h3>
                    <p className="text-muted-foreground text-sm">
                      Job seekers can create a basic profile for free. Premium features are available with a subscription.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">How do I become a referrer?</h3>
                    <p className="text-muted-foreground text-sm">
                      Any professional can sign up as a referrer. Simply create an account and complete your profile with your current company information.
                    </p>
                  </div>
                </div>
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

export default Contact;
