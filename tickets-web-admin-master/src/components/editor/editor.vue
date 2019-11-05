<template>
  <div class="editor-wrapper">
    <div ref="editor"></div>
  </div>
</template>

<script>
import Editor from "wangeditor";
import "wangeditor/release/wangEditor.min.css";
import { oneOf } from "@/libs/tools";
import { uploadFile } from "@/api/index";
import { Message } from "iview";
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: ""
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: "html",
      validator: val => {
        return oneOf(val, ["html", "text"]);
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setHtml(val) {
      this.editor.txt.html(val);
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.$nextTick(() => {
        this.editor.txt.html(newVal);
      });
    }
  },
  mounted() {
    this.editor = new Editor(this.$refs.editor);
    this.editor.customConfig.onchange = html => {
      let text = this.editor.txt.text();
      if (this.cache) localStorage.editorCache = html;
      this.$emit("input", this.valueType === "html" ? html : text);
      this.$emit("on-change", html, text);
    };
    this.editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      //   "video", // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.customConfig.onchangeTimeout = this.changeInterval;
    this.editor.customConfig.uploadImgTimeout = 60000;
    this.editor.customConfig.uploadImgServer = uploadFile;
    this.editor.customConfig.uploadFileName = "files"; //上传参数 自定义
    this.editor.customConfig.uploadImgHeaders = {
      accessToken: localStorage.accessToken
    };
    this.editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {},
      success: function(xhr, editor, result) {},
      fail: function(xhr, editor, result) {
        Message.error("插入图片失败！");
      },
      error: function(xhr, editor) {
        Message.error("上传图片出错");
      },
      timeout: function(xhr, editor) {
        Message.error("上传图片超时");
      },
      customInsert: function(insertImg, result, editor) {
        var urls = result.data.split(",");
        console.log(urls);
        urls.forEach(url => {
          console.log(url);
          insertImg(url);
        });
      }
    };
    // create这个方法一定要在所有配置项之后调用
    this.editor.create();
    // 如果本地有存储加载本地存储内容
    let html = this.value || localStorage.editorCache;
    if (html) this.editor.txt.html(html);
  }
};
</script>

<style lang="less">
.editor-wrapper * {
  z-index: 100 !important;
}

.w-e-menu {
  z-index: 2 !important;
}

.w-e-text-container {
  z-index: 1 !important;
}
</style>