import { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Table, message, Typography, Modal, Form } from 'antd';
import { PlusOutlined} from '@ant-design/icons';

const { Title } = Typography;

interface Question {
    id: number;
    subject: string;
    content: string;
    level: string;
    category: string;
}

const levels: string[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

export default function QuestionBank() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
    const [form, setForm] = useState<Omit<Question, 'id'>>({ subject: '', content: '', level: '', category: '' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState({ subject: '', level: '', category: '' });
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('questions');
        if (saved) {
            setQuestions(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('questions', JSON.stringify(questions));
        updateFilteredQuestions();
    }, [questions, search]);

    const updateFilteredQuestions = () => {
        const result: Question[] = [];
        for (const q of questions) {
            if (
                q.subject.toLowerCase().includes(search.subject.toLowerCase()) &&
                q.level.toLowerCase().includes(search.level.toLowerCase()) &&
                q.category.toLowerCase().includes(search.category.toLowerCase())
            ) {
                result.push(q);
            }
        }
        setFilteredQuestions(result);
    };

    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };

    const handleSearchChange = (name: string, value: string) => {
        setSearch({ ...search, [name]: value ? value.trim() : '' });
    };

    const handleAddOrUpdate = () => {
        if (!form.subject.trim() || !form.content.trim() || !form.level || !form.category.trim()) {
            message.warning('Vui lòng điền đầy đủ thông tin câu hỏi.');
            return;
        }
        
        if (editingId !== null) {
            const index = questions.findIndex((q) => q.id === editingId);
            if (index !== -1) {
                const updatedQuestions = [...questions];
                updatedQuestions[index] = { ...form, id: editingId };
                setQuestions(updatedQuestions);
                message.success('Cập nhật câu hỏi thành công!');
            }
            setEditingId(null);
        } else {
            const newQuestion = { ...form, id: Date.now() };
            setQuestions([...questions, newQuestion]);
            message.success('Thêm câu hỏi thành công!');
        }
        setForm({ subject: '', content: '', level: '', category: '' });
        setIsModalVisible(false);
    };

    const handleEdit = (id: number) => {
        const q = questions.find((q) => q.id === id);
        if (q) {
            setForm(q);
            setEditingId(id);
            setIsModalVisible(true);
        }
    };

    const handleDelete = (id: number) => {
        const index = questions.findIndex((q) => q.id === id);
        if (index !== -1) {
            const updatedQuestions = [...questions];
            updatedQuestions.splice(index, 1);
            setQuestions(updatedQuestions);
            message.success('Xóa câu hỏi thành công!');
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>
                Quản lý Câu hỏi
            </Title>

            <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Thêm câu hỏi
            </Button>

            <Card style={{ marginTop: 20, padding: 20 }}>
                <Input
                    placeholder='Tìm theo môn học'
                    value={search.subject}
                    onChange={(e) => handleSearchChange('subject', e.target.value)}
                />
                <Select
                    placeholder='Lọc theo mức độ'
                    value={search.level}
                    onChange={(value) => handleSearchChange('level', value)}
                    style={{ width: '100%' }}
                    allowClear
                >
                    {levels.map((lvl) => (
                        <Select.Option key={lvl} value={lvl}>{lvl}</Select.Option>
                    ))}
                </Select>
            </Card>

            <Table dataSource={filteredQuestions} rowKey='id' pagination={{ pageSize: 5 }} />

            <Modal title={editingId ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={handleAddOrUpdate}>
                <Form layout='vertical'>
                    <Form.Item label='Môn học'>
                        <Input value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Nội dung'>
                        <Input value={form.content} onChange={(e) => handleChange('content', e.target.value)} />
                    </Form.Item>
                    <Form.Item label='Mức độ'>
                        <Select value={form.level} onChange={(value) => handleChange('level', value)} style={{ width: '100%' }}>
                            {levels.map((lvl) => (
                                <Select.Option key={lvl} value={lvl}>{lvl}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
