import React from 'react';
import { RiBellLine } from 'react-icons/ri';
import useNotificationStore from '../store/notificationStore';
import '../styles/NotificationBell.css';

function NotificationBell() {
  const { notifications, removeNotification } = useNotificationStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="notification-container">
      <button 
        className="notification-bell" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <RiBellLine />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <p className="no-notifications">No new notifications</p>
          ) : (
            <>
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <p>{notification.message}</p>
                  <button 
                    className="dismiss-btn"
                    onClick={() => removeNotification(notification.id)}
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell