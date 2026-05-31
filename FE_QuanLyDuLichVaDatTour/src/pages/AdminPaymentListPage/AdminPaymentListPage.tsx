import { Alert, Button, Descriptions, Drawer, Empty, Form, Input, Select, Space, Tag, Typography, Modal, Dropdown, Table, Tooltip } from 'antd'
import type { TableProps } from 'antd'
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
import { MoreOutlined, InfoCircleOutlined, UndoOutlined, CheckCircleOutlined, DollarOutlined, ClockCircleOutlined, SearchOutlined, EyeOutlined, CloseCircleOutlined } from '@ant-design/icons'
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

  // Reset form when selecting a new payment
  useEffect(() => {
    if (selectedPaymentId !== undefined && paymentDetailQuery.data) {
      statusForm.resetFields()
      statusForm.setFieldsValue({
        trangThai: paymentDetailQuery.data.trangThai,
        ghiChu: paymentDetailQuery.data.ghiChu ?? undefined,
      })
    }
  }, [selectedPaymentId, paymentDetailQuery.data, statusForm])

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

  const stats = useMemo(() => {
    return {
      total: payments.length,
      success: payments.filter(p => p.trangThai === 'thanh_cong').length,
      pending: payments.filter(p => p.trangThai === 'cho_xu_ly' || p.trangThai === 'khoi_tao').length,
      failed: payments.filter(p => p.trangThai === 'da_hoan_tien' || p.trangThai === 'that_bai').length,
    }
  }, [payments])

  const tableColumns: TableProps<AdminPaymentItem>['columns'] = [
    {
      title: 'Giao dịch',
      key: 'transaction',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text className="payment-text-accent">{record.maGiaoDichNoiBo || `#${record.id}`}</Text>
          <Text className="payment-text-primary">{record.hoTenKhachHang}</Text>
          <Text className="payment-text-secondary">{record.maBooking}</Text>
        </Space>
      )
    },
    {
      title: 'Phân loại',
      key: 'classification',
      render: (_, record) => {
        const typeMeta = adminPaymentTransactionTypeMeta[record.loaiGiaoDich as keyof typeof adminPaymentTransactionTypeMeta]
        const channelMeta = adminPaymentChannelMeta[record.kenhThanhToan as keyof typeof adminPaymentChannelMeta]
        return (
          <Space direction="vertical" size={4}>
            <Tag color={typeMeta?.color || 'default'} style={{ margin: 0 }}>
              {typeMeta?.label || record.loaiGiaoDich}
            </Tag>
            <Space size={4}>
              <Tag color="default" style={{ margin: 0, background: '#f8fafc', border: 'none', color: '#64748b' }}>
                {channelMeta?.label || record.kenhThanhToan}
              </Tag>
              {record.phuongThucThanhToan && (
                <Tag color="default" style={{ margin: 0, background: '#f8fafc', border: 'none', color: '#64748b' }}>
                  {record.phuongThucThanhToan}
                </Tag>
              )}
            </Space>
          </Space>
        )
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'thoiGianTao',
      key: 'time',
      render: (time: string) => <Text className="payment-text-secondary">{formatDateTime(time)}</Text>
    },
    {
      title: 'Số tiền',
      dataIndex: 'soTien',
      key: 'amount',
      align: 'right',
      render: (amount: number) => <Text className="payment-price-text">{formatMoney(amount)}</Text>
    },
    {
      title: 'Trạng thái',
      key: 'status',
      align: 'right',
      render: (_, record) => {
        const statusMeta = adminPaymentTransactionStatusMeta[record.trangThai]
        return (
          <Tag className="payment-status-pill" color={statusMeta.color}>
            {statusMeta.label}
          </Tag>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right',
      width: 100,
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Xem chi tiết">
            <button 
              className="payment-action-btn edit"
              onClick={() => {
                setSelectedPaymentId(record.id)
                statusForm.setFieldsValue({
                  trangThai: record.trangThai,
                  ghiChu: record.ghiChu ?? undefined,
                })
              }}
            >
              <EyeOutlined />
            </button>
          </Tooltip>
          <Dropdown menu={{ items: getPaymentActions(record) }} trigger={['click']} placement="bottomRight">
            <button className="payment-action-btn"><MoreOutlined /></button>
          </Dropdown>
        </Space>
      )
    }
  ]

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
    } else if (record.trangThai === 'cho_xu_ly' || record.trangThai === 'khoi_tao') {
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
        <div className="payment-title-wrapper">
          <div className="payment-header-icon">
            <DollarOutlined />
          </div>
          <div>
            <Title level={1}>Quản lý thanh toán</Title>
            <Paragraph>Giám sát giao dịch đặt cọc, thanh toán còn lại và xử lý trạng thái giao dịch theo thời gian thực.</Paragraph>
          </div>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px' }}>
        <div className="payment-stats-grid">
          <div className="payment-stat-card">
            <div className="stat-icon"><DollarOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng giao dịch</div>
            </div>
          </div>
          <div className="payment-stat-card success-stat">
            <div className="stat-icon"><CheckCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.success}</div>
              <div className="stat-label">Thành công</div>
            </div>
          </div>
          <div className="payment-stat-card pending-stat">
            <div className="stat-icon"><ClockCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Đang chờ</div>
            </div>
          </div>
          <div className="payment-stat-card failed-stat">
            <div className="stat-icon"><CloseCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.failed}</div>
              <div className="stat-label">Hoàn tiền/Lỗi</div>
            </div>
          </div>
        </div>

        <div className="payment-filter-card">
          <div className="payment-filter-toolbar">
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo mã booking, khách hàng, mã giao dịch..."
            />
            <Select
              allowClear
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={paymentStatusOptions}
              placeholder="Trạng thái giao dịch"
            />
            <Button onClick={() => {
              setKeyword('')
              setStatusFilter(undefined)
            }}>
              Xoá bộ lọc
            </Button>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} style={{ marginBottom: 24 }} /> : null}

        <div className="payment-table">
          <Table 
            columns={tableColumns} 
            dataSource={filteredPayments} 
            rowKey="id" 
            pagination={{ 
              pageSize: 8,
              showSizeChanger: false,
            }} 
            loading={paymentsQuery.isLoading}
          />
        </div>
      </div>

      <Drawer
        title={selectedPayment ? `Chi tiết giao dịch ${selectedPayment.maGiaoDichNoiBo || `#${selectedPayment.id}`}` : 'Chi tiết giao dịch'}
        open={selectedPaymentId !== undefined}
        onClose={() => {
          statusForm.resetFields()
          setSelectedPaymentId(undefined)
        }}
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
