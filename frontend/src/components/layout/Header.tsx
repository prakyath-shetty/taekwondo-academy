import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, CheckCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { mockNotifications, Notification } from '../../mock/notifications';
import './Header.css';
import './Notifications.css';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (n: Notification) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    setNotifOpen(false);
    if (n.type === 'training') navigate('/app/training');
    else if (n.type === 'attendance') navigate('/app/attendance');
    else if (n.type === 'tournament') navigate('/app/tournaments');
    else if (n.type === 'grading') navigate('/app/schedule');
    else if (n.type === 'academy') navigate('/app/announcements');
  };

  const initials = (
    (user?.firstName?.[0] || 'T') + (user?.lastName?.[0] || 'K')
  ).toUpperCase();

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : 'Taekwondo Student';

  const role = user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Student';

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    navigate('/login');
  };

  const dailyQuotes = [
    "Discipline today. Strength tomorrow.",
    "Every session brings you closer.",
    "The belt is earned, not given.",
    "Train with purpose. Compete with heart.",
    "Respect is the highest rank.",
  ];

  const [motivation] = React.useState(() =>
    dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)]
  );

  return (
    <header className="tkd-header">
      <div className="tkd-header-left">
        <button className="tkd-header-left-icon" onClick={onMenuClick} aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="tkd-header-motivation">{motivation}</span>
      </div>

      <div className="tkd-header-right">
        {/* Notifications */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className={`tkd-header-btn ${notifOpen ? 'tkd-header-btn--active' : ''}`}
            title="Notifications"
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={2} />
            {unreadCount > 0 && <span className="tkd-header-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="tkd-notif-panel">
              <div className="tkd-notif-header">
                <span className="tkd-notif-header-title">Notifications</span>
                {unreadCount > 0 && (
                  <button className="tkd-notif-clear" onClick={handleMarkAllRead}>
                    <CheckCheck size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 3 }} />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="tkd-notif-list">
                {notifications.length === 0 ? (
                  <div className="tkd-notif-empty">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <button
                      type="button"
                      key={n.id}
                      className={`tkd-notif-item ${!n.read ? 'tkd-notif-item--unread' : ''}`}
                      onClick={() => handleNotificationClick(n)}
                    >
                      {!n.read && <div className="tkd-notif-dot" />}
                      <div className="tkd-notif-body">
                        <div className="tkd-notif-title">{n.title}</div>
                        <div className="tkd-notif-desc">{n.body}</div>
                        <div className="tkd-notif-time">{n.time}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="tkd-notif-footer">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen(false);
                    navigate('/app/announcements');
                  }}
                >
                  View All Announcements
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="tkd-header-divider" />

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            className={`tkd-header-user ${profileOpen ? 'tkd-header-user--active' : ''}`}
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            aria-label="User profile menu"
          >
            <div className="tkd-header-avatar">{initials}</div>
            <div className="tkd-header-user-info">
              <span className="tkd-header-user-name">{fullName}</span>
              <span className="tkd-header-user-role">{role}</span>
            </div>
            <ChevronDown
              size={14}
              strokeWidth={2.2}
              className={`tkd-header-chevron ${profileOpen ? 'tkd-header-chevron--open' : ''}`}
            />
          </button>

          {profileOpen && (
            <div className="tkd-dropdown-menu">
              <div className="tkd-dropdown-header">
                <div className="tkd-dropdown-avatar">{initials}</div>
                <div className="tkd-dropdown-user-details">
                  <span className="tkd-dropdown-name">{fullName}</span>
                  <span className="tkd-dropdown-role">{role}</span>
                </div>
              </div>
              <div className="tkd-dropdown-divider" />
              <button
                className="tkd-dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/app/profile');
                }}
              >
                <User size={15} strokeWidth={2} />
                Profile
              </button>
              <button
                className="tkd-dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate('/app/settings');
                }}
              >
                <Settings size={15} strokeWidth={2} />
                Settings
              </button>
              <div className="tkd-dropdown-divider" />
              <button className="tkd-dropdown-item tkd-dropdown-item-danger" onClick={handleLogout}>
                <LogOut size={15} strokeWidth={2} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
