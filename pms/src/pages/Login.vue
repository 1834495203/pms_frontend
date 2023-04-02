<script setup lang="ts">
import { user, Proprietor, options, userInfo } from '../model/entity'
import { ref, watch, reactive, onBeforeMount } from 'vue'
import { ElMessage, FormInstance, FormRules, ElLoading } from 'element-plus'
import { UserFilled, InfoFilled } from '@element-plus/icons-vue'
import axios from '../api/request'
import { UserResponse } from '../model/general'
import UseCookie from 'vue-cookies'
import jwt from 'jwt-decode'
import { useRouter } from 'vue-router'

onBeforeMount(()=>{
    const cookie:any = UseCookie
    if (cookie.isKey('user')){
        const user_jwt:userInfo = jwt(cookie.get('user'))
        if(user_jwt.id !== null){
            //判断是否为登录状态
            useRouter().push('/')
            ElMessage.warning("您已登录!")
        }
    }
})

const router = useRouter()
const cookie:any = UseCookie
const registerFormRef = ref<FormInstance>()
const form_age = ref(0)
const current_age = ref(`年龄:${form_age.value}岁`)
const proprietor = ref<Proprietor>({name:'', username:'', password:'', status:'', gender:'', address:'', birth:new Date(), chackPass:''})
const user_resp = ref<UserResponse>()
const user_info = ref<user>({username:'', password:'', type:''})
const drawer = ref(false)
const switcher = ref(false)

const toResetForm = (formRef: FormInstance | undefined)=>{
    //重置表单
    formRef?.resetFields()
}

//验证注册表单
const vaildPass = (rule:any, value:any, callback:any)=>{
    if (proprietor.value.chackPass === '') callback(new Error('请输入密码'))
    if(proprietor.value.chackPass != proprietor.value.password){
        callback(new Error('两次密码不一致!'))
    }else callback()
}

const vaildAge = (rule:any, value:any, callback:any)=>{
    if(form_age.value < 0){
        callback(new Error('请输入正确的生辰'))
    }else callback()
}
const rules = reactive<FormRules>({
    age: [{validator: vaildAge, trigger: 'change', required: true}],
    checkPass: [{validator: vaildPass, trigger: 'change', required: true}],
    name: [
        {
            required: true,
            message: '请输入姓名',
            trigger: 'change'
        }
    ],
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'change'
        }
    ],
    gender: [
        {
            required: true,
            message: '请输入性别',
            trigger: 'change'
        }
    ],
    status: [
        {
            required: true,
            message: '请输入身份',
            trigger: 'change'
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'change'
        }
    ]
})

const console_age = (var1:Date, var2:Date | undefined):number=>{
    //计算年龄
    let i = var1.getFullYear() - var2!.getFullYear()
    if (var1.getMonth() < var2!.getMonth()) i-=1
    return i
}

watch(()=>proprietor.value.age, ()=>{
    form_age.value = console_age(new Date(), proprietor.value.birth)
    current_age.value = `年龄:${form_age.value}岁`
})

const toRegister = ()=>{
    //注册api
    console.log(console_age(new Date(), proprietor.value.birth))
}

const toLogin = ()=>{
    //加载动画
    const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
    })
    //登录api
    let time = '2h'
    //30天免登录
    if(switcher.value) time = '30d'
    if(user_info.value.type === '910') {
        //业主登录
        axios.post('/pms/auth/login/proprietor', user_info.value).then(async (res)=>{
            if(res.status === 200){
                user_resp.value = res.data
                if (user_resp.value?.msg === 'success'){
                    //将token存入cookie
                    cookie.set('user', user_resp.value.token, time)
                    await router.replace({name:'index'})
                    ElMessage.success('登录成功!')
                    location.reload()
                }
            }
        }).finally(()=>{
            loading.close()
        })
    }else if (user_info.value.type === '900') {
        //管理员登录
        axios.post('/pms/auth/login/admin', user_info.value).then(async (res)=>{
            if(res.status === 200){
                user_resp.value = res.data
                if (user_resp.value?.msg === 'success'){
                    //将token存入cookie
                    cookie.set('user', user_resp.value.token, time)
                    await router.replace({name:'index'})
                    ElMessage.success('登录成功!')
                    location.reload()
                }
            }
        }).finally(()=>{
            loading.close()
        })
    }
}
</script>

