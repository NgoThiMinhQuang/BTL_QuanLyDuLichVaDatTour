import { Layout } from 'antd'
import type React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { HeaderChung } from './components/common/HeaderChung'
import { PATHS } from './paths'
import About from './pages/About/About'
import Booking from './pages/Booking/Booking'
import BookingDetail from './pages/BookingDetail/BookingDetail'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import MyBookings from './pages/MyBookings/MyBookings'
import MyReviews from './pages/MyReviews/MyReviews'
import Register from './pages/Register/Register'
import Tour from './pages/Tour/Tour'
import TourChiTiet from './pages/TourDetail/TourDetail'
import LichKhoiHanh from './pages/LichKhoiHanh/LichKhoiHanh'
import TinTuc from './pages/TinTuc/TinTuc'
import TinTucChiTiet from './pages/TinTuc/TinTucChiTiet'
import Contact from './pages/Contact/Contact'

const { Content } = Layout

function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation()
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    const redirectPath = `${location.pathname}${location.search}`
    const loginPath = `${PATHS.login}?redirect=${encodeURIComponent(redirectPath)}`

    return <Navigate to={loginPath} replace state={{ from: redirectPath }} />
  }

  return children
}

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
          <Route path={PATHS.booking} element={<RequireAuth><Booking /></RequireAuth>} />
          <Route path={PATHS.myBookings} element={<RequireAuth><MyBookings /></RequireAuth>} />
          <Route path={PATHS.myBookingDetail} element={<RequireAuth><BookingDetail /></RequireAuth>} />
          <Route path={PATHS.myReviews} element={<RequireAuth><MyReviews /></RequireAuth>} />
        </Routes>
      </Content>
    </Layout>
  )
}
