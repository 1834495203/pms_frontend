<script setup lang="ts">
import PageHeader from '../components/pageHeader.vue'
import BroadcastDisplay from './components/BroadcastDisplay.vue'
import { onMounted, ref, onBeforeMount } from 'vue'
import axios from '../../api/request'
import { allUser, userInfo, PageResult, QueryBroadcastDto, resultBroadcastDto } from '../../model/entity'
import { getCurrentUserInfo } from '../func/GeneralFunc'
import { ElMessage } from 'element-plus'

const user = ref<allUser>()
const src = ref('')
const isLoading = ref(true)
const currentUser = ref<userInfo>()
const currentPage = ref(1)
const pageResult = ref<PageResult<resultBroadcastDto>>({})
const condition = ref<QueryBroadcastDto>({})

const toChange = (val:number)=>{
    currentPage.value = val
}

onBeforeMount(()=>{
    currentUser.value = getCurrentUserInfo()
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            user.value = res.data.result
            if(user.value?.profile !== null)
            src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
        }
    })
})

onMounted(()=>{
    isLoading.value = true
    axios.post(`/pms/form/broadcast/query/${currentPage.value}`, condition.value).then((res)=>{
        if(res.status === 200){
            pageResult.value = res.data
            ElMessage.success('查询成功')
        }
    }).finally(()=>{
        isLoading.value = false
    })
})

</script>

<template>
    <div class="show-broadcast-for-prop">
        <PageHeader :user="user!" :src="src" :has-anonymous="false"/>
        <BroadcastDisplay :result="pageResult" :loading="isLoading" :current-user="currentUser"/>
        <el-pagination 
            v-if="pageResult !== undefined && pageResult !== null"
            v-model:current-page="currentPage"
            v-model:page-size="pageResult.pageSize"
            layout="prev, pager, next, total" 
            v-model:total="pageResult.counts"
            @current-change="toChange"/>
    </div>
</template>

<style>
</style>