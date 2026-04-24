import { Alert, Button, Empty, Form, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  useAdminDiaDiems,
  useCreateAdminDiaDiem,
  useUpdateAdminDiaDiem,
  useUpdateAdminDiaDiemStatus,
} from '../../services/admin/admin.hooks'
import type { AdminDiaDiemItem, AdminDiaDiemStatus } from '../../types/admin'
import { adminDiaDiemStatusMeta, formatDateTime, mapStatusOptions } from '../../utils/admin'
import './AdminDiaDiemListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = mapStatusOptions(adminDiaDiemStatusMeta)

type DiaDiemFormValues = {
  tenDiaDiem: string
  tinhThanh?: string
  quocGia: string
  moTa?: string
  trangThai: AdminDiaDiemStatus
}

export default function AdminDiaDiemListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminDiaDiemStatus | undefined>()
  const [editingItem, setEditingItem] = useState<AdminDiaDiemItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<DiaDiemFormValues>()

  const diaDiemsQuery = useAdminDiaDiems()
  const createDiaDiemMutation = useCreateAdminDiaDiem()
  const updateDiaDiemMutation = useUpdateAdminDiaDiem()
  const updateStatusMutation = useUpdateAdminDiaDiemStatus()

  const filteredItems = useMemo(() => {
    const items = diaDiemsQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.tenDiaDiem, item.tinhThanh ?? '', item.quocGia, item.moTa ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesStatus = statusFilter === undefined ? true : item.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [diaDiemsQuery.data, keyword, statusFilter])

  const columns: ColumnsType<AdminDiaDiemItem> = [
    {
      title: 'Điểm đi',
      key: 'location',
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.tenDiaDiem}</Text>
          <Text className="admin-muted">{record.tinhThanh || 'Chưa có tỉnh thành'} • {record.quocGia}</Text>
          <Text className="admin-muted">{record.moTa || 'Chưa có mô tả'}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 160,
      render: (value: AdminDiaDiemStatus) => <Tag color={adminDiaDiemStatusMeta[value].color}>{adminDiaDiemStatusMeta[value].label}</Tag>,
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
              tenDiaDiem: record.tenDiaDiem,
              tinhThanh: record.tinhThanh ?? undefined,
              quocGia: record.quocGia,
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

  const hasError = diaDiemsQuery.isError
  const errorMessage = diaDiemsQuery.error instanceof Error ? diaDiemsQuery.error.message : 'Không thể tải điểm đi quản trị'

  const handleSubmit = async (values: DiaDiemFormValues) => {
    if (editingItem) {
      await updateDiaDiemMutation.mutateAsync({ id: editingItem.id, payload: values })
    } else {
      await createDiaDiemMutation.mutateAsync(values)
    }

    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý điểm đi</Title>
          <Paragraph>Chuẩn hoá dữ liệu địa điểm xuất phát để phục vụ tour, lịch khởi hành và tìm kiếm trên toàn hệ thống.</Paragraph>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({ quocGia: 'Việt Nam', trangThai: 'hoat_dong' })
            }}
          >
            + Thêm điểm đi
          </Button>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tên địa điểm, tỉnh thành hoặc quốc gia..."
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
          loading={diaDiemsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có điểm đi" /> }}
          className="admin-table"
        />
      </div>

      <Modal
        title={editingItem ? 'Cập nhật điểm đi' : 'Thêm điểm đi'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createDiaDiemMutation.isPending || updateDiaDiemMutation.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <Form.Item name="tenDiaDiem" label="Tên địa điểm" rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}>
            <Input />
          </Form.Item>
          <div className="admin-modal-grid">
            <Form.Item name="tinhThanh" label="Tỉnh thành">
              <Input />
            </Form.Item>
            <Form.Item name="quocGia" label="Quốc gia" rules={[{ required: true, message: 'Vui lòng nhập quốc gia' }]}>
              <Input />
            </Form.Item>
          </div>
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
