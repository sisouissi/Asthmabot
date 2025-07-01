import { useState, useMemo, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { ChatMessage } from '../types';
import { documentContent } from '../data/documentContent';

const API_KEY = process.env.API_KEY;

export const useChat = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const ai = useMemo(() => {
        if (!API_KEY) {
            setError("Clé API non trouvée. Veuillez la définir dans les variables d'environnement de votre projet (ex: Vercel) et redéployer.");
            return null;
        }
        return new GoogleGenAI({ apiKey: API_KEY });
    }, []);

    const sendMessage = useCallback(async function* (
        message: string,
        history: ChatMessage[]
    ): AsyncGenerator<string, void, undefined> {
        if (!ai) {
            const errText = "Client Gemini non initialisé. Assurez-vous que la variable d'environnement API_KEY est correctement configurée et que l'application a été redéployée.";
            setError(errText);
            throw new Error(errText);
        }
        setIsLoading(true);
        setError(null);

        try {
            const systemInstruction = `You are a helpful medical assistant named AsthmaBot. Your knowledge base is strictly limited to the provided document about asthma management from INEAS.
            Your task is to answer user questions by providing a complete and detailed answer based ONLY on the information within this document.
            - Answer in French.
            - Your primary goal is to provide a complete and detailed answer extracted directly from the text. Synthesize the relevant information from the document to construct a full response.
            - Do not just orient the user to a reference. Provide the full answer.
            - After providing the answer, you MUST cite the page number in parentheses where the information was found, like this: (Page X). You can find the page number from text like "INEAS – GPC Prise en charge de l’asthme de l’enfant et de l’adulte version 01 Page X sur 245".
            - If the user's question cannot be answered using the document, you MUST explicitly state 'Je ne trouve pas d'informations à ce sujet dans le document fourni.' and nothing else. Do not use external knowledge.
            - Be polite, professional, and go straight to the point. Do not use conversational filler like "Bien sûr, voici la réponse..." or "D'après le document...".
            - Format your answers for better readability using Markdown: Use **bold text** for important terms, *italic text* for emphasis, and lists with a hyphen (-) for enumerations.
            
            Here is the full document content:
            --- DOCUMENT START ---
            ${documentContent}
            --- DOCUMENT END ---
            `;

            const chat: Chat = ai.chats.create({
                model: 'gemini-2.5-flash-preview-04-17',
                history: history,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.2,
                    topK: 40,
                    topP: 0.95,
                }
            });

            const result = await chat.sendMessageStream({ message });
            
            for await (const chunk of result) {
                yield chunk.text;
            }

        } catch (e) {
            const errText = e instanceof Error ? e.message : 'An unexpected error occurred during the API call.';
            setError(errText);
            console.error(e);
            throw new Error(errText);
        } finally {
            setIsLoading(false);
        }
    }, [ai]);

    return { sendMessage, isLoading, error };
};