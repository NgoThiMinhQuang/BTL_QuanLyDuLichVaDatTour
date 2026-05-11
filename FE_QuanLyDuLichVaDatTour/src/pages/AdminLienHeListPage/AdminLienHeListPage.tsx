import { Alert, Button, Empty, Input, Select, Space, Tag, Typography, Pagination, Avatar, Spin } from 'antd'
import { useState, useEffect } from 'react'
import {
  useAdminLienHeDetail,
  useAdminSupportChat,
  useAdminSupportTickets,
  useReplyAdminSupportChat,
  useUpdateAdminLienHeStatus,
} from '../../services/admin/admin.hooks'
import type { AdminLienHeItem, AdminLienHeStatus, AdminSupportTicketItem } from '../../types/admin'
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

const statusOptions: Array<{ value: AdminLienHeStatus; label: string; color: string }> = [
  { value: 'moi', label: 'Mới', color: 'blue' },
  { value: 'dang_xu_ly', label: 'Đang xử lý', color: 'orange' },
  { value: 'da_xu_ly', label: 'Đã hoàn tất', color: 'green' },
  { value: 'bo_qua', label: 'Bỏ qua', color: 'default' },
]

const getStatusOption = (status: AdminLienHeStatus) => statusOptions.find(option => option.value === status)
const isAdminRole = (vaiTro: string) => vaiTro.toLowerCase() === 'admin'

function MessageBubble({ type, author, time, content }: { type: 'admin' | 'customer'; author: string; time: string; content: string }) {
  return (
    <div className={`message-bubble ${type}`}>
      <div className="message-meta">
        <span className="message-author">{author}</span>
        <span className="message-time">{formatDateTime(time)}</span>
      </div>
      <div className="message-content">{content}</div>
    </div>
  )
}

