import { Card, CardBody, CircularProgress } from '@heroui/react';

type UploadingCardFile = {
  baseName: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'done' | 'error';
};

interface UploadingCardProps {
  file: UploadingCardFile;
}

export const UploadingCard = ({ file }: UploadingCardProps) => {
  let title = '';
  let color: 'warning' | 'secondary' | 'success' | 'danger' = 'warning';

  switch (file.status) {
    case 'uploading':
      title = 'Uploading...';
      color = 'warning';
      break;
    case 'processing':
      title = 'Processing...';
      color = 'secondary';
      break;
    case 'done':
      title = 'Completed';
      color = 'success';
      break;
    case 'error':
      title = 'Failed';
      color = 'danger';
      break;
  }

  return (
    <Card shadow="sm" radius="sm" className="p-3 text-center">
      <CardBody className="flex flex-col items-center justify-center">
        <h1 className="text-sm font-medium mb-1 truncate w-full">{file.baseName}</h1>
        <p className="text-xs text-slate-500 mb-3">{title}</p>
        <CircularProgress color={color} value={file.status === 'processing' ? undefined : file.status === 'done' ? 100 : file.progress} showValueLabel={file.status === 'uploading'} size="lg" aria-label={title} />
      </CardBody>
    </Card>
  );
};
