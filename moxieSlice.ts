import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface MoxieState {
  selectedWallet: string;
  isClaimRequested: boolean;
  isClaimSuccess: boolean;
  isClaimAlertShowing: boolean;
  isClaimDialogShowing: boolean;
  isClaimDialogShowingRewards: boolean;
  filterSelection: number;
  error: string | null;
}

const initialState: MoxieState = {
  selectedWallet: '',
  isClaimRequested: false,
  isClaimSuccess: false,
  isClaimAlertShowing: false,
  isClaimDialogShowing: false,
  isClaimDialogShowingRewards: false,
  filterSelection: 0,
  error: null,
};

export const moxieSlice = createSlice({
  name: 'moxie',
  initialState,
  reducers: {
    setSelectedWallet: (state, action: PayloadAction<string>) => {
      state.selectedWallet = action.payload;
    },
    setClaimRequested: (state, action: PayloadAction<boolean>) => {
      state.isClaimRequested = action.payload;
    },
    setClaimSuccess: (state, action: PayloadAction<boolean>) => {
      state.isClaimSuccess = action.payload;
    },
    setClaimAlertShowing: (state, action: PayloadAction<boolean>) => {
      state.isClaimAlertShowing = action.payload;
    },
    setClaimDialogShowing: (state, action: PayloadAction<boolean>) => {
      state.isClaimDialogShowing = action.payload;
    },
    setClaimDialogShowingRewards: (state, action: PayloadAction<boolean>) => {
      state.isClaimDialogShowingRewards = action.payload;
    },
    setFilterSelection: (state, action: PayloadAction<number>) => {
      state.filterSelection = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedWallet,
  setClaimRequested,
  setClaimSuccess,
  setClaimAlertShowing,
  setClaimDialogShowing,
  setClaimDialogShowingRewards,
  setFilterSelection,
  setError,
} = moxieSlice.actions;

export const moxieReducer = moxieSlice.reducer;
