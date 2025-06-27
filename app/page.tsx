'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Copy, Play, FileCode, Cpu } from 'lucide-react';
import { toast } from 'sonner';

// Simulated machine code generation
const generateMachineCode = (
  text: string,
  architecture: string,
  language: string,
) => {
  const patterns = {
    'x86-64': {
      c: {
        'int main()': '48 89 e5 48 83 ec 10',
        printf: '48 8d 3d 00 00 00 00 e8 00 00 00 00',
        'return 0': '31 c0 c9 c3',
        if: '48 85 c0 74 0a',
        for: '48 89 45 fc eb 0a',
        while: '48 85 c0 75 f6',
      },
      assembly: {
        mov: '48 89',
        add: '48 01',
        sub: '48 29',
        push: '50',
        pop: '58',
        call: 'e8',
        ret: 'c3',
      },
    },
    arm64: {
      c: {
        'int main()': 'fd 7b bf a9 fd 03 00 91',
        printf: '00 00 80 52 01 00 00 94',
        'return 0': '00 00 80 52 fd 7b c1 a8 c0 03 5f d6',
        if: '1f 00 00 71 81 00 00 54',
        for: 'e0 03 00 91 1f 00 00 71',
        while: '1f 00 00 71 a1 ff ff 54',
      },
      assembly: {
        mov: '00 00 80 d2',
        add: '00 00 00 8b',
        sub: '00 00 00 cb',
        ldr: '00 00 40 f9',
        str: '00 00 00 f9',
        bl: '00 00 00 94',
        ret: 'c0 03 5f d6',
      },
    },
  };

  let machineCode = '';
  const lines = text.toLowerCase().split('\n');

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const archPatterns = patterns[architecture as keyof typeof patterns];
    const langPatterns = archPatterns[language as keyof typeof archPatterns];

    let found = false;
    for (const [pattern, code] of Object.entries(langPatterns)) {
      if (trimmedLine.includes(pattern)) {
        machineCode += `${(index * 4)
          .toString(16)
          .padStart(8, '0')}: ${code}\n`;
        found = true;
        break;
      }
    }

    if (!found) {
      // Generate pseudo-random machine code for unknown patterns
      const randomBytes = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, '0'),
      ).join(' ');
      machineCode += `${(index * 4)
        .toString(16)
        .padStart(8, '0')}: ${randomBytes}\n`;
    }
  });

  return machineCode || '00000000: 90 90 90 90\n';
};

const generateAssembly = (text: string, architecture: string) => {
  const lines = text.toLowerCase().split('\n');
  let assembly = '';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    if (architecture === 'x86-64') {
      if (trimmedLine.includes('main')) {
        assembly += `main:\n    push rbp\n    mov rbp, rsp\n`;
      } else if (trimmedLine.includes('printf')) {
        assembly += `    lea rdi, [rel msg]\n    call printf\n`;
      } else if (trimmedLine.includes('return')) {
        assembly += `    xor eax, eax\n    leave\n    ret\n`;
      } else {
        assembly += `    ; ${trimmedLine}\n`;
      }
    } else if (architecture === 'arm64') {
      if (trimmedLine.includes('main')) {
        assembly += `main:\n    stp x29, x30, [sp, #-16]!\n    mov x29, sp\n`;
      } else if (trimmedLine.includes('printf')) {
        assembly += `    adrp x0, msg\n    add x0, x0, :lo12:msg\n    bl printf\n`;
      } else if (trimmedLine.includes('return')) {
        assembly += `    mov w0, #0\n    ldp x29, x30, [sp], #16\n    ret\n`;
      } else {
        assembly += `    ; ${trimmedLine}\n`;
      }
    }
  });

  return assembly || '; No assembly generated\n';
};

// Binary conversion functions
const textToBinary = (text: string, encoding = 'ascii') => {
  let binary = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    let charCode: number;

    if (encoding === 'ascii') {
      charCode = char.charCodeAt(0);
      binary += charCode.toString(2).padStart(8, '0') + ' ';
    } else if (encoding === 'utf8') {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(char);
      for (const byte of bytes) {
        binary += byte.toString(2).padStart(8, '0') + ' ';
      }
    } else if (encoding === 'utf16') {
      charCode = char.charCodeAt(0);
      binary += charCode.toString(2).padStart(16, '0') + ' ';
    }
  }

  return binary.trim();
};

const hexToBinary = (hexString: string) => {
  return hexString
    .split('\n')
    .map(line => {
      if (!line.trim()) return '';

      const parts = line.split(': ');
      if (parts.length !== 2) return line;

      const address = parts[0];
      const hexBytes = parts[1];

      const binaryBytes = hexBytes
        .split(' ')
        .map(hex => {
          if (hex.length === 2) {
            return Number.parseInt(hex, 16).toString(2).padStart(8, '0');
          }
          return hex;
        })
        .join(' ');

      return `${address}: ${binaryBytes}`;
    })
    .join('\n');
};

const numberToBinary = (input: string) => {
  const lines = input.split('\n');
  return lines
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';

      // Try to parse as number
      const num = Number.parseInt(trimmed);
      if (!isNaN(num)) {
        const binary = num.toString(2);
        return `${num} (decimal) = ${binary} (binary)`;
      }

      // If not a number, convert as text
      return `"${trimmed}" = ${textToBinary(trimmed)}`;
    })
    .filter(line => line)
    .join('\n');
};

const examples = [
  {
    name: 'Hello World (C)',
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    language: 'c',
  },
  {
    name: 'Simple Loop (C)',
    code: `int main() {
    for (int i = 0; i < 10; i++) {
        printf("%d", i);
    }
    return 0;
}`,
    language: 'c',
  },
  {
    name: 'Assembly Instructions',
    code: `mov rax, 1
add rax, 2
sub rax, 1
ret`,
    language: 'assembly',
  },
];

