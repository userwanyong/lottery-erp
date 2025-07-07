// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

const apiHostUrl = "http://127.0.0.1:8091";

// 效果展示
export async function queryLotteryAwardList(options?: { [key: string]: any }) {
  return request<API.LotteryAwardList>(`${apiHostUrl}/api/v1/lottery/query_lottery_award_list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: options,
  });
}

export async function draw(options?: { [key: string]: any }) {
  return request<API.LotteryAward>(`${apiHostUrl}/api/v1/activity/draw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    data: options,
  });
}

// 运营后台
export async function query_user_order() {
  return request<API.UserOrderItem>(`${apiHostUrl}/api/v1/erp/query_user_order`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_activity_account() {
  return request<API.ActivityAccountItem>(`${apiHostUrl}/api/v1/erp/query_activity_account`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_user_award_record() {
  return request<API.UserAwardRecordItem>(`${apiHostUrl}/api/v1/erp/query_user_award_record`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_credit_account() {
  return request<API.CreditAccountItem>(`${apiHostUrl}/api/v1/erp/query_credit_account`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_credit_record() {
  return request<API.CreditRecordItem>(`${apiHostUrl}/api/v1/erp/query_credit_record`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_activity_record() {
  return request<API.ActivityRecordItem>(`${apiHostUrl}/api/v1/erp/query_activity_record`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_user_behavior_rebate_order() {
  return request<API.UserBehaviorRebateOrderItem>(`${apiHostUrl}/api/v1/erp/query_user_behavior_rebate_order`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_activity() {
  return request<API.ActivityItem>(`${apiHostUrl}/api/v1/erp/activity/query_activity`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_activity(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity/add_activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_activity(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity/update_activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_activity(activityId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity/delete_activity/${activityId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function armory_activity(activityId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/activity/armory?activityId=${activityId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_activity_count() {
  return request<API.ActivityCountItem>(`${apiHostUrl}/api/v1/erp/activity_count/query_activity_count`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_activity_count(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity_count/add_activity_count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_activity_count(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity_count/update_activity_count`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_activity_count(activityCountId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity_count/delete_activity_count/${activityCountId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_activity_sku() {
  return request<API.ActivitySkuItem>(`${apiHostUrl}/api/v1/erp/activity_sku/query_activity_sku`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_activity_sku(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity_sku/add_activity_sku`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_activity_sku(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity_sku/update_activity_sku`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_activity_sku(activitySkuId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/activity_sku/delete_activity_sku/${activitySkuId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_behavior_rebate() {
  return request<API.BehaviorRebateItem>(`${apiHostUrl}/api/v1/erp/behavior/query_behavior`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_behavior_rebate(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/behavior/add_behavior`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_behavior_rebate(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/behavior/update_behavior`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_behavior_rebate(behaviorRebateId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/behavior/delete_behavior/${behaviorRebateId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_award() {
  return request<API.AwardItem>(`${apiHostUrl}/api/v1/erp/award/query_award`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_award(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/award/add_award`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_award(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/award/update_award`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_award(awardId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/award/delete_award/${awardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function upload(
  formData: FormData,
) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/file/upload`, {
    method: 'POST',
    data: formData,
    // requestType: 'form',
  });
}

export async function query_rule() {
  return request<API.RuleItem>(`${apiHostUrl}/api/v1/erp/rule/query_rule`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_rule(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/add_rule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_rule(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/update_rule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_rule(ruleId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/delete_rule/${ruleId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_strategy() {
  return request<API.StrategyItem>(`${apiHostUrl}/api/v1/erp/strategy/query_strategy`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_strategy(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/strategy/add_strategy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_strategy(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/strategy/update_strategy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_strategy(strategyId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/strategy/delete_strategy/${strategyId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_strategy_award() {
  return request<API.StrategyAwardItem>(`${apiHostUrl}/api/v1/erp/strategy/award/query_strategy_award`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_strategy_award(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/strategy/award/add_strategy_award`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_strategy_award(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/strategy/award/update_strategy_award`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_strategy_award(strategyAwardId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/strategy/award/delete_strategy_award/${strategyAwardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_rule_tree() {
  return request<API.RuleTreeItem>(`${apiHostUrl}/api/v1/erp/rule/tree/query_rule_tree`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_rule_tree(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/add_rule_tree`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_rule_tree(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/update_rule_tree`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_rule_tree(ruleTreeId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/delete_rule_tree/${ruleTreeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_rule_tree_node() {
  return request<API.RuleTreeNodeItem>(`${apiHostUrl}/api/v1/erp/rule/tree/node/query_rule_tree_node`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_rule_tree_node_one(ruleTreeId:string) {
  return request<API.RuleTreeNodeItem>(`${apiHostUrl}/api/v1/erp/rule/tree/node/query_rule_tree_node_one?ruleTreeId=${ruleTreeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_rule_tree_node(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/node/add_rule_tree_node`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_rule_tree_node(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/node/update_rule_tree_node`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_rule_tree_node(ruleTreeNodeId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/node/delete_rule_tree_node/${ruleTreeNodeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function query_rule_tree_node_line() {
  return request<API.RuleTreeNodeLineItem>(`${apiHostUrl}/api/v1/erp/rule/tree/node/line/query_rule_tree_node_line`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function add_rule_tree_node_line(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/node/line/add_rule_tree_node_line`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function update_rule_tree_node_line(options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/node/line/update_rule_tree_node_line`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: options,
  });
}

export async function delete_rule_tree_node_line(ruleTreeNodeLineId: any) {
  return request<API.CommonResponse>(`${apiHostUrl}/api/v1/erp/rule/tree/node/line/delete_rule_tree_node_line/${ruleTreeNodeLineId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


