import './BannerTrangChu.css'
import { DatePicker, Select, Space, Typography } from 'antd'
import bannerImage from '../../assets/Banner.jpg'
import { SearchOutlined, EnvironmentOutlined, AppstoreOutlined, CalendarOutlined } from '@ant-design/icons'

const { Paragraph, Title } = Typography

export function BannerTrangChu() {
  return (
    <div className="home-banner-wrapper">
      <div className="home-hero-container" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="home-hero-overlay" />
        
        <div className="home-hero-content-wrapper">
          <Space orientation="vertical" size={24} className="home-hero-intro">
            <div className="home-hero-badge">
              <span className="home-hero-badge-dot"></span>
              Khám phá Việt Nam
            </div>

            <Space orientation="vertical" size={16} className="home-hero-text-group">
              <Title level={1} className="home-hero-title">
                Khởi đầu hành trình<br/>
                <span className="home-hero-title-highlight">đáng nhớ của bạn</span>
              </Title>
              <Paragraph className="home-hero-description">
                Cùng TravelViet khám phá những điểm đến tuyệt đẹp, trải nghiệm văn hóa độc đáo và tạo nên những kỷ niệm khó quên.
              </Paragraph>
            </Space>
          </Space>
        </div>
      </div>

      <div className="home-hero-search-wrapper">
        <div className="home-search-bar">
          
          {/* Field 1: Tour Name */}
          <div className="home-search-item">
            <div className="home-search-item-icon"><SearchOutlined /></div>
            <div className="home-search-item-content">
              <label>Tên tour</label>
              <input type="text" placeholder="Bạn muốn đi đâu?" className="home-search-native-input"/>
            </div>
          </div>

          <div className="home-search-divider" />

          {/* Field 2: Destination */}
          <div className="home-search-item">
            <div className="home-search-item-icon"><EnvironmentOutlined /></div>
            <div className="home-search-item-content">
              <label>Điểm đến</label>
              <Select
                variant="borderless"
                placeholder="Chọn điểm đến"
                className="home-search-select"
                popupClassName="home-search-dropdown"
                options={[
                  { value: 'ha-noi', label: 'Hà Nội' },
                  { value: 'da-nang', label: 'Đà Nẵng' },
                  { value: 'phu-quoc', label: 'Phú Quốc' },
                ]}
                suffixIcon={null}
              />
            </div>
          </div>

          <div className="home-search-divider" />

          {/* Field 3: Tour Type */}
          <div className="home-search-item">
            <div className="home-search-item-icon"><AppstoreOutlined /></div>
            <div className="home-search-item-content">
              <label>Loại tour</label>
              <Select
                variant="borderless"
                placeholder="Chọn loại tour"
                className="home-search-select"
                popupClassName="home-search-dropdown"
                options={[
                  { value: 'trong-nuoc', label: 'Tour trong nước' },
                  { value: 'bien-dao', label: 'Tour biển đảo' },
                  { value: 'nghi-duong', label: 'Tour nghỉ dưỡng' },
                ]}
                suffixIcon={null}
              />
            </div>
          </div>

          <div className="home-search-divider" />

          {/* Field 4: Date */}
          <div className="home-search-item date-item">
            <div className="home-search-item-icon"><CalendarOutlined /></div>
            <div className="home-search-item-content">
              <label>Ngày khởi hành</label>
              <DatePicker
                variant="borderless"
                format="DD/MM/YYYY"
                placeholder="Thêm ngày"
                className="home-search-date-picker"
                suffixIcon={null}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="home-search-action">
            <button className="home-search-btn">
              <SearchOutlined className="home-search-btn-icon" />
              <span className="home-search-btn-text">Tìm kiếm</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
