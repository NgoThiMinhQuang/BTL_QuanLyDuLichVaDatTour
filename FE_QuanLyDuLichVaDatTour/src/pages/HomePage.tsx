import './HomePage.css'
import { Space } from 'antd'
import { MucTourNoiBat } from '../components/home/MucTourNoiBat'
import { BannerTrangChu } from '../components/home/BannerTrangChu'
import { UuDaiTrangChu } from '../components/home/UuDaiTrangChu'
import { DanhMucTour } from '../components/home/DanhMucTour'
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
  } = useTourNoiBat(6)

  return (
    <Space orientation="vertical" size={0} className="home-page">
      <BannerTrangChu />
      <GioiThieuTrangChu />
      <MucTourNoiBat
        tours={featuredTours}
        isLoading={isFeaturedToursLoading}
        isError={isFeaturedToursError}
        onRetry={() => refetchFeaturedTours()}
      />
      <DanhMucTour />
      <BanDoDuLich />
      <MucLichKhoiHanhGan tours={featuredTours} />
      <UuDaiTrangChu />
      <DanhGiaKhachHang />
      <TuVanTrangChu />
      <LyDoChonChungToi />
    </Space>
  )
}
