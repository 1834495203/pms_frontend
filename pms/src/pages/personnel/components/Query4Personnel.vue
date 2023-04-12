<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from '../../../api/request'
import { allUser, PageResult, QueryPersonnel } from '../../../model/entity'

const page = ref<PageResult<allUser>>()
const prop = defineProps<{query:QueryPersonnel, currentPage:number}>()
const emits = defineEmits(['getPageResult'])
const isLike = ref(true)
const isLoading = ref(false)

watch(()=>prop.currentPage, ()=>{
    toTest(prop.currentPage)
})

watch(()=>page.value, ()=>{
    emits('getPageResult', page.value)
}, {deep:true})

const toTest = (val:number)=>{
    isLoading.value = true
    axios.post(`pms/auth/info/prop/${val}`, prop.query).then((res)=>{
        if(res.status === 200) {
            page.value = res.data
        }
    }).finally(()=>{
        isLoading.value = false
    })
}
</script>

<template>
    <div class="query-personnel">
        <el-form label-position="left">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="姓名">
                        <el-input v-model="query.name" placeholder="请输入查询用户的姓名"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户名">
                        <el-input v-model="query.username" placeholder="请输入查询用户的用户名"/>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="模糊查询">
                        <el-switch
                        v-model="isLike"
                        class="ml-2"/>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="toTest(prop.currentPage)">搜索</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<style>
.query-personnel .el-col {
    justify-content: space-around;
}

.query-personnel .el-form-item {
    margin-bottom: 0;
}
</style>