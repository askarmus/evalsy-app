import { AiOutlineDelete, AiOutlineDownload, AiOutlineRight } from 'react-icons/ai';
import DateFormatter from '@/app/utils/DateFormatter';
import { Card, CardHeader, CircularProgress, Button, CardBody, CardFooter, Tooltip } from '@heroui/react';
import { UploadFile } from '../../types/UploadFileType';

const getRecommendationColor = (recommendation: string) => {
  switch (recommendation?.toLowerCase()) {
    case 'strong':
      return 'success';
    case 'conditional':
      return 'primary';
    case 'weak':
      return 'danger';
    default:
      return 'default';
  }
};

export const ValidProcessedCard = ({ file, onDelete, onViewDetails }: { file: UploadFile; onDelete: (id: string) => void; onViewDetails: (id: string) => void }) => (
  <Card shadow="sm" radius="sm" className="P-5">
    <CardHeader className="justify-between">
      <div className="flex gap-5">
        <div className="flex items-center justify-between w-full">
          <CircularProgress color={getRecommendationColor(file.analysisResults?.hireRecommendation)} value={file.analysisResults?.matchScore} showValueLabel size="lg" />
          <div className="flex flex-col gap-1 items-start ml-3">
            <h4 className="text-lg font-semibold leading-none text-default-600">{file.analysisResults?.candidateName ?? 'N/A'}</h4>
            <h5 className="text-small tracking-tight text-default-400">{file.analysisResults?.currentRole ?? 'N/A'}</h5>
          </div>
        </div>
      </div>
      <Button color="primary" endContent={<AiOutlineRight />} onPress={() => onViewDetails(file.resumeId)} radius="full" variant="solid" size="sm">
        Analysis
      </Button>
    </CardHeader>
    <CardFooter className="gap-3 pt-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-x-2">
          <p className="text-default-400 text-small">Processed</p>
          <p className="font-semibold text-default-400 text-small">{DateFormatter.formatDate(file.createdAt || '', true)}</p>
        </div>
        <div className="flex items-center gap-x-2">
          <Tooltip content="Delete Resume">
            <Button isIconOnly aria-label="Delete" onPress={() => onDelete(file.resumeId)} size="sm" color="default" variant="bordered">
              <AiOutlineDelete />
            </Button>
          </Tooltip>
          <Tooltip content="Download Resume">
            <Button
              isIconOnly
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
              <AiOutlineDownload />
            </Button>
          </Tooltip>
        </div>
      </div>
    </CardFooter>
  </Card>
);
