import defaultDict from "./AttrDict/defaultDict";

const copyAttr = function (sourceBean, targetBean) {
  if (!targetBean) {
    return sourceBean;
  }
  Object.keys(targetBean).forEach((item, index) => {
    sourceBean[item] = attrConvertor({ attrName: item, attrValue: targetBean[item] || sourceBean[item] });
  });
  return sourceBean;
};

const attrConvertor = function (bean) {
  if (!bean) {
    return null;
  }
  if (defaultDict[bean.attrName] === "rpx" && /^\d+$/.test(bean.attrValue)) {
    return bean.attrValue + "rpx";
  } else {
    return bean.attrValue;
  }
};

module.exports = {
  copyAttr,
};
