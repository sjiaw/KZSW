<template>
  <el-container style="height: 100vh;">
    <el-aside>
      <el-table :data="friendList" border style="width: 100%">
        <el-table-column prop="date" label="好友列表" align="center" />
      </el-table>
    </el-aside>
    <el-container>
      <el-header>聊天对象</el-header>
      <el-main>对话框</el-main>
    </el-container>
  </el-container>
</template>

<script>
/* eslint-disable */
export default {
  name: 'Chat',
  data() {
    return {
        friendList: [{
          date: '2016-05-02'
        }, {
          date: '2016-05-04'
        }, {
          date: '2016-05-01'
        }, {
          date: '2016-05-03'
        }]
      }
  }
}
</script>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  text-align: center;
  width: 180px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>
