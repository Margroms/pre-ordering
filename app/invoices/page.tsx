"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, CreditCard, Eye, Download, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useInvoice } from '@/context/InvoiceContext';
import { Invoice } from '@/types/invoice';
import ProtectedRoute from '@/components/ProtectedRoute';

const InvoicesPage = () => {
  const { user, userDetails } = useAuth();
  const { getInvoices, isLoading } = useInvoice();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (user && userDetails?.email) {
      fetchInvoices();
    }
  }, [user, userDetails]);

  const fetchInvoices = async () => {
    if (userDetails?.email) {
      try {
        const userInvoices = await getInvoices(userDetails.email);
        setInvoices(userInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'advance_paid': return 'bg-yellow-100 text-yellow-800';
      case 'fully_paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-[#eb3e04] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-[#eb3e04] hover:text-red-600 transition-colors mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-[#eb3e04]" />
                <h1 className="text-4xl font-grimpt font-bold text-gray-800">My Invoices</h1>
              </div>
              <button
                onClick={fetchInvoices}
                className="flex items-center gap-2 px-4 py-2 bg-[#eb3e04] text-white rounded-lg hover:bg-red-600 transition-colors font-garet"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            <p className="text-gray-600 font-garet">View and manage your order invoices</p>
          </motion.div>

          {invoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-grimpt font-bold text-gray-800 mb-2">No Invoices Found</h2>
              <p className="text-gray-600 font-garet mb-6">You haven't made any orders yet.</p>
              <Link
                href="/menu"
                className="inline-flex items-center bg-[#eb3e04] text-white px-6 py-3 rounded-xl font-grimpt font-bold hover:bg-red-600 transition-colors"
              >
                Browse Menu
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              {invoices.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-grimpt font-bold text-gray-800">
                          {invoice.invoiceNumber}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(invoice.status)}`}>
                          {invoice.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(invoice.paymentStatus)}`}>
                          {invoice.paymentStatus.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 font-garet">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(invoice.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span>₹{invoice.totalAmount.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Items: </span>
                          <span>{invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-600 font-garet">
                          <span className="font-semibold">Visit Time:</span> {formatDate(invoice.visitTime)}
                        </p>
                        <p className="text-sm text-gray-600 font-garet">
                          <span className="font-semibold">Advance Paid:</span> ₹{invoice.advanceAmount.toFixed(2)}
                          {invoice.remainingAmount > 0 && (
                            <span className="ml-2">
                              | <span className="font-semibold">Remaining:</span> ₹{invoice.remainingAmount.toFixed(2)}
                            </span>
                          )}
                        </p>
                        {invoice.status === 'pending' && (
                          <p className="text-sm text-yellow-600 font-garet mt-1">
                            ⏳ <span className="font-semibold">Status:</span> Waiting for restaurant confirmation
                          </p>
                        )}
                        {invoice.status === 'confirmed' && (
                          <p className="text-sm text-blue-600 font-garet mt-1">
                            ✅ <span className="font-semibold">Status:</span> Order confirmed! Please visit at scheduled time.
                          </p>
                        )}
                        {invoice.status === 'cancelled' && (
                          <p className="text-sm text-red-600 font-garet mt-1">
                            ❌ <span className="font-semibold">Status:</span> Order cancelled by restaurant
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/invoices/${invoice.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 bg-[#eb3e04] text-white px-4 py-2 rounded-lg font-grimpt font-bold hover:bg-red-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedInvoice(invoice)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-grimpt font-bold hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Quick View
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Invoice Detail Modal */}
        <AnimatePresence>
          {selectedInvoice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedInvoice(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-grimpt font-bold text-gray-800">Invoice Details</h2>
                    <button
                      onClick={() => setSelectedInvoice(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Restaurant Details */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-grimpt font-bold text-lg text-[#eb3e04] mb-2">
                      {selectedInvoice.restaurantDetails.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-garet">{selectedInvoice.restaurantDetails.address}</p>
                    <p className="text-sm text-gray-600 font-garet">Phone: {selectedInvoice.restaurantDetails.phone}</p>
                    <p className="text-sm text-gray-600 font-garet">Email: {selectedInvoice.restaurantDetails.email}</p>
                    {selectedInvoice.restaurantDetails.gst && (
                      <p className="text-sm text-gray-600 font-garet">GST: {selectedInvoice.restaurantDetails.gst}</p>
                    )}
                  </div>

                  {/* Invoice Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500 font-garet">Invoice Number</p>
                      <p className="font-grimpt font-bold">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-garet">Date</p>
                      <p className="font-garet">{formatDate(selectedInvoice.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-garet">Order ID</p>
                      <p className="font-garet text-sm">{selectedInvoice.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-garet">Payment ID</p>
                      <p className="font-garet text-sm">{selectedInvoice.paymentId}</p>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-grimpt font-bold text-lg mb-2">Bill To:</h3>
                    <p className="font-garet font-semibold">{selectedInvoice.userDetails.name}</p>
                    <p className="text-sm text-gray-600 font-garet">{selectedInvoice.userDetails.email}</p>
                    <p className="text-sm text-gray-600 font-garet">{selectedInvoice.userDetails.phone}</p>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h3 className="font-grimpt font-bold text-lg mb-4">Items</h3>
                    <div className="space-y-3">
                      {selectedInvoice.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-garet font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600 font-garet">
                              Qty: {item.quantity} × {item.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-garet font-semibold">
                              ₹{(parseFloat(item.price.replace('₹', '')) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-garet">Subtotal:</span>
                      <span className="font-garet">₹{selectedInvoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span className="font-garet">Advance Paid:</span>
                      <span className="font-garet">₹{selectedInvoice.advanceAmount.toFixed(2)}</span>
                    </div>
                    {selectedInvoice.remainingAmount > 0 && (
                      <div className="flex justify-between text-orange-600">
                        <span className="font-garet">Remaining Amount:</span>
                        <span className="font-garet">₹{selectedInvoice.remainingAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span className="font-grimpt">Total Amount:</span>
                      <span className="font-grimpt">₹{selectedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Visit Time */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-garet">
                      <span className="font-semibold">Scheduled Visit:</span> {formatDate(selectedInvoice.visitTime)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
};

export default InvoicesPage;
