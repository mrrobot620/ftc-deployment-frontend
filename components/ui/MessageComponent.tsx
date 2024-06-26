"use client"
import React from 'react';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';

interface MessageComponentProps {
  message: string;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ message }) => {
  return (
    <Card className="message p-3 rounded-lg shadow-md">
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  );
};

export default MessageComponent;
