'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CodeInput = ({
  value,
  onChange,
  placeholder = 'Enter your code here...',
}: CodeInputProps) => {
  return (
    <div className='space-y-2'>
      <Label htmlFor='input'>Source Code</Label>
      <Textarea
        id='input'
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className='min-h-[300px] font-mono text-sm'
      />
    </div>
  );
};
