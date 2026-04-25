import './DiemDenPhoBien.css'
import { Link } from 'react-router'
import { PATHS } from '../../constants/paths'
import { TieuDeMuc } from '../common/TieuDeMuc'
import { ArrowRightOutlined } from '@ant-design/icons'

const destinations = [
  {
    name: 'Đà Nẵng',
    tours: 2,
    image: 'https://ik.imagekit.io/tvlk/blog/2022/09/dia-diem-check-in-da-nang-cover.jpeg',
    size: 'large-wide'
  },
  {
    name: 'Phú Quốc',
    tours: 1,
    image: 'https://i1-dulich.vnecdn.net/2022/04/08/dulichPhuQuoc-1649392573-9234-1649405369.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=SU6n3IvJxW1Sla0xqg31Kg',
    size: 'small'
  },
  {
    name: 'Hội An',
    tours: 2,
    image: 'https://cdn-images.vtv.vn/2019/8/28/hoi-an-1-15669737585991662159115.jpg',
    size: 'large-tall'
  },
  {
    name: 'Hạ Long',
    tours: 1,
    image: 'https://cdn-media.sforum.vn/storage/app/media/ctv_seo3/anh-vinh-ha-long-thumbnail.jpg',
    size: 'small'
  },
  {
    name: 'Nha Trang',
    tours: 1,
    image: 'https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/102023/nh3_20231020164026.jpg',
    size: 'small'
  },
  {
    name: 'Đà Lạt',
    tours: 1,
    image: 'https://samtenhills.vn/wp-content/uploads/2024/01/top-20-cac-diem-du-lich-da-lat.jpg',
    size: 'large-wide'
  },
]

function formatTourCount(count: number) {
  return `${count} tour${count > 1 ? 's' : ''}`
}

export function DiemDenPhoBien() {
  return (
    <section className="popular-destinations-section">
      <TieuDeMuc
        title="Điểm đến phổ biến"
        description="Khám phá những địa điểm du lịch được yêu thích và chọn nhanh hành trình phù hợp cho kỳ nghỉ tiếp theo."
      />

      <div className="popular-destinations-bento">
        {destinations.map((destination) => (
          <Link to={PATHS.tour} className={`destination-card ${destination.size}`} key={destination.name}>
            <div className="destination-image-wrapper">
              <img src={destination.image} alt={destination.name} className="destination-image" loading="lazy" />
              <div className="destination-overlay" />
            </div>
            
            <div className="destination-info">
              <div className="destination-badge">{formatTourCount(destination.tours)}</div>
              <div className="destination-details">
                <span className="destination-name">{destination.name}</span>
                <div className="destination-action">
                  <span>Khám phá</span>
                  <ArrowRightOutlined className="destination-icon" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
