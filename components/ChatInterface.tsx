import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Bot, Terminal, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Message, User } from '../types';
import { sendMessageToAssistant } from '../services/geminiService';

interface ChatInterfaceProps {
  currentUser: User;
}

const QUICK_QUESTIONS = [
  "Show me current halal certified materials",
  "What materials are expiring soon?",
  "How to verify halal certification?",
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Chat on mount or user change
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI assistant for **${currentUser.outletName || 'HQ Operations'}**. 
        
I can help you with halal certification questions, ingredient verification, and compliance matters. How can I assist you today?`,
        timestamp: new Date()
      }
    ]);
  }, [currentUser.id]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToAssistant(textToSend, messages, currentUser);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Basic Markdown Renderer
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(```sql[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```sql')) {
        const code = part.replace(/```sql|```/g, '').trim();
        return (
          <div key={index} className="my-3 bg-gray-900 rounded-lg overflow-hidden shadow-sm border border-gray-800 text-xs md:text-sm">
            <div className="bg-gray-800 px-3 py-1.5 text-gray-400 flex items-center gap-2 border-b border-gray-700">
              <Terminal size={12} /> SQL Query Simulation
            </div>
            <pre className="p-3 text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      
      return (
        <div key={index} className="prose prose-sm max-w-none text-gray-800 markdown-body" 
          dangerouslySetInnerHTML={{ 
            __html: part
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/🔴/g, '<span class="inline-flex items-center gap-1 text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded text-xs border border-red-100">🔴 Critical</span>')
              .replace(/🟡/g, '<span class="inline-flex items-center gap-1 text-yellow-600 font-semibold bg-yellow-50 px-1.5 py-0.5 rounded text-xs border border-yellow-100">🟡 Warning</span>')
              .replace(/✅/g, '<span class="inline-flex items-center gap-1 text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded text-xs border border-green-100">✅ Good</span>')
              .replace(/\n/g, '<br/>')
          }} 
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-hsm-600 p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-white">
                <Bot size={24} />
            </div>
            <div>
                <h3 className="font-bold text-white text-lg leading-tight">Halal Assistant</h3>
                <div className="flex items-center gap-1.5 opacity-90">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(134,239,172,0.8)]"></span>
                    <span className="text-xs text-white font-medium">Online • {currentUser.role.split('_').join(' ')}</span>
                </div>
            </div>
        </div>
        <button 
            onClick={() => setMessages([])} 
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            title="Clear Chat"
        >
            <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin bg-[#f8fafc]"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`
              w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border
              ${msg.role === 'user' ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-gray-200 text-hsm-600'}
            `}>
              {msg.role === 'user' ? <UserIcon size={18} /> : <Sparkles size={18} />}
            </div>

            {/* Bubble */}
            <div className={`
              max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed
              ${msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 rounded-tl-none text-gray-800'}
            `}>
               {msg.role === 'user' ? (
                 <p className="whitespace-pre-wrap">{msg.content}</p>
               ) : (
                 renderMarkdown(msg.content)
               )}
               <div className={`text-[10px] mt-2 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                 {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </div>
            </div>
          </div>
        ))}

        {isLoading && (
           <div className="flex gap-3 animate-pulse">
             <div className="w-9 h-9 rounded-full bg-white border border-gray-200 text-hsm-600 flex items-center justify-center">
                <Sparkles size={18} />
             </div>
             <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-1 shadow-sm">
               <div className="w-2 h-2 bg-hsm-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-hsm-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-hsm-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        
        {/* Quick Questions */}
        {!isLoading && messages.length < 3 && (
            <div className="mb-4 flex flex-wrap gap-2">
                <p className="w-full text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Quick Actions:</p>
                {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-xs bg-hsm-50 hover:bg-hsm-100 text-hsm-700 border border-hsm-200 px-3 py-2 rounded-full transition-colors duration-200 text-left"
                    >
                        {q}
                    </button>
                ))}
            </div>
        )}

        <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about halal compliance..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-hsm-500 focus:border-transparent resize-none text-sm outline-none transition-all placeholder:text-gray-400"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-hsm-600 hover:bg-hsm-700 active:bg-hsm-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;