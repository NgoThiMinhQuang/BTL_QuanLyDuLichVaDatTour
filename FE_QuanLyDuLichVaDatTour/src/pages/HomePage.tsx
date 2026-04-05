import './HomePage.css'
import { Space } from 'antd'
import { CacMucThongTinTrangChu } from '../components/home/CacMucThongTinTrangChu'
import { MucTourNoiBat } from '../components/home/MucTourNoiBat'
import { BannerTrangChu } from '../components/home/BannerTrangChu'
import { UuDaiTrangChu } from '../components/home/UuDaiTrangChu'
import { DanhMucTour } from '../components/home/DanhMucTour'
import { MucLichKhoiHanhGan } from '../components/home/MucLichKhoiHanhGan'
import { BanDoDuLich } from '../components/home/BanDoDuLich'
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
      <CacMucThongTinTrangChu />
    </Space>
  )
}
