import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import jwt from 'jwt-decode'
import { api_url } from '../../utils/utils'
import axios from 'axios'

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const { data } = await axios.post(`${api_url}/admin-login`, info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const seller_login = createAsyncThunk(
    'auth/seller_login',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const { data } = await axios.post(`${api_url}/seller-login`, info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)
export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue, getState }) => {
        try {

            const { token } = getState().auth
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            }

            const { data } = await axios.get(`${api_url}/logout`, config)
            localStorage.removeItem('accessToken')
            if (role === 'admin') {
                navigate('/admin/login')
            } else {
                navigate('/login')
            }

            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const seller_register = createAsyncThunk(
    'auth/seller_register',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            console.log(info)
            const { data } = await axios.post(`${api_url}/seller-register`, info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)


export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload',
    async (image, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const { token } = getState().auth
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${api_url}/profile-image-upload`, image, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const { token } = getState().auth
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            }
            const { data } = await axios.post(`${api_url}/profile-info-add`, info, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)




export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async (_, { rejectWithValue, fulfillWithValue, getState }) => {
        try {
            const { token } = getState().auth
            const config = {
                headers: {
                    "authorization": `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`${api_url}/get-user`, config)
            console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const returnRole = (token) => {
    if (token) {
        const decodeToken = jwt(token)
        const expireTime = new Date(decodeToken.exp * 1000)
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken')
            return ''
        } else {
            return decodeToken.role
        }
    } else {
        return ''
    }
}


export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken')
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [admin_login.pending]: (state, _) => {
            state.loader = true
        },
        [admin_login.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [admin_login.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.token = payload.token
            state.role = returnRole(payload.token)
        },
        [seller_login.pending]: (state, _) => {
            state.loader = true
        },
        [seller_login.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [seller_login.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.token = payload.token
            state.role = returnRole(payload.token)
        },
        [seller_register.pending]: (state, _) => {
            state.loader = true
        },
        [seller_register.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [seller_register.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.token = payload.token
            state.role = returnRole(payload.token)
        },
        [get_user_info.fulfilled]: (state, { payload }) => {
            console.log(payload)
            state.loader = false
            state.userInfo = payload.userInfo
            state.role = payload.userInfo.role
        },
        [profile_image_upload.pending]: (state, _) => {
            state.loader = true
        },
        [profile_image_upload.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.userInfo = payload.userInfo
            state.successMessage = payload.message
        },
        [profile_info_add.pending]: (state, _) => {
            state.loader = true
        },
        [profile_info_add.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.userInfo = payload.userInfo
            state.successMessage = payload.message
        },
    }

})
export const { messageClear } = authReducer.actions
export default authReducer.reducer