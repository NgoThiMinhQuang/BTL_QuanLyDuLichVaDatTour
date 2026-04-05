import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/reset.css'
import './index.css'
import App from './app/App'
import { AppProvider } from './libs/providers/AppProvider'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Không tìm thấy phần tử root')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
