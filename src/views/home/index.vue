<template>
    <div class="home-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" fixed>
            <van-button slot="title" type="info" size="small"
            round class="search-btn" to="/search">
            <span class="toutiao toutiao-magnifiersearch"></span>
            搜索</van-button>
        </van-nav-bar>
        <!-- 频道列表 -->
        <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
        <!-- 通过 swipeable 属性可以开启滑动切换标签页 -->
        <van-tabs class="channel-tabs" v-model="active" animated swipeable>
         <van-tab v-for="channel in channels" :title="channel.name"  :key="channel.id">
             <!-- 文章列表 -->
          <article-list :channel="channel"/>
          </van-tab>
        <div slot="nav-right" class="placeholder"></div>
        <div slot="nav-right" class="hamburger-btn" 
        @click="isChannelEditShow=true">
            <i class="toutiao toutiao-shouji"></i>
        </div>
        </van-tabs>
        <!-- 频道编辑弹出层 -->
        <van-popup
        v-model="isChannelEditShow"
        closeable
         close-icon-position="top-left"
        position="bottom"
        :style="{ height: '100%' }"
        >
        <channel-edit :active="active" :my-channels="channels" 
        @update-active="onUpdateActive"/>
        </van-popup>
    </div>
</template>
<script>
import {getUserChannels} from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import {mapState} from 'vuex'
import {getItem} from '@/utils/storage'
export default {
    name:"HomeIndex",
    components:{
        ArticleList,
        ChannelEdit
       
    },
     data(){
        return{
            active:0,
            channels:[], //频道列表
            isChannelEditShow:false//控制频道弹出层的显示状态

        }
    },
    computed:{
        ...mapState(['user'])
    },
    created(){
        this.loadChannels()
    },
    methods:{
        async loadChannels(){
            try{
                let channels=[]
              //已登录 获取数据列表
              if(this.user){
                const {data} = await getUserChannels()
                channels = data.data.channels
              }else{
                  //未登录 判断是否有本地存储数据
                  const localChannels = getItem('TOUTIAO_CHANNELS')
                  if(localChannels){
                      channels=localChannels
                  }else{
                      //没有获取默认频道列表
                       const {data} = await getUserChannels()
                       channels = data.data.channels
                  }
              }
              this.channels=channels
            }catch(err){
             this.$toast('获取频道数据失败')
            }
        },
        onUpdateActive(index,isChannelEditShow){
           this.active=index
           //关闭编辑频道弹层
           this.isChannelEditShow=isChannelEditShow
        }
    }
}
</script>
<style scoped lang="less">
.home-container{
    padding-top: 174px;
    padding-bottom: 100px;
    /deep/.van-nav-bar__title{
       max-width: unset;
    }
      .search-btn{
          width: 555px;
          height: 64px;
          background-color: #5babfb;
          border:none;
          font-size: 28px;
           display: flex;
           justify-content: center;
           align-items: center;
          .toutiao{
              font-size: 32px;
              
          }
}
  /deep/ .channel-tabs{
      .van-tabs__wrap{
          position: fixed;
          top:92px;
          z-index: 1;
          left: 0;
          right: 0;
          height: 82px;
      }
       .van-tab{
           min-width: 200px;
           border-right: 1px solid #edeff3;
           font-size:30px;
           color:#777
       }
       .van-tab--active{
           color:#333
       }
       .van-tabs__nav--line{
           padding-bottom: 0px;
       }
       .van-tabs__line{
           bottom:8px;
           width: 31px;
           height: 6px;
           background-color: #3296fa;
       }
       .placeholder{
           flex-shrink: 0;
           width: 66px;
           height: 82px;
       }
       .hamburger-btn{
           position: fixed;
           right:0;
           display: flex;
           justify-content: center;
           align-items: center;
           width: 66px;
           height: 82px;
           background-color: #fff;
           opacity: .902;
            &:before{
                position: absolute;
                left:0;
               content: "";
               width: 1px;
               height: 100%;
               background-image: url(../../assets/gradient-gray-line.png);
               background-size: contain;
           }
           i.toutiao{
               font-size: 33px;
           }
         
       } 
   }
   

}

</style>