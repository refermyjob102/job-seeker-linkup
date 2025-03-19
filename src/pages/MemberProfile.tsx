
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Briefcase, 
  Building, 
  Calendar, 
  Users, 
  Award, 
  Star,
  ExternalLink, 
  Clock,
  GraduationCap,
  Globe,
  Heart,
  Languages
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { getCompanyNameById } from "@/data/topCompanies";

// Mock user data - similar structure as the AuthContext but with more profile details
const userData = [
  {
    id: "1",
    email: "john@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "seeker",
    location: "San Francisco, CA",
    avatar_url: "https://github.com/shadcn.png",
    bio: "Software developer with 5 years of experience in React and Node.js. Looking for opportunities in tech companies.",
    skills: "React, TypeScript, Node.js, GraphQL, AWS",
    education: "B.S. Computer Science, University of California, Berkeley (2014 - 2018)",
    languages: "English, Spanish",
    interests: "Hiking, Photography, Machine Learning",
    job_title: "Software Developer",
    company: "1",
    department: "Engineering",
    years_experience: "5",
    open_to_work: true,
    linkedin_url: "https://linkedin.com/in/johndoe",
    github_url: "https://github.com/johndoe",
    twitter_url: "https://twitter.com/johndoe",
    website_url: "https://johndoe.com"
  },
  {
    id: "2",
    email: "jane@google.com",
    first_name: "Jane",
    last_name: "Smith",
    role: "referrer",
    company: "2",
    job_title: "Senior Software Engineer",
    department: "Engineering",
    location: "Mountain View, CA",
    avatar_url: "https://i.pravatar.cc/150?img=2",
    bio: "I help teams build great products at Google. Previously worked at Meta and Amazon. I'm passionate about mentoring and helping others break into tech.",
    skills: "Python, Machine Learning, Cloud Infrastructure, Java, Kubernetes",
    education: "M.S. Computer Science, Stanford University (2014 - 2016)\nB.S. Computer Science, University of Washington (2010 - 2014)",
    languages: "English, French, German",
    interests: "AI, Travel, Tennis",
    years_experience: "7",
    available_for_referrals: true,
    referralStats: {
      total: 15,
      successRate: 85,
      availableSpots: 3,
      eligibility: "Open to referrals",
    },
    referralPreferences: {
      lookingFor: "Strong software engineers with experience in distributed systems, machine learning, or full-stack development. Open to referring new grads with exceptional projects.",
      resume: "Please share a tailored resume highlighting relevant experience and skills. Make sure it's ATS-friendly.",
      process: "I review all requests within 7 days. If I think you're a good fit, I'll schedule a 30-minute chat before submitting your referral."
    },
    linkedin_url: "https://linkedin.com/in/janesmith",
    github_url: "https://github.com/janesmith",
    twitter_url: "https://twitter.com/janesmith",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Google",
        period: "2019 - Present",
        description: "Working on cloud infrastructure and distributed systems."
      },
      {
        title: "Software Engineer",
        company: "Meta",
        period: "2016 - 2019",
        description: "Developed backend systems for content delivery and recommendation algorithms."
      },
      {
        title: "Software Engineering Intern",
        company: "Amazon",
        period: "Summer 2015",
        description: "Worked on AWS EC2 service improvements."
      }
    ],
    testimonials: [
      {
        name: "Alex Johnson",
        position: "Software Engineer at Google",
        text: "Jane referred me to Google and was incredibly helpful throughout the process. She took the time to review my resume and prep me for interviews. Couldn't have done it without her!",
        date: "3 months ago"
      },
      {
        name: "Sarah Williams",
        position: "Product Manager at Google",
        text: "Jane is an amazing referrer! She gave me valuable insights about the company culture and team dynamics. Her referral definitely made a difference in my application.",
        date: "6 months ago"
      }
    ]
  },
  {
    id: "3",
    email: "alex@meta.com",
    first_name: "Alex",
    last_name: "Johnson",
    role: "referrer",
    company: "3",
    job_title: "Product Manager",
    department: "Product",
    location: "Menlo Park, CA",
    avatar_url: "https://i.pravatar.cc/150?img=3",
    bio: "Product Manager at Meta focused on user experience and growth. I enjoy connecting talented individuals with opportunities at Meta.",
    skills: "Product Management, UX Design, Data Analysis, Growth Strategy, A/B Testing",
    education: "MBA, Harvard Business School (2017 - 2019)\nB.S. Computer Science, MIT (2013 - 2017)",
    languages: "English, Mandarin",
    interests: "Product Design, Startups, Cooking",
    years_experience: "5",
    available_for_referrals: true,
    referralStats: {
      total: 12,
      successRate: 75,
      availableSpots: 2,
      eligibility: "Selective referrals",
    },
    referralPreferences: {
      lookingFor: "Product managers, designers, and engineers with a passion for social products. Especially interested in candidates with growth experience.",
      resume: "Please share your resume along with a brief explanation of why you're interested in Meta and which team you're targeting.",
      process: "I review applications weekly and will reach out for a 15-minute call if I think there's a potential fit."
    },
    linkedin_url: "https://linkedin.com/in/alexjohnson",
    twitter_url: "https://twitter.com/alexjohnson",
    experience: [
      {
        title: "Product Manager",
        company: "Meta",
        period: "2020 - Present",
        description: "Leading product strategy and development for user growth initiatives."
      },
      {
        title: "Associate Product Manager",
        company: "Google",
        period: "2019 - 2020",
        description: "Worked on YouTube growth and engagement features."
      }
    ],
    testimonials: [
      {
        name: "Michael Brown",
        position: "Software Engineer at Meta",
        text: "Alex was incredibly helpful during my application process. Their insights into the company culture and interview process were invaluable.",
        date: "2 months ago"
      }
    ]
  }
];

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find user by ID
    setLoading(true);
    const foundUser = userData.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
    setLoading(false);
  }, [id]);

  const handleRequestReferral = () => {
    setRequestSent(true);
    // In a real app, would send API request here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
          <p className="text-muted-foreground mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isReferrer = user.role === "referrer";
  const companyName = user.company ? getCompanyNameById(user.company) : "";
  
  // Parse skills, interests and languages if they exist
  const skills = user.skills ? user.skills.split(',').map((s: string) => s.trim()) : [];
  const interests = user.interests ? user.interests.split(',').map((i: string) => i.trim()) : [];
  const languages = user.languages ? user.languages.split(',').map((l: string) => l.trim()) : [];

  return (
    <div className="space-y-6">
      <Link to={isReferrer && companyName ? `/app/companies/${user.company}` : "/app/companies"} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to {isReferrer && companyName ? companyName : "Companies"}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                <AvatarFallback>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.first_name} {user.last_name}</CardTitle>
              <CardDescription>{user.job_title || "Job Seeker"}</CardDescription>
              
              <div className="flex items-center mt-2 gap-2">
                <Badge className={`${isReferrer ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"}`}>
                  {isReferrer ? "Referrer" : "Job Seeker"}
                </Badge>
                {isReferrer && user.referralStats?.eligibility && (
                  <Badge variant="outline">{user.referralStats.eligibility}</Badge>
                )}
                {!isReferrer && user.open_to_work && (
                  <Badge variant="outline">Open to Work</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm">{user.bio}</p>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                {user.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {companyName && (
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{companyName}{user.department ? ` • ${user.department}` : ''}</span>
                  </div>
                )}
                
                {user.years_experience && (
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{user.years_experience} {parseInt(user.years_experience) === 1 ? 'year' : 'years'} of experience</span>
                  </div>
                )}
              </div>
              
              {isReferrer && user.referralStats && (
                <>
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Referral Stats</h3>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Referrals</span>
                      <Badge variant="outline" className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {user.referralStats.total}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium">{user.referralStats.successRate}%</span>
                      </div>
                      <Progress value={user.referralStats.successRate} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available Spots</span>
                      <Badge variant="outline" className="flex items-center">
                        {user.referralStats.availableSpots} remaining
                      </Badge>
                    </div>
                  </div>
                </>
              )}
              
              <Separator />
              
              {/* Social Links */}
              <div className="flex justify-between">
                {user.linkedin_url && (
                  <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {user.github_url && (
                  <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}
                {user.twitter_url && (
                  <a href={user.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                )}
                {user.website_url && (
                  <a href={user.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z"/>
                    </svg>
                  </a>
                )}
              </div>
              
              {isReferrer && (
                <div className="pt-2 space-y-2">
                  {!requestSent ? (
                    <Button className="w-full" onClick={handleRequestReferral}>
                      <Mail className="h-4 w-4 mr-2" />
                      Request Referral
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      <span className="text-green-600">✓</span>
                      <span className="ml-2">Request Sent</span>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/app/chat/${user.id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Skills Card */}
          {skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Languages Card */}
          {languages.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Languages className="h-4 w-4 mr-2" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language: string, index: number) => (
                    <Badge key={index} variant="secondary">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Interests Card */}
          {interests.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Referral Preferences Card (if referrer) */}
          {isReferrer && user.referralPreferences && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Referral Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Looking for</h3>
                  <p className="text-sm text-muted-foreground">{user.referralPreferences.lookingFor}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Resume Requirements</h3>
                  <p className="text-sm text-muted-foreground">{user.referralPreferences.resume}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Process</h3>
                  <p className="text-sm text-muted-foreground">{user.referralPreferences.process}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="experience">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              {isReferrer && <TabsTrigger value="testimonials">Testimonials</TabsTrigger>}
            </TabsList>
            
            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.experience ? (
                    user.experience.map((job: any, index: number) => (
                      <div key={index} className="border p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Building className="h-3 w-3 mr-1" /> 
                              {job.company}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" /> 
                            {job.period}
                          </p>
                        </div>
                        <p className="mt-2 text-sm">{job.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No experience listed</h3>
                      <p className="text-muted-foreground">
                        This user hasn't added any experience details yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Education Tab */}
            <TabsContent value="education" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.education ? (
                    <div className="border p-4 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-muted h-12 w-12 rounded-md flex items-center justify-center mr-4 mt-1">
                          <GraduationCap className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="whitespace-pre-wrap">
                          {user.education}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No education listed</h3>
                      <p className="text-muted-foreground">
                        This user hasn't added any education details yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Testimonials Tab (only for referrers) */}
            {isReferrer && (
              <TabsContent value="testimonials" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Testimonials</CardTitle>
                    <CardDescription>
                      From candidates who received referrals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {user.testimonials?.length ? (
                      user.testimonials.map((testimonial: any, index: number) => (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="flex items-start gap-2 mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {testimonial.date}
                            </div>
                          </div>
                          <p className="text-sm">{testimonial.text}</p>
                          <div className="flex mt-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No testimonials yet</h3>
                        <p className="text-sm text-muted-foreground">
                          This referrer doesn't have any testimonials yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