export default function AdminLienHeListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicketItem | null>(null)
  const [phanHoiInput, setPhanHoiInput] = useState('')
  const [replyStatus, setReplyStatus] = useState<AdminLienHeStatus>('dang_xu_ly')

  const supportTicketsQuery = useAdminSupportTickets({
    keyword: keyword || undefined,
    trangThai: statusFilter,
    page,
    pageSize,
  })
  const visibleTickets = supportTicketsQuery.data?.slice((page - 1) * pageSize, page * pageSize) ?? []
  const selectedLienHeId = selectedTicket?.source === 'lienhe' ? selectedTicket.id : undefined
  const selectedKhachHangId = selectedTicket?.source === 'tinnhan' ? selectedTicket.khachHangId : undefined
  const detailQuery = useAdminLienHeDetail(selectedLienHeId)
  const chatQuery = useAdminSupportChat(selectedKhachHangId)
  const updateStatusMutation = useUpdateAdminLienHeStatus()
  const replyChatMutation = useReplyAdminSupportChat()
  const currentTicket = selectedTicket?.source === 'lienhe' ? detailQuery.data : selectedTicket

  const isChatTicket = selectedTicket?.source === 'tinnhan'
  const currentStatusOption = currentTicket ? getStatusOption(currentTicket.trangThai) : undefined
  const isDetailLoading = isChatTicket ? chatQuery.isLoading : detailQuery.isLoading
  const isSending = isChatTicket ? replyChatMutation.isPending : updateStatusMutation.isPending
  const isSendDisabled = isChatTicket ? !phanHoiInput.trim() : !phanHoiInput.trim() && replyStatus === 'dang_xu_ly'

  useEffect(() => {
    if (currentTicket) {
      setPhanHoiInput('')
      setReplyStatus(currentTicket.trangThai === 'moi' ? 'dang_xu_ly' : currentTicket.trangThai)
    }
  }, [currentTicket])

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
    if (!selectedTicket) return

    if (selectedTicket.source === 'tinnhan') {
      if (!phanHoiInput.trim()) return
      await replyChatMutation.mutateAsync({ khachHangId: selectedTicket.khachHangId, noiDung: phanHoiInput.trim() })
      setPhanHoiInput('')
      return
    }

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
            {supportTicketsQuery.isLoading ? (
              <div style={{ padding: 40, textAlign: 'center' }}><Spin /></div>
            ) : supportTicketsQuery.isError ? (
              <Alert type="error" message="Lỗi tải dữ liệu" style={{ margin: 16 }} />
            ) : visibleTickets.length === 0 ? (
              <Empty description="Không tìm thấy liên hệ nào" style={{ marginTop: 40 }} />
            ) : (
              visibleTickets.map(item => (
                <div
                  key={`${item.source}-${item.id}`}
                  className={`ticket-card ${selectedTicket?.source === item.source && selectedTicket.id === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedTicket(item)}
                >
                  <div className={`ticket-status-dot ${item.trangThai}`} />
                  <div className="ticket-card-header">
                    <span className="ticket-card-sender">{item.hoTen}</span>
                    <span className="ticket-card-date">{new Date(item.ngayGui).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="ticket-card-subject">
                    <Tag color={item.source === 'tinnhan' ? 'cyan' : 'purple'} style={{ marginRight: 6 }}>
                      {item.source === 'tinnhan' ? 'Chat' : 'Liên hệ'}
                    </Tag>
                    {item.chuDe}
                  </div>
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
              total={supportTicketsQuery.data?.length ?? 0}
              onChange={(p) => setPage(p)}
            />
          </div>
        </div>

        {/* RIGHT PANE: DETAIL & CHAT */}
        <div className="mailbox-detail-pane">
          {!selectedTicket ? (
            <div className="mailbox-empty-state">
              <MessageOutlined className="mailbox-empty-icon" />
              <Title level={4} style={{ color: '#64748b', margin: 0 }}>Chọn một tin nhắn</Title>
              <Text type="secondary">Vui lòng chọn một tin nhắn từ danh sách bên trái để xem chi tiết và phản hồi.</Text>
            </div>
          ) : isDetailLoading ? (
             <div className="mailbox-empty-state"><Spin size="large" /></div>
          ) : currentTicket ? (
            <>
              <div className="ticket-detail-header">
                <div>
                  <Title level={3} className="ticket-detail-subject">{currentTicket.chuDe}</Title>
                  <Space size={16}>
                    <Space size={6}>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text strong>{currentTicket.hoTen}</Text>
                    </Space>
                    <Text type="secondary">{currentTicket.email}</Text>
                    {currentTicket.soDienThoai && <Text type="secondary">• {currentTicket.soDienThoai}</Text>}
                  </Space>
                </div>
                <div className="ticket-detail-tags">
                  <Tag color={currentStatusOption?.color} style={{ margin: 0, padding: '4px 12px', fontSize: 13, borderRadius: 16 }}>
                    {currentStatusOption?.label}
                  </Tag>
                </div>
              </div>

              <div className="ticket-detail-body">
                {isChatTicket ? (
                  chatQuery.data?.map(message => (
                    <MessageBubble
                      key={message.id}
                      type={isAdminRole(message.vaiTro) ? 'admin' : 'customer'}
                      author={message.hoTenNguoiGui}
                      time={message.thoiGianGui}
                      content={message.noiDung}
                    />
                  ))
                ) : (
                  <>
                    <MessageBubble type="customer" author={currentTicket.hoTen} time={currentTicket.ngayGui} content={currentTicket.noiDung} />
                    {currentTicket.phanHoi && currentTicket.ngayXuLy && (
                      <MessageBubble
                        type="admin"
                        author={detailQuery.data?.hoTenNguoiXuLy || 'Quản trị viên'}
                        time={currentTicket.ngayXuLy}
                        content={currentTicket.phanHoi}
                      />
                    )}
                  </>
                )}
              </div>

              {/* Reply Box */}
              {(selectedTicket.source === 'tinnhan' || (currentTicket.trangThai !== 'da_xu_ly' && currentTicket.trangThai !== 'bo_qua')) && (
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
                      {selectedTicket.source === 'lienhe' && (
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
                      )}
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        loading={isSending}
                        onClick={handleQuickReply}
                        disabled={isSendDisabled}
                        style={{ borderRadius: 8, padding: '0 24px', height: 36, background: '#10b981', borderColor: '#10b981' }}
                      >
                        Gửi phản hồi
                      </Button>
                    </div>
                  </div>
                  {selectedTicket.source === 'lienhe' && detailQuery.data && currentTicket.trangThai === 'moi' && (
                    <div style={{ marginTop: 12, textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>Hoặc </Text>
                      <Button 
                        type="link" 
                        icon={<CheckCircleOutlined />} 
                        onClick={() => handleStatusChange(detailQuery.data!, 'dang_xu_ly')}
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