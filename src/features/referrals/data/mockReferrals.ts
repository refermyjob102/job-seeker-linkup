
// Mock referral data for job seekers
export const initialReferrals: SeekerReferral[] = [
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
export const initialOutgoingReferrals: ReferrerReferral[] = [
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

export type ReferralStatus = "pending" | "accepted" | "rejected" | "needs_info";

export interface Referrer {
  id: string;
  name: string;
  avatar: string;
  jobTitle: string;
}

export interface Applicant {
  id: string;
  name: string;
  avatar: string;
}

export interface SeekerReferral {
  id: string;
  company: string;
  position: string;
  referrer: Referrer;
  status: ReferralStatus;
  date: string;
}

export interface ReferrerReferral {
  id: string;
  company: string;
  position: string;
  applicant: Applicant;
  status: ReferralStatus;
  date: string;
}
