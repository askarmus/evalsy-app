import { Card, CardBody, CircularProgress, Spinner } from '@heroui/react';
import { UploadFile } from '../../types/UploadFileType';

export const UploadingCard = ({ file }: { file: UploadFile }) => (
  <Card shadow="sm" radius="sm">
    <CardBody>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-1xl  mb-4">Uploading...</h1>
        <CircularProgress color="warning" value={file.progress} showValueLabel size="lg" />
      </div>
    </CardBody>
  </Card>
);
