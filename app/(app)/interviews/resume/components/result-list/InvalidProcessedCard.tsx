import { Card, CardBody, Button } from '@heroui/react';
import { AiOutlineDownload } from 'react-icons/ai';
import { UploadFile } from '../../types/UploadFileType';

export const InvalidProcessedCard = ({ file }: { file: UploadFile }) => (
  <Card shadow="sm" radius="sm">
    <CardBody>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-1xl   text-red-600 mb-4">Invalid Profile</h1>
        <Button
          aria-label="Download"
          onPress={() => {
            const link = document.createElement('a');
            link.href = file.url!;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          size="sm"
          color="default"
          variant="bordered"
        >
          <AiOutlineDownload /> Download Profile
        </Button>
      </div>
    </CardBody>
  </Card>
);
