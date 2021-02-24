<template>
    <div class="article-list">
        <!-- List列表组件：瀑布流加载，用于展示长列表
        List组件通过loading和finished两个变量
        控制加载中loading状态

        当组件初始化或滚动到底部时，会触发load时间
        并将loading自动设置成true，此时可以发起异步操作并更新数据

        数据更新完毕后 将loading设置成false即可

        若数据已全部加载完毕，则直接将finished设置成true即可

        load事件：
        List初始化会触发一次load事件，用于加载第一屏的数据
        如果一次请求加载的数据条数较少，导致列表内容无法铺满
        当前屏幕，List会继续触发load事件
        直到内容铺满屏幕或数据全部加载完成 -->
        <van-pull-refresh v-model="isRefreshLoading"  :success-text="refreshSuccessText" @refresh="onRefresh"
        success-duration="1500">
        <van-list
         v-model="loading"
         :finished="finished"
         finished-text="没有更多了"
         :error.sync="error"
         error-text="请求失败，点击重新加载"
         @load="onLoad"
          >       
         <!-- <van-cell v-for="(article,index) in list" :key="index" :title="article.title" /> -->
         <article-item v-for="(article,index) in list" :key="index" :article="article"/>
         </van-list>
         </van-pull-refresh>
    </div>
</template>
<script>
import {getArticle} from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
    name:'ArticleList',
    components:{
        ArticleItem
    },
    props:{
        channel:{
            type:Object,
            required:true
        }
    },
    data() {
    return {
      list: [],//存储列表数据的数组
      loading: false,//控制加载中loading状态
      finished: false,//控制数据加载结束状态
      timestamp:null,//请求获取下一页数据的时间戳
      error:false,//控制列表加载失败之后的提示状态
      isRefreshLoading:false,//控制下拉刷新的loading状态
      refreshSuccessText:'刷新成功'//下拉刷新成功提示文本
    };
  },
  methods: {
      //初始化或滚动到底部会触发
    async onLoad() {
        //1 请求获取数据
         try{
         const {data}=await getArticle({
             channel_id:this.channel.id,
             //timestamp 简单理解就是请求数据的页码
             //请求第一页数据：当前时间戳
             //用于请求之后数据的时间戳会在当前请求结果中返回给你
             timestamp:this.timestamp||Date.now(),
             //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
             with_top:1
         })
         //模拟随机失败的情况
        //  if(Math.random()>0.5){
        //      JSON.parse('dfdsgg')
        //  }
         //2 把请求结果放到list数组中
        const {results}=data.data
        this.list.push(...results)
         //3 本次请求加载结束之后要把加载状态设置为结束
         this.loading=false
         //4 判断是否全部加载完成
         if(results.length){
             //更新获取下一页数据的时间戳
            this.timestamp=data.data.pre_timestamp
         }else{
             this.finished=true
         }
         }catch(err){
             //展示错误提示状态
             this.err=true
             //请求失败，关闭loading
             this.loading=false
         }
       

       

        
      
    },
    //当下拉刷新时会触发该函数
    async onRefresh(){
     //1 请求获取数据
    try{
        const {data}=await getArticle({
             channel_id:this.channel.id,
             //下拉刷新每次获取最新数据
             timestamp:Date.now(),
             //是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
             with_top:1
         })
          //2 将数据追加到list数组中
          const {results}=data.data
          this.list.unshift(...results)
          //3 关闭下拉刷新的loading状态
          this.isRefreshLoading=false
           //4 更新下拉刷新成功提示文本
           this.refreshSuccessText=`刷新成功，更新了${results.length}条数据`

    }catch(err){
       this.isRefreshLoading=false
       this.refreshSuccessText='刷新失败'
    }
    
     
    }
  },

}
</script>
<style scoped>
记住列表滚动位置
.article-list{
    height: 79vh;
    overflow-y: auto;
}
</style>