import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from '../styles/Home.module.css';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';

const ClaimRewards: NextPage = () => {
  // 用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 模拟数据
  const [pendingRewards, setPendingRewards] = useState(0); // 待领取奖励
  const [stakedAmount, setStakedAmount] = useState(0); // 质押金额
  const [lastUpdate, setLastUpdate] = useState('18:10:06'); // 最后更新时间
  
  // 消息提示状态
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading 状态
  
  // 获取钱包连接状态
  const { isConnected, address } = useAccount();

  // 监听钱包连接状态变化
  useEffect(() => {
    setIsLoggedIn(isConnected);
  }, [isConnected]);

  // 领取奖励处理函数
  const handleClaimRewards = async () => {
    if (pendingRewards <= 0) {
      showNotification('没有可领取的奖励', 'error');
      return;
    }

    try {
      setIsLoading(true); // 开始 loading
      
      // 模拟领取奖励交易
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功概率（95%成功率）
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        // 领取成功
        const claimedAmount = pendingRewards;
        setPendingRewards(0);
        showNotification(`成功领取 ${claimedAmount.toFixed(4)} WY 奖励！`, 'success');
      } else {
        showNotification('领取奖励失败，请重试', 'error');
      }
    } catch (error) {
      showNotification('领取奖励过程中发生错误', 'error');
    } finally {
      setIsLoading(false); // 结束 loading
    }
  };

  // 显示消息提示
  const showNotification = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setShowMessage(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Claim Rewards - 领取WY奖励</title>
        <meta name="description" content="领取您的WY代币奖励" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 全局 Loading 蒙版 */}
      <Loading isLoading={isLoading} message="领取奖励中，请稍候..." />

      {/* 头部导航 */}
      <header className={styles.header}>
        <div className={styles.headerRight}>
          <ConnectButton />
        </div>
      </header>

      <main className={styles.main}>
        {/* 消息提示 */}
        {showMessage && (
          <div className={`${styles.notification} ${styles[messageType]}`}>
            <div className={styles.notificationContent}>
              <span className={styles.notificationIcon}>
                {messageType === 'success' ? '✅' : '❌'}
              </span>
              <span className={styles.notificationText}>{message}</span>
            </div>
          </div>
        )}

        {/* 主标题区域 */}
        <div className={styles.titleSection}>
          <div className={styles.claimLogo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M20 12V10H22V12H20ZM22 16V14H20V16H22ZM6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6C8.686 6 6 8.686 6 12ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="#22C55E"/>
            </svg>
          </div>
          <h1 className={styles.claimTitle}>Claim Rewards</h1>
          <p className={styles.subtitle}>🎁 领取您的WY奖励 🎁</p>
        </div>

        {/* 主要内容区域 */}
        <div className={styles.claimContent}>
          {/* 奖励统计面板 */}
          <div className={styles.rewardStatsCard}>
            <h2>奖励统计</h2>
            <div className={styles.statsList}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 12V10H22V12H20ZM22 16V14H20V16H22ZM6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6C8.686 6 6 8.686 6 12ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>待领取奖励</span>
                  <span className={styles.statValue}>{pendingRewards.toFixed(4)} WY</span>
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 7V13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>质押金额</span>
                  <span className={styles.statValue}>{stakedAmount.toFixed(4)} ETH</span>
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>最后更新</span>
                  <span className={styles.statValue}>{lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 领取奖励面板 */}
          <div className={styles.claimRewardsCard}>
            <h2>领取奖励</h2>
            
            {/* 领取说明 */}
            <div className={styles.claimInfo}>
              <div className={styles.infoHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>领取机制说明</span>
              </div>
              <ul className={styles.infoList}>
                <li>奖励在您质押期间持续累积</li>
                <li>您可以随时领取奖励</li>
                <li>领取的奖励将发送到您的钱包</li>
                <li>没有最低领取金额要求</li>
              </ul>
            </div>

            {/* 奖励状态 */}
            {pendingRewards > 0 ? (
              <div className={styles.rewardsAvailable}>
                <div className={styles.rewardAmount}>
                  <span>可领取奖励</span>
                  <div className={styles.amountDisplay}>
                    {pendingRewards.toFixed(4)} WY
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.noRewards}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>暂无奖励可领取</span>
              </div>
            )}

            {/* 操作按钮 */}
            {isLoggedIn ? (
              <button 
                className={styles.claimButton}
                disabled={pendingRewards <= 0}
                onClick={handleClaimRewards}
              >
                {pendingRewards > 0 ? '领取奖励' : '暂无奖励'}
              </button>
            ) : (
              <ConnectButton />
            )}

            {/* 提示信息 */}
            {pendingRewards <= 0 && (
              <div className={styles.claimHint}>
                🔥 开始质押ETH赚取WY奖励！ 🔥
              </div>
            )}
          </div>
        </div>

        {/* 奖励历史 */}
        <div className={styles.rewardHistoryCard}>
          <h2>奖励历史</h2>
          <div className={styles.historyPlaceholder}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p>奖励历史将在此显示</p>
            <p>跟踪您过去的领取记录和奖励</p>
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default ClaimRewards;
