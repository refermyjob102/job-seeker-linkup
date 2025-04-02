
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock members data - would be replaced with actual API data
  const mockMembers = [
    {
      id: '1',
      name: 'John Doe',
      avatarUrl: '',
      company: 'Google',
      jobTitle: 'Software Engineer',
      location: 'San Francisco, CA',
      isAvailableForReferrals: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      avatarUrl: '',
      company: 'Apple',
      jobTitle: 'Product Designer',
      location: 'New York, NY',
      isAvailableForReferrals: true,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      avatarUrl: '',
      company: 'Microsoft',
      jobTitle: 'Data Scientist',
      location: 'Seattle, WA',
      isAvailableForReferrals: false,
    },
  ];

  // Filter members based on search term
  const filteredMembers = mockMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Network Members</h1>
        <p className="text-muted-foreground">
          Connect with members who can refer you to jobs
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, company, or job title..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map(name => name[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-medium">{member.name}</h3>
                      {member.isAvailableForReferrals && (
                        <Badge variant="secondary" className="w-fit">Available for referrals</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-3">
                        <div className="flex items-center">
                          <Building className="mr-1 h-4 w-4" />
                          {member.company} • {member.jobTitle}
                        </div>
                        {member.location && (
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {member.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Link to={`/app/members/${member.id}`}>
                      <Button variant="outline">View Profile</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Members;
