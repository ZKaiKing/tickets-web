<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
          <Form-item label="用户名/账号" prop="username">
            <Input type="text" v-model="searchForm.username" clearable placeholder="请输入" style="width: 200px" />
          </Form-item>
          <Form-item label="手机" prop="phone">
            <Input type="text" v-model="searchForm.phone" clearable placeholder="请输入" style="width: 200px" />
          </Form-item>
          <Form-item label="状态" prop="enabled">
            <Select v-model="searchForm.enabled" placeholder="请选择" clearable style="width: 100px">
              <Option value="1">正常</Option>
              <Option value="0">已禁用</Option>
            </Select>
          </Form-item>
          <Form-item label="用户类型" prop="userType">
            <Select v-model="searchForm.userType" placeholder="请选择" clearable style="width: 100px">
              <Option value="1">管理员</Option>
              <Option value="2">普通用户</Option>
            </Select>
          </Form-item>
          <Form-item style="margin-left:-35px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
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
          <template slot-scope="{ row }" slot="photo">
            <img :src="row.photo" height="40px" />
          </template>
          <template slot-scope="{ row }" slot="enabled">
            <Badge v-if="row.enabled === true" status="success" text="正常" />
            <Badge v-else status="error" text="已禁用" />
          </template>
          <template slot-scope="{ row }" slot="userType">
            <span v-if="row.userType === 2">普通用户</span>
            <span v-if="row.userType === 1">管理员</span>
          </template>
          <template slot-scope="{ row }" slot="sex">
            <span v-if="row.sex === 0">女</span>
            <span v-if="row.sex === 1">男</span>
            <span v-if="row.sex === 2">保密</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" @click="editData(row)">编辑</Button>
            <Button type="error" size="small" @click="deteleData(row)" style="margin-left: 5px">删除</Button>
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
    <!-- add or edit operation modal start-->
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="500" :style="{top:'30px'}">
      <Form ref="dataOperForm" :model="dataOperForm" :label-width="70" :rules="dataOperFormValidate">
        <FormItem label="用户名" prop="username">
          <Input v-model="dataOperForm.username" :disabled="modalType !== 0" autocomplete="off" />
        </FormItem>
        <FormItem label="密码" prop="password" v-if="modalType==0" :error="errorPass">
          <Input type="password" v-model="dataOperForm.password" autocomplete="off" />
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="dataOperForm.phone" />
        </FormItem>
        <FormItem label="姓名" prop="nickName">
          <Input v-model="dataOperForm.nickName" autocomplete="off" />
        </FormItem>
        <FormItem label="性别" prop="sex">
          <RadioGroup v-model="dataOperForm.sex">
              <Radio label="2">保密</Radio>
              <Radio label="0">女</Radio>
              <Radio label="1">男</Radio>
          </RadioGroup>
        </FormItem>
        <Form-item label="头像" prop="photo">
          <upload-pic-input v-model="dataOperForm.photo"></upload-pic-input>
        </Form-item>
        <FormItem label="用户类型" prop="userType">
          <Select v-model="dataOperForm.userType" placeholder="请选择">
            <Option :value=1>管理员</Option>
            <Option :value=2>普通用户</Option>
          </Select>
        </FormItem>
        <FormItem label="角色分配" prop="roleIds">
          <Select v-model="dataOperForm.roleIds" multiple>
            <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.name">
              <span style="margin-right:10px;">{{ item.name }}</span>
                <span style="color:#ccc;">{{ item.description }}</span>
            </Option>
          </Select>
        </FormItem>
        <Divider v-if="modalType==1">
          <Button v-if="modPassword == false" type="primary" ghost icon="ios-brush" @click="modPassword = true">修改用户密码</Button>
          <Button v-else type="primary" ghost icon="ios-brush" @click="modPassword = false,dataOperForm.password = ''">放弃修改用户密码</Button>
        </Divider>
        <FormItem label="密码" prop="editPassword" v-if="modalType==1 && modPassword == true" :error="errorPass">
          <Input type="password" v-model="dataOperForm.password" autocomplete="off" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelSubmitBrandInfo">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitInfo">提交</Button>
      </div>
    </Modal>
    <!-- add or edit operation modal end-->
  </div>
</template>

