import { SoVanBang, VanBang } from './typings';

const STORAGE_KEY = 'soVanBang';

export function loadFromLocalStorage(): SoVanBang[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveToLocalStorage(data: SoVanBang[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function addVanBangToSoVanBang(vanBang: VanBang): VanBang[] {
    const data = loadFromLocalStorage();
    const soVanBang = data.find(item => item.id === vanBang.soVanBangId);

    if (!soVanBang) {
        throw new Error('Sổ văn bằng không tồn tại!');
    }

    const maxSoVaoSo = soVanBang.vanBangs.reduce((max, vb) => Math.max(max, vb.soVaoSo), 0) || 0;
    vanBang.soVaoSo = maxSoVaoSo + 1;

    soVanBang.vanBangs.push(vanBang);
    saveToLocalStorage(data);

    return soVanBang.vanBangs;
}

export function getVanBangsBySoVanBang(soVanBangId: string): VanBang[] {
    const data = loadFromLocalStorage();
    const soVanBang = data.find(item => item.id === soVanBangId);

    if (!soVanBang) {
        throw new Error('Sổ văn bằng không tồn tại!');
    }

    return soVanBang.vanBangs || [];
}