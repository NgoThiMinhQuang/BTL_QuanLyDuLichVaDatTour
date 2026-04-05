import './BannerTrangChu.css'
import { Button, Card, DatePicker, Input, Select, Space, Typography } from 'antd'
import bannerImage from '../../assets/Banner.jpg'

const { Paragraph, Title } = Typography

export function BannerTrangChu() {
  return (
    <>
      <Card className="home-section hero-section" variant="borderless" style={{ backgroundImage: `linear-gradient(180deg, rgba(8, 15, 37, 0.12), rgba(8, 15, 37, 0.36)), url(${bannerImage})` }}>
        <div className="hero-overlay" />
        <div className="hero-content">
          <Space orientation="vertical" size={22} className="hero-intro">
            <span className="hero-kicker">Khám phá Việt Nam</span>

            <Space orientation="vertical" size={14}>
              <Title level={1} className="hero-title">
                Khám phá vẻ đẹp Việt Nam
              </Title>
              <Paragraph className="hero-description">
                Trải nghiệm những hành trình tuyệt vời và tạo nên kỷ niệm đáng nhớ cùng chúng tôi.
              </Paragraph>
            </Space>
          </Space>
        </div>
      </Card>

      <Card className="home-section hero-search-section" variant="borderless">
        <Card className="hero-search-card" variant="borderless">
          <Space direction="vertical" size={28} className="hero-search-stack">
            <Title level={2} className="hero-search-title">
              Tìm kiếm tour của bạn
            </Title>

            <div className="hero-search-grid">
              <div className="hero-search-field">
                <label htmlFor="hero-tour-name">Tên tour</label>
                <Input id="hero-tour-name" placeholder="Nhập tên tour..." size="large" className="hero-search-input" />
              </div>

              <div className="hero-search-field">
                <label htmlFor="hero-diem-den">Điểm đến</label>
                <Select
                  id="hero-diem-den"
                  size="large"
                  placeholder="Chọn điểm đến"
                  className="hero-search-input"
                  options={[
                    { value: 'ha-noi', label: 'Hà Nội' },
                    { value: 'da-nang', label: 'Đà Nẵng' },
                    { value: 'phu-quoc', label: 'Phú Quốc' },
                  ]}
                />
              </div>

              <div className="hero-search-field">
                <label htmlFor="hero-loai-tour">Loại tour</label>
                <Select
                  id="hero-loai-tour"
                  size="large"
                  placeholder="Chọn loại tour"
                  className="hero-search-input"
                  options={[
                    { value: 'trong-nuoc', label: 'Tour trong nước' },
                    { value: 'bien-dao', label: 'Tour biển đảo' },
                    { value: 'nghi-duong', label: 'Tour nghỉ dưỡng' },
                  ]}
                />
              </div>

              <div className="hero-search-field">
                <label htmlFor="hero-ngay-khoi-hanh">Ngày khởi hành</label>
                <DatePicker
                  id="hero-ngay-khoi-hanh"
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder="dd/mm/yyyy"
                  className="hero-search-input hero-search-date"
                />
              </div>

              <div className="hero-search-submit-wrap">
                <Button type="primary" size="large" className="hero-search-button" href="#tour-noi-bat">
                  Tìm kiếm
                </Button>
              </div>
            </div>
          </Space>
        </Card>
      </Card>
    </>
  )
}
