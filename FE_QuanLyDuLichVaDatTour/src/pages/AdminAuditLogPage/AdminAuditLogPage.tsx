import { Alert, Button, DatePicker, Empty, Input, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useAdminAuditLog } from '../../services/admin/admin.hooks'
import type { AdminAuditLogItem } from '../../types/admin'
import { formatDateTime } from '../../utils/admin'
import './AdminAuditLogPage.css'

const { Paragraph, Text, Title } = Typography
const { RangePicker } = DatePicker

const actionColors: Record<string, string> = {
  tao_moi: 'green',
  cap_nhat: 'blue',
  an: 'orange',
  xoa: 'red',
  khoi_phuc: 'cyan',
  xac_nhan: 'green',
  huy: 'volcano',
  duyet: 'green',
  tu_choi: 'red',
  mac_dinh: 'default',
}

export default function AdminAuditLogPage() {
  const [keyword, setKeyword] = useState('')
  const [actionFilter, setActionFilter] = useState<string | undefined>()
  const [tableFilter, setTableFilter] = useState<string | undefined>()
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const auditQuery = useAdminAuditLog({
    keyword: keyword || undefined,
    hanhDong: actionFilter,
    bang: tableFilter,
    tuNgay: dateRange?.[0]?.toISOString(),
    denNgay: dateRange?.[1]?.toISOString(),
    page,
    pageSize,
  })

  const columns: ColumnsType<AdminAuditLogItem> = [
    {
      title: 'Thời gian',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      width: 170,
      render: (value) => <Text className="admin-muted">{formatDateTime(value)}</Text>,
    },
    {
      title: 'Người thực hiện',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{record.hoTenNguoiDung || 'Hệ thống'}</Text>
          {record.diaChiIp && <Text className="admin-muted" style={{ fontSize: 12 }}>IP: {record.diaChiIp}</Text>}
        </div>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'hanhDong',
      key: 'hanhDong',
      width: 130,
      render: (value: string) => {
        const color = actionColors[value] ?? 'default'
        const label = value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Bảng',
      dataIndex: 'bang',
      key: 'bang',
      width: 160,
      render: (value) => <Text code>{value}</Text>,
    },
    {
      title: 'Mã bản ghi',
      dataIndex: 'banGhiId',
      key: 'banGhiId',
      width: 120,
      render: (value) => value ? <Text>#{value}</Text> : <Text className="admin-muted">—</Text>,
    },
    {
      title: 'Chi tiết',
      dataIndex: 'chiTiet',
      key: 'chiTiet',
      render: (value) => value ? (
        <Text ellipsis={{ tooltip: value }} style={{ maxWidth: 300 }}>{value}</Text>
      ) : <Text className="admin-muted">—</Text>,
    },
  ]

  const paginationConfig = {
    current: page,
    pageSize,
    total: auditQuery.data?.totalCount ?? 0,
    showSizeChanger: true,
    showTotal: (total: number, range: [number, number]) => `${range[0]}–${range[1]} trong ${total} bản ghi`,
    onChange: (newPage: number, newPageSize: number) => {
      setPage(newPage)
      setPageSize(newPageSize)
    },
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Nhật ký hệ thống</Title>
          <Paragraph>Theo dõi lịch sử thao tác của quản trị viên trên toàn bộ hệ thống.</Paragraph>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
            placeholder="Tìm người dùng, hành động, bảng..."
            className="admin-filter-field"
            allowClear
          />
          <Input
            value={tableFilter}
            onChange={(e) => { setTableFilter(e.target.value || undefined); setPage(1) }}
            placeholder="Tên bảng (Tour, Booking...)"
            className="admin-filter-field"
            allowClear
          />
          <RangePicker
            value={dateRange}
            onChange={(dates) => { setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null); setPage(1) }}
            className="admin-filter-field"
          />
          <Button
            className="admin-filter-button"
            onClick={() => { setKeyword(''); setActionFilter(undefined); setTableFilter(undefined); setDateRange(null); setPage(1) }}
          >
            Xóa bộ lọc
          </Button>
        </div>

        {auditQuery.isError && (
          <Alert type="error" showIcon title={auditQuery.error instanceof Error ? auditQuery.error.message : 'Lỗi tải dữ liệu'} />
        )}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={auditQuery.data?.items ?? []}
          loading={auditQuery.isLoading}
          pagination={paginationConfig}
          locale={{ emptyText: <Empty description="Chưa có nhật ký nào" /> }}
          scroll={{ x: 1100 }}
          className="admin-table"
        />
      </div>
    </div>
  )
}

