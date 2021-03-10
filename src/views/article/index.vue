<template>
    <div class="article-container">
        <!-- 导航栏 -->
        <van-nav-bar 
        class="page-nav-bar"
         left-arrow
         title="黑马头条"
        @click-left="$router.back()"
        ></van-nav-bar>
        <div class="main-wrap">
            <!-- 加载中 -->
            <div v-if="loading" class="loading-wrap">
                <van-loading type="spinner"
                color="#3296fa"
                vertical>加载中...</van-loading>
            </div>

            <!-- 加载完成 文章详情-->
            <div  v-else-if="article.title" class="article-detail">
                <!-- 文章标题 -->
                <h1 class="article-title">{{article.title}}</h1>

                <!-- 用户信息 -->
                <van-cell class="user-info" center :border="false">
                  <van-image
                   class="avatar"
                   slot="icon"
                   fit="cover"
                   round
                   :src="article.aut_photo"
                 />
                 <div slot="title" class="user-name">{{article.aut_name}}</div>
                 <div slot="label" class="publish-date">{{article.pubdate|relativeTime}}</div>
                 <!-- 模板中的$event 是时间参数
                 当我们传递给子组件的数据既要使用还要修改
                 传递 props
                 :is-followed="article.is_followed
                 修改 自定义事件
                 @update-is_followed="article.is_followed=$event"
                 简写方式 在组件上使用v-model
                 value="article.is_followed""
                 @input="article.is_followed=$event"
                 一个组件上只能使用一次 v-model
                 如果有多个数据需要实现类似于 v-model
                 的效果 可以使用属性的.sync修饰符 -->
                 <follow-user 
                 class="follow-btn" 
                 :user-id="article.aut_id"
                 v-model="article.is_followed"
                 />
                  <!-- <van-button v-if="article.is_followed" class="followed-btn" type="info" 
                   size="small" 
                   :loading="followLoading"
                 @click="onFollow">已关注</van-button>
                 <van-button v-else class="follow-btn" type="info"
                  round size="small" icon="plus" :loading="followLoading"
                  @click="onFollow">关注</van-button> -->
                </van-cell>

                <!-- 文章内容 -->
                <div class="article-content markdown-body" 
                ref="article-content" v-html="article.content"></div>
                <van-divider>正文结束</van-divider>
                <!-- 文章评论列表 -->
                <comment-list  :source="article.art_id"
                :list="commentList" @reply-click="onReplyClick"
                @onload-success="totalCommentCount = $event.total_count"/>  
                  <!-- 底部区域 -->
                 <div class="artile-bottom">
                     <van-button class="comment-btn" type="default" round size="small"
                     @click="isPostShow = true">写评论</van-button>
                     <van-icon name="comment-o" :badge="totalCommentCount" color="#777"></van-icon>
                     <collect-article class="btn-item"
                     v-model="article.is_collected"
                     :article-id="article.art_id"/>
                    <like-article class="btn-item"
                    v-model="article.attitude"
                     :article-id="article.art_id"/>
                      <van-icon name="share" color="#777777"></van-icon>
                 </div>
                 <!-- 发布评论弹出层 -->
                 <van-popup v-model="isPostShow" position="bottom">
                     <comment-post :target="article.art_id" @post-success="onPostSuccess" />
                 </van-popup>
            </div>

            <!-- 加载失败 404 -->
            <div v-else-if="errorStatus === 404" class="error-wrap">
                <van-icon name="failure"></van-icon>
                <p class="text">该资源不存在或已删除</p>
            </div>

            <!-- 加载失败：其他未知错误（例如网络原因或服务端异常） -->
              <div v-else class="error-wrap">
                <van-icon name="failure"></van-icon>
                <p class="text">内容加载失败</p>
                <van-button class="retry-btn" 
                @click="loadArticle">点击重试</van-button>
              </div>
        </div>

         <!-- 评论回复弹出层 -->
         <!-- 弹出层是懒渲染的：只有在第一次展示的十九才会渲染里面的内容，之后它的关闭和显示都是在切换内容的显示与隐藏 -->
          <!-- v-if 条件渲染 
          true 渲染元素节点
          false 不渲染 -->
                 <van-popup v-model="isReplyShow" position="bottom" style="height:100%;">
                   <comment-reply v-if="isReplyShow" :comment="currentComment"
                   @close="isReplyShow = false"/>
                 </van-popup>



      
    </div>
