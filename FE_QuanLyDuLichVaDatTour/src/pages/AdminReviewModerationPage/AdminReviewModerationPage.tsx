import { Alert, Button, DatePicker, Empty, Form, Input, Popconfirm, Rate, Select, Space, Tag, Typography, Table, Tooltip } from 'antd'
import type { TableProps } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState, useEffect } from 'react'
import { useAdminReviews, useUpdateAdminReviewDisplayStatus } from '../../services/admin/admin.hooks'
import type { AdminReviewDisplayStatus, AdminReviewItem } from '../../types/admin'
import { adminReviewStatusMeta, formatDateTime } from '../../utils/admin'
import { CheckCircleOutlined, EyeInvisibleOutlined, MessageOutlined, StarOutlined, ClockCircleOutlined, ExclamationCircleOutlined, SearchOutlined, LineChartOutlined } from '@ant-design/icons'
import './AdminReviewModerationPage.css'

const { Paragraph, Text, Title } = Typography
const { RangePicker } = DatePicker

const statusFilterOptions = [
  { value: 'cho_duyet', label: 'Chờ duyệt' },
  { value: 'hien_thi', label: 'Hiển thị' },
  { value: 'an', label: 'Ẩn' },
]

const starFilterOptions = [
  { value: 5, label: '5 sao' },
  { value: 4, label: '4 sao' },
  { value: 3, label: '3 sao' },
  { value: 2, label: '2 sao' },
  { value: 1, label: '1 sao' },
]

