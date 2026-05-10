import '../styles/app.css'
import '../styles/auth.css'
import AppRouter from './router'
import { FloatingChatButton } from '../components/chat/FloatingChatButton'

export default function App() {
  return (
    <>
      <AppRouter />
      <FloatingChatButton />
    </>
  )
}
