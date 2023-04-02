<script setup lang="ts">
import { ElMessage, ElNotification as notify, UploadInstance, UploadUserFile, UploadFile, UploadFiles } from 'element-plus'
import axios from '../../api/request'
import { onMounted, ref } from 'vue'
import { Proprietor, complaint, pict, userInfo} from '../../model/entity'
import { IceCreamRound, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import useCookie from 'vue-cookies'
import jwt from 'jwt-decode'
 
//arr存储待写入数据库的图片信息id
const arr = ref<Map<string, number>>(new Map<string, number>())
const pict = ref<pict>()
const uploadRef = ref<UploadInstance>()
const cookie:any = useCookie
const headers: Record<string, any> = {
    'TOKEN': cookie.get('user')
}
const complaint = ref<complaint>({
    pubilsherId: -1,
    title: ''
})
const router = useRouter()
const user = ref<Proprietor>()
const src = ref('')
const anonymous = ref(false)

onMounted(()=>{
    axios.get('/pms/auth/info').then((res)=>{
        if(res.status === 200){
            user.value = res.data.result
            if(user.value?.profile !== null)
            src.value = `http://api.mahiro.com/file/mediafiles/${user.value?.profile}`
        }
    })
})

const onBack = async () => {
    notify('Back')
    router.back()
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
    const user:userInfo = jwt(cookie.get('user'))
    let obj = Object.create(null)
    for(let[k,v] of arr.value){
        obj[k] = v
    }
    complaint.value.profiles = JSON.stringify(obj)
    complaint.value.pubilsherId = user.id
    axios.put('pms/form/complaint', complaint.value).then((res)=>{
        if(res.status === 200){
            console.log(res.data)
        }
    })
}
</script>

<template>
    <div aria-label="A complete example of page header">
        <el-page-header @back="onBack" style="color: black;">
            <template #content>
                <div class="flex items-center" v-if="!anonymous">
                    <el-avatar
                    class="mr-3"
                    :size="50"
                    :src="src">
                        <span>{{ user?.username }}</span>
                    </el-avatar>
                    <span class="text-large font-600 mr-3"> {{ user?.username }} </span>
                    <el-tag>业主</el-tag>
                </div>
                <div class="flex items-center" v-else>
                    <el-avatar
                    class="mr-3"
                    :size="50">
                        <span>匿名</span>
                    </el-avatar>
                    <span class="text-large font-600 mr-3">匿名</span>
                </div>
            </template>
            
            <template #extra>
                <div class="flex items-center">
                    <el-switch v-model="anonymous" active-text="匿名模式"/>
                </div>
            </template>
        </el-page-header>
        <el-divider><el-icon><IceCreamRound /></el-icon></el-divider>
        <!-- 投诉表单 -->
        <div class="complaint-form">
            <el-form :model="complaint" label-width="120px" label-position="left">
                <el-form-item label="标题">
                    <el-input 
                    v-model="complaint.title" 
                    :maxlength="30" 
                    placeholder="请输入标题" 
                    :show-word-limit="true"/>
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
                <el-form-item label="问题描述">
                    <el-input 
                    v-model="complaint.content" 
                    :maxlength="300" 
                    type="textarea"
                    :rows="8"
                    :show-word-limit="true"/>
                </el-form-item>

                <el-button @click="toSubmit">提交</el-button>
            </el-form>
        </div>
    </div>
</template>

<style>
.complaint-form {
    margin: auto;
    color: black;
    width: 600px;
}

.items-center {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
}

</style>