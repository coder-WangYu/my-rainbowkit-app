import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import styles from '../styles/Home.module.css';
import Navigation from '../components/Navigation';
import Loading from '../components/Loading';
import { client, useStakeContract } from '../hooks/useContract';
import { parseUnits } from 'viem/utils';
import { waitForTransactionReceipt } from 'viem/actions';

const Withdraw: NextPage = () => {
  const stakeContract = useStakeContract(); // 获取质押合约
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 用户登录状态
  const [unstakeAmount, setUnstakeAmount] = useState(0); // 要解除质押的金额
  const [stakedAmount, setStakedAmount] = useState(0); // 用户已质押金额
  const [availableToWithdraw, setAvailableToWithdraw] = useState(0); // 可提取金额
  const { isConnected, address } = useAccount(); // 获取钱包连接状态
  const { data: balance, refetch: refetchBalance } = useBalance({ // 获取钱包余额 & 更新方法
    address
  });

  // 消息提示状态
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading 状态

  // 获取用户数据
  const fetchUserData = async () => {
    if (stakeContract && address && isConnected) {
      try {
        // 获取用户质押金额
        const stakedAmount = await stakeContract.read.balanceOf([address]);
        setStakedAmount(Number(stakedAmount) / 1e18);
        setAvailableToWithdraw(Number(stakedAmount) / 1e18);
      } catch (error) {
        console.error("获取用户数据失败:", error);
      }
    }
  };

  // 提取ETH处理函数
  const handleWithdraw = async () => {
    if(!stakeContract) {
      showNotification('请先连接钱包', 'error');
      return;
    }

    if (availableToWithdraw <= 0) {
      showNotification('没有可提取的ETH', 'error');
      return;
    }

    if(unstakeAmount > availableToWithdraw) {
      showNotification('提取金额不能大于可提取金额', 'error');
      return;
    }

    try {
      setIsLoading(true); // 开始 loading
      const tx = await stakeContract.write.withdraw([parseUnits(unstakeAmount.toString(), 18)])
      const result = await waitForTransactionReceipt(client, { hash: tx });

      if (result.status === "success") {
        setUnstakeAmount(0);
        showNotification(`成功提取 ${availableToWithdraw} ETH！`, 'success');

        // 等待一下让区块链状态更新，然后重新获取所有数据
        setTimeout(async () => {
          await refetchBalance();
        }, 2000);
      } else {
        showNotification('提取失败，请重试', 'error');
      }
    } catch (error) {
      showNotification('提取过程中发生错误', 'error');
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

  // 监听钱包连接状态变化
  useEffect(() => {
    setIsLoggedIn(isConnected);
  }, [isConnected]);

  useEffect(() => {
    fetchUserData()
  }, [stakeContract])

  return (
    <div className={styles.container}>
      <Head>
        <title>Withdraw - 解除质押和提取ETH</title>
        <meta name="description" content="解除质押并提取您的ETH" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 全局 Loading 蒙版 */}
      <Loading isLoading={isLoading} />

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
          <h1 className={styles.mainTitle}>Withdraw</h1>
          <p className={styles.subtitle}>🔥 提取您质押的ETH 🔥</p>
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
          </div>

          {/* 提取区域 */}
          <div className={styles.withdrawSection}>
            <h2>提取</h2>
            <div className={styles.withdrawInfo}>
              <div className={styles.withdrawAmount}>
                <span>准备提取</span>
                <div className={styles.amountDisplay}>
                  {availableToWithdraw.toFixed(4)} ETH
                </div>
              </div>
              <div className={styles.inputWrapper}>
                <input 
                  type="number" 
                  placeholder="0.0" 
                  min="0"
                  max={availableToWithdraw}
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
                className={styles.withdrawButton}
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
