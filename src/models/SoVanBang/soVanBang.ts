import { useState } from "react";
import { addVanBangToSoVanBang, getVanBangsBySoVanBang, loadFromLocalStorage } from "@/services/SoVanBang";
import { SoVanBang, VanBang } from "@/services/SoVanBang/typings";

export default () => {
    const [soVanBangList, setSoVanBangList] = useState<SoVanBang[]>(loadFromLocalStorage());
    const [vanBangs, setVanBangs] = useState<VanBang[]>([]);

    const loadVanBangs = (soVanBangId: string) => {
        const data = getVanBangsBySoVanBang(soVanBangId);
        setVanBangs(data);
    };

    return {
        soVanBangList,
        vanBangs,
        loadVanBangs,
    };
};