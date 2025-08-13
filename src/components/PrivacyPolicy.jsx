import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Mail, Phone, MapPin, Lock, User, Share2, Database, Clock, CheckCircle } from 'lucide-react';

const PrivacyPolicy = ({ onBack }) => {
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
              <Shield className="w-12 h-12 text-pink-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Privacy Policy
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
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to KIZAZI ("we," "our," or "us"), a social media management platform designed specifically for African markets. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application, 
              mobile application, and related services (collectively, the "Service").
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using our Service, you consent to the collection and use of information in accordance with this policy. 
              We are committed to protecting your privacy and ensuring transparency about our data practices.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-blue-500" />
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">When you register for our Service, we may collect:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Contact Information:</strong> Name, email address, phone number</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), profile picture</li>
              <li><strong>Business Information:</strong> Company name, business type, website URL</li>
              <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through third-party providers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Social Media Account Information</h3>
            <p className="text-gray-700 mb-4">When you connect your social media accounts to our platform:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Facebook/Instagram:</strong> Account access tokens, page information, basic profile data</li>
              <li><strong>X (Twitter):</strong> Account credentials, profile information, follower data</li>
              <li><strong>Content Data:</strong> Posts, images, videos, captions, hashtags, engagement metrics</li>
              <li><strong>Analytics Data:</strong> Reach, impressions, clicks, follower demographics</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 Usage Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Log data (IP address, browser type, pages visited, time spent)</li>
              <li>Device information (operating system, device type, unique device identifiers)</li>
              <li>Feature usage and interaction patterns within our platform</li>
              <li>Error reports and performance data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.4 AI-Generated Content</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Content prompts and generated text from our AI features</li>
              <li>User feedback on AI-generated content quality</li>
              <li>Content performance metrics for AI optimization</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-purple-500" />
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Service Provision</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Create and manage your account</li>
              <li>Enable social media account connections and posting</li>
              <li>Schedule and publish content across platforms</li>
              <li>Provide analytics and performance insights</li>
              <li>Generate AI-powered content suggestions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Communication</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Send service-related notifications and updates</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Share important policy or feature changes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Improvement and Analytics</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Analyze usage patterns to improve our services</li>
              <li>Develop new features and functionality</li>
              <li>Conduct research and analytics on social media trends</li>
              <li>Optimize AI content generation algorithms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.4 Legal and Security</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Detect, prevent, and address fraud or security issues</li>
              <li>Enforce our terms of service and user agreements</li>
              <li>Protect the rights and safety of our users and third parties</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Share2 className="w-6 h-6 text-orange-500" />
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Social Media Platforms</h3>
            <p className="text-gray-700 mb-4">
              When you connect your social media accounts, we share content and data with these platforms as necessary to provide our services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Facebook/Instagram:</strong> Content posting, audience insights, advertising performance</li>
              <li><strong>X (Twitter):</strong> Tweet publishing, engagement metrics, follower analytics</li>
              <li>All sharing is done in accordance with each platform's API terms and privacy policies</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Service Providers</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Cloud Hosting:</strong> Amazon Web Services, Google Cloud Platform</li>
              <li><strong>Payment Processing:</strong> Stripe, PayPal, mobile money providers</li>
              <li><strong>AI Services:</strong> OpenAI, Google AI for content generation</li>
              <li><strong>Analytics:</strong> Google Analytics, Mixpanel for usage insights</li>
              <li><strong>Email Services:</strong> SendGrid, Mailchimp for communications</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Legal Requirements</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Response to legal process (court orders, subpoenas)</li>
              <li>Compliance with applicable laws and regulations</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or illegal activities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.4 Business Transfers</h3>
            <p className="text-gray-700">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction. 
              We will notify you of any such change in ownership or control of your personal information.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-500" />
              5. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Encryption:</strong> Data in transit and at rest using industry-standard encryption</li>
              <li><strong>Access Controls:</strong> Limited access on a need-to-know basis with multi-factor authentication</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              <li><strong>Secure Infrastructure:</strong> Cloud providers with SOC 2 Type II compliance</li>
              <li><strong>Data Backup:</strong> Regular backups with secure storage and recovery procedures</li>
              <li><strong>Employee Training:</strong> Regular security awareness training for all staff</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Despite our efforts, no data transmission over the internet or storage system can be guaranteed to be 100% secure. 
              If you have reason to believe that your interaction with us is no longer secure, please contact us immediately.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-500" />
              6. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Account Information:</strong> Retained while your account is active plus 30 days after deletion</li>
              <li><strong>Content Data:</strong> Stored as long as needed for service provision and analytics</li>
              <li><strong>Financial Records:</strong> Retained for 7 years for tax and legal compliance</li>
              <li><strong>Usage Analytics:</strong> Aggregated data may be retained indefinitely for service improvement</li>
              <li><strong>Legal Hold:</strong> Data may be retained longer if required by legal obligations</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can request deletion of your account and associated data at any time through your account settings or by contacting us.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Access and Portability</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Request a copy of your personal information</li>
              <li>Export your data in a machine-readable format</li>
              <li>Access information about how your data is processed</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Correction and Deletion</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Withdraw consent for data processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.3 Control and Restriction</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Object to certain types of data processing</li>
              <li>Restrict how we use your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>

            <p className="text-gray-700 mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Services and Links</h2>
            <p className="text-gray-700 mb-4">
              Our Service may contain links to third-party websites, applications, or services that are not owned or controlled by us. 
              We are not responsible for the privacy practices of these third parties.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">8.1 Social Media Platforms</h3>
            <p className="text-gray-700 mb-4">
              When you connect social media accounts, you are subject to their respective privacy policies:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Facebook:</strong> <a href="https://www.facebook.com/privacy/policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Facebook Privacy Policy</a></li>
              <li><strong>Instagram:</strong> <a href="https://help.instagram.com/519522125107875" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Instagram Privacy Policy</a></li>
              <li><strong>X (Twitter):</strong> <a href="https://twitter.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">X Privacy Policy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8.2 Payment Processors</h3>
            <p className="text-gray-700">
              Payment information is processed by third-party providers including Stripe, PayPal, and mobile money services. 
              These providers have their own privacy policies governing the collection and use of your financial information.
            </p>
          </section>

          {/* Regional Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Regional Privacy Laws</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 African Data Protection</h3>
            <p className="text-gray-700 mb-4">
              We comply with applicable data protection laws in African countries where we operate, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Kenya:</strong> Data Protection Act, 2019</li>
              <li><strong>Tanzania:</strong> Personal Data Protection Act, 2022</li>
              <li><strong>Nigeria:</strong> Nigeria Data Protection Regulation (NDPR)</li>
              <li><strong>South Africa:</strong> Protection of Personal Information Act (POPIA)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.2 International Transfers</h3>
            <p className="text-gray-700">
              When we transfer personal information outside of Africa, we ensure appropriate safeguards are in place, 
              including standard contractual clauses and adequacy decisions where applicable.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Our Service is not intended for children under the age of 18. We do not knowingly collect personal information 
              from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us, and we will delete such information from our systems.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, 
              or other factors. We will notify you of any material changes by posting the new Privacy Policy on this page and updating 
              the "Last Updated" date. For significant changes, we may also send you a direct notification via email or through our platform.
            </p>
            <p className="text-gray-700 mt-4">
              Your continued use of our Service after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-pink-500" />
              12. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">privacy@kizazi.africa</p>
                  <p className="text-gray-600">support@kizazi.africa</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Phone</h4>
                  <p className="text-gray-600">Kenya: +254 700 000 000</p>
                  <p className="text-gray-600">Tanzania: +255 700 000 000</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800">Address</h4>
                  <p className="text-gray-600">KIZAZI Africa Ltd.</p>
                  <p className="text-gray-600">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-pink-200">
              <h4 className="font-semibold text-gray-800 mb-2">Data Protection Officer</h4>
              <p className="text-gray-600">For data protection inquiries specific to your region:</p>
              <p className="text-gray-600">Email: dpo@kizazi.africa</p>
              <p className="text-gray-600">We will respond to your inquiry within 30 days.</p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              © 2025 KIZAZI Africa Ltd. All rights reserved. | 
              <a href="/terms" className="text-pink-600 hover:underline ml-2">Terms of Service</a> | 
              <a href="/privacy" className="text-pink-600 hover:underline ml-2">Privacy Policy</a>
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

export default PrivacyPolicy;
