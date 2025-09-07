import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Edit3, Trash2 } from 'lucide-react';

const InteractiveCalendar = ({ posts = [], onDateClick, onPostClick, onCreatePost, onEditPost, onDeletePost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getPostsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter(post => post.date === dateStr);
  };

  const getPostsForWeek = (startDate) => {
    const weekPosts = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayPosts = posts.filter(post => post.date === dateStr);
      weekPosts.push({ date, posts: dayPosts });
    }
    return weekPosts;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return '📘';
      case 'instagram': return '📷';
      case 'twitter':
      case 'x': return '🐦';
      case 'linkedin': return '💼';
      default: return '📱';
    }
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear();

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        {daysInMonth.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-24"></div>;
          }

          const dayPosts = getPostsForDate(date);
          const isToday = isCurrentMonth && date.getDate() === today.getDate();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <motion.div
              key={date.toISOString()}
              className={`h-24 p-1 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                isToday ? 'bg-blue-50 border-blue-300' : ''
              } ${isSelected ? 'bg-pink-50 border-pink-300' : ''}`}
              onClick={() => handleDateClick(date)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </span>
                {dayPosts.length > 0 && (
                  <span className="text-xs bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {dayPosts.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayPosts.slice(0, 2).map((post, postIndex) => (
                  <motion.div
                    key={post.id}
                    className={`text-xs p-1 rounded border ${getStatusColor(post.status)} truncate`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPostClick?.(post);
                    }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: postIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-1">
                      <span>{getPlatformIcon(post.platform)}</span>
                      <span className="truncate">{post.content.substring(0, 15)}...</span>
                    </div>
                    <div className="text-xs opacity-75">{formatTime(post.time)}</div>
                  </motion.div>
                ))}
                {dayPosts.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayPosts.length - 2} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const weekPosts = getPostsForWeek(startOfWeek);
    const today = new Date();

    return (
      <div className="grid grid-cols-7 gap-1">
        {weekPosts.map(({ date, posts }, index) => {
          const isToday = date.toDateString() === today.toDateString();
          const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <motion.div
              key={date.toISOString()}
              className={`h-32 p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                isToday ? 'bg-blue-50 border-blue-300' : ''
              } ${isSelected ? 'bg-pink-50 border-pink-300' : ''}`}
              onClick={() => handleDateClick(date)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {days[index]}
                </span>
                <span className="text-xs text-gray-500">{date.getDate()}</span>
              </div>
              
              <div className="space-y-1">
                {posts.slice(0, 3).map((post, postIndex) => (
                  <motion.div
                    key={post.id}
                    className={`text-xs p-1 rounded border ${getStatusColor(post.status)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPostClick?.(post);
                    }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: postIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-1">
                      <span>{getPlatformIcon(post.platform)}</span>
                      <span className="truncate">{post.content.substring(0, 12)}...</span>
                    </div>
                  </motion.div>
                ))}
                {posts.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{posts.length - 3} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    if (!selectedDate) return null;
    
    const dayPosts = getPostsForDate(selectedDate);
    const isToday = selectedDate.toDateString() === new Date().toDateString();

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          {isToday && (
            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Today
            </span>
          )}
        </div>

        <div className="space-y-3">
          {dayPosts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No posts scheduled for this day</p>
              <button
                onClick={() => onCreatePost?.(selectedDate)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Schedule Post
              </button>
            </div>
          ) : (
            dayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                      <span className="font-medium text-gray-900">{post.platform}</span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(post.time)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {post.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditPost?.(post)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletePost?.(post)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Post Calendar</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                viewMode === 'month' 
                  ? 'bg-pink-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                viewMode === 'week' 
                  ? 'bg-pink-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                viewMode === 'day' 
                  ? 'bg-pink-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-medium text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={() => onCreatePost?.(selectedDate || new Date())}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'month' && renderMonthView()}
            {viewMode === 'week' && renderWeekView()}
            {viewMode === 'day' && renderDayView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveCalendar;
