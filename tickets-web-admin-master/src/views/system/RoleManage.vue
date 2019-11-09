<template>
  <div>
    <Card>
      <Row>
        <Button @click="addData" type="primary" icon="md-add">添加角色</Button>
        <Button @click="batchDeleteData" type="error" icon="ios-trash" style="margin-left: 8px ">批量删除</Button>
        <Button @click="getDataList" icon="md-refresh" style="margin-left: 8px">刷新</Button>
      </Row>

      <!-- data table start -->
      <Row style="margin-top: 2vh">
          <Table border ref="table" :columns= "columns" :data="tableData" :loading="loading" @on-selection-change="saveSelect">
            <template slot-scope="{row}" slot="action">
              <Button v-if="row.defaultRole === false" type="warning" size="small" @click="setDefault(row)" style="margin-right: 5px">设为默认</Button>
              <Button v-else size="small" type="error" @click="setDefault(row)" style="margin-right: 5px">取消默认</Button>
              <Button type="success" size="small" @click="editPerm(row)">菜单权限</Button>
              <Button type="primary" size="small" @click="editData(row)" style="margin-left: 5px">编辑</Button>
              <Button type="error" size="small" @click="deteleData(row)" style="margin-left: 5px">删除</Button>
          </template>
          <template slot-scope="{row}" slot="defaultRole">
              <Badge v-if="row.defaultRole === true" status="success" text="是" />
              <Badge v-else status="error" text="否" />
          </template>
          <template slot-scope="{row}" slot="level">
                <Badge v-if="row.level === 1" status="warning" text="超级管理员" />
                <Badge v-else-if="row.level === 2" status="success" text="普通用户" />
                <Badge v-else-if="row.level === 3" status="success" text="财务" />
                <Badge v-else-if="row.level === 4" status="success" text="运营" />
                <Badge v-else-if="row.level === 5" status="success" text="客服" />
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

    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="100" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="name">
          <Input v-model="roleForm.name" placeholder="按照Spring Security约定建议以‘ROLE_’开头" />
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="roleForm.description" />
        </FormItem>
        <FormItem label="级别" prop="level">
            <Select v-model="roleForm.level" placeholder="请选择级别">
                <Option value="1">超级管理员</Option>
                <Option value="2">普通用户 </Option>
                <Option value="3">财务</Option>
                <Option value="4">运营</Option>
                <Option value="5">客服</Option>
            </Select>
        </FormItem>
        <FormItem label="设为默认角色" prop="defaultRole">
            <RadioGroup v-model="roleForm.defaultRole">
                <Radio label="true">是</Radio>
                <Radio label="false">否</Radio>
            </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelSubmitBrandInfo">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>

    <!-- 菜单权限 -->
    <Modal :title="modalTitle" v-model="permModalVisible" :mask-closable="false" :width="500" :styles="{top: '80px'}">
      <Tree ref="tree" :data="permData" multiple show-checkbox :check-strictly="true" class="scroll"></Tree>
      <Spin size="large" v-if="treeLoading"></Spin>
      <div slot="footer">
        <Button type="text" @click="cancelPermEdit">取消</Button>
        <Select v-model="openLevel" @on-change="changeOpen()" style="width:100px;text-align:left;margin-right:10px">
          <Option value="0">展开所有</Option>
          <Option value="1">收合所有</Option>
          <Option value="2">仅展开一级</Option>
          <Option value="3">仅展开两级</Option>
        </Select>
        <Button @click="selectTreeAll">全选/反选</Button>
        <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import {searchRole,saveRole,setDefaultRole,delByIds,getPermission,saveRolePermissions} from "@/api/index";
import NoDevelop from "@/components/NoDevelop.vue";

