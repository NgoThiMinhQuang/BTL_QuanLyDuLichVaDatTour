import './Footer.css'
import { 
  FacebookFilled, 
  InstagramFilled, 
  YoutubeFilled, 
  TwitterCircleFilled,
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined,
  SendOutlined,
  ArrowUpOutlined
} from '@ant-design/icons'
import { Button, Col, Divider, Input, Row, Space, Typography } from 'antd'
import { Link } from 'react-router'
import { PATHS } from '../constants/paths'

const { Paragraph, Title, Text } = Typography

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="main-footer">
      <div className="footer-wave">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="footer-container">
        <Row gutter={[60, 40]}>
          {/* Brand & Slogan */}
          <Col xs={24} lg={9}>
            <div className="footer-brand-section">
              <Link to={PATHS.home} className="footer-logo-link">
                <Title level={2} className="footer-logo">
                  Travel<span>Viet</span>
                </Title>
              </Link>
              <Paragraph className="footer-slogan">
                Khám phá vẻ đẹp bất tận của Việt Nam qua những hành trình được thiết kế riêng biệt, mang đến trải nghiệm du lịch đẳng cấp và ý nghĩa nhất.
              </Paragraph>
              <div className="footer-social-wrapper">
                <a href="#" className="footer-social-icon facebook" aria-label="Facebook"><FacebookFilled /></a>
                <a href="#" className="footer-social-icon instagram" aria-label="Instagram"><InstagramFilled /></a>
                <a href="#" className="footer-social-icon youtube" aria-label="Youtube"><YoutubeFilled /></a>
                <a href="#" className="footer-social-icon twitter" aria-label="Twitter"><TwitterCircleFilled /></a>
              </div>
            </div>
          </Col>

          {/* Navigation Links */}
          <Col xs={12} sm={8} lg={5}>
            <Title level={5} className="footer-section-title">Khám phá</Title>
            <ul className="footer-nav-links">
              <li><Link to={PATHS.home}>Trang chủ</Link></li>
              <li><Link to={PATHS.tour}>Danh sách tour</Link></li>
              <li><Link to={PATHS.about}>Về chúng tôi</Link></li>
              <li><Link to={PATHS.tinTuc}>Cẩm nang du lịch</Link></li>
              <li><Link to={PATHS.lienHe}>Hỗ trợ khách hàng</Link></li>
            </ul>
          </Col>

          {/* Quick Services */}
          <Col xs={12} sm={8} lg={5}>
            <Title level={5} className="footer-section-title">Dịch vụ</Title>
            <ul className="footer-nav-links">
              <li><Link to={PATHS.tour}>Đặt tour trực tuyến</Link></li>
              <li><Link to={PATHS.lichKhoiHanh}>Lịch trình dự kiến</Link></li>
              <li><Link to={PATHS.lienHe}>Tư vấn 24/7</Link></li>
              <li><Link to={PATHS.login}>Quản lý tài khoản</Link></li>
            </ul>
          </Col>

          {/* Contact Quick Info */}
          <Col xs={24} sm={8} lg={5}>
            <Title level={5} className="footer-section-title">Liên hệ</Title>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <div className="icon-box"><EnvironmentOutlined /></div>
                <div className="text-box">
                  <Text strong>Địa chỉ</Text>
                  <Text>TP. Thủ Đức, Hồ Chí Minh</Text>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="icon-box"><PhoneOutlined /></div>
                <div className="text-box">
                  <Text strong>Hotline</Text>
                  <Text>1900 6868</Text>
                </div>
              </div>
              <div className="footer-contact-item">
                <div className="icon-box"><MailOutlined /></div>
                <div className="text-box">
                  <Text strong>Email</Text>
                  <Text>hello@travelviet.vn</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>


        <Divider className="footer-light-divider" />

        <div className="footer-bottom-bar">
          <Text className="copy-text">
            © {currentYear} <span className="brand-accent">TravelViet</span>. Toàn bộ bản quyền được bảo lưu.
          </Text>
          <Space size={32} className="footer-legal-links">
            <Link to="#">Chính sách bảo mật</Link>
            <Link to="#">Điều khoản dịch vụ</Link>
            <Link to="#">Quy định thanh toán</Link>
          </Space>
          <Button 
            shape="circle" 
            icon={<ArrowUpOutlined />} 
            className="back-to-top"
            onClick={scrollToTop}
          />
        </div>
      </div>
    </footer>
  )
}