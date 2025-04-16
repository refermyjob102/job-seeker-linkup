
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Filter, Search, MapPin, Link, Briefcase, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/types/database";

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSector, setFilterSector] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sectors for filtering
  const sectors = [
    "All Sectors",
    "Technology",
    "Finance",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "Education",
    "Transportation",
    "Energy",
    "Media",
  ];

  // Fetch companies from Supabase
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .order("name");

        if (error) throw error;
        
        // Handle case where sector might be null by providing a default value
        const companiesWithDefaultSector = data?.map(company => ({
          ...company,
          sector: company.sector || "Technology" // Default sector if none is specified
        })) || [];
        
        setCompanies(companiesWithDefaultSector as Company[]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again later.");
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter companies by search query and sector
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.description &&
        company.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector =
      filterSector === "all" || 
      (company.sector && company.sector.toLowerCase() === filterSector.toLowerCase());

    return matchesSearch && matchesSector;
  });

  // Get random color for sector badges
  const getSectorColor = (sector: string): string => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    ];

    // Use the sector name to deterministically choose a color
    const index = sector.length % colors.length;
    return colors[index];
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Browse Companies</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={filterSector}
            onValueChange={(value) => setFilterSector(value)}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filter by Sector</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.slice(1).map((sector) => (
                <SelectItem key={sector} value={sector.toLowerCase()}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={company.logo_url || ""} alt={company.name} />
                    <AvatarFallback className="bg-primary/10">
                      {company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      {company.location && (
                        <div className="flex items-center mr-4">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{company.location}</span>
                        </div>
                      )}
                      {company.sector && (
                        <Badge className={getSectorColor(company.sector)}>
                          {company.sector}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {company.description ||
                    `${company.name} is a leading company in the ${
                      company.sector || "technology"
                    } sector.`}
                </p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Users2 className="h-4 w-4 mr-1.5 text-muted-foreground" />
                  <span>View team members</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/10"
                  onClick={() => navigate(`/app/companies/${company.id}`)}
                >
                  View Company
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No companies found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setFilterSector("all");
            }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
