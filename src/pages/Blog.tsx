
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, CalendarDays, Clock, Building, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Blog = () => {
  // Sample blog posts
  const posts = [
    {
      id: 1,
      title: "How to Get a Referral at Google in 2023",
      excerpt: "Insider tips from current Google employees on how to effectively request and secure a referral.",
      date: "May 15, 2023",
      readTime: "8 min read",
      category: "Referral Tips",
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 2,
      title: "The Value of Networking: Why Personal Connections Matter",
      excerpt: "Research shows that referred candidates are 15 times more likely to be hired than applicants from job boards.",
      date: "April 28, 2023",
      readTime: "6 min read",
      category: "Career Advice",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 3,
      title: "Resume Tips That Will Get You Noticed by Referrers",
      excerpt: "Optimize your resume to stand out when seeking referrals from professionals at your target companies.",
      date: "April 12, 2023",
      readTime: "5 min read",
      category: "Resume Tips",
      image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 4,
      title: "Why Being a Referrer Can Boost Your Own Career",
      excerpt: "Referring quality candidates can enhance your reputation and lead to rewards at many companies.",
      date: "March 30, 2023",
      readTime: "7 min read",
      category: "For Referrers",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 5,
      title: "The Hidden Job Market: Accessing Positions Before They're Posted",
      excerpt: "Many jobs are filled through referrals before they're ever advertised. Learn how to tap into this hidden market.",
      date: "March 15, 2023",
      readTime: "9 min read",
      category: "Job Search",
      image: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
    },
    {
      id: 6,
      title: "From Referral to Offer: Success Stories from Our Platform",
      excerpt: "Real-world examples of how job seekers used JobReferral to land positions at top companies.",
      date: "February 28, 2023",
      readTime: "10 min read",
      category: "Success Stories",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"
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
            <span className="text-foreground">Blog</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-6">Blog</h1>
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <p className="text-lg text-muted-foreground mb-4 md:mb-0">
                Career insights, referral tips, and success stories
              </p>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search articles"
                  className="pl-10 py-2 pr-4 rounded-md border border-input bg-background w-full"
                />
              </div>
            </div>
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-xl">
              <Link to="/blog/1">
                <img 
                  src="https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Featured post" 
                  className="w-full h-96 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                  <span className="text-white/90 mb-2">Featured Post</span>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    The Future of Referral-Based Hiring in Tech
                  </h2>
                  <div className="flex items-center text-white/80 text-sm mb-3">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span className="mr-4">June 1, 2023</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>12 min read</span>
                  </div>
                  <p className="text-white/90 mb-4 max-w-3xl">
                    AI and automation are changing how companies hire, but the value of personal connections and referrals remains stronger than ever.
                  </p>
                  <Button variant="default" className="w-fit">Read Article</Button>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map(post => (
              <div key={post.id} className="bg-card border rounded-lg overflow-hidden group">
                <Link to={`/blog/${post.id}`}>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs mr-3">{post.category}</span>
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span className="mr-3">{post.date}</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {post.excerpt}
                    </p>
                    <Button variant="link" className="px-0 text-primary">
                      Read More
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get the latest referral tips, career advice, and platform updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-2 px-4 rounded-md border border-input bg-background"
              />
              <Button>Subscribe</Button>
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

export default Blog;
