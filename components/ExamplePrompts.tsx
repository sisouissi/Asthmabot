import React from 'react';

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void;
}

const prompts = [
  "Comment est défini l'asthme ?",
  "Quels sont les facteurs favorisants l'asthme ?",
  "Comment prendre en charge une crise d'asthme chez l'adulte ?",
  "Donne-moi un résumé du document",
];

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onPromptClick }) => {
  return (
    <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3 text-center font-medium">Ou essayez une de ces questions :</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt) => (
            <button
            key={prompt}
            onClick={() => onPromptClick(prompt)}
            className="w-full text-left p-3.5 bg-white/60 border border-gray-200/90 rounded-xl hover:bg-white hover:border-blue-400 hover:shadow-sm transition-all duration-200 text-sm text-gray-800"
            >
            {prompt}
            </button>
        ))}
        </div>
    </div>
  );
};