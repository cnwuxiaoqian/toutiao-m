<template>
    <div class="comment-reply">
        <van-nav-bar
        :title='comment.reply_count>0 ? `${comment.reply_count}条回复`:"暂无回复"'
>
<van-icon slot="left" name="cross"
@click="$emit('close')"></van-icon>
</van-nav-bar>
<div class="scroll-wrap">
    <!-- 当前评论项 -->
 <comment-item :comment="comment"/>

 <!-- 评论的回复列表 -->
 <van-cell title="全部回复"></van-cell>
 <comment-list :source="comment.com_id"
 :list="commentList"
 type="c"/>
</div>
 <!-- 底部发布评论 -->
 <div class="post-wrap">
     <van-button size="small" class="post-btn" round
     @click="isPostShow = true">发布评论</van-button>
 </div>
 <!-- 发布评论 -->
 <van-popup v-model="isPostShow" position="bottom">
     <comment-post :target="comment.com_id"
     @post-success="onPostSuccess"></comment-post>
 </van-popup>
    </div>
</template>
<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
    name:'CommentReply',
    components:{
      CommentItem,
      CommentList,
      CommentPost
    },
    props:{
        comment:{
            type:Object,
            required:true
        }
    },
    data(){
        return{
        isPostShow:false,
        commentList:[]
        }
    },
    methods:{
        onPostSuccess(data){
         //更新回复数量
         this.comment.reply_count++
         //关闭弹层
         this.isPostShow = false
         //将最新回复的内容展示到列表当中
         this.commentList.unshift(data.new_obj)
        }
    }

}
</script>
<style scoped lang="less">
.scroll-wrap{
    position: fixed;
    top:92px;
    left:0;
    right: 0;
    bottom:88px;
    overflow-y: auto;
}
.comment-reply{
   /deep/.van-nav-bar__left .van-nav-bar .van-icon{
    color: #1989fa !important;
}
}
.post-wrap{
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn{
        width: 60%;

    }
}

</style>