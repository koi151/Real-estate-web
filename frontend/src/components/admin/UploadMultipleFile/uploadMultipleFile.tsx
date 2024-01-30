import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, UploadProps, Form } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Props = {
  uploadedImages?: string[];
  setImageUrlRemove?: (imageUrl: string | undefined) => void;
};

const UploadMultipleFile: React.FC<Props> = ({ uploadedImages, setImageUrlRemove = () => {} }) => {

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | string[] | undefined>();
  const [previewTitle, setPreviewTitle] = useState<string>('');;

  const [fileList, setFileList] = useState<UploadFile[]>(
    uploadedImages?.map((url, index) => ({
      uid: `existing-${index.toString()}`, 
      name: url,
      status: 'done',
      url: url,
      uploaded: true
    })) || []
  );

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleRemove = (file: UploadFile) => {
    setImageUrlRemove(file.url);
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Form.Item name="images" getValueFromEvent={(e) => e.fileList} label='Upload images:'>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          onRemove={handleRemove}
          multiple={true}
          name='images'
          accept='image/*'
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </Form.Item>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="preview img" style={{ width: '100%' }} src={previewImage as string} />
      </Modal>
    </>
  );
};

export default UploadMultipleFile;

