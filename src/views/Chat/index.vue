<template>
  <el-container style="height: 94vh;">
    <el-aside>
      <el-table :data="friendList" border style="width: 100%">
        <el-table-column prop="friend" label="好友列表" align="center" />
      </el-table>
    </el-aside>
    <el-container>
      <el-header><span>聊天对象</span></el-header>
      <el-main>
        <ul id="chat_list" />
      </el-main>
      <el-footer style="height: 200px; padding: 0px;">
        <el-input v-model="textarea" type="textarea" :rows="30" placeholder="请输入内容" @keyup.enter.native="monitor" />
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import { getRCtoken } from '@/utils/auth'

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
      }],
      textarea: '',
      rc_token: getRCtoken(),
      im: ''
    }
  },
  mounted() {
    this.im = RongIMLib.init({ // 初始化 IM 实例(单个页面仅需初始化一次)
      appkey: 'k51hidwqkvicb'
    })
    var user = {
      token: this.rc_token
    };
    this.im.connect(user).then(function(user) {
      console.log('链接成功, 链接用户 id 为: ', user.id);
    }).catch(function(error) {
      console.log('链接失败: ', error.code, error.msg);
    })
    var conversationList = []; // 当前已存在的会话列表
    this.im.watch({
      conversation: function(event) {
        var updatedConversationList = event.updatedConversationList; // 更新的会话列表
        console.log('更新会话汇总:', updatedConversationList)
        // console.log('最新会话列表:', this.im.Conversation.merge({
        //   conversationList: conversationList,
        //   updatedConversationList: updatedConversationList
        // }))
      },
      message: function(event){
        var message = event.message;
        console.log('收到新消息', message);
      },
      status: function(event){
        var status = event.status;
        switch (status) {
          case RongIMLib.CONNECTION_STATUS.CONNECTED:
            console.log('链接成功');
            break;
          case RongIMLib.CONNECTION_STATUS.CONNECTING:
            console.log('正在连接中');
            break;
          case RongIMLib.CONNECTION_STATUS.DISCONNECTED:
            console.log('已主动断开连接');
            break;
          case RongIMLib.CONNECTION_STATUS.NETWORK_UNAVAILABLE:
            console.log('网络不可用'); // SDK 内部会自动进行重连
            break;
          case RongIMLib.CONNECTION_STATUS.SOCKET_ERROR:
            console.log('Socket 链接错误'); // SDK 内部会自动进行重连
            break;
          case RongIMLib.CONNECTION_STATUS.KICKED_OFFLINE_BY_OTHER_CLIENT:
            console.log('其他设备登录, 本端被踢'); // 己端被踢, 不可进行重连. 否则会造成多端循环互踢
            break;
          case RongIMLib.CONNECTION_STATUS.BLOCKED:
            console.log('链接断开, 用户已被封禁');
            break;
          default:
            console.log('链接状态变化为:', status);
            break;
        }
      }
    })
  },
  methods: {
    monitor() {
      var message = this.textarea
      var conversation = this.im.Conversation.get({
        targetId: '4',
        type: RongIMLib.CONVERSATION_TYPE.PRIVATE
      });
      conversation.send({
        messageType: RongIMLib.MESSAGE_TYPE.TEXT, // 'RC:TxtMsg'
        content: {
          content: message // 文本内容
        }
      }).then(function(message){
        console.log('发送文字消息成功', message);
        this.textarea = ''
      });
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
