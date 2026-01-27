import React, { useState } from 'react';
import {
  Modal,
  Button,
  Space,
  Radio,
  Checkbox,
  Upload,
  message,
  Typography,
  Alert,
} from 'antd';
import {
  DownloadOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ImportOptions } from '../../types/export';

const { Text } = Typography;

interface DataManagementProps {
  onExport: () => void;
  onImport: (file: File, options: ImportOptions) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({
  onExport,
  onImport,
}) => {
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    mode: 'merge',
    includeRecipes: true,
    includeMaterials: true,
    handleConflicts: 'skip',
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleExport = () => {
    Modal.confirm({
      title: '匯出資料',
      icon: <ExclamationCircleOutlined />,
      content: '將匯出所有材料和配方資料為 JSON 檔案',
      okText: '匯出',
      cancelText: '取消',
      onOk: onExport,
    });
  };

  const handleImportSubmit = () => {
    if (fileList.length === 0) {
      message.error('請選擇檔案');
      return;
    }

    const file = fileList[0].originFileObj as File;
    onImport(file, importOptions);
    setImportModalOpen(false);
    setFileList([]);
  };

  const uploadProps = {
    accept: '.json',
    maxCount: 1,
    fileList,
    beforeUpload: (file: File) => {
      setFileList([file as any]);
      return false; // 防止自動上傳
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <>
      <Space>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          匯出資料
        </Button>
        <Button
          icon={<UploadOutlined />}
          onClick={() => setImportModalOpen(true)}
        >
          匯入資料
        </Button>
      </Space>

      <Modal
        title="匯入資料"
        open={importModalOpen}
        onOk={handleImportSubmit}
        onCancel={() => {
          setImportModalOpen(false);
          setFileList([]);
        }}
        okText="匯入"
        cancelText="取消"
        width={600}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>選擇 JSON 檔案</Button>
          </Upload>

          {importOptions.mode === 'replace' && (
            <Alert
              message="警告"
              description="取代模式將刪除所有現有資料！"
              type="warning"
              showIcon
            />
          )}

          <div>
            <Text strong>匯入模式：</Text>
            <Radio.Group
              value={importOptions.mode}
              onChange={e =>
                setImportOptions({ ...importOptions, mode: e.target.value })
              }
              style={{ marginTop: '8px', display: 'block' }}
            >
              <Space direction="vertical">
                <Radio value="merge">合併（保留現有資料）</Radio>
                <Radio value="replace">取代（清除所有現有資料）</Radio>
              </Space>
            </Radio.Group>
          </div>

          <div>
            <Text strong>匯入內容：</Text>
            <div style={{ marginTop: '8px' }}>
              <Checkbox
                checked={importOptions.includeMaterials}
                onChange={e =>
                  setImportOptions({
                    ...importOptions,
                    includeMaterials: e.target.checked,
                  })
                }
              >
                材料
              </Checkbox>
              <Checkbox
                checked={importOptions.includeRecipes}
                onChange={e =>
                  setImportOptions({
                    ...importOptions,
                    includeRecipes: e.target.checked,
                  })
                }
                style={{ marginLeft: '16px' }}
              >
                配方
              </Checkbox>
            </div>
          </div>

          {importOptions.mode === 'merge' && (
            <div>
              <Text strong>衝突處理：</Text>
              <Radio.Group
                value={importOptions.handleConflicts}
                onChange={e =>
                  setImportOptions({
                    ...importOptions,
                    handleConflicts: e.target.value,
                  })
                }
                style={{ marginTop: '8px', display: 'block' }}
              >
                <Space direction="vertical">
                  <Radio value="skip">跳過（保留現有）</Radio>
                  <Radio value="overwrite">覆蓋（使用匯入）</Radio>
                  <Radio value="rename">重新命名（兩者皆保留）</Radio>
                </Space>
              </Radio.Group>
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
};

export default DataManagement;
