
import { supabase } from "@/integrations/supabase/client";
import { Company, CompanyMember, Profile } from "@/types/database";

interface CompanyMemberWithProfile extends CompanyMember {
  profiles: Profile;
}

class CompanyService {
  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Company;
    } catch (error) {
      console.error('Error fetching company:', error);
      return null;
    }
  }

  /**
   * Get members of a company with their profiles
   */
  async getCompanyMembers(companyId: string): Promise<CompanyMemberWithProfile[]> {
    try {
      // First get members from company_members table
      const { data: membersData, error: membersError } = await supabase
        .from('company_members')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .eq('company_id', companyId);

      if (membersError) throw membersError;
      
      // Now also get profiles that have this company but aren't in company_members
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('company', companyId)
        .not('id', 'in', membersData.map(m => m.user_id).filter(Boolean));
      
      if (profilesError) throw profilesError;
      
      // Convert profiles to CompanyMemberWithProfile format
      const profileMembers = profilesData.map(profile => ({
        id: crypto.randomUUID(), // Generate a temporary ID
        user_id: profile.id,
        company_id: companyId,
        job_title: profile.job_title || 'Member',
        department: profile.department,
        joined_at: profile.created_at,
        profiles: profile
      }));
      
      // Add these profiles to company_members for future reference
      if (profileMembers.length > 0) {
        const membersToAdd = profileMembers.map(m => ({
          user_id: m.user_id,
          company_id: companyId,
          job_title: m.job_title,
          department: m.department
        }));
        
        await supabase.from('company_members').insert(membersToAdd);
      }
      
      // Combine both lists
      return [...membersData, ...profileMembers] as CompanyMemberWithProfile[];
    } catch (error) {
      console.error('Error fetching company members:', error);
      return [];
    }
  }

  /**
   * Add user as a member of a company
   */
  async addCompanyMember(
    userId: string,
    companyId: string,
    jobTitle: string,
    department?: string
  ): Promise<CompanyMember | null> {
    try {
      const { data, error } = await supabase
        .from('company_members')
        .insert({
          user_id: userId,
          company_id: companyId,
          job_title: jobTitle,
          department: department
        })
        .select()
        .single();

      if (error) throw error;
      return data as CompanyMember;
    } catch (error) {
      console.error('Error adding company member:', error);
      return null;
    }
  }

  /**
   * Check if a user is a member of a company
   */
  async isUserMemberOfCompany(userId: string, companyId: string): Promise<boolean> {
    try {
      const { data, error, count } = await supabase
        .from('company_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) throw error;
      return count ? count > 0 : false;
    } catch (error) {
      console.error('Error checking company membership:', error);
      return false;
    }
  }

  /**
   * Get all companies 
   */
  async getAllCompanies(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Company[];
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }

  /**
   * Get user's company memberships
   */
  async getUserCompanies(userId: string): Promise<CompanyMemberWithProfile[]> {
    try {
      const { data, error } = await supabase
        .from('company_members')
        .select(`
          *,
          companies:company_id(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data as unknown as CompanyMemberWithProfile[];
    } catch (error) {
      console.error('Error fetching user companies:', error);
      return [];
    }
  }
}

export const companyService = new CompanyService();
