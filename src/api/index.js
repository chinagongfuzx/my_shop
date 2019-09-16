import axios from 'axios'
import { async } from 'q';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config =>{
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config
})
export const login_api = params => axios.post('/login', params)
export const home_api = params =>axios.get('/menus',{params})
export const userList_api = userLIst => axios.get('/users',{params:userLIst})
export const userInfo_api= (id,status) => axios.put(`/users/${id}/state/${status}`)
export const useradd_api=params => axios.post('/users',params)
export const userEdit_api=params => axios.get('/users/'+params+'')
export const userEditAdd_api=(id,params) => axios.put('/users/'+id+'',params)
export const userDel_api=params => axios.delete(`/users/${params}`)
export const rightsGet_api=params => axios.get(`rights/list`,{params})
export const rightsGetTree_api=params => axios.get(`rights/tree`,{params})
export const rolesGet_api=params => axios.get(`roles`,params)
export const rolesDel_api=(roleId,rightsId) => axios.delete(`roles/${roleId}/rights/${rightsId}`)
export const rolesGive_api=(id,rids) => axios.post(`roles/${id}/rights/`,{rids})
export const rolesUserEdit_api=(id,rid) => axios.put(`users/${id}/role`,{rid})
