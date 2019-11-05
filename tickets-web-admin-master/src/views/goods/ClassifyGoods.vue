<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="一级分类名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入一级分类名称" style="width: 200px" />
          </Form-item>
          <Form-item label="一级分类ID" prop="id">
            <Input type="text" v-model="searchForm.id" clearable placeholder="请输入一级分类ID" style="width: 200px" />
          </Form-item>
          <Form-item label="状态" prop="enabled">
            <Select v-model="searchForm.enabled" placeholder="请选择" clearable style="width: 100px">
              <Option value="true">已启用</Option>
              <Option value="false">已禁用</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left:-35px;" :label-width="80" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle" style="margin-left: 8px">重置</Button>
            <Button @click="addData" type="success" ghost icon="ios-add" style="margin-left: 8px">新增一级分类</Button>
            <!-- <Button @click="batchDeleteData" type="error" ghost icon="ios-trash" style="margin-left: 8px ">批量删除</Button> -->
          </Form-item>
        </Form>
      </Row>
      <!-- input search end -->

      <!-- data table start -->
      <Row>
        <TreeTable border ref="table" :columns="columns" :data="tableData" expand-key="name" :expand-type="false" :selection-type="false" @checkbox-click="saveSelect">
          <template slot-scope="{ row }" slot="icon">
            <img :src="row.icon" height="40px" />
          </template>
          <template slot-scope="{ row }" slot="enabled">
            <Badge v-if="row.enabled === true" status="success" text="已启用" />
            <Badge v-else status="error" text="已禁用" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button v-if="row.level < 3" type="primary" size="small" @click="addSubLevel(row)">添加子类</Button>
            <Button type="primary" size="small" @click="editData(row)" style="margin-left: 5px">编辑</Button>
            <Button type="error" size="small" @click="deteleData(row)" style="margin-left: 5px">删除</Button>
            <Button v-if="row.enabled === false" type="success" size="small" @click="enabledData(row)" style="margin-left: 5px">启用</Button>
            <Button v-else size="small" @click="enabledData(row)" style="margin-left: 5px">禁用</Button>
          </template>
        </TreeTable>
      </Row>
      <!-- data table end -->

      <!-- page info start -->
      <Row type="flex" justify="end" style="margin-top: 2vh">
        <Page :current="searchForm.pageNo" :page-size="searchForm.pageSize" :total=total show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changeSize" />
      </Row>
      <!-- page info end -->
    </Card>

    <!-- first level modal start-->
    <Modal :title="modalTitle" v-model="primaryLevModalVisible" :mask-closable="false" :width="550" :style="{top:'30px'}">
      <Form ref="primaryDataOperForm" :model="dataOperForm" :label-width="100" :rules="primaryFormValidate">
        <FormItem label="分类名称" prop="name">
          <Input v-model="dataOperForm.name" autocomplete="off" />
        </FormItem>
        <Form-item label="分类缩略图" prop="icon">
          <upload-pic-input v-model="dataOperForm.icon" placeholder="点击右侧按钮上传图片"></upload-pic-input>
        </Form-item>
        <FormItem label="状态" prop="enabled">
          <RadioGroup v-model="dataOperForm.enabled">
            <Radio label="1">启用</Radio>
            <Radio label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="dataOperForm.sort" autocomplete="off" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelSubmitInfo">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitInfo">提交</Button>
      </div>
    </Modal>

    <!-- add or edit operation modal start-->
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="550" :style="{top:'30px'}">
      <Form ref="dataOperForm" :model="dataOperForm" :label-width="120" :rules="dataOperFormValidate">
        <FormItem label="分类名称" prop="name">
          <Input v-model="dataOperForm.name" autocomplete="off" />
        </FormItem>
        <Form-item label="分类缩略图" prop="icon">
          <upload-pic-input v-model="dataOperForm.icon" placeholder="点击右侧按钮上传图片"></upload-pic-input>
        </Form-item>
        <FormItem label="状态" prop="enabled">
          <RadioGroup v-model="dataOperForm.enabled">
            <Radio label="1">启用</Radio>
            <Radio label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序" prop="sort">
          <Input v-model="dataOperForm.sort" autocomplete="off" />
        </FormItem>
        <FormItem label="税率设置" prop="taxRate">
          <InputNumber :min="0" :max="100" v-model="dataOperForm.taxRate" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"></InputNumber>
        </FormItem>
        <FormItem label="关联规格" prop="specificationList">
          <Select v-model="dataOperForm.specificationList" filterable multiple>
            <Option v-for="item in attrInfoList.specificationList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联参数" prop="attributeList">
          <Select v-model="dataOperForm.attributeList" filterable multiple>
            <Option v-for="item in attrInfoList.attributeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联服务说明" prop="serviceList">
          <Select v-model="dataOperForm.serviceList" filterable multiple>
            <Option v-for="item in attrInfoList.serviceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联购买须知说明" prop="purchaseList">
          <Select v-model="dataOperForm.purchaseList" filterable multiple>
            <Option v-for="item in attrInfoList.purchaseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关联活动说明" prop="activityList">
          <Select v-model="dataOperForm.activityList" filterable multiple>
            <Option v-for="item in attrInfoList.activityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelSubmitInfo">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitInfo">提交</Button>
      </div>
    </Modal>
    <!-- add or edit operation modal end-->
  </div>
