<template>
    <div class="search-history">
        <van-cell title="搜素历史">
            <div v-if="isDeleteShow">
              <span @click="$emit('clear-search-history',[])">全部删除</span>
              <span @click="isDeleteShow=false">完成</span>
            </div>
            <van-icon v-else name="delete"
            @click="isDeleteShow=true"></van-icon>
        </van-cell>
        <van-cell v-for="(item,index) in searchHistories" 
        :key="index"
        :title="item"
        @click="onSearchItemClick(item,index)">
            <van-icon v-show="isDeleteShow" name="close"></van-icon>
        </van-cell>
    </div>
</template>
<script>
export default {
    name:'SearchHistory',
    //Prop 数据是受父组件影响的
    //如果是普通数据（数字、字符串、布尔值）绝对不能修改
    // 即便改了也不会传导给父组件
    
    //如果是引用类型数据（数组、对象）
    //可以修改 例如 [].push
    // 不能重新赋值 xxx=[]
    props:{
        searchHistories:{
            type:Array,
            required:true
        }
    },
    data(){
        return{
            isDeleteShow:false,//控制删除显示状态

        }
    },
    methods:{
        onSearchItemClick(item,index){
            if(this.isDeleteShow){
                //删除状态，删除历史记录数据
                this.searchHistories.splice(index,1)
            }else{
                //非删除状态 直接进行搜索
                this.$emit('search',item)
            }
        }
    }
}
</script>
<style scoped lang="less">

</style>