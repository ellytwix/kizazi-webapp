import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const platform = searchParams.get('platform');
        const accountName = searchParams.get('account_name');

        if (success === 'true') {
          setStatus('success');
          setMessage(`Successfully connected ${accountName || platform || 'account'}!`);
          
          // Redirect to social media connect page after 2 seconds
          setTimeout(() => {
            navigate('/connect-social');
          }, 2000);
        } else if (error) {
          setStatus('error');
          setMessage(error || 'Failed to connect account');
          
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/connect-social');
          }, 3000);
        } else {
          // No clear success or error, check for other scenarios
          setStatus('error');
          setMessage('Invalid callback parameters');
          
          setTimeout(() => {
            navigate('/connect-social');
          }, 3000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred');
        
        setTimeout(() => {
          navigate('/connect-social');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <Loader className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authenticating...</h2>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Success!</h2>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
            </>
          )}
          
          <p className="text-gray-600">{message}</p>
          
          {status !== 'processing' && (
            <p className="text-sm text-gray-500 mt-4">Redirecting to social accounts...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthCallback;
