<template>
  <el-upload
    class="avatar-uploader"
    list-type="picture-card"
    action="''"
    :http-request="upload"
    :before-upload="beforeAvatarUpload"
  >
    <i class="el-icon-plus" />
  </el-upload>
</template>

<script>
import { getSTS } from '@/api/PublishArticle/Article' // 向后端获取 OSS秘钥信息
import { getToken, getUid } from '@/utils/auth'
import OSS from 'ali-oss'

export default {
  name: 'Ceshi',
  data() {
    return {
      Query: {
        token: 'ckw' + getToken(),
        uid: getUid()
      }
    }
  },
  methods: {
    // 图片上传前验证
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 上传图片到OSS 同时派发一个事件给父组件监听
    upload(item) {
      getSTS(this.Query).then(res => { // 向后台发请求 拉取OSS相关配置
        const creds = res.data
        const client = new OSS({
          region: 'oss-cn-beijing', // 服务器集群地区
          accessKeyId: creds.accessKeyId, // OSS帐号
          accessKeySecret: creds.accessKeySecret, // OSS 密码
          stsToken: creds.securityToken, // 签名token
          bucket: 'wus-open-resources' // 阿里云上存储的 Bucket
        })
        const key = 'resource/' + localStorage.userId + '/images/' + '.jpg' // 存储路径，并且给图片改成唯一名字
        return client.put(key, item.file) // OSS上传
      }).then(res => {
        console.log(res.url)
        this.$emit('on-success', res.url) // 返回图片的存储路径
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
