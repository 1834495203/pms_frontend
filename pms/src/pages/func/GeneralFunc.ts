import { userInfo } from '../../model/entity'
import jwt from 'jwt-decode'
import useCookie from 'vue-cookies'
import { ElMessage } from 'element-plus'
import { Router } from 'vue-router'

export const checkUserAuth = (router:Router)=>{
    const cookie:any = useCookie
    const currentUser:userInfo = jwt(cookie.get('user'))
    if(currentUser.auth.includes('910')){
        ElMessage.warning('权限不足！')
        router.back()
    }
}