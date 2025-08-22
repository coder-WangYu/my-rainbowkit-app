import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navigation.module.css';

const Navigation = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2"/>
          </svg>
          质押
        </Link>
        
        <Link href="/withdraw" className={`${styles.navLink} ${isActive('/withdraw') ? styles.active : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          解除质押
        </Link>
        
        <Link href="/claim" className={`${styles.navLink} ${isActive('/claim') ? styles.active : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 12V10H22V12H20ZM22 16V14H20V16H22ZM6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6C8.686 6 6 8.686 6 12ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
          </svg>
          领取奖励
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
