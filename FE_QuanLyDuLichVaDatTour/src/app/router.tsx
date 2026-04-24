import { App as AntApp, Layout } from 'antd'
import type React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { Header } from '../components/Header'
import { PATHS } from '../constants/paths'
import { useAuthStore } from '../store/authStore'
import AboutPage from '../pages/AboutPage'
import AdminBookingListPage from '../pages/AdminBookingListPage/AdminBookingListPage'
import AdminDashboardPage from '../pages/AdminDashboardPage/AdminDashboardPage'
import AdminDiaDiemListPage from '../pages/AdminDiaDiemListPage/AdminDiaDiemListPage'
import AdminLichKhoiHanhListPage from '../pages/AdminLichKhoiHanhListPage/AdminLichKhoiHanhListPage'
import AdminLichTrinhListPage from '../pages/AdminLichTrinhListPage/AdminLichTrinhListPage'
import AdminLoaiTourListPage from '../pages/AdminLoaiTourListPage/AdminLoaiTourListPage'
import AdminPaymentListPage from '../pages/AdminPaymentListPage/AdminPaymentListPage'
import AdminReviewModerationPage from '../pages/AdminReviewModerationPage/AdminReviewModerationPage'
import AdminTinTucListPage from '../pages/AdminTinTucListPage/AdminTinTucListPage'
import AdminTourListPage from '../pages/AdminTourListPage/AdminTourListPage'
import AdminVoucherListPage from '../pages/AdminVoucherListPage/AdminVoucherListPage'
import BookingPage from '../pages/BookingPage'
import ContactPage from '../pages/ContactPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import MyBookingDetailPage from '../pages/MyBookingDetailPage'
import MyBookingsPage from '../pages/MyBookingsPage'
import MyReviewsPage from '../pages/MyReviewsPage'
import NewsDetailPage from '../pages/NewsDetailPage'
import NewsPage from '../pages/NewsPage'
import RegisterPage from '../pages/RegisterPage'
import SchedulePage from '../pages/SchedulePage'
import TourDetailPage from '../pages/TourDetailPage'
import TourPage from '../pages/TourPage'
import AdminLayout from '../components/AdminLayout/AdminLayout'

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
    <AntApp>
      <Routes>
        <Route path="/*" element={clientLayout} />

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
          <Route path="bookings" element={<AdminBookingListPage />} />
          <Route path="payments" element={<AdminPaymentListPage />} />
          <Route path="reviews" element={<AdminReviewModerationPage />} />
          <Route path="loai-tour" element={<AdminLoaiTourListPage />} />
          <Route path="dia-diem" element={<AdminDiaDiemListPage />} />
          <Route path="vouchers" element={<AdminVoucherListPage />} />
          <Route path="tin-tuc" element={<AdminTinTucListPage />} />
          <Route path="lich-khoi-hanh" element={<AdminLichKhoiHanhListPage />} />
          <Route path="lich-trinh" element={<AdminLichTrinhListPage />} />
        </Route>
      </Routes>
    </AntApp>
  )
}
