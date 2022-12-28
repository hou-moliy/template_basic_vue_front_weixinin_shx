import globalData from "../globalData.js";
import analysisService from "@/api/analysis/analysis.js";
let timeout;
let prev;
let now;
let timer;
const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join("-");
};

/**
 * 指定格式时间
 */
/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
 */
const formatTimeTwo = (number, format) => {
  const formateArr = ["Y", "M", "D", "h", "m", "s"];
  const returnArr = [];
  const date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
};

const $h = {
  // 除法函数，用来得到精确的除法结果
  // 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  // 调用：$h.Div(arg1,arg2)
  // 返回值：arg1除以arg2的精确结果
  Div: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    let t1 = 0;
    let t2 = 0;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) { }
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) { }
    const r1 = Number(arg1.toString().replace(".", ""));
    const r2 = Number(arg2.toString().replace(".", ""));
    const resultDiv = this.Mul(r1 / r2, Math.pow(10, t2 - t1));
    return resultDiv;
  },
  // 加法函数，用来得到精确的加法结果
  // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  // 调用：$h.Add(arg1,arg2)
  // 返回值：arg1加上arg2的精确结果
  Add: function (arg1, arg2) {
    arg2 = parseFloat(arg2);
    let r1, r2;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    const m = Math.pow(100, Math.max(r1, r2));
    let resultAdd = (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
    resultAdd = parseFloat(resultAdd).toFixed(2);
    return resultAdd;
  },
  // 减法函数，用来得到精确的减法结果
  // 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  // 调用：$h.Sub(arg1,arg2)
  // 返回值：arg1减去arg2的精确结果
  Sub: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    let r1, r2;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    const m = Math.pow(10, Math.max(r1, r2));
    // 动态控制精度长度
    r1 = r1 < 2 ? 2 : r1;
    r2 = r2 < 2 ? 2 : r2;
    const n = r1 >= r2 ? r1 : r2;
    return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
  },
  // 乘法函数，用来得到精确的乘法结果
  // 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  // 调用：$h.Mul(arg1,arg2)
  // 返回值：arg1乘以arg2的精确结果
  Mul: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) { }
    try {
      m += s2.split(".")[1].length;
    } catch (e) { }
    return (
      (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
      Math.pow(10, m)
    );
  },
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 计算时间差

/*
 * 合并数组
 */
const SplitArray = function (list, sp) {
  if (typeof list !== "object") return [];
  if (sp === undefined) sp = [];
  for (const i of list) {
    sp.push(i);
  }
  return sp;
};
/**
 * 数字转换
 * @type 1-不要小数点
 */
const formatCount = function (number, type) {
  if (number && type) {
    const tempNum =
      number > 999
        ? ((number - (number % 100)) / 1000).toFixed(0) + "k"
        : number;
    return tempNum;
  } else if (number) {
    const tempNum =
      number > 999 ? (number - (number % 100)) / 1000 + "k" : number;
    return tempNum;
  } else {
    return 0;
  }
};
/**
 * 地址转发
 */

const forwardingURL = function (url, otherUrl) {
  const proxyUrl = [
    {
      urlKey: "http://open.migu.cn:8100",
      path: "/openmigu",
    },
    {
      urlKey: "http://nhls.mcloud.139.com",
      path: "/nhlsMcloudHost",
    },
    {
      urlKey: "http://download.caiyun.feixin.10086.cn:80",
      path: "/downloadCaiyunHost",
    },
    {
      urlKey: "http://media4.caiyun.feixin.10086.cn:80",
      path: "/media4CaiyunHost",
    },
  ];
  const format = url.match(/(\w+):\/\/([^/:]+)(:\d*)?/g)[0];
  const index = proxyUrl.findIndex((item) => format === item.urlKey);
  if (index > -1) {
    const _url = otherUrl
      ? otherUrl + proxyUrl[index].path
      : globalData.staticImgs + proxyUrl[index].path;
    return url.replace(format, _url);
  }
  // console.log(url)
  return url;
};

