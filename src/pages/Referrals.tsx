
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import UpdateReferralStatusModal from "@/components/UpdateReferralStatusModal";

// Mock referral data
const initialReferrals = [
  {
    id: "1",
    company: "Google",
    position: "Senior Frontend Developer",
    referrer: {
      id: "2",
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
      jobTitle: "Senior Developer",
    },
    status: "pending",
    date: "2023-05-20",
  },
  {
    id: "2",
    company: "Meta",
    position: "Product Designer",
    referrer: {
      id: "3",
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=3",
      jobTitle: "Product Manager",
    },
    status: "accepted",
    date: "2023-05-15",
  },
  {
    id: "3",
    company: "Apple",
    position: "UX Designer",
    referrer: {
      id: "4",
      name: "Sarah Williams",
      avatar: "https://i.pravatar.cc/150?img=4",
      jobTitle: "UX Designer",
    },
    status: "rejected",
    date: "2023-05-10",
  },
];

// Mock outgoing referrals (for referrers)
const initialOutgoingReferrals = [
  {
    id: "4",
    company: "Google",
    position: "Frontend Developer",
    applicant: {
      id: "5",
      name: "Michael Brown",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    status: "pending",
    date: "2023-05-22",
  },
  {
    id: "5",
    company: "Google",
    position: "Backend Developer",
    applicant: {
      id: "6",
      name: "Emily Clark",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    status: "accepted",
    date: "2023-05-18",
  },
];

const Referrals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(user?.role === "referrer" ? "outgoing" : "all");
  const [referrals, setReferrals] = useState(initialReferrals);
  const [outgoingReferrals, setOutgoingReferrals] = useState(initialOutgoingReferrals);
  const [selectedReferral, setSelectedReferral] = useState<(typeof initialOutgoingReferrals)[0] | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "needs_info":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Needs Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleOpenStatusModal = (referral: typeof initialOutgoingReferrals[0]) => {
    setSelectedReferral(referral);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateStatus = (status: string, feedback?: string) => {
    if (!selectedReferral) return;

    // Update the referral status in our state
    const updatedReferrals = outgoingReferrals.map(ref => 
      ref.id === selectedReferral.id 
        ? { ...ref, status } 
        : ref
    );
    
    setOutgoingReferrals(updatedReferrals);
    
    // In a real app, we would also send a notification to the applicant
    toast({
      title: "Referral Status Updated",
      description: `You've updated the status for ${selectedReferral.applicant.name}'s referral request.`,
    });
    
    // If feedback was provided, we would also send it to the applicant in a real app
    if (feedback && feedback.trim()) {
      console.log(`Feedback for ${selectedReferral.applicant.name}: ${feedback}`);
    }
  };

  const handleSendFollowUp = (referrerId: string) => {
    navigate(`/app/chat/${referrerId}`);
  };

  const handleSendThanks = (referrerId: string) => {
    navigate(`/app/chat/${referrerId}`);
  };

  const handleFindOthers = () => {
    navigate("/app/companies");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Referrals</h1>
        {user?.role === "seeker" && (
          <Button onClick={() => navigate("/app/companies")}>
            Find Referrers
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          {user?.role === "seeker" ? (
            <>
              <TabsTrigger value="all">All Referrals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="outgoing">Outgoing Referrals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
            </>
          )}
        </TabsList>

        {user?.role === "seeker" ? (
          <>
            <TabsContent value="all" className="space-y-4">
              {referrals.length > 0 ? (
                referrals.map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.referrer.avatar} alt={referral.referrer.name} />
                          <AvatarFallback>{referral.referrer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.referrer.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.referrer.jobTitle}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/app/chat/${referral.referrer.id}`)}>
                          Message
                        </Button>
                        <Button size="sm" onClick={() => navigate(`/app/members/${referral.referrer.id}`)}>
                          View Profile
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">You haven't requested any referrals yet</p>
                    <Button onClick={() => navigate("/app/companies")}>
                      Find Referrers
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              {referrals.filter(r => r.status === "pending").length > 0 ? (
                referrals.filter(r => r.status === "pending").map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.referrer.avatar} alt={referral.referrer.name} />
                          <AvatarFallback>{referral.referrer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.referrer.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.referrer.jobTitle}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" onClick={() => handleSendFollowUp(referral.referrer.id)}>
                        Send Follow-up
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No pending referrals</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="accepted" className="space-y-4">
              {referrals.filter(r => r.status === "accepted").length > 0 ? (
                referrals.filter(r => r.status === "accepted").map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.referrer.avatar} alt={referral.referrer.name} />
                          <AvatarFallback>{referral.referrer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.referrer.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.referrer.jobTitle}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <Button size="sm" onClick={() => handleSendThanks(referral.referrer.id)}>
                        Send Thanks
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No accepted referrals yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="rejected" className="space-y-4">
              {referrals.filter(r => r.status === "rejected").length > 0 ? (
                referrals.filter(r => r.status === "rejected").map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.referrer.avatar} alt={referral.referrer.name} />
                          <AvatarFallback>{referral.referrer.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.referrer.name}</p>
                          <p className="text-sm text-muted-foreground">{referral.referrer.jobTitle}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Requested on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <Button variant="outline" size="sm" onClick={handleFindOthers}>
                        Find Others
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No rejected referrals</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="outgoing" className="space-y-4">
              {outgoingReferrals.length > 0 ? (
                outgoingReferrals.map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.applicant.avatar} alt={referral.applicant.name} />
                          <AvatarFallback>{referral.applicant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.applicant.name}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/app/chat/${referral.applicant.id}`)}
                        >
                          Message
                        </Button>
                        {referral.status === "pending" && (
                          <Button 
                            size="sm"
                            onClick={() => handleOpenStatusModal(referral)}
                          >
                            Update Status
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">You haven't submitted any referrals yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="pending" className="space-y-4">
              {outgoingReferrals.filter(r => r.status === "pending").length > 0 ? (
                outgoingReferrals.filter(r => r.status === "pending").map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.applicant.avatar} alt={referral.applicant.name} />
                          <AvatarFallback>{referral.applicant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.applicant.name}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/app/chat/${referral.applicant.id}`)}
                        >
                          Message
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleOpenStatusModal(referral)}
                        >
                          Update Status
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No pending referrals</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="accepted" className="space-y-4">
              {outgoingReferrals.filter(r => r.status === "accepted").length > 0 ? (
                outgoingReferrals.filter(r => r.status === "accepted").map(referral => (
                  <Card key={referral.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{referral.position}</CardTitle>
                          <CardDescription>{referral.company}</CardDescription>
                        </div>
                        {getStatusBadge(referral.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={referral.applicant.avatar} alt={referral.applicant.name} />
                          <AvatarFallback>{referral.applicant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referral.applicant.name}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <p className="text-sm text-muted-foreground">
                        Submitted on {new Date(referral.date).toLocaleDateString()}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/app/chat/${referral.applicant.id}`)}
                      >
                        Message
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No accepted referrals</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Update Status Modal */}
      {selectedReferral && (
        <UpdateReferralStatusModal
          open={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          referralId={selectedReferral.id}
          applicantName={selectedReferral.applicant.name}
          jobTitle={selectedReferral.position}
        />
      )}
    </div>
  );
};

export default Referrals;