<template>
    <div class="container">
        <div class="login">
            <el-card shadow="hover" header="物业管理登录">
                <template #header>
                    <el-avatar :icon="UserFilled"/>
                    <span style="margin: 0 10px;">物业管理登录</span>
                </template>
                <el-form
                label-position="left"
                label-width="100px"
                :model="user_info" 
                style="max-width: 460px">
                    <el-form-item label="用户名">
                        <el-input v-model="user_info.username" />
                    </el-form-item>
                    <el-form-item label="密码">
                    <el-input v-model="user_info.password" type="password"/>
                    </el-form-item>
                    <el-form-item label="身份">
                        <el-select v-model="user_info.type" class="m-2" placeholder="请选择身份" size="large">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="30天免登录">
                        <el-switch
                        v-model="switcher"
                        size="large"/>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="toLogin()">登录</el-button>
                <span style="margin: 0 20px;">|</span>
                <el-button type="primary" @click="drawer=true">注册</el-button>
                <el-button type="primary" link>忘记密码?</el-button>
            </el-card>
        </div>

        <el-drawer
        v-model="drawer"
        title="注册"
        direction="rtl">
            <template #header>
                <div>
                    <h2 style="color: white;">物业管理注册</h2>
                    <span><el-icon><InfoFilled /></el-icon>仅提供业主注册功能, 更高权限需要管理员许可</span>
                </div>
            </template>
            <!-- 注册 -->
            <div class="register">
                <el-form
                label-position="left"
                :model="proprietor"
                size="default"
                label-width="90px"
                style="max-width: 460px"
                :rules="rules"
                ref="registerFormRef">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="proprietor.name"/>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="proprietor.username"/>
                    </el-form-item>
                    <el-form-item label="身份" prop="status">
                        <el-select v-model="proprietor.status" class="m-2" placeholder="请选择身份" size="large">
                            <el-option
                            v-for="item in options[0].status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="proprietor.gender" class="ml-4">
                            <el-radio label="男">男</el-radio>
                            <el-radio label="女">女</el-radio>
                            <el-radio label="武装直升机">武装直升机</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <div>
                            <el-date-picker
                            v-model="proprietor.age"
                            type="date"
                            placeholder="你的生日"
                            size="large"/>
                            <span style="display: block; text-align: left;">{{ current_age }}</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="proprietor.password" type="password"/>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input v-model="proprietor.chackPass" type="password"/>
                    </el-form-item>
                    <div class="demo-drawer__footer">
                        <el-button @click="toResetForm(registerFormRef)">重置</el-button>
                        <el-button type="primary" @click="toRegister()">提交</el-button>
                    </div>
                </el-form>
            </div>
            <template #footer>
                <span style="color:gray">所提交的信息需要审核</span>
            </template>
        </el-drawer>
    </div>
</template>

<style>
.register {
    width: 90%;
}

.register .el-form-item__label {
    color: white;
}

.el-drawer {
    background-color: #1d3043;
}

.el-form-item {
    align-items: center;
}

.el-form-item__label {
    font-size: 15px;
    color: black;
}

.login {
    margin: auto;
    width: 50%;
    /* height: 50%; */
}

.login .el-card {
    height: 50vh;
    min-height: 360px;
    max-height: 400px;
    max-width: 600px;
    margin: auto;
    width: auto;
    opacity: 0.9;
    border-color: #1d3043;
    color: white;
    background-color:#1d3043;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.el-card .el-form-item__label {
    color: white;
}

.el-card .el-form {
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

.container {
    overflow: hidden;
    display: flex;
    height: 100vh;
    min-height: 400px;
    background-image: url('../assets/background-1.jpg');
    -moz-background-size:100%; 
    background-size:100%;
    filter:opacity(0.5px);
}
</style>