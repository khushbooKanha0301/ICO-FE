import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/AuthSlice'
import commonReducer from './slices/commonSlice'
import currenyReducer from './slices/currencySlice'
import notificationReducer from './slices/notificationSlice'

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  notificationReducer,
  currenyReducer
})

const store = configureStore({ reducer: rootReducer })

export default store
