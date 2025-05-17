import { Button, Card, CardBody } from '@heroui/react';
import { FaExclamationCircle } from 'react-icons/fa';

export default function EmptyStateCards({ onReset, title, description }: { onReset?: () => void; title: string; description: string }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card radius="sm" shadow="sm" className="overflow-hidden col-span-full">
        <CardBody className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted/30 p-3 rounded-full">
                <FaExclamationCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium">{title || 'No results found'}</h3>
                <p className="text-sm text-muted-foreground">{description || 'Try adjusting your filters or search terms.'}</p>
              </div>
            </div>
            {onReset && (
              <div className="flex gap-2 shrink-0">
                <Button variant="solid" size="sm" onPress={onReset}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
