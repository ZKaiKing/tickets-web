/**
 *  @Description: 设置全局变量 JS文件
 **/
//周一到周日的数中英对应关系
export const weekDays = {
  SUNDAY: {cnName: "星期日", flag:0},
  MONDAY: {cnName: "星期一", flag:1},
  TUESDAY: {cnName: "星期二",flag:2},
  WEDNESDAY: {cnName: "星期三",flag:3},
  THURSDAY: {cnName: "星期四",flag:4},
  FRIDAY: {cnName: "星期五",flag:5},
  SATURDAY: {cnName: "星期六",flag:6}
}

//性别
export const sex={
  WOMAN:{describe: "女",flag:0},
  MAX:{describe: "男",flag:1},
  PRIVARY:{describe: "保密",flag:2}
}

//运费审核状态
export const freightAuditStatus={
	NO_SUBMIT:{describe: "待提交",flag:1},
	WAIT_AUDIT:{describe: "待审核",flag:2},
	PASS:{describe: "审核通过",flag:3},
	NO_PASS:{describe: "不通过",flag:4},
	UPDATE:{describe: "返回修改",flag:5}
}

//操作类型
export const operType={
	ADD:{describe: "增加",flag:0},
	UPDATE:{describe: "修改",flag:1},
	QUERY:{describe: "查询",flag:2}
}

//时间类型
export const timeType={
  PRESENT_TIME_FORMAT: {describe: "当前时间",format:"",flag:0},
  STRIKE_FORMAT: {describe: "年月日-隔开格式",format:"yyyy-MM-dd HH:mm:ss",flag:1},
  SLASH_FORMAT: {describe: "年月日/隔开格式",format:"yyyy/MM/dd HH:mm:ss",flag:2},
  COLON_FORMAT: {describe: "全冒号格式",format:"yyyy:MM:dd:HH:mm:ss",flag:3},
  STRIKE_DATE_FORMAT: {describe: "只获取日期",format:"yyyy-MM-dd",flag:4},
  FONT_FORMAT: {describe: "年月日 汉字隔开格式",format:"yyyy年MM月dd HH:mm:ss",flag:5}
}

export const bannerLocat={
  SHOUYE_YOUPIN:{describe:"首页有品+品牌轮播图广告",flag:1,value:"SHOUYE_YOUPIN",ref:"haveBrandModal"},
  STORE_DETAIL:{describe:"首页有店+店铺分类详情",flag:2,value:"STORE_DETAIL",ref:"haveStoreModal"},
  SHOUYE_ZHUTI:{describe:"首页主题",flag:3,value:"SHOUYE_ZHUTI",ref:"themeHouseModal"},
  SALE:{describe:"首页特卖",flag:4,value:"SALE",ref:"optiSpecialOfferModal"},
  YOUXUAN:{describe:"葱鸭优选",flag:5,value:"YOUXUAN",ref:"optiSpecialOfferModal"},
  BOTTOM_SHUFFLING:{describe:"首页底部轮播图",flag:6,value:"BOTTOM_SHUFFLING",ref:"carouselType"},
  LEFT_UP_CORNER_SHUFFLING:{describe:"首页左上角轮播图",flag:7,value:"LEFT_UP_CORNER_SHUFFLING",ref:"carouselType"},
  MIDDLE_ONE_SHUFFLING:{describe:"首页中部1轮播图",flag:8,value:"MIDDLE_ONE_SHUFFLING",ref:"carouselType"},
  MIDDLE_TWO_SHUFFLING:{describe:"首页中部2轮播图",flag:9,value:"MIDDLE_TWO_SHUFFLING",ref:"carouselType"},
  MIDDLE_THREE_SHUFFLING:{describe:"首页中部3轮播图",flag:10,value:"MIDDLE_THREE_SHUFFLING",ref:"carouselType"},
  YOUPIN_INSIDE_SHUFFLING:{describe:"首页有品内部轮播图",flag:11,value:"YOUPIN_INSIDE_SHUFFLING",ref:"carouselType"},
  YOUDIAN_INSIDE_SHUFFLING:{describe:"首页有店内部轮播图",flag:12,value:"YOUDIAN_INSIDE_SHUFFLING",ref:"carouselType"},
  SALE_INSIDE_SHUFFLING:{describe:"特卖内部轮播图",flag:13,value:"SALE_INSIDE_SHUFFLING",ref:"carouselType"},
  YOUXUAN_INSIDE_SHUFFLING:{describe:"优选内部轮播图",flag:14,value:"YOUXUAN_INSIDE_SHUFFLING",ref:"carouselType"},
  BAIHUO_INSIDE_SHUFFLING:{describe:"葱鸭百货内部轮播图",flag:15,value:"BAIHUO_INSIDE_SHUFFLING",ref:"carouselType"},
  PERSONAL_CENTER:{describe:"个人中心顶部背景图",flag:16,value:"PERSONAL_CENTER"},
  YOUPIN_DETAIL:{describe:"品牌详情轮播图",flag:17,value:"YOUPIN_DETAIL",ref:"carouselType"},
  FIRST_CATEGORY_DETAIL:{describe:"一级分类详情轮播图",flag:18,value:"FIRST_CATEGORY_DETAIL",ref:"carouselType"},
  BAIHUO:{describe:"葱鸭百货",flag:19,value:"BAIHUO",ref:"goodsClassify"},
  information_recommended:{describe:"资讯分类推荐",flag:20,value:"information_recommended",ref:"consultClassify"},
  TOP_UP_ENTRY:{describe:"充值入口",flag:21,value:"TOP_UP_ENTRY"},
  SPELL_GROUP_SHUFFLING:{describe:"拼团内部轮播图",flag:22,value:"SPELL_GROUP_SHUFFLING",ref:"carouselType"},
  COUPON:{describe:"领券",flag:23,value:"COUPON",ref:"carouselType"},
  EXPERIENCE_PACKAGE:{describe:"经验包",flag:24,value:"EXPERIENCE_PACKAGE",ref:"carouselType"},
  INVITATION:{describe:"邀请有礼",flag:25,value:"INVITATION"},
  INTEGRALS_INSIDE_HUFFLING:{describe:"积分内部轮播图",flag:26,value:"INTEGRALS_INSIDE_HUFFLING",ref:"carouselType"},
  REDUCED_INSIDE_SHUFFLING:{describe:"满减内部轮播图",flag:27,value:"REDUCED_INSIDE_SHUFFLING",ref:"carouselType"},
  SPELL_GROUP:{describe:"拼团广告(首页拼团鸭)",flag:28,value:"SPELL_GROUP"},
  INTEGRALS_ACTIVITY:{describe:"积分活动广告",flag:29,value:"INTEGRALS_ACTIVITY",ref:"activityType"},//新编辑类型广告
  REDUCED_ACTIVITY:{describe:"满减活动广告",flag:30,value:"REDUCED_ACTIVITY",ref:"activityType"},//新编辑类型广告
  PERSONAL_CENTER_MIDDLE_SHUFFLING:{describe:"个人中心中部轮播图",flag:31,value:"PERSONAL_CENTER_MIDDLE_SHUFFLING",ref:"carouselType"},
  BAIHUO_MIDDLE:{describe:"百货中部广告",flag:32,value:"BAIHUO_MIDDLE",ref:"themeHouseModal"},
  TODAY_SPELL:{describe:"今日必拼",flag:33,value:"TODAY_SPELL",ref:"themeHouseModal"}
}
