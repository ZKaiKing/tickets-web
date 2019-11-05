<template>
  <div>
    <Card>
      <!-- import button start -->
      <Row>
        <div class="btn-group">
          <Button @click="openImportModel(0)" type="primary"
            icon="ios-cloud-upload-outline">{{importInfoList[0].title}}</Button>
          <Button @click="openImportModel(1)" type="primary" icon="ios-cloud-upload-outline"
            class="btn">{{importInfoList[1].title}}</Button>
          <Button @click="openImportModel(2)" type="primary" icon="ios-cloud-upload-outline"
            class="btn">{{importInfoList[2].title}}</Button>
          <Button @click="openImportModel(3)" type="primary" icon="ios-cloud-upload-outline"
            class="btn">{{importInfoList[3].title}}</Button>
        </div>
        <Form ref="searchForm" :model="searchForm" inline :label-width="60" class="option-form">
          <FormItem label="商品ID" prop="id">
            <Input type="text" v-model="searchForm.id" clearable placeholder="请输入商品ID" style="width: 200px" />
          </FormItem>
          <FormItem label="商品名称" prop="name">
            <Input type="text" v-model="searchForm.name" clearable placeholder="请输入商品名称" style="width: 200px" />
          </FormItem>
          <FormItem style="margin-left:-35px;" :label-width="80" class="br">
            <Button @click="handleSearch" type="primary" icon="ios-search">搜索</Button>
            <Button @click="handleReset" type="primary" ghost icon="md-remove-circle"
              style="margin-left: 8px">重置</Button>
          </FormItem>
        </Form>
      </Row>
      <!-- import button end -->

      <!-- data table start -->
      <Row>
        <Table border ref="table" :columns="columns" :data="tableData" expand-key="name" :expand-type="false">
        </Table>
      </Row>
      <!-- data table end -->

      <!-- page info start -->
      <Row type="flex" justify="end" style="margin-top: 2vh">
        <Page :current="searchForm.pageNo" :page-size="searchForm.pageSize" :total=total show-elevator show-sizer
          show-total @on-change="changePage" @on-page-size-change="changeSize" />
      </Row>
      <!-- page info end -->
      <upload-word ref="uploadWord" @uploadSuccee="handleReset()" :importUrl="importInfoList[impotIndex].importUrl"
        :importTitle="importInfoList[impotIndex].title" :tempUrl="importInfoList[impotIndex].tempUrl">
      </upload-word>
    </Card>
  </div>
</template>

<script>
import {
  importFinance,
  importGoodsInfo,
  importSku,
  importOperate,
  getGoodsImportList
} from "@/api/index";
import UploadWord from "@/components/UploadWord.vue";
export default {
  components: {
    UploadWord
  },
  data () {
    return {
      searchForm: {
        name: "",
        id: "",
        pageNo: 1,
        pageSize: 10,
      },
      uploadUrl: "",
      importTitle: "",
      isShowModal: false,
      columns: [{
        title: '商品ID',
        key: 'id',
        headerAlign: 'center',
        align: 'center',
        width: 200,
      },
      {
        title: '商品名称',
        key: 'name',
        headerAlign: 'center',
        align: 'center',
        minWidth: 165
      },
      {
        title: '导入时间',
        key: 'importTime',
        headerAlign: 'center',
        align: 'center',
        minWidth: 150
      }
      ],
      importInfoList: [{
        title: '商品基本信息导入',
        importUrl: importGoodsInfo,
        tempUrl: "../static/docx/导入商品基本属性信息模板.xls"
      }, {
        title: '商品运营信息导入',
        importUrl: importOperate,
        tempUrl: "../static/docx/导入商品运营信息模板.xls"
      }, {
        title: '商品财务信息导入',
        importUrl: importFinance,
        tempUrl: "../static/docx/导入商品财务信息模板.xls"
      }, {
        title: '商品SKU信息导入',
        importUrl: importSku,
        tempUrl: "../static/docx/导入商品SKU信息模板.xls"
      }],
      impotIndex: 0,
      tableData: [],
      loading: true,
      total: 0,
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.loading = true;
      let params = this.searchForm;
      getGoodsImportList(params).then(res => {
        this.loading = false;
        if (res.resultCode == 'SUCCESS') {
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        } else {
          this.$Message.error({
            content: '操作失败：' + res.message,
            duration: 5
          });
        }
      });
    },
    openImportModel (impotIndex) {
      this.impotIndex = impotIndex
      this.$refs.uploadWord.isShowModal = true
    },
    handleSearch () {
      this.getDataList();
    },
    handleReset () {
      this.$refs.searchForm.resetFields();
      this.searchForm.pageNo = 1;
      this.searchForm.pageSize = 10;
      this.getDataList();
    },
    changePage (pageNo) {
      this.searchForm.pageNo = pageNo;
      this.getDataList();
    },
    changeSize (size) {
      this.searchForm.pageSize = size;
      this.getDataList();
    }
  }
}
</script>
<style lang="less" scope>
.btn-group {
  display: flex;
  .btn {
    margin-left: 15px;
  }
}

.option-form {
  float: right;
  margin-top: 10px;
}
</style>
