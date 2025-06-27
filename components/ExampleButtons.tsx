'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Example, BinaryExample } from '../types';

interface ExampleButtonsProps {
  codeExamples: Example[];
  binaryExamples: BinaryExample[];
  onLoadCodeExample: (example: Example) => void;
  onLoadBinaryExample: (example: BinaryExample) => void;
}

export const ExampleButtons = ({
  codeExamples,
  binaryExamples,
  onLoadCodeExample,
  onLoadBinaryExample,
}: ExampleButtonsProps) => {
  return (
    <div className='space-y-2'>
      <Label>Quick Examples</Label>
      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2'>
          <span className='text-sm font-medium'>Code:</span>
          {codeExamples.map((example, index) => (
            <Button
              key={`code-${index}`}
              variant='outline'
              size='sm'
              onClick={() => onLoadCodeExample(example)}
            >
              {example.name}
            </Button>
          ))}
        </div>
        <div className='flex flex-wrap gap-2'>
          <span className='text-sm font-medium'>Binary:</span>
          {binaryExamples.map((example, index) => (
            <Button
              key={`binary-${index}`}
              variant='outline'
              size='sm'
              onClick={() => onLoadBinaryExample(example)}
            >
              {example.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
