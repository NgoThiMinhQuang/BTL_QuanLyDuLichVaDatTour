import { Alert, Button, Drawer, Empty, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import {
  useAdminLienHe,
  useAdminLienHeDetail,
  useUpdateAdminLienHeStatus,
} from '../../services/admin/admin.hooks'
import type { AdminLienHeItem, AdminLienHeStatus } from '../../types/admin'
import { formatDateTime } from '../../utils/admin'
import './AdminLienHeListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = [
  { value: 'moi', label: 'Mới', color: 'blue' },
  { value: 'dang_xu_ly', label: 'Đang xử lý', color: 'orange' },
  { value: 'da_xu_ly', label: 'Đã xử lý', color: 'green' },
  { value: 'bo_qua', label: 'Bỏ qua', color: 'default' },
]

export default function AdminLienHeListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
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

  const handleStatusChange = async (record: AdminLienHeItem, newStatus: AdminLienHeStatus, phanHoi?: string) => {
    await updateStatusMutation.mutateAsync({
      id: record.id,
      payload: {
        trangThai: newStatus,
        phanHoi: phanHoi ?? record.phanHoi ?? null,
      },
    })
  }

  const handleQuickReply = async (record: AdminLienHeItem, status: AdminLienHeStatus, phanHoi: string) => {
    await handleStatusChange(record, status, phanHoi)
    setSelectedId(null)
    setPhanHoiInput('')
  }

  const columns: ColumnsType<AdminLienHeItem> = [
    {
      title: 'Người gửi',
      key: 'sender',
      width: 260,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.hoTen}</Text>
          <Text className="admin-muted">{record.email}</Text>
          <Text className="admin-muted">{record.soDienThoai || '—'}</Text>
        </div>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'chuDe',
      key: 'chuDe',
      width: 200,
      render: (value) => <Text>{value}</Text>,
    },
    {
      title: 'Nội dung',
      key: 'noiDung',
      width: 280,
      render: (_, record) => (
        <Text ellipsis={{ tooltip: record.noiDung }} style={{ maxWidth: 260 }}>
          {record.noiDung}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (value: AdminLienHeStatus) => {
        const meta = statusOptions.find((o) => o.value === value)
        return <Tag color={meta?.color}>{meta?.label}</Tag>
      },
    },
    {
      title: 'Người xử lý',
      key: 'processor',
      width: 150,
      render: (_, record) =>
        record.hoTenNguoiXuLy ? (
          <Text>{record.hoTenNguoiXuLy}</Text>
        ) : (
          <Text className="admin-muted">—</Text>
        ),
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'ngayGui',
      key: 'ngayGui',
      width: 160,
      render: (value) => <Text className="admin-muted">{formatDateTime(value)}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <div className="admin-inline-actions">
          <Button size="small" onClick={() => setSelectedId(record.id)}>
            Xem
          </Button>
          {record.trangThai === 'moi' && (
            <Button
              size="small"
              onClick={() => void handleStatusChange(record, 'dang_xu_ly')}
            >
              Tiếp nhận
            </Button>
          )}
        </div>
      ),
    },
  ]

  const paginationConfig = {
    current: page,
    pageSize,
    total: lienHeQuery.data?.totalCount ?? 0,
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) => `${range[0]}–${range[1]} trong ${total} liên hệ`,
    onChange: (newPage: number, newPageSize: number) => {
      setPage(newPage)
      setPageSize(newPageSize)
    },
  }

  const handleDrawerClose = () => {
    setSelectedId(null)
    setPhanHoiInput('')
    setReplyStatus('dang_xu_ly')
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Liên hệ & Hỗ trợ</Title>
          <Paragraph>Quản lý tin nhắn hỗ trợ từ khách hàng, phản hồi và theo dõi trạng thái xử lý.</Paragraph>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
            placeholder="Tìm theo tên, email, SĐT, chủ đề..."
            className="admin-filter-field"
            allowClear
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1) }}
            options={statusOptions}
            placeholder="Trạng thái"
            className="admin-filter-field"
          />
          <Button
            className="admin-filter-button"
            onClick={() => { setKeyword(''); setStatusFilter(undefined); setPage(1) }}
          >
            Xóa bộ lọc
          </Button>
        </div>

        {lienHeQuery.isError && (
          <Alert type="error" showIcon title={lienHeQuery.error instanceof Error ? lienHeQuery.error.message : 'Lỗi tải dữ liệu'} />
        )}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={lienHeQuery.data?.items ?? []}
          loading={lienHeQuery.isLoading}
          pagination={paginationConfig}
          locale={{ emptyText: <Empty description="Chưa có liên hệ nào" /> }}
          scroll={{ x: 1400 }}
          className="admin-table"
        />
      </div>

      <Drawer
        title="Chi tiết liên hệ"
        open={selectedId !== null}
        onClose={handleDrawerClose}
        width={560}
        footer={
          detailQuery.data && detailQuery.data.trangThai !== 'da_xu_ly' && detailQuery.data.trangThai !== 'bo_qua' ? (
            <div className="admin-lien-he-drawer-footer">
              <Select
                value={replyStatus}
                onChange={(v) => setReplyStatus(v)}
                options={statusOptions.filter((o) => o.value !== 'moi')}
                style={{ width: 160 }}
              />
              <Input.TextArea
                value={phanHoiInput}
                onChange={(e) => setPhanHoiInput(e.target.value)}
                placeholder="Nhập nội dung phản hồi..."
                rows={3}
                style={{ flex: 1 }}
              />
              <Space>
                <Button onClick={handleDrawerClose}>Đóng</Button>
                <Button
                  type="primary"
                  loading={updateStatusMutation.isPending}
                  onClick={() => {
                    if (!detailQuery.data) return
                    handleQuickReply(detailQuery.data, replyStatus, phanHoiInput)
                  }}
                  disabled={!phanHoiInput.trim() && replyStatus === 'dang_xu_ly'}
                >
                  Gửi phản hồi
                </Button>
              </Space>
            </div>
          ) : undefined
        }
      >
        {detailQuery.isLoading ? null : detailQuery.data ? (
          <div className="admin-lien-he-detail">
            <div className="admin-info-list">
              <div className="admin-info-item">
                <Text className="admin-muted">Họ tên</Text>
                <Text>{detailQuery.data.hoTen}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Email</Text>
                <Text>{detailQuery.data.email}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Số điện thoại</Text>
                <Text>{detailQuery.data.soDienThoai || '—'}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Chủ đề</Text>
                <Text>{detailQuery.data.chuDe}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Trạng thái</Text>
                <Tag color={statusOptions.find((o) => o.value === detailQuery.data!.trangThai)?.color}>
                  {statusOptions.find((o) => o.value === detailQuery.data!.trangThai)?.label}
                </Tag>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Ngày gửi</Text>
                <Text>{formatDateTime(detailQuery.data.ngayGui)}</Text>
              </div>
              {detailQuery.data.ngayXuLy && (
                <div className="admin-info-item">
                  <Text className="admin-muted">Ngày xử lý</Text>
                  <Text>{formatDateTime(detailQuery.data.ngayXuLy)}</Text>
                </div>
              )}
              {detailQuery.data.hoTenNguoiXuLy && (
                <div className="admin-info-item">
                  <Text className="admin-muted">Người xử lý</Text>
                  <Text>{detailQuery.data.hoTenNguoiXuLy}</Text>
                </div>
              )}
            </div>

            <div className="admin-lien-he-content">
              <Text className="admin-muted">Nội dung liên hệ</Text>
              <div className="admin-lien-he-noi-dung">{detailQuery.data.noiDung}</div>
            </div>

            {detailQuery.data.phanHoi && (
              <div className="admin-lien-he-content">
                <Text className="admin-muted">Phản hồi của quản trị</Text>
                <div className="admin-lien-he-phan-hoi">{detailQuery.data.phanHoi}</div>
              </div>
            )}
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}