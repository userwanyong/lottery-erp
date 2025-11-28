import { armory_activity, delete_activity, query_activity } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { App, Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';
import AddForm from './compoents/AddForm';
import UpdateForm from './compoents/UpdateForm';
import { Drawer } from 'antd';
import { ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

const Activity: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false); // 控制修改表单可见性
  const [currentRow, setCurrentRow] = useState<API.ActivityItem>(); // 存储当前编辑行的数据
  const [showDetail, setShowDetail] = useState<boolean>(false); // 控制详情抽屉可见性
  const actionRef = useRef<ActionType>();
  const { message: msg } = App.useApp(); // 获取 Ant Design 的 message 实例
  const [loadingArmory, setLoadingArmory] = useState<Record<number, boolean>>({});

  const handleDelete = async (record: { id: any }) => {
    try {
      const res = await delete_activity(record);
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

  const handleArmory = async (activityId: number) => {
    try {
      const res = await armory_activity(activityId);
      if (res.code === 1000) {
        msg.success('预热成功');
      } else {
        msg.error(res.message || '预热失败');
      }
    } catch (error) {
      msg.error('预热失败');
      console.error('Armory API call failed:', error);
    }
  };

  const columns: ProColumns<API.ActivityItem>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
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
      title: '活动名称',
      dataIndex: 'activityName',
      valueType: 'textarea',
    },
    {
      title: '活动描述',
      dataIndex: 'activityDesc',
      valueType: 'textarea',
    },
    {
      title: '开始时间',
      dataIndex: 'beginDateTime',
      valueType: 'dateTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endDateTime',
      valueType: 'dateTime',
    },
    {
      title: '抽奖策略ID',
      dataIndex: 'strategyId',
      valueType: 'textarea',
    },
    {
      title: '活动状态',
      dataIndex: 'state',
      valueEnum: {
        open: {
          text: '开启',
          status: 'Success',
        },
        close: {
          text: '结束',
          status: 'Default',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   valueType: 'dateTime',
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="armory"
          // type="link"
          size={'small'}
          disabled={!!loadingArmory[record.id as any]}
          onClick={() => {
            if (!loadingArmory[record.id as any]) {
              setLoadingArmory((prev) => ({ ...prev, [record.id as any]: true }));
              handleArmory(record.id as any).finally(() => {
                setLoadingArmory((prev) => ({ ...prev, [record.id as any]: false }));
              });
            }
          }}
        >
          {loadingArmory[record.id as any] ? '预热中...' : '预热'}
        </Button>,
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
          title="确定删除该活动吗？"
          onConfirm={() => handleDelete(record.id as any)}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const descriptionColumns: ProDescriptionsItemProps<API.ActivityItem>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
    },
    {
      title: '活动描述',
      dataIndex: 'activityDesc',
    },
    {
      title: '开始时间',
      dataIndex: 'beginDateTime',
      valueType: 'dateTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endDateTime',
      valueType: 'dateTime',
    },
    {
      title: '抽奖策略ID',
      dataIndex: 'strategyId',
    },
    {
      title: '活动状态',
      dataIndex: 'state',
      valueEnum: {
        open: {
          text: '开启',
          status: 'Success',
        },
        close: {
          text: '结束',
          status: 'Default',
        },
      },
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
      <ProTable<API.ActivityItem, API.PageParams>
        rowKey="id"
        request={query_activity}
        columns={columns}
        scroll={{ x: 'max-content' }}
        toolbar={{}}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => setModalVisible(true)}>
            + 新建活动
          </Button>,
        ]}
      />
      <AddForm
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        onFinish={async () => {
          setModalVisible(false);
          actionRef.current?.reload();
        }}
      />
      {currentRow && (
        <UpdateForm
          visible={updateModalVisible}
          onVisibleChange={setUpdateModalVisible}
          initialValues={currentRow}
          onFinish={async () => {
            setUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }}
        />
      )}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={true}
      >
        {currentRow && (
          <ProDescriptions<API.ActivityItem>
            column={2}
            title={`活动ID: ${currentRow?.id}`}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={descriptionColumns}
            extra={[
              <Button
                key="armory"
                // type="link"
                size={'small'}
                onClick={() => {
                  if (!loadingArmory[currentRow?.id as any]) {
                    setLoadingArmory((prev) => ({ ...prev, [currentRow?.id as any]: true }));
                    handleArmory(currentRow?.id as any).finally(() => {
                      setLoadingArmory((prev) => ({ ...prev, [currentRow?.id as any]: false }));
                      setShowDetail(false);
                    });
                  }
                }}
                disabled={!!loadingArmory[currentRow?.id as any]}
              >
                {loadingArmory[currentRow?.id as any] ? '预热中...' : '预热'}
              </Button>,
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
                title="确定删除该活动吗？"
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

export default Activity;
