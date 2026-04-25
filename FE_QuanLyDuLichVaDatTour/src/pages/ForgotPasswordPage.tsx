import { Alert, Button, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { PATHS } from '../constants/paths'
import { forgotPassword } from '../services/auth/forgotPassword'

const { Paragraph, Title, Text } = Typography

interface ForgotPasswordFormValues {
  email: string
}

export default function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resetLink, setResetLink] = useState<string | null>(null)

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)
      setResetLink(null)

      const response = await forgotPassword({ email: values.email.trim() })
      setSuccessMessage(response.message)
      setResetLink(response.resetLink || (response.resetToken ? `${PATHS.resetPassword}?token=${encodeURIComponent(response.resetToken)}` : null))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể tạo liên kết đặt lại mật khẩu')
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

          <Link to={PATHS.login} className="auth-home-link">
            ← Quay về đăng nhập
          </Link>
        </div>

        <div className="auth-showcase auth-showcase-login">
          <section className="auth-showcase-panel auth-showcase-panel-primary">
            <Space direction="vertical" size={24} className="auth-panel-stack">
              <Text className="auth-panel-pill">Khôi phục tài khoản</Text>
              <Space direction="vertical" size={18}>
                <Title className="auth-panel-title">Lấy lại quyền truy cập</Title>
                <Paragraph className="auth-panel-description">
                  Nhập email đã đăng ký để tạo liên kết đặt lại mật khẩu trong chế độ demo của hệ thống.
                </Paragraph>
              </Space>
            </Space>
          </section>

          <section className="auth-showcase-panel auth-showcase-panel-form">
            <div className="auth-form-wrap">
              <Space direction="vertical" size={10} className="auth-form-heading">
                <Title className="auth-form-title">Quên mật khẩu</Title>
                <Paragraph className="auth-form-subtitle">
                  Nếu email tồn tại, hệ thống sẽ tạo liên kết đặt lại mật khẩu để bạn tiếp tục.
                </Paragraph>
              </Space>

              {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
              {successMessage ? <Alert type="success" showIcon message={successMessage} /> : null}
              {resetLink ? (
                <Alert
                  type="info"
                  showIcon
                  message="Link demo đặt lại mật khẩu"
                  description={<Link to={resetLink}>Mở trang đặt lại mật khẩu</Link>}
                />
              ) : null}

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

                <Button type="primary" htmlType="submit" size="large" block loading={submitting} className="auth-submit-button">
                  Tạo liên kết đặt lại mật khẩu
                </Button>
              </Form>

              <Paragraph className="auth-switch">
                Nhớ mật khẩu? <Link to={PATHS.login}>Đăng nhập ngay</Link>
              </Paragraph>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
