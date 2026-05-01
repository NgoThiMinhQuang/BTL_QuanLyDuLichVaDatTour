import './GioiThieuTrangChu.css'
import { Button, Card, Col, Row, Typography } from 'antd'
import { 
  ArrowRightOutlined, 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  TrophyFilled
} from '@ant-design/icons'
import aboutImage from '../../assets/Banner.jpg'

const { Paragraph, Title } = Typography

const highlights = [
  { text: 'Hơn 10 năm kinh nghiệm', icon: <SafetyCertificateOutlined />, color: '#3b82f6', bg: '#eff6ff' },
  { text: 'Đội ngũ chuyên nghiệp', icon: <TeamOutlined />, color: '#10b981', bg: '#ecfdf5' },
  { text: 'Giá cả hợp lý', icon: <DollarOutlined />, color: '#f59e0b', bg: '#fffbeb' },
  { text: 'Dịch vụ 24/7', icon: <ClockCircleOutlined />, color: '#8b5cf6', bg: '#f5f3ff' },
]

export function GioiThieuTrangChu() {
  return (
    <Card className="home-section about-us-section" variant="borderless">
      <Row gutter={[48, 48]} align="middle">
        <Col xs={24} xl={12}>
          <div className="about-us-content-wrapper">
            <div className="about-us-badge">
              <span className="about-us-badge-dot"></span>
              VỀ CHÚNG TÔI
            </div>

            <Title className="about-us-title">
              Khám Phá Thế Giới Cùng <span className="about-us-title-highlight">Travel Viet</span>
            </Title>
            
            <Paragraph className="about-us-description">
              <strong>Travel Viet</strong> là công ty du lịch tại Việt Nam, chuyên tổ chức các tour du lịch
              chất lượng cao với hơn 10 năm kinh nghiệm trong ngành. Chúng tôi tự hào đã phục vụ hơn
              <span className="about-us-text-strong"> 10,000 khách hàng </span> 
              và mang đến những trải nghiệm du lịch đáng nhớ.
            </Paragraph>
            <Paragraph className="about-us-description">
              Với đội ngũ hướng dẫn viên chuyên nghiệp, giàu kinh nghiệm và đam mê du lịch, chúng tôi
              cam kết mang đến cho bạn những hành trình khám phá đầy thú vị, an toàn và tiết kiệm.
            </Paragraph>

            <div className="about-us-features-grid">
              {highlights.map((item, index) => (
                <div key={index} className="about-us-feature-card">
                  <div className="about-us-feature-icon" style={{ color: item.color, backgroundColor: item.bg }}>
                    {item.icon}
                  </div>
                  <span className="about-us-feature-text">{item.text}</span>
                </div>
              ))}
            </div>

            <Button type="primary" size="large" className="about-us-action-btn" href="#tu-van-tour" icon={<ArrowRightOutlined />} iconPlacement="end">
              Khám phá thêm
            </Button>
          </div>
        </Col>

        <Col xs={24} xl={12}>
          <div className="about-us-visual-wrapper">
            <div className="about-us-image-container">
              <img src={aboutImage} alt="Giới thiệu Travel Viet" className="about-us-main-image" />
              <div className="about-us-image-overlay"></div>
            </div>

            {/* Experience floating badge */}
            <div className="about-us-experience-badge">
              <div className="experience-number">10+</div>
              <div className="experience-text">Năm kinh<br/>nghiệm</div>
            </div>

            {/* Award floating card */}
            <Card className="about-us-award-card" variant="borderless">
              <div className="about-us-award-icon-wrapper">
                <TrophyFilled className="about-us-award-icon" />
              </div>
              <div className="about-us-award-content">
                <Title level={5} className="about-us-award-title">Giải Thưởng</Title>
                <Paragraph className="about-us-award-description">Công ty du lịch xuất sắc 2025</Paragraph>
              </div>
            </Card>
            
            {/* Decorative element */}
            <div className="about-us-decoration-pattern"></div>
          </div>
        </Col>
      </Row>
    </Card>
  )
}
