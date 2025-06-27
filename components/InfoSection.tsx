'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const InfoSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How it Works</CardTitle>
      </CardHeader>
      <CardContent className='grid md:grid-cols-4 gap-4 text-sm'>
        <div className='space-y-2'>
          <h4 className='font-semibold'>1. Parse Input</h4>
          <p className='text-muted-foreground'>
            The converter analyzes your source code and identifies key patterns
            and instructions.
          </p>
        </div>
        <div className='space-y-2'>
          <h4 className='font-semibold'>2. Generate Machine Code</h4>
          <p className='text-muted-foreground'>
            Converts the parsed instructions into hexadecimal machine code for
            the target architecture.
          </p>
        </div>
        <div className='space-y-2'>
          <h4 className='font-semibold'>3. Output Assembly</h4>
          <p className='text-muted-foreground'>
            Provides human-readable assembly code alongside the machine code for
            better understanding.
          </p>
        </div>
        <div className='space-y-2'>
          <h4 className='font-semibold'>4. Binary Conversion</h4>
          <p className='text-muted-foreground'>
            Converts text, numbers, or machine code into binary representation
            using various encodings.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
