import { Layout } from 'antd'
import { Route, Routes, useLocation } from 'react-router'
import { HeaderChung } from './shared/layout/HeaderChung'
import { PATHS } from './paths'
import About from './pages/About'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Tour from './pages/Tour'

const { Content } = Layout

export default function AppRouter() {
  const location = useLocation()
  const isAuthPage = location.pathname === PATHS.login || location.pathname === PATHS.register

  return (
    <Layout className="app-shell">
      {!isAuthPage ? <HeaderChung /> : null}
      <Content className="app-content">
        <Routes>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.about} element={<About />} />
          <Route path={PATHS.tour} element={<Tour />} />
          <Route path={PATHS.login} element={<Login />} />
          <Route path={PATHS.register} element={<Register />} />
        </Routes>
      </Content>
    </Layout>
  )
}