export default function AdminReviewModerationPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [starFilter, setStarFilter] = useState<number | undefined>()
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const [responseForm] = Form.useForm<Record<number, { phanHoiAdmin?: string }>>()

  const reviewsQuery = useAdminReviews()
  const updateReviewStatusMutation = useUpdateAdminReviewDisplayStatus()

  const reviews = reviewsQuery.data ?? []

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [review.hoTenKhachHang, review.tenTour, review.maBooking, review.noiDung].some((value) => value.toLowerCase().includes(normalizedKeyword))

      const matchesStatus = statusFilter === undefined || review.trangThai === statusFilter
      const matchesStars = starFilter === undefined || review.soSao === starFilter

      let matchesDate = true
      if (dateRange && dateRange[0] && dateRange[1]) {
        const reviewDate = dayjs(review.ngayDanhGia)
        matchesDate = reviewDate.isAfter(dateRange[0].subtract(1, 'day')) && reviewDate.isBefore(dateRange[1].add(1, 'day'))
      }

      return matchesKeyword && matchesStatus && matchesStars && matchesDate
    })
  }, [keyword, statusFilter, starFilter, dateRange, reviews])

  useEffect(() => {
    setCurrentPage(1)
  }, [keyword, statusFilter, starFilter, dateRange])

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredReviews.slice(start, start + pageSize)
  }, [filteredReviews, currentPage])

  const handleUpdateStatus = async (review: AdminReviewItem, status: AdminReviewDisplayStatus) => {
    const responseValue = responseForm.getFieldValue([review.id, 'phanHoiAdmin']) as string | undefined
    await updateReviewStatusMutation.mutateAsync({
      id: review.id,
      trangThai: status,
      phanHoiAdmin: responseValue,
    })
  }

  const hasError = reviewsQuery.isError
  const errorMessage = reviewsQuery.error instanceof Error ? reviewsQuery.error.message : 'Không thể tải danh sách review chờ duyệt'

  const stats = useMemo(() => ({
    total: filteredReviews.length,
    visible: filteredReviews.filter(r => r.trangThai === 'hien_thi').length,
    hidden: filteredReviews.filter(r => r.trangThai === 'an').length,
    pending: filteredReviews.filter(r => r.trangThai === 'cho_duyet').length,
  }), [filteredReviews])

  const avgRating = stats.total > 0
    ? (filteredReviews.reduce((sum, review) => sum + review.soSao, 0) / stats.total).toFixed(1)
    : '0.0'

  const tableColumns: TableProps<AdminReviewItem>['columns'] = [
    {
      title: 'Khách hàng & Thời gian',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text className="review-text-primary">{record.hoTenKhachHang}</Text>
          <Text className="review-text-secondary">Booking: {record.maBooking}</Text>
          <Text className="review-text-secondary">{formatDateTime(record.ngayDanhGia)}</Text>
        </Space>
      )
    },
    {
      title: 'Nội dung đánh giá',
      key: 'content',
      render: (_, record) => {
        const isVisible = record.trangThai === 'hien_thi'
        const isHidden = record.trangThai === 'an'
        return (
          <div style={{ position: 'relative' }}>
            {isHidden && (
              <div style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: '#fef2f2',
                color: '#dc2626',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                border: '2px solid #fecaca'
              }}>
                <Tooltip title="Đánh giá đang bị Ẩn">
                  <EyeInvisibleOutlined />
                </Tooltip>
              </div>
            )}
            {isVisible && (
              <div style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: '#f0fdf4',
                color: '#16a34a',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                border: '2px solid #bbf7d0'
              }}>
                <Tooltip title="Đánh giá đang Hiển thị">
                  <CheckCircleOutlined />
                </Tooltip>
              </div>
            )}
            <Space size={8} style={{ marginBottom: 4 }}>
              <Rate disabled value={record.soSao} style={{ fontSize: 14, color: '#f59e0b' }} />
              <Text strong style={{ color: '#334155' }}>{record.tenTour}</Text>
            </Space>
            <div className="review-content-box">
              {record.noiDung}
            </div>
          </div>
        )
      }
    },
    {
      title: 'Phản hồi Admin',
      key: 'reply',
      width: 300,
      render: (_, record) => (
        <Form form={responseForm} component={false}>
          <Form.Item name={[record.id, 'phanHoiAdmin']} initialValue={record.phanHoiAdmin} style={{ marginBottom: 0 }}>
            <Input.TextArea 
              autoSize={{ minRows: 2, maxRows: 4 }} 
              placeholder="Nhập phản hồi..." 
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        </Form>
      )
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      align: 'center',
      render: (_, record) => {
        const statusMeta = adminReviewStatusMeta[record.trangThai]
        return (
          <Tag className="review-status-pill" color={statusMeta.color}>
            {statusMeta.label}
          </Tag>
        )
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space size={8}>
          {record.trangThai !== 'hien_thi' && (
            <Tooltip title="Duyệt">
              <Popconfirm
                title="Duyệt đánh giá này?"
                description="Đánh giá sẽ được hiển thị công khai."
                onConfirm={() => void handleUpdateStatus(record, 'hien_thi')}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button type="primary" shape="circle" icon={<CheckCircleOutlined />} size="small" style={{ background: '#10b981', borderColor: '#10b981' }} />
              </Popconfirm>
            </Tooltip>
          )}
          {record.trangThai !== 'an' && (
            <Tooltip title="Ẩn">
              <Popconfirm
                title="Ẩn đánh giá này?"
                description="Đánh giá sẽ bị ẩn khỏi trang công khai."
                onConfirm={() => void handleUpdateStatus(record, 'an')}
                okText="Ẩn"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger type="primary" shape="circle" icon={<EyeInvisibleOutlined />} size="small" />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      )
    }
  ]

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="review-title-wrapper">
          <div className="review-header-icon">
            <StarOutlined />
          </div>
          <div>
            <Title level={1}>Duyệt đánh giá</Title>
            <Paragraph>Quản trị phản hồi của khách hàng, kiểm soát đánh giá chờ duyệt và phản hồi nhanh cho từng nội dung.</Paragraph>
          </div>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px' }}>
        <div className="review-stats-grid">
          <div className="review-stat-card">
            <div className="stat-icon"><MessageOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng review</div>
            </div>
          </div>
          <div className="review-stat-card pending-stat">
            <div className="stat-icon"><ExclamationCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Chờ duyệt</div>
            </div>
          </div>
          <div className="review-stat-card">
            <div className="stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}><CheckCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.visible}</div>
              <div className="stat-label">Đang hiển thị</div>
            </div>
          </div>
          <div className="review-stat-card">
            <div className="stat-icon" style={{ background: '#fef2f2', color: '#dc2626' }}><EyeInvisibleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.hidden}</div>
              <div className="stat-label">Đang ẩn</div>
            </div>
          </div>
        </div>

        <div className="review-filter-card">
          <div className="admin-filter-toolbar is-compact" style={{ gridTemplateColumns: 'minmax(0, 1fr) 160px 120px 240px 100px', gap: 12, marginBottom: 0 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm khách hàng, booking, tour, nội dung..."
              style={{ height: 44, borderRadius: 12 }}
            />
            <Select
              allowClear
              value={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              options={statusFilterOptions}
              placeholder="Trạng thái"
              style={{ height: 44, borderRadius: 12 }}
            />
            <Select
              allowClear
              value={starFilter}
              onChange={(v) => setStarFilter(v)}
              options={starFilterOptions}
              placeholder="Số sao"
              style={{ height: 44, borderRadius: 12 }}
            />
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
              style={{ height: 44, borderRadius: 12, width: '100%' }}
            />
            <Button 
              style={{ height: 44, borderRadius: 12 }}
              onClick={() => {
                setKeyword('')
                setStatusFilter(undefined)
                setStarFilter(undefined)
                setDateRange(null)
              }}
            >
              Xoá lọc
            </Button>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} style={{ marginBottom: 24 }} /> : null}

        <div className="review-table">
          <Table 
            columns={tableColumns} 
            dataSource={filteredReviews} 
            rowKey="id" 
            pagination={{ 
              pageSize: 5,
              showSizeChanger: false,
            }} 
            loading={reviewsQuery.isLoading}
          />
        </div>
      </div>
    </div>
  )
}
