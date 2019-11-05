<template>
  <div>
    <Modal :title="importTitle" v-model="isShowModal" :mask-closable="false" :width="750"
      :style="{top:'30px',width:'300px'}">
      <Upload multiple type="drag" paste :action="importUrl" :headers="accessToken" :on-success="UploadSuccess"
        :format="['xlsx', 'xls']" accept=".xlsx,.xls" @on-format-error="UploadFormatError" @before-upload="UploadBefore"
        :show-upload-list="true" ref="uploadWord" name="file">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>将文件拖到此处，或点击上传</p>
        </div>
      </Upload>
      <Card dis-hover class="hint-box">
        <p class="hint-text">支持格式&nbsp;.xls,xlsx</p>
        <Button type="success" icon="ios-arrow-round-down"><a :href="tempUrl">下载excel模板</a></Button>
      </Card>
      <div slot="footer">
        <Button type="text" @click="closeModel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  getStore
} from "@/libs/storage";
import {
  uploadFile
} from "@/api/index";
export default {
  name: "UploadWord",
  props: {
    maxNum: {
      type: Number,
      default: 1
    },
    importTitle: {
      type: String,
      default: "导入"
    },
    importUrl: {
      type: String,
      required: true
    },
    tempUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isShowModal: false,
      isLoading: false,
      accessToken: {},
    };
  },
  mounted () {
    this.accessToken = {
      accessToken: getStore("accessToken")
    };
  },
  methods: {
    closeModel () {
      this.isShowModal = false
      this.$refs.uploadWord.clearFiles
    },
    UploadSuccess (res, file) {
      this.isLoading = false;
      console.log(res)
      if (res.resultCode == "SUCCESS") {
        this.closeModel()
        this.$Message.success("操作成功");
        this.$emit("uploadSuccee")
        // this.$parent.handleReset();
      } else {
        this.$Message.error(res.message);
      }
    },
    UploadFormatError (file) {
      this.isLoading = false;
      this.$Notice.warning({
        title: "不支持的文件格式",
        desc: "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .xlsx,.xls格式文件"
      });
    },
    UploadBefore () {
      const check = this.uploadList.length < this.maxNum;
      if (!check) {
        this.$Notice.warning({
          title: "最多支持上传一个文档"
        });
      }
      return check;
    }
  }
};
</script>

<style lang="less" scoped>
.hint-box {
  display: flex;
  justify-content: center;
  align-items: center;

  .hint-text {
    color: #afaaaa;
    font-size: 12px;
  }

  a {
    color: #fff;
    font-size: 14px;
  }
}
</style>
