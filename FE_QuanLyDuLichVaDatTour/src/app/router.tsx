import { Layout } from 'antd'
import type React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { Header } from '../components/Header'
import { PATHS } from '../constants/paths'
import { useAuthStore } from '../store/authStore'
import AboutPage from '../pages/AboutPage'
import BookingPage from '../pages/BookingPage'
import MyBookingDetailPage from '../pages/MyBookingDetailPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import MyBookingsPage from '../pages/MyBookingsPage'
import MyReviewsPage from '../pages/MyReviewsPage'
import RegisterPage from '../pages/RegisterPage'
import TourPage from '../pages/TourPage'
import TourDetailPage from '../pages/TourDetailPage'
import SchedulePage from '../pages/SchedulePage'
import NewsPage from '../pages/NewsPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import ContactPage from '../pages/ContactPage'
import AdminLayout from '../components/AdminLayout/AdminLayout'
import AdminDashboardPage from '../pages/AdminDashboardPage/AdminDashboardPage'
import AdminTourListPage from '../pages/AdminTourListPage/AdminTourListPage'

const { Content } = Layout

function getRedirectPath(location: ReturnType<typeof useLocation>) {
  return `${location.pathname}${location.search}`
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    const redirectPath = getRedirectPath(location)
    const loginPath = `${PATHS.login}?redirect=${encodeURIComponent(redirectPath)}`

    return <Navigate to={loginPath} replace state={{ from: redirectPath }} />
  }

  return children
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentUser = useAuthStore((state) => state.currentUser)
  const redirectPath = getRedirectPath(location)

  if (!accessToken) {
    const loginPath = `${PATHS.login}?redirect=${encodeURIComponent(redirectPath)}`
    return <Navigate to={loginPath} replace state={{ from: redirectPath }} />
  }

  if (currentUser?.vaiTro?.toLowerCase() !== 'admin') {
    return <Navigate to={PATHS.home} replace />
  }

  return children
}

export default function AppRouter() {
  const location = useLocation()
  const isAuthPage = location.pathname === PATHS.login || location.pathname === PATHS.register

  const clientLayout = (
    <Layout className="app-shell">
      {!isAuthPage ? <Header /> : null}
      <Content className="app-content">
        <Routes>
          <Route path={PATHS.home} element={<HomePage />} />
          <Route path={PATHS.about} element={<AboutPage />} />
          <Route path={PATHS.tour} element={<TourPage />} />
          <Route path={PATHS.tourChiTiet} element={<TourDetailPage />} />
          <Route path={PATHS.lichKhoiHanh} element={<SchedulePage />} />
          <Route path={PATHS.tinTuc} element={<NewsPage />} />
          <Route path={PATHS.tinTucChiTiet} element={<NewsDetailPage />} />
          <Route path={PATHS.lienHe} element={<ContactPage />} />
          <Route path={PATHS.login} element={<LoginPage />} />
          <Route path={PATHS.register} element={<RegisterPage />} />
          <Route path={PATHS.booking} element={<RequireAuth><BookingPage /></RequireAuth>} />
          <Route path={PATHS.myBookings} element={<RequireAuth><MyBookingsPage /></RequireAuth>} />
          <Route path={PATHS.myBookingDetail} element={<RequireAuth><MyBookingDetailPage /></RequireAuth>} />
          <Route path={PATHS.myReviews} element={<RequireAuth><MyReviewsPage /></RequireAuth>} />
        </Routes>
      </Content>
    </Layout>
  )

  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/*" element={clientLayout} />
      
      {/* Admin Routes */}
      <Route
        path={PATHS.admin}
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="tours" element={<AdminTourListPage />} />
      </Route>
    </Routes>
  )
}
