
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Members = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Profile[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setMembers(data);
          setFilteredMembers(data);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load members. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  useEffect(() => {
    // Filter members based on search term
    const filtered = members.filter(
      (member) =>
        (member.first_name && member.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.last_name && member.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.company && member.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.job_title && member.job_title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

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
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url || ''} alt={`${member.first_name || ''} ${member.last_name || ''}`} />
                    <AvatarFallback>
                      {member.first_name ? member.first_name.charAt(0) : ''}
                      {member.last_name ? member.last_name.charAt(0) : ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium">
                          {member.first_name} {member.last_name}
                        </h3>
                        {member.available_for_referrals && (
                          <Badge variant="secondary" className="w-fit">Available for referrals</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-3">
                          {(member.company || member.job_title) && (
                            <div className="flex items-center">
                              <Building className="mr-1 h-4 w-4" />
                              {member.company && `${member.company}`} 
                              {member.company && member.job_title && " • "}
                              {member.job_title && `${member.job_title}`}
                            </div>
                          )}
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
          ))
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">No members found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
