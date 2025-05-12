import { Card, CardBody, Spinner } from '@heroui/react';
import { UploadFile } from '../../types/UploadFileType';

export const UploadedCard = ({ file }: { file: UploadFile }) => (
  <Card shadow="md" radius="md">
    <CardBody>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-1xl   mb-4"> {'Processing... '} </h1>
        <Spinner size="lg" />
      </div>
    </CardBody>
  </Card>
);
