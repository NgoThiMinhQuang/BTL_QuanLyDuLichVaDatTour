import { Alert, Button, Checkbox, Col, DatePicker, Divider, Form, Input, Row, Select, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PATHS } from '../../paths'
import { register } from '../../services/auth/register'

const { Paragraph, Title, Text } = Typography
const { TextArea } = Input

interface RegisterFormValues {
  hoTen: string
  email: string
  matKhau: string
  xacNhanMatKhau: string
  soDienThoai?: string
  diaChi?: string
  gioiTinh?: string
  ngaySinh?: unknown
  soGiayTo?: string
  dongYDieuKhoan?: boolean
}

const registerHighlights = [
  'Đặt tour nhanh chóng và dễ dàng',
  'Lưu tour yêu thích và nhận thông báo giảm giá',
  'Quản lý booking và thanh toán trực tuyến',
  'Tư vấn viên hỗ trợ 24/7',
]

export default function Register() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      await register({
        hoTen: values.hoTen,
        email: values.email,
        matKhau: values.matKhau,
        soDienThoai: values.soDienThoai || undefined,
        diaChi: values.diaChi || undefined,
      })

      setSuccessMessage('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.')
      setTimeout(() => navigate(PATHS.login), 800)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng ký thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-shell auth-shell-register">
        <div className="auth-showcase auth-showcase-register">
          <section className="auth-showcase-panel auth-showcase-panel-primary auth-showcase-panel-register">
            <Space direction="vertical" size={28} className="auth-panel-stack">
              <Text className="auth-panel-pill">Thành viên Travel Viet</Text>

              <Space direction="vertical" size={18}>
                <Title className="auth-panel-title">Bắt đầu hành trình của bạn</Title>
                <Paragraph className="auth-panel-description">
                  Tạo tài khoản để quản lý các chuyến đi, nhận ưu đãi độc quyền và trải nghiệm dịch vụ tốt nhất.
                </Paragraph>
              </Space>

              <Space direction="vertical" size={18} className="auth-panel-features">
                {registerHighlights.map((item) => (
                  <Text key={item} className="auth-panel-feature">
                    ✓ {item}
                  </Text>
                ))}
              </Space>
            </Space>
          </section>

          <section className="auth-showcase-panel auth-showcase-panel-form auth-showcase-panel-form-register">
            <div className="auth-form-wrap auth-form-wrap-register">
              <Space direction="vertical" size={10} className="auth-form-heading">
                <Title className="auth-form-title">Tạo tài khoản mới</Title>
                <Paragraph className="auth-form-subtitle">
                  Điền thông tin để bắt đầu hành trình cùng Travel Viet.
                </Paragraph>
              </Space>

              {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
              {successMessage ? <Alert type="success" showIcon message={successMessage} /> : null}

              <Form layout="vertical" onFinish={handleSubmit} autoComplete="off" className="auth-form auth-form-register">
                <div className="auth-register-section">
                  <Title level={3} className="auth-register-section-title">
                    Thông tin đăng nhập
                  </Title>

                  <Form.Item
                    label={
                      <span>
                        Email <span className="auth-required">*</span>
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input size="large" placeholder="ban@domain.com" className="auth-input" />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span>
                        Mật khẩu <span className="auth-required">*</span>
                      </span>
                    }
                    name="matKhau"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                    extra="Mật khẩu tối thiểu 6 ký tự"
                  >
                    <Input.Password size="large" placeholder="••••••••" className="auth-input" />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span>
                        Xác nhận mật khẩu <span className="auth-required">*</span>
                      </span>
                    }
                    name="xacNhanMatKhau"
                    dependencies={['matKhau']}
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('matKhau') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password size="large" placeholder="••••••••" className="auth-input" />
                  </Form.Item>
                </div>

                <div className="auth-register-section">
                  <Title level={3} className="auth-register-section-title">
                    Thông tin cá nhân
                  </Title>

                  <Form.Item
                    label={
                      <span>
                        Họ và tên <span className="auth-required">*</span>
                      </span>
                    }
                    name="hoTen"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input size="large" placeholder="Nguyễn Văn A" className="auth-input" />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Số điện thoại" name="soDienThoai">
                        <Input size="large" placeholder="0123 456 789" className="auth-input" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Giới tính" name="gioiTinh">
                        <Select
                          size="large"
                          placeholder="Chọn giới tính"
                          options={[
                            { label: 'Nam', value: 'Nam' },
                            { label: 'Nữ', value: 'Nữ' },
                            { label: 'Khác', value: 'Khác' },
                          ]}
                          className="auth-select"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Ngày sinh" name="ngaySinh">
                    <DatePicker size="large" format="DD/MM/YYYY" placeholder="dd/mm/yyyy" className="auth-date-picker" />
                  </Form.Item>

                  <Form.Item label="Địa chỉ" name="diaChi">
                    <TextArea
                      rows={4}
                      placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      className="auth-textarea"
                    />
                  </Form.Item>

                  <Form.Item label="CMND/Hộ chiếu" name="soGiayTo">
                    <Input size="large" placeholder="Số CMND hoặc hộ chiếu" className="auth-input" />
                  </Form.Item>
                </div>

                <Form.Item
                  name="dongYDieuKhoan"
                  valuePropName="checked"
                  rules={[
                    {
                      validator(_, value) {
                        if (value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Vui lòng đồng ý với điều khoản sử dụng'))
                      },
                    },
                  ]}
                >
                  <Checkbox>
                    Tôi đồng ý với <Link to={PATHS.about}>Điều khoản sử dụng</Link> và{' '}
                    <Link to={PATHS.about}>Chính sách bảo mật</Link>
                  </Checkbox>
                </Form.Item>

                <Button type="primary" htmlType="submit" size="large" block loading={submitting} className="auth-submit-button">
                  Đăng ký
                </Button>
              </Form>

              <Divider className="auth-divider">Hoặc</Divider>

              <div className="auth-social-grid">
                <Button size="large" className="auth-social-button">
                  Google
                </Button>
                <Button size="large" className="auth-social-button">
                  Facebook
                </Button>
              </div>

              <Paragraph className="auth-switch">
                Đã có tài khoản? <Link to={PATHS.login}>Đăng nhập ngay</Link>
              </Paragraph>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
