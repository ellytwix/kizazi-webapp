import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar, Image, Hash, Target, Sparkles, BarChart3, Video, Upload, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import api from '../services/api';

const PostCreator = ({ onPostCreated }) => {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [formData, setFormData] = useState({
    content: '',
    selectedAccounts: [],
    media: null,
    mediaType: null, // 'image' or 'video'
    hashtags: '',
    scheduleDate: '',
    scheduleTime: '',
    publishType: 'now' // 'now' or 'schedule'
  });
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      const data = await api.getSocialAccounts();
      setConnectedAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
      setConnectedAccounts([]);
    }
  };

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setFormData(prev => ({
      ...prev,
      media: file,
      mediaType: isImage ? 'image' : 'video'
    }));
    
    setMediaPreview({
      url: previewUrl,
      type: isImage ? 'image' : 'video',
      name: file.name,
      size: file.size
    });
  };

  const removeMedia = () => {
    if (mediaPreview?.url) {
      URL.revokeObjectURL(mediaPreview.url);
    }
    
    setFormData(prev => ({
      ...prev,
      media: null,
      mediaType: null
    }));
    
    setMediaPreview(null);
    setIsVideoPlaying(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateAIContent = async () => {
    if (!formData.content) return;
    
    setLoading(true);
    try {
      const data = await api.generateContent(
        `Improve this social media post and suggest relevant hashtags: "${formData.content}"`
      );
      
      if (data.text) {
        setFormData(prev => ({
          ...prev,
          content: data.text
        }));
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountToggle = (accountId) => {
    setFormData(prev => ({
      ...prev,
      selectedAccounts: prev.selectedAccounts.includes(accountId)
        ? prev.selectedAccounts.filter(id => id !== accountId)
        : [...prev.selectedAccounts, accountId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content || formData.selectedAccounts.length === 0) return;

    setPosting(true);
    try {
      // Create post for each selected account
      const promises = formData.selectedAccounts.map(accountId => {
        const account = connectedAccounts.find(acc => acc.id === accountId);
        return publishToAccount(account);
      });

      const results = await Promise.allSettled(promises);
      
      // Handle results
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      if (successful > 0) {
        onPostCreated?.({
          content: formData.content,
          accounts: formData.selectedAccounts,
          publishType: formData.publishType,
          successful,
          failed
        });
        
        // Reset form
        removeMedia();
        setFormData({
          content: '',
          selectedAccounts: [],
          media: null,
          mediaType: null,
          hashtags: '',
          scheduleDate: '',
          scheduleTime: '',
          publishType: 'now'
        });
      }
    } catch (error) {
      console.error('Post creation failed:', error);
    } finally {
      setPosting(false);
    }
  };

  const publishToAccount = async (account) => {
    const endpoint = account.platform === 'Facebook' 
      ? '/api/meta/post/facebook' 
      : '/api/meta/post/instagram';

    const postData = {
      content: formData.content,
      hashtags: formData.hashtags.split(' ').filter(tag => tag.startsWith('#')),
      accountId: account.accountId,
      accessToken: account.accessToken,
      media: formData.media,
      scheduledFor: formData.publishType === 'schedule' 
        ? `${formData.scheduleDate}T${formData.scheduleTime}:00Z` 
        : null
    };

    const response = await api.postToSocial(endpoint, postData);
    return response;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Content
          </label>
          <div className="relative">
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="What's on your mind?"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              rows={4}
              required
            />
            <button
              type="button"
              onClick={generateAIContent}
              disabled={loading || !formData.content}
              className="absolute bottom-3 right-3 p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition disabled:opacity-50"
              title="Enhance with AI"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Sparkles size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Image className="w-4 h-4 inline mr-1" />
            Media (Optional)
          </label>
          
          {!mediaPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition"
                  >
                    <Image className="w-4 h-4" />
                    Add Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition"
                  >
                    <Video className="w-4 h-4" />
                    Add Video
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Upload images or videos up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gray-50 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 z-10 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
              >
                <X className="w-4 h-4" />
              </button>
              
              {mediaPreview.type === 'image' ? (
                <div className="relative">
                  <img
                    src={mediaPreview.url}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-sm font-medium">{mediaPreview.name}</p>
                    <p className="text-xs opacity-75">{formatFileSize(mediaPreview.size)}</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <video
                    ref={videoRef}
                    src={mediaPreview.url}
                    className="w-full h-64 object-cover"
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={toggleVideoPlay}
                      className="p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition"
                    >
                      {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                    <p className="text-sm font-medium">{mediaPreview.name}</p>
                    <p className="text-xs opacity-75">{formatFileSize(mediaPreview.size)}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Hashtags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Hash className="w-4 h-4 inline mr-1" />
            Hashtags
          </label>
          <input
            type="text"
            value={formData.hashtags}
            onChange={(e) => setFormData({...formData, hashtags: e.target.value})}
            placeholder="#socialmedia #marketing #africa"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Account Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Target className="w-4 h-4 inline mr-1" />
            Select Accounts ({formData.selectedAccounts.length} selected)
          </label>
          {connectedAccounts.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">No connected accounts. Please connect your social media accounts first.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    formData.selectedAccounts.includes(account.id)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleAccountToggle(account.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        account.platform === 'Facebook' ? 'bg-blue-600' : 'bg-gradient-to-r from-pink-500 to-purple-600'
                      }`}>
                        {account.platform === 'Facebook' ? 'FB' : 'IG'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-600">{account.platform} • {account.followers} followers</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.selectedAccounts.includes(account.id)}
                      onChange={() => handleAccountToggle(account.id)}
                      className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publishing Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Calendar className="w-4 h-4 inline mr-1" />
            Publishing
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="publishType"
                value="now"
                checked={formData.publishType === 'now'}
                onChange={(e) => setFormData({...formData, publishType: e.target.value})}
                className="text-pink-600 focus:ring-pink-500"
              />
              <span className="text-gray-700">Publish now</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="publishType"
                value="schedule"
                checked={formData.publishType === 'schedule'}
                onChange={(e) => setFormData({...formData, publishType: e.target.value})}
                className="text-pink-600 focus:ring-pink-500"
              />
              <span className="text-gray-700">Schedule for later</span>
            </label>
            
            {formData.publishType === 'schedule' && (
              <div className="flex gap-3 ml-6">
                <input
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required={formData.publishType === 'schedule'}
                />
                <input
                  type="time"
                  value={formData.scheduleTime}
                  onChange={(e) => setFormData({...formData, scheduleTime: e.target.value})}
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required={formData.publishType === 'schedule'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={posting || !formData.content || formData.selectedAccounts.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {posting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={18} />
              <span>
                {formData.publishType === 'schedule' ? 'Schedule Post' : 'Publish Now'}
              </span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default PostCreator;
