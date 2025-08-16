import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from 'sentry-expo';
// Import your custom providers and utilities
import { MoxieProvider, MoxieClient } from '@/path/to/MoxieProvider';
import { MoxieModel, MoxieSplits, MoxieFilter, MoxieError } from '@/path/to/models';
import { CustomDecoderAndEncoder } from '@/path/to/utils';

export enum NotificationOption {
  Hour = 'hour',
  Week = 'week',
  Month = 'month',
}

interface MoxieState {
  persistence: any;
  wallets: string[];
  fansCount: string;
  input: string;
  confettiCounter: number;
  model: MoxieModel;
  isLoading: boolean;
  price: number;
  totalPoolRewards: number;
  timeAgo: string;
  userInputNotifications: number;
  isSearchMode: boolean;
  moxieChangeText: string;
  isNotificationSheetPresented: boolean;
  moxieSplits: MoxieSplits;
  selectedNotificationOptions: NotificationOption[];
  filterSelection: number;
  error: Error | null;
  dollarValueMoxie: number;
  inputFID: number;
}

type Action =
  | { type: 'SET_WALLETS'; payload: string[] }
  | { type: 'SET_FANS_COUNT'; payload: string }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_CONFETTI_COUNTER'; payload: number }
  | { type: 'SET_MODEL'; payload: MoxieModel }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PRICE'; payload: number }
  | { type: 'SET_TOTAL_POOL_REWARDS'; payload: number }
  | { type: 'SET_TIME_AGO'; payload: string }
  | { type: 'SET_USER_INPUT_NOTIFICATIONS'; payload: number }
  | { type: 'SET_SEARCH_MODE'; payload: boolean }
  | { type: 'SET_MOXIE_CHANGE_TEXT'; payload: string }
  | { type: 'SET_NOTIFICATION_SHEET_PRESENTED'; payload: boolean }
  | { type: 'SET_MOXIE_SPLITS'; payload: MoxieSplits }
  | { type: 'SET_SELECTED_NOTIFICATION_OPTIONS'; payload: NotificationOption[] }
  | { type: 'SET_FILTER_SELECTION'; payload: number }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_DOLLAR_VALUE_MOXIE'; payload: number }
  | { type: 'SET_INPUT_FID'; payload: number }
  | { type: 'RESET_STATE' };

const initialState: MoxieState = {
  persistence: {},
  wallets: [],
  fansCount: '',
  input: '',
  confettiCounter: 0,
  model: MoxieModel.noop,
  isLoading: false,
  price: 0,
  totalPoolRewards: 0,
  timeAgo: '',
  userInputNotifications: 0,
  isSearchMode: false,
  moxieChangeText: '',
  isNotificationSheetPresented: false,
  moxieSplits: MoxieSplits.placeholder,
  selectedNotificationOptions: [],
  filterSelection: 0,
  error: null,
  dollarValueMoxie: 0,
  inputFID: 0,
};

const MoxieContext = createContext<{
  state: MoxieState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useMoxie = () => useContext(MoxieContext);

const moxieReducer = (state: MoxieState, action: Action): MoxieState => {
  switch (action.type) {
    case 'SET_WALLETS':
      return { ...state, wallets: action.payload };
    case 'SET_FANS_COUNT':
      return { ...state, fansCount: action.payload };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_CONFETTI_COUNTER':
      return { ...state, confettiCounter: action.payload };
    case 'SET_MODEL':
      return { ...state, model: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PRICE':
      return { ...state, price: action.payload };
    case 'SET_TOTAL_POOL_REWARDS':
      return { ...state, totalPoolRewards: action.payload };
    case 'SET_TIME_AGO':
      return { ...state, timeAgo: action.payload };
    case 'SET_USER_INPUT_NOTIFICATIONS':
      return { ...state, userInputNotifications: action.payload };
    case 'SET_SEARCH_MODE':
      return { ...state, isSearchMode: action.payload };
    case 'SET_MOXIE_CHANGE_TEXT':
      return { ...state, moxieChangeText: action.payload };
    case 'SET_NOTIFICATION_SHEET_PRESENTED':
      return { ...state, isNotificationSheetPresented: action.payload };
    case 'SET_MOXIE_SPLITS':
      return { ...state, moxieSplits: action.payload };
    case 'SET_SELECTED_NOTIFICATION_OPTIONS':
      return { ...state, selectedNotificationOptions: action.payload };
    case 'SET_FILTER_SELECTION':
      return { ...state, filterSelection: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DOLLAR_VALUE_MOXIE':
      return { ...state, dollarValueMoxie: action.payload };
    case 'SET_INPUT_FID':
      return { ...state, inputFID: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

export const MoxieProviderComponent = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(moxieReducer, initialState);
  const client: MoxieProvider = new MoxieClient(); // Initialize your MoxieProvider

  useEffect(() => {
    const initialize = async () => {
      try {
        const persistence = await AsyncStorage.getItem('userDefaults');
        dispatch({
          type: 'RESET_STATE',
        });
        dispatch({
          type: 'SET_INPUT_FID',
          payload: state.input ? parseInt(state.input, 10) : 0,
        });
        const userInputNotifications =
          parseFloat(persistence?.userInputNotificationsData || '0') || 0;
        dispatch({
          type: 'SET_USER_INPUT_NOTIFICATIONS',
          payload: userInputNotifications,
        });
        // Additional initialization if needed
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    initialize();
    setupListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupListeners = () => {
    // Handle selectedNotificationOptions changes
    Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    // Implement similar listeners as in SwiftUI using useEffect
    // For example, handle price changes, model updates, etc.
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    // Handle notification responses
  };

  // Implement functions analogous to SwiftUI methods
  const updateNotificationOption = (option: NotificationOption) => {
    const updatedOptions = state.selectedNotificationOptions.includes(option)
      ? state.selectedNotificationOptions.filter((opt) => opt !== option)
      : [...state.selectedNotificationOptions, option];
    dispatch({
      type: 'SET_SELECTED_NOTIFICATION_OPTIONS',
      payload: updatedOptions,
    });
    // Handle scheduling notifications
    scheduleNotifications(updatedOptions);
  };

  const scheduleNotifications = async (options: NotificationOption[]) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      options.forEach(async (option) => {
        let interval: number;
        switch (option) {
          case NotificationOption.Hour:
            interval = 3600; // 1 hour
            break;
          case NotificationOption.Week:
            interval = 3600 * 24 * 7; // 1 week
            break;
          case NotificationOption.Month:
            interval = 3600 * 24 * 30; // 1 month
            break;
          default:
            interval = 3600;
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: '$MOXIE earnings',
            body: `${state.model.allEarningsAmount}`,
            sound: 'default',
          },
          trigger: { seconds: interval, repeats: true },
        });
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const fetchStats = async (filter: MoxieFilter) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newModel = await client.fetchMoxieStats(state.inputFID, filter);
      dispatch({ type: 'SET_MODEL', payload: newModel });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      if (
        error.message !== 'Invalid' &&
        error.message !== 'cancelled'
      ) {
        dispatch({
          type: 'SET_ERROR',
          payload:
            error.message === 'The data couldn’t be read because it is missing.'
              ? MoxieError.message('User does not have Moxie pass')
              : MoxieError.message(error.message),
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: MoxieError.message(error.message) });
      }
      Sentry.captureException(error);
    }
  };

  const contextValue = {
    state,
    dispatch,
    client,
    updateNotificationOption,
    fetchStats,
    // Add other methods as needed
  };

  return <MoxieContext.Provider value={contextValue}>{children}</MoxieContext.Provider>;
}; 