import React, { useRef } from 'react';
import { ModalForm, ProFormTextArea, ProFormDateTimePicker, ProFormText, ProFormSelect, ProFormGroup } from '@ant-design/pro-components';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { add_activity } from '@/services/api';

const AddForm: React.FC<{ visible: boolean; onVisibleChange: (visible: boolean) => void; }> = ({ visible, onVisibleChange }) => {
  const formRef = useRef<FormInstance>();

  return (
    <ModalForm
      title="添加活动"
      visible={visible}
      formRef={formRef}
      onVisibleChange={(newVisible) => {
        if (!newVisible) {
          // 关闭弹窗时重置表单
          formRef.current?.resetFields();
        }
        onVisibleChange(newVisible);
      }}
      onFinish={async (values) => {
        try {
          const response = await add_activity(values);
          if (response.code === 1000) {
            message.success('添加活动成功');
            onVisibleChange(false);
            return true;
          } else {
            message.error(response.message || '添加活动失败');
            return false;
          }
        } catch (error) {
          message.error('添加活动失败');
          return false;
        }
      }}
    >
      <ProFormText 
        name="activityId" 
        label="活动ID" 
        rules={[{ required: true, message: '请输入活动ID' }]}
      />
      <ProFormText 
        name="strategyId" 
        label="抽奖策略ID" 
        rules={[{ required: true, message: '请输入抽奖策略ID' }]}
      />
      <ProFormText 
        name="activityName" 
        label="活动名称" 
        rules={[{ required: true, message: '请输入活动名称' }]}
      />
      <ProFormTextArea 
        name="activityDesc" 
        label="活动描述" 
        rules={[{ required: true, message: '请输入活动描述' }]}
      />
      <ProFormGroup>
        <ProFormDateTimePicker 
          name="beginDateTime" 
          label="开始时间" 
          rules={[{ required: true, message: '请选择开始时间' }]}
        />
        <ProFormDateTimePicker 
          name="endDateTime" 
          label="结束时间" 
          rules={[
            { required: true, message: '请选择结束时间' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue('beginDateTime') || value > getFieldValue('beginDateTime')) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('结束时间必须大于开始时间'));
              },
            }),
          ]}
        />
      </ProFormGroup>
      <ProFormSelect
        name="state"
        label="活动状态"
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