<script setup lang="ts">
import pageHeader from '../components/pageHeader.vue'
import { onMounted, ref, onBeforeMount } from 'vue'
import axios from '../../api/request'
import { allUser, broadcast, pict, userInfo, QueryBroadcastDto, PageResult, resultBroadcastDto } from '../../model/entity'
import { useRouter } from 'vue-router'
import { checkUserAuth } from '../func/GeneralFunc'
import useCookie from 'vue-cookies'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElNotification as notify, UploadInstance, UploadUserFile, UploadFile, UploadFiles, ElLoading } from 'element-plus'
import jwt from 'jwt-decode'
import queryCondition from '../components/queryCondition.vue'
import { IceCreamRound } from '@element-plus/icons-vue'
import BroadcastDisplay from './components/BroadcastDisplay.vue'

const isLoading = ref(false)
const broadcastPage = ref<PageResult<resultBroadcastDto>>()
const currentPage = ref(0)
const broadcastDto = ref<QueryBroadcastDto>({})
//arr存储待写入数据库的图片信息id
const arr = ref<Map<string, number>>(new Map<string, number>())
const pict = ref<pict>()
const broadcast = ref<broadcast>({
    pubilsherId: -1,
    title:'',
    state:'30011'
})
const cookie:any = useCookie
const headers: Record<string, any> = {
    'TOKEN': cookie.get('user'),
    'type': '300'
}
const router = useRouter()
const activeName = ref('query')
const user = ref<allUser>()
const src = ref()

const toChange = (val:number)=>{
    currentPage.value = val
}

const toGetPageResult = (result:PageResult<any>)=>{
    broadcastPage.value = result
}

const toExceed = (files: File[], uploadFiles: UploadUserFile[])=>{
    ElMessage.warning("最大不超过6张图")
}

const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    //文件上传
    if(response.type === 313){
        pict.value = response.result
        arr.value.set(uploadFile.name, pict.value!.pid!)
    }
}

const pictRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    //文件删除
    const id = arr.value.get(uploadFile.name)
    axios.delete(`/pms/form/upload/${id}`).then((res)=>{
        if(res.status === 200){
            console.log(res.data)
        }
    })
}

const toSubmit = ()=>{
    //加载动画
    isLoading.value = true
    const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
    })
    const user:userInfo = jwt(cookie.get('user'))
    let obj = Object.create(null)
    for(let[k,v] of arr.value){
        obj[k] = v
    }
    broadcast.value.profile = JSON.stringify(obj)
    broadcast.value.pubilsherId = user.id
    if(broadcast.value.correspond!.toString().split(',').length === 2){
        //全选状态
        broadcast.value.correspond = '999'
    }else broadcast.value.correspond = broadcast.value.correspond?.toString()
    axios.put('pms/form/broadcast', broadcast.value).then((res)=>{
        if(res.status === 200){
            if(res.data.type === 606){
                ElMessage.success('发送成功')
                router.push({name: 'result', query: {state: 'success'}})
            }else{
                ElMessage.success('发送失败')
                router.push({name: 'result', query: {state: 'error'}})
            }
        }
    }).finally(()=>{
        isLoading.value = false
        loading.close()
    })
}

onBeforeMount(()=>{
    checkUserAuth(router)
})

onMounted(()=>{
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            user.value = res.data.result
            if(user.value?.profile !== null)
            src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
        }
    })
})
</script>

<template>
    <div class="broadcast-manage">
        <pageHeader :user="user!" :src="src" :has-anonymous="false"/>
        <el-tabs v-model="activeName" class="demo-tabs" tab-position="top">
            <el-tab-pane label="查询" name="query">
                <!-- 公告查询 -->
                <queryCondition 
                :query="broadcastDto" 
                :current-page="currentPage"
                @get-page-result="toGetPageResult"/>

                <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>

                <BroadcastDisplay :result="broadcastPage" :loading="isLoading"/>

                <el-pagination 
                v-if="broadcastPage !== undefined && broadcastPage !== null"
                v-model:current-page="currentPage"
                v-model:page-size="broadcastPage.pageSize"
                layout="prev, pager, next, total" 
                v-model:total="broadcastPage.counts"
                @current-change="toChange"/>
            </el-tab-pane>
            <el-tab-pane label="发布" name="post">
                <div class="broadcast-form">
                    <el-form :model="broadcast" label-width="120px" label-position="left">
                        <el-form-item label="标题">
                            <el-input v-model="broadcast.title" maxlength="30" :show-word-limit="true"/>
                        </el-form-item>

                        <el-form-item label="对应的人员">
                            <el-checkbox-group v-model="broadcast.correspond" min="1">
                                <el-checkbox label="910">业主</el-checkbox>
                                <el-checkbox label="900">员工</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="图片上传">
                            <el-upload
                            action="http://api.mahiro.com/pms/form/upload"
                            ref="uploadRef"
                            list-type="picture-card"
                            :limit="6"
                            name="file"
                            method="post"
                            :headers="headers"
                            :auto-upload="true"
                            :on-exceed="toExceed"
                            :on-success="uploadSuccess"
                            :on-remove="pictRemove">
                                <el-icon><Plus /></el-icon>
                            </el-upload>
                        </el-form-item>

                        <el-form-item label="公告内容">
                            <el-input 
                            type="textarea" 
                            :rows="6" 
                            maxlength="300" 
                            show-word-limit
                            v-model="broadcast.content"/>
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-radio-group v-model="broadcast.state">
                                <el-radio label="30010">紧急</el-radio>
                                <el-radio label="30011">日常</el-radio>
                                <el-radio label="30012">提醒</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-button type="primary" @click="toSubmit">提交</el-button>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style>
.broadcast-form {
    margin: auto;
    width: 650px;
}
</style>