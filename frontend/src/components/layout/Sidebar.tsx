import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  Dumbbell,
  Images,
  LayoutDashboard,
  Medal,
  Megaphone,
  Settings,
  Trophy,
  UserRound,
  Users,
  X,
  type LucideProps,
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavContext';
import type { PageId } from '../../contexts/NavContext';
import { Logo, Fighter } from '../dashboard/Art';
import './Sidebar.css';

type NavigationItem = { id: PageId; label: string; icon: React.ComponentType<LucideProps> };

const NAV_LINKS: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
  { id: 'training', label: 'Training', icon: Dumbbell },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
  { id: 'achievements', label: 'Achievements', icon: Medal },
  { id: 'coach', label: 'Coach', icon: Users },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'gallery', label: 'Gallery', icon: Images },
];

const BOTTOM_LINKS: NavigationItem[] = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { currentPage, setPage } = useNavigation();

  const handleNav = (id: PageId) => {
    setPage(id);
    if (id === 'dashboard') navigate('/app');
    else if (id === 'profile') navigate('/app/profile');
    else navigate(`/app/${id}`);
    onClose();
  };

  return (
    <>
      {open && (
        <div className="tkd-sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`tkd-sidebar ${open ? 'tkd-sidebar-open' : ''}`}>
        <button className="tkd-sidebar-close" onClick={onClose} aria-label="Close menu">
          <X size={18} />
        </button>

        {/* Brand */}
        <div className="tkd-sidebar-brand">
          <Logo className="tkd-sidebar-logo" />
          <div className="tkd-sidebar-brand-text">
            <span className="tkd-sidebar-brand-name">Taekwondo</span>
            <span className="tkd-sidebar-brand-role">Discipline Builds Champions</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="tkd-sidebar-nav">
          {NAV_LINKS.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`tkd-nav-item${isActive ? ' tkd-nav-item--active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="tkd-sidebar-divider" />

        {/* Bottom links */}
        <nav className="tkd-sidebar-nav">
          {BOTTOM_LINKS.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`tkd-nav-item${isActive ? ' tkd-nav-item--active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer silhouette figure + quote */}
        <div className="tkd-sidebar-footer">
          <Fighter className="tkd-sidebar-silhouette" color="rgba(255,255,255,0.35)" />
          <p className="tkd-sidebar-quote">"A Black Belt is a White Belt who Never Gave Up."</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
