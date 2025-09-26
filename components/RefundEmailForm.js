'use client';

import { useState } from 'react';

export default function RefundEmailForm() {
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerName: '',
    productName: '',
    refundAmount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('/api/send-refund-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          content: 'Refund confirmation email sent successfully! 🎉'
        });
        // Reset form
        setFormData({
          customerEmail: '',
          customerName: '',
          productName: '',
          refundAmount: ''
        });
      } else {
        setMessage({
          type: 'error',
          content: result.error || 'Failed to send email'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">💰 Refund Confirmation Email</h2>
        <p className="text-gray-600">Send a professional refund confirmation email to your customers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Email Address *
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
            placeholder="customer@example.com"
          />
        </div>

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
            placeholder="Canon PowerShot G7X Mark II"
          />
        </div>

        <div>
          <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Refund Amount *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
            <input
              type="number"
              id="refundAmount"
              name="refundAmount"
              value={formData.refundAmount}
              onChange={handleInputChange}
              required
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
              placeholder="299.99"
            />
          </div>
        </div>

        {message.content && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.content}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                📧 Send Refund Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}