import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Brain, 
  Bell,
  Clock,
  Plus,
  ExternalLink,
  Target,
  Award,
  XCircle
} from 'lucide-react';
import { applicationsStorage, remindersStorage } from '../utils/storage';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [view, setView] = useState('month'); // month, week, day

  useEffect(() => {
    setApplications(applicationsStorage.get());
    setReminders(remindersStorage.get());
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date) => {
    const dateStr = formatDate(date);
    const events = [];

    // Add application events
    applications.forEach(app => {
      if (app.date === dateStr) {
        events.push({
          type: 'application',
          title: `Applied: ${app.position}`,
          company: app.company,
          status: app.status,
          color: 'bg-blue-500',
          icon: Briefcase
        });
      }

      // Add interview events
      if (app.status === 'interview' && app.interviewDate === dateStr) {
        events.push({
          type: 'interview',
          title: `Interview: ${app.position}`,
          company: app.company,
          status: 'interview',
          color: 'bg-purple-500',
          icon: Brain
        });
      }
    });

    // Add reminder events
    reminders.forEach(reminder => {
      if (reminder.date === dateStr && reminder.status === 'pending') {
        const iconMap = {
          'followup': Bell,
          'interview': Brain,
          'phonecall': Clock,
          'other': Bell
        };

        events.push({
          type: 'reminder',
          title: reminder.title,
          priority: reminder.priority,
          color: reminder.priority === 'high' ? 'bg-red-500' : 
                 reminder.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500',
          icon: iconMap[reminder.type] || Bell
        });
      }
    });

    return events;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-white/10"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-white/10 p-2 cursor-pointer transition-colors ${
            isToday ? 'bg-blue-500/20' : ''
          } ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${
              isToday ? 'text-blue-400' : 'text-white'
            }`}>
              {day}
            </span>
            {events.length > 0 && (
              <span className="text-xs text-white/60">{events.length}</span>
            )}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event, index) => {
              const Icon = event.icon;
              return (
                <div key={index} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${event.color}`}></div>
                  <Icon className="w-3 h-3 text-white/60" />
                  <span className="text-xs text-white/60 truncate">
                    {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
                  </span>
                </div>
              );
            })}
            {events.length > 2 && (
              <span className="text-xs text-white/40">+{events.length - 2} more</span>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const getWeekDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => (
      <div key={day} className="h-10 flex items-center justify-center text-white/60 text-sm font-medium border border-white/10">
        {day}
      </div>
    ));
  };

  const renderDayDetails = () => {
    if (!selectedDate) return null;

    const events = getEventsForDate(selectedDate);
    const dateStr = selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">{dateStr}</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDate(null)}
            className="text-white/60 hover:text-white"
          >
            ×
          </motion.button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{event.title}</h4>
                      {event.company && (
                        <p className="text-white/60 text-sm">{event.company}</p>
                      )}
                      {event.priority && (
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                          event.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          event.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {event.priority} priority
                        </span>
                      )}
                      {event.status && (
                        <span className={`inline-block mt-1 ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                          event.status === 'offer' ? 'bg-green-500/20 text-green-400' :
                          event.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {event.status}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    );
  };

  const exportCalendar = () => {
    // Generate iCal format
    let icalContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AI Application Tracker//EN\n';

    // Add applications
    applications.forEach(app => {
      if (app.date) {
        const eventDate = new Date(app.date);
        const startDate = eventDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endDate = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

        icalContent += `BEGIN:VEVENT\n`;
        icalContent += `DTSTART:${startDate}\n`;
        icalContent += `DTEND:${endDate}\n`;
        icalContent += `SUMMARY:Applied for ${app.position}\n`;
        icalContent += `DESCRIPTION:Application submitted to ${app.company}\n`;
        icalContent += `END:VEVENT\n`;
      }
    });

    // Add reminders
    reminders.forEach(reminder => {
      if (reminder.date && reminder.status === 'pending') {
        const eventDate = new Date(`${reminder.date}T${reminder.time || '09:00'}`);
        const startDate = eventDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
        const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

        icalContent += `BEGIN:VEVENT\n`;
        icalContent += `DTSTART:${startDate}\n`;
        icalContent += `DTEND:${endDate}\n`;
        icalContent += `SUMMARY:${reminder.title}\n`;
        icalContent += `DESCRIPTION:Priority: ${reminder.priority}\n`;
        icalContent += `END:VEVENT\n`;
      }
    });

    icalContent += 'END:VCALENDAR';

    // Download the file
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-search-calendar.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Calendar exported successfully!');
  };

  const upcomingEvents = [];
  const today = new Date();
  
  // Get next 7 days of events
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const events = getEventsForDate(date);
    if (events.length > 0) {
      upcomingEvents.push({ date, events });
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Calendar</h2>
          <p className="text-white/70">View your job search schedule and important dates</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCalendar}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth('prev')}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </motion.button>
              
              <h3 className="text-xl font-bold text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth('next')}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0">
              {getWeekDays()}
              {renderMonthView()}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Upcoming Events</span>
            </h3>
            
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-white/60 text-sm">No upcoming events</p>
              ) : (
                upcomingEvents.slice(0, 5).map(({ date, events }, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-3">
                    <p className="text-white/60 text-sm">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    {events.slice(0, 2).map((event, eventIndex) => {
                      const Icon = event.icon;
                      return (
                        <div key={eventIndex} className="flex items-center space-x-2 mt-1">
                          <Icon className="w-3 h-3 text-white/40" />
                          <span className="text-white/80 text-xs truncate">
                            {event.title}
                          </span>
                        </div>
                      );
                    })}
                    {events.length > 2 && (
                      <span className="text-white/40 text-xs">+{events.length - 2} more</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4">This Month</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Applications</span>
                <span className="text-white font-medium">
                  {applications.filter(app => {
                    const appDate = new Date(app.date);
                    return appDate.getMonth() === currentDate.getMonth() && 
                           appDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Interviews</span>
                <span className="text-white font-medium">
                  {applications.filter(app => 
                    app.status === 'interview' && app.interviewDate
                  ).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Reminders</span>
                <span className="text-white font-medium">
                  {reminders.filter(reminder => {
                    const reminderDate = new Date(reminder.date);
                    return reminderDate.getMonth() === currentDate.getMonth() && 
                           reminderDate.getFullYear() === currentDate.getFullYear() &&
                           reminder.status === 'pending';
                  }).length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Day Details */}
      {renderDayDetails()}
    </div>
  );
};

export default CalendarView;
