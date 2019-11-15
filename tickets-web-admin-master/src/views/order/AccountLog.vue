<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="类型" prop="logType">
            <Select v-model="searchForm.logType" placeholder="请选择" clearable style="width: 200px">
              <Option value=1>订单支付</Option>
              <Option value=2>售后退款</Option>
            </Select>
          </Form-item>
          <Form-item label="关联订单号" prop="orderId" >
            <Input type="number" v-model="searchForm.orderId" clearable placeholder="订单号" style="width: 200px" />
          </Form-item>
          <Form-item label="购买人手机号" prop="phone" >
            <Input type="number" v-model="searchForm.phone" clearable placeholder="购买人手机号" style="width: 200px" />
          </Form-item>
          <Form-item label="发生时间" prop="createTime">
            <DatePicker ref="dateTimePicker" placement='top-start' type="daterange" split-panels placeholder="请选择年月日" @on-change="selectDate" clearable class="input"></DatePicker>
          </Form-item>
          <Form-item  style="margin-left:50px;" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle" style="margin-left: 8px">重置</Button>
          </Form-item>
        </Form>
      </Row>
      <!-- input search end -->

      <!-- data table start -->
      <Row>
        <Table border ref="table" :columns="columns" :data="tableData" :loading="loading" @on-selection-change="saveSelect">
          <template slot-scope="{ row }" slot="logType">
            <label v-if="row.logType === 1" >订单支付</label>
            <label v-if="row.logType === 2" >售后退款</label>
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

  </div>
</template>

<script>
  import { searchAccountLog } from "@/api/index";
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
          { title: '流水号', key: 'logId', type: 'selection', width: 60, fixed: "left" },
          { title: '昵称', key: 'nickName', align: 'center', minWidth: 200 },
          { title: '手机号', key: 'phone', align: 'center', minWidth: 200 },
          { title: '类型', slot: 'logType', align: 'center', minWidth: 100 },
          { title: '金额', key: 'amount', align: 'center', minWidth: 100 },
          { title: '关联订单号', key: 'orderId', align: 'center', minWidth: 180 },
          { title: '发生时间', key: 'createTime', align: 'center', minWidth: 150 },
        ],
        tableData: [],
        loading: true,
        total: 0,
        selectList: [],
        selectCount: 0,
        modalVisible: false,
        modalTitle: '',
        submitLoading: false,
        orderDetailForm: {
        },
      }
    },
    methods: {
      getDataList() {
        this.loading = true;
        let params = this.searchForm;
        params.type = 8;
        searchAccountLog(params).then(res => {
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
    },
    mounted() {
      this.getDataList();
    },
  }
</script>