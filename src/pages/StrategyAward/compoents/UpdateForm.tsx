import {
  query_award,
  query_rule_tree,
  query_strategy,
  update_strategy_award,
} from '@/services/api';
import { history } from '@@/core/history';
import { ProFormTextArea } from '@ant-design/pro-components';
import {
  ModalForm,
  ProFormGroup,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { App, Form, InputNumber } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface UpdateFormProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish?: () => void;
  initialValues: API.StrategyAwardItem;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { visible, onVisibleChange, onFinish, initialValues } = props;
  const { message } = App.useApp();
  const formRef = useRef<ProFormInstance>();
  const [strategyList, setStrategyList] = useState<API.StrategyItem[]>([]);
  const [awardList, setAwardList] = useState<API.AwardItem[]>([]);
  const [ruleTreeList, setRuleTreeList] = useState<API.RuleTreeItem[]>([]);

  useEffect(() => {
    const fetchStrategyData = async () => {
      try {
        const strategyRes = await query_strategy();
        if (strategyRes && strategyRes.data) {
          setStrategyList(strategyRes.data);
        }
      } catch (error) {
        message.error('获取策略列表失败');
      }
    };
    const fetchAwardData = async () => {
      try {
        const awardRes = await query_award();
        if (awardRes && awardRes.data) {
          setAwardList(awardRes.data);
        }
      } catch (error) {
        message.error('获取奖品列表失败');
      }
    };
    const fetchRuleTerrData = async () => {
      try {
        const ruleTreeRes = await query_rule_tree();
        if (ruleTreeRes && ruleTreeRes.data) {
          setRuleTreeList(ruleTreeRes.data);
        }
      } catch (error) {
        message.error('获取奖品规则列表失败');
      }
    };

    if (visible) {
      fetchStrategyData();
      fetchAwardData();
      fetchRuleTerrData();
    }
  }, [visible]);

  return (
    <ModalForm
      title="修改策略奖品"
      visible={visible}
      formRef={formRef}
      onVisibleChange={(v) => {
        onVisibleChange(v);
      }}
      key={initialValues.id} // 作用：打开一行数据再关掉，再打开另一行时，数据会随之变化
      initialValues={initialValues}
      onFinish={async (values) => {
        const result = await update_strategy_award(values);
        if (result.code === 1000) {
          message.success('修改成功');
          if (onFinish) {
            onFinish();
          }
          return true;
        }
        message.error(result.message);
        return false;
      }}
    >
      <ProFormText name="id" label="策略奖品ID" disabled />
      <ProFormSelect
        name="strategyId"
        label="策略ID"
        rules={[{ required: true, message: '请选择策略ID' }]}
        options={[
          ...strategyList.map((item) => ({
            label: `${item.id} (${item.strategyDesc})`,
            value: item.id,
          })),
          { label: '去新建+', value: '__NEW_STRATEGY__' }, // 添加新建选项
        ]}
        showSearch
        fieldProps={{
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          onChange: (value) => {
            if (value === '__NEW_STRATEGY__') {
              history.push('/admin/activity');
            }
          },
        }}
      />
      <ProFormSelect
        name="awardId"
        label="奖品ID"
        rules={[{ required: true, message: '请选择奖品ID' }]}
        options={[
          ...awardList.map((item) => ({
            label: `${item.id} (${item.awardDesc})`,
            value: item.id,
          })),
          { label: '去新建+', value: '__NEW_AWARD__' }, // 添加新建选项
        ]}
        showSearch
        fieldProps={{
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          onChange: (value) => {
            if (value === '__NEW_AWARD__') {
              history.push('/lottery/award');
            }
          },
        }}
      />
      <ProFormSelect
        name="ruleTreeId"
        label="奖品规则ID"
        rules={[{ required: true, message: '请选择奖品规则' }]}
        options={[
          ...ruleTreeList.map((item) => ({
            label: `${item.id} (${item.treeName})`,
            value: item.id,
          })),
          { label: '去新建+', value: '__NEW_RULE_TREE__' }, // 添加新建选项
        ]}
        showSearch
        fieldProps={{
          filterOption: (input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
          onChange: (value) => {
            if (value === '__NEW_RULE_TREE__') {
              history.push('/strategy/tree');
            }
          },
        }}
      />
      <ProFormText
        name="awardTitle"
        label="奖品标题"
        rules={[{ required: true, message: '请输入奖品标题' }]}
      />
      <ProFormTextArea name="awardSubtitle" label="奖品副标题" />
      <ProFormGroup>
        <Form.Item
          name="awardCount"
          label="总库存/个"
          rules={[{ required: true, type: 'number', min: 1 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="awardCountSurplus"
          label="剩余库存/个"
          rules={[{ required: true, type: 'number', min: 0 }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name="awardRate"
          label="中奖概率"
          tooltip="同一策略下的奖品概率之和应为1"
          rules={[{ required: true, type: 'number', min: 0.0001, max: 1 }]}
        >
          <InputNumber step={0.0001} />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序编号"
          rules={[{ required: true, type: 'number', min: 1 }]}
        >
          <InputNumber />
        </Form.Item>
      </ProFormGroup>
    </ModalForm>
  );
};

export default UpdateForm;
