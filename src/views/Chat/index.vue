<template>
  <el-container style="height: 94vh;">
    <el-aside>
      <el-table :data="friendList" border style="width: 100%">
        <el-table-column prop="friend" label="好友列表" align="center" />
      </el-table>
    </el-aside>
    <el-container>
      <el-header>聊天对象</el-header>
      <el-main>对话框</el-main>
      <el-footer style="height: 200px;">输入框</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { getToken, getUid } from '@/utils/auth'
/* eslint-disable */
export default {
  name: 'Chat',
  data() {
    return {
      friendList: [{
        friend: '好友1'
      }, {
        friend: '好友2'
      }, {
        friend: '好友3'
      }, {
        friend: '好友4'
      }]
    }
  },
  mounted() {
    // 初始化融云SDK
    var im = RongIMLib.init({
      appkey: 'k51hidwqkvicb'
    });
    // 先设置监听再连接服务器
    var conversationList = []; // 当前已存在的会话列表
    im.watch({
      conversation: function(event){
        var updatedConversationList = event.updatedConversationList; // 更新的会话列表
        console.log('更新会话汇总:', updatedConversationList);
        console.log('最新会话列表:', im.Conversation.merge({
          conversationList,
          updatedConversationList
        }));
      },
      message: function(event){
        var message = event.message;
        console.log('收到新消息:', message);
      },
      status: function(event){
        var status = event.status;
        console.log('连接状态码:', status);
      }
    });
    /* 开发者后台获取或 Server API */
    var user = {
      token: 'mKmyKqTSf7aNDinwAFMnz7NXKI3dV3X0+Cd1BOxmtO2pmvsjW2HViWrePIfq0GuTu9jELQqsckv4AhfjCAKgQ=='
    };
    im.connect(user).then(function(user) {
      console.log('链接成功, 链接用户 id 为: ', user.id);
    }).catch(function(error) {
      console.log('链接失败: ', error.code, error.msg);
    });

  }
}
</script>

<!-- <script src="http://cdn.ronghub.com/RongIMLib-3.0.5-dev.js"></script> -->

<style scoped>
.el-header, .el-footer {
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
