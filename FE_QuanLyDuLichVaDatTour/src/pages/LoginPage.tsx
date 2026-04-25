import { Alert, Button, Checkbox, Divider, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'
import { PATHS } from '../constants/paths'
import { login } from '../services/auth/login'
import { useAuthStore } from '../store/authStore'

const { Paragraph, Title, Text } = Typography

interface LoginFormValues {
  email: string
  matKhau: string
  ghiNho?: boolean
}

const loginHighlights = [
  'Theo dõi tình trạng đặt tour theo thời gian thực',
  'Lưu tour yêu thích và nhận thông báo giảm giá',
  'Tư vấn viên hỗ trợ 24/7 trong suốt hành trình',
]

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const redirectParam = searchParams.get('redirect')
  const redirectPath =
    (typeof location.state?.from === 'string' && location.state.from) ||
    (redirectParam && redirectParam.startsWith('/') ? redirectParam : null) ||
    PATHS.home
  const setAuthSession = useAuthStore((state) => state.setAuthSession)

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)

      const response = await login({
        email: values.email,
        matKhau: values.matKhau,
      })

      setAuthSession(response.accessToken, {
        id: response.id,
        email: response.email,
        hoTen: response.hoTen,
        vaiTro: response.vaiTro,
        trangThai: response.trangThai,
      }, Boolean(values.ghiNho))

      if (response.vaiTro.toLowerCase() === 'admin') {
        navigate(PATHS.admin, { replace: true })
      } else {
        navigate(redirectPath, { replace: true })
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page auth-page-login">
      <div className="auth-shell">
        <div className="auth-topbar">
          <Link to={PATHS.home} className="auth-branding">
            <div className="auth-brand-logo">✈</div>
            <Space direction="vertical" size={0}>
              <Text className="auth-brand-name">Travel Viet</Text>
              <Text className="auth-brand-tagline">Chạm tới mọi hành trình</Text>
            </Space>
          </Link>

          <Link to={PATHS.home} className="auth-home-link">
            ← Quay về trang chủ
          </Link>
        </div>

        <div className="auth-showcase auth-showcase-login">
          <section className="auth-showcase-panel auth-showcase-panel-primary">
            <Space direction="vertical" size={28} className="auth-panel-stack">
              <Text className="auth-panel-pill">Thành viên Travel Viet</Text>

              <Space direction="vertical" size={18}>
                <Title className="auth-panel-title">Đăng nhập để tiếp tục khám phá</Title>
                <Paragraph className="auth-panel-description">
                  Tạo và quản lý các chuyến đi yêu thích, nhận ưu đãi độc quyền và đồng bộ lịch trình trên mọi thiết bị.
                </Paragraph>
              </Space>

              <Space direction="vertical" size={18} className="auth-panel-features">
                {loginHighlights.map((item) => (
                  <Text key={item} className="auth-panel-feature">
                    ✓ {item}
                  </Text>
                ))}
              </Space>

              <div className="auth-panel-metrics">
                <div>
                  <Title level={2} className="auth-panel-metric-value">
                    10.000+
                  </Title>
                  <Text className="auth-panel-metric-label">Khách hàng tin tưởng</Text>
                </div>
                <div>
                  <Title level={2} className="auth-panel-metric-value">
                    4.9/5
                  </Title>
                  <Text className="auth-panel-metric-label">Điểm hài lòng trung bình</Text>
                </div>
              </div>
            </Space>
          </section>

          <section className="auth-showcase-panel auth-showcase-panel-form">
            <div className="auth-form-wrap">
              <Space direction="vertical" size={10} className="auth-form-heading">
                <Title className="auth-form-title">Chào mừng trở lại</Title>
                <Paragraph className="auth-form-subtitle">
                  Nhập thông tin để tiếp tục hành trình cùng Travel Viet.
                </Paragraph>
              </Space>

              {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}

              <Form layout="vertical" onFinish={handleSubmit} autoComplete="off" className="auth-form">
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input size="large" placeholder="ban@domain.com" className="auth-input" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="matKhau"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                  <Input.Password size="large" placeholder="••••••••" className="auth-input" />
                </Form.Item>

                <div className="auth-form-meta">
                  <Form.Item name="ghiNho" valuePropName="checked" noStyle>
                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                  </Form.Item>

                  <Link to={PATHS.forgotPassword} className="auth-inline-link">
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button type="primary" htmlType="submit" size="large" block loading={submitting} className="auth-submit-button">
                  Đăng nhập
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
                Chưa có tài khoản? <Link to={redirectPath === PATHS.home ? PATHS.register : `${PATHS.register}?redirect=${encodeURIComponent(redirectPath)}`}>Đăng ký ngay</Link>
              </Paragraph>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
