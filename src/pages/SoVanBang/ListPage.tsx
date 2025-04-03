import React, { useState } from "react";
import { Table, Button, Modal } from "antd";
import useSoVanBang from "@/models/SoVanBang/soVanBang";
import VanBangModal from "./VanBangModal";

const ListPage: React.FC = () => {
    const { soVanBangList, loadVanBangs, vanBangs } = useSoVanBang();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewVanBangs = (soVanBangId: string) => {
        loadVanBangs(soVanBangId);
        setIsModalOpen(true);
    };

    const columns = [
        { title: "Tên sổ văn bằng", dataIndex: "name", key: "name" },
        { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt", render: (text: string) => new Date(text).toLocaleDateString() },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: any) => (
                <Button type="link" onClick={() => handleViewVanBangs(record.id)}>
                    Xem văn bằng
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={soVanBangList} rowKey="id" />
            <VanBangModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} vanBangs={vanBangs} />
        </div>
    );
};

export default ListPage;