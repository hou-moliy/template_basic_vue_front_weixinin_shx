import defaultDict from "./AttrDict/defaultDict";

const copyAttr = function (sourceBean, targetBean) {
  if (!targetBean) {
    return sourceBean;
  }
  Object.keys(targetBean).forEach((key, index) => {
    const realVal = targetBean[key] || sourceBean[key];
    if (realVal) {
      sourceBean[key] = attrConvertor({ attrName: key, attrValue: realVal });
    } else {
      delete sourceBean[key];
    }
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
