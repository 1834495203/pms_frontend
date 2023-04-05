<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from '../../api/request'
import { PageResult } from '../../model/entity'

const page = ref<PageResult<any>>()
const prop = defineProps<{query:any, currentPage:number}>()
const emits = defineEmits(['getPageResult'])
const isLike = ref(true)
const isLoading = ref(false)
const shortcuts = [
    {
        text: '近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '近一月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '近三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]

watch(()=>prop.currentPage, ()=>{
    toTest(prop.currentPage)
})

watch(()=>page.value, ()=>{
    emits('getPageResult', page.value)
}, {deep:true})

const toTest = (val:number)=>{
    isLoading.value = true
    axios.post(`/pms/form/broadcast/query/${val}`, prop.query).then((res)=>{
        if(res.status === 200) {
            page.value = res.data
            console.log(page.value)
        }
    }).finally(()=>{
        isLoading.value = false
    })
}
</script>

<template>
    <div class="query">
        <el-form model="query" label-position="left">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="标题">
                        <el-input v-model="query.title" placeholder="请输入查询的名称"/>
                    </el-form-item>
                    <el-form-item label="模糊查询">
                        <el-switch
                        v-model="isLike"
                        class="ml-2"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="时间">
                        <div class="block">
                            <el-date-picker
                            v-model="query.queryTime"
                            type="daterange"
                            unlink-panels
                            start-placeholder="开始日期"
                            end-placeholder="截至日期"
                            :default-value="[new Date(), new Date()]"
                            :shortcuts="shortcuts"/>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="toTest(prop.currentPage)">搜索</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<style>
.query .el-col {
    justify-content: space-around;
}

.query .el-form-item {
    margin-bottom: 0;
}
</style>