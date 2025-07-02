import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // MUI
import 'leaflet/dist/leaflet.css';


import CssBaseline from '@mui/material/CssBaseline';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // AUTH CONTEXT FILE

import { AuthProvider } from '@/context/authProvider'; // RIGHT-TO-LEFT SUPPORT COMPONENT

import RTL from '@/components/rtl'; // ROUTES METHOD

import { routes } from './routes'; // MUI THEME CREATION METHOD

import { createCustomTheme } from './theme'; // SITE SETTINGS CUSTOM DEFINED HOOK

import useSettings from '@/hooks/useSettings'; // I18N FILE

// ** Store Imports
import { store } from './store'
import { Provider } from 'react-redux'

import './i18n';
import { Toaster } from 'react-hot-toast';
export default function App() {
  // SITE SETTINGS CUSTOM DEFINED HOOK
  const {
    settings
  } = useSettings(); // MUI THEME CREATION

  const theme = createCustomTheme(settings); // ROUTER CREATE

  const router = createBrowserRouter(routes());
  return <Provider store={store}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RTL>
            <CssBaseline />
            <RouterProvider router={router} />
          </RTL>
        </AuthProvider>
      </ThemeProvider>
    </LocalizationProvider>;
    <Toaster  position={"top-right"} 
        toastOptions={{ className: "react-hot-toast" }}/>
     </Provider>
}