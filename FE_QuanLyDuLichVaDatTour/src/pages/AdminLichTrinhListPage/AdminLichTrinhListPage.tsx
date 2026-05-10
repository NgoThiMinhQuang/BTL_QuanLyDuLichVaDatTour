import { Alert, Button, Empty, Form, Input, InputNumber, Drawer, Popconfirm, Select, Space, Table, Typography, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  CarryOutOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  HistoryOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {
  useAdminDiaDiems,
  useAdminLichTrinhs,
  useAdminTours,
  useCreateAdminLichTrinh,
  useDeleteAdminLichTrinh,
  useUpdateAdminLichTrinh,
} from '../../services/admin/admin.hooks'
import type { AdminLichTrinhItem } from '../../types/admin'
import { formatDateTime, toTimeInputValue } from '../../utils/admin'
import './AdminLichTrinhListPage.css'

const { Paragraph, Text, Title } = Typography

type LichTrinhFormValues = {
  tourId: number
  ngayThu: number
  thuTuTrongNgay: number
  gioBatDau?: string
  gioKetThuc?: string
  tieuDe?: string
  noiDung?: string
  diaDiemId?: number
}

export default function AdminLichTrinhListPage() {
  const [keyword, setKeyword] = useState('')
  const [selectedTourId, setSelectedTourId] = useState<number | undefined>()
  const [editingItem, setEditingItem] = useState<AdminLichTrinhItem | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form] = Form.useForm<LichTrinhFormValues>()

  const lichTrinhsQuery = useAdminLichTrinhs()
  const toursQuery = useAdminTours()
  const diaDiemsQuery = useAdminDiaDiems()
  const createMutation = useCreateAdminLichTrinh()
  const updateMutation = useUpdateAdminLichTrinh()
  const deleteMutation = useDeleteAdminLichTrinh()

  // Analytical Stats
  const stats = useMemo(() => {
    const items = lichTrinhsQuery.data ?? []
    const uniqueTours = new Set(items.map(i => i.tourId)).size
    const uniqueLocations = new Set(items.map(i => i.diaDiemId).filter(Boolean)).size
    
    // Calculate intensity: Max items in a single day for any tour
    const tourDayGroups: Record<string, number> = {}
    items.forEach(item => {
      const key = `${item.tourId}-${item.ngayThu}`
      tourDayGroups[key] = (tourDayGroups[key] || 0) + 1
    })
    const maxIntensity = Math.max(...Object.values(tourDayGroups), 0)

    return {
      totalSchedules: items.length,
      totalTours: uniqueTours,
      totalLocations: uniqueLocations,
      maxIntensity
    }
  }, [lichTrinhsQuery.data])

  const filteredItems = useMemo(() => {
    const items = lichTrinhsQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.tenTour, item.tieuDe ?? '', item.noiDung ?? '', item.tenDiaDiem ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesTour = selectedTourId === undefined ? true : item.tourId === selectedTourId
      return matchesKeyword && matchesTour
    })
  }, [keyword, lichTrinhsQuery.data, selectedTourId])

  const columns: ColumnsType<AdminLichTrinhItem> = [
    {
      title: 'Thông tin Tour',
      key: 'tour',
      width: 280,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text className="schedule-text-primary" title={record.tenTour}>{record.tenTour}</Text>
          <Space size={8}>
            <span className="schedule-text-accent">Ngày {record.ngayThu}</span>
            <Text className="schedule-text-secondary">Thứ tự: {record.thuTuTrongNgay}</Text>
          </Space>
        </div>
      ),
    },
    {
      title: 'Chi tiết lịch trình',
      key: 'content',
      width: 400,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ fontSize: 14, color: '#0f172a' }}>{record.tieuDe || 'Chưa có tiêu đề'}</Text>
          <Text className="schedule-text-secondary" style={{ marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {record.noiDung || 'Chưa có mô tả chi tiết cho phần này.'}
          </Text>
          {record.tenDiaDiem && (
            <Space size={4} style={{ marginTop: 4 }}>
              <EnvironmentOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
              <Text className="schedule-text-secondary" style={{ fontSize: 12, fontWeight: 500 }}>{record.tenDiaDiem}</Text>
            </Space>
          )}
        </div>
      ),
    },
    {
      title: 'Thời gian thực hiện',
      key: 'time',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Space size={6}>
            <ClockCircleOutlined style={{ color: '#6366f1' }} />
            <Text strong style={{ color: '#4f46e5' }}>
              {record.gioBatDau?.slice(0, 5) || '--:--'} - {record.gioKetThuc?.slice(0, 5) || '--:--'}
            </Text>
          </Space>
          <Space size={4} style={{ marginTop: 4 }}>
            <HistoryOutlined style={{ fontSize: 11, color: '#94a3b8' }} />
            <Text className="schedule-text-secondary" style={{ fontSize: 11 }}>
              {formatDateTime(record.updatedAt)}
            </Text>
          </Space>
        </div>
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
            <button className="schedule-action-btn edit" onClick={() => {
              setEditingItem(record)
              setDrawerOpen(true)
              form.setFieldsValue({
                tourId: record.tourId,
                ngayThu: record.ngayThu,
                thuTuTrongNgay: record.thuTuTrongNgay,
                gioBatDau: toTimeInputValue(record.gioBatDau),
                gioKetThuc: toTimeInputValue(record.gioKetThuc),
                tieuDe: record.tieuDe ?? undefined,
                noiDung: record.noiDung ?? undefined,
                diaDiemId: record.diaDiemId ?? undefined,
              })
            }}>
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title="Xoá">
            <Popconfirm
              title="Xoá lịch trình?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => void deleteMutation.mutateAsync({ id: record.id, tourId: record.tourId })}
              okText="Xoá"
              cancelText="Huỷ"
              okButtonProps={{ danger: true }}
            >
              <button className="schedule-action-btn delete">
                <DeleteOutlined />
              </button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const hasError = lichTrinhsQuery.isError || toursQuery.isError || diaDiemsQuery.isError
  const errorMessage = lichTrinhsQuery.error instanceof Error
    ? lichTrinhsQuery.error.message
    : toursQuery.error instanceof Error
      ? toursQuery.error.message
      : diaDiemsQuery.error instanceof Error
        ? diaDiemsQuery.error.message
        : 'Không thể tải lịch trình quản trị'

  const handleSubmit = async (values: LichTrinhFormValues) => {
    const payload = {
      ...values,
      gioBatDau: values.gioBatDau ? `${values.gioBatDau}:00` : null,
      gioKetThuc: values.gioKetThuc ? `${values.gioKetThuc}:00` : null,
      tieuDe: values.tieuDe ?? null,
      noiDung: values.noiDung ?? null,
      diaDiemId: values.diaDiemId ?? null,
    }

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }

    setDrawerOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="schedule-title-wrapper">
          <div className="schedule-header-icon">
            <CarryOutOutlined />
          </div>
          <div>
            <Title level={1}>Quản lý lịch trình</Title>
            <Paragraph>Thiết kế hành trình chi tiết cho từng tour theo ngày, khung giờ và địa điểm thực hiện.</Paragraph>
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
              form.setFieldsValue({ ngayThu: 1, thuTuTrongNgay: 1, tourId: selectedTourId })
            }}
          >
            Thêm lịch trình
          </Button>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px' }}>
        <div className="schedule-stats-grid">
          <div className="schedule-stat-card">
            <div className="stat-icon"><CarryOutOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalSchedules}</div>
              <div className="stat-label">Tổng lịch trình</div>
            </div>
          </div>
          <div className="schedule-stat-card tours-stat">
            <div className="stat-icon"><AppstoreOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalTours}</div>
              <div className="stat-label">Tour hỗ trợ</div>
            </div>
          </div>
          <div className="schedule-stat-card location-stat">
            <div className="stat-icon"><GlobalOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalLocations}</div>
              <div className="stat-label">Địa điểm</div>
            </div>
          </div>
          <div className="schedule-stat-card recent-stat">
            <div className="stat-icon"><ClockCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.maxIntensity}</div>
              <div className="stat-label">Mật độ tối đa</div>
            </div>
          </div>
        </div>

        <div className="schedule-filter-card">
          <div className="schedule-filter-toolbar">
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo tour, tiêu đề, nội dung hoặc địa điểm..."
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              allowClear
            />
            <Select
              allowClear
              value={selectedTourId}
              onChange={(value) => setSelectedTourId(value)}
              options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))}
              placeholder="Lọc theo tour"
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
            <Button onClick={() => {
              setKeyword('')
              setSelectedTourId(undefined)
            }}>
              Làm mới
            </Button>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} style={{ marginBottom: 24 }} /> : null}

        <div className="schedule-table-container">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredItems}
            loading={lichTrinhsQuery.isLoading || toursQuery.isLoading || diaDiemsQuery.isLoading}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} mục`
            }}
            locale={{ emptyText: <Empty description="Chưa có lịch trình được thiết lập" /> }}
            scroll={{ x: 1000 }}
          />
        </div>
      </div>

      <Drawer
        title={<Title level={4} style={{ margin: 0 }}>{editingItem ? 'Cập nhật lịch trình' : 'Thiết lập lịch trình mới'}</Title>}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        width={600}
        extra={
          <Space>
            <Button onClick={() => setDrawerOpen(false)}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()} loading={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? 'Cập nhật' : 'Lưu lịch trình'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <Title level={5} style={{ marginBottom: 16 }}><AppstoreOutlined /> Thông tin cơ bản</Title>
          <Form.Item name="tourId" label="Tour áp dụng" rules={[{ required: true, message: 'Vui lòng chọn tour' }]}>
            <Select 
              showSearch 
              placeholder="Chọn tour du lịch..."
              options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))} 
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="ngayThu" label="Ngày thứ" rules={[{ required: true, message: 'Nhập ngày thứ' }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="Ví dụ: 1" />
            </Form.Item>
            <Form.Item name="thuTuTrongNgay" label="Thứ tự thực hiện" rules={[{ required: true, message: 'Nhập thứ tự' }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="Ví dụ: 1" />
            </Form.Item>
          </div>

          <Title level={5} style={{ margin: '24px 0 16px' }}><ClockCircleOutlined /> Thời gian & Địa điểm</Title>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="gioBatDau" label="Giờ bắt đầu">
              <Input type="time" />
            </Form.Item>
            <Form.Item name="gioKetThuc" label="Giờ kết thúc">
              <Input type="time" />
            </Form.Item>
          </div>

          <Form.Item name="diaDiemId" label="Địa điểm cụ thể">
            <Select 
              allowClear 
              showSearch
              placeholder="Tìm kiếm địa điểm..."
              options={(diaDiemsQuery.data ?? []).map((item) => ({ value: item.id, label: `${item.tenDiaDiem} • ${item.quocGia}` }))} 
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>

          <Title level={5} style={{ margin: '24px 0 16px' }}><EditOutlined /> Nội dung chi tiết</Title>
          <Form.Item name="tieuDe" label="Tiêu đề hoạt động" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input placeholder="Ví dụ: Tham quan Bà Nà Hills..." />
          </Form.Item>
          <Form.Item name="noiDung" label="Mô tả hành trình">
            <Input.TextArea rows={6} placeholder="Nhập chi tiết các hoạt động diễn ra trong khung giờ này..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
