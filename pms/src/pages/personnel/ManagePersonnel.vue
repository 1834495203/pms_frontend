<script setup lang="ts">
import { ref, onMounted } from 'vue'
import pageHeader from '../components/pageHeader.vue'
import { PageResult, Proprietor, QueryPersonnel, ResultHouseDto } from '../../model/entity'
import Query4Personnel from './components/Query4Personnel.vue'
import { checkUserAuth } from '../func/GeneralFunc'
import { useRouter } from 'vue-router'
import axios from '../../api/request'
import { ElMessage, CascaderValue } from 'element-plus'
import InputUserInfo from './components/InputUserInfo.vue'

const addUser = ref(false)
const onAddProp = ref<Proprietor>({propertyExpenseState:40011})
const dialogVisible = ref(false)
const options = ref<ResultHouseDto[]>([])
const currentFilter = ref()
const router = useRouter()
const isLoading = ref(false)
const alterPropInfo = ref(false)
const currentPage = ref(1)
const proprietors = ref<PageResult<Proprietor>>()
const prop = ref<QueryPersonnel>({})
const activeName = ref('first')
const propDemandAlter = ref<Proprietor>()

const shortcuts = [
    {
        text: '今天',
        value: new Date(),
    },
    {
        text: '昨天',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: '一周前',
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
        },
    },
]

const toGetPageResult = (result:PageResult<any>)=>{
    isLoading.value = false
    proprietors.value = result
}

const toChange = (val:number)=>{
    currentPage.value = val
}

//修改业主信息
const toAlter = (row:Proprietor)=>{
    addUser.value = false
    alterPropInfo.value = true
    propDemandAlter.value = row
    console.log(propDemandAlter.value)
}

const getLoadingState = (boo:boolean)=>{
    isLoading.value = boo
}

const filterTag = (value: string, row: Proprietor)=>{
    return row.propertyExpenseState.toString() === value
}

//当过滤器被选择时
const filterChange = (filters:any)=>{
    currentFilter.value = filters.expense[0]
}

const CascaderProps = {
    value:'hid',
    label:'toDisLabel',
    children:'children'
}

//选择地址时
const toChooseBuilding = (value: CascaderValue)=>{
    console.log(value)
}

const onAddItem = ()=>{
    alterPropInfo.value = true
    addUser.value = true
    propDemandAlter.value = onAddProp.value
}

//提交修改信息
const toSubmit4Prop = ()=>{
    if(propDemandAlter.value!.addressList !== undefined){
        propDemandAlter.value!.address = propDemandAlter.value!.addressList.toString()
    }
    console.log(propDemandAlter.value?.address)
    dialogVisible.value = false
    axios.post('/pms/auth/alter/info/prop', propDemandAlter.value).then((res)=>{
        if(res.status === 200){
        }
    }).catch((config)=>{
        ElMessage.error(config.response.data.errMessage)
    })
}

const visible = (val:boolean)=>{
    alterPropInfo.value = val
}

onMounted(()=>{
    checkUserAuth(router)
    axios.get('/pms/form/building/1').then((res)=>{
        if(res.status === 200){
            options.value.push(res.data.result)
        }
    }).catch((res)=>{
        ElMessage.error(res.response.data.errMessage)
    })
})
</script>

