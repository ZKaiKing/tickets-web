<template>
  <card>
    <row>
      <Form ref="searchForm" :model="searchForm" inline :label-width="80" class="search-form">
        <Form-item label="用户ID" prop="userId">
          <Input v-model="searchForm.userId" placeholder="请输入" />
        </Form-item>
        <Form-item label="手机号" prop="phone">
          <Input v-model="searchForm.phone" placeholder="请输入" />
        </Form-item>
        <Form-item label="订单号" prop="orderId">
          <Input v-model="searchForm.orderId" placeholder="请输入" />
        </Form-item>
        <Form-item label="商品ID" prop="goodsId">
          <Input v-model="searchForm.goodsId" placeholder="请输入" />
        </Form-item>
        <Form-item label="商品名称" prop="goodsName">
          <Input v-model="searchForm.goodsName" placeholder="请输入" />
        </Form-item>
        <Form-item label="评价星级" prop="startLevel">
          <Select v-model="searchForm.startLevel" placeholder="请选择" clearable style="width: 100px">
            <Option value="1">1星</Option>
            <Option value="2">2星</Option>
            <Option value="3">3星</Option>
            <Option value="4">4星</Option>
            <Option value="5">5星</Option>
          </Select>
        </Form-item>
        <Form-item label="评价时间" prop="createTime">
          <DatePicker
            ref="datePicker"
            placement="top-start"
            type="daterange"
            split-panels
            placeholder="请选择年月日"
            @on-change="selectDate"
            clearable
            class="input"
          ></DatePicker>
        </Form-item>
        <Form-item style="margin-left:-35px;" class="br">
          <Button @click="getDataList" type="primary" icon="ios-search">搜索</Button>
          <Button
            @click="handleReset"
            type="primary"
            ghost
            icon="md-remove-circle"
            style="margin-left: 8px"
          >重置</Button>
        </Form-item>
      </Form>
    </row>
    <Row>
      <Table border ref="table" :columns="columns" :data="tableData" :loading="loading">
        <template slot-scope="{ row }" slot="descriptionStartLevel">{{row.descriptionStartLevel}}星</template>
        <template slot-scope="{ row }" slot="action">
          <Button type="success" size="small" @click="viewRow(row)">
            <span
              v-if="$route.path.indexOf('evaluate-manage') >= 0 && row.evaluateVo.reply == ''"
            >查看/回复</span>
            <span v-else>查看</span>
          </Button>
        </template>
      </Table>
    </Row>
    <Row type="flex" justify="end" style="margin-top: 2vh">
      <Page
        :current="searchForm.pageNo"
        :page-size="searchForm.pageSize"
        :total="total"
        show-elevator
        show-sizer
        show-total
        @on-change="changePage"
        @on-page-size-change="changeSize"
      />
    </Row>
    <row>
      <Modal
        :title="modalTitle"
        v-model="modalVisible"
        :mask-closable="false"
        :width="900"
        :style="{top:'30px'}"
      >
        <div class="scroll">
          <Row style="padding:5px" align="middle" :gutter="20">
            <Col span="8">
              <div style="text-align:center;">
                <img :src="evaluateVo.icon" height="100" width="100" />
                <Row>
                  <Tag style="text-align:center" color="orange">{{evaluateVo.nickName}}</Tag>
                </Row>
              </div>
              <Row class="viewRow">
                <b>商品名称：</b>
                {{currRowData.goodsName}}
              </Row>
              <Row class="viewRow">
                <b>购买SKU：</b>
                {{currRowData.sku}}
              </Row>
              <Row class="viewRow">
                <b>商品均分：</b>
                <Rate disabled v-model="evaluateVo.startLevel" />
              </Row>
              <Row class="viewRow">
                <b>用户评分：</b>
                <Rate disabled v-model="currRowData.descriptionStartLevel" />
              </Row>
              <Row class="viewRow">
                <b>评分日期：</b>
                {{currRowData.createTime}}
              </Row>
            </Col>
            <div style="float:left;width: 1px;height: 400px; background:#dcdee2 "></div>
            <Col span="15">
              <Row style="padding: 10px">{{evaluateVo.content}}</Row>
              <div class="demo-upload-list" v-for="(item, index) in pictureList" :key="index">
                <img :src="item" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
              </div>
              <Divider orientation="left">回复评价</Divider>
              <Row v-if="$route.path.indexOf('evaluate-manage') < 0" class="viewRow">
                <b>回复评价：</b>
                {{evaluateVo.reply}}
              </Row>
              <Input
                v-else
                :disabled="evaluateVo.reply != ''"
                v-model="reply"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
              />
              <Button
                style="float:right;margin-top:10px"
                v-if="$route.path.indexOf('evaluate-manage') >= 0 && evaluateVo.reply == ''"
                type="success"
                @click="doReply()"
                :loading="replyLoading"
              >提交评论</Button>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal title="图片预览" v-model="visible">
        <img v-if="visible" :src="viewImgUrl" style="width: 100%" />
      </Modal>
    </row>
  </card>
