export interface Job {
  jobTitle: string;
  description: string;
  questions: string[];
  experienceLevel: string;
}

export interface Company {
  name: string;
  address: string;
  website: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  logo: string;
  phone: string;
}

export interface InvitationDetails {
  candidateName: string;
  candidateEmail: string;
  message: string;
  status: string;
  expirationDate: string;
  job: Job;
  company: Company;
}
