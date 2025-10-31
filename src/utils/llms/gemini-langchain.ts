import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const geminiFlash = new ChatGoogleGenerativeAI({
	model: 'gemini-2.5-flash',
	apiKey: process.env.GOOGLE_GEMINI_API_KEY as string,
});
