'use client';

import { useState } from 'react';

export default function OrderConfirmationForm() {
  const [formData, setFormData] = useState({
    customerEmail: '',
    customerAddress: '',
    productName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

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
    setMessage('');

    try {
      const response = await fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Order confirmation email sent successfully!');
        setMessageType('success');
        // Reset form
        setFormData({
          customerEmail: '',
          customerAddress: '',
          productName: ''
        });
      } else {
        setMessage(result.error || 'Failed to send email');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Send Order Confirmation
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Customer Email *
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white"
            placeholder="customer@example.com"
          />
        </div>

        <div>
          <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Address *
          </label>
          <textarea
            id="customerAddress"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={handleInputChange}
            required
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none text-gray-900 bg-white"
            placeholder="Enter full delivery address"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 bg-white"
            placeholder="Enter product name"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Sending...
            </div>
          ) : (
            'Send Order Confirmation'
          )}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}