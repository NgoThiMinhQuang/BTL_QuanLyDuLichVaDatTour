import './Home.css'
import { Space } from 'antd'
import { MucTuVan } from '../../components/home/MucTuVan'
import { MucDanhGia } from '../../components/home/MucDanhGia'
import { MucTourNoiBat } from '../../components/home/MucTourNoiBat'
import { MucBanner } from '../../components/home/MucBanner'
import { MucUuDai } from '../../components/home/MucUuDai'
import { MucLoaiTour } from '../../components/home/MucLoaiTour'
import { MucLichKhoiHanh } from '../../components/home/MucLichKhoiHanh'
import { MucLyDoChon } from '../../components/home/MucLyDoChon'
import { MucGioiThieu } from '../../components/home/MucGioiThieu'
import { useTourNoiBat } from '../../services/tour/useTourNoiBat'

export default function Home() {
  const { data: featuredTours = [] } = useTourNoiBat(6)

  return (
    <Space orientation="vertical" size={0} className="home-page">
      <MucBanner />
      <MucGioiThieu />
      <MucTourNoiBat />
      <MucLoaiTour />
      <MucLichKhoiHanh tours={featuredTours} />
      <MucUuDai />
      <MucLyDoChon />
      <MucDanhGia />
      <MucTuVan />
    </Space>
  )
}