</template>

<script>
  import { searchCategory, deleteCategory, updateCategoryStatus, getCategoryDetailById, updateCategory, addCategory, findAllAttribute } from "@/api/index";
  import uploadPicInput from "@/components/upload-pic-input";
  export default {
    components: {
      uploadPicInput
    },
    data() {
      return {
        searchForm: {
          name: "",
          id: "",
          enabled: "",
          pageNo: 1,
          pageSize: 10,
        },
        columns: [
          { title: '分类名称', key: 'name', headerAlign: 'center', width: 200, fixed: "left" },
          { title: '分类ID', key: 'id', headerAlign: 'center', align: 'center', minWidth: 165 },
          { title: '分类缩略图', type: 'template', template: 'icon', headerAlign: 'center', align: 'center', minWidth: 150 },
          { title: '排序', key: 'sort', headerAlign: 'center', align: 'center', minWidth: 100 },
          { title: '状态', type: 'template', template: 'enabled', headerAlign: 'center', align: 'center', minWidth: 100 },
          { title: '操作', type: 'template', template: 'action', headerAlign: 'center', align: 'right', width: 250, fixed: "right" }
        ],
        tableData: [],
        loading: true,
        total: 0,
        selectList: [],
        selectCount: 0,
        modalVisible: false,
        modalTitle: '',
        submitLoading: false,
        primaryLevModalVisible: false,
        isAddOperation: false,
        dataOperForm: {
          id: 0,
          name: "",
          level: "",
          parentId: "",
          sort: 0,
          icon: "",
          enabled: "1",
          taxRate: 0,
          attributeList: [],
          purchaseList: [],
          serviceList: [],
          specificationList: [],
          activityList:[],
          goodAttributeIds: [],
        },
        attrInfoList: [],
        primaryFormValidate: {
          name: [
            { required: true, message: "分类名称为必输，不能为空", trigger: "blur" }
          ],
          icon: [
            { required: true, message: "商品分类缩略图不能为空", trigger: "blur" }
          ],
          enabled: [
            { required: true, trigger: "blur" }
          ],
          sort: [
            { required: true, message: '只能输入数字，支持的最大精度为2位小数', trigger: 'blur', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/, },
          ]
        },
        dataOperFormValidate: {
          name: [
            { required: true, message: "分类名称为必输，不能为空", trigger: "blur" }
          ],
          icon: [
            { required: true, message: "商品分类缩略图不能为空", trigger: "blur" }
          ],
          enabled: [
            { required: true, trigger: "blur" }
          ],
          sort: [
            { required: true, message: '只能输入数字，支持的最大精度为2位小数', trigger: 'blur', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/, },
          ],
          // attributeList: [
          //   { required: true, message: '关联参数为必选项，不能为空', trigger: 'blur' },
          // ],
          // purchaseList: [
          //   { required: true, message: '关联购买须知说明为必选项，不能为空', trigger: 'blur' },
          // ],
          // serviceList: [
          //   { required: true, message: '关联服务说明为必选项，不能为空', trigger: 'blur' },
          // ],
          // specificationList: [
          //   { required: true, message: '关联规格为必选项，不能为空', trigger: 'blur' },
          // ],
        },
      }
    },
    methods: {
      getDataList() {
        this.loading = true;
        let params = this.searchForm;
        searchCategory(params).then(res => {
          this.loading = false;
          if (res.resultCode == 'SUCCESS') {
            this.tableData = res.data.categoryList;
            this.total = res.data.totalCount;
          } else {
            this.$Message.error({
              content: '操作失败：' + res.message,
              duration: 5
            });
          }
        });
      },
      handleSearch() {
        this.getDataList();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNo = 1;
        this.searchForm.pageSize = 10;
        this.getDataList();
      },
      changePage(pageNo) {
        this.searchForm.pageNo = pageNo;
        this.getDataList();
      },
      changeSize(size) {
        this.searchForm.pageSize = size;
        this.getDataList();
      },
      saveSelect(data, index, event) {
        console.log(data._isChecked);
        console.log(index);
        console.log(event)
      },
      deteleData(row) {
        this.$Modal.confirm({
          title: "提示",
          content: '请确认是否要删除:  <strong>' + row.name + '</strong> ?',
          onOk: () => {
            let params = {}
            let ids = [];
            ids.push(row.id);
            params.ids = ids;
            deleteCategory(params).then(res => {
              if (res.resultCode == 'SUCCESS') {
                this.$Message.success("操作成功");
                this.getDataList();
              } else {
                this.$Message.error({
                  content: '操作失败：' + res.message,
                  duration: 5
                });
              }
            })
          }
        })
      },
      enabledData(row) {
        let option = row.enabled ? '禁用' : '启用';
        this.$Modal.confirm({
          title: "提示",
          content: '请确认是否要' + option + ':  <strong>' + row.name + '</strong> ?',
          onOk: () => {
            let ids = [];
            ids.push(row.id);
            this.updateStatus(ids, !row.enabled);
          }
        })
      },
      updateStatus(ids, enabled) {
        let params = {};
        params.enabled = enabled;
        params.id = ids;
        updateCategoryStatus(params).then(res => {
          if (res.resultCode == 'SUCCESS') {
            this.$Message.success("操作成功");
            this.getDataList();
          } else {
            this.$Message.error({
              content: '操作失败：' + res.message,
              duration: 5
            });
          }
        });
      },
      addData() {
        this.modalTitle = "添加一级分类";
        this.$refs.primaryDataOperForm.resetFields();
        this.primaryLevModalVisible = true;
        this.isAddOperation = true;
        this.dataOperForm.parentId = "";
        this.dataOperForm.level = 1;
      },
      addSubLevel(row) {
        console.log(row);
        this.$refs.primaryDataOperForm.resetFields();
        this.$refs.dataOperForm.resetFields();
        this.isAddOperation = true;
        this.dataOperForm.parentId = row.id;
        if (row.level === 1) {
          this.modalTitle = "添加二级子类";
          this.primaryLevModalVisible = true;
          this.dataOperForm.level = 2;
        } else {
          this.modalTitle = "添加三级子类";
          this.modalVisible = true;
          this.dataOperForm.level = 3;
        }
      },
      editData(row) {
        console.log(row);
        this.$refs.dataOperForm.resetFields();
        this.dataOperForm.id = row.id;
        this.dataOperForm.parentId = row.parentId;
        this.dataOperForm.name = row.name;
        this.dataOperForm.sort = row.sort;
        this.dataOperForm.icon = row.icon;
        this.dataOperForm.enabled = row.enabled ? "1" : "0";
        this.dataOperForm.level = row.level;
        this.isAddOperation = false;
        this.modalTitle = "编辑商品分类信息";
        if (row.level < 3) {
          this.primaryLevModalVisible = true;
          return;
        }
        this.modalVisible = true;
        getCategoryDetailById(row.id).then(res => {
          if (res.resultCode != 'SUCCESS') {
            this.$Message.error({
              content: '加载失败：' + res.message,
              duration: 5
            });
            this.modalVisible = false;
            this.primaryLevModalVisible = false;
            return;
          } else {
            res.data.attributionList.forEach(e => {
              switch (e.type) {
              case 1:
                e.attributes.forEach(attribute => {
                  this.dataOperForm.serviceList.push(attribute.id);
                })
                break;
              case 4:
                e.attributes.forEach(attribute => {
                  this.dataOperForm.attributeList.push(attribute.id);
                })
                break;
                  case 3:
                e.attributes.forEach(attribute => {
                  this.dataOperForm.activityList.push(attribute.id);
                })
                break;
              case 6:
                e.attributes.forEach(attribute => {
                  this.dataOperForm.purchaseList.push(attribute.id);
                })
                break;
              case 7:
                e.attributes.forEach(attribute => {
                  this.dataOperForm.specificationList.push(attribute.id);
                })
                break;
              default:
                break;
              }
            });
            this.dataOperForm.taxRate = res.data.taxRate;
          }
        })
      },
      submitInfo() {
        let validResult = false;
        if (this.dataOperForm.level === 3) {
          this.$refs.dataOperForm.validate(valid => {
            validResult = valid;
          })
        } else {
          this.$refs.primaryDataOperForm.validate(valid => {
            validResult = valid;
          })
        }
        if (validResult) {
          this.submitLoading = true;
          let params = this.dataOperForm;
          let goodAttributeIds = [];
          this.dataOperForm.attributeList.forEach(e => {
            goodAttributeIds.push(e);
          });
          this.dataOperForm.purchaseList.forEach(e => {
            goodAttributeIds.push(e);
          });
          this.dataOperForm.serviceList.forEach(e => {
            goodAttributeIds.push(e);
          });
          this.dataOperForm.specificationList.forEach(e => {
            goodAttributeIds.push(e);
          });
          this.dataOperForm.activityList.forEach(e => {
            goodAttributeIds.push(e);
          });
          params.goodAttributeIds = goodAttributeIds;
          if (this.isAddOperation) {
            addCategory(params).then(res => {
              this.submitLoading = false;
              if (res.resultCode == 'SUCCESS') {
                this.$Message.success("新增成功");
                this.getDataList();
                this.primaryLevModalVisible = false;
                this.modalVisible = false;
              } else {
                this.$Message.error({
                  content: '操作失败：' + res.message,
                  duration: 5
                });
              }
            })
          } else {
            updateCategory(params).then(res => {
              this.submitLoading = false;
              if (res.resultCode == 'SUCCESS') {
                this.$Message.success("修改成功");
                this.getDataList();
                this.modalVisible = false;
              } else {
                this.$Message.error({
                  content: '操作失败：' + res.message,
                  duration: 5
                });
              }
            })
          }
        } else {
          this.$Message.error({
            content: "校验不通过，请按提示规则输入数据",
            duration: 5
          });
        }
      },
      cancelSubmitInfo() {
        this.modalVisible = false;
        this.primaryLevModalVisible = false;
      },
      attributeList() {
        findAllAttribute().then(res => {
          if (res.resultCode == "SUCCESS") {
            console.log(res.data);
            this.attrInfoList = res.data;
            return;
          } else {
            findAllAttribute();
          }
        })
      },
    },
    mounted() {
      this.getDataList();
      this.attributeList();
    }
  }
</script>