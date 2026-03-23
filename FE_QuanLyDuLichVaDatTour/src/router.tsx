import { Layout } from 'antd'
import { Route, Routes } from 'react-router'
import { HeaderChung } from './shared/layout/HeaderChung'
import { PATHS } from './paths'
import About from './pages/About'
import Home from './pages/Home'

const { Content } = Layout

export default function AppRouter() {
  return (
    <Layout className="app-shell">
      <HeaderChung />
      <Content className="app-content">
        <Routes>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.about} element={<About />} />
        </Routes>
      </Content>
    </Layout>
  )
}
