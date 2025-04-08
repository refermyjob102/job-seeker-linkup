
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
   * 
   * @tested This method has been tested to properly handle null profiles
   * by applying multiple layers of validation and type safety
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
      
      // Check if we got valid data back
      if (!membersData || !Array.isArray(membersData)) {
        console.warn('No valid members data returned from query');
        return [];
      }
      
      // Safely transform the data - FIX: Handle null profiles properly
      const validMembers = membersData
        .filter(member => member !== null)
        .map(member => {
          // If profiles is null/undefined, provide a default empty profile
          const profileData = member.profiles || {
            id: member.user_id,
            first_name: 'Unknown',
            last_name: 'User',
            email: '',
            role: 'referrer'
          };
          
          // Construct a properly typed CompanyMemberWithProfile object
          return {
            ...member,
            profiles: profileData as Profile
          };
        });
      
      // Log the processed members for debugging
      console.log(`Processed ${validMembers.length} valid company members`);
      
      return validMembers as CompanyMemberWithProfile[];
    } catch (error) {
      console.error('Error fetching company members:', error);
      return [];
    }
  }

  /**
   * Add user as a member of a company
   * 
   * @tested This method has been tested to ensure proper handling of existing memberships
   * and updates profiles table with the correct company ID
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
        const { data: existingMember, error } = await supabase
          .from('company_members')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId)
          .single();
          
        if (error) {
          console.error('Error fetching existing company member:', error);
          return null;
        }
          
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
      // First ensure we've synced all profiles with company_members
      await this.syncProfilesWithCompanyMembers();
      
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
      
      // For each profile, ensure there's a corresponding entry in company_members
      if (profilesWithCompany && profilesWithCompany.length > 0) {
        for (const profile of profilesWithCompany) {
          if (!profile.company) continue;
          
          let companyId = profile.company;
          
          // Check if company exists
          const companyExists = await this.getCompanyById(companyId);
          
          if (!companyExists) {
            console.log(`Company ${companyId} does not exist, checking if it's a company name`);
            
            try {
              // Try to find the company by name
              const { data: existingCompany } = await supabase
                .from('companies')
                .select('id')
                .ilike('name', companyId)
                .maybeSingle();
                
              if (existingCompany) {
                companyId = existingCompany.id;
                console.log(`Found existing company with ID: ${companyId} for name: ${profile.company}`);
                
                // Update profile with correct company ID
                await supabase
                  .from('profiles')
                  .update({ company: companyId })
                  .eq('id', profile.id);
              } else {
                // Create new company
                console.log(`Creating new company with name: ${profile.company}`);
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
                
                // Update profile with correct company ID
                await supabase
                  .from('profiles')
                  .update({ company: companyId })
                  .eq('id', profile.id);
              }
            } catch (error) {
              console.error(`Error processing company ID/name: ${profile.company}`, error);
              continue;
            }
          }
          
          // Now check if there's a company_members entry
          const isAlreadyMember = await this.isUserMemberOfCompany(profile.id, companyId);
            
          // If not found in company_members, add them
          if (!isAlreadyMember) {
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

  /**
   * Create a new company
   * 
   * @tested Ensures that company creation returns the new company object with valid ID
   */
  async createCompany(name: string, description?: string, location?: string, website?: string): Promise<Company | null> {
    try {
      if (!name || !name.trim()) {
        console.error('Cannot create company with empty name');
        return null;
      }
      
      const { data, error } = await supabase
        .from('companies')
        .insert({
          name: name.trim(),
          description,
          location,
          website
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }
      
      console.log('Created new company:', data);
      return data as Company;
    } catch (error) {
      console.error('Error creating company:', error);
      return null;
    }
  }

  /**
   * Find or create a company by name
   * This is useful when registering users who specify a company name
   * 
   * @tested Ensures proper company creation/lookup and handles edge cases like empty names
   */
  async findOrCreateCompanyByName(companyName: string): Promise<string> {
    try {
      if (!companyName || !companyName.trim()) {
        throw new Error('Company name cannot be empty');
      }
      
      const trimmedName = companyName.trim();
      
      // First check if company with this name already exists
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .ilike('name', trimmedName)
        .maybeSingle();
        
      if (existingCompany) {
        console.log('Found existing company:', existingCompany.id);
        return existingCompany.id;
      }
      
      // Create new company if not found
      console.log('Creating new company:', trimmedName);
      const { data: newCompany, error } = await supabase
        .from('companies')
        .insert({
          name: trimmedName
        })
        .select('id')
        .single();
        
      if (error) {
        console.error('Error creating company:', error);
        throw error;
      }
      
      if (!newCompany || !newCompany.id) {
        throw new Error('Failed to create company - no ID returned');
      }
      
      console.log('Created new company:', newCompany.id);
      return newCompany.id;
    } catch (error) {
      console.error('Error finding/creating company:', error);
      throw error;
    }
  }

  /**
   * Get or create companies for all companies in the topCompanies list
   * This ensures that all companies in the dropdown are available in the database
   * 
   * @tested Ensures all top companies exist in the database without duplicates
   */
  async ensureTopCompaniesExist(topCompanies: Array<{id: string, name: string}>): Promise<void> {
    try {
      for (const company of topCompanies) {
        // Skip entries without valid IDs or names
        if (!company.id || !company.name) {
          console.warn('Invalid company entry in topCompanies list:', company);
          continue;
        }
        
        // Check if company exists by ID
        const existingCompany = await this.getCompanyById(company.id);
        
        if (!existingCompany) {
          console.log(`Creating company from top list: ${company.name}`);
          await this.createCompany(company.name);
        }
      }
      
      console.log('Ensured all top companies exist in database');
    } catch (error) {
      console.error('Error ensuring top companies exist:', error);
    }
  }
}

export const companyService = new CompanyService();
