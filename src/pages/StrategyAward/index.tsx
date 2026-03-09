import AddForm from '@/pages/StrategyAward/compoents/AddForm';
import UpdateForm from '@/pages/StrategyAward/compoents/UpdateForm';
import { delete_strategy_award, query_strategy_award } from '@/services/api';
import { ClusterOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer, ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import {
  App,
  Button,
  Card,
  Col,
  Collapse,
  Drawer,
  Empty,
  Popconfirm,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'umi';
import styles from './index.less';

type GroupedStrategyAward = {
  strategyId: string;
  items: API.StrategyAwardItem[];
};

const formatRatePercent = (value?: string) => {
  if (!value) return '--';
  const rate = Number(value);
  if (Number.isNaN(rate)) return value;
  const percent = rate * 100;
  return `${Number.isInteger(percent) ? percent.toFixed(0) : percent.toFixed(2)}%`;
};

const StrategyAward: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<API.StrategyAwardItem>();
  const [showDetail, setShowDetail] = useState(false);
  const [awards, setAwards] = useState<API.StrategyAwardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [createInitialValues, setCreateInitialValues] = useState<Partial<API.StrategyAwardItem>>(
    {},
  );
  const location = useLocation();
  const { message } = App.useApp();

  const loadStrategyAwards = async () => {
    setLoading(true);
    try {
      const res = await query_strategy_award();
      setAwards(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      message.error('获取策略奖品列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStrategyAwards();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await delete_strategy_award(id);
      if (res.code === 1000) {
        message.success('删除成功');
        if (currentRow?.id === id) {
          setCurrentRow(undefined);
          setShowDetail(false);
        }
        await loadStrategyAwards();
      } else {
        message.error(res.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const groupedAwards = useMemo<GroupedStrategyAward[]>(() => {
    const grouped = awards.reduce<Record<string, API.StrategyAwardItem[]>>((acc, item) => {
      const key = String(item.strategyId || '未分组策略');
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([strategyId, items]) => ({
        strategyId,
        items: [...items].sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0)),
      }));
  }, [awards]);

  const allGroupKeys = useMemo(
    () => groupedAwards.map((item) => item.strategyId),
    [groupedAwards],
  );

  const targetStrategyId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const value = params.get('strategyId');
    return value ? String(value) : '';
  }, [location.search]);

  const isAllExpanded =
    allGroupKeys.length > 0 && allGroupKeys.every((key) => activeKeys.includes(key));

  useEffect(() => {
    if (targetStrategyId && allGroupKeys.includes(targetStrategyId)) {
      setActiveKeys([targetStrategyId]);
      return;
    }
    setActiveKeys([]);
  }, [allGroupKeys, targetStrategyId]);

  const openCreateModal = (strategyId?: string) => {
    setCreateInitialValues(strategyId ? { strategyId } : {});
    setModalVisible(true);
  };

  const descriptionColumns: ProDescriptionsItemProps<API.StrategyAwardItem>[] = [
    { title: '策略奖品ID', dataIndex: 'id' },
    { title: '策略ID', dataIndex: 'strategyId' },
    { title: '奖品ID', dataIndex: 'awardId' },
    { title: '奖品标题', dataIndex: 'awardTitle' },
    { title: '奖品副标题', dataIndex: 'awardSubtitle' },
    { title: '总库存', dataIndex: 'awardCount' },
    { title: '剩余库存', dataIndex: 'awardCountSurplus' },
    { title: '中奖概率', dataIndex: 'awardRate' },
    { title: '奖品规则ID', dataIndex: 'ruleTreeId' },
    { title: '排序', dataIndex: 'sort' },
    { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime' },
    { title: '更新时间', dataIndex: 'updateTime', valueType: 'dateTime' },
  ];

  return (
    <PageContainer header={{ title: false, breadcrumb: undefined }}>
      <Card
        bordered={false}
        className={styles.pageCard}
        title="策略奖品列表"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadStrategyAwards}>
              刷新全部
            </Button>
            <Button onClick={() => setActiveKeys(isAllExpanded ? [] : allGroupKeys)}>
              {isAllExpanded ? '一键收起全部' : '一键展开全部'}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateModal()}>
              新建策略奖品
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          {groupedAwards.length === 0 ? (
            <Empty description="暂无策略奖品配置" />
          ) : (
            <Collapse
              className={styles.groupCollapse}
              activeKey={activeKeys}
              onChange={(keys) =>
                setActiveKeys(
                  Array.isArray(keys)
                    ? keys.map(String)
                    : keys
                      ? [String(keys)]
                      : [],
                )
              }
              items={groupedAwards.map((group) => ({
                key: group.strategyId,
                label: (
                  <div className={styles.groupHeader}>
                    <Space size={12}>
                      <ClusterOutlined />
                      <Typography.Text strong>策略ID：{group.strategyId}</Typography.Text>
                    </Space>
                    <div className={styles.groupHeaderRight}>
                      <div
                        className={styles.groupHeaderActions}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button size="small" icon={<ReloadOutlined />} onClick={loadStrategyAwards}>
                          刷新
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => openCreateModal(group.strategyId)}
                        >
                          新建奖品
                        </Button>
                      </div>
                      <Tag color="blue">{group.items.length} 条配置</Tag>
                    </div>
                  </div>
                ),
                children: (
                  <Row gutter={[16, 16]}>
                    {group.items.map((item) => (
                      <Col xs={24} md={12} xl={8} key={item.id}>
                        <Card
                          hoverable
                          bordered={false}
                          className={styles.awardCard}
                          title={
                            <Space size={10}>
                              <Typography.Text ellipsis className={styles.cardTitle}>
                                {item.awardTitle || item.awardId || '未命名奖品'}
                              </Typography.Text>
                              <Tag color="processing">排序 {item.sort || '--'}</Tag>
                            </Space>
                          }
                          extra={
                            <Space size={4}>
                              <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                  setCurrentRow(item);
                                  setShowDetail(true);
                                }}
                              >
                                详情
                              </Button>
                              <Button
                                size="small"
                                type="link"
                                onClick={() => {
                                  setCurrentRow(item);
                                  setUpdateModalVisible(true);
                                }}
                              >
                                修改
                              </Button>
                              <Popconfirm
                                title="确定删除这条策略奖品吗？"
                                onConfirm={() => handleDelete(String(item.id || ''))}
                                okText="确定"
                                cancelText="取消"
                              >
                                <Button type="link" size="small" danger>
                                  删除
                                </Button>
                              </Popconfirm>
                            </Space>
                          }
                        >
                          <div className={styles.metaRow}>
                            <div className={`${styles.metaChip} ${styles.primaryChip}`}>
                              <span className={styles.infoLabel}>概率</span>
                              <span className={styles.infoValue}>
                                {formatRatePercent(item.awardRate)}
                              </span>
                            </div>
                            <div className={`${styles.metaChip} ${styles.warningChip}`}>
                              <span className={styles.infoLabel}>剩余库存</span>
                              <span className={styles.infoValue}>
                                {item.awardCountSurplus || '--'}
                              </span>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
              }))}
            />
          )}
        </Spin>
      </Card>

      <AddForm
        visible={modalVisible}
        initialValues={createInitialValues}
        onVisibleChange={(visible) => {
          setModalVisible(visible);
          if (!visible) {
            setCreateInitialValues({});
          }
        }}
        onFinish={() => loadStrategyAwards()}
      />

      <UpdateForm
        visible={updateModalVisible}
        onVisibleChange={setUpdateModalVisible}
        onFinish={() => loadStrategyAwards()}
        initialValues={currentRow || {}}
      />

      <Drawer
        width={640}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable
      >
        {currentRow && (
          <ProDescriptions<API.StrategyAwardItem>
            column={2}
            title={currentRow.id}
            request={async () => ({
              data: currentRow,
            })}
            params={{ id: currentRow.id }}
            columns={descriptionColumns}
            extra={[
              <Button
                key="update"
                type="link"
                style={{ paddingInline: 0 }}
                onClick={() => {
                  setUpdateModalVisible(true);
                  setShowDetail(false);
                }}
              >
                修改
              </Button>,
              <Popconfirm
                key="delete"
                title="确定删除这条策略奖品吗？"
                onConfirm={() => {
                  handleDelete(String(currentRow.id || ''));
                  setShowDetail(false);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger style={{ paddingInline: 0 }}>
                  删除
                </Button>
              </Popconfirm>,
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default StrategyAward;
