import { GoogleGenAI, Content, Part } from "@google/genai";
import { User, Message } from "../types";
import { INITIAL_SYSTEM_INSTRUCTION } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("API Key is missing from process.env.API_KEY");
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
};

export const sendMessageToAssistant = async (
  userMessage: string,
  history: Message[],
  currentUser: User
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Construct the context-aware system instruction
    const contextInstruction = `
      ${INITIAL_SYSTEM_INSTRUCTION}
      
      CURRENT USER CONTEXT:
      - ID: ${currentUser.id}
      - Name: ${currentUser.name}
      - Role: ${currentUser.role}
      - Outlet ID: ${currentUser.outletId || 'ALL (Top Management)'}
      - Outlet Name: ${currentUser.outletName || 'N/A'}
      
      CRITICAL: You must enforce the SQL WHERE clauses based on the user's role defined above.
    `;

    // Convert app history to Gemini format
    const chatHistory: Content[] = history
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }] as Part[],
      }));

    const model = 'gemini-2.5-flash';
    
    // We use generateContent for a single turn with history context to ensure fresh system instruction injection per user switch
    // Alternatively, we could use chats.create, but recreating it ensures context switch works immediately if the user changes in the UI.
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: contextInstruction,
        temperature: 0.4, // Keep it factual/analytical
      }
    });

    return response.text || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the database simulation. Please check your API key or internet connection.";
  }
};
