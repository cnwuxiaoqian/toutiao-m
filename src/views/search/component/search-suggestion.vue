<template>
    <div class="search-suggestion">
        <van-cell v-for="(text,index) in suggestions" 
         :key="index"
         icon="search"
         @click="$emit('search',text)"
         >  
        <div slot="title" v-html="highlight(text)"></div>
         </van-cell>
         <!-- 使用v-html指令可以绑定渲染带有HTML标签的字符串 -->
    </div>
</template>
<script>
import {getSearchSuggestions} from '@/api/search'
//按需加载
import {debounce} from 'lodash'
export default {
    name:'SearchSuggestion',
    data(){
        return{
            suggestions:[],//联想建议数据列表
        }
    },
    props:{
        searchText:{
            type:String,
            required:true
        }
    },
    watch:{
        searchText:{ 
        //当searchText发生改变的时候会调用
       // handler函数
       //注意：handler 函数名称是固定的
       //debounce函数 参数一 一个函数
       //参数二 延迟时间，毫秒
       //返回值 防抖之后的函数
        handler:debounce(function(value){
         this.loadSearchSuggestions(value)
        }
         ,200),
        immediate: true// 该回调函数会在侦听开始之后立即调用
    }
    },
    methods:{
       async loadSearchSuggestions(q){
        try{
           const {data} =await getSearchSuggestions(q)
           this.suggestions=data.data.options
          }catch(err){
           this.$toast('请求数据失败，请稍后重试')
          }
        },
        highlight(text){
            const highlightStr = `<span class="active">${this.searchText}</span>`
            //如果需要根据数据变量动态的创建正则表达式，则手动new RegExp
            //RegExp 正则表达式构造函数
            //参数1 匹配模式字符串 它会根据这个字符串创建正则对象
            //参数2 匹配模式，要写到字符串中
            const reg = new RegExp(this.searchText,'gi')
            return text.replace(reg,highlightStr)
        } 
    }
}

</script>
<style scoped lang="less">
 .search-suggestion{ 
    /deep/span.active{
       color:#3296fa
    }
}
</style>