import {
  add_activity_sku,
  add_behavior_rebate,
  query_activity,
  query_activity_count,
  query_activity_sku
} from '@/services/api';
import { ModalForm, ProFormInstance, ProFormSelect, ProFormText, ProFormDependency } from '@ant-design/pro-form'; // 导入 ProFormDependency
import { App } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import {ProFormTextArea} from "@ant-design/pro-components";

interface AddFormProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish?: () => void;
}

const AddForm: React.FC<AddFormProps> = (props) => {
  const { visible, onVisibleChange, onFinish } = props;
  const { message } = App.useApp();
  const formRef = useRef<ProFormInstance>();

  const [activityList, setActivityList] = useState<API.ActivityItem[]>([]);
  const [activitySkuList, setActivitySkuList] = useState<API.ActivitySkuItem[]>([]);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const activityRes = await query_activity();
        if (activityRes && activityRes.data) {
          setActivityList(activityRes.data);
        }
      } catch (error) {
        message.error('获取活动列表失败');
      }
    };

    const fetchActivitySkuData = async () => {
      try {
        const activitySkuRes = await query_activity_sku();
        if (activitySkuRes && activitySkuRes.data) {
          setActivitySkuList(activitySkuRes.data);
        }
      } catch (error) {
        message.error('获取活动sku配置列表失败');
      }
    };

    if (visible) {
      fetchActivityData();
      fetchActivitySkuData();
    }
  }, [visible]);

  return (
    <ModalForm
      title="新建返利配置"
      visible={visible}
      formRef={formRef}
      onVisibleChange={(v) => {
        if (!v) {
          formRef.current?.resetFields();
        }
        onVisibleChange(v);
      }}
      onFinish={async (values) => {
        const result = await add_behavior_rebate(values);
        if (result.code === 1000) {
          message.success('添加成功');
          if (onFinish) {
            onFinish();
          }
          return true;
        }
        message.error(result.message);
        return false;
      }}
    >
      <ProFormSelect
        name="activityId"
        label="活动ID"
        rules={[{ required: true, message: '请选择活动ID' }]}
        options={[
          ...activityList.map((item) => ({
            label: `${item.id} (${item.activityName})`,
            value: item.id,
          })),
          { label: '去新建+', value: '__NEW_ACTIVITY__' },
        ]}
        showSearch
        fieldProps={{
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          onChange: (value) => {
            if (value === '__NEW_ACTIVITY__') {
              history.push('/admin/activity');
              // formRef.current?.setFieldsValue({ activityCountId: undefined }); // 移除此行，因为这里是activityId
            }
          },
        }}
      />

      {/* 移除原有的 rebateConfig ProFormSelect 和 ProFormText */}
      {/* <ProFormSelect
        name="rebateConfig"
        label="返利配置"
        rules={[{ required: true, message: '请选择返利配置' }]}
        options={[
          ...activitySkuList.map((item) => ({
            label: `${item.id}`,
            value: item.id,
          })),
          { label: '去新建+', value: '__NEW_ACTIVITY_SKU__' }, // 添加新建选项
        ]}
        showSearch
        fieldProps={{
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          onChange: (value) => {
            if (value === '__NEW_ACTIVITY_SKU__') {
              history.push('/admin/activity_sku');
              // formRef.current?.setFieldsValue({ activityCountId: undefined });
            }
          },
        }}
      /> */}

      <ProFormSelect
        name="behaviorType"
        label="行为类型"
        rules={[{ required: true, message: '请选择行为类型' }]}
        options={[
          { label: '签到', value: 'sign' },
          { label: '支付', value: 'openai_pay' },
          { label: '活动赠送', value: 'activity_gift' },
        ]}
      />
      <ProFormTextArea
        name="rebateDesc"
        label="返利描述"
        rules={[{ required: true, message: '请输入返利描述' }]}
      />
      <ProFormSelect
        name="rebateType"
        label="返利类型"
        rules={[{ required: true, message: '请选择返利类型' }]}
        options={[
          { label: '抽奖次数-兑换/签到', value: 'sku' },
          { label: '积分-签到', value: 'integral' },
          { label: '抽奖次数-活动赠送', value: 'gift' },
        ]}
        fieldProps={{
          onChange: () => {
            // 当返利类型改变时，清空返利配置的值
            formRef.current?.setFieldsValue({ rebateConfig: undefined });
          },
        }}
      />

      {/* 根据 rebateType 动态渲染 rebateConfig 字段 */}
      <ProFormDependency name={['rebateType']}>
        {({ rebateType }) => {
          if (rebateType === 'sku') {
            return (
              <ProFormSelect
                name="rebateConfig"
                label="返利配置"
                rules={[{ required: true, message: '请选择返利配置' }]}
                options={[
                  ...activitySkuList.map((item) => ({
                    label: `${item.id}`,
                    value: item.id,
                  })),
                  { label: '去新建+', value: '__NEW_ACTIVITY_SKU__' }, // 添加新建选项
                ]}
                showSearch
                fieldProps={{
                  filterOption: (input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
                  onChange: (value) => {
                    if (value === '__NEW_ACTIVITY_SKU__') {
                      history.push('/rebate/activity_sku');
                      // 清空当前选择，避免表单字段被设置为特殊值
                      formRef.current?.setFieldsValue({ rebateConfig: undefined });
                    }
                  },
                }}
              />
            );
          } else if (rebateType === 'integral') {
            return (
              <ProFormText
                name="rebateConfig"
                label="返利配置"
                rules={[{ required: true, message: '请输入返利配置' }]}
              />
            );
          }else if (rebateType === 'gift'){
            return (
              <ProFormText
                name="rebateConfig"
                label="返利配置"
                rules={[{ required: true, message: '请输入返利配置' }]}
              />
            );
          }
          // 默认情况下，当 rebateType 未选择时，禁用 rebateConfig
          return (
            <ProFormText
              name="rebateConfig"
              label="返利配置"
              disabled
              placeholder="请先选择返利类型"
            />
          );
        }}
      </ProFormDependency>

      <ProFormSelect
        name="state"
        label="状态"
        rules={[{ required: true, message: '请选择活动状态' }]}
        options={[
          { label: '开启', value: 'open' },
          { label: '关闭', value: 'close' },
        ]}
      />
    </ModalForm>
  );
};

export default AddForm;