</template>

<script>
import {getArticleById} from '@/api/article'
import { ImagePreview } from 'vant';
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
export default {
    name:'ArticleIndex',
    components:{
      FollowUser,
      CollectArticle,
      LikeArticle,
      CommentList,
      CommentPost,
      CommentReply
    },
    props:{
        articleId:{
            type:[Number,String,Object],
            required:true
        }
    },
    //给所有后代组件提供数据
    provide:function(){
        return {
         articleId:this.articleId
        }
    },
    data(){
        return{
           article:{},//文章详情
           loading:true,//加载中的状态
           errorStatus:0,//失败的状态码
           followLoading:false,//
           totalCommentCount:0,
           isPostShow:false,//控制发布评论弹出层显示状态
           commentList:[],
           isReplyShow:false,
           currentComment:{},//当前点击回复的评论项
        }
    },
    computed:{

    },
    watch:{},
    created(){
        this.loadArticle()
    },
    mounted(){},
    methods:{
       async loadArticle(){
           this.loading=true
           try{
          const {data} = await getArticleById(this.articleId)
          //数据驱动视图这件事不是立即的
          this.article = data.data
          //初始化图片点击预览
          setTimeout(()=>{
             this.previewImage()
          },0)
         
          //请求成功关闭loading
           }catch(err){
               if(err.response && err.response.status){
                   this.errorStatus=404
               }
            console.log('获取文章失败，点击重新获取');
           }
           this.loading=false
       },
       previewImage(){
           //得到所有的img节点
           const articleContent = this.$refs['article-content']
           const imgs = articleContent.querySelectorAll('img')
           const images = []
           imgs.forEach((img,index)=>{
               images.push(img.src)
               img.onclick=()=>{
                ImagePreview({
                 images,
                 startPosition: index,//起始位置，从0开始
                });
               }
           })
       },
       onPostSuccess(data){
           //关闭弹出层
           this.isPostShow = false
           //将发布内容显示到列表顶部
            this.commentList.unshift(data.new_obj)
       },
       onReplyClick(comment){
           this.currentComment = comment
            console.log(comment);
            this.isReplyShow = true
       }
      
    }
}
</script>
<style scoped lang="less">
@import "./github-markdown.css";
.article-container{
    .main-wrap{
        position: fixed;
        left: 0;
        right: 0;
        top: 92px;
        bottom: 88px;
        overflow-y: scroll;
        background-color: #fff;
        .article-detail{
            .article-title{
                font-size: 40px;
                padding:50px 32px;
                margin: 0;
                color:#3a3a3a;
            }
            .user-info{
                padding:0 32px;
                .avatar{
                    width: 70px;
                    height: 70px;
                    margin-right: 17px;
                }
                .van-cell__label{
                   margin-top: 0;
                   line-height:20px ;
                }
                .user-name{
                    font-size: 24px;
                    color:#3a3a3a
                }
                .publish-date{
                    font-size: 23px;
                    color:#b7b7b7;
                }
                .follow-btn{
                    width: 170px;
                    height: 58px;
                }
               
            }
            .article-content{
                padding:55px 32px;
            }
             /deep/.van-cell {
                    line-height: 40px!important;
                }
        }
        .error-wrap{
            padding:200px 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            .van-icon{
                font-size: 122px;
                color:#b4b4b4
            }
            .text{
                font-size: 30px;
                color:#666;
                margin:33px 0 46px
            }
            .retry-btn{
                width: 280px;
                height: 70px;
                border:1px solid #c3c3c3;
                font-size: 30px;
                color:#666
            }
        }
        .followed-btn{
            width: 170px;
            height: 58px;
           color:black;
           background-color: #fff;
           border:none;

        }
    }
   .loading-wrap{
       padding:200px 32px;
       display: flex;
       justify-content: center;
       align-items: center;
       background-color: #fff;
   }
   .artile-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item{
        border:none;
        padding: 0;
        height: 40px;
        line-height: 40px;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
  /deep/ .van-nav-bar .van-icon{
       color:#fff !important
   }
 
}

</style>