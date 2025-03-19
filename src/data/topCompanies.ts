
// List of top 50 companies from various sectors
export const topCompanies = [
  // Tech
  { id: "1", name: "Google", sector: "Technology" },
  { id: "2", name: "Apple", sector: "Technology" },
  { id: "3", name: "Microsoft", sector: "Technology" },
  { id: "4", name: "Amazon", sector: "Technology" },
  { id: "5", name: "Meta (Facebook)", sector: "Technology" },
  { id: "6", name: "Tesla", sector: "Automotive/Technology" },
  { id: "7", name: "NVIDIA", sector: "Technology" },
  { id: "8", name: "Intel", sector: "Technology" },
  { id: "9", name: "Oracle", sector: "Technology" },
  { id: "10", name: "IBM", sector: "Technology" },
  
  // Finance
  { id: "11", name: "JPMorgan Chase", sector: "Finance" },
  { id: "12", name: "Bank of America", sector: "Finance" },
  { id: "13", name: "Goldman Sachs", sector: "Finance" },
  { id: "14", name: "Morgan Stanley", sector: "Finance" },
  { id: "15", name: "Citigroup", sector: "Finance" },
  
  // Healthcare
  { id: "16", name: "Johnson & Johnson", sector: "Healthcare" },
  { id: "17", name: "Pfizer", sector: "Healthcare" },
  { id: "18", name: "UnitedHealth Group", sector: "Healthcare" },
  { id: "19", name: "Merck", sector: "Healthcare" },
  { id: "20", name: "Abbott Laboratories", sector: "Healthcare" },
  
  // Retail
  { id: "21", name: "Walmart", sector: "Retail" },
  { id: "22", name: "Target", sector: "Retail" },
  { id: "23", name: "Home Depot", sector: "Retail" },
  { id: "24", name: "Costco", sector: "Retail" },
  { id: "25", name: "Lowe's", sector: "Retail" },
  
  // Media/Entertainment
  { id: "26", name: "Disney", sector: "Media/Entertainment" },
  { id: "27", name: "Netflix", sector: "Media/Entertainment" },
  { id: "28", name: "Comcast", sector: "Media/Entertainment" },
  { id: "29", name: "Warner Bros. Discovery", sector: "Media/Entertainment" },
  { id: "30", name: "ViacomCBS", sector: "Media/Entertainment" },
  
  // Telecommunications
  { id: "31", name: "AT&T", sector: "Telecommunications" },
  { id: "32", name: "Verizon", sector: "Telecommunications" },
  { id: "33", name: "T-Mobile", sector: "Telecommunications" },
  
  // Consumer Goods
  { id: "34", name: "Procter & Gamble", sector: "Consumer Goods" },
  { id: "35", name: "Coca-Cola", sector: "Consumer Goods" },
  { id: "36", name: "PepsiCo", sector: "Consumer Goods" },
  { id: "37", name: "Nike", sector: "Consumer Goods" },
  { id: "38", name: "McDonald's", sector: "Food & Beverage" },
  
  // Automotive
  { id: "39", name: "Ford", sector: "Automotive" },
  { id: "40", name: "General Motors", sector: "Automotive" },
  { id: "41", name: "Toyota", sector: "Automotive" },
  { id: "42", name: "Honda", sector: "Automotive" },
  
  // Energy
  { id: "43", name: "ExxonMobil", sector: "Energy" },
  { id: "44", name: "Chevron", sector: "Energy" },
  { id: "45", name: "Shell", sector: "Energy" },
  
  // Aerospace & Defense
  { id: "46", name: "Boeing", sector: "Aerospace & Defense" },
  { id: "47", name: "Lockheed Martin", sector: "Aerospace & Defense" },
  { id: "48", name: "Raytheon Technologies", sector: "Aerospace & Defense" },
  
  // Consulting
  { id: "49", name: "McKinsey & Company", sector: "Consulting" },
  { id: "50", name: "Boston Consulting Group", sector: "Consulting" }
];

// Helper function to get companies by sector
export const getCompaniesBySector = (sector: string) => {
  return topCompanies.filter(company => company.sector === sector);
};

// Helper function to search companies by name
export const searchCompaniesByName = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return topCompanies.filter(company => 
    company.name.toLowerCase().includes(lowercaseQuery)
  );
};

// Get company by ID
export const getCompanyById = (id: string) => {
  return topCompanies.find(company => company.id === id);
};

// Helper to get company name by ID
export const getCompanyNameById = (id: string) => {
  const company = topCompanies.find(company => company.id === id);
  return company ? company.name : "";
};
