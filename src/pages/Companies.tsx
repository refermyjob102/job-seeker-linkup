
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building, 
  Search, 
  MapPin, 
  Users, 
  Briefcase, 
  ExternalLink, 
  Filter,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { topCompanies } from "@/data/topCompanies";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState(topCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState(topCompanies);
  const [view, setView] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sectorFilter, setSectorFilter] = useState("all");
  const [hasReferrers, setHasReferrers] = useState(false);
  
  const sectors = [...new Set(topCompanies.map(company => company.sector))].sort();

  useEffect(() => {
    handleFilterCompanies();
  }, [sectorFilter, hasReferrers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterCompanies();
    setMobileFiltersOpen(false);
  };

  const handleFilterCompanies = () => {
    let results = topCompanies;

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sector filter
    if (sectorFilter !== "all") {
      results = results.filter(company => company.sector === sectorFilter);
    }

    // Apply referrers filter - in a real application, you would actually filter companies with referrers
    // For now, let's assume companies with even IDs have referrers
    if (hasReferrers) {
      results = results.filter(company => parseInt(company.id) % 2 === 0);
    }

    setFilteredCompanies(results);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSectorFilter("all");
    setHasReferrers(false);
    setFilteredCompanies(topCompanies);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Companies</h1>
          <p className="text-muted-foreground">
            Explore companies and find referrers who work there
          </p>
        </div>
      </div>

      {/* Mobile Filters Button */}
      <div className="md:hidden">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <Card className={`md:col-span-1 h-fit ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Company name, industry..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Industry / Sector</h3>
                <Select 
                  value={sectorFilter} 
                  onValueChange={setSectorFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Referrers</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasReferrers" 
                    checked={hasReferrers} 
                    onCheckedChange={(checked) => setHasReferrers(checked === true)}
                  />
                  <Label htmlFor="hasReferrers">Has available referrers</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
            </div>
            <Tabs value={view} onValueChange={setView} className="w-[200px]">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredCompanies.length > 0 ? (
            <>
              {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCompanies.map((company) => (
                    <Card key={company.id} className="overflow-hidden h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-4">
                          <div className="bg-muted rounded-md p-3 h-12 w-12 flex items-center justify-center">
                            <Building className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{company.name}</CardTitle>
                            <p className="text-sm text-muted-foreground truncate">{company.sector}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start text-muted-foreground">
                            <Badge variant="outline">{company.sector}</Badge>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 p-3">
                        <div className="flex justify-between w-full">
                          <Link to={`/app/companies/${company.id}`}>
                            <Button variant="outline" size="sm">View Members</Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                            <a href={`https://www.google.com/search?q=${encodeURIComponent(company.name)}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompanies.map((company) => (
                    <Card key={company.id}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="bg-muted flex items-center justify-center p-4 rounded-md h-16 w-16 mx-auto md:mx-0">
                            <Building className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2 text-center md:text-left">
                              <h3 className="font-semibold text-lg">{company.name}</h3>
                              <Badge variant="outline">{company.sector}</Badge>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-4 mb-4 text-sm text-muted-foreground">
                              {/* In a real application, these would come from actual data */}
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {parseInt(company.id) % 2 === 0 ? "Has referrers" : "No referrers yet"}
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {company.id.length} open positions
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                              <div className="flex gap-2 w-full sm:w-auto">
                                <Button 
                                  variant="outline" 
                                  className="flex-1 sm:flex-initial" 
                                  asChild
                                >
                                  <Link to={`/app/companies/${company.id}`}>
                                    View Members
                                  </Link>
                                </Button>
                                <Button 
                                  className="flex-1 sm:flex-initial"
                                  asChild
                                >
                                  <Link to={`/app/jobs?company=${encodeURIComponent(company.name)}`}>
                                    View Jobs
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;
