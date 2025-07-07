/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '活动管理',
    icon: 'crown',
    // access: 'canAdmin',//只有拥有 canAdmin 权限的用户才能访问
    routes: [
      { path: '/admin', redirect: '/admin/activity' }, //进入这个下拉菜单默认指向该菜单栏下的哪一项
      {
        path: '/admin/activity',
        name: '活动配置',
        icon: 'table',
        component: './Activity',
      },
      {
        path: '/admin/activity_count',
        name: '活动次数配置',
        icon: 'table',
        component: './ActivityCount',
      },
      {
        path: '/admin/activity_sku',
        name: '活动sku配置',
        icon: 'table',
        component: './ActivitySku',
      },
    ],
  },
  {
    path: '/lottery',
    name: '抽奖管理',
    icon: 'group',
    // access: 'canAdmin',//只有拥有 canAdmin 权限的用户才能访问
    routes: [
      { path: '/lottery', redirect: '/lottery/activity_account' },
      {
        name: '抽奖账户',
        icon: 'table',
        path: '/lottery/activity_account',
        component: './ActivityAccount',
      },
      {
        name: '增加抽奖账户次数流水',
        icon: 'table',
        path: '/lottery/activity_record',
        component: './ActivityRecord',
      },
      {
        name: '用户抽奖订单',
        icon: 'table',
        path: '/lottery/user_order_list',
        component: './UserOrder',
      },
      {
        name: '用户中奖流水',
        icon: 'table',
        path: '/lottery/user_award_record',
        component: './UserAwardRecord',
      },
      {
        name: '奖品配置',
        icon: 'table',
        path: '/lottery/award',
        component: './Award',
      },
    ],
  },
  {
    path: '/credit',
    name: '积分管理',
    icon: 'dotChart',
    // access: 'canAdmin',//只有拥有 canAdmin 权限的用户才能访问
    routes: [
      { path: '/credit', redirect: '/credit/credit_account' },
      {
        name: '积分账户',
        icon: 'table',
        path: '/credit/credit_account',
        component: './CreditAccount',
      },
      {
        name: '积分账户流水',
        icon: 'table',
        path: '/credit/credit_record',
        component: './CreditRecord',
      },
    ],
  },
  {
    path: '/rebate',
    name: '返利管理',
    icon: 'sliders',
    // access: 'canAdmin',//只有拥有 canAdmin 权限的用户才能访问
    routes: [
      { path: '/rebate', redirect: '/rebate/behavior_rebate' },
      {
        name: '返利配置',
        icon: 'table',
        path: '/rebate/behavior_rebate',
        component: './BehaviorRebate',
      },
      {
        name: '用户日常行为返利订单',
        icon: 'table',
        path: '/rebate/user_behavior_rebate_order',
        component: './UserBehaviorRebateOrder',
      },
    ],
  },
  {
    path: '/strategy',
    name: '策略管理',
    icon: 'fund',
    // access: 'canAdmin',//只有拥有 canAdmin 权限的用户才能访问
    routes: [
      { path: '/strategy', redirect: '/strategy/strategy' },
      {
        name: '策略配置',
        icon: 'table',
        path: '/strategy/strategy',
        component: './Strategy',
      },
      {
        name: '策略规则配置',
        icon: 'table',
        path: '/strategy/rule',
        component: './Rule',
      },
      {
        name: '策略奖品配置',
        icon: 'table',
        path: '/strategy/award',
        component: './StrategyAward',
      },
      {
        name: '奖品规则树配置',
        icon: 'table',
        path: '/strategy/tree',
        component: './RuleTree',
      },
      {
        name: '奖品规则节点配置',
        icon: 'table',
        path: '/strategy/node',
        component: './RuleTreeNode',
      },
      {
        name: '奖品规则节点连线配置',
        icon: 'table',
        path: '/strategy/line',
        component: './RuleTreeNodeLine',
      },
    ],
  },

  {
    name: '效果体验',
    icon: 'aimOutlined',
    path: '/experience',
    component: './Experience',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
