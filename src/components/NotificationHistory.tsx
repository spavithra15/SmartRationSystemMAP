import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NotificationWithDetails {
  id: string;
  message: string;
  status: string;
  sent_at: string;
  created_at: string;
  beneficiary: {
    name: string;
    phone_number: string;
  };
  product: {
    name: string;
  };
}

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState<NotificationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          beneficiary:beneficiaries(name, phone_number),
          product:products(name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <span className="text-red-800">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Notification History</h2>
        <span className="text-sm text-gray-600">
          Last 50 notifications
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No notifications sent yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {notification.status === 'sent' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {notification.beneficiary?.name || 'Unknown'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {notification.product?.name || 'Unknown Product'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{notification.beneficiary?.phone_number || 'N/A'}</span>
                    <span>•</span>
                    <span>
                      {new Date(notification.sent_at || notification.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.status === 'sent'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {notification.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
