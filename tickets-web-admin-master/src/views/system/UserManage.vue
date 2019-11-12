<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
          <Form-item label="昵称" prop="nickName">
            <Input type="text" v-model="searchForm.nickName" clearable placeholder="请输入" style="width: 200px" />
          </Form-item>
          <Form-item label="手机" prop="phone">
            <Input type="text" v-model="searchForm.phone" clearable placeholder="请输入" style="width: 200px" />
          </Form-item>
          <Form-item label="微信号" prop="wechat">
            <Input type="text" v-model="searchForm.wechat" clearable placeholder="请输入" style="width: 200px" />
          </Form-item>
          <Form-item label="状态" prop="enabled">
            <Select v-model="searchForm.enabled" placeholder="请选择" clearable style="width: 100px">
              <Option value="1">正常</Option>
              <Option value="0">已禁用</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle" style="margin-left: 8px">重置</Button>
          </Form-item>
        </Form>
      </Row>
      <!-- input search end -->

      <!-- data table start -->
      <Row>
        <Table border ref="table" :columns="columns" :data="tableData" :loading="loading" @on-selection-change="saveSelect">
          <template slot-scope="{ row }" slot="photo">
            <img :src="row.photo" height="40px" />
          </template>
          <template slot-scope="{ row }" slot="enabled">
            <Badge v-if="row.enabled === true" status="success" text="正常" />
            <Badge v-else status="error" text="已禁用" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button v-if="row.enabled === true" type="warning" size="small" @click="disable(row)" style="margin-left: 5px">禁用</Button>
            <Button v-else size="small" type="success" @click="disable(row)" style="margin-left: 5px">启用</Button>
          </template>
        </Table>
      </Row>
      <!-- data table end -->

      <!-- page info start -->
      <Row type="flex" justify="end" style="margin-top: 2vh">
        <Page :current="searchForm.pageNo" :page-size="searchForm.pageSize" :total="total" show-elevator show-sizer show-total @on-change="changePage" @on-page-size-change="changeSize" />
      </Row>
      <!-- page info end -->

    </Card>
  </div>
</template>

<script>
import {deleteUsers,editEnabledUser,updatePassword,saveUser,searchUsers,getAllRoleList,searchAppletUsers} from "@/api/index";
import uploadPicInput from "@/components/upload-pic-input";
import { sex } from "@/libs/variables.js";
export default {
    components: {
        uploadPicInput
    },
    data() {
        const validateMobile = (rule, value, callback) => {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(value)) {
            callback(new Error("手机号格式错误"));
        } else {
            callback();
        }
        };
        return {
            searchForm: {
                nickName: "",
                phone: "",
                wechat: "",
                enabled: "",
                pageNo: 1,
                pageSize: 10
            },
            columns: [
                { key: "id", type: "selection", width: 60, fixed: "left" },
                {
                    title: "昵称",
                    key: "nickName",
                    align: "center",
                    minWidth: 100,
                    sortable: true
                },
                { title: "手机", key: "phone", align: "center", minWidth: 100 },
                { title: "微信号", key: "wechat", align: "center", minWidth: 100 },
                { title: "状态", slot: "enabled", align: "center", minWidth: 80 },
                {
                    title: "操作",
                    slot: "action",
                    align: "center",
                    width: 200,
                    fixed: "right"
                }
            ],
            tableData: [],
            loading: true,
            total: 0,
            selectList: [],
            selectCount: 0,
            modalVisible: false,
            modalTitle: "",
            submitLoading: false,
        };
    },
    methods: {
        getDataList() {
            this.loading = true;
            let params = this.searchForm;
            searchAppletUsers(params).then(res => {
                this.loading = false;
                if (res.resultCode == "SUCCESS"){
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
        handleSearch() {
            this.getDataList();
        },
        handleReset() {
            this.$refs.searchForm.resetFields();
            this.searchForm.pageNo = 1;
            this.searchForm.pageSize = 10;
            this.getDataList();
        },
        disable(row) {
          let option = row.enabled ? '禁用' : '启用'
          this.$Modal.confirm({
            title: "提示",
            content: "请确认是否要" + option + '用户: <strong> ' + row.nickName + '</strong> ?',
            onOk: () => {
              let params = {};
              let ids = [];
              ids.push(row.id);
              params.ids = ids;
              params.enabled = !row.enabled;
              editEnabledUser(params).then(res => {
                if(res.resultCode == 'SUCCESS'){
                  this.$Message.success(option + "成功");
                  this.getDataList();
                }else{
                  this.$Message.error({
                    content: '操作失败：' + res.message,
                    duration: 5
                  });
                }
              });

            }
          });
        },
        batchDeleteData(){
          if(this.selectCount <= 0){
            this.$Message.warning("您还未选择要删除的数据");
            return;
          }
          this.$Modal.confirm({
            title: "确认删除",
            content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
            onOk: () => {
              let ids = "";
              this.selectList.forEach(function (e) {
                ids += e.id + ",";
              });
              ids = ids.substring(0, ids.length - 1);
              deleteUsers(ids).then(res => {
                if(res.resultCode == 'SUCCESS'){
                  this.$Message.success("删除成功");
                  this.getDataList();
                }
              });
            }
          });
        }
    },
    mounted() {
        this.getDataList();
        this.getRoleList();
    }
};
</script>