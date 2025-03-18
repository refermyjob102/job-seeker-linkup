
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building } from "lucide-react";

interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

interface CompanySectionProps {
  userId: string;
  currentCompany?: Company;
}

export const CompanySection = ({ userId, currentCompany }: CompanySectionProps) => {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  const joinCompany = async () => {
    if (!companyName.trim() || !jobTitle.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      // First, check if company exists or create it
      let { data: company } = await supabase
        .from('companies')
        .select('*')
        .ilike('name', companyName.trim())
        .single();

      if (!company) {
        const { data: newCompany, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: companyName.trim()
          })
          .select()
          .single();

        if (companyError) throw companyError;
        company = newCompany;
      }

      // Add user as company member
      const { error: memberError } = await supabase
        .from('company_members')
        .insert({
          company_id: company.id,
          user_id: userId,
          job_title: jobTitle.trim()
        });

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: `You have joined ${companyName} as a ${jobTitle}`
      });
      
      // Reset form
      setCompanyName("");
      setJobTitle("");
    } catch (error) {
      console.error('Error joining company:', error);
      toast({
        title: "Error",
        description: "Failed to join company. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (currentCompany) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Building className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Current Company</h3>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{currentCompany.name}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Join a Company</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Input
            placeholder="Your job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <Button onClick={joinCompany} disabled={isJoining}>
          {isJoining ? "Joining..." : "Join Company"}
        </Button>
      </CardContent>
    </Card>
  );
};
