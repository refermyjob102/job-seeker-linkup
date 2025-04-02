
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileCode,
  Globe,
  Calendar,
  LinkedinIcon,
  GithubIcon,
  TwitterIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const MemberDetails = () => {
  const { id } = useParams();
  
  // Mock data for the member - would be replaced with API call based on id
  const mockMember = {
    id: id || '1',
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: '',
    email: 'john.doe@example.com',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Experienced software engineer with a focus on frontend development. I love building user-friendly interfaces and solving complex problems.',
    yearsExperience: '8',
    education: 'MS Computer Science, Stanford University',
    skills: 'JavaScript, React, TypeScript, Node.js, GraphQL',
    languages: 'English (Native), Spanish (Conversational)',
    interests: 'Open source, UX design, Hiking, Photography',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    twitterUrl: 'https://twitter.com/johndoe',
    websiteUrl: 'https://johndoe.com',
    isAvailableForReferrals: true,
    joinedAt: '2023-01-15'
  };

  // Format the full name
  const fullName = `${mockMember.firstName} ${mockMember.lastName}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
          <p className="text-muted-foreground">
            Member profile
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Message</Button>
          <Button>Request Referral</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main profile info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Member information and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockMember.avatarUrl} alt={fullName} />
                <AvatarFallback className="text-lg">
                  {mockMember.firstName[0]}{mockMember.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{fullName}</h2>
                <div className="flex items-center text-muted-foreground mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  {mockMember.company} • {mockMember.jobTitle}
                </div>
                {mockMember.location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {mockMember.location}
                  </div>
                )}
                <div className="mt-2">
                  {mockMember.isAvailableForReferrals && (
                    <Badge variant="secondary">Available for referrals</Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {mockMember.bio && (
              <div>
                <h3 className="font-medium mb-2">About</h3>
                <p>{mockMember.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockMember.yearsExperience && (
                <div className="flex items-start gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Experience</h4>
                    <p className="text-sm text-muted-foreground">{mockMember.yearsExperience} years</p>
                  </div>
                </div>
              )}

              {mockMember.education && (
                <div className="flex items-start gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Education</h4>
                    <p className="text-sm text-muted-foreground">{mockMember.education}</p>
                  </div>
                </div>
              )}

              {mockMember.joinedAt && (
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Joined</h4>
                    <p className="text-sm text-muted-foreground">{new Date(mockMember.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {mockMember.department && (
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Department</h4>
                    <p className="text-sm text-muted-foreground">{mockMember.department}</p>
                  </div>
                </div>
              )}
            </div>

            {mockMember.skills && (
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {mockMember.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="outline" className="whitespace-nowrap">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {mockMember.languages && (
              <div>
                <h3 className="font-medium mb-2">Languages</h3>
                <p className="text-sm text-muted-foreground">{mockMember.languages}</p>
              </div>
            )}

            {mockMember.interests && (
              <div>
                <h3 className="font-medium mb-2">Interests</h3>
                <p className="text-sm text-muted-foreground">{mockMember.interests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Side panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{mockMember.email}</span>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Social Profiles</h3>
                {mockMember.linkedinUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={mockMember.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <LinkedinIcon className="mr-2 h-4 w-4" />
                      LinkedIn
                      <ExternalLinkIcon className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
                {mockMember.githubUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={mockMember.githubUrl} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="mr-2 h-4 w-4" />
                      GitHub
                      <ExternalLinkIcon className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
                {mockMember.twitterUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={mockMember.twitterUrl} target="_blank" rel="noopener noreferrer">
                      <TwitterIcon className="mr-2 h-4 w-4" />
                      Twitter
                      <ExternalLinkIcon className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                )}
                
                {mockMember.websiteUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to={mockMember.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Website
                      <ExternalLinkIcon className="ml-auto h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-muted rounded-md p-2 h-10 w-10 flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{mockMember.company}</h3>
                  <p className="text-sm text-muted-foreground">{mockMember.jobTitle}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/app/companies/1`}>
                  View Company
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
