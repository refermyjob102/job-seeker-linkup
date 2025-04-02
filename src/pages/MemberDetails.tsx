
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Mail, Briefcase, ArrowLeft } from 'lucide-react';

const MemberDetails = () => {
  const { id } = useParams();

  // Mock member data - would be replaced with API call
  const memberData = {
    id,
    name: 'John Doe',
    avatarUrl: '',
    email: 'john.doe@example.com',
    company: 'Google',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    bio: 'Experienced software engineer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications and mentoring junior developers.',
    isAvailableForReferrals: true,
    referralCount: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/members">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Members
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={memberData.avatarUrl} alt={memberData.name} />
                <AvatarFallback className="text-lg">
                  {memberData.name.split(' ').map(name => name[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {memberData.isAvailableForReferrals && (
                <Badge variant="secondary" className="mt-2">
                  Available for referrals
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{memberData.name}</h1>
              <div className="text-lg text-muted-foreground mb-4">
                {memberData.jobTitle} at {memberData.company}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-6">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{memberData.company}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{memberData.department}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{memberData.location}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{memberData.email}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button>Request Referral</Button>
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{memberData.bio}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {memberData.skills.map((skill, index) => (
              <Badge key={index} variant="outline">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">{memberData.referralCount}</div>
              <div className="text-sm text-muted-foreground">Total referrals</div>
            </div>
            <p className="text-muted-foreground">
              {memberData.name.split(' ')[0]} has provided {memberData.referralCount} referrals to job seekers in the network.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetails;
