// 统一请求路径前缀在libs/axios.js中修改
import {
  getRequest,
  postPureRequest,
  postRequest,
  putRequest,
  deleteRequest,
  uploadFileRequest
} from '@/libs/axios';

// 文件上传接口
export const uploadFile = '/distribution/upload/file'

const importBaseUrl = '/distribution/supplier/product'
// 导入商品财务信息
export const importFinance = importBaseUrl + '/finance'

//导入商品基本信息
export const importGoodsInfo = importBaseUrl + '/importbase'

// 导入sku
export const importSku = importBaseUrl + '/importsku'

// 导入商品运营信息
export const importOperate = importBaseUrl + '/operate'

// 登陆
export const login = (params) => {
  return postRequest('/login', params)
}
// 获取菜单
export const getMenuList = (params) => {
  return getRequest('/sys-permission-po/getMenuList', params)
}
//用户信息
let adminUserInfo = '/sys-user-po/';
export const getUserInfo = (params) => {
  return getRequest(adminUserInfo + 'info', params)
}
export const updatePassword = (params) => { //修改密码
  return postRequest(adminUserInfo + 'modifyPass', params)
}
export const logout = () => { //登出
  return getRequest('/common/logout', {})
}


//商品属性管理
let goodsAttr = '/manage/product/attribute/';
export const getGoodsAttrListByType = (params) => {
  return postPureRequest(goodsAttr + 'findByCondition', params)
}

export const updateGoodsAttrStatus = (params) => {
  return postPureRequest(goodsAttr + 'updateStatus', params)
}
export const deleteGoodsAttr = (ids, params) => {
  return getRequest(goodsAttr + `delAllByIds/${ids}`, params)
}
export const addGoodsAttr = (params) => {
  return postPureRequest(goodsAttr + 'saveAttribute', params)
}
export const editGoodsAttr = (params) => {
  return postPureRequest(goodsAttr + 'editAttribute', params)
}
// 删除规格属性值
export const deleteGoodsAttrValue = (ids, params) => {
  return getRequest(goodsAttr + `delAttValueByIds/${ids}`, params)
}
// 新增编辑规格属性值
export const addOrEditGoodsValue = (params) => {
  return postPureRequest(goodsAttr + 'addOrUpdateAttInfo', params)
}

// 商品分类管理
let category = '/manage/product/category/';
export const searchCategory = (params) => {
  return postPureRequest(category + 'search', params)
}
export const deleteCategory = (params) => {
  return postPureRequest(category + 'delete', params)
}
export const updateCategoryStatus = (params) => {
  return postPureRequest(category + 'updateStatus', params)
}
export const getCategoryDetailById = (id, params) => {
  return postPureRequest(category + `view/${id}`, params)
}
export const updateCategory = (params) => {
  return postPureRequest(category + 'update', params)
}
export const addCategory = (params) => {
  return postPureRequest(category + 'save', params)
}
export const findAllCategory = (params) => {
  return postPureRequest(category + 'find_all_category', params)
}
export const findAllAttribute = (params) => {
  return postPureRequest(category + 'find_attribute', params)
}

// 商家端商品管理
let supplierGoods = '/manage/supplier/product/';
export const statisticsGood = (params) => { // 商品统计数据
  return getRequest(supplierGoods + 'statisticsGood', params)
}
export const searchGoodsInfo = (params) => { // 搜索
  return postPureRequest(supplierGoods + 'searchGoodsInfo', params)
}
export const publishGoods = (params) => { // 上架o下架
  return postPureRequest(supplierGoods + 'publish', params)
}
export const updateStarStatus = (params) => { // 修改引用标签
  return postPureRequest(supplierGoods + 'updateStarStatus', params)
}
export const findAttributesByCategoryId = (id, params) => { // 获取特定三级分类支持的所有属性
  return getRequest(supplierGoods + `findAttributes/${id}`, params)
}
export const getGoodsBaseInfo = (id, params) => { // 获取商品基本信息
  return getRequest(supplierGoods + `findBaseGood/${id}`, params)
}
export const addGoodsBaseInfo = (params) => { // 添加商品基本信息
  return postPureRequest(supplierGoods + 'addBase', params)
}
export const updateGoodsBaseInfo = (params) => { // 编辑商品基本信息
  return postPureRequest(supplierGoods + 'updateBase', params)
}
export const deleteGoods = (ids, params) => { // 删除商品
  return getRequest(supplierGoods + `delGoodsById/${ids}`, params)
}
export const auditGoods = (ids, params) => { // 审核通过审核商品
  return getRequest(supplierGoods + `submitAudit/${ids}`, params)
}
export const rejectGoods = (params) => { // 驳回审核商品
  return postPureRequest('/manage/product/rejectGoods', params)
}
export const searchAssociatedGoods = (params) => { // 查询已被关联的商品信息
  return postPureRequest(supplierGoods + 'searchAssociatedGoods', params)
}
export const searchAssociationGoods = (params) => { // 条件查询需要被关联商品信息
  return postPureRequest(supplierGoods + 'searchAssociationGoods', params)
}
export const addAssociation = (params) => { // 添加商品关联
  return postPureRequest(supplierGoods + 'addAssociation', params)
}
export const delAssociationsByIds = (ids, params) => { // 批量删除关联商品
  return getRequest(supplierGoods + `delAssociationsByIds/${ids}`, params)
}
export const findSkuFinance = (ids, params) => { // 根据商品ID查找财务的sku信息
  return getRequest(supplierGoods + `findSkuFinance/${ids}`, params)
}
export const updateSkuFinance = (params) => { // 添加或更新财务信息->sku信息
  return postPureRequest(supplierGoods + 'updateSkuFinance', params)
}
export const findGoodOperation = (id, params) => { // 根据商品ID查找财务的sku信息
  return getRequest(supplierGoods + `findGoodOperation/${id}`, params)
}
export const updateGoodOperation = (params) => { // 运营角色添加或更新商品信息
  return postPureRequest(supplierGoods + 'updateGoodOperation', params)
}

//商品导入列表
export const getGoodsImportList = (params) => { // 获取商品列表
  return postPureRequest('/supplier/product/searchExcelGoods', params)
}

export const findStandard = (params) => { // 获取商品属性规格及其规格值
  return postPureRequest(supplierGoods + 'findStandard', params)
}
export const findSkuAttribute = (id, params) => { // 根据商品ID查找sku信息
  return getRequest(supplierGoods + `findSkuAttribute/${id}`, params)
}
export const addOrUpdateSkuAttribute = (params) => { // 添加商品属性以及sku信息
  return postPureRequest(supplierGoods + 'addOrUpdateSkuAttribute', params)
}
export const findGoodSeller = (id, params) => { // 根据商品ID查找销售信息
  return getRequest(supplierGoods + `findGoodSeller/${id}`, params)
}
export const updateGoodSeller = (params) => { // 添加或更新销售信息
  return postPureRequest(supplierGoods + 'updateGoodSeller', params)
}