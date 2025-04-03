
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Mail, Briefcase, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const MemberDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [memberData, setMemberData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      setLoading(true);
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setMemberData(data);
      } catch (error) {
        console.error('Error fetching member details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load member details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="flex items-center justify-center h-64 flex-col space-y-4">
        <h2 className="text-2xl font-bold">Member Not Found</h2>
        <p className="text-muted-foreground">The member you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Parse skills from string to array if it exists
  const skillsArray = memberData.skills ? memberData.skills.split(',').map(skill => skill.trim()) : [];

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
                <AvatarImage src={memberData.avatar_url || ''} alt={`${memberData.first_name} ${memberData.last_name}`} />
                <AvatarFallback className="text-lg">
                  {memberData.first_name?.charAt(0) || ''}
                  {memberData.last_name?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
              {memberData.available_for_referrals && (
                <Badge variant="secondary" className="mt-2">
                  Available for referrals
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{memberData.first_name} {memberData.last_name}</h1>
              <div className="text-lg text-muted-foreground mb-4">
                {memberData.job_title} {memberData.company && `at ${memberData.company}`}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm mb-6">
                {memberData.company && (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{memberData.company}</span>
                  </div>
                )}
                {memberData.department && (
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{memberData.department}</span>
                  </div>
                )}
                {memberData.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{memberData.location}</span>
                  </div>
                )}
                {memberData.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{memberData.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                {memberData.available_for_referrals && (
                  <Button>Request Referral</Button>
                )}
                <Button variant="outline">Send Message</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {memberData.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{memberData.bio}</p>
          </CardContent>
        </Card>
      )}

      {skillsArray.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Referral Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Total referrals</div>
            </div>
            <p className="text-muted-foreground">
              {memberData.first_name} hasn't provided any referrals yet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberDetails;
