import { Alert, Button, Empty, Form, Input, InputNumber, Drawer, Popconfirm, Select, Space, Table, Tag, Typography, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  GiftOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  RocketOutlined,
  TeamOutlined,
  RiseOutlined,
  CalendarOutlined,
  TagOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import {
  useAdminTours,
  useAdminVouchers,
  useCreateAdminVoucher,
  useUpdateAdminVoucher,
  useUpdateAdminVoucherStatus,
} from '../../services/admin/admin.hooks'
import type { AdminVoucherDiscountType, AdminVoucherItem, AdminVoucherStatus } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import {
  adminVoucherDiscountTypeMeta,
  adminVoucherStatusMeta,
  formatDateTime,
  mapStatusOptions,
  toDateTimeLocalValue,
} from '../../utils/admin'
import './AdminVoucherListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = mapStatusOptions(adminVoucherStatusMeta)
const discountTypeOptions = mapStatusOptions(adminVoucherDiscountTypeMeta)

type VoucherFormValues = {
  maVoucher: string
  tenVoucher: string
  tourId?: number
  kieuGiam: AdminVoucherDiscountType
  giaTriGiam: number
  giamToiDa?: number
  donHangToiThieu: number
  ngayBatDau: string
  ngayKetThuc: string
  soLuongToiDa: number
  soLuongDaDung?: number
  moTa?: string
  trangThai: AdminVoucherStatus
}

export default function AdminVoucherListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminVoucherStatus | undefined>()
  const [editingItem, setEditingItem] = useState<AdminVoucherItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form] = Form.useForm<VoucherFormValues>()

  const vouchersQuery = useAdminVouchers()
  const toursQuery = useAdminTours()
  const createVoucherMutation = useCreateAdminVoucher()
  const updateVoucherMutation = useUpdateAdminVoucher()
  const updateStatusMutation = useUpdateAdminVoucherStatus()

  // Analytical Stats
  const stats = useMemo(() => {
    const items = vouchersQuery.data ?? []
    const active = items.filter(i => i.trangThai === 'hoat_dong').length
    const totalUsed = items.reduce((acc, curr) => acc + (curr.soLuongDaDung || 0), 0)
    const totalCapacity = items.reduce((acc, curr) => acc + (curr.soLuongToiDa || 0), 0)
    const usageRatio = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0

    return {
      total: items.length,
      active,
      totalUsed,
      usageRatio: usageRatio.toFixed(1)
    }
  }, [vouchersQuery.data])

  const filteredItems = useMemo(() => {
    const items = vouchersQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.maVoucher, item.tenVoucher, item.tenTour ?? '', item.moTa ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesStatus = statusFilter === undefined ? true : item.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [keyword, statusFilter, vouchersQuery.data])

  const columns: ColumnsType<AdminVoucherItem> = [
    {
      title: 'Voucher',
      key: 'voucher',
      width: 280,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="voucher-code-badge">{record.maVoucher}</div>
          <Text className="voucher-text-primary">{record.tenVoucher}</Text>
          <Text className="voucher-text-secondary" style={{ fontSize: 12 }}>
            {record.tenTour ? `Dành cho: ${record.tenTour}` : 'Áp dụng toàn hệ thống'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Chi tiết ưu đãi',
      key: 'discount',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text className="voucher-price-accent">
            {record.kieuGiam === 'phan_tram' ? `${record.giaTriGiam}%` : formatMoney(record.giaTriGiam)}
          </Text>
          <Tag color={adminVoucherDiscountTypeMeta[record.kieuGiam].color} style={{ width: 'fit-content', marginTop: 4, borderRadius: 6 }}>
            {adminVoucherDiscountTypeMeta[record.kieuGiam].label}
          </Tag>
          <Text className="voucher-text-secondary" style={{ fontSize: 11, marginTop: 4 }}>
            Tối đa: {record.giamToiDa ? formatMoney(record.giamToiDa) : 'Không giới hạn'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Hiệu suất sử dụng',
      key: 'usage',
      width: 220,
      render: (_, record) => {
        const percent = Math.min(((record.soLuongDaDung || 0) / record.soLuongToiDa) * 100, 100)
        return (
          <div className="voucher-usage-container">
            <div className="voucher-usage-info">
              <span>{record.soLuongDaDung}/{record.soLuongToiDa} lượt</span>
              <span>{percent.toFixed(0)}%</span>
            </div>
            <div className="voucher-progress-bg">
              <div className="voucher-progress-fill" style={{ width: `${percent}%` }} />
            </div>
            <Text className="voucher-text-secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
              Min đơn: {formatMoney(record.donHangToiThieu)}
            </Text>
          </div>
        )
      },
    },
    {
      title: 'Hạn dùng',
      key: 'time',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Space size={4}>
            <CalendarOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
            <Text className="voucher-text-secondary" style={{ fontSize: 12 }}>
              Từ: {formatDateTime(record.ngayBatDau)}
            </Text>
          </Space>
          <Space size={4}>
            <ClockCircleOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
            <Text className="voucher-text-secondary" style={{ fontSize: 12, fontWeight: 500, color: '#e11d48' }}>
              Đến: {formatDateTime(record.ngayKetThuc)}
            </Text>
          </Space>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 140,
      render: (value: AdminVoucherStatus) => (
        <Tag className="admin-status-pill" color={adminVoucherStatusMeta[value].color}>
          {adminVoucherStatusMeta[value].label}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Chỉnh sửa">
            <button className="voucher-action-btn edit" onClick={() => {
              setEditingItem(record)
              setDrawerOpen(true)
              form.setFieldsValue({
                maVoucher: record.maVoucher,
                tenVoucher: record.tenVoucher,
                tourId: record.tourId ?? undefined,
                kieuGiam: record.kieuGiam,
                giaTriGiam: record.giaTriGiam,
                giamToiDa: record.giamToiDa ?? undefined,
                donHangToiThieu: record.donHangToiThieu,
                ngayBatDau: toDateTimeLocalValue(record.ngayBatDau),
                ngayKetThuc: toDateTimeLocalValue(record.ngayKetThuc),
                soLuongToiDa: record.soLuongToiDa,
                soLuongDaDung: record.soLuongDaDung,
                moTa: record.moTa ?? undefined,
                trangThai: record.trangThai,
              })
            }}>
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title={record.trangThai === 'hoat_dong' ? 'Ẩn voucher' : 'Kích hoạt'}>
            <Popconfirm
              title={record.trangThai === 'hoat_dong' ? 'Ẩn voucher này?' : 'Kích hoạt voucher này?'}
              onConfirm={() => void updateStatusMutation.mutateAsync({
                id: record.id,
                trangThai: record.trangThai === 'hoat_dong' ? 'an' : 'hoat_dong',
              })}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <button className={`voucher-action-btn ${record.trangThai === 'hoat_dong' ? 'status-inactive' : 'status-active'}`}>
                {record.trangThai === 'hoat_dong' ? <StopOutlined /> : <CheckCircleOutlined />}
              </button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const hasError = vouchersQuery.isError || toursQuery.isError
  const errorMessage = vouchersQuery.error instanceof Error
    ? vouchersQuery.error.message
    : toursQuery.error instanceof Error
      ? toursQuery.error.message
      : 'Không thể tải voucher quản trị'

  const handleSubmit = async (values: VoucherFormValues) => {
    if (editingItem) {
      await updateVoucherMutation.mutateAsync({
        id: editingItem.id,
        payload: {
          ...values,
          tourId: values.tourId ?? null,
          giamToiDa: values.giamToiDa ?? null,
          moTa: values.moTa ?? null,
          soLuongDaDung: values.soLuongDaDung ?? editingItem.soLuongDaDung,
        },
      })
    } else {
      await createVoucherMutation.mutateAsync({
        ...values,
        tourId: values.tourId ?? null,
        giamToiDa: values.giamToiDa ?? null,
        moTa: values.moTa ?? null,
      })
    }

    setDrawerOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="voucher-title-wrapper">
          <div className="voucher-header-icon">
            <GiftOutlined />
          </div>
          <div>
            <Title level={1}>Quản lý voucher</Title>
            <Paragraph>Thiết lập ưu đãi cho từng tour hoặc toàn hệ thống, kiểm soát hạn dùng và số lượng sử dụng.</Paragraph>
          </div>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="admin-primary-button"
            style={{ height: 48, borderRadius: 12, fontWeight: 600 }}
            onClick={() => {
              setEditingItem(null)
              setDrawerOpen(true)
              form.setFieldsValue({
                kieuGiam: 'phan_tram',
                trangThai: 'hoat_dong',
                donHangToiThieu: 0,
                soLuongToiDa: 100,
              })
            }}
          >
            Tạo voucher
          </Button>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px' }}>
        <div className="voucher-stats-grid">
          <div className="voucher-stat-card">
            <div className="stat-icon"><TagOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng voucher</div>
            </div>
          </div>
          <div className="voucher-stat-card active-stat">
            <div className="stat-icon"><RocketOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Đang hoạt động</div>
            </div>
          </div>
          <div className="voucher-stat-card usage-stat">
            <div className="stat-icon"><TeamOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalUsed}</div>
              <div className="stat-label">Lượt sử dụng</div>
            </div>
          </div>
          <div className="voucher-stat-card ratio-stat">
            <div className="stat-icon"><RiseOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.usageRatio}%</div>
              <div className="stat-label">Tỷ lệ chuyển đổi</div>
            </div>
          </div>
        </div>

        <div className="voucher-filter-card">
          <div className="voucher-filter-toolbar">
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo mã voucher, tên voucher hoặc tour..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
            />
            <Select
              allowClear
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={statusOptions}
              placeholder="Trạng thái"
            />
            <Button onClick={() => {
              setKeyword('')
              setStatusFilter(undefined)
            }}>
              Làm mới
            </Button>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} style={{ marginBottom: 24 }} /> : null}

        <div className="voucher-table-container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredItems}
            loading={vouchersQuery.isLoading || toursQuery.isLoading}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} voucher`
            }}
            locale={{ emptyText: <Empty description="Hệ thống hiện chưa có voucher nào" /> }}
            scroll={{ x: 1300 }}
          />
        </div>
      </div>

      <Drawer
        title={<Title level={4} style={{ margin: 0 }}>{editingItem ? 'Cập nhật voucher' : 'Thiết lập voucher mới'}</Title>}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        width={640}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()} loading={createVoucherMutation.isPending || updateVoucherMutation.isPending}>
              {editingItem ? 'Cập nhật' : 'Tạo voucher'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <Title level={5} style={{ marginBottom: 16 }}><InfoCircleOutlined /> Thông tin định danh</Title>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="maVoucher" label="Mã voucher" rules={[{ required: true, message: 'Nhập mã voucher' }]}>
              <Input placeholder="Ví dụ: SUMMER2024" style={{ textTransform: 'uppercase' }} />
            </Form.Item>
            <Form.Item name="tenVoucher" label="Tên voucher" rules={[{ required: true, message: 'Nhập tên hiển thị' }]}>
              <Input placeholder="Ví dụ: Giảm giá mùa hè" />
            </Form.Item>
          </div>
          
          <Form.Item name="tourId" label="Giới hạn Tour (Để trống nếu áp dụng toàn sàn)">
            <Select 
              allowClear 
              showSearch
              placeholder="Chọn tour du lịch..."
              options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))} 
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <Title level={5} style={{ margin: '24px 0 16px' }}><TagOutlined /> Cấu hình ưu đãi</Title>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="kieuGiam" label="Kiểu giảm giá" rules={[{ required: true, message: 'Chọn kiểu giảm' }]}>
              <Select options={discountTypeOptions} />
            </Form.Item>
            <Form.Item name="giaTriGiam" label="Giá trị giảm" rules={[{ required: true, message: 'Nhập giá trị' }]}>
              <InputNumber style={{ width: '100%' }} min={0.01} placeholder="Số tiền hoặc %" />
            </Form.Item>
            <Form.Item name="giamToiDa" label="Số tiền giảm tối đa (VNĐ)">
              <InputNumber style={{ width: '100%' }} min={0} placeholder="Bỏ trống nếu không giới hạn" />
            </Form.Item>
            <Form.Item name="donHangToiThieu" label="Giá trị đơn tối thiểu (VNĐ)" rules={[{ required: true, message: 'Nhập giá trị tối thiểu' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </div>

          <Title level={5} style={{ margin: '24px 0 16px' }}><RocketOutlined /> Số lượng & Thời hạn</Title>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="soLuongToiDa" label="Tổng số lượng phát hành" rules={[{ required: true, message: 'Nhập số lượng' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            {editingItem && (
              <Form.Item name="soLuongDaDung" label="Số lượng đã sử dụng">
                <InputNumber style={{ width: '100%' }} min={0} disabled />
              </Form.Item>
            )}
            <Form.Item name="ngayBatDau" label="Thời gian bắt đầu" rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="ngayKetThuc" label="Thời gian kết thúc" rules={[{ required: true, message: 'Chọn ngày kết thúc' }]}>
              <Input type="datetime-local" />
            </Form.Item>
          </div>

          <Form.Item name="trangThai" label="Trạng thái kích hoạt" rules={[{ required: true, message: 'Chọn trạng thái' }]}>
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item name="moTa" label="Ghi chú & Điều kiện áp dụng">
            <Input.TextArea rows={4} placeholder="Nhập thêm chi tiết về voucher..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
