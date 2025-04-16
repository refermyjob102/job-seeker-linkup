
import { supabase } from "@/integrations/supabase/client";
import { Company, CompanyMember, Profile, CompanyMemberWithProfile } from "@/types/database";

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
      
      // First get company details to get the name (for case-insensitive comparison)
      const company = await this.getCompanyById(companyId);
      if (!company) {
        console.error('Company not found with ID:', companyId);
        return [];
      }
      
      // Get members from company_members table with their profiles
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
      return membersData as CompanyMemberWithProfile[];
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
      
      // Update profile with correct company ID to maintain consistency
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ company: companyId })
        .eq('id', userId);
        
      if (profileUpdateError) {
        console.error('Error updating profile with company ID:', profileUpdateError);
      }
      
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
      // Check in company_members table
      const { count, error } = await supabase
        .from('company_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) throw error;
      
      return count !== null && count > 0;
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
      
      console.log(`Found ${profilesWithCompany?.length || 0} profiles with company set`);
      
      // Get all companies for mapping
      const { data: allCompanies, error: companiesError } = await supabase
        .from('companies')
        .select('id, name');
        
      if (companiesError) {
        console.error('Error fetching companies for matching:', companiesError);
        return;
      }
      
      // Create a map of company IDs to names
      const companyIdMap = new Map<string, string>();
      
      for (const company of allCompanies) {
        companyIdMap.set(company.id, company.name);
      }
      
      // For each profile, ensure there's a corresponding entry in company_members
      if (profilesWithCompany) {
        for (const profile of profilesWithCompany) {
          if (!profile.company) continue;
          
          let companyId = profile.company;
          
          // Check if the company value is a valid UUID (likely a company ID)
          const isValidCompanyId = companyIdMap.has(profile.company);
          
          if (!isValidCompanyId) {
            console.log(`Invalid company ID ${profile.company} for user ${profile.id}, attempting to find or create company`);
            
            // Try to find the company by name
            const { data: existingCompany } = await supabase
              .from('companies')
              .select('id')
              .ilike('name', profile.company)
              .maybeSingle();
              
            if (existingCompany) {
              companyId = existingCompany.id;
              console.log(`Found existing company with ID: ${companyId} for name: ${profile.company}`);
            } else {
              // Create new company
              const { data: newCompany, error: createError } = await supabase
                .from('companies')
                .insert({ name: profile.company })
                .select('id')
                .single();
                
              if (createError) {
                console.error(`Error creating company:`, createError);
                continue;
              }
              
              companyId = newCompany.id;
              console.log(`Created new company with ID: ${companyId} for name: ${profile.company}`);
            }
            
            // Update the profile with the correct company ID
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ company: companyId })
              .eq('id', profile.id);
              
            if (updateError) {
              console.error(`Error updating profile with company ID:`, updateError);
              continue;
            }
          }
          
          // Now check if there's a company_members entry
          const { count } = await supabase
            .from('company_members')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .eq('company_id', companyId);
            
          // If not found in company_members, add them
          if (!count || count === 0) {
            console.log(`Adding user ${profile.id} to company ${companyId}`);
            await this.addCompanyMember(
              profile.id,
              companyId,
              profile.job_title || 'Member',
              profile.department
            );
          }
        }
      }
      
      console.log('Sync completed');
    } catch (error) {
      console.error('Error syncing profiles with company_members:', error);
    }
  }
}

export const companyService = new CompanyService();
