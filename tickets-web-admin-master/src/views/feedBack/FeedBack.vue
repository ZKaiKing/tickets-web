<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="状态" prop="state">
            <Select v-model="searchForm.state" placeholder="请选择" clearable style="width: 200px">
              <Option value=1>已处理</Option>
              <Option value=0>未处理</Option>
            </Select>
          </Form-item>
          <Form-item label="搜索关键字" prop="keyWord" >
            <Input type="text" v-model="searchForm.keyWord" clearable placeholder="请输入搜索内容" style="width: 200px" />
          </Form-item>
          <Form-item label="反馈时间" prop="dealTime">
            <DatePicker ref="dateTimePicker" placement='top-start' type="daterange" split-panels placeholder="请选择年月日" @on-change="selectDate" clearable class="input"></DatePicker>
          </Form-item>
          <Form-item  style="margin-left:50px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle" style="margin-left: 8px">重置</Button>
            <Button @click="batchDealWith" type="error" ghost icon="ios-trash" style="margin-left: 8px ">批量标记已处理</Button>
          </Form-item>
        </Form>
      </Row>
      <!-- input search end -->

      <!-- data table start -->
      <Row>
        <Table border ref="table" :columns="columns" :data="tableData" :loading="loading" @on-selection-change="saveSelect">
          <template slot-scope="{ row }" slot="state">
            <Badge v-if="row.state === 1" status="success" text="已处理" />
            <Badge v-else status="error" text="未处理" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" @click="editData(row)">查看</Button>
            <Button v-if="row.state === 0" type="success" size="small" @click="dealWith(row)" style="margin-left: 5px">标记已处理</Button>
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
    <Modal title="反馈详情" v-model="modalVisible" :mask-closable="false" :width="500" :styles="{top:'20px'}">
      <div class="scroll">
        <Row style="padding-left:10px" align="middle" :gutter="20">
          <Col span="5">
          <Row class='info' ><b>状态： </b></Row>
          <Row class='info'><b>用户ID： </b></Row>
          <Row class='info'><b>用户昵称：</b></Row>
          <Row class='info'><b>反馈时间： </b></Row>
          <Row class='info'><b>反馈内容： </b></Row>
          <Row class='info'><br/></Row>
          </Col>
          <Col span="15">
          <Row class='info-concent'>
            <p v-if="feedBackForm.state == 1">已处理</p>
            <p v-if="feedBackForm.state == 0">未处理</p>
          </Row>
          <Row class='info-concent'>{{feedBackForm.id}}</Row>
          <Row class='info-concent'>{{feedBackForm.nickName}}</Row>
          <Row class='info-concent'>{{feedBackForm.feedBackTime}}</Row>
          <Row class='info-concent'>{{feedBackForm.content}}</Row>
          <Row class='info-concent'><br/></Row>
          </Col>
        </Row>
        <Row  v-if="feedBackForm.state == 1" style="padding-left:10px" align="middle" :gutter="20">
          <Col span="5">
          <Row class='info'><b>处理人： </b></Row>
          <Row class='info'><b>处理时间： </b></Row>
          </Col>
          <Col span="15">
          <Row class='info-concent'>{{feedBackForm.dealPeople}}</Row>
          <Row class='info-concent'>{{feedBackForm.dealTime}}</Row>
          </Col>
        </Row>
      </div>

      <div slot="footer">
        <Button type="success" v-if="feedBackForm.state == 0" @click="dealWith(feedBackForm)" :loading="submitLoading">标记已处理</Button>
        <Button type="primary" @click="closeModal" :loading="submitLoading">返回</Button>
      </div>
    </Modal>
    <!-- add or edit operation modal end-->
  </div>
</template>

<script>
  import { searchFeedBack, dealWithFeedBack } from "@/api/index";
  import uploadPicInput from "@/components/upload-pic-input";
  export default {
    components: {
      uploadPicInput
    },
    data() {
      return {
        searchForm: {
          name: "",
          pageNo: 1,
          pageSize: 10,
        },
        columns: [
          { key: 'id', type: 'selection', width: 60, fixed: "left" },
          { title: '昵称', key: 'nickName', align: 'center', minWidth: 200 },
          { title: '内容', key: 'content', align: 'center', minWidth: 200 },
          { title: '反馈时间', key: 'feedBackTime', align: 'center', minWidth: 200 },
          { title: '状态', slot: 'state', align: 'center', minWidth: 100 },
          { title: '处理人', key: 'dealPeople', align: 'center', minWidth: 200 },
          { title: '处理时间', key: 'dealTime', align: 'center', minWidth: 200 },
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
        feedBackForm: {
        },
      }
    },
    methods: {
      getDataList() {
        this.loading = true;
        let params = this.searchForm;
        params.type = 8;
        searchFeedBack(params).then(res => {
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
      selectDate(selectDate, dateType) {
        this.searchForm.startTime = selectDate[0];
        this.searchForm.endTime = selectDate[1];
      },
      //批量标记已处理
      batchDealWith() {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未选择要处理的数据");
          return;
        }
        this.$Modal.confirm({
          title: "提示",
          content: "您确认是否要标记已处理所选中的 " + this.selectCount + " 条数据?",
          onOk: () => {
            let ids = "";
            this.selectList.forEach(function (e) {
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            dealWithFeedBack(ids).then(res => {
              if (res.resultCode == 'SUCCESS') {
                this.$refs.table.selectAll(false);
                this.$Message.success("操作成功");
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
      //单条记录标记已处理
      dealWith(row) {
        this.$Modal.confirm({
          title: "提示",
          content: '请确认是否要标记已处理?',
          onCancel: () => this.modalVisible = false,
          onOk: () => {
            this.modalVisible = false;
            dealWithFeedBack(row.id).then(res => {
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
        });
      },
      editData(row) {
        this.modalVisible = true;
        this.feedBackForm = row;
        // this.feedBackForm.id = row.id
        // this.feedBackForm.nickName = row.nickName;
        // this.feedBackForm.content = row.content;
        // this.feedBackForm.feedBackTime = row.feedBackTime;
        // this.feedBackForm.state = row.state ? "1" : "0";
        // this.feedBackForm.dealPeople = row.dealPeople;
        // this.feedBackForm.dealTime = row.dealTime;
      },
      closeModal() {
        this.modalVisible = false;
      }
    },
    mounted() {
      this.getDataList();
    },
  }
</script>


<style lang="less">
.scroll {
  padding: 2vh;
  height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>