import { Alert, Button, Empty, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag, Typography, Tooltip, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  useAdminLichKhoiHanhs,
  useAdminTours,
  useCreateAdminLichKhoiHanh,
  useUpdateAdminLichKhoiHanh,
  useUpdateAdminLichKhoiHanhStatus,
  useAdminBangGia,
  useUpsertBangGiaLichKhoiHanh,
  useDeleteBangGiaLichKhoiHanh,
} from '../../services/admin/admin.hooks'
import type { AdminLichKhoiHanhItem, AdminLichKhoiHanhStatus } from '../../types/admin'
import { formatDate } from '../../utils/formatDate'
import { adminLichKhoiHanhStatusMeta, formatDateTime, mapStatusOptions, toDateTimeLocalValue } from '../../utils/admin'
import {
  CalendarOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DollarOutlined,
  PoweroffOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  HistoryOutlined,
  InboxOutlined,
  PieChartOutlined,
  FieldTimeOutlined,
  WalletOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import './AdminLichKhoiHanhListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = mapStatusOptions(adminLichKhoiHanhStatusMeta)

type LichKhoiHanhFormValues = {
  tourId: number
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung?: string
  soChoToiDa: number
  ghiChu?: string
  lyDoHuy?: string
  trangThai: AdminLichKhoiHanhStatus
}

export default function AdminLichKhoiHanhListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminLichKhoiHanhStatus | undefined>()
  const [editingItem, setEditingItem] = useState<AdminLichKhoiHanhItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<LichKhoiHanhFormValues>()

  // Pricing modal
  const [pricingModalOpen, setPricingModalOpen] = useState(false)
  const [pricingLkhId, setPricingLkhId] = useState<number | null>(null)
  const [pricingTen, setPricingTen] = useState('')
  const [pricingForm] = Form.useForm()

  const lichKhoiHanhsQuery = useAdminLichKhoiHanhs()
  const toursQuery = useAdminTours()
  const createMutation = useCreateAdminLichKhoiHanh()
  const updateMutation = useUpdateAdminLichKhoiHanh()
  const updateStatusMutation = useUpdateAdminLichKhoiHanhStatus()

  const bangGiaQuery = useAdminBangGia(pricingLkhId ?? undefined)
  const upsertBangGiaMutation = useUpsertBangGiaLichKhoiHanh()
  const deleteBangGiaMutation = useDeleteBangGiaLichKhoiHanh()

  const filteredItems = useMemo(() => {
    const items = lichKhoiHanhsQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.maDotTour, item.maTour, item.tenTour, item.noiTapTrung ?? ''].some((value) => (value || '').toLowerCase().includes(normalizedKeyword))
      const matchesStatus = statusFilter === undefined ? true : item.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [keyword, lichKhoiHanhsQuery.data, statusFilter])

  const stats = useMemo(() => {
    const items = lichKhoiHanhsQuery.data ?? []
    const totalSlots = items.reduce((sum, item) => sum + (item.soChoToiDa || 0), 0)
    const soldSlots = items.reduce((sum, item) => sum + (item.soChoDaDat || 0), 0)
    const upcoming = items.filter(item => {
      if (!item.ngayKhoiHanh) return false
      const diff = new Date(item.ngayKhoiHanh).getTime() - new Date().getTime()
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000
    }).length

    return {
      total: items.length,
      fillRate: totalSlots > 0 ? Math.round((soldSlots / totalSlots) * 100) : 0,
      upcoming,
      totalSlots
    }
  }, [lichKhoiHanhsQuery.data])

  const handleOpenPricingModal = (record: AdminLichKhoiHanhItem) => {
    setPricingLkhId(record.id)
    setPricingTen(`${record.maDotTour} - ${record.tenTour}`)
    setPricingModalOpen(true)
  }

  const handleLoadPricing = () => {
    if (bangGiaQuery.data) {
      pricingForm.setFieldsValue(bangGiaQuery.data)
    }
  }

  const handleSavePricing = async () => {
    if (pricingLkhId === null) return
    try {
      const values = await pricingForm.validateFields()
      await upsertBangGiaMutation.mutateAsync({ lichKhoiHanhId: pricingLkhId, payload: values })
      void message.success('Đã cập nhật bảng giá')
    } catch { /* validation */ }
  }

  const columns: ColumnsType<AdminLichKhoiHanhItem> = [
    {
      title: 'Đợt Tour',
      key: 'trip',
      width: 280,
      render: (_, record) => (
        <div className="tour-info-cell">
          <span className="batch-tag">{record.maDotTour}</span>
          <span className="tour-name-bold">{record.tenTour}</span>
          <Text type="secondary" style={{ fontSize: 11 }}>Mã: {record.maTour}</Text>
        </div>
      ),
    },
    {
      title: 'Lịch trình',
      key: 'schedule',
      width: 260,
      render: (_, record) => {
        const start = new Date(record.ngayKhoiHanh)
        const end = new Date(record.ngayKetThuc)
        const diffTime = end.getTime() - start.getTime()
        const nights = isNaN(diffTime) ? 0 : Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)))

        return (
          <div className="schedule-card-cell">
            <div className="date-pill-wrapper">
              <span>{formatDate(record.ngayKhoiHanh)}</span>
              <ArrowRightOutlined style={{ fontSize: 10, color: '#cbd5e1' }} />
              <span>{formatDate(record.ngayKetThuc)}</span>
              <span className="nights-badge">{nights}N{nights - 1}Đ</span>
            </div>
            {record.noiTapTrung && (
              <div className="location-subtext">
                <EnvironmentOutlined />
                <span>{record.noiTapTrung}</span>
              </div>
            )}
          </div>
        )
      },
    },
    {
      title: 'Sức chứa',
      key: 'capacity',
      width: 200,
      render: (_, record) => {
        const percent = record.soChoToiDa > 0 ? Math.round((record.soChoDaDat / record.soChoToiDa) * 100) : 0
        return (
          <div className="capacity-progress-wrapper">
            <div className="capacity-header">
              <Text strong style={{ fontSize: 13 }}>{record.soChoDaDat} / {record.soChoToiDa}</Text>
              <Text style={{ fontSize: 12, color: percent >= 80 ? '#f59e0b' : '#64748b' }}>{percent}%</Text>
            </div>
            <Progress
              percent={percent}
              size="small"
              showInfo={false}
              strokeColor={{
                '0%': percent >= 80 ? '#f59e0b' : '#6366f1',
                '100%': percent >= 100 ? '#ef4444' : percent >= 80 ? '#fbbf24' : '#a855f7',
              }}
              strokeWidth={6}
            />
          </div>
        )
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (value: AdminLichKhoiHanhStatus) => {
        const meta = adminLichKhoiHanhStatusMeta[value]
        if (!meta) return <span>{value}</span>

        // Define soft colors based on meta.color
        const colorMap: Record<string, { bg: string, text: string }> = {
          green: { bg: '#f0fdf4', text: '#16a34a' },
          gold: { bg: '#fffbeb', text: '#d97706' },
          blue: { bg: '#eff6ff', text: '#2563eb' },
          red: { bg: '#fef2f2', text: '#dc2626' },
          default: { bg: '#f8fafc', text: '#475569' }
        }
        const style = colorMap[meta.color] || colorMap.default

        return (
          <Tag
            style={{
              backgroundColor: style.bg,
              color: style.text,
              border: `1px solid ${style.bg}`,
              borderRadius: '8px',
              padding: '2px 10px',
              fontWeight: 600,
              fontSize: 12
            }}
          >
            {meta.label}
          </Tag>
        )
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      align: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Bảng giá">
            <button className="inventory-action-btn" onClick={() => handleOpenPricingModal(record)}>
              <DollarOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Sửa">
            <button className="inventory-action-btn" onClick={() => {
              setEditingItem(record)
              setModalOpen(true)
              form.setFieldsValue({
                tourId: record.tourId,
                maDotTour: record.maDotTour,
                ngayKhoiHanh: toDateTimeLocalValue(record.ngayKhoiHanh),
                ngayKetThuc: toDateTimeLocalValue(record.ngayKetThuc),
                noiTapTrung: record.noiTapTrung ?? undefined,
                soChoToiDa: record.soChoToiDa,
                ghiChu: record.ghiChu ?? undefined,
                lyDoHuy: record.lyDoHuy ?? undefined,
                trangThai: record.trangThai,
              })
            }}>
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title={record.trangThai === 'mo_ban' ? 'Đóng' : 'Mở'}>
            <button
              className={`inventory-action-btn ${record.trangThai === 'mo_ban' ? 'danger' : ''}`}
              onClick={() => void updateStatusMutation.mutateAsync({
                id: record.id,
                trangThai: record.trangThai === 'mo_ban' ? 'het_cho' : 'mo_ban',
              })}
            >
              <PoweroffOutlined />
            </button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const hasError = lichKhoiHanhsQuery.isError || toursQuery.isError
  const errorMessage = lichKhoiHanhsQuery.error instanceof Error
    ? lichKhoiHanhsQuery.error.message
    : toursQuery.error instanceof Error
      ? toursQuery.error.message
      : 'Không thể tải dữ liệu'

  const handleSubmit = async (values: LichKhoiHanhFormValues) => {
    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload: values })
    } else {
      await createMutation.mutateAsync(values)
    }
    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="schedule-title-wrapper">
          <div className="schedule-header-icon">
            <CalendarOutlined />
          </div>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>Quản lý Lịch khởi hành</Title>
            <Text type="secondary">Cập nhật kho tour và tình trạng vận hành thời gian thực</Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ borderRadius: 12, height: 48, background: '#6366f1', border: 'none', fontWeight: 600, padding: '0 24px' }}
          onClick={() => {
            setEditingItem(null)
            setModalOpen(true)
            form.setFieldsValue({ trangThai: 'mo_ban', soChoToiDa: 30 })
          }}
        >
          Thêm đợt tour mới
        </Button>
      </div>

      <div className="schedule-stats-grid">
        <div className="schedule-stat-card total">
          <div className="stat-icon-box"><InboxOutlined /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Tổng đợt tour</span>
          </div>
        </div>
        <div className="schedule-stat-card fill">
          <div className="stat-icon-box"><PieChartOutlined /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.fillRate}%</span>
            <span className="stat-label">Tỉ lệ lấp đầy</span>
          </div>
        </div>
        <div className="schedule-stat-card upcoming">
          <div className="stat-icon-box"><FieldTimeOutlined /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.upcoming}</span>
            <span className="stat-label">Sắp khởi hành</span>
          </div>
        </div>
        <div className="schedule-stat-card revenue">
          <div className="stat-icon-box"><WalletOutlined /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalSlots}</span>
            <span className="stat-label">Tổng chỗ cung ứng</span>
          </div>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã đợt, tên tour, điểm đón..."
            prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
            style={{ width: 350, borderRadius: 12, height: 44 }}
            allowClear
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={statusOptions}
            placeholder="Lọc trạng thái"
            style={{ width: 200, height: 44 }}
            dropdownStyle={{ borderRadius: 12 }}
          />
          <Button
            size="large"
            type="text"
            icon={<HistoryOutlined />}
            onClick={() => {
              setKeyword('')
              setStatusFilter(undefined)
            }}
            style={{ borderRadius: 12, height: 44 }}
          >
            Làm mới
          </Button>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} style={{ marginBottom: 24, borderRadius: 12 }} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={lichKhoiHanhsQuery.isLoading || toursQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Không có dữ liệu lịch trình" /> }}
          scroll={{ x: 'max-content' }}
          className="inventory-table"
        />
      </div>

      {/* ── Create/edit modal ── */}
      <Modal
        title={editingItem ? 'Cập nhật lịch trình' : 'Tạo lịch trình mới'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={720}
        destroyOnClose
        className="admin-custom-modal"
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)} style={{ marginTop: 24 }}>
          <div className="admin-modal-grid">
            <Form.Item name="tourId" label="Tour liên kết" rules={[{ required: true }]} className="full-width">
              <Select showSearch optionFilterProp="label" placeholder="Chọn tour" options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))} />
            </Form.Item>
            <Form.Item name="maDotTour" label="Mã đợt tour" rules={[{ required: true }]}>
              <Input placeholder="VD: DOT-2024-01" />
            </Form.Item>
            <Form.Item name="soChoToiDa" label="Số chỗ tối đa" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="ngayKhoiHanh" label="Ngày khởi hành" rules={[{ required: true }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="ngayKetThuc" label="Ngày kết thúc" rules={[{ required: true }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="noiTapTrung" label="Nơi tập trung" className="full-width">
              <Input />
            </Form.Item>
            <Form.Item name="ghiChu" label="Ghi chú nội bộ" className="full-width">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* ── Pricing modal ── */}
      <Modal
        title={
          <Space>
            <DollarOutlined />
            <span>Thiết lập giá: {pricingTen}</span>
          </Space>
        }
        open={pricingModalOpen}
        onCancel={() => { setPricingModalOpen(false); setPricingLkhId(null); pricingForm.resetFields() }}
        onOk={() => void handleSavePricing()}
        confirmLoading={upsertBangGiaMutation.isPending}
        width={650}
        destroyOnClose
        afterOpenChange={(open) => { if (open) setTimeout(() => handleLoadPricing(), 100) }}
        className="admin-custom-modal"
      >
        <Form form={pricingForm} layout="vertical" style={{ marginTop: 24 }}>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
            <Title level={5} style={{ marginTop: 0, fontSize: 14, color: '#6366f1' }}>Giá ngày thường</Title>
            <div className="admin-modal-grid">
              <Form.Item name="giaNguoiLonNgayThuong" label="Người lớn" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} addonAfter="VND" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
              <Form.Item name="giaTreEmNgayThuong" label="Trẻ em" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} addonAfter="VND" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </div>
          </div>
          <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '16px' }}>
            <Title level={5} style={{ marginTop: 0, fontSize: 14, color: '#ef4444' }}>Giá cuối tuần</Title>
            <div className="admin-modal-grid">
              <Form.Item name="giaNguoiLonCuoiTuan" label="Người lớn" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} addonAfter="VND" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
              <Form.Item name="giaTreEmCuoiTuan" label="Trẻ em" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={0} addonAfter="VND" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}