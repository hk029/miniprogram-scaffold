export default defineAppConfig({
  pages: [
    'pages/home/index',
  ],
  tabBar: {
    color: '#999999', selectedColor: '#1890ff', backgroundColor: '#ffffff', borderStyle: 'black',
    list: [
      { pagePath: 'pages/home/index', text: '首页', iconPath: 'assets/tabbar/home.png', selectedIconPath: 'assets/tabbar/home-active.png' },
    ],
  },
  window: { backgroundTextStyle: 'light', navigationBarBackgroundColor: '#ffffff', navigationBarTitleText: 'Mini Scaffold', navigationBarTextStyle: 'black' },
})
