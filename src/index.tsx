import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';
import { AuthProvider } from 'contexts/auth';
import { UserAuthProvider } from 'contexts/UserAuth';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const store = configureStore({ reducer: rootReducer, devTools: true });
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
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <App />
          </BrowserRouter>
        </Provider>
      </UserAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

