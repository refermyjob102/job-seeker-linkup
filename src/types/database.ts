
export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  company?: string;
  job_title?: string;
  department?: string;
  role: 'seeker' | 'referrer';
  created_at?: string;
  updated_at?: string;
  available_for_referrals?: boolean;
  education?: string;
  skills?: string;
  interests?: string;
  languages?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  years_experience?: string;
  open_to_work?: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  location?: string;
  website?: string;
  description?: string;
  created_at?: string;
}

export interface CompanyMember {
  id: string;
  user_id: string;
  company_id: string;
  job_title: string;
  department?: string;
  joined_at: string;
}

// This extends the CompanyMember to include the profile data
export interface CompanyMemberWithProfile extends CompanyMember {
  profiles: Profile;
}
