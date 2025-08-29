import React from 'react';
import styles from '../styles/Home.module.css';

interface LoadingProps {
  isLoading: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, message = "交易处理中，请稍候..." }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>{message}</p>
      </div>
    </div>
  );
};

export default Loading;
