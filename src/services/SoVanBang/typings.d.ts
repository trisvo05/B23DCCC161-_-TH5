export interface VanBang {
    id: string; 
    soVanBangId: string;
    soVaoSo: number; 
    soHieuVanBang: string; 
    maSinhVien: string; 
    hoTen: string;
    ngaySinh: Date; 
    createdAt: Date; 
    updatedAt: Date; 
}

export interface SoVanBang {
    id: string; 
    name: string; 
    vanBangs: VanBang[]; 
    createdAt: Date; 
    updatedAt: Date; 
}