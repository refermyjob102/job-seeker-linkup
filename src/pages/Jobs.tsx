
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Building, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Jobs = () => {
  // Mock job data - this would be replaced with actual API data in a real implementation
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      type: 'Full-time',
      postedAt: '2 days ago',
    },
    {
      id: '2',
      title: 'Product Designer',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Full-time',
      postedAt: '1 week ago',
    },
    {
      id: '3',
      title: 'Data Scientist',
      company: 'Microsoft',
      location: 'Remote',
      type: 'Contract',
      postedAt: '3 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        <p className="text-muted-foreground">
          Browse open positions and request referrals
        </p>
      </div>

      <div className="grid gap-4">
        {mockJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Building className="mr-1 h-4 w-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Posted {job.postedAt}
                    </div>
                  </div>
                  <Badge variant={job.type === 'Full-time' ? 'default' : 'outline'}>
                    {job.type}
                  </Badge>
                </div>
                <div className="flex items-start">
                  <Link to={`/app/jobs/${job.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
