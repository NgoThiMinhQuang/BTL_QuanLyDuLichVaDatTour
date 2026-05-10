import { AppstoreOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Alert, Button, Empty, Form, Input, Modal, Select, Space, Table, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  useAdminLoaiTours,
  useCreateAdminLoaiTour,
  useUpdateAdminLoaiTour,
  useUpdateAdminLoaiTourStatus,
} from '../../services/admin/admin.hooks'
import type { AdminLoaiTourItem, AdminLoaiTourStatus } from '../../types/admin'
import { adminLoaiTourStatusMeta, formatDateTime, mapStatusOptions } from '../../utils/admin'
import './AdminLoaiTourListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = mapStatusOptions(adminLoaiTourStatusMeta)

type LoaiTourFormValues = {
  ten: string
  moTa?: string
  trangThai: AdminLoaiTourStatus
}

export default function AdminLoaiTourListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminLoaiTourStatus | undefined>()
  const [editingItem, setEditingItem] = useState<AdminLoaiTourItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<LoaiTourFormValues>()

  const loaiToursQuery = useAdminLoaiTours()
  const createLoaiTourMutation = useCreateAdminLoaiTour()
  const updateLoaiTourMutation = useUpdateAdminLoaiTour()
  const updateStatusMutation = useUpdateAdminLoaiTourStatus()

  const filteredItems = useMemo(() => {
    const items = loaiToursQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.ten, item.moTa ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesStatus = statusFilter === undefined ? true : item.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [keyword, loaiToursQuery.data, statusFilter])

  const stats = useMemo(() => {
    const items = loaiToursQuery.data ?? []
    return {
      total: items.length,
      active: items.filter(i => i.trangThai === 'hoat_dong').length,
      inactive: items.filter(i => i.trangThai === 'an').length,
    }
  }, [loaiToursQuery.data])

  const columns: ColumnsType<AdminLoaiTourItem> = [
    {
      title: 'Loại tour',
      key: 'type',
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong style={{ fontSize: '16px', color: '#1e293b' }}>{record.ten}</Text>
          <Text className="admin-muted" style={{ fontSize: '14px' }}>{record.moTa || 'Chưa có mô tả'}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 160,
      render: (value: AdminLoaiTourStatus) => {
        const isActive = value === 'hoat_dong'
        return (
          <div className={`tour-type-status-pill ${isActive ? 'active' : 'inactive'}`}>
            <div className="status-dot"></div>
            {adminLoaiTourStatusMeta[value].label}
          </div>
        )
      },
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, record) => {
        const isActive = record.trangThai === 'hoat_dong'
        return (
          <Space size="middle">
            <Tooltip title="Chỉnh sửa">
              <button 
                className="tour-type-action-btn edit"
                onClick={() => {
                  setEditingItem(record)
                  setModalOpen(true)
                  form.setFieldsValue({
                    ten: record.ten,
                    moTa: record.moTa ?? undefined,
                    trangThai: record.trangThai,
                  })
                }}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title={isActive ? 'Ẩn' : 'Kích hoạt'}>
              <button 
                className={`tour-type-action-btn toggle ${isActive ? '' : 'activate'}`}
                onClick={() => void updateStatusMutation.mutateAsync({
                  id: record.id,
                  trangThai: isActive ? 'an' : 'hoat_dong',
                })}
              >
                {isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              </button>
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  const hasError = loaiToursQuery.isError
  const errorMessage = loaiToursQuery.error instanceof Error ? loaiToursQuery.error.message : 'Không thể tải loại tour quản trị'

  const handleSubmit = async (values: LoaiTourFormValues) => {
    if (editingItem) {
      await updateLoaiTourMutation.mutateAsync({ id: editingItem.id, payload: values })
    } else {
      await createLoaiTourMutation.mutateAsync(values)
    }

    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <div className="tour-type-title-wrapper">
            <div className="tour-type-header-icon">
              <AppstoreOutlined />
            </div>
            <div>
              <Title level={1}>Quản lý loại tour</Title>
              <Paragraph>Tổ chức các nhóm tour để chuẩn hoá hiển thị, lọc dữ liệu và mở rộng nội dung bán hàng.</Paragraph>
            </div>
          </div>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="tour-type-add-btn"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({ trangThai: 'hoat_dong' })
            }}
          >
            Thêm loại tour
          </Button>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px' }}>
        <div className="tour-type-stats-grid">
          <div className="tour-type-stat-card">
            <div className="stat-label">Tổng số loại tour</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="tour-type-stat-card active-stat">
            <div className="stat-label">Đang hoạt động</div>
            <div className="stat-value">{stats.active}</div>
          </div>
          <div className="tour-type-stat-card inactive-stat">
            <div className="stat-label">Đã ẩn</div>
            <div className="stat-value">{stats.inactive}</div>
          </div>
        </div>

        <div className="tour-type-filter-card">
          <div className="tour-type-filter-toolbar">
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo tên loại tour hoặc mô tả..."
              className="admin-filter-field"
            />
            <Select
              allowClear
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={statusOptions}
              placeholder="Trạng thái"
              className="admin-filter-field"
            />
            <Button className="admin-filter-button" onClick={() => {
              setKeyword('')
              setStatusFilter(undefined)
            }}>
              Xoá bộ lọc
            </Button>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={loaiToursQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có loại tour" /> }}
          className="admin-table tour-type-table"
        />
      </div>

      <Modal
        title={editingItem ? 'Cập nhật loại tour' : 'Thêm loại tour'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createLoaiTourMutation.isPending || updateLoaiTourMutation.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <Form.Item name="ten" label="Tên loại tour" rules={[{ required: true, message: 'Vui lòng nhập tên loại tour' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
            <Select options={statusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
