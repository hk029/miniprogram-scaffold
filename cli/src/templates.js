/**
 * 模板配置：定义各布局对应的页面和 tabbar
 */

export const LAYOUTS = {
  'header-tabbar': {
    pages: ['pages/home/index'],
    tabbar: [{ pagePath: 'pages/home/index', text: '首页', iconPath: 'assets/tabbar/home.png', selectedIconPath: 'assets/tabbar/home-active.png' }],
    copy: ['home'],
    label: 'HeaderTabBarLayout',
  },
  tabbar: {
    pages: ['pages/discover/index'],
    tabbar: [{ pagePath: 'pages/discover/index', text: '发现', iconPath: 'assets/tabbar/discover.png', selectedIconPath: 'assets/tabbar/discover-active.png' }],
    copy: ['discover'],
    label: 'TabBarLayout',
  },
  fullscreen: {
    pages: ['pages/splash/index'],
    tabbar: [],
    copy: ['splash'],
    label: 'FullscreenLayout',
  },
  all: {
    pages: ['pages/home/index', 'pages/discover/index', 'pages/mine/index', 'pages/splash/index'],
    tabbar: [
      { pagePath: 'pages/home/index', text: '首页', iconPath: 'assets/tabbar/home.png', selectedIconPath: 'assets/tabbar/home-active.png' },
      { pagePath: 'pages/discover/index', text: '发现', iconPath: 'assets/tabbar/discover.png', selectedIconPath: 'assets/tabbar/discover-active.png' },
      { pagePath: 'pages/mine/index', text: '我的', iconPath: 'assets/tabbar/mine.png', selectedIconPath: 'assets/tabbar/mine-active.png' },
    ],
    copy: ['home', 'discover', 'mine', 'splash'],
    label: '全部布局',
  },
}

export const SERVERS = {
  go: { template: 'server', label: 'Go (Fiber)' },
  python: { template: 'server-python', label: 'Python (FastAPI)' },
}
