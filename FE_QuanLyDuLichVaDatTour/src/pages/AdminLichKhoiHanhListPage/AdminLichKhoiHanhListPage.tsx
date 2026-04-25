import { Alert, Button, Empty, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  useAdminLichKhoiHanhs,
  useAdminTours,
  useCreateAdminLichKhoiHanh,
  useUpdateAdminLichKhoiHanh,
  useUpdateAdminLichKhoiHanhStatus,
} from '../../services/admin/admin.hooks'
import type { AdminLichKhoiHanhItem, AdminLichKhoiHanhStatus } from '../../types/admin'
import { formatDate } from '../../utils/formatDate'
import { adminLichKhoiHanhStatusMeta, formatDateTime, mapStatusOptions, toDateTimeLocalValue } from '../../utils/admin'
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

  const lichKhoiHanhsQuery = useAdminLichKhoiHanhs()
  const toursQuery = useAdminTours()
  const createMutation = useCreateAdminLichKhoiHanh()
  const updateMutation = useUpdateAdminLichKhoiHanh()
  const updateStatusMutation = useUpdateAdminLichKhoiHanhStatus()

  const filteredItems = useMemo(() => {
    const items = lichKhoiHanhsQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.maDotTour, item.maTour, item.tenTour, item.noiTapTrung ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesStatus = statusFilter === undefined ? true : item.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [keyword, lichKhoiHanhsQuery.data, statusFilter])

  const columns: ColumnsType<AdminLichKhoiHanhItem> = [
    {
      title: 'Đợt tour',
      key: 'trip',
      width: 260,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.maDotTour}</Text>
          <Text>{record.tenTour}</Text>
          <Text className="admin-muted">{record.maTour}</Text>
        </div>
      ),
    },
    {
      title: 'Lịch trình',
      key: 'schedule',
      width: 200,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{formatDate(record.ngayKhoiHanh)} - {formatDate(record.ngayKetThuc)}</Text>
          <Text className="admin-muted">{record.noiTapTrung || 'Chưa có điểm tập trung'}</Text>
        </div>
      ),
    },
    {
      title: 'Sức chứa',
      key: 'capacity',
      width: 140,
      render: (_, record) => <Text strong>Đã đặt {record.soChoDaDat}/{record.soChoToiDa} • Còn {record.soChoConLai}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (value: AdminLichKhoiHanhStatus) => <Tag color={adminLichKhoiHanhStatusMeta[value].color}>{adminLichKhoiHanhStatusMeta[value].label}</Tag>,
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 170,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 240,
      render: (_, record) => (
        <div className="admin-inline-actions">
          <Button onClick={() => {
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
            Chỉnh sửa
          </Button>
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => void updateStatusMutation.mutateAsync({
              id: record.id,
              trangThai: record.trangThai === 'mo_ban' ? 'het_cho' : 'mo_ban',
            })}
          >
            {record.trangThai === 'mo_ban' ? 'Đóng bán' : 'Mở bán'}
          </Button>
        </div>
      ),
    },
  ]

  const hasError = lichKhoiHanhsQuery.isError || toursQuery.isError
  const errorMessage = lichKhoiHanhsQuery.error instanceof Error
    ? lichKhoiHanhsQuery.error.message
    : toursQuery.error instanceof Error
      ? toursQuery.error.message
      : 'Không thể tải lịch khởi hành quản trị'

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
        <div>
          <Title level={1}>Quản lý lịch khởi hành</Title>
          <Paragraph>Theo dõi các đợt mở bán, sức chứa từng chuyến và cập nhật nhanh tình trạng vận hành.</Paragraph>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({ trangThai: 'mo_ban', soChoToiDa: 30 })
            }}
          >
            + Tạo lịch khởi hành
          </Button>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã đợt tour, tour hoặc điểm tập trung..."
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
          loading={lichKhoiHanhsQuery.isLoading || toursQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có lịch khởi hành" /> }}
          scroll={{ x: 1450 }}
          className="admin-table"
        />
      </div>

      <Modal
        title={editingItem ? 'Cập nhật lịch khởi hành' : 'Tạo lịch khởi hành'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <div className="admin-modal-grid">
            <Form.Item name="tourId" label="Tour" rules={[{ required: true, message: 'Vui lòng chọn tour' }]} className="full-width">
              <Select options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))} />
            </Form.Item>
            <Form.Item name="maDotTour" label="Mã đợt tour" rules={[{ required: true, message: 'Vui lòng nhập mã đợt tour' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="soChoToiDa" label="Số chỗ tối đa" rules={[{ required: true, message: 'Vui lòng nhập số chỗ tối đa' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="ngayKhoiHanh" label="Ngày khởi hành" rules={[{ required: true, message: 'Vui lòng chọn ngày khởi hành' }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="ngayKetThuc" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="noiTapTrung" label="Nơi tập trung" className="full-width">
              <Input />
            </Form.Item>
            <Form.Item name="ghiChu" label="Ghi chú" className="full-width">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="lyDoHuy" label="Lý do huỷ" className="full-width">
              <Input.TextArea rows={3} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
