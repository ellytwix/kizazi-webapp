import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, Mail, Phone, MapPin, Shield, AlertTriangle, CheckCircle, Clock, User, Database } from 'lucide-react';

const DataDeletion = ({ onBack }) => {
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-pink-600 hover:text-pink-800 mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to App
            </button>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trash2 className="w-12 h-12 text-pink-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Data Deletion Instructions
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              How to delete your data from KIZAZI Social
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Complete guide for account and data deletion
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
        >
          {/* Quick Action */}
          <section className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Quick Data Deletion Request
            </h2>
            <p className="text-gray-700 mb-6">
              If you want to immediately delete your KIZAZI Social account and all associated data, 
              please contact us directly:
            </p>
            
            <div className="bg-white rounded-lg p-4 border border-red-200 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email Request</h4>
                  <p className="text-gray-600">Send your deletion request to:</p>
                  <p className="text-red-600 font-semibold">privacy@kizazisocial.com</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3 text-sm text-gray-600">
                <strong>Subject:</strong> Data Deletion Request<br/>
                <strong>Include:</strong> Your registered email address and reason for deletion
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>We will process your request within 30 days</span>
            </div>
          </section>

          {/* What Data We Delete */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-500" />
              What Data Will Be Deleted
            </h2>
            <p className="text-gray-700 mb-4">
              When you request data deletion, we will permanently remove the following information from our systems:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Account Information
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Personal details (name, email, phone)</li>
                  <li>• Profile information and preferences</li>
                  <li>• Account settings and configurations</li>
                  <li>• Billing and payment information</li>
                  <li>• Communication history with support</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-500" />
                  Content & Activity Data
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Created and scheduled posts</li>
                  <li>• Uploaded images and media files</li>
                  <li>• AI-generated content history</li>
                  <li>• Analytics and performance data</li>
                  <li>• Connected social media tokens</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step-by-Step Guide */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Step-by-Step Deletion Process
            </h2>
            
            <div className="space-y-6">
              {/* Option 1: Self-Service */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Option 1: Self-Service Deletion (Recommended)</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="font-semibold text-gray-800">Log into your account</p>
                      <p className="text-gray-600 text-sm">Visit https://kizazisocial.com and sign in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="font-semibold text-gray-800">Navigate to Account Settings</p>
                      <p className="text-gray-600 text-sm">Click on your profile icon → Settings → Account</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="font-semibold text-gray-800">Find "Delete Account" section</p>
                      <p className="text-gray-600 text-sm">Scroll down to the bottom of the Account settings page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <p className="font-semibold text-gray-800">Confirm deletion</p>
                      <p className="text-gray-600 text-sm">Enter your password and confirm that you want to delete all data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</div>
                    <div>
                      <p className="font-semibold text-gray-800">Receive confirmation</p>
                      <p className="text-gray-600 text-sm">You'll receive an email confirmation of the deletion request</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Email Request */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Option 2: Email Request</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="font-semibold text-gray-800">Send deletion request email</p>
                      <p className="text-gray-600 text-sm">Email privacy@kizazisocial.com with subject "Data Deletion Request"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="font-semibold text-gray-800">Include required information</p>
                      <p className="text-gray-600 text-sm">Registered email address, account name, and reason for deletion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="font-semibold text-gray-800">Identity verification</p>
                      <p className="text-gray-600 text-sm">We may ask you to verify your identity for security purposes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <p className="font-semibold text-gray-800">Receive confirmation</p>
                      <p className="text-gray-600 text-sm">We'll confirm receipt and process your request within 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Data Retention and Deletion Timeline
            </h2>
            
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-4">What Happens After You Request Deletion:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">0</div>
                  <p className="text-gray-700"><strong>Immediate:</strong> Your account is deactivated and you can no longer log in</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</div>
                  <p className="text-gray-700"><strong>7 Days:</strong> All scheduled posts are cancelled and social media connections are revoked</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">30</div>
                  <p className="text-gray-700"><strong>30 Days:</strong> All personal data, content, and backups are permanently deleted</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Important Notes:
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Deletion is permanent and cannot be undone</li>
                <li>• We may retain some data for legal compliance (financial records, etc.)</li>
                <li>• Content already published to social media platforms will not be automatically deleted</li>
                <li>• Analytics data may be retained in anonymized form for service improvement</li>
              </ul>
            </div>
          </section>

          {/* Before You Delete */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Before You Delete Your Account</h2>
            
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-4">Consider These Alternatives:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🔄 Temporary Deactivation</h4>
                  <p className="text-sm text-gray-600">Temporarily disable your account without losing data</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📱 Disconnect Social Accounts</h4>
                  <p className="text-sm text-gray-600">Remove connected social media accounts only</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📊 Export Your Data</h4>
                  <p className="text-sm text-gray-600">Download your content before deletion</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">💬 Contact Support</h4>
                  <p className="text-sm text-gray-600">Discuss concerns with our support team</p>
                </div>
              </div>
            </div>
          </section>

          {/* Facebook App Data Deletion */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Facebook/Instagram App Data Deletion</h2>
            <p className="text-gray-700 mb-4">
              If you connected your Facebook or Instagram account to KIZAZI Social, you can also delete data 
              specifically related to our Facebook app:
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-3">Facebook Data Deletion Steps:</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
                <li>Go to your Facebook Settings & Privacy → Settings</li>
                <li>Navigate to Apps and Websites</li>
                <li>Find "KIZAZI Social" in your app list</li>
                <li>Click "Remove" to revoke permissions and delete app data</li>
                <li>Alternatively, use this direct deletion URL: <a href="#" className="text-blue-600 underline">Delete Facebook App Data</a></li>
              </ol>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-pink-500" />
              Need Help with Data Deletion?
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about data deletion or need assistance, please contact us:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">privacy@kizazisocial.com</p>
                  <p className="text-gray-600">support@kizazisocial.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <p className="text-gray-600">Tanzania: +255 765 416 502</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Address</h4>
                  <p className="text-gray-600">KIZAZI Social Ltd.</p>
                  <p className="text-gray-600">Dar es Salaam, Tanzania</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-pink-200">
              <h4 className="font-semibold text-gray-800 mb-2">Data Protection Officer</h4>
              <p className="text-gray-600">For data protection inquiries:</p>
              <p className="text-gray-600">Email: dpo@kizazisocial.com</p>
              <p className="text-gray-600">We will respond within 30 days.</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 KIZAZI Social Ltd. All rights reserved. | 
              <a href="/terms" className="text-pink-600 hover:underline ml-2">Terms of Service</a> | 
              <a href="/privacy" className="text-pink-600 hover:underline ml-2">Privacy Policy</a> |
              <a href="/data-deletion" className="text-pink-600 hover:underline ml-2">Data Deletion</a>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Made with ❤️ for Africa by the KIZAZI Team
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataDeletion;
