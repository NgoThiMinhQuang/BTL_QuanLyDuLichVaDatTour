import { Alert, Button, Dropdown, Empty, Input, Space, Table, Tabs, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useHideAdminTour, useAdminTours, useUpdateAdminTourStatus } from '../../services/admin/admin.hooks'
import type { AdminTourItem, AdminTourStatus } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import './AdminTourListPage.css'

const { Paragraph, Title, Text } = Typography
const { Search } = Input

const statusMeta: Record<AdminTourStatus, { label: string; color: string }> = {
  nhap: { label: 'Nháp', color: 'default' },
  dang_mo_ban: { label: 'Đang mở bán', color: 'green' },
  tam_ngung: { label: 'Tạm ngưng', color: 'orange' },
  an: { label: 'Đã ẩn', color: 'red' },
  ngung_kinh_doanh: { label: 'Ngừng kinh doanh', color: 'volcano' },
}

const tabs: Array<{ key: 'tat_ca' | AdminTourStatus; label: string }> = [
  { key: 'tat_ca', label: 'Tất cả' },
  { key: 'dang_mo_ban', label: 'Đang mở bán' },
  { key: 'nhap', label: 'Nháp' },
  { key: 'tam_ngung', label: 'Tạm ngưng' },
  { key: 'an', label: 'Đã ẩn' },
  { key: 'ngung_kinh_doanh', label: 'Ngừng kinh doanh' },
]

function matchesSearch(tour: AdminTourItem, keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase()

  if (!normalizedKeyword) {
    return true
  }

  return [tour.maTour, tour.tenTour, tour.tenLoaiTour, tour.tenDiemXuatPhat]
    .some((value) => value.toLowerCase().includes(normalizedKeyword))
}

function getDurationLabel(tour: AdminTourItem) {
  return `${tour.soNgay} ngày ${tour.soDem} đêm`
}

export default function AdminTourListPage() {
  const [keyword, setKeyword] = useState('')
  const [activeTab, setActiveTab] = useState<'tat_ca' | AdminTourStatus>('tat_ca')
  const { data = [], isLoading, isError, error, refetch } = useAdminTours()
  const updateStatusMutation = useUpdateAdminTourStatus()
  const hideTourMutation = useHideAdminTour()

  const filteredTours = useMemo(() => {
    return data.filter((tour) => {
      const matchesTab = activeTab === 'tat_ca' ? true : tour.trangThai === activeTab
      return matchesTab && matchesSearch(tour, keyword)
    })
  }, [activeTab, data, keyword])

  const tabItems = useMemo(() => {
    return tabs.map((tab) => ({
      key: tab.key,
      label: `${tab.label} (${tab.key === 'tat_ca' ? data.length : data.filter((tour) => tour.trangThai === tab.key).length})`,
    }))
  }, [data])

  const columns: ColumnsType<AdminTourItem> = [
    {
      title: 'Mã tour',
      dataIndex: 'maTour',
      key: 'maTour',
      width: 130,
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: 'Tên tour',
      dataIndex: 'tenTour',
      key: 'tenTour',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space size={8} wrap>
            <Text strong>{record.tenTour}</Text>
            {record.isNoiBat ? <Tag color="gold">Nổi bật</Tag> : null}
          </Space>
          <Text type="secondary">Cập nhật: {new Date(record.updatedAt).toLocaleString('vi-VN')}</Text>
        </Space>
      ),
    },
    {
      title: 'Loại tour',
      dataIndex: 'tenLoaiTour',
      key: 'tenLoaiTour',
      width: 180,
    },
    {
      title: 'Xuất phát',
      dataIndex: 'tenDiemXuatPhat',
      key: 'tenDiemXuatPhat',
      width: 160,
    },
    {
      title: 'Thời gian',
      key: 'duration',
      width: 140,
      render: (_, record) => getDurationLabel(record),
    },
    {
      title: 'Giá tham khảo',
      dataIndex: 'giaTuThamKhao',
      key: 'giaTuThamKhao',
      width: 160,
      render: (value: number) => formatMoney(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      render: (value: AdminTourStatus) => <Tag color={statusMeta[value].color}>{statusMeta[value].label}</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space wrap>
          <Dropdown
            menu={{
              items: [
                { key: 'dang_mo_ban', label: 'Chuyển sang Đang mở bán' },
                { key: 'nhap', label: 'Chuyển sang Nháp' },
                { key: 'tam_ngung', label: 'Chuyển sang Tạm ngưng' },
                { key: 'ngung_kinh_doanh', label: 'Chuyển sang Ngừng kinh doanh' },
              ].map((item) => ({
                ...item,
                disabled: item.key === record.trangThai,
                onClick: () => {
                  void updateStatusMutation.mutateAsync({ id: record.id, trangThai: item.key as AdminTourStatus })
                },
              })),
            }}
            trigger={['click']}
          >
            <Button loading={updateStatusMutation.isPending}>Đổi trạng thái</Button>
          </Dropdown>

          <Button danger ghost loading={hideTourMutation.isPending} onClick={() => void hideTourMutation.mutateAsync(record.id)} disabled={record.trangThai === 'an'}>
            Ẩn tour
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="admin-tour-list-page">
      <div className="admin-page-heading">
        <Title level={3}>Quản lý tour</Title>
        <Paragraph className="admin-page-description">
          Theo dõi danh sách tour thật từ hệ thống, lọc nhanh theo trạng thái và cập nhật trạng thái hiển thị trực tiếp.
        </Paragraph>
      </div>

      <Space direction="vertical" size={16} className="admin-tour-list-stack">
        <div className="admin-tour-toolbar">
          <Search
            allowClear
            placeholder="Tìm theo mã tour, tên tour, loại tour hoặc điểm xuất phát"
            onSearch={setKeyword}
            onChange={(event) => setKeyword(event.target.value)}
            value={keyword}
            className="admin-tour-search"
          />
        </div>

        <Tabs items={tabItems} activeKey={activeTab} onChange={(value) => setActiveTab(value as 'tat_ca' | AdminTourStatus)} />

        {isError ? (
          <Alert
            type="error"
            showIcon
            message={error instanceof Error ? error.message : 'Không thể tải danh sách tour quản trị'}
            action={<Button size="small" onClick={() => void refetch()}>Thử lại</Button>}
          />
        ) : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTours}
          loading={isLoading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          locale={{
            emptyText: isLoading ? 'Đang tải dữ liệu...' : <Empty description="Không có tour phù hợp" />,
          }}
          scroll={{ x: 1200 }}
        />
      </Space>
    </div>
  )
}
