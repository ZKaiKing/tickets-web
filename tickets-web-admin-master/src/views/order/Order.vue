<template>
  <div>
    <Card>
      <!-- input search start -->
      <Row>
        <Form ref="searchForm" :model="searchForm" inline :label-width="90" class="search-form">
          <Form-item label="订单状态" prop="orderState">
            <Select v-model="searchForm.orderState" placeholder="请选择" clearable style="width: 200px">
              <Option value=1>待付款</Option>
              <Option value=2>已取消</Option>
              <Option value=3>待消费</Option>
              <Option value=4>已完成</Option>
              <Option value=5>退款中</Option>
              <Option value=6>已退款</Option>
            </Select>
          </Form-item>
          <Form-item label="订单号" prop="orderId" >
            <Input type="number" v-model="searchForm.orderId" clearable placeholder="订单号" style="width: 200px" />
          </Form-item>
          <Form-item label="购买人手机号" prop="phone" >
            <Input type="number" v-model="searchForm.phone" clearable placeholder="购买人手机号" style="width: 200px" />
          </Form-item>
          <Form-item label="下单时间" prop="orderTime">
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
          <template slot-scope="{ row }" slot="orderState">
            <label v-if="row.orderState === 1" text="待付款" />
            <label v-if="row.orderState === 2" text="已取消" />
            <label v-if="row.orderState === 3" text="待消费" />
            <label v-if="row.orderState === 4" text="已完成" />
            <label v-if="row.orderState === 5" text="退款中" />
            <label v-if="row.orderState === 6" text="已退款" />
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" size="small" @click="editData(row)">查看</Button>
            <Button v-if="row.state === 3" type="error" size="small" @click="dealWith(row)" style="margin-left: 5px">退款</Button>
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
    <Modal :title="modalTitle" v-model="modalVisible" :mask-closable="false" :width="900" :styles="{top:'20px'}">
      <Divider orientation="left">订单信息</Divider>
      <div class="scroll">
        <Row style="padding-left:10px" align="middle" :gutter="0">
          <Col span="20">
          <Row class='info' >
            <p v-if="orderDetailForm.orderState == 1"><b>订单状态: </b>待付款</p>
            <p v-if="orderDetailForm.orderState == 2"><b>订单状态: </b>已取消</p>
            <p v-if="orderDetailForm.orderState == 3"><b>订单状态: </b>待消费</p>
            <p v-if="orderDetailForm.orderState == 4"><b>订单状态: </b>已完成</p>
            <p v-if="orderDetailForm.orderState == 5"><b>订单状态: </b>退款中</p>
            <p v-if="orderDetailForm.orderState == 6"><b>订单状态: </b>已退款</p>
          </Row>
          <Row class='info'><b>订单编号: </b>{{orderDetailForm.orderId}}</Row>
          <Row class='info'><b>数量: </b>{{orderDetailForm.orderNum}}</Row>
          <Row class='info'><b>座位号:  </b>{{orderDetailForm.seatStr}}</Row>
          <Row class='info'><b>场次:  </b>{{orderDetailForm.sceneName}}</Row>
          <Row class='info'><b>下单时间:  </b>{{orderDetailForm.createTime}}</Row>
          <Row class='info' v-if="orderDetailForm.orderState == 3"><b>支付时间:  </b>{{orderDetailForm.payTime}}</Row>
          <Row class='info' v-if="orderDetailForm.orderState == 6"><b>退款时间:  </b>{{orderDetailForm.refundTime}}</Row>
          <Row class='info'><b>订单金额:  </b>￥{{orderDetailForm.payAmount}}</Row>
          <Row class='info'><b>用户昵称:  </b>{{orderDetailForm.nickName}}</Row>
          <Row class='info'><b>手机号码:  </b>{{orderDetailForm.phone}}</Row>
          </Col>
        </Row>
      </div>

        <Divider orientation="left">商品信息</Divider>
        <Table border ref="table" :columns="columns1" :data="tableData1" :loading="loading">
        </Table>
      
      <div slot="footer">
        <Button type="primary" @click="closeModal" :loading="submitLoading">返回</Button>
      </div>
    </Modal>
    <!-- add or edit operation modal end-->
  </div>
</template>

<script>
  import { searchOrderList } from "@/api/index";
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
          { title: '订单号', key: 'orderId', align: 'center', minWidth: 200 },
          { title: '场次', key: 'sceneName', align: 'center', minWidth: 200 },
          { title: '昵称', key: 'nickName', align: 'center', minWidth: 100 },
          { title: '票数', key: 'orderNum', align: 'center', minWidth: 100 },
          { title: '订单金额（元）', key: 'payAmount', align: 'center', minWidth: 100 },
          { title: '购买人手机号', key: 'phone', align: 'center', minWidth: 150 },
          { title: '下单时间', key: 'createTime', align: 'center', width: 100, },
          { title: '更新时间', key: 'updateTime', align: 'center', width: 100,  },
          { title: '订单状态', slot: 'orderState', align: 'center', width: 100, },
          { title: '操作', slot: 'action', align: 'center', width: 100, fixed: "right", }
        ],
        tableData: [],
        columns1: [
          { title: '票号', key: 'ticketNo', align: 'center', minWidth: 165 },
          { title: '地址', key: 'addrDetail', align: 'center', minWidth: 165 },
          { title: '演唱会名称', key: 'ticketName', align: 'center', minWidth: 165 },
          { title: '档次', key: 'gradeName', align: 'center', minWidth: 100 },
          { title: '数量', key: 'orderNum', align: 'center', minWidth: 70 },
          { title: '单价', key: 'sellPrice', align: 'center', minWidth: 70 },
          { title: '合计', key: 'payAmount', align: 'center', width: 70, }
        ],
        tableData1: [],
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
        searchOrderList(params).then(res => {
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
      editData(row) {
        this.modalTitle = "订单详情";
        this.orderDetailForm = row;
        this.modalVisible = true;
        this.tableData1 = row.orderTempVo;
        console.log(row.orderTempVo);
        console.log(this.tableData1);
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
