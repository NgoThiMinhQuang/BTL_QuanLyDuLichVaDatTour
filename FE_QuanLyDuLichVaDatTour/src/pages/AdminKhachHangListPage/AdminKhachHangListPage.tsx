import { Alert, Avatar, Button, Drawer, Empty, Input, Popconfirm, Select, Space, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import { useAdminKhachHang, useAdminKhachHangDetail, useUpdateAdminKhachHangStatus } from '../../services/admin/admin.hooks'
import type { AdminKhachHangItem, AdminKhachHangStatus, AdminKhachHangVaiTro } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import { formatDateTime } from '../../utils/admin'
import './AdminKhachHangListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = [
  { value: 'hoat_dong', label: 'Hoạt động', color: 'green' },
  { value: 'bi_khoa', label: 'Bị khóa', color: 'red' },
]

const roleOptions = [
  { value: 'khach_hang', label: 'Khách hàng' },
  { value: 'admin', label: 'Quản trị viên' },
]

export default function AdminKhachHangListPage() {
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const khachHangQuery = useAdminKhachHang({
    keyword: keyword || undefined,
    vaiTro: roleFilter,
    trangThai: statusFilter,
    page,
    pageSize,
  })
  const detailQuery = useAdminKhachHangDetail(selectedId ?? undefined)
  const updateStatusMutation = useUpdateAdminKhachHangStatus()

  const handleToggleStatus = async (record: AdminKhachHangItem) => {
    const newStatus: AdminKhachHangStatus = record.trangThai === 'hoat_dong' ? 'bi_khoa' : 'hoat_dong'
    await updateStatusMutation.mutateAsync({ id: record.id, trangThai: newStatus })
  }

  const columns: ColumnsType<AdminKhachHangItem> = [
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 280,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Space>
            <Avatar src={record.anhDaiDien} icon={<UserOutlined />} />
            <div>
              <Text strong>{record.hoTen}</Text>
              <br />
              <Text className="admin-muted" style={{ fontSize: 12 }}>{record.email}</Text>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      width: 140,
      render: (value) => value || <Text className="admin-muted">—</Text>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'vaiTro',
      key: 'vaiTro',
      width: 140,
      render: (value: AdminKhachHangVaiTro) => (
        <Tag color={value === 'admin' ? 'gold' : 'blue'}>{value === 'admin' ? 'Quản trị' : 'Khách hàng'}</Tag>
      ),
    },
    {
      title: 'Tổng đơn',
      dataIndex: 'tongSoDon',
      key: 'tongSoDon',
      width: 120,
      align: 'right',
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'tongChiTieu',
      key: 'tongChiTieu',
      width: 150,
      align: 'right',
      render: (value) => <Text className="admin-price">{formatMoney(value)}</Text>,
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      width: 120,
      align: 'center',
      render: (_, record) => (
        record.danhGiaTrungBinh
          ? <Text>{record.danhGiaTrungBinh.toFixed(1)} / 5 ({record.soDanhGia})</Text>
          : <Text className="admin-muted">Chưa có</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (value: AdminKhachHangStatus) => {
        const meta = statusOptions.find(o => o.value === value)
        return <Tag color={meta?.color}>{meta?.label}</Tag>
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (value) => <Text className="admin-muted">{formatDateTime(value)}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div className="admin-inline-actions">
          <Button onClick={() => setSelectedId(record.id)}>Chi tiết</Button>
          {record.vaiTro === 'khach_hang' && (
            <Button
              type="primary"
              danger={record.trangThai === 'hoat_dong'}
              onClick={() => void handleToggleStatus(record)}
            >
              {record.trangThai === 'hoat_dong' ? 'Khóa' : 'Mở khóa'}
            </Button>
          )}
        </div>
      ),
    },
  ]

  const paginationConfig = {
    current: page,
    pageSize,
    total: khachHangQuery.data?.totalCount ?? 0,
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) => `${range[0]}–${range[1]} trong ${total} khách hàng`,
    onChange: (newPage: number, newPageSize: number) => {
      setPage(newPage)
      setPageSize(newPageSize)
    },
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý khách hàng</Title>
          <Paragraph>Xem danh sách, lịch sử đặt tour, tổng chi tiêu và quản lý trạng thái tài khoản khách hàng.</Paragraph>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
            placeholder="Tìm theo tên, email, SĐT..."
            className="admin-filter-field"
            allowClear
          />
          <Select
            allowClear
            value={roleFilter}
            onChange={(v) => { setRoleFilter(v); setPage(1) }}
            options={roleOptions}
            placeholder="Vai trò"
            className="admin-filter-field"
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
            onClick={() => { setKeyword(''); setRoleFilter(undefined); setStatusFilter(undefined); setPage(1) }}
          >
            Xóa bộ lọc
          </Button>
        </div>

        {khachHangQuery.isError && <Alert type="error" showIcon title={khachHangQuery.error instanceof Error ? khachHangQuery.error.message : 'Lỗi tải dữ liệu'} />}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={khachHangQuery.data?.items ?? []}
          loading={khachHangQuery.isLoading}
          pagination={paginationConfig}
          locale={{ emptyText: <Empty description="Chưa có khách hàng" /> }}
          scroll={{ x: 1400 }}
          className="admin-table"
        />
      </div>

      <Drawer
        title="Chi tiết khách hàng"
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        width={520}
      >
        {detailQuery.isLoading ? null : detailQuery.data ? (
          <div className="admin-customer-detail">
            <div className="admin-customer-detail-header">
              <Avatar src={detailQuery.data.anhDaiDien} icon={<UserOutlined />} size={80} />
              <div>
                <Title level={4}>{detailQuery.data.hoTen}</Title>
                <Tag color={detailQuery.data.vaiTro === 'admin' ? 'gold' : 'blue'}>
                  {detailQuery.data.vaiTro === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                </Tag>
                <Tag color={detailQuery.data.trangThai === 'hoat_dong' ? 'green' : 'red'}>
                  {detailQuery.data.trangThai === 'hoat_dong' ? 'Hoạt động' : 'Bị khóa'}
                </Tag>
              </div>
            </div>

            <div className="admin-stats-row">
              <Statistic title="Tổng đơn đặt" value={detailQuery.data.tongSoDon} />
              <Statistic title="Tổng chi tiêu" value={detailQuery.data.tongChiTieu} precision={0} prefix="đ" />
              <Statistic
                title="Đánh giá TB"
                value={detailQuery.data.danhGiaTrungBinh ?? 0}
                precision={1}
                suffix={`/ 5 (${detailQuery.data.soDanhGia} đánh giá)`}
              />
            </div>

            <div className="admin-info-list">
              <div className="admin-info-item">
                <Text className="admin-muted">Email</Text>
                <Text>{detailQuery.data.email}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Số điện thoại</Text>
                <Text>{detailQuery.data.soDienThoai || '—'}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Địa chỉ</Text>
                <Text>{detailQuery.data.diaChi || '—'}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Ngày tạo tài khoản</Text>
                <Text>{formatDateTime(detailQuery.data.createdAt)}</Text>
              </div>
              <div className="admin-info-item">
                <Text className="admin-muted">Cập nhật lần cuối</Text>
                <Text>{formatDateTime(detailQuery.data.updatedAt)}</Text>
              </div>
            </div>

            {detailQuery.data.vaiTro === 'khach_hang' && (
              <div className="admin-drawer-actions">
                <Popconfirm
                  title={detailQuery.data.trangThai === 'hoat_dong' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
                  description={detailQuery.data.trangThai === 'hoat_dong'
                    ? 'Khách hàng sẽ không thể đăng nhập cho đến khi được mở khóa.'
                    : 'Khách hàng sẽ có thể đăng nhập và sử dụng dịch vụ bình thường.'}
                  onConfirm={() => {
                    const newStatus: AdminKhachHangStatus = detailQuery.data!.trangThai === 'hoat_dong' ? 'bi_khoa' : 'hoat_dong'
                    updateStatusMutation.mutate(
                      { id: detailQuery.data!.id, trangThai: newStatus },
                      {
                        onSuccess: () => {
                          khachHangQuery.refetch()
                          detailQuery.refetch()
                        },
                      }
                    )
                  }}
                  okText={detailQuery.data.trangThai === 'hoat_dong' ? 'Khóa' : 'Mở khóa'}
                  cancelText="Hủy"
                  okButtonProps={{ danger: detailQuery.data.trangThai === 'hoat_dong' }}
                >
                  <Button
                    type="primary"
                    danger={detailQuery.data.trangThai === 'hoat_dong'}
                    loading={updateStatusMutation.isPending}
                  >
                    {detailQuery.data.trangThai === 'hoat_dong' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}