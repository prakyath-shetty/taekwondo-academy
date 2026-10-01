import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="tkd-app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="tkd-app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="tkd-app-content">{children}</div>
      </main>
    </div>
  );
};

export default AppShell;
