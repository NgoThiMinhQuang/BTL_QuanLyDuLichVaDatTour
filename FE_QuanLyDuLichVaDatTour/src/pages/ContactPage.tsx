import './Contact/Contact.css'
import { ClockCircleOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, Select, Typography } from 'antd'

const { Paragraph, Title } = Typography
const { TextArea } = Input

const subjectOptions = [
  { value: 'tu-van-tour', label: 'Tư vấn tour' },
  { value: 'lich-khoi-hanh', label: 'Lịch khởi hành' },
  { value: 'booking', label: 'Hỗ trợ đặt tour' },
  { value: 'khac', label: 'Khác' },
]

const workingHours = [
  { label: 'Thứ 2 - Thứ 6', time: '8:00 - 18:00' },
  { label: 'Thứ 7 - Chủ nhật', time: '8:00 - 17:00' },
  { label: 'Hotline 24/7', time: '1900 1234' },
]

export default function Contact() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <Title className="contact-hero-title">Liên hệ với chúng tôi</Title>
          <Paragraph className="contact-hero-description">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </Paragraph>
        </div>
      </section>

      <div className="contact-page-container">
        <section className="contact-info-grid">
          <Card className="contact-info-card" variant="borderless">
            <div className="contact-info-icon contact-info-icon-blue">
              <EnvironmentOutlined />
            </div>
            <Title level={3} className="contact-info-title">Địa chỉ</Title>
            <Paragraph className="contact-info-text">
              123 Đường ABC, Quận 1, TP. Hồ Chí Minh
            </Paragraph>
          </Card>

          <Card className="contact-info-card" variant="borderless">
            <div className="contact-info-icon contact-info-icon-green">
              <PhoneOutlined />
            </div>
            <Title level={3} className="contact-info-title">Điện thoại</Title>
            <Paragraph className="contact-info-text">
              Hotline: 1900 1234
              <br />
              Mobile: 0901 234 567
            </Paragraph>
          </Card>

          <Card className="contact-info-card" variant="borderless">
            <div className="contact-info-icon contact-info-icon-orange">
              <MailOutlined />
            </div>
            <Title level={3} className="contact-info-title">Email</Title>
            <Paragraph className="contact-info-text">
              info@dulich.vn
              <br />
              support@dulich.vn
            </Paragraph>
          </Card>
        </section>

        <section className="contact-content-grid">
          <Card className="contact-form-card" variant="borderless">
            <Title className="contact-section-title">Gửi tin nhắn cho chúng tôi</Title>

            <Form layout="vertical" className="contact-form">
              <div className="contact-form-row">
                <Form.Item label="Họ và tên *" className="contact-form-item">
                  <Input placeholder="Nhập họ tên" className="contact-input" />
                </Form.Item>
                <Form.Item label="Số điện thoại *" className="contact-form-item">
                  <Input placeholder="Nhập số điện thoại" className="contact-input" />
                </Form.Item>
              </div>

              <Form.Item label="Email *">
                <Input placeholder="Nhập email" className="contact-input" />
              </Form.Item>

              <Form.Item label="Chủ đề">
                <Select options={subjectOptions} placeholder="Chọn chủ đề" className="contact-select" />
              </Form.Item>

              <Form.Item label="Nội dung *">
                <TextArea placeholder="Nhập nội dung tin nhắn..." rows={6} className="contact-textarea" />
              </Form.Item>

              <Button type="primary" className="contact-submit-button" icon={<SendOutlined />}>
                Gửi tin nhắn
              </Button>
            </Form>
          </Card>

          <div className="contact-side-stack">
            <Card className="contact-hours-card" variant="borderless">
              <Title className="contact-section-title">Thời gian làm việc</Title>
              <div className="contact-hours-list">
                {workingHours.map((item) => (
                  <div key={item.label} className="contact-hours-item">
                    <ClockCircleOutlined className="contact-hours-icon" />
                    <div>
                      <div className="contact-hours-label">{item.label}</div>
                      <div className="contact-hours-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="contact-map-card" variant="borderless">
              <iframe
                className="contact-map-frame"
                src="https://www.google.com/maps?q=123%20Duong%20ABC%20Quan%201%20TP%20Ho%20Chi%20Minh&z=15&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ liên hệ TravelViet"
              />
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
