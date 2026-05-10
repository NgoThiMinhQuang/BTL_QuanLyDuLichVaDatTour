import { Alert, Button, Empty, Input, Select, Space, Tag, Typography, Pagination, Avatar, Spin } from 'antd'
import { useState, useEffect } from 'react'
import {
  useAdminLienHe,
  useAdminLienHeDetail,
  useUpdateAdminLienHeStatus,
} from '../../services/admin/admin.hooks'
import type { AdminLienHeItem, AdminLienHeStatus } from '../../types/admin'
import { formatDateTime } from '../../utils/admin'
import {
  MailOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  UserOutlined,
  SendOutlined,
  MessageOutlined
} from '@ant-design/icons'
import './AdminLienHeListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = [
  { value: 'moi', label: 'Mới', color: 'blue' },
  { value: 'dang_xu_ly', label: 'Đang xử lý', color: 'orange' },
  { value: 'da_xu_ly', label: 'Đã hoàn tất', color: 'green' },
  { value: 'bo_qua', label: 'Bỏ qua', color: 'default' },
]

export default function AdminLienHeListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [phanHoiInput, setPhanHoiInput] = useState('')
  const [replyStatus, setReplyStatus] = useState<AdminLienHeStatus>('dang_xu_ly')

  const lienHeQuery = useAdminLienHe({
    keyword: keyword || undefined,
    trangThai: statusFilter,
    page,
    pageSize,
  })
  const detailQuery = useAdminLienHeDetail(selectedId ?? undefined)
  const updateStatusMutation = useUpdateAdminLienHeStatus()

  // Reset input when ticket changes
  useEffect(() => {
    if (detailQuery.data) {
      setPhanHoiInput('')
      setReplyStatus(detailQuery.data.trangThai === 'moi' ? 'dang_xu_ly' : detailQuery.data.trangThai)
    }
  }, [detailQuery.data])

  const handleStatusChange = async (record: AdminLienHeItem, newStatus: AdminLienHeStatus, phanHoi?: string) => {
    await updateStatusMutation.mutateAsync({
      id: record.id,
      payload: {
        trangThai: newStatus,
        phanHoi: phanHoi ?? record.phanHoi ?? null,
      },
    })
  }

  const handleQuickReply = async () => {
    if (!detailQuery.data) return
    await handleStatusChange(detailQuery.data, replyStatus, phanHoiInput)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ marginBottom: 0 }}>
        <div className="mailbox-title-wrapper">
          <div className="mailbox-header-icon">
            <MailOutlined />
          </div>
          <div>
            <Title level={1}>Hộp thư Hỗ trợ</Title>
            <Paragraph>Hệ thống Ticket xử lý thắc mắc và khiếu nại của khách hàng.</Paragraph>
          </div>
        </div>
      </div>

      <div className="mailbox-container">
        {/* LEFT PANE: TICKET LIST */}
        <div className="mailbox-list-pane">
          <div className="mailbox-list-header">
            <Input
              placeholder="Tìm tên, email, SĐT..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
              allowClear
              style={{ borderRadius: 8, height: 40 }}
            />
            <Select
              placeholder="Lọc trạng thái"
              options={statusOptions}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1) }}
              allowClear
              style={{ width: '100%', height: 40 }}
            />
          </div>

          <div className="mailbox-list-scroll">
            {lienHeQuery.isLoading ? (
              <div style={{ padding: 40, textAlign: 'center' }}><Spin /></div>
            ) : lienHeQuery.isError ? (
              <Alert type="error" message="Lỗi tải dữ liệu" style={{ margin: 16 }} />
            ) : lienHeQuery.data?.items.length === 0 ? (
              <Empty description="Không tìm thấy liên hệ nào" style={{ marginTop: 40 }} />
            ) : (
              lienHeQuery.data?.items.map(item => (
                <div 
                  key={item.id} 
                  className={`ticket-card ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className={`ticket-status-dot ${item.trangThai}`} />
                  <div className="ticket-card-header">
                    <span className="ticket-card-sender">{item.hoTen}</span>
                    <span className="ticket-card-date">{new Date(item.ngayGui).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="ticket-card-subject">{item.chuDe}</div>
                  <div className="ticket-card-preview">{item.noiDung}</div>
                </div>
              ))
            )}
          </div>

          <div className="mailbox-list-footer">
            <Pagination
              simple
              current={page}
              pageSize={pageSize}
              total={lienHeQuery.data?.totalCount ?? 0}
              onChange={(p) => setPage(p)}
            />
          </div>
        </div>

        {/* RIGHT PANE: DETAIL & CHAT */}
        <div className="mailbox-detail-pane">
          {!selectedId ? (
            <div className="mailbox-empty-state">
              <MessageOutlined className="mailbox-empty-icon" />
              <Title level={4} style={{ color: '#64748b', margin: 0 }}>Chọn một tin nhắn</Title>
              <Text type="secondary">Vui lòng chọn một tin nhắn từ danh sách bên trái để xem chi tiết và phản hồi.</Text>
            </div>
          ) : detailQuery.isLoading ? (
             <div className="mailbox-empty-state"><Spin size="large" /></div>
          ) : detailQuery.data ? (
            <>
              <div className="ticket-detail-header">
                <div>
                  <Title level={3} className="ticket-detail-subject">{detailQuery.data.chuDe}</Title>
                  <Space size={16}>
                    <Space size={6}>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text strong>{detailQuery.data.hoTen}</Text>
                    </Space>
                    <Text type="secondary">{detailQuery.data.email}</Text>
                    {detailQuery.data.soDienThoai && <Text type="secondary">• {detailQuery.data.soDienThoai}</Text>}
                  </Space>
                </div>
                <div className="ticket-detail-tags">
                  <Tag color={statusOptions.find(o => o.value === detailQuery.data.trangThai)?.color} style={{ margin: 0, padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
                    {statusOptions.find(o => o.value === detailQuery.data.trangThai)?.label}
                  </Tag>
                </div>
              </div>

              <div className="ticket-detail-body">
                {/* Customer Message */}
                <div className="message-bubble customer">
                  <div className="message-meta">
                    <span className="message-author">{detailQuery.data.hoTen}</span>
                    <span className="message-time">{formatDateTime(detailQuery.data.ngayGui)}</span>
                  </div>
                  <div className="message-content">
                    {detailQuery.data.noiDung}
                  </div>
                </div>

                {/* Admin Reply (if exists) */}
                {detailQuery.data.phanHoi && (
                  <div className="message-bubble admin">
                    <div className="message-meta">
                      <span className="message-author">{detailQuery.data.hoTenNguoiXuLy || 'Quản trị viên'}</span>
                      <span className="message-time">{formatDateTime(detailQuery.data.ngayXuLy!)}</span>
                    </div>
                    <div className="message-content">
                      {detailQuery.data.phanHoi}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Box */}
              {detailQuery.data.trangThai !== 'da_xu_ly' && detailQuery.data.trangThai !== 'bo_qua' && (
                <div className="ticket-detail-footer">
                  <div className="reply-box">
                    <textarea
                      className="reply-textarea"
                      rows={3}
                      placeholder="Nhập nội dung phản hồi cho khách hàng..."
                      value={phanHoiInput}
                      onChange={e => setPhanHoiInput(e.target.value)}
                    />
                    <div className="reply-actions">
                      <Space>
                        <Text type="secondary" style={{ fontSize: 13 }}>Đánh dấu là:</Text>
                        <Select
                          value={replyStatus}
                          onChange={setReplyStatus}
                          options={statusOptions.filter(o => o.value !== 'moi')}
                          style={{ width: 140 }}
                          bordered={false}
                        />
                      </Space>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        loading={updateStatusMutation.isPending}
                        onClick={handleQuickReply}
                        disabled={!phanHoiInput.trim() && replyStatus === 'dang_xu_ly'}
                        style={{ borderRadius: 8, padding: '0 24px', height: 36, background: '#10b981', borderColor: '#10b981' }}
                      >
                        Gửi phản hồi
                      </Button>
                    </div>
                  </div>
                  {detailQuery.data.trangThai === 'moi' && (
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>Hoặc </Text>
                      <Button 
                        type="link" 
                        icon={<CheckCircleOutlined />} 
                        onClick={() => handleStatusChange(detailQuery.data, 'dang_xu_ly')}
                        style={{ padding: 0 }}
                      >
                        Đánh dấu Đang xử lý
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}