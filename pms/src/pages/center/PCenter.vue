<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import axios from '../../api/request'
import { Proprietor, address, allUser } from '../../model/entity'
import { ElLoading, ElMessage, UploadProps, UploadFile, UploadFiles } from 'element-plus'
import userCookie from 'vue-cookies'
import { IceCreamRound } from '@element-plus/icons-vue'

const pro = defineProps<{user:Proprietor}>()

const cookie:any = userCookie
const originalInfo = ref<Proprietor>()
const all = ref<allUser>()
const alterInfo = ref<Proprietor>()
const src = ref()

const headers: Record<string, any> = {
    'TOKEN': cookie.get('user')
}

const refresh = ()=>{
    getUserInfo(alterInfo)
}

const showAddress = ()=>{
    console.log(alterInfo.value?.address)
}

const getUserInfo = (o:Ref)=>{
    //加载动画
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
        })
        axios.get('pms/auth/info').then((res)=>{
            if(res.status === 200){
                console.log(res.data)
                if(res.data.msg === 'success'){
                    o.value = res.data.result
                    if (res.data.result.profile !== null)
                        src.value = `http://api.mahiro.com/file/mediafiles/${res.data.result.profile}`
                    else src.value = ''
                }else{
                    ElMessage.error(res.data.msg)
                }
            }
        }).finally(()=>{
            loading.close()
        })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('图片文件必须是JPG文件')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB!')
        return false
    }
    return true
}

const uploadError = (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    ElMessage.error(error.message)
}

const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles)=>{
    
    if (response.type === 313){
        ElMessage.success('上传成功')
        getUserInfo(all)
    }
}

onMounted(()=>{
    if(pro.user === undefined){
        getUserInfo(all)
    }else{
        console.log(pro.user.profile)
        all.value = pro.user
        src.value = src.value = `http://api.mahiro.com/file/mediafiles/${pro.user.profile}`
    }
    getUserInfo(alterInfo)
})
</script>

<template>
    <div class="description">
        <div class="avatar">
            <el-upload
            class="avatar-uploader"
            action="http://api.mahiro.com/pms/person/upload"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            name="file"
            method="post"
            :headers="headers"
            :on-success="uploadSuccess"
            :on-error="uploadError">
                <el-avatar style="font-size: 30px;" :src="src">
                    {{ all?.username }}
                </el-avatar>
            </el-upload>
            <span style="color: gray; font-size: 10px;">点击头像可修改</span>
            <el-divider>
                <el-icon><IceCreamRound/></el-icon>
            </el-divider>
        </div>
        <el-tabs tab-position="right" class="demo-tabs">
            <el-tab-pane label="信息" name="0">
                <el-descriptions
                title="个人信息"
                direction="vertical"
                :column="4"
                size="large"
                :border="true"
                v-if="all !== undefined">
                    <el-descriptions-item label="用户名">
                        {{ all.username }}
                    </el-descriptions-item>
                    <el-descriptions-item label="姓名">
                        {{ all.name === null ? '未填写' : all.name }}
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号">
                        {{ all.phone === null ? '未填写' : all.phone }}
                    </el-descriptions-item>
                    <el-descriptions-item label="年龄">
                        {{ all.age === null ? '未填写' : all.age }}
                    </el-descriptions-item>
                    <el-descriptions-item label="性别">
                        {{ all.gender === null ? '未填写' : all.gender }}
                    </el-descriptions-item>
                    <el-descriptions-item label="住址" :span="3">
                        {{ all.address === null ? '未填写' : all.address }}
                    </el-descriptions-item>
                    <el-descriptions-item label="身份">
                        <el-tag class="ml-2" v-if="all.status === '91090'">房主</el-tag>
                        <el-tag class="ml-2" v-else-if="all.status === '91091'">家属成员</el-tag>
                        <el-tag class="ml-2" v-else-if="all.authority === '90090'" type="danger">超级管理员</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="身份证信息" :span="3">
                        {{ all.idCard === null ? '未填写' : all.idCard }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-tab-pane>

            <el-tab-pane 
            label="修改" 
            name="alter" 
            v-if="alterInfo !== undefined">
                <div class="alter-user-info">
                    <el-form 
                    :model="all" 
                    label-width="120px" 
                    label-position="left"
                    size="large"
                    style="width: fit-content;">
                        <el-space fill style="width: 100%;">
                            <el-alert type="info" show-icon :closable="false">
                                <p>用户名不可修改</p>
                            </el-alert>
                            <el-form-item label="用户名">
                                <el-input v-model="alterInfo.username" disabled/>
                            </el-form-item>
                        </el-space>
                        <el-form-item label="姓名">
                            <el-input v-model="alterInfo.name"/>
                        </el-form-item>
                        <el-space fill style="width: 100%;">
                            <el-alert type="info" show-icon :closable="false" v-if="all?.authority === null">
                                <p>手机号暂时无法修改, 请联系管理员</p>
                            </el-alert>
                            <el-alert type="info" show-icon :closable="false" v-else>
                                <p>管理员可修改手机号</p>
                            </el-alert>
                            <el-form-item label="手机号">
                                <el-input v-model="alterInfo.phone" :disabled="all?.authority === null ? true : false"/>
                            </el-form-item>
                        </el-space>
                        <el-form-item label="年龄">
                            <el-input-number v-model="alterInfo.age" :min="1" :max="100"/>
                        </el-form-item>
                        <el-form-item label="住址" v-if="all?.authority === null">
                            <el-cascader 
                            v-model="alterInfo.address" 
                            :options="address" 
                            @change="showAddress()"
                            placeholder="请选择住址"/>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio-group v-model="alterInfo.gender" class="ml-4">
                                <el-radio label="男" size="large">男</el-radio>
                                <el-radio label="女" size="large">女</el-radio>
                                <el-radio label="保密" size="large">保密</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="身份证号">
                            <el-input v-model="alterInfo.idCard" maxlength="18" show-word-limit/>
                        </el-form-item>
                        <el-button type="primary">提交</el-button>
                        <el-button @click="refresh">重置</el-button>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style>

.avatar .el-avatar {
    --el-avatar-size: 100px;
}

.el-avatar:hover {
    --el-avatar-size: 120px;
    transition: all 0.5s;
}

.alter-user-info {
    padding: 30px;
    width: 650px;
    margin: auto;
}

.description {
    padding: 20px;
}
</style>