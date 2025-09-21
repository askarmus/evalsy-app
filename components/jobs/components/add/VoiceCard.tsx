'use client';

import { Card, CardBody, CardHeader, Button, Divider, Chip } from '@heroui/react';
import { Pause, Play, User, Globe } from 'lucide-react';
import { toTitleCase } from '@/app/utils/text.utls';

export type VoiceCardProps = {
  voice: { label: string; voiceId?: string; labels: any };
  isSelected: boolean;
  isPreviewing: boolean;
  onSelect: (voiceId: string) => void;
  onPreview: (voice: { voiceId?: string }) => void;
  onStop: () => void;
};

export function VoiceCard({ voice, isSelected, isPreviewing, onSelect, onPreview, onStop }: VoiceCardProps) {
  return (
    <Card isBlurred radius="lg" shadow="sm" className={`border-2 ${isSelected ? 'border-secondary-500' : 'border-default-200'}`}>
      <CardHeader className="flex items-start justify-between p-4">
        <div>
          <div className="font-semibold text-lg">{voice.label}</div>
          <div className="text-sm opacity-70">Voice Profile</div>
        </div>

        <Button size="sm" isIconOnly radius="full" variant={isPreviewing ? 'solid' : 'bordered'} className="h-7 w-7 p-0 shrink-0" onPress={() => (isPreviewing ? onStop() : onPreview(voice))}>
          {isPreviewing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
        </Button>
      </CardHeader>

      <Divider />

      <CardBody className="p-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M12 7v5l3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Chip size="sm" variant="bordered" color="primary">
              {toTitleCase(voice.labels.age)}
            </Chip>
          </div>

          <div className="flex items-center gap-2">
            <User size={16} />
            <Chip size="sm" variant="bordered" color="secondary">
              {toTitleCase(voice.labels.gender)}
            </Chip>
          </div>

          <div className="flex items-center gap-2">
            <Globe size={16} />
            <Chip size="sm" variant="bordered" color="primary">
              {toTitleCase(voice.labels.accent)}
            </Chip>
          </div>
        </div>

        <Button fullWidth radius="full" color="primary" variant="solid" size="sm" className="mt-4" onPress={() => onSelect(voice.voiceId!)}>
          Select Voice
        </Button>
      </CardBody>
    </Card>
  );
}
