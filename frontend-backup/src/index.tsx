import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';
import { AuthProvider } from './contexts/auth';
import { UserAuthProvider } from './contexts/UserAuth';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import '@mdi/font/css/materialdesignicons.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserAuthProvider>
        <Provider store={store}>
          <BrowserRouter
            basename={import.meta.env.PUBLIC_URL}
          >
            <ToastContainer />
            <App />
          </BrowserRouter>
        </Provider>
      </UserAuthProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
