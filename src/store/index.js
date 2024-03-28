import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/AuthSlice'
import commonReducer from './slices/commonSlice'
import currenyReducer from './slices/currencySlice'
import notificationReducer from './slices/notificationSlice'
import loderReducer from "./slices/LoderSlice";

const rootReducer = combineReducers({
  authReducer,
  commonReducer,
  notificationReducer,
  currenyReducer,
  loderReducer
})

const store = configureStore({ reducer: rootReducer })

export default store
