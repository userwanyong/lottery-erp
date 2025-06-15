// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

const apiHostUrl = "http://127.0.0.1:8091";

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
