import { add_rule } from '@/services/api';
import { ProFormTextArea } from '@ant-design/pro-components'; // 引入 useRef
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { App } from 'antd'; // 引入 App 组件
import React, { useRef } from 'react';

interface AddFormProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish?: () => void;
}

const AddForm: React.FC<AddFormProps> = (props) => {
  const { visible, onVisibleChange, onFinish } = props;
  const { message } = App.useApp(); // 获取 message 实例
  const formRef = useRef<ProFormInstance>(); // 创建 formRef

  return (
    <ModalForm
      title="新建策略规则"
      visible={visible}
      formRef={formRef} // 绑定 formRef
      onVisibleChange={(v) => {
        if (!v) {
          formRef.current?.resetFields(); // 在关闭时重置表单
        }
        onVisibleChange(v);
      }}
      onFinish={async (values) => {
        const result = await add_rule(values);
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
      <ProFormText
        name="ruleModel"
        label="规则模型(唯一)"
        rules={[{ required: true, message: '请输入规则模型' }]}
      />
      <ProFormText
        name="ruleValue"
        label="规则值"
        rules={[{ required: true, message: '请输入规则值' }]}
      />
      <ProFormTextArea
        name="ruleDesc"
        label="规则描述"
        rules={[{ required: true, message: '请输入规则描述' }]}
      />
    </ModalForm>
  );
};

export default AddForm;
