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
      
      const companyName = company.name.toLowerCase();
      console.log('Company name for matching:', companyName);
      
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
      
      // Now also get profiles that have this company in any case variation
      const { data: profilesWithCompany, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) {
        console.error('Error fetching profiles with company:', profilesError);
        throw profilesError;
      }
      
      // Filter profiles that match the company name regardless of case
      const matchingProfiles = profilesWithCompany.filter(profile => 
        profile.company && 
        (profile.company.toLowerCase() === companyName || 
         profile.company === companyId)
      );
      
      console.log('Profiles matching company name or ID:', matchingProfiles);
      
      // Update company field for matching profiles to ensure consistency
      for (const profile of matchingProfiles) {
        if (profile.company !== companyId) {
          console.log(`Updating profile ${profile.id} company field from ${profile.company} to ${companyId}`);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ company: companyId })
            .eq('id', profile.id);
            
          if (updateError) {
            console.error('Error updating profile company field:', updateError);
          }
        }
      }
      
      // Filter out profiles that are already in company_members
      const existingUserIds = membersData.map(m => m.user_id);
      console.log('Existing user IDs in company_members:', existingUserIds);
      
      const additionalProfiles = matchingProfiles.filter(
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
        joined_at: profile.created_at || new Date().toISOString(),
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
      // First check in company_members table
      const { data, error, count } = await supabase
        .from('company_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('company_id', companyId);

      if (error) throw error;
      
      if (count && count > 0) {
        return true;
      }
      
      // If not found in company_members, get company details for name-based matching
      const company = await this.getCompanyById(companyId);
      if (!company) {
        console.log('Company not found for case-insensitive check');
        return false;
      }
      
      const companyName = company.name.toLowerCase();
      
      // Check if user's profile has this company (case insensitive)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
          
      if (profileError) {
        console.error('Error fetching profile for membership check:', profileError);
        return false;
      }
      
      if (profileData && profileData.company) {
        // Check if company matches by ID or name (case insensitive)
        if (profileData.company === companyId || 
            (typeof profileData.company === 'string' && 
             profileData.company.toLowerCase() === companyName)) {
          
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
      
      return false;
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
      
      // Get all companies for case-insensitive matching
      const { data: allCompanies, error: companiesError } = await supabase
        .from('companies')
        .select('id, name');
        
      if (companiesError) {
        console.error('Error fetching companies for matching:', companiesError);
        return;
      }
      
      // Create a map of lowercase company names to company IDs
      const companyNameMap = new Map<string, string>();
      const companyIdMap = new Map<string, string>();
      
      for (const company of allCompanies) {
        companyNameMap.set(company.name.toLowerCase(), company.id);
        companyIdMap.set(company.id, company.name);
      }
      
      // For each profile, check if they're in company_members and add if not
      if (profilesWithCompany) {
        for (const profile of profilesWithCompany) {
          if (!profile.company) continue;
          
          let companyId = profile.company;
          let isValidCompanyId = false;
          
          // Check if the company value is a valid UUID (likely a company ID)
          const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          isValidCompanyId = uuidPattern.test(profile.company);
          
          // If it's a valid UUID, check if it exists in our companies
          if (isValidCompanyId && !companyIdMap.has(profile.company)) {
            // It's a UUID but not a known company ID, try to match by name
            isValidCompanyId = false;
          }
          
          // If the company value is not a valid company ID,
          // try to find the matching company ID by name
          if (!isValidCompanyId) {
            const companyNameLower = profile.company.toLowerCase();
            const matchingCompanyId = companyNameMap.get(companyNameLower);
            
            if (matchingCompanyId) {
              companyId = matchingCompanyId;
              
              // Update the profile with the correct company ID
              console.log(`Updating profile ${profile.id} company from "${profile.company}" to "${companyId}"`);
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ company: companyId })
                .eq('id', profile.id);
                
              if (updateError) {
                console.error(`Error updating profile company ID:`, updateError);
                continue;
              }
            } else {
              // No matching company found, create a new one
              console.log(`Creating new company with name: "${profile.company}"`);
              
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
              
              // Update the profile with the new company ID
              console.log(`Updating profile ${profile.id} company to new company ID: "${companyId}"`);
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ company: companyId })
                .eq('id', profile.id);
                
              if (updateError) {
                console.error(`Error updating profile with new company ID:`, updateError);
                continue;
              }
              
              // Add to our maps
              companyNameMap.set(profile.company.toLowerCase(), companyId);
              companyIdMap.set(companyId, profile.company);
            }
          }
          
          // Check if already in company_members
          const { data, error, count } = await supabase
            .from('company_members')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)
            .eq('company_id', companyId);
            
          if (error) {
            console.error(`Error checking company membership for user ${profile.id}:`, error);
            continue;
          }
          
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
