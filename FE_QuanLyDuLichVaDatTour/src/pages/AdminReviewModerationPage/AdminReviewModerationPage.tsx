import { Alert, Button, Card, Empty, Form, Input, Rate, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useAdminPendingReviews, useUpdateAdminReviewDisplayStatus } from '../../services/admin/admin.hooks'
import type { AdminReviewDisplayStatus, AdminReviewItem } from '../../types/admin'
import { adminReviewStatusMeta, formatDateTime } from '../../utils/admin'
import './AdminReviewModerationPage.css'

const { Paragraph, Text, Title } = Typography

export default function AdminReviewModerationPage() {
  const [keyword, setKeyword] = useState('')
  const [responseForm] = Form.useForm<Record<number, { phanHoiAdmin?: string }>>()

  const reviewsQuery = useAdminPendingReviews(100)
  const updateReviewStatusMutation = useUpdateAdminReviewDisplayStatus()

  const filteredReviews = useMemo(() => {
    const reviews = reviewsQuery.data ?? []
    return reviews.filter((review) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      return normalizedKeyword.length === 0
        ? true
        : [review.hoTenKhachHang, review.tenTour, review.maBooking, review.noiDung].some((value) => value.toLowerCase().includes(normalizedKeyword))
    })
  }, [keyword, reviewsQuery.data])

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
              <Button
                type="primary"
                className="admin-primary-button"
                onClick={() => void updateReviewStatusMutation.mutateAsync({
                  id: record.id,
                  trangThai: 'hien_thi',
                  phanHoiAdmin: responseValue,
                })}
              >
                Duyệt hiển thị
              </Button>
              <Button
                danger
                onClick={() => void updateReviewStatusMutation.mutateAsync({
                  id: record.id,
                  trangThai: 'an',
                  phanHoiAdmin: responseValue,
                })}
              >
                Ẩn đánh giá
              </Button>
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
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo khách hàng, booking, tour hoặc nội dung..."
            className="admin-filter-field"
          />
          <Button className="admin-filter-button" onClick={() => setKeyword('')}>
            Xoá tìm kiếm
          </Button>
          <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <div className="admin-details-card">
              <Text className="admin-muted">Review chờ duyệt</Text>
              <Title level={3} style={{ margin: 0 }}>{reviewsQuery.data?.length ?? 0}</Title>
            </div>
            <div className="admin-details-card">
              <Text className="admin-muted">Đánh giá trung bình</Text>
              <Title level={3} style={{ margin: 0 }}>
                {reviewsQuery.data && reviewsQuery.data.length > 0
                  ? (reviewsQuery.data.reduce((sum, review) => sum + review.soSao, 0) / reviewsQuery.data.length).toFixed(1)
                  : '0.0'}
              </Title>
            </div>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon message={errorMessage} /> : null}

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
