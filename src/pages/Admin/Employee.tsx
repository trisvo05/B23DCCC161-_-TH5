import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, TimePicker, InputNumber, message } from 'antd';
import dayjs from 'dayjs';

interface WorkingHours {
	start: string;
	end: string;
}

interface Employee {
	id: number;
	name: string;
	workingHours: WorkingHours;
	dailyLimit: number;
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

const EmployeeManagement: React.FC = () => {
	const [employeeList, setEmployeeList] = useState<Employee[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [employeeForm] = Form.useForm();

	useEffect(() => {
		const savedEmployees: Employee[] = fetchData('employees') || [];
		setEmployeeList(savedEmployees);
	}, []);

	const tableColumns = [
		{
			title: 'Họ và Tên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Giờ làm việc',
			dataIndex: 'workingHours',
			key: 'workingHours',
			render: (hours: WorkingHours) => {
				const startTime = dayjs(hours.start, 'HH:mm').format('HH:mm');
				const endTime = dayjs(hours.end, 'HH:mm').format('HH:mm');
				return `${startTime} - ${endTime}`;
			},
		},
		{
			title: 'Giới hạn ngày',
			dataIndex: 'dailyLimit',
			key: 'dailyLimit',
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_: any, record: Employee) => (
				<>
					<Button type="link" onClick={() => openEditModal(record)}>
						Sửa
					</Button>
					<Button type="link" danger onClick={() => deleteEmployee(record.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	const openEditModal = (employee: Employee): void => {
		employeeForm.setFieldsValue({
			...employee,
			workingHours: {
				start: employee.workingHours?.start ? dayjs(employee.workingHours.start, 'HH:mm') : null,
				end: employee.workingHours?.end ? dayjs(employee.workingHours.end, 'HH:mm') : null,
			},
		});
		setModalOpen(true);
	};

	const deleteEmployee = (id: number): void => {
		const newList = employeeList.filter(emp => emp.id !== id);
		setEmployeeList(newList);
		storeData('employees', newList);
		message.success('Employee deleted successfully');
	};

	const handleEmployeeSubmit = (formValues: any): void => {
		const employeeData: Employee = {
			...formValues,
			id: formValues.id || Date.now(),
			workingHours: {
				start: formValues.workingHours.start,
				end: formValues.workingHours.end,
			},
		};

		const updatedList = employeeList.some(emp => emp.id === formValues.id)
			? employeeList.map(emp => (emp.id === formValues.id ? { ...emp, ...employeeData } : emp))
			: [...employeeList, employeeData];

		setEmployeeList(updatedList);
		storeData('employees', updatedList);
		setModalOpen(false);
		employeeForm.resetFields();
		message.success('Employee saved successfully');
	};

	return (
		<>
			<Button type="primary" onClick={() => setModalOpen(true)} style={{ marginBottom: 16 }}>
				Thêm nhân viên
			</Button>
			<Table columns={tableColumns} dataSource={employeeList} rowKey="id" />

			<Modal
				title="Chi tiết nhân viên"
				visible={modalOpen}
				onOk={() => employeeForm.submit()}
				onCancel={() => {
					setModalOpen(false);
					employeeForm.resetFields();
				}}
			>
				<Form form={employeeForm} onFinish={handleEmployeeSubmit} layout="vertical">
					<Form.Item name="id" hidden>
						<Input />
					</Form.Item>

					<Form.Item
						name="name"
						label="Họ và tên"
						rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name={['workingHours', 'start']}
						label="Thời gian bắt đầu làm"
						rules={[{ required: true, message: 'Vui lòng nhập thời gian bắt đầu làm!' }]}
					>
						<TimePicker format="HH:mm" />
					</Form.Item>

					<Form.Item
						name={['workingHours', 'end']}
						label="Thời gian kết thúc làm"
						rules={[{ required: true, message: 'Vui lòng nhập thời gian kết thúc làm!' }]}
					>
						<TimePicker format="HH:mm" />
					</Form.Item>

					<Form.Item
						name="dailyLimit"
						label="Giới hạn khách trong ngày"
						rules={[{ required: true, message: 'Please input daily limit!' }]}
					>
						<InputNumber min={1} />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default EmployeeManagement;
