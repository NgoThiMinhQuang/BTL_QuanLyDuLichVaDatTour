import { Alert, Button, Empty, Modal, Space, Spin, Typography, Input, Tag } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { layYeuCauHuyTourChoDuyet, capNhatTrangThaiHuyTour, type AdminYeuCauHuyTourResponse } from '../../services/huy-tour/huyTour'
import {
  WarningOutlined,
  UserOutlined,
  GlobalOutlined,
  MailOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import './AdminCancellationPage.css'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function AdminCancellationPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AdminYeuCauHuyTourResponse | null>(null)
  const [action, setAction] = useState<'da_duyet' | 'tu_choi'>('da_duyet')
  const [adminNote, setAdminNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading, isError, error: queryError } = useQuery({
    queryKey: ['admin-cancellation-pending'],
    queryFn: layYeuCauHuyTourChoDuyet,
  })

  const handleAction = (item: AdminYeuCauHuyTourResponse, act: 'da_duyet' | 'tu_choi') => {
    setSelectedItem(item)
    setAction(act)
    setAdminNote('')
    setError(null)
    setModalOpen(true)
  }

  const handleConfirm = async () => {
    if (!selectedItem) return
    setSubmitting(true)
    setError(null)
    try {
      await capNhatTrangThaiHuyTour(selectedItem.id, {
        trangThai: action,
        ghiChuAdmin: adminNote.trim() || undefined,
      })
      setModalOpen(false)
      setSelectedItem(null)
      queryClient.invalidateQueries({ queryKey: ['admin-cancellation-pending'] })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="cancel-title-wrapper">
          <div className="cancel-header-icon">
            <WarningOutlined />
          </div>
          <div>
            <Title level={1}>Kiểm duyệt Hủy Tour</Title>
            <Paragraph>Quản lý và xét duyệt các yêu cầu hủy tour từ khách hàng.</Paragraph>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
      ) : isError ? (
        <Alert type="error" message="Lỗi" description={(queryError as Error)?.message} showIcon />
      ) : !data || data.length === 0 ? (
        <div className="cancel-empty">
          <CheckCircleOutlined className="cancel-empty-icon" />
          <Title level={3} style={{ margin: 0 }}>Tất cả đã hoàn tất!</Title>
          <Text type="secondary">Không có yêu cầu hủy tour nào đang chờ duyệt.</Text>
        </div>
      ) : (
        <div className="cancel-grid">
          {data.map((item) => (
            <div key={item.id} className="cancel-card">
              <div className="cancel-card-header">
                <div className="cancel-card-code">
                  <Tag color="volcano" style={{ margin: 0, borderRadius: 12 }}>Chờ duyệt</Tag>
                  <span>{item.maBooking}</span>
                </div>
                <Text type="secondary" style={{ fontSize: 13 }}>{formatDate(item.createdAt)}</Text>
              </div>
              
              <div className="cancel-card-body">
                <div className="cancel-info-row">
                  <UserOutlined className="cancel-info-icon" />
                  <div className="cancel-info-content">
                    <span className="cancel-info-label">Khách hàng</span>
                    <span className="cancel-info-value">{item.hoTenKhachHang}</span>
                  </div>
                </div>

                <div className="cancel-info-row">
                  <MailOutlined className="cancel-info-icon" />
                  <div className="cancel-info-content">
                    <span className="cancel-info-label">Email liên hệ</span>
                    <span className="cancel-info-value">{item.emailKhachHang}</span>
                  </div>
                </div>

                <div className="cancel-info-row">
                  <GlobalOutlined className="cancel-info-icon" />
                  <div className="cancel-info-content">
                    <span className="cancel-info-label">Chuyến đi</span>
                    <span className="cancel-info-value">{item.tenTour}</span>
                  </div>
                </div>

                <div className="cancel-reason-box">
                  <div className="cancel-reason-title">
                    <ExclamationCircleOutlined /> LÝ DO HỦY
                  </div>
                  <div className="cancel-reason-text">
                    "{item.lyDo}"
                  </div>
                </div>
              </div>

              <div className="cancel-card-footer">
                <Button 
                  className="cancel-btn cancel-btn-reject" 
                  onClick={() => handleAction(item, 'tu_choi')}
                >
                  Từ chối
                </Button>
                <Button 
                  className="cancel-btn cancel-btn-approve" 
                  onClick={() => handleAction(item, 'da_duyet')}
                >
                  Duyệt hủy
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setSelectedItem(null) }}
        footer={null}
        width={480}
        wrapClassName="cancel-modal"
        centered
        closable={false}
      >
        {selectedItem && (
          <div>
            <div className="cancel-modal-header">
              {action === 'da_duyet' ? (
                <WarningOutlined className="cancel-modal-icon approve" />
              ) : (
                <CloseCircleOutlined className="cancel-modal-icon reject" />
              )}
              <div className="cancel-modal-title">
                {action === 'da_duyet' ? 'Xác nhận duyệt hủy tour?' : 'Từ chối yêu cầu hủy tour?'}
              </div>
              <div className="cancel-modal-desc">
                Thao tác này sẽ gửi email thông báo tới khách hàng {selectedItem.hoTenKhachHang}.
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text type="secondary">Mã Booking:</Text>
                <Text strong>{selectedItem.maBooking}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">Khách hàng:</Text>
                <Text strong>{selectedItem.hoTenKhachHang}</Text>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Ghi chú của Admin (Khách hàng sẽ thấy):</Text>
              <TextArea
                className="cancel-modal-textarea"
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder={action === 'da_duyet' ? "VD: Tiền sẽ được hoàn lại trong vòng 3 ngày làm việc..." : "VD: Không đủ điều kiện hủy do quá hạn..."}
                maxLength={500}
              />
            </div>

            {error && <Alert type="error" message={error} style={{ marginBottom: 24 }} />}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Button size="large" onClick={() => { setModalOpen(false); setSelectedItem(null) }} style={{ borderRadius: 8 }}>
                Hủy bỏ
              </Button>
              <Button 
                size="large" 
                type="primary"
                danger={action === 'da_duyet'} 
                loading={submitting} 
                onClick={handleConfirm}
                style={{ borderRadius: 8 }}
              >
                {action === 'da_duyet' ? 'Đồng ý Duyệt' : 'Đồng ý Từ chối'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}