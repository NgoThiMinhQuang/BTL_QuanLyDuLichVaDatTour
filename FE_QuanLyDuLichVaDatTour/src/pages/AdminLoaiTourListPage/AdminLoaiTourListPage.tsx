import { Alert, Button, Empty, Form, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd'
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

  const columns: ColumnsType<AdminLoaiTourItem> = [
    {
      title: 'Loại tour',
      key: 'type',
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.ten}</Text>
          <Text className="admin-muted">{record.moTa || 'Chưa có mô tả'}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 160,
      render: (value: AdminLoaiTourStatus) => <Tag color={adminLoaiTourStatusMeta[value].color}>{adminLoaiTourStatusMeta[value].label}</Tag>,
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
      width: 220,
      render: (_, record) => (
        <div className="admin-inline-actions">
          <Button onClick={() => {
            setEditingItem(record)
            setModalOpen(true)
            form.setFieldsValue({
              ten: record.ten,
              moTa: record.moTa ?? undefined,
              trangThai: record.trangThai,
            })
          }}>
            Chỉnh sửa
          </Button>
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => void updateStatusMutation.mutateAsync({
              id: record.id,
              trangThai: record.trangThai === 'hoat_dong' ? 'an' : 'hoat_dong',
            })}
          >
            {record.trangThai === 'hoat_dong' ? 'Ẩn' : 'Kích hoạt'}
          </Button>
        </div>
      ),
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
          <Title level={1}>Quản lý loại tour</Title>
          <Paragraph>Tổ chức các nhóm tour để chuẩn hoá hiển thị, lọc dữ liệu và mở rộng nội dung bán hàng.</Paragraph>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({ trangThai: 'hoat_dong' })
            }}
          >
            + Thêm loại tour
          </Button>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
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

        {hasError ? <Alert type="error" showIcon message={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={loaiToursQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có loại tour" /> }}
          className="admin-table"
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
