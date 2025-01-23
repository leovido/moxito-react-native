import { configureStore } from "@reduxjs/toolkit";
import { type Api } from "@reduxjs/toolkit/query";

export function setupApiStore(api: Api<any, any, any, any>) {
  const storeRef = {
    store: configureStore({
      reducer: {
        [api.reducerPath]: api.reducer,
      },
      middleware: (gdm) => gdm().concat(api.middleware),
    }),
  };
  return storeRef;
} 