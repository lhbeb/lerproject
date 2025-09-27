'use client';

import { useState, useEffect } from 'react';
import ShippingEmailForm from '../../components/ShippingEmailForm';
import OrderConfirmationForm from '../../components/OrderConfirmationForm';
import RefundEmailForm from '../../components/RefundEmailForm';
import EmailPreview from '../../components/EmailPreview';
import LoginForm from '../../components/LoginForm';

export default function Home() {
  // Remove authentication requirement since email endpoints no longer need auth
  const [activeTab, setActiveTab] = useState('tracking');

  // Removed authentication logic - email endpoints no longer require auth

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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
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
        </div>
      </div>
    </main>
  );
}
