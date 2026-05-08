import { Alert, Button, Card, Empty, Modal, Space, Spin, Table, Tag, Typography, Input } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { layYeuCauHuyTourChoDuyet, capNhatTrangThaiHuyTour, type AdminYeuCauHuyTourResponse } from '../../services/huy-tour/huyTour'
import './AdminCancellationPage.css'

const { Title, Text } = Typography
const { TextArea } = Input

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export default function AdminCancellationPage() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AdminYeuCauHuyTourResponse | null>(null)
  const [action, setAction] = useState<'da_duyet' | 'tu_choi'>('da_duyet')
  const [adminNote, setAdminNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data, isLoading, isError, error: queryError, refetch } = useQuery({
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

  const columns = [
    { title: 'Mã Booking', dataIndex: 'maBooking', key: 'maBooking' },
    { title: 'Khách hàng', dataIndex: 'hoTenKhachHang', key: 'hoTenKhachHang' },
    { title: 'Email', dataIndex: 'emailKhachHang', key: 'emailKhachHang' },
    { title: 'Tour', dataIndex: 'tenTour', key: 'tenTour' },
    { title: 'Lý do hủy', dataIndex: 'lyDo', key: 'lyDo', ellipsis: true },
    { title: 'Ngày gửi', dataIndex: 'createdAt', key: 'createdAt', render: (val: string) => formatDate(val) },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: unknown, record: AdminYeuCauHuyTourResponse) => (
        <Space>
          <Button type="primary" size="small" onClick={() => handleAction(record, 'da_duyet')}>
            Duyệt
          </Button>
          <Button danger size="small" onClick={() => handleAction(record, 'tu_choi')}>
            Từ chối
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-cancellation-page">
      <Title level={3}>Yêu cầu hủy tour</Title>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
      ) : isError ? (
        <Alert type="error" message="Lỗi" description={(queryError as Error)?.message} />
      ) : !data || data.length === 0 ? (
        <Empty description="Không có yêu cầu hủy nào đang chờ duyệt." />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      )}

      <Modal
        title={action === 'da_duyet' ? 'Xác nhận duyệt hủy tour' : 'Xác nhận từ chối hủy tour'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setSelectedItem(null) }}
        onOk={handleConfirm}
        confirmLoading={submitting}
        okText={action === 'da_duyet' ? 'Duyệt' : 'Từ chối'}
        okButtonProps={{ danger: action === 'tu_choi' }}
      >
        {selectedItem && (
          <div>
            <Text strong>Mã Booking: {selectedItem.maBooking}</Text>
            <br />
            <Text>Khách hàng: {selectedItem.hoTenKhachHang}</Text>
            <br />
            <Text>Tour: {selectedItem.tenTour}</Text>
            <br />
            <Text>Lý do: {selectedItem.lyDo}</Text>
            <br /><br />
            <Text>Ghi chú:</Text>
            <TextArea
              rows={3}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Nhập ghi chú cho khách hàng (không bắt buộc)..."
              maxLength={500}
            />
            {error && <Alert type="error" message={error} style={{ marginTop: 12 }} />}
          </div>
        )}
      </Modal>
    </div>
  )
}