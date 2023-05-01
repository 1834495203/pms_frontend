<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ResultHouseDto, Proprietor } from '../../../model/entity'
import { CascaderValue, ElMessage } from 'element-plus'
import axios from '../../../api/request'
import { checkUserAuth } from '../../func/GeneralFunc'
import { useRouter } from 'vue-router'

const router = useRouter()
const prop = defineProps<{propUserInfo:Proprietor, visible:boolean, isAdd:boolean}>()
const emits = defineEmits(['toVisible'])
const dialogVisible = ref(false)
const options = ref<ResultHouseDto[]>([])
const alterPropInfo = ref(false)

watch(()=>prop.isAdd, ()=>{
    console.log(prop.isAdd)
})

watch(()=>prop.visible, ()=>{
    alterPropInfo.value = prop.visible
})

watch(()=>alterPropInfo.value, ()=>{
    emits('toVisible', alterPropInfo.value)
})

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

const CascaderProps = {
    value:'hid',
    label:'toDisLabel',
    children:'children'
}

//选择地址时
const toChooseBuilding = (value: CascaderValue)=>{
    console.log(value)
}

//提交修改信息
const toSubmit4Prop = ()=>{
    if(!prop.isAdd){
        //修改信息
        if(prop.propUserInfo!.addressList !== undefined){
            prop.propUserInfo!.address = prop.propUserInfo!.addressList.toString()
        }
        console.log(prop.propUserInfo?.address)
        dialogVisible.value = false
        alterPropInfo.value = false
        axios.post('/pms/auth/alter/info/prop', prop.propUserInfo).then((res)=>{
            if(res.status === 200){
                ElMessage.success(res.data.msg)
            }
        }).catch((config)=>{
            ElMessage.error(config.response.data.errMessage)
        })
    }else {
        //新增信息
        console.log(prop.propUserInfo)
        prop.propUserInfo.status = '91090'
        axios.post('/pms/auth/register/proprietor', prop.propUserInfo).then((res)=>{
            if(res.status === 200){
                console.log(res.data)
            }
        })
    }
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
    <div class="display-input-user-info">
        <el-drawer 
        v-model="alterPropInfo" 
        :title="isAdd === false ? '编辑业主信息' : '新增用户信息'"
        direction="ttb"
        size="65%">
            <div class="display-prop-alter" v-if="prop.propUserInfo !== undefined">
                <el-form 
                :model="prop.propUserInfo" 
                label-width="120px" 
                style="width: 70%; margin: auto;"
                :inline="true">
                    <el-form-item label="用户名" style="width: 100%;">
                        <el-input v-model="prop.propUserInfo.username" :maxlength="10" show-word-limit/>
                    </el-form-item>
                    <el-form-item label="姓名" style="width: 100%;">
                        <el-input v-model="prop.propUserInfo.name"/>
                    </el-form-item>
                    <div style="display: flex;">
                        <el-form-item label="年龄">
                            <el-input-number v-model.number="prop.propUserInfo.age" :min="1" :max="100"/>
                        </el-form-item>
                        <el-form-item label="入住时间">
                            <el-date-picker
                            v-model="prop.propUserInfo.checkInDate"
                            type="datetime"
                            placeholder="Select date and time"
                            :shortcuts="shortcuts"/>
                        </el-form-item>
                    </div>
                    <el-form-item label="性别" style="width: 100%;">
                        <el-radio-group v-model="prop.propUserInfo.gender" class="ml-4">
                            <el-radio label="男" size="large">男</el-radio>
                            <el-radio label="女" size="large">女</el-radio>
                            <el-radio label="保密" size="large">保密</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="住址" style="width: 100%;">
                        <el-cascader 
                        :options="options" 
                        @change="toChooseBuilding"
                        :props="CascaderProps"
                        v-model="prop.propUserInfo.addressList">
                            <template #default="{ data }">
                                <span>{{ data.toDisLabel }}</span>
                            </template>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="联系电话" style="width: 100%;">
                        <el-input v-model="prop.propUserInfo.phone"/>
                    </el-form-item>
                    <el-form-item label="身份证号" style="width: 100%;">
                        <el-input v-model="prop.propUserInfo.idCard"/>
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
        </el-dialog>
    </div>
</template>

<style>
</style>