import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';

interface Service {
	id: number;
	name: string;
	price: number;
	duration: number;
}

export const storeData = (key: string, value: any): void => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error('Error storing data:', error);
	}
};

export const fetchData = (key: string): any => {
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
};

const ServiceManagement: React.FC = () => {
	const [services, setServices] = useState<Service[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [form] = Form.useForm<Service>();

	useEffect(() => {
		const savedServices: Service[] = fetchData('services') || [];
		setServices(savedServices);
	}, []);

	const openEditModal = (service: Service): void => {
		form.setFieldsValue(service);
		setModalOpen(true);
	};

	const deleteService = (id: number): void => {
		const updatedList = services.filter((service) => service.id !== id);
		setServices(updatedList);
		storeData('services', updatedList);
		message.success('Dịch vụ đã được xóa thành công.');
	};

	const handleSubmit = (values: Service): void => {
		const updatedList = services.some((svc) => svc.id === values.id)
			? services.map((svc) => (svc.id === values.id ? { ...svc, ...values } : svc))
			: [...services, { ...values, id: Date.now() }];

		setServices(updatedList);
		storeData('services', updatedList);
		setModalOpen(false);
		form.resetFields();
		message.success('Dịch vụ đã được lưu thành công.');
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giá tiền',
			dataIndex: 'price',
			key: 'price',
			render: (price: number) => `${price.toLocaleString()} $`,
		},
		{
			title: 'Thời lượng (phút)',
			dataIndex: 'duration',
			key: 'duration',
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: Service) => (
				<>
					<Button type="link" onClick={() => openEditModal(record)}>
						Sửa
					</Button>
					<Button type="link" danger onClick={() => deleteService(record.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	return (
		<>
			<Button type="primary" onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>
				Thêm dịch vụ
			</Button>

			<Table columns={columns} dataSource={services} rowKey="id" />

			<Modal
				title="Chi tiết dịch vụ"
				visible={modalOpen}
				onOk={() => form.submit()}
				onCancel={() => {
					setModalOpen(false);
					form.resetFields();
				}}
			>
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<Form.Item name="id" hidden>
						<Input />
					</Form.Item>

					<Form.Item
						name="name"
						label="Tên dịch vụ"
						rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="price"
						label="Giá tiền"
						rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
					>
						<InputNumber min={0} step={1000} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name="duration"
						label="Thời lượng (phút)"
						rules={[{ required: true, message: 'Vui lòng nhập thời lượng dịch vụ!' }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default ServiceManagement;
