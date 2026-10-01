import React, { useEffect } from 'react';
import { Settings, Bell, Shield, Palette, HelpCircle, LogOut, Calendar, MapPin, MessageCircle } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { useNavigation } from '../../contexts/NavContext';
import { useAuth } from '../../hooks/useAuth';
import './Settings.css';

const SettingsPage: React.FC = () => {
  const { setPage } = useNavigation();
  const { logout } = useAuth();

  useEffect(() => { setPage('settings'); }, [setPage]);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppShell>
      <div className="tkd-settings-page">
        <div className="tkd-settings-content">

          <div className="tkd-settings-header">
            <h1>Settings</h1>
            <p>Manage your account preferences and app settings.</p>
          </div>

          {/* Account section */}
          <section className="tkd-settings-section">
            <h2 className="tkd-settings-section-title">
              <Shield size={15} />
              Account
            </h2>
            <div className="tkd-settings-list">
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><Shield size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Privacy &amp; Security</span>
                  <span className="tkd-settings-item-desc">Manage password, two-factor auth, and data visibility.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </div>
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><Bell size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Notifications</span>
                  <span className="tkd-settings-item-desc">Email and push notification preferences.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="9 18l6-6-6-6"/></svg>
              </div>
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><Palette size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Appearance</span>
                  <span className="tkd-settings-item-desc">Theme, font size, and display options.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </section>

          {/* Training preferences */}
          <section className="tkd-settings-section">
            <h2 className="tkd-settings-section-title">
              <Settings size={15} />
              Training Preferences
            </h2>
            <div className="tkd-settings-list">
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><Calendar size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Default Schedule View</span>
                  <span className="tkd-settings-item-desc">Choose how training schedules are displayed.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="9 18l6-6-6-6"/></svg>
              </div>
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><MapPin size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Preferred Dojang</span>
                  <span className="tkd-settings-item-desc">Select your home training location.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </section>

          {/* Help & support */}
          <section className="tkd-settings-section">
            <h2 className="tkd-settings-section-title">
              <HelpCircle size={15} />
              Help &amp; Support
            </h2>
            <div className="tkd-settings-list">
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><HelpCircle size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">FAQ</span>
                  <span className="tkd-settings-item-desc">Frequently asked questions about the academy platform.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="9 18l6-6-6-6"/></svg>
              </div>
              <div className="tkd-settings-item">
                <div className="tkd-settings-item-icon"><MessageCircle size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Contact Support</span>
                  <span className="tkd-settings-item-desc">Reach out to academy administration.</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="9 18l6-6-6-6"/></svg>
              </div>
            </div>
          </section>

          {/* Danger zone */}
          <section className="tkd-settings-section tkd-settings-section--danger">
            <h2 className="tkd-settings-section-title">
              <LogOut size={15} />
              Sign Out
            </h2>
            <div className="tkd-settings-list">
              <button className="tkd-settings-item tkd-settings-item--danger" onClick={handleLogout} type="button">
                <div className="tkd-settings-item-icon"><LogOut size={16} /></div>
                <div className="tkd-settings-item-content">
                  <span className="tkd-settings-item-label">Sign Out</span>
                  <span className="tkd-settings-item-desc">End your current session.</span>
                </div>
              </button>
            </div>
          </section>

        </div>
      </div>
    </AppShell>
  );
};

export default SettingsPage;
