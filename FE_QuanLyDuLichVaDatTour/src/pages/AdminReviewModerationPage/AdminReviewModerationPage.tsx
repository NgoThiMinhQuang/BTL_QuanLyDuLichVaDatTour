import { Alert, Button, DatePicker, Empty, Form, Input, Popconfirm, Rate, Select, Space, Tag, Typography, Pagination } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState, useEffect } from 'react'
import { useAdminPendingReviews, useUpdateAdminReviewDisplayStatus } from '../../services/admin/admin.hooks'
import type { AdminReviewDisplayStatus, AdminReviewItem } from '../../types/admin'
import { adminReviewStatusMeta, formatDateTime } from '../../utils/admin'
import { CheckCircleOutlined, EyeInvisibleOutlined, MessageOutlined } from '@ant-design/icons'
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

  const reviewsQuery = useAdminPendingReviews(100)
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

  const avgRating = filteredReviews.length > 0
    ? (filteredReviews.reduce((sum, review) => sum + review.soSao, 0) / filteredReviews.length).toFixed(1)
    : '0.0'

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Duyệt đánh giá</Title>
          <Paragraph>Quản trị phản hồi của khách hàng, kiểm soát đánh giá chờ duyệt và phản hồi nhanh cho từng nội dung.</Paragraph>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact" style={{ gridTemplateColumns: 'minmax(0, 1fr) 160px 120px 240px 100px', gap: 12 }}>
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm khách hàng, booking, tour, nội dung..."
            className="admin-filter-field"
            style={{ height: 40, borderRadius: 8 }}
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            options={statusFilterOptions}
            placeholder="Trạng thái"
            className="admin-filter-field"
            style={{ height: 40, borderRadius: 8 }}
          />
          <Select
            allowClear
            value={starFilter}
            onChange={(v) => setStarFilter(v)}
            options={starFilterOptions}
            placeholder="Số sao"
            className="admin-filter-field"
            style={{ height: 40, borderRadius: 8 }}
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
            className="admin-filter-field"
            style={{ height: 40, borderRadius: 8, width: '100%' }}
          />
          <Button 
            className="admin-filter-button" 
            style={{ height: 40, borderRadius: 8 }}
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

        <div className="admin-review-kpi-grid">
          <div className="admin-review-kpi-card">
            <span className="admin-review-kpi-label">Tổng review</span>
            <span className="admin-review-kpi-value">{filteredReviews.length}</span>
          </div>
          <div className="admin-review-kpi-card">
            <span className="admin-review-kpi-label">Review chờ duyệt</span>
            <span className="admin-review-kpi-value">{filteredReviews.filter((r) => r.trangThai === 'cho_duyet').length}</span>
          </div>
          <div className="admin-review-kpi-card">
            <span className="admin-review-kpi-label">Đánh giá trung bình</span>
            <span className="admin-review-kpi-value">{avgRating}</span>
          </div>
          <div className="admin-review-kpi-card">
            <span className="admin-review-kpi-label">5 sao</span>
            <span className="admin-review-kpi-value">{filteredReviews.filter((r) => r.soSao === 5).length}</span>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} style={{ marginBottom: 20 }} /> : null}

        <div className="admin-review-list-container">
          {reviewsQuery.isLoading ? (
            <Empty description="Đang tải dữ liệu..." />
          ) : filteredReviews.length === 0 ? (
            <Empty description="Không có đánh giá phù hợp" />
          ) : (
            paginatedReviews.map((review) => {
              const statusMeta = adminReviewStatusMeta[review.trangThai]
              
              return (
                <div key={review.id} className="admin-review-list-item">
                  <div className="admin-review-item-header">
                    <div className="admin-review-item-customer">
                      <span className="admin-review-item-name">{review.hoTenKhachHang}</span>
                      <span className="admin-review-item-meta">Booking: {review.maBooking} • {formatDateTime(review.ngayDanhGia)}</span>
                    </div>
                    <Space>
                      <Rate disabled value={review.soSao} style={{ fontSize: 16 }} />
                      <Tag color={statusMeta.color} style={{ margin: 0, fontWeight: 600 }}>{statusMeta.label}</Tag>
                    </Space>
                  </div>

                  <div className="admin-review-item-content-wrap">
                    <div className="admin-review-item-tour-tag">Tour: {review.tenTour}</div>
                    <div className="admin-review-item-text">
                      {review.noiDung}
                      {review.phanHoiAdmin && (
                        <div className="admin-review-item-reply">
                          <MessageOutlined style={{ marginRight: 8 }} />
                          Phản hồi của Admin: {review.phanHoiAdmin}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-review-item-footer">
                    <Form form={responseForm} component={false} className="admin-review-reply-input">
                      <Form.Item name={[review.id, 'phanHoiAdmin']} style={{ marginBottom: 0 }}>
                        <Input.TextArea 
                          autoSize={{ minRows: 1, maxRows: 4 }} 
                          placeholder="Viết phản hồi cho khách hàng tại đây..." 
                          style={{ borderRadius: 8 }}
                        />
                      </Form.Item>
                    </Form>
                    <div className="admin-review-item-actions">
                      <Popconfirm
                        title="Duyệt đánh giá này?"
                        onConfirm={() => void handleUpdateStatus(review, 'hien_thi')}
                        okText="Duyệt"
                        cancelText="Hủy"
                      >
                        <Button type="primary" icon={<CheckCircleOutlined />} loading={updateReviewStatusMutation.isPending}>
                          Duyệt hiển thị
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title="Ẩn đánh giá này?"
                        onConfirm={() => void handleUpdateStatus(review, 'an')}
                        okText="Ẩn"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger icon={<EyeInvisibleOutlined />} loading={updateReviewStatusMutation.isPending}>
                          Ẩn
                        </Button>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {filteredReviews.length > 0 && (
          <div className="admin-review-list-pagination">
            <Pagination 
              current={currentPage} 
              total={filteredReviews.length} 
              pageSize={pageSize} 
              onChange={(page) => setCurrentPage(page)} 
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
