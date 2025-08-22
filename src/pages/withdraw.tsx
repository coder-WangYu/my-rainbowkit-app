import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from '../styles/Home.module.css';
import Navigation from '../components/Navigation';

const Withdraw: NextPage = () => {
  // 用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 解除质押金额状态
  const [unstakeAmount, setUnstakeAmount] = useState(0);
  
  // 模拟数据
  const [stakedAmount, setStakedAmount] = useState(0.1); // 已质押金额
  const [availableToWithdraw, setAvailableToWithdraw] = useState(0.1); // 可提取金额
  const [pendingWithdraw, setPendingWithdraw] = useState(0); // 待提取金额
  const [cooldownTime, setCooldownTime] = useState(20); // 冷却时间（分钟）
  
  // 消息提示状态
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showMessage, setShowMessage] = useState(false);
  
  // 获取钱包连接状态
  const { isConnected, address } = useAccount();

  // 监听钱包连接状态变化
  useEffect(() => {
    setIsLoggedIn(isConnected);
  }, [isConnected]);

  // 解除质押处理函数
  const handleUnstake = async () => {
    if (unstakeAmount <= 0) {
      showNotification('请输入有效的解除质押金额', 'error');
      return;
    }

    if (unstakeAmount > stakedAmount) {
      showNotification('解除质押金额不能超过已质押金额', 'error');
      return;
    }

    try {
      // 模拟解除质押交易
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功概率（90%成功率）
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        // 解除质押成功
        setStakedAmount(prev => prev - unstakeAmount);
        setAvailableToWithdraw(prev => prev + unstakeAmount);
        setUnstakeAmount(0); // 清空输入框
        showNotification(`成功解除质押 ${unstakeAmount} ETH！`, 'success');
      } else {
        showNotification('解除质押失败，请重试', 'error');
      }
    } catch (error) {
      showNotification('解除质押过程中发生错误', 'error');
    }
  };

  // 提取ETH处理函数
  const handleWithdraw = async () => {
    if (availableToWithdraw <= 0) {
      showNotification('没有可提取的ETH', 'error');
      return;
    }

    if (cooldownTime > 0) {
      showNotification(`请等待 ${cooldownTime} 分钟冷却时间结束`, 'error');
      return;
    }

    try {
      // 模拟提取交易
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟成功概率（95%成功率）
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        // 提取成功
        setAvailableToWithdraw(0);
        showNotification(`成功提取 ${availableToWithdraw} ETH！`, 'success');
      } else {
        showNotification('提取失败，请重试', 'error');
      }
    } catch (error) {
      showNotification('提取过程中发生错误', 'error');
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
        <title>Withdraw - 解除质押和提取ETH</title>
        <meta name="description" content="解除质押并提取您的ETH" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 头部导航 */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.menuButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
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
          <h1 className={styles.mainTitle}>Withdraw</h1>
          <p className={styles.subtitle}>🔥 解除质押并提取您的ETH 🔥</p>
        </div>

        {/* 主要内容区域 */}
        <div className={styles.withdrawCard}>
          {/* 状态卡片 */}
          <div className={styles.statusCards}>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>已质押金额</div>
              <div className={styles.statusValue}>{stakedAmount.toFixed(4)} ETH</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>可提取金额</div>
              <div className={styles.statusValue}>{availableToWithdraw.toFixed(4)} ETH</div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusLabel}>待提取金额</div>
              <div className={styles.statusValue}>{pendingWithdraw.toFixed(4)} ETH</div>
            </div>
          </div>

          {/* 解除质押区域 */}
          <div className={styles.unstakeSection}>
            <h2>解除质押</h2>
            <div className={styles.inputGroup}>
              <label>解除质押金额</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="number" 
                  placeholder="0.0" 
                  min="0" 
                  max={stakedAmount}
                  step="0.0001" 
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(parseFloat(e.target.value) || 0)}
                  className={styles.amountInput} 
                />
                <span className={styles.inputSuffix}>ETH</span>
              </div>
            </div>
            {isLoggedIn ? (
              <button 
                className={styles.unstakeButton}
                disabled={unstakeAmount <= 0 || unstakeAmount > stakedAmount}
                onClick={handleUnstake}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                解除质押ETH
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>

          {/* 提取区域 */}
          <div className={styles.withdrawSection}>
            <h2>提取</h2>
            <div className={styles.withdrawInfo}>
              <div className={styles.withdrawAmount}>
                <span>准备提取</span>
                <div className={styles.amountDisplay}>
                  {availableToWithdraw.toFixed(4)} ETH
                  <div className={styles.cooldownInfo}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {cooldownTime} 分钟冷却时间
                  </div>
                </div>
              </div>
              <div className={styles.withdrawHint}>
                解除质押后，您需要等待20分钟才能提取。
              </div>
            </div>
            {isLoggedIn ? (
              <button 
                className={styles.withdrawButton}
                disabled={availableToWithdraw <= 0 || cooldownTime > 0}
                onClick={handleWithdraw}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                提取ETH
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Withdraw;
