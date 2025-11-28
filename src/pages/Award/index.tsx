import { delete_award, query_award } from '@/services/api';
import { ProDescriptions } from '@ant-design/pro-components';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import { PageContainer } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { App, Button, Drawer, Image, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddForm from './compoents/AddForm';
import UpdateForm from '@/pages/Award/compoents/UpdateForm';

const Award: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false); // 控制修改表单可见性
  const [currentRow, setCurrentRow] = useState<API.AwardItem>(); // 存储当前编辑行的数据
  const [showDetail, setShowDetail] = useState<boolean>(false); // 控制详情抽屉可见性
  const actionRef = useRef<ActionType>();
  const { message: msg } = App.useApp(); // 获取 Ant Design 的 message 实例
  // 添加窗口宽度状态
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDelete = async (record: { id: any }) => {
    try {
      const res = await delete_award(record);
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

  const columns: ProColumns<API.AwardItem>[] = [
    {
      title: '奖品ID',
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
      title: '唯一标识',
      dataIndex: 'awardKey',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '奖品配置',
      dataIndex: 'awardConfig',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '内容描述',
      dataIndex: 'awardDesc',
      valueType: 'textarea',
      ellipsis: false,
    },
    {
      title: '奖品图片',
      dataIndex: 'image',
      render: (_, record) => (
        <div>
          <Image
            src={record.image}
            width={windowWidth < 768 ? 50 : 70}
            height={windowWidth < 768 ? 50 : 70}
          />
        </div>
      ),
      ellipsis: false,
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      ellipsis: false,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      ellipsis: false,
    },
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
          title="确定删除该奖品吗？"
          onConfirm={() => handleDelete(record.id as any)}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const descriptionColumns: ProDescriptionsItemProps<API.AwardItem>[] = [
    {
      title: '奖品ID',
      dataIndex: 'id',
    },
    {
      title: '唯一标识',
      dataIndex: 'awardKey',
    },
    {
      title: '奖品配置',
      dataIndex: 'awardConfig',
    },
    {
      title: '内容描述',
      dataIndex: 'awardDesc',
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
    {
      title: '奖品图片',
      dataIndex: 'image',
      render: (_, record) => (
        <div>
          <Image
            src={record.image}
            width={windowWidth < 768 ? 50 : 70}
            height={windowWidth < 768 ? 50 : 70}
          />
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AwardItem, API.PageParams>
        headerTitle="奖品列表"
        actionRef={actionRef}
        rowKey="id"
        request={query_award}
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
            + 添加奖品
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
          <ProDescriptions<API.AwardItem>
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
                title="确定删除该奖品吗？"
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

export default Award;
