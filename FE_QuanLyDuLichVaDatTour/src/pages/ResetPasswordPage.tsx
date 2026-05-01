import { Alert, Button, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PATHS } from '../constants/paths'
import { resetPassword } from '../services/auth/resetPassword'

const { Paragraph, Title, Text } = Typography

interface ResetPasswordFormValues {
  matKhauMoi: string
  xacNhanMatKhau: string
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const token = searchParams.get('token')?.trim() || ''

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setErrorMessage('Liên kết đặt lại mật khẩu không hợp lệ')
      return
    }

    try {
      setSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      await resetPassword({ token, matKhauMoi: values.matKhauMoi })
      setSuccessMessage('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.')
      setTimeout(() => navigate(PATHS.login, { replace: true }), 900)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể đặt lại mật khẩu')
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
            <Space orientation="vertical" size={0}>
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
            <Space orientation="vertical" size={24} className="auth-panel-stack">
              <Text className="auth-panel-pill">Mật khẩu mới</Text>
              <Space orientation="vertical" size={18}>
                <Title className="auth-panel-title">Bảo vệ tài khoản của bạn</Title>
                <Paragraph className="auth-panel-description">
                  Tạo mật khẩu mới tối thiểu 6 ký tự để tiếp tục quản lý hành trình cùng Travel Viet.
                </Paragraph>
              </Space>
            </Space>
          </section>

          <section className="auth-showcase-panel auth-showcase-panel-form">
            <div className="auth-form-wrap">
              <Space orientation="vertical" size={10} className="auth-form-heading">
                <Title className="auth-form-title">Đặt lại mật khẩu</Title>
                <Paragraph className="auth-form-subtitle">
                  Nhập mật khẩu mới cho tài khoản của bạn.
                </Paragraph>
              </Space>

              {!token ? <Alert type="error" showIcon title="Liên kết đặt lại mật khẩu không hợp lệ" /> : null}
              {errorMessage ? <Alert type="error" showIcon title={errorMessage} /> : null}
              {successMessage ? <Alert type="success" showIcon title={successMessage} /> : null}

              <Form layout="vertical" onFinish={handleSubmit} autoComplete="off" className="auth-form">
                <Form.Item
                  label="Mật khẩu mới"
                  name="matKhauMoi"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                    { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                  ]}
                >
                  <Input.Password size="large" placeholder="••••••••" className="auth-input" disabled={!token} />
                </Form.Item>

                <Form.Item
                  label="Xác nhận mật khẩu"
                  name="xacNhanMatKhau"
                  dependencies={['matKhauMoi']}
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('matKhauMoi') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" placeholder="••••••••" className="auth-input" disabled={!token} />
                </Form.Item>

                <Button type="primary" htmlType="submit" size="large" block loading={submitting} disabled={!token} className="auth-submit-button">
                  Đặt lại mật khẩu
                </Button>
              </Form>

              <Paragraph className="auth-switch">
                Cần tạo link mới? <Link to={PATHS.forgotPassword}>Quên mật khẩu</Link>
              </Paragraph>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
