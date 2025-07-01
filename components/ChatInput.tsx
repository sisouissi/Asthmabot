import React, { useState } from 'react';
import { SendIcon } from './SendIcon';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Posez votre question ici..."
        className="flex-1 w-full px-5 py-3 text-gray-800 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-full hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transform transition-transform duration-200 hover:scale-105"
        aria-label="Envoyer"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
  );
};