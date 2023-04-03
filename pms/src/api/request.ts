import axios from 'axios'
import {RestErrorResponse} from '../model/general'
import {ElMessage} from 'element-plus'
import useCookie from 'vue-cookies'

const cookie:any = useCookie

const _axios = axios.create({
    //修改默认的前缀设置
    baseURL: 'http://api.mahiro.com/',
    headers: {
        'TOKEN': cookie.get('user')
    }
})

//响应拦截器
_axios.interceptors.response.use(
    (response)=>{
        //状态码为 2xx 及响应成功
        return response
    },
    (error)=>{
        //状态码大于 2xx 及响应失败
        if(error.response.status === 404){
            //处理异常
            ElMessage.error('没有该资源!')
        }else if(error.response.status === 500){
            const info:RestErrorResponse = error.response.data
            ElMessage.error(info.errMessage)
        }else if(error.response.status === 401){
            const info:RestErrorResponse = error.response.data
            ElMessage.error(info.errMessage)
        }else{
            const info:RestErrorResponse = error.response.data
            ElMessage.error(info.errMessage)
        }
        // return Promise.reject(error)
        return Promise.resolve(error)
    }
)

export default _axios