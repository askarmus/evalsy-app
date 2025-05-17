// components/AntiCheat.tsx
'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { logFraudEvent } from '@/services/interview.service';

export type FraudDetectionSettings = {
  tabSwitch: boolean;
  rightClick: boolean;
  devTools: boolean;
  faceNotDetected: boolean;
  clipboard: boolean;
};

type Props = {
  invitationId: string;
  fraudDetection: FraudDetectionSettings;
};

export const AntiCheat = ({ invitationId, fraudDetection }: Props) => {
  useEffect(() => {
    const logEvent = async (type: string, details?: string) => {
      await logFraudEvent({ invitationId, type: type, details: details });
    };

    const onTabChange = () => {
      if (document.hidden && fraudDetection.tabSwitch) {
        logEvent('TAB_SWITCH');
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      if (fraudDetection.rightClick) {
        e.preventDefault();
        logEvent('RIGHT_CLICK');
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const combo = `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`.toLowerCase();
      if (fraudDetection.devTools && (combo === 'ctrl+shift+i' || e.key.toLowerCase() === 'f12' || ['ctrl+u', 'ctrl+p'].includes(combo))) {
        e.preventDefault();
        logEvent('DEVTOOLS_OR_SHORTCUT_ATTEMPT', combo);
      }
      if (fraudDetection.clipboard && ['ctrl+c', 'ctrl+v', 'ctrl+x'].includes(combo)) {
        e.preventDefault();
        logEvent('CLIPBOARD_ATTEMPT', combo);
      }
    };

    const onTextSelect = () => {
      if (fraudDetection.clipboard) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          logEvent('TEXT_SELECTION', selection.toString().slice(0, 100));
        }
      }
    };

    document.addEventListener('visibilitychange', onTabChange);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('selectstart', onTextSelect);

    return () => {
      document.removeEventListener('visibilitychange', onTabChange);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('selectstart', onTextSelect);
    };
  }, [fraudDetection, invitationId]);

  return null;
};
