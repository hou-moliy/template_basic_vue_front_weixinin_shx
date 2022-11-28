const getters = {
  name: state => state.user.name,
  tabbarList: state => state.tabbar.tabbarList,
  step: state => state.spcl.step,
  isFirstPlay: state => state.spcl.isFirstPlay,
};
export default getters;