/**
 * 深拷贝
 */
const deepClone = (obj) => {
  const newObj = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] =
          obj !== null && typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key];
      }
    }
  }
  return newObj;
};

/**
 * 数组内数字相加
 */
const arraySum = (arr) => {
  let sum = 0;
  arr.forEach((item) => {
    sum = sum + item;
  });
  return sum;
};

/**
 * 数组中的数字值累加数组
 */

const sumArray = (arr) => {
  let sum = 0;
  const newArr = arr.map((item) => {
    sum = sum + (item - 0);
    return sum;
  });
  return newArr;
};

/*
 *前端构造endwith方法
 */
const endWith = (string) => {
  const reg = new RegExp(string + "$");
  return reg.test(this);
};

/*
 *防抖
 */
const debounce = function (func, wait, immediate) {
  return function () {
    const context = this; // 指向全局
    const args = arguments;
    if (timeout) {
      console.log(7);
      clearTimeout(timeout);
    }
    // timer 为空表示首次触发
    if (immediate && !timeout) {
      func.apply(context, args);
    }
    timeout = setTimeout(() => {
      func.apply(context, args); // context.func(args)
    }, wait);
  };
};

/*
 *节流
 */
const throttle = function (fn, delay) {
  let context;
  let args;

  function exec () {
    fn.apply(context, args);
    now = null;
    prev = undefined;
  }
  return function () {
    context = this;
    args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    now = new Date();
    if (now - prev >= delay) {
      console.log("1");
      exec();
    } else {
      console.log("2");
      timer = setTimeout(function () {
        exec();
      }, delay);
    }
  };
};

/***
 * 单位转化 初始单位byte
 */
const unitChange = (size) => {
  const KB = size / 1024;
  const MB = size / 1024 / 1024;
  const GB = size / 1024 / 1024 / 1024;
  const TB = size / 1024 / 1024 / 1024 / 1024;
  if (KB < 1024) {
    return KB.toFixed(2) + "K";
  } else if (MB < 1024) {
    return MB.toFixed(2) + "M";
  } else if (GB < 1024) {
    return GB.toFixed(2) + "G";
  } else if (TB < 1024) {
    return TB.toFixed(2) + "T";
  }
};

// 渠道记录
const postRecord = (channelId, path) => {
  // 记录第三方进入小程序来源数据统计
  if (channelId) {
    const params = {
      channelId,
      pathUrl: path,
    };
    analysisService.channelRecord(params).then((res) => {
      if (res.data.code === 200 && !res.data.data) {
        uni.setStorageSync("channelSource", params);
      }
    });
  }
};

const phoneFilter = (str) => {
  if (str) {
    const temp = str.split("");
    temp.splice(3, 4, "*", "*", "*", "*");
    return temp.join("");
  } else {
    return "";
  }
};

const randomHash = (hashLength) => {
  if (!hashLength || typeof Number(hashLength) !== "number") {
    return;
  }
  const ar = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const hs = [];
  const hl = Number(hashLength);
  const al = ar.length;
  for (let i = 0; i < hl; i++) {
    hs.push(ar[Math.floor(Math.random() * al)]);
  }
  return hs.join("");
};

const formatRichText = (html) => {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
    match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
    match = match.replace(/height="[^"]+"/gi, "").replace(/height='[^']+'/gi, "");
    return match;
  });
  newContent = newContent.replace(/\/<img/gi, "<img style=\"max-width:100%;height:auto;\"");
  return newContent;
};
module.exports = {
  formatTime,
  formatTimeTwo,
  $h,
  SplitArray,
  formatCount,
  forwardingURL,
  deepClone,
  arraySum,
  sumArray,
  debounce,
  throttle,
  unitChange,
  postRecord,
  phoneFilter,
  randomHash,
  formatRichText,
  endWith,
};
