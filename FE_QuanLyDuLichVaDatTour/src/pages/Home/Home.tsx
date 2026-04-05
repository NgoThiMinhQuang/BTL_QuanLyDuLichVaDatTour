import './Home.css'
import { Space } from 'antd'
import { CacMucThongTinTrangChu } from '../../components/trang_chu/CacMucThongTinTrangChu'
import { MucTourNoiBat } from '../../components/home/MucTourNoiBat'
import { MucBanner } from '../../components/home/MucBanner'
import { MucUuDai } from '../../components/home/MucUuDai'
import { MucLoaiTour } from '../../components/home/MucLoaiTour'
import { MucLichKhoiHanh } from '../../components/home/MucLichKhoiHanh'
import { MucBanDo } from '../../components/home/MucBanDo'
import { useTourNoiBat } from '../../services/tour/tour.hooks'

export default function Home() {
  const {
    data: featuredTours = [],
    isLoading: isFeaturedToursLoading,
    isError: isFeaturedToursError,
    refetch: refetchFeaturedTours,
  } = useTourNoiBat(6)

  return (
    <Space orientation="vertical" size={0} className="home-page">
      <MucBanner />
      <MucTourNoiBat
        tours={featuredTours}
        isLoading={isFeaturedToursLoading}
        isError={isFeaturedToursError}
        onRetry={() => refetchFeaturedTours()}
      />
      <MucLoaiTour />
      <MucBanDo />
      <MucLichKhoiHanh tours={featuredTours} />
      <MucUuDai />
      <CacMucThongTinTrangChu />
    </Space>
  )
}
