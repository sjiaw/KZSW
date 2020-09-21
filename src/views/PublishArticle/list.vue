<template>
  <el-container v-loading="listLoading">
    <el-header style="margin-top: 15px">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="文章标题：">
          <el-input v-model="listQuery.title" placeholder="请输入文章标题" clearable @keyup.enter.native="getList"></el-input>
        </el-form-item>
        <el-form-item label="作者名称：">
          <el-input v-model="listQuery.auth" placeholder="请输入作者名称" clearable @keyup.enter.native="getList"></el-input>
        </el-form-item>
        <el-form-item label="文章类型：">
          <el-select v-model="listQuery.type" placeholder="请选择文章类型" @change="getList">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <router-link :to="'/PublishArticle/newCompile'">
            <el-button type="success" plain style="margin-left: 30px">新增文章</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border highlight-current-row>
        <el-table-column prop="createTime" label="创建日期" max-width="300" align="center"></el-table-column>
        <el-table-column prop="modifyTime" label="修改日期" max-width="300" align="center"></el-table-column>
        <el-table-column prop="type" label="文章类型" min-width="80" max-width="150" align="center"></el-table-column>
        <el-table-column prop="title" label="文章标题" min-width="180" align="center"></el-table-column>
        <el-table-column prop="auth" label="作者" min-width="180" max-width="300" align="center"></el-table-column>
        <el-table-column label="操作" width="360" align="center">
          <template slot-scope="{row}">
            <router-link :to="{path: '/PublishArticle/newCompile', query:{ id: row.id }}">
              <el-button type="success" size="mini" plain>编辑</el-button>
            </router-link>
            <router-link target="_blank" :to="{path:'/PublishArticle/preview', query:{ id: row.id }}">
              <el-button style="margin-left: 10px" type="primary" size="mini" plain >预览</el-button>
            </router-link>
            <el-button style="margin-left: 10px" type="danger" size="mini" plain @click="SC(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { queryList, delArticle } from '@/api/PublishArticle/Article'

export default {
  name: 'PublishArticle',
  data() {
    return {
      listLoading: true,
      listQuery: {
        title: '',
        auth: '',
        type: undefined
      },
      tableData: null,
      options: [{ value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 搜索 */
    getList() {
      this.listLoading = true
      if (this.listQuery.type == undefined) {
        this.listQuery.type = '1'
        queryList(this.listQuery).then(response => {
          this.tableData = response.data
          this.listLoading = false
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '查询失败，清重新查询!'
          })
          this.listLoading = false
        })
      } else {
        queryList(this.listQuery).then(response => {
          this.tableData = response.data
          this.listLoading = false
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '查询失败，清重新查询!'
          })
          this.listLoading = false
        })
      }
    },
    /** 删除 */
    SC(row) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>

