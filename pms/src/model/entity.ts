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

//业主信息
export interface Proprietor {
    username: string,
    password: string,
    chackPass: string,
    name: string,
    phone?: string,
    birth?: Date,
    age?:number,
    address: string,
    status: string,
    check_in_date?: string,
    idCard?: string,
    gender: string,
    profile?:string
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