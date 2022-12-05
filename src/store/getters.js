const getters = {
  name: state => state.user.name,
  tabbarList: state => state.tabbar.tabbarList,
  aiStatus: state => state.user.aiStatus,
  spclStatus: state => state.user.spclStatus,
};
export default getters;
