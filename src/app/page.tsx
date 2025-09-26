'use client';

import { useState, useEffect } from 'react';
import ShippingEmailForm from '../../components/ShippingEmailForm';
import OrderConfirmationForm from '../../components/OrderConfirmationForm';
import RefundEmailForm from '../../components/RefundEmailForm';
import EmailPreview from '../../components/EmailPreview';
import LoginForm from '../../components/LoginForm';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tracking');

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth-check');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (username: string) => {
    setIsAuthenticated(true);
    setUser(username);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <img
              src="/logo.png"
              alt="Happydeel"
              className="h-12 w-auto"
            />
            {isAuthenticated && user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  Welcome, <span className="font-medium text-slate-800">{user}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          {isAuthenticated ? (
            <div className="w-full bg-white rounded-xl shadow-md">
              <div className="border-b border-slate-200">
                <nav className="-mb-px flex gap-x-6 px-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'tracking'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Shipping Email
                  </button>
                  <button
                    onClick={() => setActiveTab('confirmation')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'confirmation'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Order Confirmation
                  </button>
                  <button
                    onClick={() => setActiveTab('refund')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'refund'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Refund Email
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'preview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    Email Preview
                  </button>
                </nav>
              </div>
              <div className="p-6">
                {activeTab === 'tracking' ? (
                  <ShippingEmailForm />
                ) : activeTab === 'confirmation' ? (
                  <OrderConfirmationForm />
                ) : activeTab === 'refund' ? (
                  <RefundEmailForm />
                ) : (
                  <EmailPreview />
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
