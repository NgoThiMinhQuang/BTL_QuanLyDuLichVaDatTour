import './Footer.css'
import { 
  FacebookOutlined, 
  InstagramOutlined, 
  YoutubeOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined,
  SendOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { Button, Col, Divider, Input, Row, Space, Typography } from 'antd'
import { Link } from 'react-router'
import { PATHS } from '../constants/paths'

const { Paragraph, Title, Text } = Typography

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <Row gutter={[40, 40]}>
          {/* Company Info */}
          <Col xs={24} md={12} lg={7}>
            <div className="footer-brand">
              <Title level={3} className="footer-logo">
                VN<span>Culture</span>Bridge
              </Title>
              <Paragraph className="footer-intro">
                Kết nối tinh hoa văn hóa và mang đến những hành trình khám phá Việt Nam trọn vẹn nhất cho bạn.
              </Paragraph>
              <div className="footer-socials">
                <a href="#" className="social-link"><FacebookOutlined /></a>
                <a href="#" className="social-link"><InstagramOutlined /></a>
                <a href="#" className="social-link"><YoutubeOutlined /></a>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} md={6} lg={4}>
            <Title level={5} className="footer-title">Khám phá</Title>
            <ul className="footer-links">
              <li><Link to={PATHS.home}>Trang chủ</Link></li>
              <li><Link to={PATHS.tour}>Danh sách tour</Link></li>
              <li><Link to={PATHS.about}>Về chúng tôi</Link></li>
              <li><Link to={PATHS.tinTuc}>Tin tức du lịch</Link></li>
              <li><Link to={PATHS.lienHe}>Liên hệ</Link></li>
            </ul>
          </Col>

          {/* Services */}
          <Col xs={12} md={6} lg={4}>
            <Title level={5} className="footer-title">Dịch vụ</Title>
            <ul className="footer-links">
              <li><Link to={PATHS.tour}>Đặt tour du lịch</Link></li>
              <li><Link to={PATHS.lichKhoiHanh}>Lịch khởi hành</Link></li>
              <li><Link to={PATHS.lienHe}>Tư vấn miễn phí</Link></li>
              <li><Link to={PATHS.login}>Tài khoản</Link></li>
            </ul>
          </Col>

          {/* Newsletter & Contact */}
          <Col xs={24} lg={9}>
            <Title level={5} className="footer-title">Đăng ký nhận tin</Title>
            <Paragraph className="footer-newsletter-text">
              Nhận thông tin về các tour khuyến mãi và điểm đến mới nhất hàng tuần.
            </Paragraph>
            <div className="footer-newsletter-form">
              <Input 
                placeholder="Email của bạn..." 
                className="newsletter-input" 
                suffix={
                  <Button type="primary" icon={<SendOutlined />} className="newsletter-btn" />
                }
              />
            </div>
            
            <div className="footer-contact-info">
              <div className="contact-item">
                <EnvironmentOutlined className="contact-icon" />
                <span>Khu đô thị Đại học Quốc gia, TP. Thủ Đức, TP. Hồ Chí Minh</span>
              </div>
              <div className="contact-item">
                <PhoneOutlined className="contact-icon" />
                <span>+84 123 456 789</span>
              </div>
              <div className="contact-item">
                <MailOutlined className="contact-icon" />
                <span>contact@vnculturebridge.vn</span>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="footer-divider" />

        <div className="footer-bottom">
          <Text className="copyright">
            © {currentYear} VN Culture Bridge. Toàn bộ bản quyền được bảo lưu.
          </Text>
          <div className="footer-bottom-links">
            <Link to="#">Chính sách bảo mật</Link>
            <Link to="#">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
