import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companyService } from "@/services/companyService";
import { Company } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  companyId: z.string({
    required_error: "Please select a company",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  department: z.string().optional(),
});

interface JoinCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onCompanyJoined: () => void;
}

const JoinCompanyModal = ({
  open,
  onOpenChange,
  userId,
  onCompanyJoined
}: JoinCompanyModalProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: "",
      jobTitle: "",
      department: "",
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await companyService.getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchCompanies();
      form.reset();
    }
  }, [open, toast, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log("Joining company with values:", values);
      
      // Check if user is already a member of this company
      const isMember = await companyService.isUserMemberOfCompany(userId, values.companyId);
      
      if (isMember) {
        toast({
          title: "Info",
          description: "You are already a member of this company.",
          variant: "default",
        });
        onOpenChange(false);
        return;
      }
      
      // Step 1: Add user as a member in company_members table
      console.log("Adding user to company_members table");
      const result = await companyService.addCompanyMember(
        userId,
        values.companyId,
        values.jobTitle,
        values.department
      );

      if (result) {
        // Step 2: Update user's profile to reflect the company change
        console.log("Updating user profile with company information");
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            company: values.companyId,
            job_title: values.jobTitle,
            department: values.department
          })
          .eq('id', userId);
          
        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw profileError;
        }
        
        // Run a sync to ensure company_members and profiles are in sync
        await companyService.syncProfilesWithCompanyMembers();
        
        toast({
          title: "Success",
          description: "You have joined the company successfully.",
          variant: "default",
        });
        onCompanyJoined();
        onOpenChange(false);
      } else {
        throw new Error("Failed to join company");
      }
    } catch (error) {
      console.error("Error joining company:", error);
      toast({
        title: "Error",
        description: "Failed to join company. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a Company</DialogTitle>
          <DialogDescription>
            Select a company you work at to join their network.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Engineering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Joining..." : "Join Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCompanyModal;
