import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface StudySession {
  id: number;
  subject: string;
  date: string;
  duration: string;
  content: string;
  notes?: string;
}

const StudyTracker: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [form] = Form.useForm();

  // Hiển thị modal thêm / chỉnh sửa
  const showModal = (session?: StudySession) => {
    setEditingSession(session || null);
    setIsModalVisible(true);
    form.setFieldsValue(
      session
        ? { ...session, date: dayjs(session.date) }
        : { subject: "", date: null, duration: "", content: "", notes: "" }
    );
  };

  // Xử lý lưu dữ liệu
  const handleSave = (values: Omit<StudySession, "id"> & { date: dayjs.Dayjs }) => {
    const newSession: StudySession = {
      ...values,
      id: editingSession ? editingSession.id : Date.now(),
      date: values.date.format("YYYY-MM-DD HH:mm"),
    };

    if (editingSession) {
      // Cập nhật lịch học
      setSessions((prev) =>
        prev.map((s) => (s.id === editingSession.id ? newSession : s))
      );
    } else {
      // Thêm mới lịch học
      setSessions((prev) => [...prev, newSession]);
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  // Xóa lịch học
  const handleDelete = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  // Cấu hình cột bảng
  const columns: ColumnsType<StudySession> = [
    { title: "Môn học", dataIndex: "subject", key: "subject" },
    { title: "Thời gian", dataIndex: "date", key: "date" },
    { title: "Thời lượng", dataIndex: "duration", key: "duration" },
    { title: "Nội dung học", dataIndex: "content", key: "content" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Thêm lịch học
      </Button>
      <Table dataSource={sessions} columns={columns} rowKey="id" />

      {/* Modal nhập liệu */}
      <Modal
        title={editingSession ? "Chỉnh sửa lịch học" : "Thêm lịch học"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: "Nhập môn học!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Thời gian" rules={[{ required: true, message: "Chọn thời gian!" }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng" rules={[{ required: true, message: "Nhập thời lượng!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Nội dung đã học" rules={[{ required: true, message: "Nhập nội dung!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyTracker;
