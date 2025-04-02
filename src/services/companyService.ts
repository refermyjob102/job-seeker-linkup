
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
      console.log('Fetching company with ID:', id);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('Company data:', data);
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
      console.log('Fetching company members for company ID:', companyId);
      
      // First get members from company_members table
      const { data: membersData, error: membersError } = await supabase
        .from('company_members')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .eq('company_id', companyId);

      if (membersError) {
        console.error('Error fetching company_members:', membersError);
        throw membersError;
      }
      
      console.log('Members from company_members table:', membersData);
      
      // Now also get profiles that have this company as their company
      // but aren't in the company_members table yet
      const { data: profilesWithCompany, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('company', companyId);
      
      if (profilesError) {
        console.error('Error fetching profiles with company:', profilesError);
        throw profilesError;
      }
      
      console.log('Profiles with company set to this company ID:', profilesWithCompany);
      
      // Filter out profiles that are already in company_members
      const existingUserIds = membersData.map(m => m.user_id);
      console.log('Existing user IDs in company_members:', existingUserIds);
      
      const additionalProfiles = profilesWithCompany.filter(
        profile => !existingUserIds.includes(profile.id)
      );
      
      console.log('Additional profiles not yet in company_members:', additionalProfiles);
      
      // Convert these profiles to CompanyMemberWithProfile format
      const profileMembers = additionalProfiles.map(profile => ({
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
        console.log('Adding profiles to company_members:', profileMembers.length);
        
        const membersToAdd = profileMembers.map(m => ({
          user_id: m.user_id,
          company_id: companyId,
          job_title: m.job_title,
          department: m.department
        }));
        
        const { error: insertError } = await supabase
          .from('company_members')
          .insert(membersToAdd);
          
        if (insertError) {
          console.error('Error adding profiles to company_members:', insertError);
        }
      }
      
      // Combine both lists
      const allMembers = [...membersData, ...profileMembers] as CompanyMemberWithProfile[];
      console.log('Total company members:', allMembers.length);
      return allMembers;
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
      console.log(`Adding user ${userId} to company ${companyId}`);
      
      // Check if the user is already a member
      const isAlreadyMember = await this.isUserMemberOfCompany(userId, companyId);
      
      if (isAlreadyMember) {
        console.log('User is already a member of this company');
        const { data: existingMember } = await supabase
          .from('company_members')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId)
          .single();
          
        return existingMember as CompanyMember;
      }
      
      // Insert new member
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

      if (error) {
        console.error('Error inserting company member:', error);
        throw error;
      }
      
      console.log('Company member added successfully:', data);
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
      
      // If not found in company_members, check if user's profile has this company
      if (!count || count === 0) {
        console.log('User not found in company_members, checking profiles...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('id', userId)
          .eq('company', companyId);
          
        if (profileError) throw profileError;
        
        if (profileData && count) {
          // Add this user to company_members for future reference
          console.log('User found in profiles with this company, adding to company_members');
          await this.addCompanyMember(
            userId,
            companyId,
            profileData.job_title || 'Member',
            profileData.department
          );
          return true;
        }
      }
      
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
  
  /**
   * Sync user profiles with company_members table
   * This ensures all users with company in their profiles are also in company_members
   */
  async syncProfilesWithCompanyMembers(): Promise<void> {
    try {
      console.log('Syncing profiles with company_members table');
      
      // Get all profiles with company set
      const { data: profilesWithCompany, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .not('company', 'is', null);
        
      if (profilesError) {
        console.error('Error fetching profiles with company:', profilesError);
        return;
      }
      
      console.log(`Found ${profilesWithCompany.length} profiles with company set`);
      
      // For each profile, check if they're in company_members and add if not
      for (const profile of profilesWithCompany) {
        if (!profile.company) continue;
        
        const { data, error, count } = await supabase
          .from('company_members')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .eq('company_id', profile.company);
          
        if (error) {
          console.error(`Error checking company membership for user ${profile.id}:`, error);
          continue;
        }
        
        // If not found in company_members, add them
        if (!count || count === 0) {
          console.log(`Adding user ${profile.id} to company ${profile.company}`);
          await this.addCompanyMember(
            profile.id,
            profile.company,
            profile.job_title || 'Member',
            profile.department
          );
        }
      }
      
      console.log('Sync completed');
    } catch (error) {
      console.error('Error syncing profiles with company_members:', error);
    }
  }
}

export const companyService = new CompanyService();
