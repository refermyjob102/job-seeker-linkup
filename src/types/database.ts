export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'seeker' | 'referrer';
  email: string;
  avatar_url?: string;
  resume_url?: string;
  location?: string;
  bio?: string;
  job_title?: string;
  department?: string;
  years_experience?: string;
  education?: string;
  skills?: string;
  languages?: string;
  interests?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  available_for_referrals?: boolean;
  open_to_work?: boolean;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website?: string;
  location?: string;
  created_at: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  job_title: string;
  department?: string;
  joined_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface Referral {
  id: string;
  company_id: string;
  position: string;
  seeker_id: string;
  referrer_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'needs_info';
  resume_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  salary_min?: number;
  salary_max?: number;
  type: string;
  experience_level: string;
  created_at: string;
  expires_at?: string;
  status: 'active' | 'filled' | 'expired';
}