</template>

<script>
import { searchEvaluate, replyEvaluate } from "@/api/index";
export default {
  data() {
    return {
      searchForm: {
        reportType: 1,
        id: "",
        storeName: "",
        endTime: "",
        startTime: "",
        pageNo: 1,
        pageSize: 10
      },
      columns: [
        { key: "evaluateId", type: "selection", width: 60, fixed: "left" },
        { title: "用户ID", key: "userId", align: "center", minWidth: 170 },
        { title: "手机号", key: "phone", align: "center", minWidth: 120 },
        { title: "订单号", key: "orderId", align: "center", minWidth: 120 },
        { title: "商品名称", key: "goodsName", align: "center", minWidth: 120 },
        {
          title: "评价星级",
          slot: "descriptionStartLevel",
          align: "center",
          minWidth: 120
        },
        {
          title: "评论时间",
          key: "createTime",
          align: "center",
          minWidth: 120
        },
        {
          title: "操作",
          slot: "action",
          // align: "center",
          minWidth: 80,
          fixed: "right"
        }
      ],
      tableData: [],
      total: 0,
      loading: false,
      modalTitle: "",
      currRowData: {},
      modalVisible: false,
      evaluateVo: {},
      pictureList: [],
      viewImgUrl: "",
      visible: false,
      reply: "",
      replyLoading: false
    };
  },
  methods: {
    selectDate(selectDate, dateType) {
      this.searchForm.startTime = selectDate[0];
      this.searchForm.endTime = selectDate[1];
    },
    getDataList() {
      this.loading = true;
      searchEvaluate(this.searchForm).then(res => {
        this.loading = false;
        if (res.resultCode == "SUCCESS") {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$Message.error({
            content: "操作失败：" + res.message,
            duration: 5
          });
        }
      });
    },
    handleReset() {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    changePage() {
      this.searchForm.pageNo = pageNo;
      this.getDataList();
    },
    changeSize() {
      this.searchForm.changeSize = changeSize;
      this.getDataList();
    },
    handleView(url) {
      this.viewImgUrl = url;
      this.visible = true;
    },
    viewRow(row) {
      this.modalVisible = true;
      this.modalTitle = "查看详情";
      this.currRowData = row;
      this.evaluateVo = row.evaluateVo;
      this.reply = this.evaluateVo.reply;
      this.pictureList = [];
      if (row.evaluateVo.picture !== "") {
        var urls = row.evaluateVo.picture.split(",");
        urls.forEach(url => {
          this.pictureList.push(url);
        });
      }
    },
    doReply() {
      let params = {};
      params.evaluateId = this.currRowData.evaluateId;
      params.orderId = this.currRowData.orderId;
      params.content = this.reply;
      this.replyLoading = true;
      replyEvaluate(params).then(res => {
        this.replyLoading = false;
        if (res.resultCode == "SUCCESS") {
          this.evaluateVo.reply = this.reply;
          this.$Message.success("操作成功！");
        } else {
          this.$Message.error({
            content: "操作失败：" + res.message,
            duration: 5
          });
        }
      });
    }
  },
  mounted() {
    this.getDataList();
  }
};
</script>

<style lang="less">
.viewRow {
  margin-top: 1vh;
  margin-left: 0vh;
}
.viewRow b {
  font-weight: bolder;
}
.scroll {
  padding: 2vh;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

.demo-upload-list {
  display: inline-block;
  width: 80px;
  height: 80px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>