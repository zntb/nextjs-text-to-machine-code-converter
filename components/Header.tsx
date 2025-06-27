import { Cpu } from 'lucide-react';

export default function Header() {
  return (
    <div className='text-center space-y-2'>
      <div className='flex items-center justify-center gap-2 mb-4'>
        <Cpu className='h-8 w-8 text-blue-600' />
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Text to Machine Code Converter
        </h1>
      </div>
      <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
        Convert high-level code and assembly instructions into machine code for
        different architectures
      </p>
    </div>
  );
}
