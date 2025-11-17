// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./slices/authSlice";
import teamsSlice from "./slices/teamSlice";
import projectsSlice from "./slices/projectSlice";
import tasksSlice from "./slices/taskSlice";
import activitySlice from "./slices/activitySlice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  teams: teamsSlice,
  projects: projectsSlice,
  tasks: tasksSlice,
  activity: activitySlice,
});

const persistConfig = {
  key: "smart-task-manager",
  storage,
  version: 1,
  whitelist: ["auth", "teams", "projects", "tasks", "activity"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
