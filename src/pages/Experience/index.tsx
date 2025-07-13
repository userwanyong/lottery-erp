import {
  calendarSignRebate,
  creditPayExchangeSku,
  draw,
  isCalendarSignRebate,
  query_activity,
  query_my_award_record,
  queryLotteryAwardList,
  querySkuProductListByActivityId,
  queryStrategyRuleWeight,
  queryUserActivityAccount,
  queryUserCreditAccount,
} from '@/services/api';
import { useModel } from '@umijs/max';
import { Button, Card, message, Pagination, Select, Tooltip } from 'antd';
import QueueAnim from 'rc-queue-anim'; // 引入 QueueAnim
import React, { useEffect, useState } from 'react';
import styles from './index.less';

const Experience: React.FC = () => {
  const apiHostUrl = 'ws://127.0.0.1:8091';
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [messageApi, contextHolder] = message.useMessage(); // 添加 useMessage 钩子
  const [activities, setActivities] = useState<API.ActivityItem[]>([]); // 活动列表
  const [selectedActivityId, setSelectedActivityId] = useState<string>(''); // 选中的活动ID
  const [awards, setAwards] = useState<API.LotteryAwardList[]>([]); // 奖品列表
  const [isRotating, setIsRotating] = useState(false); // 是否正在抽奖
  const [exchangingSkus, setExchangingSkus] = useState<Set<string>>(new Set()); // 正在兑换的SKU ID集合
  const [currentIndex, setCurrentIndex] = useState(0); // 当前选中的格子索引
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); // 定时器
  const [skus, setSkus] = useState<API.SkuProduct[]>(); // 用户抽奖次数账户信息
  const [activityAccount, setActivityAccount] = useState<API.UserActivityAccount>(); // 用户抽奖次数账户信息
  const [creditAccount, setCreditAccount] = useState<string>(); // 用户积分账户信息
  const [isSignedToday, setIsSignedToday] = useState(false); // 今日是否已经签到
  const [progressData, setProgressData] = useState<any[]>([]); // 存储进度数据
  const [refreshKey, setRefreshKey] = useState(0);
  const [awardRecords, setAwardRecords] = useState<API.UserAwardRecordItem[]>([]); // 历史抽奖记录
  const [currentPage, setCurrentPage] = useState<number>(1); // 当前页码
  const [pageSize, setPageSize] = useState<number>(5); // 每页记录数
  const [totalRecords, setTotalRecords] = useState<number>(0); // 总记录数
  const [broadcastMessages, setBroadcastMessages] = useState<{ id: number; message: string }[]>([]);

  // 查询历史抽奖记录
  const queryMyAwardRecord = async (page: number, size: number) => {
    if (!selectedActivityId || !currentUser?.userId) return;
    try {
      const response = await query_my_award_record(
        String(page),
        String(size),
        selectedActivityId,
        currentUser.userId,
      );
      if (response?.data?.items) {
        setAwardRecords(response.data.items);
        setTotalRecords(response.data.total || 0);
      }
    } catch (error) {
      messageApi.error('查询历史记录失败'); // 使用 messageApi.error
    }
  };

  // 查询今日是否已签到
  const checkSignStatus = async () => {
    try {
      const response = await isCalendarSignRebate({
        userId: currentUser?.userId,
        activityId: selectedActivityId,
      });
      setIsSignedToday(response.data);
    } catch (error) {
      messageApi.error('查询签到状态失败'); // 使用 messageApi.error
    }
  };

  // 查询用户抽奖次数账户
  const queryActivityAccount = async () => {
    try {
      const response = await queryUserActivityAccount({
        userId: currentUser?.userId,
        activityId: selectedActivityId,
      });
      setActivityAccount(response.data);
    } catch (error) {
      messageApi.error('查询用户抽奖账户失败'); // 使用 messageApi.error
    }
  };

  // 查询sku列表
  const querySkuProductList = async (activityId: string) => {
    try {
      const response = await querySkuProductListByActivityId(activityId);
      setSkus(response.data);
    } catch (error) {
      messageApi.error('查询查询sku列表失败'); // 使用 messageApi.error
    }
  };

  // 查询用户积分账户
  const queryCreditAccount = async () => {
    try {
      const response = await queryUserCreditAccount({
        userId: currentUser?.userId,
        activityId: selectedActivityId,
      });
      setCreditAccount(response.data);
    } catch (error) {
      messageApi.error('查询用户积分账户失败'); // 使用 messageApi.error
    }
  };
  // 兑换sku商品
  const paySku = async (id: string, skuCount: number) => {
    try {
      const response = await creditPayExchangeSku({
        userId: currentUser?.userId,
        activityId: selectedActivityId,
        sku: id,
      });
      if (response.code === 1000) {
        messageApi.success(`成功兑换${skuCount}次抽奖次数`); // 使用 messageApi.success
        // 等待0.7s在执行
        setTimeout(() => {
          setRefreshKey((prev) => prev + 1);
        }, 700);
      } else {
        messageApi.error(response.message); // 使用 messageApi.error
      }
    } catch (error) {
      messageApi.error('兑换失败'); // 使用 messageApi.error
    }
  };

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
      messageApi.error('获取抽奖进度数据异常'); // 使用 messageApi.error
    }
  };

  // 添加进度条组件
  const renderProgressBar = () => {
    if (!progressData.length) return null;

    const maxCount = Math.max(...progressData.map((item) => item.ruleWeightCount));
    const currentProgress = progressData[0]?.userActivityAccountTotalUseCount || 0;
    // 移除0节点，只保留权重节点
    const segments = progressData.map((item) => item.ruleWeightCount);

    return (
      <div style={{ marginTop: 24, maxHeight: '0px', maxWidth: '335px', margin: '24px auto' }}>
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
                width: `${((currentProgress % maxCount) / maxCount) * 100}%`,
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
                    <div>
                      区间：{index === 0 ? '0' : segments[index - 1]}-{segment}
                    </div>
                    <div>必中奖品：</div>
                    {currentSegmentData?.strategyAwards?.map(
                      (award: { awardId: string; awardTitle: string }) => (
                        <div key={award.awardId}>- {award.awardTitle}</div>
                      ),
                    )}
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
                      background: currentProgress % maxCount >= segment ? '#52c41a' : '#1890ff',
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
          <Tooltip title={`当前抽奖次数：${currentProgress % maxCount}`}>
            <div
              style={{
                position: 'absolute',
                left: `${((currentProgress % maxCount) / maxCount) * 100}%`,
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
      messageApi.error('获取活动列表失败'); // 使用 messageApi.error
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
      messageApi.error('获取奖品列表失败'); // 使用 messageApi.error
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (selectedActivityId) {
      fetchAwards(selectedActivityId);
      progressPercent(selectedActivityId);
      querySkuProductList(selectedActivityId);
      checkSignStatus();
      queryActivityAccount();
      queryCreditAccount();
      queryMyAwardRecord(currentPage, pageSize); // 初始加载时调用，带上分页参数
      // WebSocket 连接逻辑
      if (!currentUser?.userId) {
        return;
      }
      const ws = new WebSocket(
        `${apiHostUrl}/api/v1/ws/${currentUser?.userId + '-' + selectedActivityId}`,
      );

      ws.onopen = () => {};

      ws.onmessage = (event) => {
        const displayMessage = event.data;
        // 延迟2秒再加入队列
        setTimeout(() => {
          setBroadcastMessages((prevMessages) => {
            const newId =
              prevMessages.length > 0 ? Math.max(...prevMessages.map((msg) => msg.id)) + 1 : 1;
            const updatedMessages = [
              ...prevMessages,
              { id: newId, message: displayMessage }, // 新消息添加到数组末尾
            ].slice(-4); // 限制显示消息数量，例如最多显示4条

            // // 为每条消息设置一个定时器，60秒后移除
            // updatedMessages.forEach((msg) => {
            //   if (!(msg as any).timerId) {
            //     // 确保只设置一次定时器
            //     (msg as any).timerId = setTimeout(() => {
            //       setBroadcastMessages((currentMessages) =>
            //         currentMessages.filter((m) => m.id !== msg.id)
            //       );
            //     }, 60000); // 60秒后移除
            //   }
            // });

            return updatedMessages;
          });
        }, 2000); // 延迟2秒加入队列
      };

      ws.onclose = () => {
        // 可以添加重连逻辑
      };

      ws.onerror = (error) => {
        messageApi.error('WebSocket 连接错误');
      };

      // 组件卸载时关闭 WebSocket 连接
      return () => {
        ws.close();
      };
    } else {
      setAwards([]);
    }
  }, [selectedActivityId]);

  useEffect(() => {
    queryCreditAccount();
    queryActivityAccount();
  }, [refreshKey]);

  // 当页码或每页大小改变时重新查询
  useEffect(() => {
    queryMyAwardRecord(currentPage, pageSize);
  }, [currentPage, pageSize]);

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
        messageApi.error('获取奖品列表失败'); // 使用 messageApi.error
      }
    } else {
      setAwards([]);
    }
  };

  let tmp = 0;
  // 开始抽奖
  const startLottery = async () => {
    if (!selectedActivityId) {
      messageApi.error('请选择活动'); // 使用 messageApi.error
      return;
    }

    // 检查是否有未解锁的奖品
    const unlockedAwards = awards.filter((award) => Number(award.waitUnLockCount) <= 0);
    if (unlockedAwards.length === 0) {
      messageApi.error('暂无可用奖品，请先解锁奖品'); // 使用 messageApi.error
      return;
    }

    setIsRotating(true);
    tmp = 0;

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
        const currentAward = awards.find((award) => award.awardId === currentAwardId);
        if ((currentAward?.waitUnLockCount as any) > 0) {
          continue; // 跳过未解锁的奖品
        }
      } while (
        currentIdx === 4 ||
        (awards.find((award) => award.awardId === generatePrizeOrder(awards)[currentIdx])
          ?.waitUnLockCount as any) > 0
      );

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
          tmp = 1;
          messageApi.success(`恭喜获得：${result.data?.awardTitle}`); // 使用 messageApi.success
          // 重新获取奖品列表，更新解锁次数
          // 更新数据
          if (selectedActivityId) {
            fetchAwards(selectedActivityId);
            progressPercent(selectedActivityId);
            setRefreshKey((prev) => prev + 1);
            queryMyAwardRecord(currentPage, pageSize);
          }
        }, 2000);
      } else {
        messageApi.error(result.message); // 使用 messageApi.error
        setIsRotating(false);
        tmp = 1;
      }
    } catch (error) {
      messageApi.error('抽奖失败'); // 使用 messageApi.error
      setIsRotating(false);
      tmp = 1;
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
    // <div style={{margin:'auto',justifyContent:'center',color:"red"}}>
    <div className={styles.container}>
      {contextHolder} {/* 在组件的 return 语句中添加 contextHolder */}
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
      <div style={{ margin: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', maxHeight: '400px' }}>
          {/* 历史记录卡片 */}
          <div style={{ display: 'flex', marginRight: '20px', minWidth: '292px' }}>
            <Card
              title="中奖记录"
              // className={styles.historyCard}
              styles={{
                title: {
                  fontSize: 16,
                },
                header: {
                  padding: '0 24px',
                },
                body: {
                  padding: '0 24px',
                },
              }}
              style={{
                width: 300,
                height: 380,
                overflow: 'auto',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div className={styles.recordList}>
                {awardRecords.map((record, index) => (
                  <div
                    key={index}
                    className={styles.recordItem}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <img
                      src={record.image}
                      alt={record.awardTitle}
                      style={{ width: 35, height: 35, marginRight: 12 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div>{record.awardTitle}</div>
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {new Date(record.createTime as any).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Pagination
                  style={{
                    justifyContent: 'center',
                    marginTop: '-5px',
                  }}
                  simple={{
                    readOnly: true,
                  }}
                  size="small"
                  hideOnSinglePage={true}
                  showSizeChanger={false}
                  showQuickJumper={true}
                  current={currentPage}
                  pageSize={5}
                  total={totalRecords}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                  }}
                />
              </div>
            </Card>
          </div>
          {/* 九宫格and进度条 */}
          <div>
            {/* 九宫格 */}
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
                        {isRotating
                          ? '抽奖中...'
                          : `开始抽奖 (剩:${activityAccount?.dayCountSurplus || 0}次)`}
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
            {/* 进度条 */}
            {renderProgressBar()}
          </div>
          {/* 积分卡片 */}
          <div style={{ marginLeft: '20px', display: 'flex', minWidth: '292px' }}>
            <Card
              title={`积分兑换（可用积分: ${creditAccount === null ? 0.0 : creditAccount}）`}
              variant="outlined"
              // className={styles.historyCard}
              styles={{
                title: {
                  fontSize: 16,
                },
              }}
              style={{
                width: 300,
                height: 380,
                overflow: 'auto',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div className={styles.skuList}>
                {skus?.map((sku, index) => (
                  <div key={index} className={styles.skuItem}>
                    <span className={styles.skuInfo}>{sku.activityCount?.totalCount}次抽奖</span>
                    <span className={styles.skuInfo}>{sku.productAmount}积分</span>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        setExchangingSkus((prev) => new Set([...prev, sku.id as string]));
                        paySku(sku.id as string, sku.activityCount?.totalCount || 0).finally(() => {
                          setExchangingSkus((prev) => {
                            const next = new Set(prev);
                            next.delete(sku.id as string);
                            return next;
                          });
                        });
                      }}
                      disabled={exchangingSkus.has(sku.id as string)}
                    >
                      {exchangingSkus.has(sku.id as string) ? '兑换中' : '兑换'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', maxHeight: '400px' }}>
          {/* 签到卡片 */}
          <div style={{ marginRight: '20px', minWidth: '292px', display: 'flex' }}>
            <Card
              // className={styles.historyCard}
              title={`每日签到（${isSignedToday ? '已签到' : '未签到'}）`}
              variant="outlined"
              style={{
                marginTop: 0,
                maxWidth: '335px',
                minWidth: '292px',
                margin: '20px auto',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  onClick={async () => {
                    try {
                      const response = await calendarSignRebate({
                        userId: currentUser?.userId,
                        activityId: selectedActivityId,
                      });
                      if (response.code === 1000) {
                        messageApi.success('签到成功'); // 使用 messageApi.success
                        checkSignStatus();
                        // 等待0.7s在执行
                        setTimeout(() => {
                          setRefreshKey((prev) => prev + 1);
                        }, 700);
                      } else if (response.code === 1005) {
                        messageApi.success('今日已签到'); // 使用 messageApi.success
                      } else {
                        messageApi.error(response.message); // 使用 messageApi.error
                      }
                    } catch (error) {
                      messageApi.error('签到失败'); // 使用 messageApi.error
                    }
                  }}
                  disabled={isSignedToday}
                >
                  {isSignedToday ? '今日已签到' : '立即签到'}
                </Button>
              </div>
            </Card>
          </div>
          {/* 中奖广播卡片 */}
          <div>
            <Card
              title="实时中奖广播"
              // className={styles.historyCard}
              styles={{
                title: {
                  fontSize: 16,
                },
                header: {
                  padding: '0 118px',
                },
                body: {
                  padding: '0 24px',
                  fontSize: 13,
                },
              }}
              style={{
                width: 334,
                height: 240,
                overflow: 'hidden', // 隐藏溢出内容，配合动画
                cursor: 'pointer',
                userSelect: 'none',
                margin: '20px auto',
              }}
            >
              <div className={styles.recordList}>
                <QueueAnim
                  duration={700} // 动画持续时间
                  interval={10} // 元素之间动画间隔
                  animConfig={[
                    { opacity: [1, 0], translateY: [0, 50] }, // 进入动画
                    { opacity: [1, 0], translateX: [0, 100] }, // 离开动画
                  ]}
                >
                  {broadcastMessages.map((msg) => (
                    <div
                      key={msg.id} // 使用消息的唯一 key
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 0',
                      }}
                      className="broadcast-item"
                      dangerouslySetInnerHTML={{ __html: `🎉${msg.message}` }} // 使用 dangerouslySetInnerHTML 渲染 HTML
                    >
                      {/* <span role="img" aria-label="confetti" style={{ marginRight: 8 }}>🎉</span>
                    <div style={{ flex: 1 }}>{msg.message}</div> */}
                    </div>
                  ))}
                </QueueAnim>
              </div>
            </Card>
          </div>
          {/* 占位卡片 */}
          <div style={{ marginLeft: '20px', minWidth: '292px', display: 'flex' }}>
            <Card
              // className={styles.historyCard}
              title={`占位`}
              variant="outlined"
              style={{
                marginTop: 0,
                maxWidth: '335px',
                minWidth: '292px',
                margin: '20px auto',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div style={{ textAlign: 'center' }}></div>
            </Card>
          </div>
        </div>
      </div>
      {/*</div>*/}
    </div>
  );
};

export default Experience;
