import type { JSX } from 'react';
import styles from './Sidebar.module.css';

import { FaCog, FaCalendarAlt, FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { FiGrid, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';

interface NavItemProps {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}


const NavItem = ({ icon, label, isActive, hasSubmenu, onClick }: NavItemProps): JSX.Element => {
  return (
    <div
      className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {icon && <span className={styles.navIcon}>{icon}</span>}
      <span className={styles.navLabel}>{label}</span>
      {hasSubmenu && (
        <span className={styles.submenuIconWrapper}> 
          <FaAngleRight />
        </span>
      )}
    </div>
  );
};


const Sidebar = (): JSX.Element => {
  const activeItem = "Ticket Summary Report";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoPlaceholder}>N</div>
      </div>

      <div className={styles.userInfo}>
        <span className={styles.userName}>Newicon</span>
        <span className={styles.userDetails}>
          Zoe Daniels
          <span className={styles.dropdownIconWrapper}> {/* Wrapper for styling */}
            <FaAngleDown size={12} />
          </span>
        </span>
      </div>

      <hr className={styles.separator} />

      <nav className={styles.navigation}>
        <NavItem
          icon={<FiBarChart2 size={18} />}
          label="Ticket Summary Report"
          isActive={activeItem === "Ticket Summary Report"}
        />
        <NavItem
          icon={<FiGrid size={18} />}
          label="List"
          hasSubmenu={true}
        />
        <NavItem
          icon={<FiMessageSquare size={18} />}
          label="Feedback"
        />
      </nav>

      <div className={styles.sidebarFooter}>
        {/* Wrappers for consistent styling or interaction if needed */}
        <span className={styles.footerIconWrapper}>
          <FaCog size={20} />
        </span>
        <span className={styles.footerIconWrapper}>
          <FaCalendarAlt size={20} />
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;