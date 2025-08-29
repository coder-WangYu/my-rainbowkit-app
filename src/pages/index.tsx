import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import styles from '../styles/Home.module.css';
import Navigation from '../components/Navigation';
import { useRewardContract, useStakeContract } from '../hooks/useContract';
import { waitForTransactionReceipt } from 'viem/actions';
import { client } from '../hooks/useContract';
import { parseUnits } from 'viem';
import Loading from '../components/Loading';

const Home: NextPage = () => {
  const stakeContract = useStakeContract(); // 获取质押合约
  const rewardContract = useRewardContract(); // 获取奖励合约
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 获取用户登录状态
  const { isConnected, address } = useAccount(); // 获取钱包连接状态及地址
  const [stakeAmount, setStakeAmount] = useState(0); // 用户质押金额
  const [rewardAmount, setRewardAmount] = useState(0); // 奖励金额状态（模拟数据）
  const [stakedAmount, setStakedAmount] = useState(0); // 用户已质押金额
  const [totalStaked, setTotalStaked] = useState(0); // 合约总质押金额
  const [totalRewards, setTotalRewards] = useState(0); // 合约总奖励金额
  const { data: balance, refetch: refetchBalance } = useBalance({ // 获取钱包余额 & 更新方法
    address
  });

  // 消息提示状态
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 全局 loading 状态
  
  // 获取总数据的函数
  const fetchTotalData = async () => {
    if (stakeContract) {
      try {
        // 获取总质押量
        const totalSupply = await stakeContract.read.totalSupply();
        setTotalStaked(Number(totalSupply) / 1e18);
        
        // 获取总奖励代币数量
        const totalRewards = await rewardContract.read.balanceOf([stakeContract.address])
        setTotalRewards(Number(totalRewards) / 1e18);
      } catch (error) {
        console.error("获取总数据失败:", error);
      }
    }
  };

  // 获取用户数据
  const fetchUserData = async () => {
    if (stakeContract && address && isConnected) {
      try {
        // 获取用户质押金额
        const stakedAmount = await stakeContract.read.balanceOf([address]);
        setStakedAmount(Number(stakedAmount) / 1e18);
        
        // 获取用户赚取的奖励
        const earnedReward = await stakeContract.read.earned([address]);
        setRewardAmount(Number(earnedReward) / 1e18);
        
      } catch (error) {
        console.error("获取用户数据失败:", error);
      }
    }
  };

  // 质押处理函数
  const handleStake = async () => {
    if(!stakeContract) {
      showNotification('请先连接钱包', 'error');
      return;
    }

    if(parseFloat(stakeAmount.toString()) > parseFloat(balance!.formatted)) {
      showNotification('质押金额大于钱包余额', 'error');
      return;
    }

    try {
      setIsLoading(true); // 开始 loading
      
      const tx = await stakeContract.write.stake([], 
        { value: parseUnits(stakeAmount.toString(), 18) }
      )
      const result = await waitForTransactionReceipt(client, { hash: tx });

      if(result.status === "success") {
        setStakeAmount(0);
        showNotification('质押成功', 'success');
        
        // 等待一下让区块链状态更新，然后重新获取所有数据
        setTimeout(async () => {
          await refetchBalance();
        }, 2000);
      } else {
        showNotification('质押失败', 'error');
      }
    } catch (error) {
      showNotification('质押过程中发生错误', 'error');
    } finally {
      setIsLoading(false); // 结束 loading
    }
  };

  // 领取奖励处理函数
  const handleClaimReward = async () => {
    if (!stakeContract) {
      showNotification('请先连接钱包', 'error');
      return;
    }

    try {
      setIsLoading(true); // 开始 loading
      
      const tx = await stakeContract.write.claimReward();
      const result = await waitForTransactionReceipt(client, { hash: tx });

      if (result.status === "success") {
        showNotification('奖励领取成功', 'success');
        
        // 更新奖励金额
        setTimeout(async () => {
          if (stakeContract && address) {
            const newEarnedReward = await stakeContract.read.earned([address]);
            setRewardAmount(Number(newEarnedReward) / 1e18);
          }
        }, 2000);
      } else {
        showNotification('奖励领取失败', 'error');
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

  // 监听钱包连接状态变化
  useEffect(() => {
    setIsLoggedIn(isConnected);
    
    if (isConnected) {
      fetchUserData();
    }
  }, [isConnected, stakeContract, address]);

  useEffect(() => {
    fetchTotalData()
  }, [rewardContract])

  return (
    <div className={styles.container}>
      <Head>
        <title>WY Stake - 质押ETH赚取代币</title>
        <meta name="description" content="质押ETH赚取WY代币" />
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
          <div className={styles.logo}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L28 16L40 20L28 24L24 36L20 24L8 20L20 16L24 4Z" fill="#FF6B35"/>
            </svg>
          </div>
          <h1 className={styles.mainTitle}>WY Stake</h1>
          <p className={styles.subtitle}>🔥 质押ETH赚取代币 🔥</p>
        </div>

        {/* 关键指标卡片 */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 7V13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricValue}>{totalStaked.toFixed(4)} ETH</div>
            <div className={styles.metricLabel}>总质押量</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricValue}>0</div>
            <div className={styles.metricLabel}>总用户数</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 12V10H22V12H20ZM22 16V14H20V16H22ZM6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6C8.686 6 6 8.686 6 12ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.metricValue}>{totalRewards.toFixed(4)} WY</div>
            <div className={styles.metricLabel}>总奖励</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricValue}>12.5%</div>
            <div className={styles.metricLabel}>年化收益率</div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className={styles.contentGrid}>
          {/* 质押区域 */}
          <div className={styles.stakingCard}>
            <div className={styles.cardHeader}>
              <h2>您的质押金额</h2>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className={styles.stakedAmount}>{stakedAmount.toFixed(4)} ETH</div>
            <div className={styles.inputGroup}>
              <label>质押金额</label>
              <div className={styles.inputWrapper}>
                <input 
                  type="number" 
                  placeholder="0.0" 
                  min="0"
                  max={balance?.formatted ? parseFloat(balance.formatted).toFixed(4) : 0}
                  step="0.0001" 
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(parseFloat(e.target.value) || 0)}
                  className={styles.amountInput} 
                />
                <span className={styles.inputSuffix}>ETH</span>
              </div>
            </div>
            {/* 钱包余额显示 */}
            {isLoggedIn && balance && (
              <div className={styles.balanceInfo}>
                <span className={styles.balanceLabel}>钱包余额：</span>
                <span className={styles.balanceValue}>
                  {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                </span>
              </div>
            )}
            {isLoggedIn ? (
              <button 
                className={styles.stakeButton}
                disabled={stakeAmount <= 0}
                onClick={handleStake}
              >
                质押
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>

          {/* 奖励区域 */}
          <div className={styles.rewardsCard}>
            <div className={styles.cardHeader}>
              <h2>待领取奖励</h2>
              <div className={styles.cardIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V10H22V12H20ZM22 16V14H20V16H22ZM6 12C6 15.314 8.686 18 12 18C15.314 18 18 15.314 18 12C18 8.686 15.314 6 12 6C8.686 6 6 8.686 6 12ZM12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <div className={styles.rewardsAmount}>{rewardAmount.toFixed(4)} WY</div>
            
            <div className={styles.rewardsInfo}>
              <div className={styles.infoHeader}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>奖励机制说明</span>
              </div>
              <ul className={styles.infoList}>
                <li>奖励根据您的质押金额和时间累积</li>
                <li>您可以随时领取奖励</li>
                <li>奖励以WY代币形式发放</li>
              </ul>
            </div>
            
            {isLoggedIn ? (
              <button 
                className={styles.claimButton}
                disabled={rewardAmount <= 0}
                onClick={handleClaimReward}
              >
                领取奖励
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

export default Home;
