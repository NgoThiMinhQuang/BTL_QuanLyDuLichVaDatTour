import { Alert, Button, Descriptions, Drawer, Empty, Form, Input, Select, Space, Tag, Typography, Modal, Pagination, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState, useEffect } from 'react'
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
import { MoreOutlined, InfoCircleOutlined, UndoOutlined, CheckCircleOutlined } from '@ant-design/icons'
import './AdminPaymentListPage.css'

const { Paragraph, Text, Title } = Typography

const paymentStatusOptions = mapStatusOptions(adminPaymentTransactionStatusMeta)

export default function AdminPaymentListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminPaymentTransactionStatus | undefined>()
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const [statusForm] = Form.useForm<{ trangThai: AdminPaymentTransactionStatus; ghiChu?: string }>()

  const paymentsQuery = useAdminPayments()
  const paymentDetailQuery = useAdminPayment(selectedPaymentId)
  const updatePaymentStatusMutation = useUpdateAdminPaymentStatus()

  const payments = paymentsQuery.data ?? []

  const filteredPayments = useMemo(() => {
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
  }, [keyword, payments, statusFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [keyword, statusFilter])

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredPayments.slice(start, start + pageSize)
  }, [filteredPayments, currentPage])

  const handleStatusChange = async (payment: AdminPaymentItem, newStatus: AdminPaymentTransactionStatus) => {
    Modal.confirm({
      title: newStatus === 'da_hoan_tien' ? 'Xác nhận hoàn tiền?' : 'Xác nhận giao dịch thành công?',
      content: newStatus === 'da_hoan_tien'
        ? 'Giao dịch này sẽ được đánh dấu là đã hoàn tiền.'
        : 'Giao dịch sẽ được xác nhận là đã thanh toán thành công.',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        await updatePaymentStatusMutation.mutateAsync({
          id: payment.id,
          payload: {
            trangThai: newStatus,
            ghiChu: payment.ghiChu ?? undefined,
          },
        })
      }
    })
  }

  const getPaymentActions = (record: AdminPaymentItem): MenuProps['items'] => {
    const items: MenuProps['items'] = []

    if (record.trangThai === 'thanh_cong') {
      items.push({
        key: 'refund',
        label: 'Hoàn tiền',
        icon: <UndoOutlined />,
        danger: true,
        onClick: () => void handleStatusChange(record, 'da_hoan_tien')
      })
    } else if (record.trangThai === 'dang_xu_ly' || record.trangThai === 'cho_thanh_toan') {
      items.push({
        key: 'confirm',
        label: 'Xác nhận thành công',
        icon: <CheckCircleOutlined />,
        onClick: () => void handleStatusChange(record, 'thanh_cong')
      })
    }

    if (items.length > 0) {
      items.push({ type: 'divider' })
    }

    paymentStatusOptions.forEach((status) => {
      if (status.value !== record.trangThai) {
        items.push({
          key: `set-status-${status.value}`,
          label: `Đổi sang: ${status.label}`,
          onClick: () => void updatePaymentStatusMutation.mutateAsync({
            id: record.id,
            payload: {
              trangThai: status.value as AdminPaymentTransactionStatus,
              ghiChu: record.ghiChu ?? undefined
            }
          })
        })
      }
    })

    return items
  }

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
        <div className="admin-filter-toolbar is-compact" style={{ gridTemplateColumns: 'minmax(0, 1fr) 220px 100px' }}>
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã booking, khách hàng, giao dịch..."
            className="admin-filter-field"
            style={{ height: 40, borderRadius: 8 }}
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={paymentStatusOptions}
            placeholder="Trạng thái giao dịch"
            className="admin-filter-field"
            style={{ height: 40, borderRadius: 8 }}
          />
          <Button 
            className="admin-filter-button" 
            style={{ height: 40, borderRadius: 8 }}
            onClick={() => {
              setKeyword('')
              setStatusFilter(undefined)
            }}
          >
            Xoá bộ lọc
          </Button>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <div className="admin-payment-list-container">
          {paymentsQuery.isLoading ? (
            <Empty description="Đang tải dữ liệu..." />
          ) : filteredPayments.length === 0 ? (
            <Empty description="Chưa có giao dịch thanh toán" />
          ) : (
            paginatedPayments.map((payment) => {
              const typeMeta = adminPaymentTransactionTypeMeta[payment.loaiGiaoDich as keyof typeof adminPaymentTransactionTypeMeta]
              const channelMeta = adminPaymentChannelMeta[payment.kenhThanhToan as keyof typeof adminPaymentChannelMeta]
              const methodMeta = adminPaymentMethodMeta[payment.phuongThucThanhToan as keyof typeof adminPaymentMethodMeta]
              const statusMeta = adminPaymentTransactionStatusMeta[payment.trangThai]

              return (
                <div key={payment.id} className="admin-payment-list-item">
                  <div className="admin-payment-item-main">
                    <h3 className="admin-payment-item-title">{payment.maGiaoDichNoiBo || `#${payment.id}`}</h3>
                    <div className="admin-payment-item-meta">
                      <Text strong>{payment.maBooking}</Text>
                      <span>• {payment.hoTenKhachHang}</span>
                    </div>
                    <div className="admin-payment-item-meta" style={{ fontSize: 12 }}>
                      Ref: {payment.maGiaoDichBenThuBa || 'N/A'}
                    </div>
                  </div>

                  <div className="admin-payment-item-type">
                    <Text type="secondary" style={{ fontSize: 12 }}>Loại giao dịch</Text>
                    <Tag color={typeMeta?.color || 'default'} style={{ margin: 0, width: 'fit-content' }}>
                      {typeMeta?.label || payment.loaiGiaoDich}
                    </Tag>
                  </div>

                  <div className="admin-payment-item-channel">
                    <Text type="secondary" style={{ fontSize: 12 }}>Kênh / Phương thức</Text>
                    <Space size={4}>
                      <Tag color={channelMeta?.color || 'default'} style={{ margin: 0 }}>
                        {channelMeta?.label || payment.kenhThanhToan}
                      </Tag>
                      <Tag color={methodMeta?.color || 'default'} style={{ margin: 0 }}>
                        {methodMeta?.label || payment.phuongThucThanhToan}
                      </Tag>
                    </Space>
                  </div>

                  <div className="admin-payment-item-pricing">
                    <Tag color={statusMeta.color} style={{ margin: 0, fontWeight: 600 }}>
                      {statusMeta.label}
                    </Tag>
                    <div className="admin-payment-item-price">{formatMoney(payment.soTien)}</div>
                    <div className="admin-payment-item-time">{formatDateTime(payment.thoiGianTao)}</div>
                  </div>

                  <div className="admin-payment-item-actions">
                    <Button 
                      icon={<InfoCircleOutlined />}
                      onClick={() => {
                        setSelectedPaymentId(payment.id)
                        statusForm.setFieldsValue({
                          trangThai: payment.trangThai,
                          ghiChu: payment.ghiChu ?? undefined,
                        })
                      }}
                    >
                      Chi tiết
                    </Button>
                    <Dropdown menu={{ items: getPaymentActions(payment) }} trigger={['click']} placement="bottomRight">
                      <Button icon={<MoreOutlined />} />
                    </Dropdown>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {filteredPayments.length > 0 && (
          <div className="admin-payment-list-pagination">
            <Pagination 
              current={currentPage} 
              total={filteredPayments.length} 
              pageSize={pageSize} 
              onChange={(page) => setCurrentPage(page)} 
              showSizeChanger={false}
            />
          </div>
        )}
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
              <Descriptions.Item label="Ghi chú">{selectedPayment.ghiChu || '-'}</Descriptions.Item>
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
