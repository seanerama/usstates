import React from 'react';
import './Layout.css';

interface SidebarProps {
  children: React.ReactNode;
  position: 'left' | 'right';
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ children, position, isOpen = true, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar sidebar-${position} ${isOpen ? 'sidebar-open' : ''}`}
        role="complementary"
        aria-label={`${position} sidebar`}
      >
        {children}
      </aside>
    </>
  );
};

export default Sidebar;
