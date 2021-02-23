<template>
    <div class="my-container">
         <div v-if="user" class="header user-info">
            <div class="base_info">
              <div class="left">
                <van-image
                class="avatar"
                src="https://img01.yzcdn.cn/vant/cat.jpeg"
                round
                fit="cover"/>
                <span class="name">{{userInfo.name}}</span>
                </div>
                <div class="right">
                    <van-button size="mini" round>编辑资料</van-button>
                </div>
            </div>
            <div class="data-stats">
                <div class="data-item">
                    <div class="count">{{userInfo.art_count}}</div>
                    <div class="text">头条</div>
                </div>
                <div class="data-item">
                    <div class="count">{{userInfo.follow_count}}</div>
                    <div class="text">关注</div>
                </div>
                <div class="data-item">
                    <div class="count">{{userInfo.fans_count}}</div>
                    <div class="text">粉丝</div>
                </div>
                <div class="data-item">
                    <div class="count">{{userInfo.like_count}}</div>
                    <div class="text">获赞</div>
                </div>
            </div>
        </div>
        <div v-else class="header not-login">
         <div class="login-btn" @click="$router.push('/login')">
             <img  class="mobile-img" src="~@/assets/mobile.png" alt="">
             <span class="text">登录 / 注册</span>
         </div>
        </div>
        <!-- 导航 -->
        <van-grid class="grid-nav" :column-num="2" clickable>
          <van-grid-item class="grid-item">
              <i slot="icon" class="toutiao toutiao-shoucang"></i>
              <span slot="text" class="text">收藏</span>
          </van-grid-item>
          <van-grid-item class="grid-item">
              <i slot="icon" class="toutiao toutiao-lishi"></i>
              <span slot="text" class="text">历史</span>
          </van-grid-item>
         </van-grid>
         <!-- 消息通知,小智同学,退出登录 -->
         <van-cell-group>
          <van-cell title="消息通知"  is-link  />
          <van-cell title="小智同学" class="mb-9" is-link />
          <van-cell v-if="user" title="退出登录" class="lgout-cell"
          @click="onLogout" clickable />
         </van-cell-group>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import {getUserInfo} from '@/api/user'
export default {
    name:"MyIndex",
    computed:{
        ...mapState(['user'])
    },
    data(){
      return{
          userInfo:{}//用户信息
      }
    },
    created(){
        //如果用户登录,则请求加载用户信息
      if(this.user){
          this.loadUserInfo()
      }
    },
    methods:{
        onLogout(){
           //退出提示
           this.$dialog.confirm({
           title: '确认退出吗?'
           })
           .then(() => {
            // on confirm
            //确认退出:清除登录状态(容器中的user+本地存存储中的user)
            this.$store.commit('setUser',null)
           })
           .catch(() => {
           // on cancel
           console.log("取消执行这里");
           });
        },
        async loadUserInfo(){
            try{
             const {data} =await getUserInfo()
             console.log(data);
             this.userInfo=data.data
            }catch(err){
              this.$toast('获取数据失败,请稍后重试')
            }
        }
    }
}
</script>
<style scoped lang="less">
.my-container{
    background-color: #ccc;
    .header{
        height: 361px;
        background:url("~@/assets/banner.png");
        background-size: cover;
    }
    .not-login{
        display: flex;
        justify-content: center;
        align-items: center;
        .login-btn{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .mobile-img{
            width: 132px;
            height: 132px;
            margin-bottom:15px ;
        }
        span.text{
            font-size: 28px;
            color: #fff;
        }
        }
    }
    .user-info{
        .base_info{
          height: 231px;
          padding: 76px 32px 23px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left{
              display: flex;
              align-items: center;
              .avatar{
                  width: 132px;
                  height: 132px;
                  margin-right: 23px;
                  border:4px solid #fff
              }
              .name{
                  font-size: 30px;
                  color:#fff
              }
          }
        }
        .data-stats{
          height: 130px;
          display: flex;
          .data-item{
              height: 100%;
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              color:#fff;
              .count{
                font-size: 36px;
              }
              .text{
                font-size: 23px;
              }
          }
        }
    }
    .grid-nav{
        .grid-item{
            height: 141px;
            i.toutiao{
                font-size: 45px;
            }
            .toutiao-shoucang{
                color:#eb5253
            }
            .toutiao-lishi{
                color:#ff9d1d;
            }
            span.text{
                font-size: 28px;
            }
        }
    }
    .mb-9{
        margin-bottom: 9px;
        
    }
    .lgout-cell{
        text-align: center;
        color: #d86262;
    }
    
}
</style>