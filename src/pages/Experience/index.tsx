import { draw, query_activity, queryLotteryAwardList,queryStrategyRuleWeight } from '@/services/api';
import { useModel } from '@umijs/max';
import { message, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const Experience: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;

  const [activities, setActivities] = useState<API.ActivityItem[]>([]); // 活动列表
  const [selectedActivityId, setSelectedActivityId] = useState<string>(''); // 选中的活动ID
  const [awards, setAwards] = useState<API.LotteryAwardList[]>([]); // 奖品列表
  const [isRotating, setIsRotating] = useState(false); // 是否正在抽奖
  const [currentIndex, setCurrentIndex] = useState(0); // 当前选中的格子索引
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); // 定时器
  
  // 获取抽奖进度数据
  const [progressData, setProgressData] = useState<any[]>([]); // 存储进度数据

  // 修改获取抽奖进度数据的函数
  const progressPercent = async (activityId: string) => {
    if (!activityId || !currentUser?.userId) {
      return;
    }

    try {
      const response = await queryStrategyRuleWeight({
        activityId,
        userId: currentUser.userId,
      });
      setProgressData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      message.error('获取抽奖进度数据异常');
    }
  };

  // 添加进度条组件
  const renderProgressBar = () => {
    if (!progressData.length) return null;

    const maxCount = Math.max(...progressData.map(item => item.ruleWeightCount));
    const currentProgress = progressData[0]?.userActivityAccountTotalUseCount || 0;
    // 移除0节点，只保留权重节点
    const segments = progressData.map(item => item.ruleWeightCount);

    return (
      <div style={{ marginTop: 24, padding: '0 10%', maxWidth: '650px', margin: '24px auto' }}>
        <div style={{ position: 'relative', marginBottom: 60 }}>
          {/* 进度条背景 */}
          <div
            style={{
              height: '15px',
              backgroundColor: '#f0f0f0',
              borderRadius: '6px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 进度条前景 */}
            <div
              style={{
                height: '100%',
                width: `${(currentProgress%maxCount / maxCount) * 100}%`,
                background: 'linear-gradient(90deg, #1890ff 0%, #52c41a 100%)',
                borderRadius: '6px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* 节点标记 */}
          {segments.map((segment, index) => {
            const position = (segment / maxCount) * 100;
            const currentSegmentData = progressData[index];
            
            return (
              <Tooltip
                key={segment}
                title={
                  <div>
                    <div>区间：{index === 0 ? '0' : segments[index - 1]}-{segment}</div>
                    <div>必中奖品：</div>
                    {currentSegmentData?.strategyAwards?.map((award: {awardId: string; awardTitle: string}) => (
                      <div key={award.awardId}>- {award.awardTitle}</div>
                    ))}
                  </div>
                }
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${position}%`,
                    top: '0px',
                    transform: 'translateX(-50%)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      background: currentProgress%maxCount >= segment ? '#52c41a' : '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    ?
                  </div>
                  <div style={{ marginTop: 1, fontSize: 9, color: '#666' }}>{segment}</div>
                </div>
              </Tooltip>
            );
          })}

          {/* 当前抽奖次数标识 */}
          <Tooltip title={`当前抽奖次数：${currentProgress%maxCount}`}>
            <div
              style={{
                position: 'absolute',
                left: `${(currentProgress%maxCount / maxCount) * 100}%`,
                top: '0px',
                cursor: 'pointer',
                transform: 'translateX(-50%)',
              }}
            >
              <div
                style={{
                  width: '15px',
                  height: '15px',
                  borderRadius: '50%',
                  background: '#f5222d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                ⭐
              </div>
              <div style={{ marginTop: 2, fontSize: 0, color: '#666', whiteSpace: 'nowrap' }}>
                {currentProgress}
              </div>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };

  // 获取活动列表
  const fetchActivities = async () => {
    try {
      const response = await query_activity();
      if (response?.data) {
        setActivities(response.data);
      }
    } catch (error) {
      message.error('获取活动列表失败');
    }
  };

  // 根据sort值排序奖品，并生成位置映射
  const generatePrizeOrder = (awards: API.LotteryAwardList[]) => {
    // 复制一份奖品数组并按sort排序
    const sortedAwards = [...awards].sort(
      (a, b) => ((a.sort as any) || 0) - ((b.sort as any) || 0),
    );


    // 九宫格位置顺序：0,1,2,3,null,4,5,6,7
    const positions = [0, 1, 2, 3, null, 4, 5, 6, 7];

    // 创建位置到奖品的映射
    return positions.map((pos) => {
      if (pos === null) return null;
      return sortedAwards[pos]?.awardId || -1;
    });
  };

  // 获取奖品列表
  const fetchAwards = async (activityId: string) => {
    if (!activityId || !currentUser?.userId) {
      return;
    }

    try {
      const response = await queryLotteryAwardList({
        activityId,
        userId: currentUser.userId,
      });
      if (response && Array.isArray(response.data)) {
        const fullAwards = [...response.data];
        setAwards(fullAwards);
      }
    } catch (error) {
      message.error('获取奖品列表失败');
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (selectedActivityId) {
      fetchAwards(selectedActivityId);
      progressPercent(selectedActivityId);
    } else {
      setAwards([]);
    }
  }, [selectedActivityId]);

  // 活动选择变化
  const handleActivityChange = async (value: string) => {
    setSelectedActivityId(value);
    if (value && currentUser?.userId) {
      try {
        const response = await queryLotteryAwardList({
          activityId: value,
          userId: currentUser.userId,
        });
        if (response && Array.isArray(response.data)) {
          // 确保有8个奖品，不足则补充
          const fullAwards = [...response.data];
          while (fullAwards.length < 8) {
            fullAwards.push({
              awardId: `empty-${fullAwards.length}`,
              awardTitle: '谢谢参与',
              image: 'https://img.alicdn.com/tfs/TB1HHs3n7P2gK0jSZPxXXacQpXa-65-65.png',
            });
          }
          setAwards(fullAwards);
        }
      } catch (error) {
        message.error('获取奖品列表失败');
      }
    } else {
      setAwards([]);
    }
  };

  let tmp=0;
  // 开始抽奖
  const startLottery = async () => {
    if (!selectedActivityId) {
      message.error('请选择活动');
      return;
    }

    // 检查是否有未解锁的奖品
    const unlockedAwards = awards.filter(award => Number(award.waitUnLockCount)<=0);
    if (unlockedAwards.length === 0) {
      message.error('暂无可用奖品，请先解锁奖品');
      return;
    }

    setIsRotating(true);
    tmp=0;
    
    // 重置起始位置为0
    setCurrentIndex(0);
    let currentIdx = 0;

    const rotate = () => {
       // 如果已经停止旋转，直接返回
       if (tmp) {
        if (timer) {
          clearTimeout(timer);
        }
        return;
      }
     
      do {
        currentIdx = (currentIdx + 1) % 9;
        
        // 检查当前位置是否对应未解锁奖品
        const currentAwardId = generatePrizeOrder(awards)[currentIdx];
        if (currentAwardId === null) {
          continue; // 跳过中间格子
        }
        const currentAward = awards.find(award => award.awardId === currentAwardId);
        if (currentAward?.waitUnLockCount as any >0) {
          continue; // 跳过未解锁的奖品
        }
      } while (currentIdx === 4 || awards.find(award => award.awardId === generatePrizeOrder(awards)[currentIdx])?.waitUnLockCount as any>0);
      
      setCurrentIndex(currentIdx);
      // 控制动画速度
      const speed = 50;
      const newTimer = setTimeout(rotate, speed);
      setTimer(newTimer);
    };

    // 立即开始动画
    rotate();

    try {
      // 同时发送抽奖请求
      const result = await draw({
        activityId: selectedActivityId,
        userId: currentUser?.userId,
      });
      const prizeOrder = generatePrizeOrder(awards);

      if (result?.code === 1000) {
        // 找到中奖位置
        const targetIndex = prizeOrder.indexOf(String(result.data?.awardId));
        // 停在中奖位置
        setCurrentIndex(targetIndex);
        // 2秒后显示中奖信息
        setTimeout(() => {
          setIsRotating(false);
          tmp=1;
          message.success(`恭喜获得：${result.data?.awardTitle}`);
          // 重新获取奖品列表，更新解锁次数
          // 更新进度数据
          if (selectedActivityId) {
            fetchAwards(selectedActivityId);
            progressPercent(selectedActivityId);
          }
        }, 2000);
      } else {
        message.error(result.message);
        setIsRotating(false);
        tmp=1;
      }
    } catch (error) {
      message.error('抽奖失败');
      setIsRotating(false);
      tmp=1;
    }
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.selectWrapper}>
          <Select
            placeholder="请选择活动"
            style={{ width: 200 }}
            onChange={handleActivityChange}
            value={selectedActivityId || undefined}
            options={activities.map((activity) => ({
              label: `${activity.activityName}(${activity.id})`,
              value: activity.id,
            }))}
          />
        </div>
        {selectedActivityId && currentUser?.userId && (
          <div className={styles.infoWrapper}>
            <span className={styles.infoItem}>
              <span className={styles.label}>活动ID：</span>
              <span className={styles.value}>{selectedActivityId}</span>
            </span>
            <span className={styles.infoItem}>
              <span className={styles.label}>用户ID：</span>
              <span className={styles.value}>{currentUser.userId}</span>
            </span>
          </div>
        )}
      </div>
      <div className={styles.lotteryBox}>
        {generatePrizeOrder(awards).map((awardId, index) => {
          // 中间格子显示按钮
          if (awardId === null) {
            return (
              <div key={index} className={styles.prizeItem}>
                <button
                  type="button"
                  className={styles.startBtn}
                  onClick={startLottery}
                  disabled={isRotating || !selectedActivityId}
                >
                  {isRotating ? '抽奖中...' : '开始抽奖'}
                </button>
              </div>
            );
          }

          // 其他格子显示奖品
          const award = awards.find((a) => a.awardId === awardId);
          return (
            <div
              key={index}
              className={`${styles.prizeItem} ${
                currentIndex === index && isRotating ? styles.active : ''
              }`}
            >
              {award && (
                <>
                  <div className={styles.prizeContent}>
                    <img src={award.image} alt={award.awardTitle} />
                    <p>{award.awardTitle}</p>
                    {(award.waitUnLockCount as any) > 0 && (
                      <div className={styles.lockOverlay}>
                        <span className={styles.lockIcon}>🔒</span>
                        <p className={styles.lockText}>抽奖{award.waitUnLockCount}次后解锁</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {/* 添加进度条 */}
      {renderProgressBar()}
    </div>
  );
};

export default Experience;
