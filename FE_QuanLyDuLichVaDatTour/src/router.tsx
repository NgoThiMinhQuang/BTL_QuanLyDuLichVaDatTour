import { Layout } from 'antd'
import { Route, Routes, useLocation } from 'react-router'
import { HeaderChung } from './components/common/HeaderChung'
import { PATHS } from './paths'
import About from './pages/About/About'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Tour from './pages/Tour/Tour'
import TourChiTiet from './pages/TourDetail/TourDetail'
import LichKhoiHanh from './pages/LichKhoiHanh/LichKhoiHanh'
import TinTuc from './pages/TinTuc/TinTuc'
import TinTucChiTiet from './pages/TinTuc/TinTucChiTiet'
import Contact from './pages/Contact/Contact'

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
          <Route path={PATHS.tourChiTiet} element={<TourChiTiet />} />
          <Route path={PATHS.lichKhoiHanh} element={<LichKhoiHanh />} />
          <Route path={PATHS.tinTuc} element={<TinTuc />} />
          <Route path={PATHS.tinTucChiTiet} element={<TinTucChiTiet />} />
          <Route path={PATHS.lienHe} element={<Contact />} />
          <Route path={PATHS.login} element={<Login />} />
          <Route path={PATHS.register} element={<Register />} />
        </Routes>
      </Content>
    </Layout>
  )
}
