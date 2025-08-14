import { AiOutlineDelete, AiOutlineDownload } from 'react-icons/ai';
import DateFormatter from '@/app/utils/DateFormatter';
import { Card, CardHeader, Button, CardFooter, Tooltip } from '@heroui/react';
import { UploadFile } from '../../types/UploadFileType';
import { HiringGradeUtil } from '@/app/utils/hiring-grade.util';
import { Calendar, ThumbsUp } from 'lucide-react';

export const ValidProcessedCard = ({ file, onDelete, onViewDetails, isLoading = false }: { file: UploadFile; onDelete: (id: string) => void; onViewDetails: (id: string) => void; isLoading?: boolean }) => {
  console.log(file);
  const { color, text } = HiringGradeUtil.getHiringRecommendation(file.analysisResults?.matchScore);

  return (
    <Card shadow="sm" radius="sm" className="p-2">
      <CardHeader className="flex items-center justify-between gap-4">
        {/* Left: score + identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-${color}`} aria-label="Match score">
            <span className="text-white text-xs font-bold">{Math.round(file.analysisResults?.matchScore ?? 0)}%</span>
          </div>

          <div className="min-w-0">
            <h4 className="text-base font-semibold text-default-600 truncate">{file.analysisResults?.candidateName ?? 'N/A'}</h4>
            <p className="text-sm text-default-400 truncate">{file.analysisResults?.currentRole ?? 'N/A'}</p>
          </div>
        </div>

        {/* Right: action */}
        <Button color="secondary" isLoading={isLoading} onPress={() => onViewDetails(file.resumeId)} radius="full" variant="flat" size="sm" isDisabled={isLoading}>
          View
        </Button>
      </CardHeader>

      <CardFooter className="gap-3  ">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-x-2">
            <p className="text-default-400 text-small">
              <Calendar width={15} height={15} />
            </p>
            <p className="font-semibold   text-small">{DateFormatter.formatDate(file.createdAt || '', true)}</p>
            <p className="text-default-400 text-small">
              <ThumbsUp width={15} height={15} />
            </p>
            <p className="font-semibold   text-small">{text}</p>
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
                  if (!file.url) return;
                  const link = document.createElement('a');
                  link.href = file.url;
                  link.download = file.name || 'resume';
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
};
