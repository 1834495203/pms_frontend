// 实体类
export interface user{
    username:string,
    password:string,
    type:string
}

//cookie中用户的信息
export interface userInfo{
    id: number,
    auth:string,
    sub: string
}

//用户基本信息
export interface resultUserBaseInfo{
    username?:string,
    profile?:string,
    authority?:string,
    status?:string
}

//业主信息
export interface Proprietor {
    pid?:number,
    username?: string,
    password?: string,
    chackPass?: string,
    name?: string,
    phone?: string,
    birth?: Date,
    age?:number,
    address?: string,
    status?: string,
    checkInDate?: string,
    idCard?: string,
    gender?: string,
    profile?:string,
    propertyExpenseState:number,
    addressList?:number[]
}

//用户的总信息
export interface allUser {
    username?: string,
    password?: string,
    name?: string,
    phone?: string,
    age?:number,
    address?: string,
    status?: string,
    check_in_date?: string,
    idCard?: string,
    gender?: string,
    profile?: string,
    propertyExpenseState?: string,
    createDate?: string,
    authority?:string,
    hiredate?:string,
    addressList?:number[]
}

//查询用户的信息
export interface QueryPersonnel {
    username?:string,
    name?:string,
    propertyExpenseState?:number
}

//投诉信息
export interface complaint {
    cid?: string,
    pubilsherId: number,
    content?: string,
    state?: string,
    createTime?: Date,
    process?: string,
    profiles?: string, 
    profile?: string, 
    solverId?: string,
    title: string
}

//图片信息
export interface pict {
    pid?:number,
    name?:string,
    object_name?:string,
    type?:string,
    profile_id?:number
}

//投诉查询信息
export interface queryComplaintDto{
    pubilsherId: number,
    state?: string,
    title?: string,
    queryTime?:Array<Date>,
}

//获取投诉信息
export interface resultComplaintDto{
    cid?: string,
    pubilsherId?: number,
    content?: string,
    state?: string,
    createTime?: Date,
    process?: string,
    profiles?: string, 
    profile?: string, 
    solverId?: number,
    title?: string,
    objectName?: string[],
    username?:string,
    userProfile?:string,
    resultUserBaseInfo?: resultUserBaseInfo,
    processDate?:Date,
    rate?:number,
    opinion?:string,
}

//分页查询结果
export interface PageResult<T>{
    items?:Array<T>,
    counts?:number,
    page?:number,
    pageSize?:number
}

//公告信息
export interface broadcast{
    bid?:number,
    title:string,
    content?:string,
    correspond?:string,
    pubilsherId:number,
    state?:string,
    profile?:string,
    createDate?:Date
}

//查询公告信息
export interface QueryBroadcastDto {
    title?:string,
    correspond?:string,
    queryDate?:Date
}

//获取公告信息
export interface resultBroadcastDto{
    bid?: string,
    pubilsherId?: number,
    content?: string,
    state?: string,
    createDate?: Date,
    profile?: string, 
    title?: string,
    objectName?: string[],
    correspond?:string,
    username?:string
}

//小区楼栋信息
export interface ResultHouseDto {
    hid?:number,
    lastId?:number
    label?:string,
    value?:string,
    toDisLabel?:string,
    children?:ResultHouseDto[]
}

//房产信息
export interface information {
    iid?:number,
    area?:number,
    hid?:number,
    state?:string,
    pid?:number
}

//缴费信息
export interface expenseInfo{
    date?: Date,
    price?: number,
    addition?: string
}

const floor = [
    {value: 'Floor1',label: '一楼'},
    {value: 'Floor2',label: '二楼'},
    {value: 'Floor3',label: '三楼'},
    {value: 'Floor4',label: '四楼'},
    {value: 'Floor5',label: '五楼'},
    {value: 'Floor6',label: '六楼'},
    {value: 'Floor7',label: '七楼'},
    {value: 'Floor8',label: '八楼'},
    {value: 'Floor9',label: '九楼'},
    {value: 'Floor10',label: '十楼'},
]

const unit = [
    {
        value: 'unitOne',
        label: '一单元',
        children: floor
    },
    {
        value: 'unitTwo',
        label: '二单元',
        children: floor
    },
    {
        value: 'unitThree',
        label: '三单元',
        children: floor
    },
    {
        value: 'unitFour',
        label: '四单元',
        children: floor
    }
]

export const address = [
    {
        value: 'buildingOne',
        label: '一栋',
        children: unit
    },
    {
        value: 'buildingOne',
        label: '二栋',
        children: unit
    },
    {
        value: 'buildingOne',
        label: '三栋',
        children: unit
    },
    {
        value: 'buildingOne',
        label: '四栋',
        children: unit
    }
]

export const ComplaintSate = [
    {
        value:'40010',
        label:'已处理',
    },
    {
        value:'40011',
        label:'未处理',
    },
    {
        value:'40012',
        label:'处理中',
    }
]

export const options = [
    {
        value:'910',
        label:'业主',
        status:[
            {
                value:'91090',
                label:'房主'
            },
            {
                value:'91091',
                label:'家属成员'
            }
        ]
    },
    {
        value:'900',
        label:'管理员'
    }
]