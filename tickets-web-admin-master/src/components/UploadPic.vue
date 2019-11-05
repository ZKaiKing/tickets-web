<template>
  <div>
    <div class="demo-upload-list" :style="{'width':itemWidth,'height':itemHeight,'lineHeight':itemHeight}" v-for="item in uploadList" :key="item.url">
      <template v-if="item.status === 'finished'">
        <img :src="item.url" />
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      :action="uploadFileUrl"
      :headers="accessToken"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png','gif','bmp']"
      accept=".jpg, .jpeg, .png, .gif, .bmp"
      :max-size="5120"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      ref="upload"
      name="files"
      :multiple="multiple"
      type="drag"
      :style="{'display':'inline-block','flex-wrap':'wrap','width':itemWidth}"
    >
      <div :style="{'width':itemWidth,'height':itemHeight,'lineHeight':itemHeight}">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
    <Modal title="图片预览" v-model="visible">
      <img v-if="visible" :src="viewImgUrl" style="width: 100%" />
    </Modal>
  </div>
</template>

<script>
import { getStore } from "@/libs/storage";
import { uploadFile } from "@/api/index";
export default {
  name: "UploadPic",
  props: {
		itemWidth:{
			type: String,
			default: "60px"
		},
		itemHeight:{
			type: String,
			default: "60px"
		},
    maxNum: {
      type: Number,
      default: 5
    },
    defaultList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      viewImgUrl: "",
      visible: false,
      uploadList: [],
      accessToken: {},
      uploadFileUrl: uploadFile,
      loading: false
    };
  },
  watch: {
    defaultList(e) {
      this.$nextTick(() => {
        this.uploadList = this.$refs.upload.fileList;
        this.$emit("on-change", this.$refs.upload.fileList, this.index);
      });
    }
  },
  methods: {
    init() {
      this.accessToken = {
        accessToken: getStore("accessToken")
      };
    },
    handleView(url) {
      this.viewImgUrl = url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      this.$emit("on-change", this.$refs.upload.fileList, this.index);
    },
    handleSuccess(res, file) {
      this.loading = false;
      if (res.resultCode == 'SUCCESS') {
        file.url = res.data;
        file.index = this.index;
        this.$emit("on-change", this.$refs.upload.fileList, this.index);
      } else {
        this.$Message.error(res.message);
      }
    },
    handleFormatError(file) {
      this.loading = false;
      this.$Notice.warning({
        title: "不支持的文件格式",
        desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .jpg .jpeg .png .gif .bmp格式文件"
      });
    },
    handleMaxSize(file) {
      this.loading = false;
      this.$Notice.warning({
        title: "文件大小过大",
        desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
      });
    },
    handleBeforeUpload() {
      let check = true;
      if (this.maxNum !== 0) {
        check = this.uploadList.length < this.maxNum;
      }
      if (!check) {
        this.$Notice.warning({
          title: "最多支持上传" + this.maxNum + "张图片"
        });
      }
      return check;
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  created() {
    this.init();
  }
};
</script>

<style>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
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