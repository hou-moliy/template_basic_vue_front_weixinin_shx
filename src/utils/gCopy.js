import defaultDict from "./AttrDict/defaultDict";

const copyAttr = function (sourceBean, targetBean) {
  if (!targetBean) {
    return null;
  }
  Object.keys(targetBean).forEach((item, index) => {
    sourceBean[item] = attrConvertor({ attrName: item, attrValue: targetBean[item] });
  });
  return sourceBean;
};

const attrConvertor = function (bean) {
  if (!bean) {
    return null;
  }
  console.log("bean is ", bean);
  switch (defaultDict[bean.attrName]) {
    case "rpx":
      console.log("bean.attrValue ", bean.attrValue, /^\d+$/.test(bean.attrValue));
      if (/^\d+$/.test(bean.attrValue)) {
        return bean.attrValue + "rpx";
      }
      return bean.attrValue;
    default:
      return bean.attrValue;
  }
};

module.exports = {
  copyAttr,
};
