
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, Calendar, Clock, ChevronRight, Share2, BookmarkIcon, ThumbsUp, MessageSquare } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BlogPost = () => {
  const { id } = useParams();
  
  // Mock blog posts data - in a real app, you would fetch this from an API
  const posts = [
    {
      id: "1",
      title: "How to Get a Referral at Google in 2023",
      excerpt: "Insider tips from current Google employees on how to effectively request and secure a referral.",
      content: `
        <p>Getting a referral at Google can significantly increase your chances of landing an interview. In fact, referred candidates are 8 times more likely to be hired than those who apply through the standard application process.</p>
        
        <h2>Why Referrals Matter at Google</h2>
        <p>Google receives millions of applications each year, making it difficult for recruiters to review each one thoroughly. A referral helps your application stand out and provides an internal advocate for your candidacy.</p>
        
        <h2>Who Can Refer You?</h2>
        <p>Current Google employees at any level can refer you. While referrals from senior employees might carry more weight, any referral is valuable. The most important factor is that the person referring you can speak to your skills and potential fit.</p>
        
        <h2>How to Ask for a Referral</h2>
        <p>When approaching someone for a referral, be specific about the role you're interested in and why you think you're a good fit. Provide your resume and any relevant portfolio links to make it easy for them to submit your referral.</p>
        
        <p>Here's a template you can use:</p>
        <blockquote>
          Hi [Name],<br/><br/>
          I hope this message finds you well. I've been following your work at Google and am impressed by [specific project or achievement].<br/><br/>
          I'm interested in applying for the [specific role] position at Google, and I believe my experience in [relevant skills/experience] aligns well with what the team is looking for. Would you be willing to refer me for this position?<br/><br/>
          I've attached my resume and some links to my work for your reference. I'd be happy to provide any additional information you might need for the referral process.<br/><br/>
          Thank you for considering my request.<br/><br/>
          Best,<br/>
          [Your Name]
        </blockquote>
        
        <h2>What Happens After a Referral</h2>
        <p>Once you've been referred, a recruiter will review your application. This doesn't guarantee an interview, but it does increase your chances. If selected, you'll go through Google's standard interview process, which typically includes:</p>
        <ul>
          <li>An initial phone screen</li>
          <li>Technical interviews</li>
          <li>Onsite interviews (or virtual equivalents)</li>
        </ul>
        
        <h2>Tips for Success</h2>
        <ul>
          <li>Research the specific team and role you're interested in</li>
          <li>Prepare your resume and LinkedIn profile to highlight relevant experience</li>
          <li>Don't ask strangers for referrals - build genuine connections first</li>
          <li>Be respectful of the referrer's time and position</li>
          <li>Express gratitude regardless of the outcome</li>
        </ul>
        
        <p>Remember that a referral is just one part of the application process. You'll still need to demonstrate your skills and fit during the interview stages.</p>
      `,
      date: "May 15, 2023",
      readTime: "8 min read",
      category: "Referral Tips",
      author: {
        name: "Alex Johnson",
        role: "Recruitment Specialist",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: "2",
      title: "The Value of Networking: Why Personal Connections Matter",
      excerpt: "Research shows that referred candidates are 15 times more likely to be hired than applicants from job boards.",
      content: `
        <p>In today's competitive job market, who you know can be just as important as what you know. Personal connections and professional networks play a crucial role in career advancement and job opportunities.</p>
        
        <h2>The Power of Weak Ties</h2>
        <p>Sociologist Mark Granovetter's research reveals that "weak ties" - acquaintances rather than close friends - often provide the most valuable job connections. These relationships bridge different social circles, exposing you to opportunities you might not otherwise encounter.</p>
        
        <h2>Why Employers Value Referrals</h2>
        <p>From an employer's perspective, referrals offer several advantages:</p>
        <ul>
          <li>Lower recruitment costs compared to traditional hiring methods</li>
          <li>Faster hiring process and reduced time-to-fill positions</li>
          <li>Higher quality candidates who have been pre-vetted by current employees</li>
          <li>Better cultural fit, leading to improved retention rates</li>
          <li>Reduced risk of making a bad hire</li>
        </ul>
        
        <h2>Building Your Network Authentically</h2>
        <p>Effective networking isn't about collecting as many connections as possible. Instead, focus on building genuine relationships based on mutual interest and value exchange.</p>
        
        <p>Try these approaches:</p>
        <ul>
          <li>Attend industry events and professional meetups</li>
          <li>Engage meaningfully on professional social platforms</li>
          <li>Offer help before asking for favors</li>
          <li>Follow up consistently with new connections</li>
          <li>Share knowledge and insights that benefit your network</li>
        </ul>
        
        <h2>Leveraging Your Network for Job Opportunities</h2>
        <p>When you're ready to tap into your network for job opportunities, be strategic and respectful:</p>
        <ul>
          <li>Be specific about the roles you're seeking</li>
          <li>Make it easy for connections to help you by providing a current resume and clear information</li>
          <li>Respect boundaries and understand that not everyone will be able to assist</li>
          <li>Express genuine gratitude for any help received</li>
          <li>Offer to reciprocate when possible</li>
        </ul>
        
        <h2>The Numbers Don't Lie</h2>
        <p>According to recent studies:</p>
        <ul>
          <li>70% of jobs are never published publicly</li>
          <li>85% of critical positions are filled through networking</li>
          <li>Referred candidates are 15 times more likely to be hired than job board applicants</li>
          <li>Referred employees stay at companies longer and report higher job satisfaction</li>
        </ul>
        
        <p>In conclusion, while skills and qualifications remain essential, the path to your next opportunity often runs through the people you know. Investing time in building and maintaining your professional network can yield dividends throughout your career journey.</p>
      `,
      date: "April 28, 2023",
      readTime: "6 min read",
      category: "Career Advice",
      author: {
        name: "Sophia Chen",
        role: "Career Coach",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
    }
  ];
  
  // Find the blog post with the matching ID
  const post = posts.find(post => post.id === id);
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Blog post header */}
          <div className="mb-10">
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs mr-3">{post.category}</span>
              <Calendar className="h-3 w-3 mr-1" />
              <span className="mr-3">{post.date}</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>
            
            {/* Author info */}
            <div className="flex items-center mb-8">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">{post.author.role}</p>
              </div>
            </div>
          </div>
          
          {/* Featured image */}
          <div className="mb-10">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-[400px] object-cover rounded-xl"
            />
          </div>
          
          {/* Blog content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Social sharing and actions */}
          <div className="flex flex-wrap items-center justify-between border-t border-b py-6 mb-10">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Was this article helpful?</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">👍</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">👎</Button>
            </div>
          </div>
          
          {/* Comments section placeholder */}
          <div className="border rounded-lg p-6 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Comments (12)</h3>
              <Button variant="outline" size="sm" className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              <p>Sign in to view and post comments</p>
              <Link to="/login" className="mt-4 inline-block">
                <Button>Log in to comment</Button>
              </Link>
            </div>
          </div>
          
          {/* Related articles placeholder */}
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.filter(p => p.id !== id).slice(0, 2).map(relatedPost => (
                <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="group">
                  <div className="bg-card border rounded-lg overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Back to blog button */}
          <div className="text-center">
            <Link to="/blog">
              <Button variant="outline">Back to All Articles</Button>
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

export default BlogPost;
