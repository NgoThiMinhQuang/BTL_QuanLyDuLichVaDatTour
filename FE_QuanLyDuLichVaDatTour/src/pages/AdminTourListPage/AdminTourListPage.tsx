import { Alert, Button, Empty, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useAdminDiaDiems, useHideAdminTour, useAdminLoaiTours, useAdminTours, useUpdateAdminTourStatus } from '../../services/admin/admin.hooks'
import type { AdminTourItem, AdminTourStatus } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import './AdminTourListPage.css'

const { Paragraph, Title, Text } = Typography

const statusMeta: Record<AdminTourStatus, { label: string; color: string }> = {
  nhap: { label: 'Nháp', color: 'default' },
  dang_mo_ban: { label: 'Đang mở bán', color: 'green' },
  tam_ngung: { label: 'Tạm ngưng', color: 'orange' },
  an: { label: 'Ẩn', color: 'red' },
  ngung_kinh_doanh: { label: 'Ngừng kinh doanh', color: 'volcano' },
}

const statusTabs: Array<{ key: 'tat_ca' | AdminTourStatus; label: string }> = [
  { key: 'tat_ca', label: 'Tất cả' },
  { key: 'nhap', label: 'Nháp' },
  { key: 'dang_mo_ban', label: 'Đang mở bán' },
  { key: 'tam_ngung', label: 'Tạm ngưng' },
  { key: 'an', label: 'Ẩn' },
  { key: 'ngung_kinh_doanh', label: 'Ngừng kinh doanh' },
]

function getDurationLabel(tour: AdminTourItem) {
  return `${tour.soNgay}N${tour.soDem}Đ`
}

