import { useState, useEffect } from 'react'
import './ProfilePage.css'
import { Button, Card, Col, Form, Input, Row, Typography, message, Skeleton, Avatar, Tag } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined, CameraOutlined, ShoppingOutlined, StarOutlined, SafetyOutlined } from '@ant-design/icons'
import { Link, NavLink } from 'react-router'
import { PATHS } from '../constants/paths'
import { useAuthStore } from '../store/authStore'
import { getCurrentUser } from '../services/auth/me'
import { updateProfile, changePassword, UpdateProfilePayload } from '../services/auth/updateProfile'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const { Title, Text, Paragraph } = Typography

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { accessToken, currentUser } = useAuthStore()
  const [form] = Form.useForm()
  const [passwordForm] = Form.useForm()

  // Fetch full user details
  const { data: userDetails, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => getCurrentUser(accessToken!),
    enabled: !!accessToken,
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (data) => {
      message.success('Cập nhật hồ sơ thành công!')
      queryClient.setQueryData(['user-profile'], data)
      // Optionally update authStore if hoTen changed
      if (currentUser && data.hoTen !== currentUser.hoTen) {
        // Since authStore doesn't have an update method, we might just rely on the next hydration or manual set
      }
    },
    onError: (error: any) => {
      message.error(error.message || 'Cập nhật thất bại')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: ({ oldPass, newPass }: { oldPass: string, newPass: string }) => changePassword(oldPass, newPass),
    onSuccess: () => {
      message.success('Đổi mật khẩu thành công!')
      passwordForm.resetFields()
    },
    onError: (error: any) => {
      message.error(error.message || 'Đổi mật khẩu thất bại')
    }
  })

  useEffect(() => {
    if (userDetails) {
      form.setFieldsValue({
        hoTen: userDetails.hoTen,
        email: userDetails.email,
        soDienThoai: userDetails.soDienThoai,
        diaChi: userDetails.diaChi,
      })
    }
  }, [userDetails, form])

  const onUpdateProfile = (values: any) => {
    updateProfileMutation.mutate({
      hoTen: values.hoTen,
      soDienThoai: values.soDienThoai,
      diaChi: values.diaChi,
    })
  }

  const onChangePassword = (values: any) => {
    changePasswordMutation.mutate({
      oldPass: values.oldPassword,
      newPass: values.newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar-card">
              <div className="profile-avatar-wrap">
                {userDetails?.anhDaiDien ? (
                  <img src={userDetails.anhDaiDien} alt="Avatar" className="profile-avatar-img" />
                ) : (
                  <Avatar size={100} icon={<UserOutlined />} className="profile-avatar-placeholder" />
                )}
                <div className="avatar-upload-overlay">
                  <CameraOutlined />
                </div>
              </div>
              <Title level={4} className="profile-user-name">{userDetails?.hoTen}</Title>
              <Text className="profile-user-email">{userDetails?.email}</Text>
              <Tag color="blue">{userDetails?.vaiTro === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</Tag>
            </div>

            <nav className="profile-nav-card">
              <div className="profile-nav-list">
                <NavLink to={PATHS.myBookings} className="profile-nav-item">
                  <ShoppingOutlined className="profile-nav-icon" />
                  Tour đã đặt
                </NavLink>
                <NavLink to={PATHS.myReviews} className="profile-nav-item">
                  <StarOutlined className="profile-nav-icon" />
                  Đánh giá của tôi
                </NavLink>
                <NavLink to="/profile" className="profile-nav-item active">
                  <UserOutlined className="profile-nav-icon" />
                  Hồ sơ cá nhân
                </NavLink>
                <NavLink to="/security" className="profile-nav-item">
                  <SafetyOutlined className="profile-nav-icon" />
                  Bảo mật
                </NavLink>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-content">
            <Card className="profile-form-card" variant="borderless">
              <Title level={2} className="profile-form-title">Thông tin cá nhân</Title>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={onUpdateProfile}
                className="profile-form"
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Họ và tên"
                      name="hoTen"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" className="profile-input" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                    >
                      <Input prefix={<MailOutlined />} disabled className="profile-input" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="soDienThoai"
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="090x xxx xxx" className="profile-input" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Địa chỉ"
                      name="diaChi"
                    >
                      <Input prefix={<HomeOutlined />} placeholder="Hà Nội, Việt Nam" className="profile-input" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="profile-submit-btn"
                    loading={updateProfileMutation.isPending}
                  >
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Form>

              <div className="password-section">
                <Title level={3} className="profile-form-title">Đổi mật khẩu</Title>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={onChangePassword}
                  className="profile-form"
                >
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Mật khẩu cũ"
                        name="oldPassword"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
                      >
                        <Input.Password prefix={<LockOutlined />} className="profile-input" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        rules={[
                          { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} className="profile-input" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                          { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve()
                              }
                              return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                            },
                          }),
                        ]}
                      >
                        <Input.Password prefix={<LockOutlined />} className="profile-input" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button 
                      type="default" 
                      htmlType="submit" 
                      className="profile-submit-btn"
                      loading={changePasswordMutation.isPending}
                      style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                    >
                      Cập nhật mật khẩu
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}