const binaryExamples = [
  {
    name: 'Hello World Text',
    code: 'Hello, World!',
    mode: 'text',
  },
  {
    name: 'Numbers to Binary',
    code: '42\n255\n1024',
    mode: 'numbers',
  },
  {
    name: 'Unicode Text',
    code: 'Hello 世界 🌍',
    mode: 'text',
  },
];

export default function TextToMachineCode() {
  const [inputText, setInputText] = useState('');
  const [architecture, setArchitecture] = useState('x86-64');
  const [language, setLanguage] = useState('c');
  const [machineCode, setMachineCode] = useState('');
  const [assembly, setAssembly] = useState('');

  const [binaryOutput, setBinaryOutput] = useState('');
  const [textEncoding, setTextEncoding] = useState('ascii');
  const [binaryMode, setBinaryMode] = useState('text');

  const handleConvert = () => {
    if (!inputText.trim()) {
      toast('Error', {
        description: 'Please enter some code to convert',
      });
      return;
    }

    const generated = generateMachineCode(inputText, architecture, language);
    const generatedAssembly = generateAssembly(inputText, architecture);

    // Generate binary output based on mode
    let binary = '';
    if (binaryMode === 'text') {
      binary = textToBinary(inputText, textEncoding);
    } else if (binaryMode === 'machine') {
      binary = hexToBinary(generated);
    } else if (binaryMode === 'numbers') {
      binary = numberToBinary(inputText);
    }

    setMachineCode(generated);
    setAssembly(generatedAssembly);
    setBinaryOutput(binary);

    toast('Success', {
      description: 'Code converted successfully!',
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast('Copied', {
      description: `${type} copied to clipboard`,
    });
  };

  const loadExample = (example: (typeof examples)[0]) => {
    setInputText(example.code);
    setLanguage(example.language);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Cpu className='h-8 w-8 text-blue-600' />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Text to Machine Code Converter
            </h1>
          </div>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Convert high-level code and assembly instructions into machine code
            for different architectures
          </p>
        </div>

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
              {/* Configuration */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='architecture'>Target Architecture</Label>
                  <Select value={architecture} onValueChange={setArchitecture}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='x86-64'>x86-64 (Intel/AMD)</SelectItem>
                      <SelectItem value='arm64'>
                        ARM64 (Apple Silicon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='language'>Source Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
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
                  <Select value={binaryMode} onValueChange={setBinaryMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='text'>Text to Binary</SelectItem>
                      <SelectItem value='machine'>
                        Machine Code to Binary
                      </SelectItem>
                      <SelectItem value='numbers'>Numbers to Binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='encoding'>Text Encoding</Label>
                  <Select
                    value={textEncoding}
                    onValueChange={setTextEncoding}
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

              {/* Examples */}
              <div className='space-y-2'>
                <Label>Quick Examples</Label>
                <div className='space-y-2'>
                  <div className='flex flex-wrap gap-2'>
                    <span className='text-sm font-medium'>Code:</span>
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant='outline'
                        size='sm'
                        onClick={() => loadExample(example)}
                      >
                        {example.name}
                      </Button>
                    ))}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <span className='text-sm font-medium'>Binary:</span>
                    {binaryExamples.map((example, index) => (
                      <Button
                        key={index}
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setInputText(example.code);
                          setBinaryMode(example.mode);
                        }}
                      >
                        {example.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Input Textarea */}
              <div className='space-y-2'>
                <Label htmlFor='input'>Source Code</Label>
                <Textarea
                  id='input'
                  placeholder='Enter your code here...'
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className='min-h-[300px] font-mono text-sm'
                />
              </div>

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
                      onClick={() =>
                        copyToClipboard(machineCode, 'Machine code')
                      }
                      disabled={!machineCode}
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='bg-slate-950 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto'>
                    {machineCode ||
                      '// Machine code will appear here after conversion'}
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
                      onClick={() => copyToClipboard(assembly, 'Assembly code')}
                      disabled={!assembly}
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='bg-slate-950 text-blue-400 p-4 rounded-lg font-mono text-sm min-h-[300px] overflow-auto whitespace-pre'>
                    {assembly ||
                      '// Assembly code will appear here after conversion'}
                  </div>
                </TabsContent>

                <TabsContent value='binary' className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Badge variant='secondary'>Binary</Badge>
                      <Badge variant='outline'>
                        {binaryMode === 'text'
                          ? textEncoding.toUpperCase()
                          : binaryMode}
                      </Badge>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() =>
                        copyToClipboard(binaryOutput, 'Binary code')
                      }
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
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>How it Works</CardTitle>
          </CardHeader>
          <CardContent className='grid md:grid-cols-4 gap-4 text-sm'>
            <div className='space-y-2'>
              <h4 className='font-semibold'>1. Parse Input</h4>
              <p className='text-muted-foreground'>
                The converter analyzes your source code and identifies key
                patterns and instructions.
              </p>
            </div>
            <div className='space-y-2'>
              <h4 className='font-semibold'>2. Generate Machine Code</h4>
              <p className='text-muted-foreground'>
                Converts the parsed instructions into hexadecimal machine code
                for the target architecture.
              </p>
            </div>
            <div className='space-y-2'>
              <h4 className='font-semibold'>3. Output Assembly</h4>
              <p className='text-muted-foreground'>
                Provides human-readable assembly code alongside the machine code
                for better understanding.
              </p>
            </div>
            <div className='space-y-2'>
              <h4 className='font-semibold'>4. Binary Conversion</h4>
              <p className='text-muted-foreground'>
                Converts text, numbers, or machine code into binary
                representation using various encodings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
