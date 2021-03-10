<template>
<div class='user-profile'>
     <!-- 导航栏 -->
     <van-nav-bar
     class="page-nav-bar"
     title="个人信息"
     left-arrow
     @click-left="$router.back()"
/>
<input type="file" hidden ref="file" @change="onFileChange">
<!-- 个人信息 -->
<van-cell title="头像" is-link>
   <van-image
   class="avatar"
   fit="cover"
   round
   :src="user.photo"
   @click="$refs.file.click()"
/>
</van-cell>
<van-cell title="昵称" 
        :value="user.name" 
        @click="isUpdateNameShow = true"
        is-link></van-cell>
<van-cell title="性别" 
         :value="user.gender===0?'男':'女'" 
          is-link
          @click="isUpdateGenderShow = true"></van-cell>
<van-cell title="生日" :value="user.birthday" 
       @click="isUpdateBirthdayShow = true" is-link></van-cell>
 <!-- 编辑昵称的弹出层 -->
 <van-popup v-model="isUpdateNameShow" 
            style="height:100%"
            position="bottom">
            <update-name 
            v-if="isUpdateNameShow"
            @close="isUpdateNameShow = false"
            v-model="user.name"/>
            </van-popup>
<!-- 编辑性别 -->
        <van-popup v-model="isUpdateGenderShow" 
            position="bottom">
         <update-gender 
         v-if="isUpdateGenderShow"
         @close="isUpdateGenderShow = false"
         v-model="user.gender"/>
            </van-popup>
            <!-- 编辑生日 -->
            <van-popup v-model="isUpdateBirthdayShow" 
            position="bottom">
            <update-birthday 
             v-if="isUpdateBirthdayShow"
            v-model="user.birthday"
            @close="isUpdateBirthdayShow = false"/>
            </van-popup>
              <!-- 编辑头像 -->
            <van-popup v-model="isUpdatePhotoShow" 
            position="bottom" style="height:100%">
            <update-photo 
            v-if="isUpdatePhotoShow"
            :img="img" @close="isUpdatePhotoShow = false"
            @update-photo="user.photo = $event"/>
            </van-popup>
</div>
</template>
<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
     name:'UserProfile',
     components:{
          UpdateName,
          UpdateGender,
          UpdateBirthday,
          UpdatePhoto
     },
     props:{},
     data(){
     return{
          user:{},//用户的个人信息
          isUpdateNameShow:false,
          isUpdateGenderShow:false,
          isUpdateBirthdayShow:false,
          isUpdatePhotoShow:false,
          img:null //预览图片
     }
     },
     computed:{},
     watch:{},
     created(){
          this.loadUserProfile()
     },
     mounted(){},
     methods:{
          async loadUserProfile(){
            try{
             const {data} =await  getUserProfile()
             console.log(data);
             this.user = data.data
            }catch(err){
                 this.$toast('数据获取失败')
            }
         },
         onFileChange(){
              //获取文件对象
              const file = this.$refs.file.files[0]
              //基于文件对象获取blob 数据
               this.img = window.URL.createObjectURL(file)
              //console.log(data);
              this.isUpdatePhotoShow = true
              //选择同一张图片不会触发change时间 不会弹出popup
              //解决办法就是每次使用完毕 把它的value清空
              this.$refs.file.value=""
         }
     }
}
</script>
<style scoped lang='less'>
/deep/.van-nav-bar .van-icon{
  color:#fff !important;
}
.avatar{
     width: 60px;
     height: 60px;
}
.van-popup{
     background-color: #f5f7f9;
}
</style>