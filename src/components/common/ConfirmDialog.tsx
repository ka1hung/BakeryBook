import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmDialogOptions {
  title: string;
  content: string;
  onOk: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}

export const showConfirmDialog = ({
  title,
  content,
  onOk,
  onCancel,
  okText = '確定',
  cancelText = '取消',
}: ConfirmDialogOptions) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText,
    onOk,
    onCancel,
    okButtonProps: { danger: true },
  });
};
