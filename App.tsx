import React, { useState } from 'react';
import { MOCK_USERS, OUTLETS } from './constants';
import { User, Role } from './types';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { LayoutDashboard, MessageSquare, ShieldCheck, LogOut, Menu, User as UserIcon, Building2, ChevronRight } from 'lucide-react';

// Login Screen Component
const LoginScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-hsm-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">HSM Halal Assistant</h1>
        <p className="text-gray-500 mt-2">Select your role to access the system</p>
      </div>

      <div className="grid gap-4 w-full max-w-md">
        {MOCK_USERS.map((user) => (
          <button
            key={user.id}
            onClick={() => onLogin(user)}
            className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-hsm-500 hover:shadow-md transition-all group text-left"
          >
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-full border-2 border-gray-100 group-hover:border-hsm-200" 
            />
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-hsm-700">{user.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                  {user.role.replace('_', ' ')}
                </span>
                {user.outletName && <span>• {user.outletName}</span>}
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-hsm-500" />
          </button>
        ))}
      </div>
      
      <p className="mt-8 text-xs text-center text-gray-400">
        Restricted Access • Authorized Personnel Only
      </p>
    </div>
  );
};

const App: React.FC = () => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('chat'); // Default to chat as requested
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (user: User) => {
    setActiveUser(user);
    setActiveTab('chat'); // Reset to chat on login
  };

  const handleLogout = () => {
    setActiveUser(null);
  };

  if (!activeUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-hsm-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-base leading-tight">HSM Halal</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">Assistant</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 mt-2">Menu</p>
          
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'chat' ? 'bg-hsm-50 text-hsm-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={18} />
            AI Assistant
          </button>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-hsm-50 text-hsm-700' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={18} />
            Compliance Dashboard
          </button>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
           <div className="flex items-center gap-3">
             <img src={activeUser.avatar} alt="Profile" className="w-9 h-9 rounded-full border border-white shadow-sm" />
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-gray-900 truncate">{activeUser.name}</p>
               <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                 {activeUser.outletName ? <Building2 size={10} /> : <UserIcon size={10} />}
                 <span>{activeUser.outletName || 'HQ Admin'}</span>
               </div>
             </div>
             <button 
               onClick={handleLogout}
               className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-gray-200"
               title="Logout"
             >
               <LogOut size={16} />
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20 sticky top-0">
           <div className="flex items-center gap-2 text-hsm-700 font-bold">
              <ShieldCheck size={24} />
              <span>HSM Halal</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
             <Menu size={24} />
           </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-xl z-30 p-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
               <button 
                onClick={() => { setActiveTab('chat'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-lg text-center text-sm font-medium ${activeTab === 'chat' ? 'bg-hsm-50 text-hsm-700' : 'bg-gray-50 text-gray-600'}`}
               >
                 AI Assistant
               </button>
               <button 
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                className={`p-3 rounded-lg text-center text-sm font-medium ${activeTab === 'dashboard' ? 'bg-hsm-50 text-hsm-700' : 'bg-gray-50 text-gray-600'}`}
               >
                 Dashboard
               </button>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-3 text-red-600 bg-red-50 rounded-lg text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-hidden relative bg-gray-100">
          {activeTab === 'dashboard' && (
            <div className="absolute inset-0 z-10 animate-in fade-in duration-300">
               <Dashboard outlets={OUTLETS} user={activeUser} />
            </div>
          )}
          {activeTab === 'chat' && (
            <div className="absolute inset-0 z-10 p-2 md:p-6 animate-in fade-in duration-300 flex justify-center">
               <div className="w-full max-w-4xl h-full">
                 <ChatInterface currentUser={activeUser} />
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;