<script>
import {deleteUsers,editEnabledUser,updatePassword,saveUser,searchUsers,getAllRoleList} from "@/api/index";
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
                username: "",
                phone: "",
                roleName: "",
                enabled: "",
                userType: "",
                pageNo: 1,
                pageSize: 10
            },
            columns: [
                { key: "id", type: "selection", width: 60, fixed: "left" },
                {
                    title: "用户名/账号",
                    key: "username",
                    align: "center",
                    minWidth: 100,
                    sortable: true
                },
                {
                    title: "姓名",
                    key: "nickName",
                    align: "center",
                    minWidth: 100,
                    sortable: true
                },
                { title: "用户头像", slot: "photo", align: "center", minWidth: 60 },
                { title: "用户类型", slot: "userType", align: "center", minWidth: 100 },
                { title: "所属角色", key: "roleName", align: "center", minWidth: 100 },
                { title: "手机", key: "phone", align: "center", minWidth: 100 },
                { title: "状态", slot: "enabled", align: "center", minWidth: 80 },
                {
                    title: "操作",
                    slot: "action",
                    align: "center",
                    width: 200,
                    fixed: "right"
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    align: "center",
                    minWidth: 100,
                    sortable: true
                },
                { title: "性别", slot: "sex", align: "center", minWidth: 40 }
            ],
            tableData: [],
            loading: true,
            total: 0,
            selectList: [],
            selectCount: 0,
            modalVisible: false,
            modalTitle: "",
            submitLoading: false,
            dataOperForm: {
                id: "",
                username: "",
                password: "",
                nickName: "",
                photo: "",
                sex: 2+'',
                userType: 0,
                phone: "",
                roleIds: []
            },
            dataOperFormValidate: {
                username: [
                    { required: true, message: "账号不能为空", trigger: "blur" }
                ],
                phone: [
                    { required: true, message: "手机号不能为空", trigger: "blur" },
                    { validator: validateMobile, trigger: "blur" }
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" }
                ],
                // role: [
                //     { required: true, message: "角色不能为空", trigger: "blur" }
                // ],
                // userType: [
                //     { required: true, message: "用户类型不能为空", trigger: "blur" }
                // ],
                nickName: [
                    { required: true, message: "姓名不能为空", trigger: "blur" }
                ],
            },
            roleList: [],
            errorPass: "",
            modalType: 0,
            modPassword: false
        };
    },
    methods: {
        getDataList() {
            this.loading = true;
            let params = this.searchForm;
            searchUsers(params).then(res => {
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
        getRoleList() {
            getAllRoleList().then(res => {
                if (res.resultCode == 'SUCCESS') {
                    this.roleList = res.data;
                } else {
                    getRoleList();
                }
            });
        },
        addData() {
            this.modalType = 0;
            this.modalTitle = "添加用户";
            this.$refs.dataOperForm.resetFields();
            this.modalVisible = true;
            this.dataOperForm.roleIds = [];
            this.dataOperForm.id = 0;
        },
        editData(row) {
            this.modalType = 1;
            this.modPassword = false;
            this.modalTitle = "编辑用户";
            this.$refs.dataOperForm.resetFields();
            this.modalVisible = true;
            this.dataOperForm.id = row.id;
            this.dataOperForm.username = row.username;
            this.dataOperForm.nickName = row.nickName;
            this.dataOperForm.phone = row.phone;
            this.dataOperForm.sex = row.sex+'';
            this.dataOperForm.userType = row.userType;
            this.dataOperForm.photo = row.photo;
            this.dataOperForm.password = "";
            this.dataOperForm.roleIds = [];
            row.roleList.forEach(roleElement => {
                this.dataOperForm.roleIds.push(roleElement.id);
            });
        },
        submitInfo() {
            this.$refs.dataOperForm.validate(valid => {
                if (valid) {
                    if (this.modalType === 0 || this.modPassword == true) {
                        if (this.dataOperForm.password == "" || this.dataOperForm.password == undefined) {
                            this.errorPass = "密码不能为空";
                            return;
                        }
                        if (this.dataOperForm.password.length < 6) {
                            this.errorPass = "密码长度不得少于6位";
                            return;
                        }
                    }
                    if (this.modalType === 1){
                        if (this.modPassword == false) {
                            delete this.dataOperForm.password;
                        }
                    }
                    this.submitLoading = true;
                    let params = {};
                    params = this.dataOperForm;
                    saveUser(params).then(res => {
                        this.submitLoading = false;
                        if(res.resultCode == "SUCCESS"){
                            this.$Message.success("保存成功");
                            this.getDataList();
                            this.modalVisible = false;
                        } else {
                            this.$Message.error({
                                content: '操作失败：' + res.message,
                                duration: 5
                            });
                        }
                    });
                } else {
                    this.$Message.error({
                    content: "校验不通过，请按提示规则输入数据",
                    duration: 5
            });
          }
            });
        },
        cancelSubmitBrandInfo() {
            this.modalVisible = false;
        },
        disable(row) {
          let option = row.enabled ? '禁用' : '启用'
          this.$Modal.confirm({
            title: "提示",
            content: "请确认是否要" + option + '用户: <strong> ' + row.username + '</strong> ?',
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
        deteleData(row) {
          this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除用户 " + row.username + " ?",
          onOk: () => {
            deleteUsers(row.id).then(res => {
              if (res.resultCode == 'SUCCESS') {
                this.$Message.success("删除成功");
                this.getDataList();
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