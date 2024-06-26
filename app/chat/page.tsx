"use client"
import React, { useState } from 'react';
import { ModeToggle } from "@/components/ui/theme-button";
import InputComponent from '@/components/ui/InputComponent';
import MessageComponent from '@/components/ui/MessageComponent';

const UsersPage: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSend = (newMessage: string) => {
    setMessages([...messages, newMessage]);
  };

  const handleFileSend = (file: File) => {
    console.log(file);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-6 pt-5 pl-10 border-b">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <MessageComponent key={index} message={msg} />
          ))}
        </div>
      </div>
      <div className="p-4 border-t pb-10">
        <InputComponent onMessageSend={handleSend} onFileSend={handleFileSend} />
      </div>
    </div>
  );
};

export default UsersPage;
