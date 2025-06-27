'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Play, FileCode, Cpu } from 'lucide-react';
import { toast } from 'sonner';

import {
  Architecture,
  SourceLanguage,
  TextEncoding,
  BinaryMode,
  Example,
  BinaryExample,
} from '@/types';
import {
  generateMachineCode,
  generateAssembly,
} from '@/utils/machineCodeGenerator';
import { convertToBinary } from '@/utils/binaryConverter';
import { CODE_EXAMPLES, BINARY_EXAMPLES } from '@/constants/examples';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { ExampleButtons } from '@/components/ExampleButtons';
import { CodeInput } from '@/components/CodeInput';
import { OutputTabs } from '@/components/OutputTabs';
import { InfoSection } from '@/components/InfoSection';
import Header from '@/components/Header';

export default function TextToMachineCode() {
  // Input state
  const [inputText, setInputText] = useState('');

  // Configuration state
  const [architecture, setArchitecture] = useState<Architecture>('x86-64');
  const [language, setLanguage] = useState<SourceLanguage>('c');
  const [textEncoding, setTextEncoding] = useState<TextEncoding>('ascii');
  const [binaryMode, setBinaryMode] = useState<BinaryMode>('text');

  // Output state
  const [machineCode, setMachineCode] = useState('');
  const [assembly, setAssembly] = useState('');
  const [binaryOutput, setBinaryOutput] = useState('');

  const handleConvert = useCallback(() => {
    if (!inputText.trim()) {
      toast.error('Please enter some code to convert');
      return;
    }

    try {
      const generatedMachineCode = generateMachineCode(
        inputText,
        architecture,
        language,
      );
      const generatedAssembly = generateAssembly(inputText, architecture);
      const binary = convertToBinary(
        inputText,
        binaryMode,
        textEncoding,
        generatedMachineCode,
      );

      setMachineCode(generatedMachineCode);
      setAssembly(generatedAssembly);
      setBinaryOutput(binary);

      toast.success('Code converted successfully!');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('An error occurred during conversion');
    }
  }, [inputText, architecture, language, binaryMode, textEncoding]);

  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard`);
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy to clipboard');
    }
  }, []);

  const loadCodeExample = useCallback((example: Example) => {
    setInputText(example.code);
    setLanguage(example.language as SourceLanguage);
  }, []);

  const loadBinaryExample = useCallback((example: BinaryExample) => {
    setInputText(example.code);
    setBinaryMode(example.mode);
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <Header />

        <div className='grid lg:grid-cols-2 gap-6'>
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileCode className='h-5 w-5' />
                Input Code
              </CardTitle>
              <CardDescription>
                Enter your source code or assembly instructions
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <ConfigurationPanel
                architecture={architecture}
                language={language}
                binaryMode={binaryMode}
                textEncoding={textEncoding}
                onArchitectureChange={setArchitecture}
                onLanguageChange={setLanguage}
                onBinaryModeChange={setBinaryMode}
                onTextEncodingChange={setTextEncoding}
              />

              <ExampleButtons
                codeExamples={CODE_EXAMPLES}
                binaryExamples={BINARY_EXAMPLES}
                onLoadCodeExample={loadCodeExample}
                onLoadBinaryExample={loadBinaryExample}
              />

              <CodeInput value={inputText} onChange={setInputText} />

              <Button onClick={handleConvert} className='w-full' size='lg'>
                <Play className='h-4 w-4 mr-2' />
                Convert to Machine Code
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Cpu className='h-5 w-5' />
                Generated Output
              </CardTitle>
              <CardDescription>
                Machine code and assembly for {architecture}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OutputTabs
                machineCode={machineCode}
                assembly={assembly}
                binaryOutput={binaryOutput}
                architecture={architecture}
                binaryMode={binaryMode}
                textEncoding={textEncoding}
                onCopy={copyToClipboard}
              />
            </CardContent>
          </Card>
        </div>

        <InfoSection />
      </div>
    </div>
  );
}
