<script setup lang="ts">
import PageHeader from '../components/pageHeader.vue'
import { onMounted, ref } from 'vue'
import axios from '../../api/request'
import { QueryPersonnel, allUser, PageResult, expenseInfo } from '../../model/entity'
import { ElMessage } from 'element-plus'

const expenceInfo = ref<expenseInfo>({
    price: 100,
    date: new Date()
})
const currentPage = ref(1)
const queryPersonnel = ref<QueryPersonnel>({})
const personnel = ref<PageResult<allUser>>()

//提交缴费信息
const toSubmitExpenceInfo = ()=>{
    axios.post('/pms/cost/exp/info', expenceInfo.value).then((res)=>{
        if(res.status === 200){
            if(res.data.type === 606){
                ElMessage.success(res.data.msg)
            }else ElMessage.error(res.data.msg)
        }
    }).catch((e)=>{
        ElMessage.error(e.data.errMsg)
    })
}

const filterTag = (value: string, row: allUser)=>{
    return row.propertyExpenseState!.toString() === value
}

const toChange = (val:number)=>{
    currentPage.value = val
}

const disabledDate = (val:Date)=>{
    const date = new Date()
    return date.getTime() > val.getTime()
}

const changeCron = (val:any)=>{
    console.log(val)
}

const showCron = (val:boolean)=>{

}

onMounted(()=>{
    axios.post(`pms/auth/info/prop/${currentPage.value}`, queryPersonnel).then((res)=>{
        if(res.status === 200){
            console.log(res.data)
            personnel.value = res.data
            ElMessage.success("查询成功")
        }
    })
})
</script>

<template>
    <div class="display-expense">
        <PageHeader :has-anonymous="false"/>
        <el-tabs class="demo-tabs">
            <el-tab-pane label="物业费信息" name="x">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="缴费月份">
                        <el-date-picker
                        v-model="expenceInfo.date"
                        type="month"
                        placeholder="Pick a month"
                        :disabled-date="disabledDate"/>
                    </el-form-item>
                    <el-form-item label="缴费金额">
                        <el-input-number v-model="expenceInfo.price" :precision="2" :step="0.1" :max="250" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="toSubmitExpenceInfo">提交</el-button>
                    </el-form-item>
                </el-form>

                <vue3Cron
                  @change="changeCron"
                  @close="showCron(false)"
                  max-height="400px"
                  i18n="cn"/>
            </el-tab-pane>


            <el-tab-pane label="缴费信息" name="y">
                <el-table :data="personnel?.items" stripe style="width: 100%;">
                    <el-table-column prop="username" label="用户名"/>
                    <el-table-column prop="name" label="姓名"/>

                    <el-table-column 
                    prop="propertyExpenseState" 
                    label="当月物业缴费状态"
                    :filters="[
                        { text: '已缴费', value: '10010' },
                        { text: '未缴费', value: '10011' },
                        { text: '已延迟', value: '10012' },
                    ]"
                    :filter-method="filterTag"
                    column-key="expense"
                    :filter-multiple="false"
                    filter-placement="bottom">
                        <template #default="scope">
                            <el-tag type="warning" v-if="scope.row.propertyExpenseState === 10011">未缴费</el-tag>
                            <el-tag type="danger" v-else-if="scope.row.propertyExpenseState === 10012">已拖欠</el-tag>
                            <el-tag type="success" v-if="scope.row.propertyExpenseState === 10010">已缴费</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button
                            size="small"
                            type="danger"
                            v-if="scope.row.propertyExpenseState === 10011">催促</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination 
                    v-if="personnel !== undefined && personnel !== null"
                    v-model:current-page="currentPage"
                    v-model:page-size="personnel.pageSize"
                    layout="prev, pager, next, total" 
                    v-model:total="personnel.counts"
                    @current-change="toChange"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style>
.el-table-filter__list{
    color:black;
}
</style>