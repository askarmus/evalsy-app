'use client';
import { useState, useEffect } from 'react';
import { Input, Chip, Button } from '@heroui/react';

export default function EmailInputList({ value = [], onChange }: { value?: string[]; onChange?: (emails: string[]) => void }) {
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>(value || []);
  const [error, setError] = useState('');

  useEffect(() => {
    setEmails(value || []);
  }, [value]);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleAdd = () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    if (!isValidEmail(trimmed)) {
      setError('Invalid email address');
      return;
    }
    if (emails.includes(trimmed)) {
      setError('Duplicate email');
      return;
    }

    const updated = [...emails, trimmed];
    setEmails(updated);
    setError('');
    setEmail('');
    onChange?.(updated);
  };

  const handleRemove = (val: string) => {
    const updated = emails.filter((e) => e !== val);
    setEmails(updated);
    onChange?.(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex items-start gap-2">
        <Input type="email" label="Add Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} isInvalid={!!error} errorMessage={error} placeholder="Enter email and press Enter" className="flex-1" />
        <Button onPress={handleAdd} color="secondary" radius="full" variant="faded" size="sm">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {emails.map((e) => (
          <Chip key={e} color="primary" variant="flat" onClose={() => handleRemove(e)}>
            {e}
          </Chip>
        ))}
      </div>
    </div>
  );
}
