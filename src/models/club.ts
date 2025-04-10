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
    gender: 'Nam' | 'Nữ' | 'Khác';
    address: string;
    strength: string;
    clubId: number;
    reason: string;
    status: 'Đang chờ' | 'Duyệt' | 'Từ chối';
    note?: string;
    history?: string[]; // Lưu lịch sử thao tác
  }
  