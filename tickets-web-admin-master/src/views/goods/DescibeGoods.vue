<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
          <Form-item label="规格名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入规格名称" style="width: 200px" />
          </Form-item>
          <Form-item label="状态" prop="enabled">
            <Select v-model="searchForm.enabled" placeholder="请选择" clearable style="width: 200px">
              <Option value="true">已启用</Option>
              <Option value="false">已禁用</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="getDataList" type="primary" ghost icon="ios-refresh" style="margin-left: 8px ">刷新</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle" style="margin-left: 8px">重置</Button>
            <Button @click="addData" type="success" ghost icon="ios-add" style="margin-left: 8px">新增</Button>
            <Button @click="batchDeleteData" type="error" ghost icon="ios-trash" style="margin-left: 8px ">批量删除</Button>
          </Form-item>
        </Form>
      </Row>
      <!-- input search end -->

      <!-- data table start -->
      <Row>
        <Table border ref="table" :columns="columns" :data="tableData" :loading="loading" @on-selection-change="saveSelect">
          <template slot-scope="{ row }" slot="valueList">
            <span v-for="item in row.valueList" :key="item.id">{{item.name}};</span>
          </template>
          <template slot-scope="{ row }" slot="enabled">
            <Badge v-if="row.enabled === true" status="success" text="已启用" />
            <Badge v-else status="error" text="已禁用" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" @click="editData(row)">编辑</Button>
            <Button type="error" size="small" @click="deteleData(row)" style="margin-left: 5px">删除</Button>
            <Button v-if="row.enabled === false" type="success" size="small" @click="enabledData(row)" style="margin-left: 5px">启用</Button>
            <Button v-else size="small" @click="enabledData(row)" style="margin-left: 5px">禁用</Button>
          </template>
        </Table>
      </Row>
      <!-- data table end -->


      <!-- page info start -->
      <Row type="flex" justify="end" style="margin-top: 2vh">
        <Page :current="searchForm.pageNo" :page-size="searchForm.pageSize" :total=total show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changeSize" />
      </Row>
      <!-- page info end -->
    </Card>

    <!-- add or edit operation modal start-->
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="500" :style="{top:'30px'}">
      <Form ref="desGoodsForm" :model="desGoodsForm" :label-width="100" :rules="desGoodsFormValidate">
        <FormItem label="规格名称" prop="name">
          <Input v-model="desGoodsForm.name" autocomplete="off" />
        </FormItem>
        <FormItem label="排序：" prop="sort">
          <Input v-model="desGoodsForm.sort" autocomplete="off" />
        </FormItem>
        <FormItem label="状态：" prop="enabled">
          <RadioGroup v-model="desGoodsForm.enabled">
            <Radio label="1">启用</Radio>
            <Radio label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <Divider><Button type="primary" ghost icon="md-add" @click="addAttrValue()">点击添加规格值</Button></Divider>
        <FormItem v-for="(item, index) in desGoodsForm.valueList" v-if="item.status === 1" :key="item.id" :label="'规则值' + (index+1)" :prop="item.value">
          <Row>
            <Col span="18">
            <Input type="text" v-model="item.name" placeholder="请输入规格值"></Input>
            </Col>
            <Col span="4" offset="1">
            <Button @click="removeAttrValue(index)">Delete</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelSubmit">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitInfo">提交</Button>
      </div>
    </Modal>
    <!-- add or edit operation modal end-->

  </div>
</template>