<template>
    <div class="dispaly-ersonnel">
        <pageHeader :has-anonymous="false"/>
        <el-tabs v-model="activeName" class="demo-tabs" tab-position="right">
            <el-tab-pane label="业主" name="first">
                <Query4Personnel 
                :filter-changed="currentFilter"
                :query="prop" 
                :current-page="currentPage"
                @get-page-result="toGetPageResult"
                @loading-state="getLoadingState"/>
                <div class="dispaly-prop">
                    <el-table 
                    :data="proprietors?.items" 
                    style="width: 100%"
                    row-key="username"
                    size="large"
                    v-loading="isLoading"
                    @filter-change="filterChange">
                        <el-table-column prop="username" label="用户名" fixed/>
                        <el-table-column prop="name" label="姓名"/>
                        <el-table-column prop="phone" label="联系电话"/>
                        <el-table-column prop="age" label="年龄"/>
                        <el-table-column prop="gender" label="性别"/>
                        <el-table-column 
                        label="物业缴费"
                        prop="propertyExpenseState"
                        :filters="[
                            { text: '已缴费', value: '10010' },
                            { text: '未缴费', value: '10011' },
                            { text: '已延迟', value: '10012' },
                        ]"
                        :filter-method="filterTag"
                        column-key="expense"
                        :filter-multiple="false"
                        filter-placement="bottom"
                        :reserve-selection="true">
                            <template #default="scope">
                                <el-tag type="warning" v-if="scope.row.propertyExpenseState === 10011">未缴费</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.propertyExpenseState === 10012">已拖欠</el-tag>
                                <el-tag type="success" v-if="scope.row.propertyExpenseState === 10010">已缴费</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="toAlter(scope.row)">编辑</el-button>
                            <el-button link type="danger" size="small">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <el-button 
                    v-if="proprietors?.items"
                    class="mt-4" 
                    style="width: 100%" 
                    @click="onAddItem">添加用户</el-button>
                    <el-pagination 
                    v-if="proprietors !== undefined && proprietors !== null"
                    v-model:current-page="currentPage"
                    v-model:page-size="proprietors.pageSize"
                    layout="prev, pager, next, total" 
                    v-model:total="proprietors.counts"
                    @current-change="toChange"/>
                </div>
            </el-tab-pane>
            <el-tab-pane label="管理员" name="second">
                <div class="display-admin">

                </div>
            </el-tab-pane>
        </el-tabs>

        <InputUserInfo 
        :prop-user-info="propDemandAlter!" 
        :visible="alterPropInfo"
        :is-add="addUser"
        @to-visible="visible"/>

        <!-- <el-drawer 
        v-model="alterPropInfo" 
        title="编辑业主信息"
        direction="ttb"
        size="65%">
            <div class="display-prop-alter" v-if="propDemandAlter !== undefined">
                <el-form 
                :model="propDemandAlter" 
                label-width="120px" 
                style="width: 70%; margin: auto;"
                :inline="true">
                    <el-form-item label="用户名" style="width: 100%;">
                        <el-input v-model="propDemandAlter.username" :maxlength="10" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="姓名" style="width: 100%;">
                        <el-input v-model="propDemandAlter.name"/>
                    </el-form-item>
                    <div style="display: flex;">
                        <el-form-item label="年龄">
                            <el-input-number v-model.number="propDemandAlter.age" :min="1" :max="100"/>
                        </el-form-item>
                        <el-form-item label="入住时间">
                            <el-date-picker
                            v-model="propDemandAlter.checkInDate"
                            type="datetime"
                            placeholder="Select date and time"
                            :shortcuts="shortcuts"/>
                        </el-form-item>
                    </div>
                    <el-form-item label="住址" style="width: 100%;">
                        <el-cascader 
                        :options="options" 
                        @change="toChooseBuilding"
                        :props="CascaderProps"
                        v-model="propDemandAlter.addressList">
                            <template #default="{ data }">
                                <span>{{ data.toDisLabel }}</span>
                            </template>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="联系电话" style="width: 100%;">
                        <el-input v-model="propDemandAlter.phone"/>
                    </el-form-item>
                    <el-form-item label="身份证号" style="width: 100%;">
                        <el-input v-model="propDemandAlter.idCard"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <el-button type="success" @click="dialogVisible = true">提交</el-button>
                <el-button @click="alterPropInfo = false">取消</el-button>
            </template>
        </el-drawer>

        <el-dialog
        v-model="dialogVisible"
        title="警告"
        width="30%">
            <span>确认提交修改吗</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="danger" @click="toSubmit4Prop">确认</el-button>
                </span>
            </template>
        </el-dialog> -->
    </div>
</template>

<style>
.el-table-filter__list{
    color:black;
}
</style>