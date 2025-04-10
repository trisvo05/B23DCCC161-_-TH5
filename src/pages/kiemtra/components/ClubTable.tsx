import { Table, Button } from 'antd';
// import { Member } from '@/interfaces/club';

const ClubTable = ({ members, onChangeSelection, onClickChangeClub }) => {
  const columns = [
    { title: 'Họ tên', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', sorter: true },
    { title: 'SĐT', dataIndex: 'phone' },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: string[]) => {
      onChangeSelection(selectedRowKeys);
    },
  };

  return (
    <>
      <Button onClick={onClickChangeClub} disabled={!rowSelection.length}>Đổi CLB</Button>
      <Table rowKey="id" dataSource={members} columns={columns} rowSelection={{ type: 'checkbox', ...rowSelection }} />
    </>
  );
};

export default ClubTable;
