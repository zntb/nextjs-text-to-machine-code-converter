'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Architecture,
  SourceLanguage,
  BinaryMode,
  TextEncoding,
} from '../types';

interface ConfigurationPanelProps {
  architecture: Architecture;
  language: SourceLanguage;
  binaryMode: BinaryMode;
  textEncoding: TextEncoding;
  onArchitectureChange: (value: Architecture) => void;
  onLanguageChange: (value: SourceLanguage) => void;
  onBinaryModeChange: (value: BinaryMode) => void;
  onTextEncodingChange: (value: TextEncoding) => void;
}

export const ConfigurationPanel = ({
  architecture,
  language,
  binaryMode,
  textEncoding,
  onArchitectureChange,
  onLanguageChange,
  onBinaryModeChange,
  onTextEncodingChange,
}: ConfigurationPanelProps) => {
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='architecture'>Target Architecture</Label>
          <Select value={architecture} onValueChange={onArchitectureChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='x86-64'>x86-64 (Intel/AMD)</SelectItem>
              <SelectItem value='arm64'>ARM64 (Apple Silicon)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='language'>Source Language</Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='c'>C</SelectItem>
              <SelectItem value='assembly'>Assembly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='binaryMode'>Binary Conversion Mode</Label>
          <Select value={binaryMode} onValueChange={onBinaryModeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='text'>Text to Binary</SelectItem>
              <SelectItem value='machine'>Machine Code to Binary</SelectItem>
              <SelectItem value='numbers'>Numbers to Binary</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='encoding'>Text Encoding</Label>
          <Select
            value={textEncoding}
            onValueChange={onTextEncodingChange}
            disabled={binaryMode !== 'text'}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='ascii'>ASCII (8-bit)</SelectItem>
              <SelectItem value='utf8'>UTF-8</SelectItem>
              <SelectItem value='utf16'>UTF-16 (16-bit)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
