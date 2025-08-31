// src/components/MainLayout.tsx
import Sidebar from './SideBar'; 
import TopNav from './TopNav';
import styles from './MainLayout.module.css';
// import type { JSX } from 'react'; // This can be removed if React.FC or other specific JSX types aren't used
import type { JSX, ReactNode } from 'react'; // More direct import

interface MainLayoutProps {
  children: ReactNode;
}

// Using JSX.Element as return type is fine, no need for React.FC
const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  return (
    <div className={styles.mainLayout}>
      <Sidebar />
      <div className={styles.pageWrapper}>
        <TopNav />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;