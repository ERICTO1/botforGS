import React from 'react';
import { Mail, Link, Eye, Send, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'opened' | 'shared' | 'viewed';
  user: string;
  role?: string;
  timestamp: string;
  date: string;
  method?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'opened',
    user: 'Client',
    timestamp: '05:55 PM',
    date: '10 Feb'
  },
  {
    id: '2',
    type: 'opened',
    user: 'Client',
    timestamp: '05:55 PM',
    date: '10 Feb'
  },
  {
    id: '3',
    type: 'opened',
    user: 'Client',
    timestamp: '10:56 AM',
    date: '06 Feb'
  },
  {
    id: '4',
    type: 'shared',
    user: 'eric to',
    timestamp: '08:24 PM',
    date: '11 Dec',
    method: 'Via Email'
  },
  {
    id: '5',
    type: 'opened',
    user: 'eric to',
    timestamp: '02:27 PM',
    date: '08 Dec'
  },
  {
    id: '6',
    type: 'opened',
    user: 'eric to',
    timestamp: '02:26 PM',
    date: '08 Dec'
  },
  {
    id: '7',
    type: 'shared',
    user: 'eric to',
    timestamp: '03:45 PM',
    date: '03 Dec',
    method: 'Via Copy Link'
  },
  {
    id: '8',
    type: 'opened',
    user: 'Client',
    timestamp: '03:45 PM',
    date: '03 Dec'
  }
];

const ActivityTimeline: React.FC = () => {
  // Group activities by date
  const groupedActivities = mockActivities.reduce((acc, activity) => {
    if (!acc[activity.date]) {
      acc[activity.date] = [];
    }
    acc[activity.date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const dates = Object.keys(groupedActivities);

  const getIcon = (type: string) => {
    switch (type) {
      case 'opened': return <Eye size={14} className="text-green-600" />;
      case 'shared': return <Send size={14} className="text-orange-500 ml-0.5" />; // Send icon looks like paper plane
      default: return <MessageSquare size={14} className="text-gray-500" />;
    }
  };

  const getBgColor = (type: string) => {
      switch (type) {
          case 'opened': return 'bg-green-50';
          case 'shared': return 'bg-orange-50';
          default: return 'bg-gray-50';
      }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col w-80 flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-gray-900">
          Activities <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">78</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative pl-4 border-l border-gray-200 space-y-8">
          {dates.map((date) => (
            <div key={date} className="relative">
              {/* Date Header */}
              <div className="absolute -left-[21px] top-0 flex items-center">
                 <div className="w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white ring-1 ring-gray-200"></div>
                 <span className="ml-4 font-bold text-gray-900 text-sm">{date.split(' ')[0]}</span>
                 <span className="ml-1 text-gray-500 text-xs">{date.split(' ')[1]}</span>
              </div>

              <div className="pt-6 space-y-3">
                {groupedActivities[date].map((activity) => (
                  <div key={activity.id}>
                    <p className="text-xs text-gray-400 mb-1">{activity.timestamp}</p>
                    <div className={`p-3 rounded-lg ${getBgColor(activity.type)} border border-transparent hover:border-gray-200 transition-colors`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0`}>
                          {getIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'opened' ? 'Proposal opened by the client' : 'Proposal shared'}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white">
                                {activity.user.charAt(0).toUpperCase()}
                              </div>
                              <span>{activity.user}</span>
                            </div>
                            {activity.method && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>{activity.method}</span>
                                {activity.method.includes('Email') ? <Mail size={12} /> : <Link size={12} />}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;
