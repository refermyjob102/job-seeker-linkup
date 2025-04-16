
import { supabase } from "./client";
import { topCompanies } from "@/data/topCompanies";

export const seedCompaniesIfNeeded = async () => {
  // Check if companies already exist
  const { count, error: countError } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error("Error checking companies:", countError);
    return;
  }
  
  // If we already have companies, don't seed
  if (count && count > 0) {
    console.log(`${count} companies already exist, skipping seed`);
    return;
  }
  
  console.log("Seeding companies...");
  
  // Convert topCompanies data to the correct format
  const companiesToInsert = topCompanies.map(company => ({
    name: company.name,
    sector: company.sector,
  }));
  
  // Insert companies in batches to avoid potential issues
  const batchSize = 10;
  for (let i = 0; i < companiesToInsert.length; i += batchSize) {
    const batch = companiesToInsert.slice(i, i + batchSize);
    const { error } = await supabase
      .from('companies')
      .insert(batch);
      
    if (error) {
      console.error(`Error seeding companies batch ${i}:`, error);
    }
  }
  
  console.log(`Seeded ${topCompanies.length} companies`);
};

export const seedTestReferrersIfNeeded = async () => {
  // First check if we already have some referrer profiles
  const { count, error: countError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'referrer');
    
  if (countError) {
    console.error("Error checking referrers:", countError);
    return;
  }
  
  // If we already have some referrers, don't seed
  if (count && count > 10) {
    console.log(`${count} referrers already exist, skipping seed`);
    return;
  }
  
  // Get companies to associate with referrers
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('id, name')
    .limit(20);
    
  if (companiesError || !companies || companies.length === 0) {
    console.error("Error fetching companies for referrers:", companiesError);
    return;
  }
  
  // Create some test referrers with various profiles
  const testReferrers = [
    {
      first_name: "Alex",
      last_name: "Smith",
      role: "referrer",
      email: "alex.smith@example.com",
      job_title: "Senior Software Engineer",
      department: "Engineering",
      company: companies[0].id,
      location: "San Francisco, CA",
      bio: "Experienced software engineer with passion for mentoring.",
      years_experience: "8",
      available_for_referrals: true,
      skills: "JavaScript, React, Node.js, GraphQL",
      languages: "English, Spanish"
    },
    {
      first_name: "Jamie",
      last_name: "Wong",
      role: "referrer",
      email: "jamie.wong@example.com",
      job_title: "Product Manager",
      department: "Product",
      company: companies[1].id,
      location: "New York, NY",
      bio: "Helping great talent find their dream roles in tech.",
      years_experience: "5",
      available_for_referrals: true,
      skills: "Product Strategy, User Research, Agile, Roadmapping",
      languages: "English, Mandarin"
    },
    {
      first_name: "Taylor",
      last_name: "Johnson",
      role: "referrer",
      email: "taylor.johnson@example.com",
      job_title: "Engineering Manager",
      department: "Engineering",
      company: companies[2].id,
      location: "Austin, TX",
      bio: "Building diverse engineering teams and great products.",
      years_experience: "10",
      available_for_referrals: true,
      skills: "Team Leadership, System Design, Go, Python",
      languages: "English"
    },
    {
      first_name: "Morgan",
      last_name: "Patel",
      role: "referrer",
      email: "morgan.patel@example.com",
      job_title: "Data Scientist",
      department: "Analytics",
      company: companies[3].id,
      location: "Seattle, WA",
      bio: "Working with big data and ML to solve complex problems.",
      years_experience: "6",
      available_for_referrals: true,
      skills: "Python, TensorFlow, SQL, Data Analysis",
      languages: "English, Hindi"
    },
    {
      first_name: "Jordan",
      last_name: "Garcia",
      role: "referrer",
      email: "jordan.garcia@example.com",
      job_title: "UX Designer",
      department: "Design",
      company: companies[4].id,
      location: "Los Angeles, CA",
      bio: "Creating intuitive and delightful user experiences.",
      years_experience: "4",
      available_for_referrals: true,
      skills: "Figma, User Research, Wireframing, Prototyping",
      languages: "English, Spanish"
    }
  ];
  
  // Insert test referrers
  for (const referrer of testReferrers) {
    const { error } = await supabase
      .from('profiles')
      .insert(referrer);
      
    if (error) {
      console.error(`Error seeding referrer ${referrer.email}:`, error);
    } else {
      // Create company member association
      await supabase
        .from('company_members')
        .insert({
          user_id: referrer.email, // In a real app, this would be the user ID
          company_id: referrer.company,
          job_title: referrer.job_title,
          department: referrer.department
        });
    }
  }
  
  console.log(`Seeded test referrers`);
};
