<template>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
  :immediate-check="false"
>
  <comment-item v-for="(item,index) in list" 
  :key="index" :comment="item" 
  @reply-click="$emit('reply-click',$event)"/>
</van-list>
</template>
<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
       name:'CommentList',
       components:{
           CommentItem
       },
       props:{
           source:{
               type:[Number,String,Object],
               required:true
           },
           list:{
             type:Array,
             default:()=>[]
             
           },
           type:{
             type:String,
             //自定义Prop数据验证
             validator(value){
              return ['a','c'].includes(value)
             },
             default:'a'
           }
       },
       data(){
       return{
            //list: [],
            loading: false,
            finished: false,
            offset:null,//获取下一页数据的标记
            limit:10,
       }
       },
       computed:{},
       watch:{},
       created(){
         //当手动初始 onLoad 的话，它不会自动开始初始的loading
         //所以需要手动
         this.loading = true
           this.onLoad()
       },
       mounted(){},
       methods:{
         async onLoad() {

             try{
                  // 1 请求获取数据
                 const {data} = await getComments({
                     type:this.type,//评论类型 a-对文章(article)的评论，c - 对评论的回复
                     source:this.source.toString(),//源id，文章id或评论id
                     offset:this.offset,
                      limit:this.limit
                 })
                  // 2 将数据添加到列表中
                  const {results}= data.data
                  this.list.push(...results)
                  //将文章评论的总数量传递到外部
                  this.$emit('onload-success',data.data)
                  
                  // 3 将loading 设置为false
                    this.loading = false
                  // 4 判断是否还有数据
                  if(results.length){
                   // 有就更新获取下一页的数据页码
                   this.limit = data.data.last_id
                  }else{
                   // 没有 就将 finished 设置为结束
                   this.finished = true
                  }
                  
                 
               console.log(data);
             }catch(err){
              return  console.log(err);
             }
         
         
        
        
       },
       }
}
</script>
<style scoped lang='less'>

</style>