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
