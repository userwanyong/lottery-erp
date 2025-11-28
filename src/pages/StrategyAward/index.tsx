import UpdateForm from '@/pages/StrategyAward/compoents/UpdateForm';
import { delete_strategy_award, query_strategy_award } from '@/services/api';
import { ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { App, Button, Drawer, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import AddForm from './compoents/AddForm';

const StrategyAward: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false); // 控制修改表单可见性
  const [currentRow, setCurrentRow] = useState<API.StrategyAwardItem>(); // 存储当前编辑行的数据
  const [showDetail, setShowDetail] = useState<boolean>(false); // 控制详情抽屉可见性
  const actionRef = useRef<ActionType>();
  const { message: msg } = App.useApp(); // 获取 Ant Design 的 message 实例

  const handleDelete = async (record: { id: any }) => {
    try {
      const res = await delete_strategy_award(record);
      if (res.code === 1000) {
        msg.success('删除成功');
        actionRef.current?.reload();
      } else {
        msg.error('删除失败');
      }
    } catch (error) {
      msg.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<API.StrategyAwardItem>[] = [
    {
      title: '策略奖品ID',
      dataIndex: 'id',
      width: 160,
      valueType: 'textarea',
      render: (dom, entity) => {
        return (
          <a
            style={{ color: '#0862ec' }}
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '策略ID',
      dataIndex: 'strategyId',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '奖品ID',
      dataIndex: 'awardId',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '奖品标题',
      dataIndex: 'awardTitle',
      valueType: 'textarea',
      ellipsis: false,
    },
    // {
    //   title: '奖品副标题',
    //   dataIndex: 'awardSubtitle',
    //   valueType: 'textarea',
    //   ellipsis: true,
    // },
    // {
    //   title: '总库存',
    //   dataIndex: 'awardCount',
    //   valueType: 'textarea',
    //   ellipsis: true,
    // },
    {
      title: '剩余库存',
      dataIndex: 'awardCountSurplus',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '中奖概率',
      dataIndex: 'awardRate',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '奖品规则ID',
      dataIndex: 'ruleTreeId',
      valueType: 'textarea',
      ellipsis: false,
    },
    // {
    //   title: '排序',
    //   dataIndex: 'sort',
    //   valueType: 'textarea',
    //   ellipsis: true,
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   valueType: 'dateTime',
    //   ellipsis: true,
    // },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   valueType: 'dateTime',
    //   ellipsis: true,
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除该策略奖品规则吗？"
          onConfirm={() => handleDelete(record.id as any)}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const descriptionColumns: ProDescriptionsItemProps<API.StrategyItem>[] = [
    {
      title: '策略奖品ID',
      dataIndex: 'id',
    },
    {
      title: '策略ID',
      dataIndex: 'strategyId',
    },
    {
      title: '奖品ID',
      dataIndex: 'awardId',
    },
    {
      title: '奖品标题',
      dataIndex: 'awardTitle',
    },
    {
      title: '奖品副标题',
      dataIndex: 'awardSubtitle',
    },
    {
      title: '总库存',
      dataIndex: 'awardCount',
    },
    {
      title: '剩余库存',
      dataIndex: 'awardCountSurplus',
    },
    {
      title: '中奖概率',
      dataIndex: 'awardRate',
    },
    {
      title: '奖品规则ID',
      dataIndex: 'ruleTreeId',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.StrategyAwardItem, API.PageParams>
        headerTitle="策略列表"
        actionRef={actionRef}
        rowKey="id"
        request={query_strategy_award}
        columns={columns}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            + 新建策略奖品
          </Button>,
        ]}
      />
      <AddForm
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        onFinish={() => actionRef.current?.reload()}
      />
      <UpdateForm
        visible={updateModalVisible}
        onVisibleChange={setUpdateModalVisible}
        onFinish={() => actionRef.current?.reload()}
        initialValues={currentRow || {}}
      />
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow && (
          <ProDescriptions<API.StrategyAwardItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={descriptionColumns}
            extra={[
              <a
                key="update"
                onClick={() => {
                  setUpdateModalVisible(true);
                  setShowDetail(false); // 关闭详情抽屉
                }}
              >
                修改
              </a>,
              <Popconfirm
                key="delete"
                title="确定删除该策略奖品吗？"
                onConfirm={() => {
                  handleDelete(currentRow?.id as any);
                  setShowDetail(false); // 关闭详情抽屉
                }}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>,
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default StrategyAward;
