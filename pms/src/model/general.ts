// 通用结果类型
export interface RestResponse<T> {
    type: number,
    msg: string,
    result: T
}

export interface RestErrorResponse{
    errMessage: string,
    error: string,
    errorCode: number
}

export interface UserResponse{
    msg:string, 
    token:string,
    commonSate:string
}