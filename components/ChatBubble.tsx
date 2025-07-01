import React from 'react';
import type { DisplayMessage } from '../types';
import { UserIcon } from './UserIcon';
import { AsthmaIcon } from './AsthmaIcon';

const SystemMessage: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center text-xs text-gray-600 px-4 py-2 my-2 bg-white/50 rounded-lg shadow-sm max-w-md mx-auto">
    {text}
  </div>
);

const LoadingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
    </div>
);


// Helper function to parse inline markdown-like syntax (bold, italic, citations)
const parseInlineFormatting = (line: string): React.ReactNode[] => {
    // Regex for bold, italic, and citations
    const regex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)|(\((?:Page|p\.)\s*\d+\))/g;
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    let match;

    while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
        }

        if (match[1]) { // Bold
            parts.push(<strong key={lastIndex}>{match[2]}</strong>);
        } else if (match[3]) { // Italic
            parts.push(<em key={lastIndex}>{match[4]}</em>);
        } else if (match[5]) { // Citation
            parts.push(<strong key={lastIndex} className="text-blue-600 font-semibold">{match[5]}</strong>);
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
    }
    
    const finalParts: React.ReactNode[] = [];
    for (const part of parts) {
        const lastPart = finalParts[finalParts.length - 1];
        if (finalParts.length > 0 && typeof lastPart === 'string' && typeof part === 'string') {
            finalParts[finalParts.length - 1] = lastPart + part;
        } else {
            finalParts.push(part);
        }
    }
    return finalParts;
};

// Main function to parse block-level markdown (headings, lists, paragraphs)
const formatTextWithMarkdown = (text: string): React.ReactNode => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc list-outside space-y-1.5 my-2 pl-5">
                    {listItems.map((item, index) => (
                        <li key={index}>{parseInlineFormatting(item)}</li>
                    ))}
                </ul>
            );
            listItems = [];
        }
    };

    lines.forEach((line, lineIndex) => {
        if (line.trim().startsWith('- ')) {
            listItems.push(line.trim().substring(2));
        } else {
            flushList(); // End of a list
            if (line.startsWith('### ')) {
                elements.push(<h3 key={lineIndex} className="text-lg font-semibold mt-4 mb-1">{parseInlineFormatting(line.substring(4))}</h3>);
            } else if (line.startsWith('## ')) {
                elements.push(<h2 key={lineIndex} className="text-xl font-bold mt-4 mb-2">{parseInlineFormatting(line.substring(3))}</h2>);
            } else if (line.trim() !== '') {
                elements.push(<p key={lineIndex} className="my-1.5">{parseInlineFormatting(line)}</p>);
            }
        }
    });

    flushList(); // Flush any remaining list items at the end

    return <>{elements}</>;
};


export const ChatBubble: React.FC<{ message: DisplayMessage }> = ({ message }) => {
  const { role, text, isStreaming } = message;

  if (role === 'system') {
    return <SystemMessage text={text} />;
  }

  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : ''} fade-in`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white ${isUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
        {isUser ? <UserIcon className="w-6 h-6 text-blue-600" /> : <AsthmaIcon className="w-6 h-6 text-blue-700" />}
      </div>
      <div className={`max-w-[80%] p-4 rounded-t-xl break-words ${isUser ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-bl-xl shadow-lg' : 'bg-white text-gray-800 rounded-br-xl shadow-md'}`}>
        {isStreaming && !text ? <LoadingIndicator /> : <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-h3:mt-3 prose-h3:mb-1">{formatTextWithMarkdown(text)}</div>}
      </div>
    </div>
  );
};