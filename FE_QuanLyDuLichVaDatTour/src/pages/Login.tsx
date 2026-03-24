import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PATHS } from '../paths'
import { login } from '../services/auth/login'

const { Paragraph, Title, Text } = Typography

interface LoginFormValues {
  email: string
  matKhau: string
}

export default function Login() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)

      const response = await login(values)
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: response.id,
          email: response.email,
          hoTen: response.hoTen,
          vaiTro: response.vaiTro,
          trangThai: response.trangThai,
        }),
      )

      navigate(PATHS.home)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đăng nhập thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <Space orientation="vertical" size={18} style={{ width: '100%' }}>
          <Space orientation="vertical" size={6}>
            <Text className="auth-kicker">Chào mừng bạn quay lại</Text>
            <Title level={2} className="auth-title">
              Đăng nhập tài khoản
            </Title>
            <Paragraph className="auth-description">
              Đăng nhập để theo dõi booking, thanh toán và quản lý hành trình của bạn.
            </Paragraph>
          </Space>

          {errorMessage ? <Alert type="error" showIcon title={errorMessage} /> : null}

          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input size="large" placeholder="nhap@email.com" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="matKhau"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Đăng nhập
            </Button>
          </Form>

          <Paragraph className="auth-switch">
            Chưa có tài khoản? <Link to={PATHS.register}>Đăng ký ngay</Link>
          </Paragraph>
        </Space>
      </Card>
    </div>
  )
}