<script>
  import { getGoodsAttrListByType, updateGoodsAttrStatus, deleteGoodsAttr, deleteGoodsAttrValue, addOrEditGoodsValue } from "@/api/index";
  export default {
    data() {
      return {
        searchForm: {
          name: "",
          enabled: "",
          pageNo: 1,
          pageSize: 10,
        },
        columns: [
          { key: 'id', type: 'selection', width: 60, fixed: "left" },
          { title: '规格名称', key: 'name', align: 'center', minWidth: 200, sortable: true },
          { title: '规格值', slot: 'valueList', align: 'center', minWidth: 200, sortable: true },
          { title: '排序', key: 'sort', align: 'center', minWidth: 100, sortable: true },
          { title: '状态', slot: 'enabled', align: 'center', minWidth: 100, sortable: true },
          { title: '操作', slot: 'action', align: 'center', width: 200, fixed: "right", }
        ],
        tableData: [],
        loading: true,
        total: 0,
        selectList: [],
        selectCount: 0,
        modalVisible: false,
        modalTitle: '',
        submitLoading: false,
        desGoodsForm: {
          id: 0,
          name: "",
          sort: 0,
          enabled: "1",
          valueList: [],
        },
        desGoodsFormValidate: {
          name: [
            { required: true, message: "规格名称不能为空", trigger: "change" }
          ],
          enabled: [
            { required: true, trigger: "change" }
          ],
          sort: [
            { required: true, message: '只能输入数字，支持的最大精度为2位小数', trigger: 'change', pattern: /^(([1-9]\d{0,3})|0)(\.\d{0,2})?$/, },
          ],
        },
      }
    },
    methods: {
      getDataList() {
        this.loading = true;
        let params = this.searchForm;
        params.type = 7;
        getGoodsAttrListByType(params).then(res => {
          this.loading = false;
          if (res.resultCode == 'SUCCESS') {
            this.tableData = res.data.list;
            this.total = res.data.total;
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
      saveSelect(e) {
        this.selectList = e;
        this.selectCount = e.length;
      },
      batchDeleteData() {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未选择要删除的数据");
          return;
        }
        this.$Modal.confirm({
          title: "提示",
          content: "您确认是否要删除所选中的 " + this.selectCount + " 条数据?",
          onOk: () => {
            let ids = "";
            this.selectList.forEach(function (e) {
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            deleteGoodsAttr(ids).then(res => {
              if (res.resultCode == 'SUCCESS') {
                this.$refs.table.selectAll(false);
                this.$Message.success("删除成功");
                this.getDataList();
              } else {
                this.$Message.error({
                  content: '操作失败：' + res.message,
                  duration: 5
                });
              }
            });
          }
        });
      },
      deteleData(row) {
        this.$Modal.confirm({
          title: "提示",
          content: '请确认是否要删除规格:  <strong>' + row.name + '</strong> ?',
          onOk: () => {
            deleteGoodsAttr(row.id).then(res => {
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
          content: '请确认是否要' + option + '规格:  <strong>' + row.name + '</strong> ?',
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
        updateGoodsAttrStatus(params).then(res => {
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
        this.modalTitle = "添加规格";
        this.$refs.desGoodsForm.resetFields();
        this.desGoodsForm.valueList = [];
        this.modalVisible = true;
        this.desGoodsForm.id = 0;
      },
      editData(row) {
        this.modalTitle = "编辑规格";
        this.$refs.desGoodsForm.resetFields();
        this.desGoodsForm.valueList = [];
        this.modalVisible = true;
        this.desGoodsForm.id = row.id
        this.desGoodsForm.name = row.name;
        this.desGoodsForm.sort = row.sort;
        this.desGoodsForm.enabled = row.enabled ? "1" : "0";
        row.valueList.forEach(e => {
          let item = {};
          item.status = 1;
          item.id = e.id;
          item.name = e.name;
          this.desGoodsForm.valueList.push(item);
        });
      },
      submitInfo() {
        this.$refs.desGoodsForm.validate(valid => {
          if (valid) {
            this.submitLoading = true;
            let ids = "";
            let attrValueList = [];
            this.desGoodsForm.valueList.forEach(item => {
              console.log(item.status);
              if (item.status === 0 || item.name === "") {
                ids += item.id + ",";
              } else {
                let attrValue = {};
                attrValue.attributeValueId = item.id;
                attrValue.attributeValue = item.name;
                attrValueList.push(attrValue);
              }
            });
            if (ids !== "") {
              ids = ids.substring(0, ids.length - 1);
              deleteGoodsAttrValue(ids).then(res => {
                if (res.resultCode != 'SUCCESS') {
                  this.$Message.error({
                    content: '操作失败：' + res.message,
                    duration: 5
                  });
                  return;
                }
              });
            }
            let params = {};
            params.type = 7;
            params.attributeId = this.desGoodsForm.id;
            params.attributeName = this.desGoodsForm.name;
            params.sort = this.desGoodsForm.sort;
            params.enabled = this.desGoodsForm.enabled == "1" ? true : false;
            params.standardValueInfo = attrValueList;
            addOrEditGoodsValue(params).then(opRes => {
              this.submitLoading = false;
              if (opRes.resultCode == 'SUCCESS') {
                this.$Message.success("操作成功");
                this.getDataList();
                this.modalVisible = false;
              } else {
                this.$Message.error({
                  content: '操作失败：' + opRes.message,
                  duration: 5
                });
              }
            })
          } else {
            this.$Message.error({
              content: "校验不通过，请按提示规则输入数据",
              duration: 5
            });
          }
        })
      },
      cancelSubmit() {
        this.modalVisible = false;
      },
      addAttrValue() {
        this.desGoodsForm.valueList.push({
          status: 1,
          id: 0,
          name: '',
        });
      },
      removeAttrValue(index) {
        this.desGoodsForm.valueList[index].status = 0;
      }
    },
    mounted() {
      this.getDataList();
    }
  }
</script>