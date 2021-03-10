<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">我的频道</div>
            <van-button  class="edit-btn" type="danger"
            plain round size="mini" @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
        </van-cell>
        <van-grid class="my-grid" :gutter="10">
        <van-grid-item class="grid-item" 
        v-for="(channel,index) in myChannels" 
        :key="index" @click="onMyChannnelClick(channel,index)" >
        <van-icon v-show="isEdit && !fixedChannels.includes(channel.id)" slot="icon" name="clear"></van-icon>
        <span class="text"
        :class="{active: index === active}"
         slot="text">{{channel.name}}</span>
        </van-grid-item>
        </van-grid>
         <!-- 我的频道 -->

        <!-- 频道推荐 -->
        <van-cell :border="false">
            <div slot="title" class="title-text">频道推荐</div>
        </van-cell>
        <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item 
        class="grid-item"
        icon="plus" 
        v-for="(channel,index) in recommendChannels" 
        :key="index"  :text="channel.name" @click="onAddChannel(channel)" />
        </van-grid>
        <!-- 频道推荐 -->
    </div>
</template>
<script>
import {
    getAllChannels,
    addUserChannel,
    deleteUserChannel} from '@/api/channel'
import {mapState} from 'vuex'
import {setItem} from '@/utils/storage'
export default {
    name:'ChannelEdit',
    created(){
         this.loadAllChannels()
    },
    data(){
        return{
            allChannels:[],//所有频道
            isEdit:false,//显示图标状态
            fixedChannels:[0],//固定频道。不允许删除
        }
    },
    computed:{
        ...mapState(['user']),
      recommendChannels(){
          return this.allChannels.filter(channel=>{
              return !this.myChannels.find(myChannel=>{
                  return channel.id === myChannel.id
              })
          })
        //   const channels=[]
        //   this.allChannels.forEach(channel=>{
        //     const ret = this.myChannels.find(myChannel=>{
        //           return myChannel.id ===channel.id
        //       })
        //       if(!ret){
        //           channels.push(channel)
        //       }
        //   })
        // return channels
      }
    },
    props:{
        myChannels:{
            type:Array,
            required:true
        },
        active:{
            type:Number,
            required:true
        }
    },
    methods:{
       async loadAllChannels(){
           try{
           const {data} =await getAllChannels()
           this.allChannels=data.data.channels
           }catch(err){
               this.$toast("数据获取失败")
           }
       },
      async onAddChannel(channel){
         this.myChannels.push(channel)
         //数据持久化处理
         if(this.user){
             //已登录 把数据请求接口放到线上
             try{
                  await addUserChannel({
                       id:channel.id,//频道ID
                       seq:this.myChannels.length//序号
                   })
             }catch(err){
               this.$toast('保存失败，请稍后重试')
             }
         }else{
             //未登录，把数据存储到本地
             setItem('TOUTIAO_CHANNELS',this.myChannels)
         }
       },
       onMyChannnelClick(channel,index){
          //编辑状态，执行删除频道
           if(this.isEdit){
               //1 如果是固定频道项则不删除
               if(this.fixedChannels.includes(channel.id)){
                   return
               }
               //2 删除频道项
            this.myChannels.splice(index,1)
            //参数1 要删除的元素的开始索引（包括）
            //参数2 删除的个数 如果不指定，则从参数1开始一直删除
            //3 如果删除的是激活的频道项之前的，则需更新激活的频道项
            if(index<=this.active){
              //让激活的频道索引-1
              this.$emit('update-active',this.active-1,true)
            }
            //4 处理持久化
            this.deleteChannel(channel)
           }else{
             //非编辑状态，执行切换频道
             this.$emit('update-active',index,true)
           }
         
       },
       async deleteChannel(channel){
           if(this.user){
           //已登录，则将数据更新到线上
           try{
                await deleteUserChannel(channel.id)
           }catch(err){
               this.$toast('操作失败，请稍后重试')
           }
           }else{
           //未登录，将数据更新到本地
             setItem('TOUTIAO_CHANNELS',this.myChannels)
           }
       }
    }
}
</script>
<style scoped lang="less">
.channel-edit{
    padding:80px 0;
    .title-text{
        font-size: 32px;
        color:#333;
    }
    .edit-btn{
        width: 104px;
        height: 48px;
        font-size: 26px;
        color:#f85959;
        border:1px solid #f85959;
    }
   /deep/ .grid-item{
        width: 160px;
        height: 86px;
      .van-grid-item__content {
        white-space: nowrap;
        background-color: #f4f5f6;
        .van-grid-item__text,.text{
        font-size: 28px;
        color:#222;
         margin-top: 0;
      
        }
        .active{
            color:red
        }
        .van-grid-item__icon-wrapper{
            position: unset;
        }
    }
    }
   /deep/.my-grid{
      .grid-item{
          .van-icon-clear{
              position: absolute;
              right: -10px;
              top: -10px;
              font-size: 30px;
              color: #cacaca;
              z-index: 2;
          }
      }
    }
    /deep/.recommend-grid{
        .grid-item{
            .van-grid-item__content{
              flex-direction: row;
              .van-icon-plus{
                  font-size: 28px;
                  margin-right: 6px;
              }
              
            }
        }
    }
    
}
</style>