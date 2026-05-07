import { Alert, Button, Card, DatePicker, Empty, Form, Input, Popconfirm, Rate, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useAdminPendingReviews, useUpdateAdminReviewDisplayStatus } from '../../services/admin/admin.hooks'
import type { AdminReviewDisplayStatus, AdminReviewItem } from '../../types/admin'
import { adminReviewStatusMeta, formatDateTime } from '../../utils/admin'
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
  const [responseForm] = Form.useForm<Record<number, { phanHoiAdmin?: string }>>()

  const reviewsQuery = useAdminPendingReviews(100)
  const updateReviewStatusMutation = useUpdateAdminReviewDisplayStatus()

  const filteredReviews = useMemo(() => {
    const reviews = reviewsQuery.data ?? []
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
  }, [keyword, statusFilter, starFilter, dateRange, reviewsQuery.data])

  const columns: ColumnsType<AdminReviewItem> = [
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 220,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.hoTenKhachHang}</Text>
          <Text className="admin-muted">Booking {record.maBooking}</Text>
          <Text className="admin-muted">{formatDateTime(record.ngayDanhGia)}</Text>
        </div>
      ),
    },
    {
      title: 'Tour',
      dataIndex: 'tenTour',
      key: 'tenTour',
      width: 220,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      width: 360,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Rate disabled value={record.soSao} />
          <Text>{record.noiDung}</Text>
          {record.phanHoiAdmin ? <Text className="admin-muted">Phản hồi: {record.phanHoiAdmin}</Text> : null}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 140,
      render: (value: AdminReviewDisplayStatus) => <Tag color={adminReviewStatusMeta[value].color}>{adminReviewStatusMeta[value].label}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 320,
      fixed: 'right',
      render: (_, record) => {
        const responseValue = responseForm.getFieldValue([record.id, 'phanHoiAdmin']) as string | undefined

        return (
          <Space orientation="vertical" size={10} style={{ width: '100%' }}>
            <Form form={responseForm} component={false}>
              <Form.Item name={[record.id, 'phanHoiAdmin']} style={{ marginBottom: 0 }}>
                <Input.TextArea rows={3} placeholder="Phản hồi ngắn cho đánh giá này (không bắt buộc)" />
              </Form.Item>
            </Form>
            <div className="admin-inline-actions">
              <Popconfirm
                title="Duyệt đánh giá?"
                description="Đánh giá sẽ được hiển thị công khai trên trang tour."
                onConfirm={() => void updateReviewStatusMutation.mutateAsync({
                  id: record.id,
                  trangThai: 'hien_thi',
                  phanHoiAdmin: responseValue,
                })}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button type="primary" className="admin-primary-button">
                  Duyệt hiển thị
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Ẩn đánh giá?"
                description="Đánh giá sẽ bị ẩn khỏi trang công khai. Bạn có thể hiển thị lại sau."
                onConfirm={() => void updateReviewStatusMutation.mutateAsync({
                  id: record.id,
                  trangThai: 'an',
                  phanHoiAdmin: responseValue,
                })}
                okText="Ẩn"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Button danger>Ẩn đánh giá</Button>
              </Popconfirm>
            </div>
          </Space>
        )
      },
    },
  ]

  const hasError = reviewsQuery.isError
  const errorMessage = reviewsQuery.error instanceof Error ? reviewsQuery.error.message : 'Không thể tải danh sách review chờ duyệt'

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Duyệt đánh giá</Title>
          <Paragraph>Quản trị phản hồi của khách hàng, kiểm soát đánh giá chờ duyệt và phản hồi nhanh cho từng nội dung.</Paragraph>
        </div>
      </div>

      <Card className="admin-page-card" bordered={false}>
        <div className="admin-filter-toolbar is-compact" style={{ gridTemplateColumns: '1fr 180px 120px 200px 100px', gap: 12 }}>
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo khách hàng, booking, tour hoặc nội dung..."
            className="admin-filter-field"
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            options={statusFilterOptions}
            placeholder="Trạng thái"
            className="admin-filter-field"
          />
          <Select
            allowClear
            value={starFilter}
            onChange={(v) => setStarFilter(v)}
            options={starFilterOptions}
            placeholder="Số sao"
            className="admin-filter-field"
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
            className="admin-filter-field"
            style={{ width: '100%' }}
          />
          <Button className="admin-filter-button" onClick={() => {
            setKeyword('')
            setStatusFilter(undefined)
            setStarFilter(undefined)
            setDateRange(null)
          }}>
            Xoá lọc
          </Button>
        </div>

        <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginBottom: 16, marginTop: 16 }}>
          <div className="admin-details-card">
            <Text className="admin-muted">Tổng review</Text>
            <Title level={3} style={{ margin: 0 }}>{filteredReviews.length}</Title>
          </div>
          <div className="admin-details-card">
            <Text className="admin-muted">Review chờ duyệt</Text>
            <Title level={3} style={{ margin: 0 }}>{filteredReviews.filter((r) => r.trangThai === 'cho_duyet').length}</Title>
          </div>
          <div className="admin-details-card">
            <Text className="admin-muted">Đánh giá trung bình</Text>
            <Title level={3} style={{ margin: 0 }}>
              {filteredReviews.length > 0
                ? (filteredReviews.reduce((sum, review) => sum + review.soSao, 0) / filteredReviews.length).toFixed(1)
                : '0.0'}
            </Title>
          </div>
          <div className="admin-details-card">
            <Text className="admin-muted">5 sao</Text>
            <Title level={3} style={{ margin: 0 }}>{filteredReviews.filter((r) => r.soSao === 5).length}</Title>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredReviews}
          loading={reviewsQuery.isLoading || updateReviewStatusMutation.isPending}
          pagination={{ pageSize: 6, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Không có đánh giá chờ duyệt" /> }}
          scroll={{ x: 1400 }}
          className="admin-table"
        />
      </Card>
    </div>
  )
}
