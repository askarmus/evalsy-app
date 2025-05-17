'use client';

import React from 'react';
import { Switch } from '@heroui/react';

interface FraudDetectionSettingsProps {
  values: {
    rightClick: boolean;
    tabSwitch: boolean;
    devTools: boolean;
    faceNotDetected: boolean;
    clipboard: boolean;
  };
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const FraudDetectionSettings: React.FC<FraudDetectionSettingsProps> = ({ values, setFieldValue }) => {
  const settings = [
    {
      key: 'rightClick',
      title: 'Right Click Detection',
      description: 'Detect if a user attempts to right-click during the session, which may indicate suspicious behavior like content copying or inspection.',
    },
    {
      key: 'tabSwitch',
      title: 'Tab Switch Detection',
      description: 'Monitor if the user switches tabs or leaves the current window, potentially indicating a distraction or attempt to bypass restrictions.',
    },
    {
      key: 'devTools',
      title: 'Developer Tools Detection',
      description: 'Detect if browser developer tools are opened, which may suggest an attempt to inspect or manipulate the application.',
    },
    {
      key: 'faceNotDetected',
      title: 'Face Not Detected',
      description: 'Trigger alerts when no face is detected in the camera feed during the session, indicating the user may have moved away or is attempting to bypass monitoring.',
    },
    {
      key: 'clipboard',
      title: 'Clipboard Monitoring',
      description: 'Monitor if the user copies or pastes content, which may indicate cheating or unauthorized data transfer.',
    },
  ];

  return (
    <div className="mt-0">
      <h4 className="text-lg font-semibold mb-2">Fraud Detection Settings</h4>
      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between space-y-1">
            <div className="mr-5">
              <h3 className="font-medium">{setting.title}</h3>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <Switch size="sm" isSelected={values[setting.key as keyof typeof values]} onValueChange={(checked) => setFieldValue(`fraudDetection.${setting.key}`, checked)} aria-label={setting.title} />
          </div>
        ))}
      </div>
    </div>
  );
};
