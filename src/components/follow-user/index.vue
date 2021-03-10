<template>
     <van-button v-if="isFollowed" 
     type="info" size="small" :loading="loading" round
     style="background-color:#fff;border:1px solid #ccc;color:black" 
      @click="onFollow">已关注</van-button> 
     <van-button v-else type="info"  round size="small" icon="plus" :loading="loading"  @click="onFollow">关注</van-button>

</template>
<script>
import { addFollow,deleteFollow } from '@/api/user'
export default {
       name:'FollowUser',
       components:{
       },
        model: {
        prop: 'isFollowed',//默认value
        event: 'update-is_followed'//默认input
      },
       props:{
           isFollowed:{
               type:Boolean,
               required:true
           },
           userId:{
               type:[Number,String,Object],
               required:true
           }
       },
       data(){
       return{
           loading:false
       }
       },
       computed:{},
       watch:{},
       created(){},
       mounted(){},
       methods:{
            async onFollow(){
           this.loading=true
           try{
            if(this.is_followed){
            //已关注 ，取消关注
            await deleteFollow(this.userId)
            }else{
              //没有关注，添加关注
            await addFollow(this.userId)
            
            }
            //更新视图状态
           //this.is_followed=!this.is_followed
           this.$emit('update-is_followed',!this.isFollowed)
           }catch(err){
               let meaasge='操作失败，请重试'
               if(err.response && err.response.status===400){
                   meaasge = '你不能关注你自己'
               }
               this.$toast(message)
           }
           this.loading=false
       }
       }
       }
</script>
<style scoped lang='less'>

</style>