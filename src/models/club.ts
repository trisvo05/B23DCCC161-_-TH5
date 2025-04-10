// interfaces/club.ts
export interface Club {
    id: number;
    name: string;
    avatar: string;
    establishedDate: string;
    description: string;
    leader: string;
    isActive: boolean;
  }
  
  // interfaces/registration.ts
  export interface Registration {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    strength: string;
    clubId: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    note?: string;
    history: {
      timestamp: string;
      action: string;
      admin: string;
      note?: string;
    }[];
  }
  