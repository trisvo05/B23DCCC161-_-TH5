import useInitModel from '@/hooks/useInitModel';
import {
  getAllHinhThucDaoTao,
  getHinhThucDaoTaoPageable,
  postHinhThucDaoTao,
} from '@/services/HinhThucDaoTao/hinhthucdaotao';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<HinhThucDaoTao.Record>();
  const [danhSach, setDanhSach] = useState<HinhThucDaoTao.Record[]>([]);
  const objInitModel = useInitModel();
  const { page, limit, setLoading, condition, setTotal, setVisibleForm } = objInitModel;

  const getAllHinhThucDaoTaoModel = async () => {
    setLoading(true);
    const response = await getAllHinhThucDaoTao();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  const getHinhThucDaoTaoPageableModel = async () => {
    setLoading(true);
    const response = await getHinhThucDaoTaoPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postHinhThucDaoTaoModel = async (payload: HinhThucDaoTao.Record) => {
    setLoading(true);
    await postHinhThucDaoTao(payload);
    getHinhThucDaoTaoPageableModel();
    message.success('Thêm thành công');
    setVisibleForm(false);
    setLoading(false);
  };

  return {
    postHinhThucDaoTaoModel,
    getHinhThucDaoTaoPageableModel,
    getAllHinhThucDaoTaoModel,
    record,
    setRecord,
    danhSach,
    setDanhSach,
    ...objInitModel,
  };
};
