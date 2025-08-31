// src/components/TopNav/TopNav.tsx
import type { JSX } from 'react';
import styles from './TopNav.module.css';

const TopNav = (): JSX.Element => {
  return (
    <nav className={styles.topNav}>
      {/* We'll add buttons and search here later */}
      <div className={styles.leftActions}>
        {/* Example: Placeholder for "+ New" button */}
        <button className={styles.newButton}>+ New</button>
      </div>
      <div className={styles.rightActions}>
        {/* Example: Placeholder for Search and User Icon */}
        <input type="search" placeholder="Search..." className={styles.searchInput} />
        <div className={styles.userIconPlaceholder}>U</div>
      </div>
    </nav>
  );
};

export default TopNav;