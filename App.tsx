import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from './hooks/useChat';
import type { DisplayMessage, ChatMessage } from './types';
import { ChatInput } from './components/ChatInput';
import { ChatBubble } from './components/ChatBubble';
import { AsthmaIcon } from './components/AsthmaIcon';
import { ExamplePrompts } from './components/ExamplePrompts';

const App: React.FC = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      id: 'initial-1',
      role: 'model',
      text: 'Bonjour ! Je suis DocuBot, votre assistant médical spécialisé dans le guide de l\'INEAS sur la prise en charge de l’asthme. Comment puis-je vous aider ?',
    },
    {
      id: 'initial-2',
      role: 'system',
      text: 'Avertissement : Cet outil est à but informatif et ne remplace pas un avis médical professionnel. Les réponses sont générées par une IA et peuvent contenir des erreurs.'
    }
  ]);

  const { sendMessage, isLoading, error } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: DisplayMessage = { id: Date.now().toString(), role: 'user', text };
    const aiMessage: DisplayMessage = { id: (Date.now() + 1).toString(), role: 'model', text: '', isStreaming: true };
    
    // History sent to the API should be valid, starting with a user message.
    // We slice(1) to remove the initial hardcoded greeting from the model.
    const historyToSend: ChatMessage[] = messages
        .slice(1)
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({
            role: m.role as 'user' | 'model', // Cast to fix TS error, safe due to filter
            parts: [{ text: m.text }]
        }));

    setMessages(prev => [...prev, userMessage, aiMessage]);

    try {
        const stream = sendMessage(text, historyToSend);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessage.id ? { ...msg, text: fullResponse } : msg
                )
            );
        }

        setMessages(prev =>
            prev.map(msg =>
                msg.id === aiMessage.id ? { ...msg, isStreaming: false } : msg
            )
        );

    } catch (e) {
      const errorText = e instanceof Error ? e.message : 'An unknown error occurred.';
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessage.id ? { ...msg, text: `Erreur: ${errorText}`, isStreaming: false } : msg
        )
      );
    }
  }, [messages, sendMessage]);

  const handleExampleClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
        <div className="max-w-4xl mx-auto flex items-center space-x-4 p-4">
          <div className="p-2 bg-blue-100 rounded-full">
            <AsthmaIcon className="h-8 w-8 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">DocuBot Asthme</h1>
            <p className="text-sm text-gray-600">Assistant IA pour le guide de l'INEAS</p>
          </div>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, index) => (
            <ChatBubble key={`${msg.id}-${index}`} message={msg} />
          ))}
          {isLoading && messages[messages.length-1].role !== 'model' && (
             <ChatBubble message={{ id: 'loading', role: 'model', text: '', isStreaming: true }} />
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t border-gray-200/80">
        <div className="max-w-4xl mx-auto p-4">
          {messages.length <= 2 && (
             <ExamplePrompts onPromptClick={handleExampleClick} />
          )}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          <p className="text-center text-xs text-gray-500 mt-3">
            Cette application est développée par Dr Zouhair Souissi - Basée sur les recommandations INEAS STMRA 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;