export default function AdminTourListPage() {
  const [keyword, setKeyword] = useState('')
  const [activeStatus, setActiveStatus] = useState<'tat_ca' | AdminTourStatus>('tat_ca')
  const [loaiTourFilter, setLoaiTourFilter] = useState<number | undefined>()
  const [diaDiemFilter, setDiaDiemFilter] = useState<number | undefined>()

  const toursQuery = useAdminTours()
  const loaiToursQuery = useAdminLoaiTours()
  const diaDiemsQuery = useAdminDiaDiems()
  const updateStatusMutation = useUpdateAdminTourStatus()
  const hideTourMutation = useHideAdminTour()

  const tours = toursQuery.data ?? []
  const loaiTours = loaiToursQuery.data ?? []
  const diaDiems = diaDiemsQuery.data ?? []

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesKeyword = keyword.trim().length === 0
        ? true
        : [tour.maTour, tour.tenTour, tour.tenLoaiTour, tour.tenDiemXuatPhat, tour.phuongTien ?? '']
            .some((value) => value.toLowerCase().includes(keyword.trim().toLowerCase()))

      const matchesStatus = activeStatus === 'tat_ca' ? true : tour.trangThai === activeStatus
      const matchesLoaiTour = loaiTourFilter === undefined ? true : loaiTours.find((item) => item.id === loaiTourFilter)?.ten === tour.tenLoaiTour
      const matchesDiaDiem = diaDiemFilter === undefined
        ? true
        : diaDiems.find((item) => item.id === diaDiemFilter)?.tenDiaDiem === tour.tenDiemXuatPhat

      return matchesKeyword && matchesStatus && matchesLoaiTour && matchesDiaDiem
    })
  }, [activeStatus, diaDiemFilter, diaDiems, keyword, loaiTourFilter, loaiTours, tours])

  const columns: ColumnsType<AdminTourItem> = [
    { title: 'Mã tour', dataIndex: 'maTour', key: 'maTour', width: 120, render: (value: string) => <Text strong>{value}</Text> },
    { title: 'Tên tour', dataIndex: 'tenTour', key: 'tenTour', width: 260, render: (value: string) => <Text strong>{value}</Text> },
    { title: 'Loại tour', dataIndex: 'tenLoaiTour', key: 'tenLoaiTour', width: 130 },
    { title: 'Điểm xuất phát', dataIndex: 'tenDiemXuatPhat', key: 'tenDiemXuatPhat', width: 130 },
    { title: 'Số ngày/đêm', key: 'duration', width: 110, render: (_, record) => getDurationLabel(record) },
    { title: 'Phương tiện', dataIndex: 'phuongTien', key: 'phuongTien', width: 110, render: (value?: string | null) => value || '-' },
    { title: 'Giá từ', dataIndex: 'giaTuThamKhao', key: 'giaTuThamKhao', width: 140, render: (value: number) => <span className="admin-tour-list-price">{formatMoney(value)}</span> },
    { title: 'Nổi bật', dataIndex: 'isNoiBat', key: 'isNoiBat', width: 110, render: (value: boolean) => value ? <Tag color="gold">Nổi bật</Tag> : '-' },
    { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', width: 150, render: (value: AdminTourStatus) => <Tag color={statusMeta[value].color}>{statusMeta[value].label}</Tag> },
    { title: 'Cập nhật', dataIndex: 'updatedAt', key: 'updatedAt', width: 130, render: (value: string) => new Date(value).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 170,
      render: (_, record) => (
        <Space size={8} className="admin-tour-list-action-stack">
          <Select
            size="small"
            value={record.trangThai}
            onChange={(nextStatus) => void updateStatusMutation.mutateAsync({ id: record.id, trangThai: nextStatus as AdminTourStatus })}
            options={Object.entries(statusMeta).map(([value, meta]) => ({ value, label: meta.label }))}
            className="admin-tour-list-status-select"
          />
          <Button size="small" danger ghost onClick={() => void hideTourMutation.mutateAsync(record.id)} disabled={record.trangThai === 'an'}>
            Ẩn tour
          </Button>
        </Space>
      ),
    },
  ]

  const hasError = toursQuery.isError || loaiToursQuery.isError || diaDiemsQuery.isError
  const errorMessage = toursQuery.error instanceof Error
    ? toursQuery.error.message
    : loaiToursQuery.error instanceof Error
      ? loaiToursQuery.error.message
      : diaDiemsQuery.error instanceof Error
        ? diaDiemsQuery.error.message
        : 'Không thể tải dữ liệu quản lý tour'

  return (
    <div className="admin-tour-list-page">
      <div className="admin-tour-list-header">
        <div>
          <Title level={1}>Quản lý tour</Title>
          <Paragraph>Quản lý danh sách tour du lịch</Paragraph>
        </div>

        <Button type="primary" size="large" className="admin-tour-list-create-button">
          + Tạo tour mới
        </Button>
      </div>

      <div className="admin-tour-list-card">
        <div className="admin-tour-list-toolbar">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm theo tên tour hoặc mã tour..."
            className="admin-tour-list-search"
          />

          <Select
            allowClear
            placeholder="Loại tour"
            value={loaiTourFilter}
            onChange={(value) => setLoaiTourFilter(value)}
            options={loaiTours.map((item) => ({ value: item.id, label: item.ten }))}
            className="admin-tour-list-filter"
          />

          <Select
            allowClear
            placeholder="Điểm xuất phát"
            value={diaDiemFilter}
            onChange={(value) => setDiaDiemFilter(value)}
            options={diaDiems.map((item) => ({ value: item.id, label: item.tenDiaDiem }))}
            className="admin-tour-list-filter"
          />

          <Button className="admin-tour-list-filter-button">Lọc</Button>
        </div>

        <div className="admin-tour-list-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`admin-tour-list-tab ${activeStatus === tab.key ? 'is-active' : ''}`}
              onClick={() => setActiveStatus(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {hasError ? <Alert type="error" showIcon message={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTours}
          loading={toursQuery.isLoading || loaiToursQuery.isLoading || diaDiemsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Không có tour phù hợp" /> }}
          scroll={{ x: 1500 }}
          className="admin-tour-list-table"
        />
      </div>
    </div>
  )
}
