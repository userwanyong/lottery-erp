// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
  };

  type LoginResult = {
    status?: string;
    type?: string;
    currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type UserOrderItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    activityName?: string;
    strategyId?: string;
    orderId?: string;
    orderTime?: string;
    orderState?: string;
    createTime?: string;
    updateTime?: string;
  };

  type ActivityAccountItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    totalCount?: string;
    totalCountSurplus?: string;
    dayCount?: string;
    dayCountSurplus?: string;
    monthCount?: string;
    monthCountSurplus?: string;
    createTime?: string;
    updateTime?: string;
  };

  type UserAwardRecordItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    strategyId?: string;
    userOrderId?: string;
    awardId?: string;
    awardTitle?: string;
    awardTime?: string;
    awardState?: string;
    createTime?: string;
    updateTime?: string;
  };

  type CreditAccountItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    totalAmount?: string;
    availableAmount?: string;
    accountStatus?: string;
    createTime?: string;
    updateTime?: string;
  }

  type CreditRecordItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    tradeName?: string;
    tradeType?: string;
    tradeAmount?: string;
    outBusinessNo?: string;
    createTime?: string;
    updateTime?: string;
  }

  type ActivityRecordItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    sku?: string;
    activityName?: string;
    totalCount?: string;
    dayCount?: string;
    monthCount?: string;
    payAmount?: string;
    state?: string;
    outBusinessNo?: string;
    createTime?: string;
    updateTime?: string;
  }

  type UserBehaviorRebateOrderItem = {
    id?: string;
    userId?: string;
    activityId?: string;
    behaviorType?: string;
    rebateDesc?: string;
    rebateType?: string;
    rebateConfig?: string;
    outBusinessNo?: string;
    bizId?: string;
    createTime?: string;
    updateTime?: string;
  }

  type ActivityItem = {
    id?: string;
    activityName?: string;
    activityDesc?: string;
    beginDateTime?: string;
    endDateTime?: string;
    strategyId?: string;
    state?: string;
    createTime?: string;
    updateTime?: string;
    data?: ActivityItem[];
  }

  type CommonResponse = {
    code?: number;
    message?: string;
    data?: any;
  }

  type ActivityCountItem = {
    id?: string;
    activityId?: string;
    totalCount?: string;
    dayCount?: string;
    monthCount?: string;
    createTime?: string;
    updateTime?: string;
    data?: ActivityCountItem[];
  }

  type ActivitySkuItem = {
    id?: string;
    activityId?: string;
    stockCount?: string;
    stockCountSurplus?: string;
    productAmount?: string;
    createTime?: string;
    updateTime?: string;
    data?: ActivitySkuItem[];
  }

  type BehaviorRebateItem = {
    id?: string;
    activityId?: string;
    behaviorType?: string;
    rebateDesc?: string;
    rebateType?: string;
    rebateConfig?: string;
    state?: string;
    createTime?: string;
    updateTime?: string;
  }

  type AwardItem = {
    id?: string;
    awardKey?: string;
    awardConfig?: string;
    awardDesc?: string;
    image?: string;
    createTime?: string;
    updateTime?: string;
    data?: AwardItem[];
  }

  type RuleItem = {
    id?: string;
    ruleModel?: string;
    ruleValue?: string;
    ruleDesc?: string;
    createTime?: string;
    updateTime?: string;
    data?: RuleItem[];
  }

  type StrategyItem = {
    id?: string;
    strategyDesc?: string;
    ruleModels?: string;
    createTime?: string;
    updateTime?: string;
    data?: StrategyItem[];
  }

  type StrategyAwardItem = {
    id?: string;
    strategyId?: string;
    awardId?: string;
    awardTitle?: string;
    awardSubtitle?: string;
    awardCount?: string;
    awardCountSurplus?: string;
    awardRate?: string;
    ruleTreeId?: string;
    sort?: string;
    createTime?: string;
    updateTime?: string;
  }

  type RuleTreeItem = {
    id?: string;
    treeName?: string;
    treeDesc?: string;
    treeNodeRuleKey?: string;
    createTime?: string;
    updateTime?: string;
    data?: RuleTreeItem[];
  }
}
