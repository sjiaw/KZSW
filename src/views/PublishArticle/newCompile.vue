<template>
  <div>
    <el-row v-loading="listLoading" class="warp">
      <el-col :span="23" style="margin-top: 30px">
        <el-form ref="infoForm" :model="temp" :rules="rules" label-width="120px" class="box">
          <el-form-item label="标题" prop="title">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item label="作者" prop="auth" style="width: 40%">
            <el-input v-model="temp.auth" />
          </el-form-item>
          <el-form-item label="类型" prop="auth">
            <el-select v-model="temp.type" placeholder="请选择文章类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- 使用编辑器 -->
          <el-form-item label="详细" prop="content" style="min-height:350px">
            <quill-editor ref="myQuillEditor" v-model="temp.content" :options="editorOption" class="editor" @change="onEditorChange($event)" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">确认提交</el-button>
          </el-form-item>
          <el-upload
            class="upload-demo"
            name="editorUpload"
            action=""
            :show-file-list="false"
            :http-request="upload"
            :before-upload="beforeAvatarUpload"
          />
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { putArticle, createArticle, getSTS, queryArticle } from '@/api/PublishArticle/Article'
import { getToken, getUid } from '@/utils/auth'
import { quillEditor } from 'vue-quill-editor' // 调用编辑
import 'quill/dist/quill.snow.css'
// eslint-disable-next-line no-unused-vars
import * as Quill from 'quill'
import OSS from 'ali-oss'

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
  ['blockquote'], // 引用，代码块 => 'code-block'
  [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
  [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
  [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
  [{ 'direction': 'rtl' }], // 文本方向
  [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
  [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
  [{ 'font': [] }], // 字体
  [{ 'align': [] }], // 对齐方式
  ['clean'], // 清除字体样式
  ['image', 'video'] // 上传图片、上传视频
]

export default {
  name: 'NewCompile',
  components: {
    quillEditor
  },
  data() {
    return {
      listLoading: false,
      editor: null, // 富文本编辑器对象
      content: `<p></p><p><br></p><ol></ol>`, // 富文本编辑器默认内容
      editorOption: { //  富文本编辑器配置
        placeholder: '请在这里输入文章内容',
        modules: {
          clipboard: { // 粘贴版，处理粘贴时候的自带样式
            matchers: [[Node.ELEMENT_NODE, this.HandleCustomMatcher]]
          },
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': function(value) {
                if (value) {
                  document.querySelector(".box input[name='editorUpload']").click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      temp: {
        id: undefined,
        title: '', // 标题
        auth: '', // 来源
        type: '', // 类型
        content: '' // 内容
      },
      rules: { // 表单验证
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        auth: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        type: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
        content: [{ required: true, message: '请输入详细内容', trigger: 'blur' }]
      },
      url: 'http://192.168.8.110:8803/article/uploadArticle',
      options: [{ value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }],
      Query: {
        token: 'ckw' + getToken(),
        uid: getUid()
      },
      listQuery: {
        id: undefined
      }
    }
  },
  mounted() {
    this.editor = this.$refs.myQuillEditor.quill // 初始化
    this.listQuery.id = this.$route.query.id
    this.getList()
  },
  methods: {
    onEditorReady(editor) {}, // 准备富文本编辑器
    onEditorBlur(editor) {}, // 富文本编辑器 失去焦点事件
    onEditorFocus(editor) {}, // 富文本编辑器 获得焦点事件
    onEditorChange(editor) { // 富文本编辑器 内容改变事件
      this.temp.content = editor.html
    },
    /** 搜索 */
    getList() {
      if (this.listQuery.id !== undefined) {
        this.listLoading = true
        queryArticle(this.listQuery).then(response => {
          this.temp = response.data
          this.listLoading = false
          console.log(this.temp)
        })
      }
    },
    /** 提交 */
    submit() {
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          if (this.temp.id === undefined) {
            createArticle(this.temp).then(() => {
              this.listLoading = false
              this.$message({
                message: '文章发布成功',
                type: 'success'
              })
              this.$router.push({ path: '/PublishArticle/list' })
            })
          } else {
            putArticle(this.temp).then(() => {
              this.listLoading = false
              this.$message({
                message: '文章修改成功',
                type: 'success'
              })
              this.$router.push({ path: '/PublishArticle/list' })
            })
          }
        }
      })
    },
    /** 文字、图片等，从别处复制而来，清除自带样式，转为纯文本 */
    HandleCustomMatcher(node, Delta) {
      const ops = []
      Delta.ops.forEach(op => {
        if (op.insert && typeof op.insert === 'string') {
          ops.push({
            insert: op.insert
          })
        }
      })
      Delta.ops = ops
      return Delta
    },
    /** 图片上传前验证 */
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    /** 上传图片到OSS 同时派发一个事件给父组件监听 */
    upload(item) {
      getSTS(this.Query).then(res => { // 向后台发请求 拉取OSS相关配置
        const creds = res.data
        const client = new OSS({
          region: 'oss-cn-beijing', // 服务器集群地区
          accessKeyId: creds.accessKeyId, // OSS帐号
          accessKeySecret: creds.accessKeySecret, // OSS 密码
          stsToken: creds.securityToken, // 签名token
          bucket: 'wus-open-resources', // 阿里云上存储的 Bucket
          ContentDisposition: 'inline'
        })
        function randomString(length) {
          var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
          var result = ''
          for (var i = length; i > 0; --i) { result += str[Math.floor(Math.random() * str.length)] }
          return result
        }
        const SJS = randomString(6)
        const key = 'resource/kangzhitemp/' + SJS + '.jpg' // 存储路径，并且给图片改成唯一名字
        return client.put(key, item.file) // OSS上传
      }).then(res => {
        // 获取富文本组件实例
        const quill = this.$refs.myQuillEditor.quill
        const length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.url)
        // 调整光标到最后
        quill.setSelection(length + 1)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
  p {
    margin: 10px;
  }

  .edit_container,
  .quill-editor {
    height: 300px;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }
  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }
  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }
  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }
  .avatar-uploader {
    display: none;
  }
</style>
