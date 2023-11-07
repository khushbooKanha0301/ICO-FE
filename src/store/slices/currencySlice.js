import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail } from "./notificationSlice";
import apiConfigs from "../../service/config";

const initialState = {
  eurCurrency: "",
  audCurrency: "",
  gbpCurrency: "",
  usdCurrency: "",
  cryptoAmount: 0,
  raisedMid: null,
  balanceMid: 0,
  tokenData: {
    gbpCount: 0,
    eurCount: 0,
    audCount: 0,
  },
  orderId: null,
  orderData: {},
};

export const getEURCurrency = createAsyncThunk(
  "getEURCurrency",
  async (action, { dispatch }) => {
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/EUR-USD/spot`
      )
        .then((response) => response.json())
        .then((data) => {
          return data.data.amount;
        });
      return response;
    } catch (error) {
      return error.message;
    }
  }
);

export const getAUDCurrency = createAsyncThunk(
  "getAUDCurrency",
  async (action, { dispatch }) => {
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/AUD-USD/spot`
      )
        .then((response) => response.json())
        .then((data) => {
          return data.data.amount;
        });
      return response;
    } catch (error) {
      return error.message;
    }
  }
);

export const getGBPCurrency = createAsyncThunk(
  "getGBPCurrency",
  async (action, { dispatch }) => {
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/GBP-USD/spot`
      )
        .then((response) => response.json())
        .then((data) => {
          return data.data.amount;
        });
      return response;
    } catch (error) {
      return error.message;
    }
  }
);

export const getUSDCurrency = createAsyncThunk(
  "getUSDCurrency",
  async (action, { dispatch }) => {
    try {
      const response = await fetch(
        `https://api.coinbase.com/v2/prices/USD-USD/spot`
      )
        .then((response) => response.json())
        .then((data) => {
          return data.data.amount;
        });
      return response;
    } catch (error) {
      return error.message;
    }
  }
);

export const getCryptoCurrency = createAsyncThunk(
  "getCryptoCurrency",
  async (action, { dispatch }) => {
    try {
      const response = await jwtAxios
        .get(`users/getCryptoCurrencyDetails`)
        .then((response) => response.json())
        .then((data) => {
          return data;
        });
      return response;
    } catch (error) {
      return error.message;
    }
  }
);

export const convertToCrypto = createAsyncThunk(
  "convertToCrypto",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .post(`transactions/getCryptoAmountDetails`, action)
        .then((response) => {
          return response?.data;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

export const getTotalMid = createAsyncThunk(
  "getTotalMid",
  async (action, { dispatch }) => {
    try {
      const res = await axios
        .get(`${apiConfigs.API_URL}auth/getTotalMid`, action)
        .then((response) => {
          return response?.data?.totalAmount;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);
export const getTokenCount = createAsyncThunk(
  "getTokenCount",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`transactions/getTokenCount`, action)
        .then((response) => {
          return response?.data?.tokenData;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);
export const getTransactionByOrderId = createAsyncThunk(
  "getTransactionByOrderId",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .get(`transactions/getTransactionByOrderId/${action}`)
        .then((response) => {
          return response?.data?.transactionData;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

const currencySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRaisedMid: (state, { payload }) => ({
      ...state,
      raisedMid: null,
    }),
    resetTokenData: (state, { payload }) => ({
      ...state,
      tokenData: { gbpCount: 0, eurCount: 0, audCount: 0 },
    }),
    resetCryptoAmount: (state, { payload }) => ({
      ...state,
      cryptoAmount: 0,
    }),
    setOrderId: (state, { payload }) => ({
      ...state,
      orderId: payload,
    }),
  },
  extraReducers(builder) {
    builder
      .addCase(getEURCurrency.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.eurCurrency = action.payload;
      })
      .addCase(getAUDCurrency.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.audCurrency = action.payload;
      })
      .addCase(getGBPCurrency.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.gbpCurrency = action.payload;
      })
      .addCase(getUSDCurrency.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.usdCurrency = action.payload;
      })
      .addCase(convertToCrypto.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.cryptoAmount = action.payload;
      })
      .addCase(getTotalMid.fulfilled, (state, action) => {
        if (action?.payload === undefined) {
          return;
        }
        state.raisedMid = action.payload;
        state.balanceMid = action.payload;
      })
      .addCase(getTokenCount.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.tokenData = action.payload;
      })
      .addCase(getTransactionByOrderId.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.orderData = action.payload;
      });
  },
});
export const { resetRaisedMid, resetTokenData, resetCryptoAmount, setOrderId } =
  currencySlice.actions;
export default currencySlice.reducer;
