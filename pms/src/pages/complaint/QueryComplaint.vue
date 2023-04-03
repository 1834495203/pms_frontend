<script setup lang="ts">
import pageHeader from '../components/pageHeader.vue'
import { onMounted, ref } from 'vue'
import axios from '../../api/request'
import { allUser, queryComplaintDto } from '../../model/entity'
import useCookie from 'vue-cookies'
import jwt from 'jwt-decode'
import { userInfo, complaint, PageResult, resultComplaintDto } from '../../model/entity'
import ComplaintDisplay from './component/ComplaintDisplay.vue'
import { IceCreamRound } from '@element-plus/icons-vue'

const complaintPage = ref<PageResult<resultComplaintDto>>()
const isLike = ref(true)
const date = ref('')
const currentUser = ref<userInfo>()
const cookie:any = useCookie
const user = ref<allUser>()
const src = ref('')
const query = ref<queryComplaintDto>({
    pubilsherId: -1
})

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

const toTest = ()=>{
    query.value!.state = '40011'
    query.value.queryTime = -1
    axios.post('/pms/form/complaint/query/1', query.value).then((res)=>{
        if(res.status === 200){
            complaintPage.value = res.data
            console.log(complaintPage.value?.items)
        }
    })
}
</script>

<template>
    <pageHeader :user="user!" :src="src" :has-anonymous="false"/>
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
                            v-model="date"
                            type="daterange"
                            unlink-panels
                            start-placeholder="开始日期"
                            end-placeholder="截至日期"
                            :default-value="[new Date(2023, 1, 1), new Date(2023, 2, 1)]"/>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="toTest">测试表单</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>

    <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>

    <div class="content">
        <ComplaintDisplay :result="complaintPage"/>
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