export default {
    name: "RoleManage",
    components: {
      NoDevelop
    },
    data(){
        return{
            searchForm: {
                pageNo: 1,
                pageSize: 10
            },
            columns:[
                { key: "id", type: "selection", width: 60, fixed: "left"},
                { title: "角色名称", key: "name", align: "center", minWidth: 100, sortable: true},
                { title: "备注", key: "description", align: "center", minWidth: 100, sortable: true },
                { title: "角色级别", slot: "level", align: "center", minWidth: 100, sortable: true },
                { title: "创建时间", key: "createTime", align: "center", minWidth: 100, sortable: true },
                { title: "更新时间", key: "updateTime", align: "center", minWidth: 100, sortable: true },
                { title: "默认角色", slot: "defaultRole", align: "center", minWidth: 100, sortable: true },
                { title: "操作", slot: "action", align: "center", width: 300, fixed: "right" }
            ],
            tableData: [],
            loading: false,
            total: 0,
            selectList: [],
            selectCount: 0,
            modalTitle: "",
            roleModalVisible: false,
            roleForm: {
                id: "",
                name: "",
                description: "",
                level: "2",
                defaultRole: "false"
            },
            roleFormValidate: {
                name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
                level: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
                defaultRole: [{ required: true, message: "角色名称不能为空", trigger: "blur" }]
            },
            submitLoading: false,
            permModalVisible: false,
            openLevel: "",
            treeLoading: false,
            permData: [],
            submitPermLoading: false,
            selectAllFlag: false,
        }
    },
    methods:{    
      getDataList(){
          this.loading = true;
          let params = this.searchForm;
          searchRole(params).then(res =>{
              this.loading = false;
              if (res.resultCode == "SUCCESS") {
                  this.tableData = res.data.list;
                  this.total = res.data.total;
              }else{
                  this.$Message.error({
                      content : "操作失败：" + res.message,
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
      addData() {
        this.modalType = 0;
        this.modalTitle = "添加角色";
        this.$refs.roleForm.resetFields();
        this.roleForm.id = 0;
        this.roleModalVisible = true;
      },
      editData(row) {
        this.modalType = 1;
        this.modalTitle = "编辑角色";
        this.$refs.roleForm.resetFields();
        this.roleModalVisible = true;
        this.roleForm.id = row.id;
        this.roleForm.name = row.name;
        this.roleForm.description = row.description;
        this.roleForm.level = row.level + '';
        this.searchForm.defaultRole = row.defaultRole;
      },
      batchDeleteData() {
        if (this.selectCount <= 0){
          this.$Message.warning("您还未选择要删除的数据");
          return;
        }
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除所选的 "+ this.selectCount + " 条数据？",
          onOk: () => {
            let ids = "";
            this.selectList.forEach(function (e){
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            delByIds(ids).then(res => {
              if(res.resultCode == 'SUCCESS'){
                this.$Message.success("删除成功");
                this.getDataList();
              }
            });
          }
        });
      },
      deteleData(row){
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除角色" +': <strong> '+ row.name + '</strong> ?',
          onOk: () => {
            delByIds(row.id).then(res => {
              if(res.resultCode == 'SUCCESS'){
                this.$Message.success("删除成功");
                this.getDataList();
              }
            });
          }
        });
      },
      setDefault(row){
        let option = row.defaultRole ? '取消默认' : '设为默认'
        this.$Modal.confirm({
          title: "提示",
          content: "请确认是否要" + option + ': <strong> ' + row.name + '</strong> ?',
          onOk: () => {
            let params = {};
            params.roleId = row.id;
            params.isDefault = !row.defaultRole;
            setDefaultRole(params).then(res => {
              if(res.resultCode == 'SUCCESS'){
                this.$Message.success("设置成功");
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
      cancelSubmitBrandInfo() {
          this.roleModalVisible = false;
      },
      submitRole() {
          this.$refs.roleForm.validate(valid => {
              if(valid){
                  this.submitLoading = true;
                  saveRole(this.roleForm).then(res => {
                    this.submitLoading = false;
                    if(res.resultCode == "SUCCESS"){
                      this.$Message.success("保存成功");
                      this.getDataList();
                      this.roleModalVisible = false;
                    } else{
                      this.$Message.error({
                        content: '操作失败:' + res.message,
                        duration: 5
                      });
                    }
                  });
        }
          });
      },
      getPermissionList(row){
        getPermission(row.id).then(res => {
          this.submitLoading = false;
          if(res.resultCode == "SUCCESS"){
            this.permData = res.data;
            this.permData[0].expand = true;
          }else{
            getPermission()
          }
        });
      },
      cancelPermEdit(){
        this.permModalVisible = false;
      },
      // 全选反选
      selectTreeAll() {
        this.selectAllFlag = !this.selectAllFlag;
        let select = this.selectAllFlag;
        this.selectedTreeAll(this.permData, select);
      },
      // 递归全选节点
      selectedTreeAll(permData, select) {
        let that = this;
        permData.forEach(function (e) {
          e.checked = select;
          if (e.children && e.children.length > 0) {
            that.selectedTreeAll(e.children, select);
          }
        });
      },
      editPerm(row){
        this.modalTitle = "分配 " + row.name + " 的菜单权限";
        this.treeLoading = false;
        this.editRolePermId = row.id;
        this.getPermissionList(row);
        this.permModalVisible = true;
      },
      submitPermEdit(){
        this.submitLoading = true;
        let params = {};
        let permissionIds = [];
        let selectedNodes = this.$refs.tree.getCheckedNodes();
        selectedNodes.forEach(function (e){
          permissionIds.push(e.id);
        });
        params.permissionIds = permissionIds;
        params.roleId = this.editRolePermId;
        saveRolePermissions(params).then(res => {
          this.submitLoading = false;
          if (res.resultCode == "SUCCESS"){
            this.$Message.success("保存成功");
            this.permModalVisible = false;
            this.getDataList();
          }
        });
      },
      changeOpen(level) {
        this.permData.forEach(a => {
          a.expand = level === "1" ? false : true;
          if (a.children && a.children.length > 0) {
            a.children.forEach(b => {
              b.expand = level === "1" || level === "2" ? false : true;
              if (b.children && b.children.length > 0) {
                b.children.forEach(function (c) {
                  c.expand = level === "1" || level === "2" || level === "3" ? false : true;
                });
              }
            });
          }
        });
      }
    },
    mounted(){
        this.getDataList();
    }
}
</script>

<style lang="less" scoped>
  .scroll {
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>