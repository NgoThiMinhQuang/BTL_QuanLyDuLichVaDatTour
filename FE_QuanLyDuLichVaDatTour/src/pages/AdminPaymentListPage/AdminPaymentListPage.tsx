import { Alert, Button, Descriptions, Drawer, Empty, Form, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useAdminPayment, useAdminPayments, useUpdateAdminPaymentStatus } from '../../services/admin/admin.hooks'
import type { AdminPaymentItem, AdminPaymentTransactionStatus } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import {
  adminPaymentChannelMeta,
  adminPaymentMethodMeta,
  adminPaymentTransactionStatusMeta,
  adminPaymentTransactionTypeMeta,
  formatDateTime,
  mapStatusOptions,
} from '../../utils/admin'
import './AdminPaymentListPage.css'

const { Paragraph, Text, Title } = Typography

const paymentStatusOptions = mapStatusOptions(adminPaymentTransactionStatusMeta)

export default function AdminPaymentListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminPaymentTransactionStatus | undefined>()
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | undefined>()
  const [statusForm] = Form.useForm<{ trangThai: AdminPaymentTransactionStatus; ghiChu?: string }>()

  const paymentsQuery = useAdminPayments()
  const paymentDetailQuery = useAdminPayment(selectedPaymentId)
  const updatePaymentStatusMutation = useUpdateAdminPaymentStatus()

  const filteredPayments = useMemo(() => {
    const payments = paymentsQuery.data ?? []
    return payments.filter((payment) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [
            payment.maBooking,
            payment.hoTenKhachHang,
            payment.maGiaoDichNoiBo ?? '',
            payment.maGiaoDichBenThuBa ?? '',
            payment.phuongThucThanhToan,
          ].some((value) => value.toLowerCase().includes(normalizedKeyword))

      const matchesStatus = statusFilter === undefined ? true : payment.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [keyword, paymentsQuery.data, statusFilter])

  const columns: ColumnsType<AdminPaymentItem> = [
    {
      title: 'Giao dịch',
      key: 'transaction',
      width: 260,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.maGiaoDichNoiBo || `#${record.id}`}</Text>
          <Text className="admin-muted">{record.maBooking} • {record.hoTenKhachHang}</Text>
          <Text className="admin-muted">{record.maGiaoDichBenThuBa || 'Chưa có mã bên thứ ba'}</Text>
        </div>
      ),
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'loaiGiaoDich',
      key: 'loaiGiaoDich',
      width: 170,
      render: (value: string) => {
        const meta = adminPaymentTransactionTypeMeta[value as keyof typeof adminPaymentTransactionTypeMeta]
        return <Tag color={meta?.color ?? 'default'}>{meta?.label ?? value}</Tag>
      },
    },
    {
      title: 'Kênh / phương thức',
      key: 'channel',
      width: 180,
      render: (_, record) => {
        const channel = adminPaymentChannelMeta[record.kenhThanhToan as keyof typeof adminPaymentChannelMeta]
        const method = adminPaymentMethodMeta[record.phuongThucThanhToan as keyof typeof adminPaymentMethodMeta]
        return (
          <div className="admin-table-stack">
            <Tag color={channel?.color ?? 'default'}>{channel?.label ?? record.kenhThanhToan}</Tag>
            <Tag color={method?.color ?? 'default'}>{method?.label ?? record.phuongThucThanhToan}</Tag>
          </div>
        )
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      key: 'soTien',
      width: 140,
      render: (value: number) => <Text className="admin-price">{formatMoney(value)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (value: AdminPaymentTransactionStatus) => <Tag color={adminPaymentTransactionStatusMeta[value].color}>{adminPaymentTransactionStatusMeta[value].label}</Tag>,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'thoiGianTao',
      key: 'thoiGianTao',
      width: 170,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <div className="admin-action-stack">
          <Button onClick={() => {
            setSelectedPaymentId(record.id)
            statusForm.setFieldsValue({
              trangThai: record.trangThai,
              ghiChu: record.ghiChu ?? undefined,
            })
          }}>
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => void updatePaymentStatusMutation.mutateAsync({
              id: record.id,
              payload: {
                trangThai: record.trangThai === 'thanh_cong' ? 'da_hoan_tien' : 'thanh_cong',
                ghiChu: record.ghiChu ?? undefined,
              },
            })}
          >
            {record.trangThai === 'thanh_cong' ? 'Hoàn tiền' : 'Xác nhận'}
          </Button>
        </div>
      ),
    },
  ]

  const hasError = paymentsQuery.isError
  const errorMessage = paymentsQuery.error instanceof Error ? paymentsQuery.error.message : 'Không thể tải dữ liệu thanh toán quản trị'

  const selectedPayment = paymentDetailQuery.data

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý thanh toán</Title>
          <Paragraph>Giám sát giao dịch đặt cọc, thanh toán còn lại và xử lý trạng thái giao dịch theo thời gian thực.</Paragraph>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã booking, khách hàng, giao dịch..."
            className="admin-filter-field"
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={paymentStatusOptions}
            placeholder="Trạng thái giao dịch"
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
          dataSource={filteredPayments}
          loading={paymentsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có giao dịch thanh toán" /> }}
          scroll={{ x: 1500 }}
          className="admin-table"
        />
      </div>

      <Drawer
        title={selectedPayment ? `Chi tiết giao dịch ${selectedPayment.maGiaoDichNoiBo || `#${selectedPayment.id}`}` : 'Chi tiết giao dịch'}
        open={selectedPaymentId !== undefined}
        onClose={() => setSelectedPaymentId(undefined)}
        width={680}
        destroyOnClose
      >
        {paymentDetailQuery.isLoading ? <Paragraph>Đang tải chi tiết giao dịch...</Paragraph> : null}
        {paymentDetailQuery.isError ? (
          <Alert
            type="error"
            showIcon
            title={paymentDetailQuery.error instanceof Error ? paymentDetailQuery.error.message : 'Không thể tải chi tiết giao dịch'}
          />
        ) : null}

        {selectedPayment ? (
          <Space orientation="vertical" size={20} style={{ width: '100%' }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Booking">{selectedPayment.maBooking}</Descriptions.Item>
              <Descriptions.Item label="Khách hàng">{selectedPayment.hoTenKhachHang}</Descriptions.Item>
              <Descriptions.Item label="Số tiền">{formatMoney(selectedPayment.soTien)}</Descriptions.Item>
              <Descriptions.Item label="Loại giao dịch">{selectedPayment.loaiGiaoDich}</Descriptions.Item>
              <Descriptions.Item label="Kênh thanh toán">{selectedPayment.kenhThanhToan}</Descriptions.Item>
              <Descriptions.Item label="Phương thức">{selectedPayment.phuongThucThanhToan}</Descriptions.Item>
              <Descriptions.Item label="Nhà cung cấp">{selectedPayment.nhaCungCap || '-'}</Descriptions.Item>
              <Descriptions.Item label="Mã giao dịch bên thứ ba">{selectedPayment.maGiaoDichBenThuBa || '-'}</Descriptions.Item>
              <Descriptions.Item label="Thời gian tạo">{formatDateTime(selectedPayment.thoiGianTao)}</Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={4}>Cập nhật trạng thái</Title>
              <Form
                form={statusForm}
                layout="vertical"
                onFinish={(values) => void updatePaymentStatusMutation.mutateAsync({ id: selectedPayment.id, payload: values })}
              >
                <div className="admin-modal-grid">
                  <Form.Item name="trangThai" label="Trạng thái giao dịch" rules={[{ required: true, message: 'Vui lòng chọn trạng thái giao dịch' }]}>
                    <Select options={paymentStatusOptions} />
                  </Form.Item>
                  <Form.Item name="ghiChu" label="Ghi chú" className="full-width">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </div>
                <Button type="primary" htmlType="submit" loading={updatePaymentStatusMutation.isPending} className="admin-primary-button">
                  Lưu cập nhật
                </Button>
              </Form>
            </div>
          </Space>
        ) : null}
      </Drawer>
    </div>
  )
}
