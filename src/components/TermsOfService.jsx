import React from 'react';
import { motion } from 'framer-motion';
import { Scale, ArrowLeft, Mail, Phone, MapPin, Lock, User, Share2, Clock, CheckCircle, AlertTriangle, Shield } from 'lucide-react';

const TermsOfService = ({ onBack }) => {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
              <Scale className="w-12 h-12 text-pink-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              KIZAZI Social Media Management Platform
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Last Updated: {lastUpdated}
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
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to KIZAZI Social ("we," "our," or "us"), a social media management platform. These Terms of Service ("Terms") 
              constitute a legally binding agreement between you ("User," "you," or "your") and KIZAZI Social Ltd., governing your 
              access to and use of our website, mobile application, and related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, 
              please do not use our Service.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-blue-500" />
              2. Service Description
            </h2>
            <p className="text-gray-700 mb-4">KIZAZI Social provides a comprehensive social media management platform that allows users to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Social Media Integration:</strong> Connect and manage multiple social media accounts (Facebook, Instagram, X, LinkedIn, TikTok)</li>
              <li><strong>Content Scheduling:</strong> Schedule and publish posts across multiple platforms</li>
              <li><strong>AI Content Generation:</strong> Generate engaging content using artificial intelligence</li>
              <li><strong>Analytics & Insights:</strong> Track performance metrics and engagement data</li>
              <li><strong>Team Collaboration:</strong> Manage social media accounts with team members</li>
              <li><strong>Regional Support:</strong> Specialized features for African markets including local payment methods</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-purple-500" />
              3. User Accounts and Registration
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Account Creation</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>You must provide accurate, current, and complete information during registration</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>One person may not maintain more than one account without our express permission</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Account Security</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You are solely responsible for all activities that occur under your account</li>
              <li>You must immediately notify us of any unauthorized use of your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
            </ul>
          </section>

          {/* Social Media Integration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Social Media Platform Integration</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Third-Party Platform Compliance</h3>
            <p className="text-gray-700 mb-4">
              When using our Service to connect with social media platforms, you agree to comply with the terms of service, 
              community guidelines, and policies of each respective platform, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Facebook:</strong> Facebook Terms of Service and Community Standards</li>
              <li><strong>Instagram:</strong> Instagram Terms of Use and Community Guidelines</li>
              <li><strong>X (Twitter):</strong> X Terms of Service and Rules</li>
              <li><strong>LinkedIn:</strong> LinkedIn User Agreement and Professional Community Policies</li>
              <li><strong>TikTok:</strong> TikTok Terms of Service and Community Guidelines</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Content Publishing</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You are solely responsible for all content you publish through our Service</li>
              <li>You warrant that you have the right to publish all content and that it does not infringe any third-party rights</li>
              <li>We do not pre-screen content but reserve the right to remove content that violates these Terms</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-500" />
              5. Acceptable Use Policy
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Prohibited Activities</h3>
            <p className="text-gray-700 mb-4">You may not use our Service to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Publish illegal, harmful, threatening, abusive, harassing, defamatory, or discriminatory content</li>
              <li>Infringe intellectual property rights or violate privacy rights of others</li>
              <li>Distribute spam, malware, or other malicious content</li>
              <li>Engage in fraudulent or deceptive practices</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Attempt to circumvent or disable security features</li>
              <li>Use automated scripts or bots to abuse the Service</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Content Standards</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Content must be original or properly licensed</li>
              <li>Content must comply with advertising standards and disclosure requirements</li>
              <li>Content must respect community guidelines of target social media platforms</li>
              <li>Content must not contain false or misleading information</li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment Terms and Subscriptions</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Subscription Plans</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Starter Plan:</strong> Basic features with limited social accounts and posts</li>
              <li><strong>Professional Plan:</strong> Advanced features including AI content generation</li>
              <li><strong>Enterprise Plan:</strong> Full feature access with custom solutions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Payment Processing</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Payments are processed securely through third-party payment providers</li>
              <li>Accepted payment methods include M-Pesa, Airtel Money, and international payment cards</li>
              <li>All fees are charged in local currency (Tanzanian Shillings or Kenyan Shillings)</li>
              <li>Subscription fees are billed in advance on a monthly or annual basis</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Refunds and Cancellations</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Subscriptions may be cancelled at any time with effect from the next billing cycle</li>
              <li>Refunds are generally not provided for partial months or unused features</li>
              <li>We may provide refunds at our discretion for technical issues or service interruptions</li>
              <li>Cancelled accounts retain access until the end of the current billing period</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Our Rights</h3>
            <p className="text-gray-700 mb-4">
              The Service, including its original content, features, and functionality, is owned by KIZAZI Social Ltd. and is 
              protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.2 Your Rights</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>You retain ownership of content you create and upload to the Service</li>
              <li>You grant us a limited license to use your content solely for providing the Service</li>
              <li>AI-generated content created through our Service is owned by you</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.3 DMCA Compliance</h3>
            <p className="text-gray-700">
              We respond to valid DMCA takedown notices. If you believe your copyright has been infringed, 
              please contact us at support@kizazisocial.com with detailed information about the alleged infringement.
            </p>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-500" />
              8. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We process personal data in accordance with applicable data protection laws</li>
              <li>Users have rights to access, correct, and delete their personal data</li>
              <li>We implement appropriate security measures to protect user data</li>
              <li>Social media platform data is accessed only with user consent and for legitimate purposes</li>
            </ul>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-red-500" />
              9. Service Availability and Modifications
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Service Availability</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>We strive to maintain high service availability but do not guarantee uninterrupted access</li>
              <li>Scheduled maintenance will be announced in advance when possible</li>
              <li>Service may be temporarily unavailable due to technical issues or external factors</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.2 Service Modifications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We may modify, suspend, or discontinue any aspect of the Service at any time</li>
              <li>Material changes to paid features will be communicated with reasonable notice</li>
              <li>We may add new features or improve existing functionality without notice</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, KIZAZI SOCIAL LTD. SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
              <li>Damages resulting from unauthorized access to or alteration of your content</li>
              <li>Damages resulting from third-party conduct or content on the Service</li>
              <li>Damages resulting from suspension or termination of your account</li>
            </ul>
            <p className="text-gray-700">
              Our total liability for any claims arising out of or relating to these Terms or the Service 
              shall not exceed the amount you paid us in the twelve months preceding the claim.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.1 Termination by You</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>You may terminate your account at any time through your account settings</li>
              <li>Termination will be effective at the end of your current billing period</li>
              <li>You may request deletion of your data in accordance with our Privacy Policy</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">11.2 Termination by Us</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We may suspend or terminate your account for violation of these Terms</li>
              <li>We may terminate the Service entirely with reasonable notice</li>
              <li>Immediate termination may occur for serious violations or legal requirements</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              These Terms are governed by the laws of Tanzania. Any disputes arising from these Terms or the Service 
              shall be resolved through:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li><strong>Informal Resolution:</strong> Good faith negotiations between the parties</li>
              <li><strong>Mediation:</strong> Binding mediation in Dar es Salaam, Tanzania</li>
              <li><strong>Arbitration:</strong> Final binding arbitration under Tanzanian arbitration rules</li>
            </ol>
            <p className="text-gray-700">
              Users consent to the exclusive jurisdiction of courts in Dar es Salaam, Tanzania for any matters 
              not resolved through arbitration.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these Terms from time to time to reflect changes in our practices, technology, 
              legal requirements, or other factors. We will notify users of material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
              <li>Posting the updated Terms on our website with a new "Last Updated" date</li>
              <li>Sending email notifications to registered users for significant changes</li>
              <li>Displaying prominent notices within the Service</li>
            </ul>
            <p className="text-gray-700">
              Your continued use of the Service after changes become effective constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-pink-500" />
              14. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">legal@kizazisocial.com</p>
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

export default TermsOfService;
