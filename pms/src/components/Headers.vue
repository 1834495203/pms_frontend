<script setup lang="ts">
import { onBeforeMount } from 'vue'
import UseCookie from 'vue-cookies'
import { userInfo } from '../model/entity'
import { ref } from 'vue'
import jwt from 'jwt-decode'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const centerDialogVisible = ref(false)
const cookie: any = UseCookie
const user_cookie = ref<userInfo>()
const username = ref()
const hasUser = ref(false)

const toLogout = async ()=>{
    cookie.remove('user')
    await router.replace({path:'/'})
    ElMessage.success('用户登出成功')
    location.reload()
    centerDialogVisible.value = false
}

onBeforeMount(() => {
  if((hasUser.value = cookie.isKey('user'))){
    user_cookie.value = jwt(cookie.get('user'))
    username.value = user_cookie.value?.sub.split(',')[0].split(':')[1].replaceAll('"', '')
  }
})
</script>

<template>
    <el-row>
        <el-col :span="8">
            <div class="logo">
                <img src="../assets/vue.svg" sizes="1.5em" />
            </div>
        </el-col>
        <el-col :span="8">
            <div class="title">
                <h1>物业管理系统</h1>
            </div>
        </el-col>
            <el-col :span="8">
                <div class="user-info">
                    <div v-if="username === undefined">
                        <el-button type="primary" round>
                            <router-link to="/login">去登录</router-link>
                        </el-button>
                    </div>
                    <div v-else>
                        <el-button href="/#/main" type="success" text key="success">
                            <router-link to="/main" style="color: green;">欢迎您, {{ username }}!</router-link>
                        </el-button>
                        <el-button link @click="centerDialogVisible = true">登出</el-button>
                        <el-dialog 
                        v-model="centerDialogVisible" 
                        width="30%" 
                        center
                        style="background-color:    #18222c;">
                        <template #header>
                            <span style="font-size: 25px;">提示</span>
                        </template>
                            <span style="color: white; font-size: 20px;">
                                确定选择退出当前账号吗?
                            </span>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="centerDialogVisible = false">取消</el-button>
                                    <el-button type="danger" @click="toLogout()">
                                        确认
                                    </el-button>
                                </span>
                            </template>
                        </el-dialog>
                    </div>
                </div>
          </el-col>
        </el-row>
</template>

<style>

.user-info a {
  text-decoration: none;
}

.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  display: flex;
  justify-content: center;
}

.el-button {
  color: white;
  border-color: #475669;
}
</style>