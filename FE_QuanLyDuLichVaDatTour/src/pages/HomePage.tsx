import './HomePage.css'
import { useMemo } from 'react'
import { Space } from 'antd'
import { MucTourNoiBat } from '../components/home/MucTourNoiBat'
import { BannerTrangChu } from '../components/home/BannerTrangChu'
import { UuDaiTrangChu } from '../components/home/UuDaiTrangChu'
import { DanhMucTour } from '../components/home/DanhMucTour'
import { DiemDenPhoBien } from '../components/home/DiemDenPhoBien'
import { MucLichKhoiHanhGan } from '../components/home/MucLichKhoiHanhGan'
import { BanDoDuLich } from '../components/home/BanDoDuLich'
import { GioiThieuTrangChu } from '../components/home/GioiThieuTrangChu'
import { LyDoChonChungToi } from '../components/home/LyDoChonChungToi'
import { DanhGiaKhachHang } from '../components/home/DanhGiaKhachHang'
import { TuVanTrangChu } from '../components/home/TuVanTrangChu'
import { useTourNoiBat } from '../services/tour/tour.hooks'

export default function Home() {
  const {
    data: featuredTours = [],
    isLoading: isFeaturedToursLoading,
    isError: isFeaturedToursError,
    refetch: refetchFeaturedTours,
  } = useTourNoiBat()

  const visibleFeaturedTours = useMemo(() => featuredTours.slice(0, 3), [featuredTours])

  return (
    <Space orientation="vertical" size={0} className="home-page">
      <BannerTrangChu />
      <GioiThieuTrangChu />
      <MucTourNoiBat
        tours={visibleFeaturedTours}
        isLoading={isFeaturedToursLoading}
        isError={isFeaturedToursError}
        onRetry={() => refetchFeaturedTours()}
      />
      <DanhMucTour />
      <DiemDenPhoBien />
      <BanDoDuLich />
      <MucLichKhoiHanhGan tours={featuredTours} />
      <UuDaiTrangChu />
      <DanhGiaKhachHang />
      <TuVanTrangChu />
      <LyDoChonChungToi />
    </Space>
  )
}
