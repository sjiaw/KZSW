<template>
  <el-container style="padding: 0px 20px;">
    <el-header style="margin: 15px 0px; height:200px">
      <div>
        <el-carousel :interval="4000" type="card" height="200px">
          <el-carousel-item v-for="item in 6" :key="item">
            <h3 h3 class="medium">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-header>
    <el-main>
      <el-row :gutter="24" style="height: 180px;">
        <el-col :span="9">
          <el-card class="box-card" shadow="hover" style="height: 180px">
            <div slot="header" class="clearfix">
              <span>我的诊室</span>
              <el-button style="float: right; padding: 3px 0" type="text">开通与定价</el-button>
            </div>
            <div class="text item" style="text-align: center;">
              <div style="font-size: 20px;">目前有{{ amount }}名患者候诊</div>
              <router-link :to="'../Chat/index'">
                <el-button type="info" plain style="width: 40%; margin-top: 8px;">去接诊</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card" shadow="hover" style="height: 180px">
            <div class="align-center-vertical">
              <div style="font-size: 20px;">我的会员</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card" shadow="hover" style="height: 180px">
            <div class="align-center-vertical">
              <div style="font-size: 20px;">患教资料</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="box-card" shadow="hover" style="height: 180px">
            <div class="align-center-vertical">
              <div style="font-size: 20px;">我的名片</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div />
    </el-main>
  </el-container>
</template>

<script>
import { getUid, getUrl, getRealityName } from '@/utils/auth'
import { getToken } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      tokenFrom: {
        uid: getUid(),
        name: getRealityName(),
        url: getUrl()
      },
      rc_token: '',
      amount: '2',
      // 传入的图片url数组
      imageUrlList: {
        type: Array,
        default() {
          return [{}]
        }
      }
    }
  },
  mounted() {
    this.getToken()
    // window.onbeforeunload = function(e) { // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    //   var storage = window.localStorage
    //   storage.clear()
    // }
  },
  methods: {
    /** 获取融云token */
    getToken() {
      getToken(this.tokenFrom).then(response => {
        this.rc_token = response.data.rc_token
        window.localStorage.setItem('rc_token', this.rc_token)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .align-center-vertical {
    text-align: center;
    line-height: 140px;
  }
</style>
