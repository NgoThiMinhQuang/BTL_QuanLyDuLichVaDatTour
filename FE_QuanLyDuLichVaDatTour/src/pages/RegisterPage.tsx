import { Alert, Button, Checkbox, Divider, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PATHS } from '../constants/paths'
import { register } from '../services/auth/register'

const { Paragraph, Title, Text } = Typography
const { TextArea } = Input

interface RegisterFormValues {
  hoTen: string
  email: string
  matKhau: string
  xacNhanMatKhau: string
  soDienThoai?: string
  diaChi?: string
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
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const redirectParam = searchParams.get('redirect')
  const loginPath = redirectParam && redirectParam.startsWith('/')
    ? `${PATHS.login}?redirect=${encodeURIComponent(redirectParam)}`
    : PATHS.login

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      await register({
        hoTen: values.hoTen.trim(),
        email: values.email.trim(),
        matKhau: values.matKhau,
        soDienThoai: values.soDienThoai?.trim() || undefined,
        diaChi: values.diaChi?.trim() || undefined,
      })

      setSuccessMessage('Đăng ký thành công. Bạn có thể đăng nhập ngay bây giờ.')
      setTimeout(() => navigate(loginPath), 800)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng ký thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-split-image">
        <Link to={PATHS.home} className="auth-branding-large">
          <div className="auth-brand-logo">✈</div>
          <Text className="auth-brand-name-large">Travel Viet</Text>
        </Link>
        <div className="auth-image-content">
          <h1 className="auth-quote-title">Bắt đầu<br/>hành trình mới</h1>
          <p className="auth-quote-text">Tạo tài khoản để quản lý các chuyến đi, nhận ưu đãi độc quyền và trải nghiệm dịch vụ tốt nhất cùng Travel Viet.</p>
        </div>
      </div>

      <div className="auth-split-form">
        <div className="auth-topbar">
          <Link to={PATHS.home} className="auth-home-link">
            ← Quay về trang chủ
          </Link>
        </div>

        <div className="auth-form-container auth-form-container-register">
          <div className="auth-form-heading">
            <Title className="auth-form-title">Tạo tài khoản mới</Title>
            <Paragraph className="auth-form-subtitle">
              Điền thông tin để bắt đầu hành trình cùng Travel Viet.
            </Paragraph>
          </div>

          {errorMessage ? <Alert type="error" showIcon message={errorMessage} style={{ marginBottom: 24 }} /> : null}
          {successMessage ? <Alert type="success" showIcon message={successMessage} style={{ marginBottom: 24 }} /> : null}

          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off" className="auth-form">
            <div className="auth-form-grid">
              <Form.Item
                label={<span>Họ và tên <span className="auth-required">*</span></span>}
                name="hoTen"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input size="large" placeholder="Nguyễn Văn A" className="auth-input" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="soDienThoai"
              >
                <Input size="large" placeholder="0123 456 789" className="auth-input" />
              </Form.Item>

              <Form.Item
                label={<span>Email <span className="auth-required">*</span></span>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
                className="auth-form-full-width"
              >
                <Input size="large" placeholder="ban@domain.com" className="auth-input" />
              </Form.Item>

              <Form.Item
                label={<span>Mật khẩu <span className="auth-required">*</span></span>}
                name="matKhau"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                ]}
              >
                <Input.Password size="large" placeholder="••••••••" className="auth-input" />
              </Form.Item>

              <Form.Item
                label={<span>Xác nhận mật khẩu <span className="auth-required">*</span></span>}
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

              <Form.Item label="Địa chỉ" name="diaChi" className="auth-form-full-width">
                <TextArea
                  rows={3}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="auth-textarea"
                />
              </Form.Item>

              <Form.Item
                name="dongYDieuKhoan"
                valuePropName="checked"
                className="auth-form-full-width"
                rules={[
                  {
                    validator(_, value) {
                      if (value) return Promise.resolve()
                      return Promise.reject(new Error('Vui lòng đồng ý với điều khoản sử dụng'))
                    },
                  },
                ]}
              >
                <Checkbox>
                  Tôi đồng ý với <Link to={PATHS.about}>Điều khoản sử dụng</Link> và <Link to={PATHS.about}>Chính sách bảo mật</Link>
                </Checkbox>
              </Form.Item>
            </div>

            <Button type="primary" htmlType="submit" size="large" block loading={submitting} className="auth-submit-button">
              Đăng ký
            </Button>
          </Form>

          <Divider className="auth-divider">Hoặc tiếp tục với</Divider>

          <div className="auth-social-grid">
            <Button size="large" className="auth-social-button">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="auth-social-icon" />
              Google
            </Button>
            <Button size="large" className="auth-social-button">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="auth-social-icon" />
              Facebook
            </Button>
          </div>

          <Paragraph className="auth-switch">
            Đã có tài khoản? <Link to={PATHS.login}>Đăng nhập ngay</Link>
          </Paragraph>
        </div>
      </div>
      </div>
    </div>
  )
}
