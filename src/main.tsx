import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { getRouter } from './router.tsx'

import './styles.css'

const appElement = document.getElementById('app')

if (!appElement) {
  throw new Error('Root element #app was not found')
}

createRoot(appElement).render(
  <StrictMode>
    <RouterProvider router={getRouter()} />
  </StrictMode>,
)
