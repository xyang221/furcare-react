import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import router from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { ThemeProvider } from '@emotion/react'
import {theme} from './theme.jsx' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <ContextProvider>
    <RouterProvider router={router} />
    </ContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
