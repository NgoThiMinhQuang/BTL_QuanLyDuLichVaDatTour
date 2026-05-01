import { Alert, Button, Empty, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
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
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<VoucherFormValues>()

  const vouchersQuery = useAdminVouchers()
  const toursQuery = useAdminTours()
  const createVoucherMutation = useCreateAdminVoucher()
  const updateVoucherMutation = useUpdateAdminVoucher()
  const updateStatusMutation = useUpdateAdminVoucherStatus()

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
      width: 260,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.maVoucher}</Text>
          <Text>{record.tenVoucher}</Text>
          <Text className="admin-muted">{record.tenTour || 'Áp dụng toàn hệ thống'}</Text>
        </div>
      ),
    },
    {
      title: 'Kiểu giảm',
      dataIndex: 'kieuGiam',
      key: 'kieuGiam',
      width: 140,
      render: (value: AdminVoucherDiscountType) => <Tag color={adminVoucherDiscountTypeMeta[value].color}>{adminVoucherDiscountTypeMeta[value].label}</Tag>,
    },
    {
      title: 'Giá trị',
      key: 'value',
      width: 180,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text className="admin-price">{record.kieuGiam === 'phan_tram' ? `${record.giaTriGiam}%` : formatMoney(record.giaTriGiam)}</Text>
          <Text className="admin-muted">Tối đa {record.giamToiDa ? formatMoney(record.giamToiDa) : 'Không giới hạn'}</Text>
        </div>
      ),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      width: 160,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{record.soLuongDaDung}/{record.soLuongToiDa}</Text>
          <Text className="admin-muted">Tối thiểu đơn {formatMoney(record.donHangToiThieu)}</Text>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 180,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{formatDateTime(record.ngayBatDau)}</Text>
          <Text className="admin-muted">Đến {formatDateTime(record.ngayKetThuc)}</Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 140,
      render: (value: AdminVoucherStatus) => <Tag color={adminVoucherStatusMeta[value].color}>{adminVoucherStatusMeta[value].label}</Tag>,
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

    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý voucher</Title>
          <Paragraph>Thiết lập ưu đãi cho từng tour hoặc toàn hệ thống, kiểm soát hạn dùng và số lượng sử dụng.</Paragraph>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({
                kieuGiam: 'phan_tram',
                trangThai: 'hoat_dong',
                donHangToiThieu: 0,
                soLuongToiDa: 100,
              })
            }}
          >
            + Tạo voucher
          </Button>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã voucher, tên voucher hoặc tour..."
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

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={vouchersQuery.isLoading || toursQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có voucher" /> }}
          scroll={{ x: 1550 }}
          className="admin-table"
        />
      </div>

      <Modal
        title={editingItem ? 'Cập nhật voucher' : 'Tạo voucher'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createVoucherMutation.isPending || updateVoucherMutation.isPending}
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <div className="admin-modal-grid">
            <Form.Item name="maVoucher" label="Mã voucher" rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tenVoucher" label="Tên voucher" rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tourId" label="Tour áp dụng">
              <Select allowClear options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))} />
            </Form.Item>
            <Form.Item name="kieuGiam" label="Kiểu giảm" rules={[{ required: true, message: 'Vui lòng chọn kiểu giảm' }]}>
              <Select options={discountTypeOptions} />
            </Form.Item>
            <Form.Item name="giaTriGiam" label="Giá trị giảm" rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}>
              <InputNumber style={{ width: '100%' }} min={0.01} />
            </Form.Item>
            <Form.Item name="giamToiDa" label="Giảm tối đa">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="donHangToiThieu" label="Đơn hàng tối thiểu" rules={[{ required: true, message: 'Vui lòng nhập đơn hàng tối thiểu' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="soLuongToiDa" label="Số lượng tối đa" rules={[{ required: true, message: 'Vui lòng nhập số lượng tối đa' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            {editingItem ? (
              <Form.Item name="soLuongDaDung" label="Số lượng đã dùng">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            ) : null}
            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="ngayBatDau" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="ngayKetThuc" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
              <Input type="datetime-local" />
            </Form.Item>
          </div>
          <Form.Item name="moTa" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
