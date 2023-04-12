<script setup lang="ts">
import pageHeader from '../components/pageHeader.vue'
import { onMounted, ref } from 'vue'
import axios from '../../api/request'
import { allUser, queryComplaintDto } from '../../model/entity'
import useCookie from 'vue-cookies'
import jwt from 'jwt-decode'
import { userInfo, PageResult, resultComplaintDto } from '../../model/entity'
import ComplaintDisplay from './component/ComplaintDisplay.vue'
import { IceCreamRound } from '@element-plus/icons-vue'

const currentPage = ref(1)
const complaintPage = ref<PageResult<resultComplaintDto>>()
const isLike = ref(true)
const isLoading = ref(false)
const currentUser = ref<userInfo>()
const cookie:any = useCookie
const user = ref<allUser>()
const src = ref('')
const query = ref<queryComplaintDto>({
    pubilsherId: -1
})

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

onMounted(()=>{
    currentUser.value = jwt(cookie.get('user'))
    query.value.pubilsherId = currentUser.value!.id
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            user.value = res.data.result
            if(user.value?.profile !== null)
            src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
        }
    })
})

const toTest = (val:number)=>{
    isLoading.value = true
    axios.post(`/pms/form/complaint/query/${val}`, query.value).then((res)=>{
        if(res.status === 200){
            complaintPage.value = res.data
        }
    }).finally(()=>{
        isLoading.value = false
    })
}

const toChange = (val:number)=>{
    currentPage.value = val
    toTest(val)
}

const toGetFilter = (val:string)=>{
    query.value.state = val
    toTest(currentPage.value)
}
</script>

<template>
    <div class="query">
        <div>
            <pageHeader :user="user!" :src="src" :has-anonymous="false"/>
        </div>
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
                        <el-button type="primary" @click="toTest(currentPage)">搜索</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>

        <div class="content">
            <ComplaintDisplay 
            :result="complaintPage" 
            :loading="isLoading" 
            :auth="(jwt(cookie.get('user')) as userInfo).auth"
            :current-user-id="(jwt(cookie.get('user')) as userInfo).id"
            @filter="toGetFilter"/>
        </div>
        <el-pagination 
        v-if="complaintPage !== undefined && complaintPage !== null"
        v-model:current-page="currentPage"
        v-model:page-size="complaintPage.pageSize"
        layout="prev, pager, next, total" 
        v-model:total="complaintPage.counts"
        @current-change="toChange"/>
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