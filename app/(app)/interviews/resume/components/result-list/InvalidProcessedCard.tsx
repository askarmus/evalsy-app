import { Card, CardBody, Button } from '@heroui/react';

import { UploadFile } from '../../types/UploadFileType';
import { Download } from 'lucide-react';

export const InvalidProcessedCard = ({ file }: { file: UploadFile }) => (
  <Card shadow="sm" radius="sm">
    <CardBody className="grid place-items-center   text-center">
      <div>
        <h1 className="text-2xl text-danger mb-4">Invalid Resume</h1>
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
          size="md"
          color="default"
          variant="bordered"
        >
          <Download /> Download Profile
        </Button>
      </div>
    </CardBody>
  </Card>
);
