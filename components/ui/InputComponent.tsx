import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileIcon } from 'lucide-react';

interface InputComponentProps {
  onMessageSend: (message: string) => void;
  onFileSend: (file: File) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({ onMessageSend, onFileSend }) => {
  const [message, setMessage] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      onMessageSend(message);
      setMessage('');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSend(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex items-center w-full">
        <Input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="pr-12 h-12"
        />
        <label htmlFor="file-input" className="absolute right-2 cursor-pointer">
          <FileIcon className="w-6 h-6" />
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <Button onClick={handleSend} className="h-12">
        Send
      </Button>
    </div>
  );
};

export default InputComponent;
