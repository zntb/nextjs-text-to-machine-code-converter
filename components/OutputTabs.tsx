'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';
import { Architecture, BinaryMode, TextEncoding } from '../types';

interface OutputTabsProps {
  machineCode: string;
  assembly: string;
  binaryOutput: string;
  architecture: Architecture;
  binaryMode: BinaryMode;
  textEncoding: TextEncoding;
  onCopy: (text: string, type: string) => void;
}

export const OutputTabs = ({
  machineCode,
  assembly,
  binaryOutput,
  architecture,
  binaryMode,
  textEncoding,
  onCopy,
}: OutputTabsProps) => {
  const getBinaryModeLabel = () => {
    if (binaryMode === 'text') {
      return textEncoding.toUpperCase();
    }
    return binaryMode.charAt(0).toUpperCase() + binaryMode.slice(1);
  };

  return (
    <Tabs defaultValue='machine' className='w-full'>
      <TabsList className='grid w-full grid-cols-3'>
        <TabsTrigger value='machine'>Machine Code</TabsTrigger>
        <TabsTrigger value='assembly'>Assembly</TabsTrigger>
        <TabsTrigger value='binary'>Binary</TabsTrigger>
      </TabsList>

      <TabsContent value='machine' className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>Hexadecimal</Badge>
            <Badge variant='outline'>{architecture}</Badge>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onCopy(machineCode, 'Machine code')}
            disabled={!machineCode}
          >
            <Copy className='h-4 w-4' />
          </Button>
        </div>
        <div className='bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto'>
          {machineCode || '// Machine code will appear here after conversion'}
        </div>
      </TabsContent>

      <TabsContent value='assembly' className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>Assembly</Badge>
            <Badge variant='outline'>{architecture}</Badge>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onCopy(assembly, 'Assembly code')}
            disabled={!assembly}
          >
            <Copy className='h-4 w-4' />
          </Button>
        </div>
        <div className='bg-slate-950 text-blue-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto whitespace-pre'>
          {assembly || '// Assembly code will appear here after conversion'}
        </div>
      </TabsContent>

      <TabsContent value='binary' className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>Binary</Badge>
            <Badge variant='outline'>{getBinaryModeLabel()}</Badge>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onCopy(binaryOutput, 'Binary code')}
            disabled={!binaryOutput}
          >
            <Copy className='h-4 w-4' />
          </Button>
        </div>
        <div className='bg-slate-950 text-yellow-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto whitespace-pre-wrap break-all'>
          {binaryOutput ||
            '// Binary representation will appear here after conversion'}
        </div>
      </TabsContent>
    </Tabs>
  );
};
