import { Alert, Button, Card, Form, Input, Space, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PATHS } from '../paths'
import { register } from '../services/auth/register'

const { Paragraph, Title, Text } = Typography

interface RegisterFormValues {
  hoTen: string
  email: string
  matKhau: string
  xacNhanMatKhau: string
  soDienThoai?: string
  diaChi?: string
}

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
    <div className="auth-page">
      <Card className="auth-card">
        <Space orientation="vertical" size={18} style={{ width: '100%' }}>
          <Space orientation="vertical" size={6}>
            <Text className="auth-kicker">Tạo tài khoản mới</Text>
            <Title level={2} className="auth-title">
              Đăng ký thành viên
            </Title>
            <Paragraph className="auth-description">
              Tạo tài khoản để đặt tour, theo dõi lịch khởi hành và quản lý thông tin cá nhân.
            </Paragraph>
          </Space>

          {errorMessage ? <Alert type="error" showIcon title={errorMessage} /> : null}
          {successMessage ? <Alert type="success" showIcon title={successMessage} /> : null}

          <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label="Họ và tên"
              name="hoTen"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input size="large" placeholder="Nguyễn Văn A" />
            </Form.Item>

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

            <Form.Item
              label="Xác nhận mật khẩu"
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
              <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="soDienThoai">
              <Input size="large" placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="diaChi">
              <Input size="large" placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Đăng ký
            </Button>
          </Form>

          <Paragraph className="auth-switch">
            Đã có tài khoản? <Link to={PATHS.login}>Đăng nhập</Link>
          </Paragraph>
        </Space>
      </Card>
    </div>
  )
}
