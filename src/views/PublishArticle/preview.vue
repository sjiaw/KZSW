<template>
  <el-container>
    <el-header>
      <div style="text-align: center; margin-top: 30px; font-weight: 700;font-size: 36px">{{temp.title}}</div>
    </el-header>
    <el-main>
      <div style="text-align: center">来源：{{temp.auth}}</div>
      <div class="editor_wrap">
        <quill-editor class="editor" v-model="temp.content" ref="myQuillEditor" :options="editorOption" @focus="onEditorFocus($event)"></quill-editor>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// 工具栏配置
const toolbarOptions = []
import { queryArticle } from '@/api/PublishArticle/Article'
import { quillEditor } from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'Preview',
  data() {
    return {
      listLoading: false,
      listQuery: {
        id: ''
      },
      temp: {
        id: undefined,
        title: '', // 标题
        auth: '', // 来源
        type: '', // 类型
        content: '' // 内容
      },
      options: [{ value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }],
      editorOption: {
        theme: 'bubble', // or 'bubble'
        placeholder: '您想说点什么？',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {}
          }
        }
      }
    }
  },
  props: {
    content: null // 编辑器的内容
  },
  components: {
    quillEditor
  },
  watch: {
    value(val) {
      // eslint-disable-next-line no-undef
      his.content = this.temp.content
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted() {
    this.listQuery.id = this.$route.query.id
    this.getList()
  },
  methods: {
    /** 搜索 */
    getList() {
      this.listLoading = true
      queryArticle(this.listQuery).then(response => {
        this.temp = response.data
        this.listLoading = false
      }).catch(() => {
        this.listLoading = true
        this.$message({
          type: 'info',
          message: '查询失败，正在重新查询!'
        })
        this.getList()
        this.listLoading = false
      })
    },
    onEditorFocus(editor) { // 富文本获得焦点时的事件
      editor.enable(false) // 在获取焦点的时候禁用
    }
  }
}
</script>

<style scoped>
  .editor_wrap /deep/ .editor img {
    max-width: 720px;
    margin:10px;
  }
  .editor_wrap /deep/ .editor .ql-bubble .ql-editor a {
     color: #136ec2;
   }
</style>
