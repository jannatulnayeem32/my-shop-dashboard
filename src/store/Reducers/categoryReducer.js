import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api_url } from '../../utils/utils'
import axios from 'axios'

export const categoryAdd = createAsyncThunk(
    'category/categoryAdd',
    async ({ name, image }, { rejectWithValue, fulfillWithValue, getState }) => {
        const { token } = getState().auth
        const config = {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('image', image)
            const { data } = await axios.post(`${api_url}/category-add`, formData, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_category = createAsyncThunk(
    'category/get_category',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue, getState }) => {
        const { token } = getState().auth
        const config = {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }
        try {
            const { data } = await axios.get(`${api_url}/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)



export const categoryReducer = createSlice({
    name: 'category',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        categorys: [],
        totalCategory: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: {
        [categoryAdd.pending]: (state, _) => {
            state.loader = true
        },
        [categoryAdd.rejected]: (state, { payload }) => {
            state.loader = false
            state.errorMessage = payload.error
        },
        [categoryAdd.fulfilled]: (state, { payload }) => {
            state.loader = false
            state.successMessage = payload.message
            state.categorys = [...state.categorys, payload.category]
        },
        [get_category.fulfilled]: (state, { payload }) => {
            state.totalCategory = payload.totalCategory
            state.categorys = payload.categorys
        },
    }

})
export const { messageClear } = categoryReducer.actions
export default categoryReducer.reducer