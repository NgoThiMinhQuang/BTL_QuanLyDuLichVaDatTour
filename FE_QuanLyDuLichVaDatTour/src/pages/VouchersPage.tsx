import { Alert, Card, Descriptions, Empty, Spin, Table, Tabs, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { layVoucherKhaDung, layLichSuVoucher, type VoucherHistoryItem, type VoucherUserItem } from '../services/voucher/voucher'
import { getBookingDetailPath } from '../constants/paths'
import './VouchersPage.css'

const { Title, Text } = Typography

function formatCurrency(value: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function getVoucherBadge(kieuGiam: string) {
  return kieuGiam === 'phan_tram'
    ? <Tag color="blue">Giảm %</Tag>
    : <Tag color="green">Giảm tiền</Tag>
}

function getDiscountText(item: VoucherUserItem) {
  if (item.kieuGiam === 'phan_tram') {
    let text = `Giảm ${item.giaTriGiam}%`
    if (item.giamToiDa != null && item.giamToiDa > 0) text += ` (tối đa ${formatCurrency(item.giamToiDa)})`
    return text
  }
  return `Giảm ${formatCurrency(item.giaTriGiam)}`
}

export default function VouchersPage() {
  const { data: availableVouchers, isLoading: loadingAvailable, isError: errorAvailable, error: errMsgAvailable, refetch: refetchAvailable } = useQuery({
    queryKey: ['voucher-available'],
    queryFn: layVoucherKhaDung,
  })

  const { data: voucherHistory, isLoading: loadingHistory, isError: errorHistory, error: errMsgHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['voucher-history'],
    queryFn: layLichSuVoucher,
  })

  const historyColumns = [
    { title: 'Mã Booking', dataIndex: 'maBooking', key: 'maBooking', render: (val: string, record: VoucherHistoryItem) => <Link to={getBookingDetailPath(record.bookingId)}>{val}</Link> },
    { title: 'Mã Voucher', dataIndex: 'maVoucher', key: 'maVoucher' },
    { title: 'Tên Voucher', dataIndex: 'tenVoucher', key: 'tenVoucher' },
    { title: 'Loại giảm', dataIndex: 'kieuGiam', key: 'kieuGiam', render: (val: string) => getVoucherBadge(val) },
    { title: 'Giá trị giảm', dataIndex: 'giaTriGiam', key: 'giaTriGiam', render: (val: number) => formatCurrency(val) },
    { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (val: number) => formatCurrency(val) },
    { title: 'Ngày đặt', dataIndex: 'ngayDat', key: 'ngayDat', render: (val: string) => formatDate(val) },
  ]

  return (
    <div className="vouchers-page">
      <Title level={2}>Voucher của tôi</Title>

      <Tabs
        defaultActiveKey="available"
        items={[
          {
            key: 'available',
            label: `Voucher khả dụng${availableVouchers ? ` (${availableVouchers.length})` : ''}`,
            children: (
              loadingAvailable ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
              ) : errorAvailable ? (
                <Alert type="error" message="Lỗi tải voucher" description={(errMsgAvailable as Error)?.message} />
              ) : !availableVouchers || availableVouchers.length === 0 ? (
                <Empty description="Bạn chưa có voucher khả dụng nào." />
              ) : (
                <div className="voucher-card-grid">
                  {availableVouchers.map((v) => (
                    <Card key={v.id} className="voucher-card" title={<span>{v.tenVoucher} {getVoucherBadge(v.kieuGiam)}</span>}>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Mã">{v.maVoucher}</Descriptions.Item>
                        <Descriptions.Item label="Ưu đãi">{getDiscountText(v)}</Descriptions.Item>
                        <Descriptions.Item label="Đơn tối thiểu">{formatCurrency(v.donHangToiThieu)}</Descriptions.Item>
                        <Descriptions.Item label="Hiệu lực">{formatDate(v.ngayBatDau)} - {formatDate(v.ngayKetThuc)}</Descriptions.Item>
                        <Descriptions.Item label="Còn lại">{v.soLuongConLai} lượt</Descriptions.Item>
                        {v.moTa && <Descriptions.Item label="Mô tả">{v.moTa}</Descriptions.Item>}
                      </Descriptions>
                    </Card>
                  ))}
                </div>
              )
            ),
          },
          {
            key: 'history',
            label: `Lịch sử sử dụng${voucherHistory ? ` (${voucherHistory.length})` : ''}`,
            children: (
              loadingHistory ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
              ) : errorHistory ? (
                <Alert type="error" message="Lỗi tải lịch sử" description={(errMsgHistory as Error)?.message} />
              ) : !voucherHistory || voucherHistory.length === 0 ? (
                <Empty description="Bạn chưa sử dụng voucher nào." />
              ) : (
                <Table dataSource={voucherHistory} columns={historyColumns} rowKey={(record) => `${record.id}-${record.bookingId}`} pagination={{ pageSize: 10 }} />
              )
            ),
          },
        ]}
      />
    </div>
  )
}