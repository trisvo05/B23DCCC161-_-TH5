import { Table, Button, Modal, Form, Input, message  ,Select} from 'antd';
import { useEffect, useState } from 'react';
import { CheckCircleTwoTone, ClockCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import {
  getRegistrations,
  saveRegistrations,
  updateRegistration,
  deleteRegistration 
} 
from '@/services/registrationService';
import { Registration } from '@/models/club';
const { Option } = Select;







const index = () => {
  const [data, setData] = useState<Registration[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentRejecting, setCurrentRejecting] = useState<Registration | null>(null);
  const [form] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();



  useEffect(() => {
    setData(getRegistrations());
  }, []);

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: 'Bạn có chắc chắn muốn xoá bản ghi này không?',
      onOk: () => {
        deleteRegistration(id);
        setData(getRegistrations()); // cập nhật lại state
        message.success('Đã xoá bản ghi.');
      }
    });
  };


  const handleApprove = (record: Registration) => {
    const updated = {
      
      ...record,
      status: 'Duyệt' as const,
      history: [
        ...(record.history || []),
        `Admin đã Duyệt đơn vào lúc ${new Date().toLocaleString()}`
      ]
    };
    updateRegistration(updated);
    setData(getRegistrations());
    message.success('Đã duyệt đơn');
  };

  const handleReject = (record: Registration) => {
    setCurrentRejecting(record);
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = () => {
    form.validateFields().then((values : {note: string}) => {
      if (currentRejecting) {
        const updated = {
          ...currentRejecting,
          status: 'Từ chối'as const,
          note: values.note,
          history: [
            ...(currentRejecting.history || []),
            `Admin đã Từ chối vào lúc ${new Date().toLocaleString()} với lý do: ${values.note}`
          ]
        };
        updateRegistration(updated);
        setData(getRegistrations());
        message.warning('Đã từ chối đơn.');
        form.resetFields();
        setRejectModalVisible(false);
      }
    });
  };

  const handleBulkApprove = () => {
    const updatedList = data.map(item =>
      selectedRowKeys.includes(item.id)
        ? {
            ...item,
            status: 'Duyệt' as const ,
            history: [...(item.history || []), `Admin đã duyệt hàng loạt lúc ${new Date().toLocaleString()}`]
          }
        : item
    );
   
    saveRegistrations(updatedList);
    setData(getRegistrations());
    setSelectedRowKeys([]);
    message.success('Đã duyệt hàng loạt.');
  };


    const handleBulkReject = () => {
      const updatedList = data.map(item =>
        selectedRowKeys.includes(item.id)
          ? {
              ...item,
              status: 'Từ chối' as const ,
              history: [...(item.history || []), `Admin đã duyệt hàng loạt lúc ${new Date().toLocaleString()}`]
            }
          : item
      );
    
      saveRegistrations(updatedList);
      setData(getRegistrations());
      setSelectedRowKeys([]);
      message.success('Đã duyệt hàng loạt.');
    };




  const columns = [
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Email', dataIndex: 'email' },
  { title: 'SĐT', dataIndex: 'phone' },
  { title: 'Giới tính', dataIndex: 'gender' },
  { title: 'Địa chỉ', dataIndex: 'address' },
  { title: 'Sở trường', dataIndex: 'strength' },
  { title: 'Lý do đăng ký', dataIndex: 'reason' },

  // ✅ Trạng thái có icon
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (status: string) => {
      if (status === 'Duyệt') {
        return (
          <span style={{ color: '#52c41a', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            Duyệt
          </span>
        );
      } else if (status === 'Từ chối') {
        return (
          <span style={{ color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
            Từ chối
          </span>
        );
      }
      else if (status === 'Xóa') {
        return (
          <span style={{ color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CloseCircleTwoTone twoToneColor="#ff4d4f" />
            Từ chối
          </span>
        );
      }
      
      else {
        return (
          <span style={{ color: '#faad14', display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockCircleTwoTone twoToneColor="#faad14" />
            Đang chờ
          </span>
        );
      }
    }
  },

  {
    title: 'Ghi chú',
    dataIndex: 'note',
    render: (note: string | undefined) => note || '—'
  },
  {
    title: 'Thao tác',
    render: (record: Registration) => (
      <>
        <Button type="link" onClick={() => handleApprove(record)}>Duyệt</Button>
        <Button type="link" danger onClick={() => handleReject(record)}>Từ chối</Button>
      </>
    )
  }
  ];


  return (
    <>
      <div style={{ marginBottom: 16 }}>
      <Button type="primary" onClick={() => setCreateModalVisible(true)}>
        Thêm mới
      </Button>
     
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={handleBulkApprove}
        >
          Duyệt {selectedRowKeys.length} đơn đã chọn
        </Button>
        <Button
          type="primary"
          disabled={selectedRowKeys.length === 0}
          onClick={handleBulkReject}
        >
          Từ chối {selectedRowKeys.length} đơn đã chọn
        </Button>
      </div>

      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        dataSource={data}
        columns={columns}
      />

      <Modal
        title="Lý do từ chối"
        visible={rejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="note"
            label="Nhập lý do"
            rules={[{ required: true, message: 'Bạn phải nhập lý do từ chối' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
  title="Thêm đơn đăng ký thành viên"
  visible={createModalVisible}
  onCancel={() => {
    setCreateModalVisible(false);
    createForm.resetFields();
  }}
  onOk={() => {
    createForm.validateFields().then((values : { note: string } )=> {
      const newId = Date.now();
      const newItem: Registration = {
        ...values,
        id: newId,
        status: 'Đang chờ' as const,
        history: [
          `Admin đã thêm mới vào lúc ${new Date().toLocaleString()}`
        ],
        fullName: '',
        email: '',
        phone: '',
        gender: 'Nam',
        address: '',
        strength: '',
        clubId: 0,
        reason: ''
      };
      const currentData = getRegistrations();
      saveRegistrations([...currentData, newItem]);
      setData(getRegistrations());
      message.success('Đã thêm đơn mới.');
      setCreateModalVisible(false);
      createForm.resetFields();
    });
  }}
>
  <Form form={createForm} layout="vertical">
    <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
      <Input />
    </Form.Item>
    <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
      <Select>
        <Option value="Nam">Nam</Option>
        <Option value="Nữ">Nữ</Option>
        <Option value="Khác">Khác</Option>
      </Select>
    </Form.Item>
    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
      <Input />
    </Form.Item>
    <Form.Item name="strength" label="Sở trường">
      <Input />
    </Form.Item>
    <Form.Item name="clubId" label="Câu lạc bộ" rules={[{ required: true }]}>
      <Select placeholder="Chọn CLB">
        <Option value={1}>CLB Bóng đá</Option>
        <Option value={2}>CLB Kỹ thuật</Option>
        <Option value={3}>CLB Âm nhạc</Option>
      </Select>
    </Form.Item>
    <Form.Item name="reason" label="Lý do đăng ký">
      <Input.TextArea rows={3} />
    </Form.Item>
  </Form>
</Modal>

    </>
  );
};

export default index ; 
