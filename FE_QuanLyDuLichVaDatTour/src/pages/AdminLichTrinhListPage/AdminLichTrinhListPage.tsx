import { Alert, Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  useAdminDiaDiems,
  useAdminLichTrinhs,
  useAdminTours,
  useCreateAdminLichTrinh,
  useDeleteAdminLichTrinh,
  useUpdateAdminLichTrinh,
} from '../../services/admin/admin.hooks'
import type { AdminLichTrinhItem } from '../../types/admin'
import { formatDateTime, toTimeInputValue } from '../../utils/admin'
import './AdminLichTrinhListPage.css'

const { Paragraph, Text, Title } = Typography

type LichTrinhFormValues = {
  tourId: number
  ngayThu: number
  thuTuTrongNgay: number
  gioBatDau?: string
  gioKetThuc?: string
  tieuDe?: string
  noiDung?: string
  diaDiemId?: number
}

export default function AdminLichTrinhListPage() {
  const [keyword, setKeyword] = useState('')
  const [selectedTourId, setSelectedTourId] = useState<number | undefined>()
  const [editingItem, setEditingItem] = useState<AdminLichTrinhItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<LichTrinhFormValues>()

  const lichTrinhsQuery = useAdminLichTrinhs()
  const toursQuery = useAdminTours()
  const diaDiemsQuery = useAdminDiaDiems()
  const createMutation = useCreateAdminLichTrinh()
  const updateMutation = useUpdateAdminLichTrinh()
  const deleteMutation = useDeleteAdminLichTrinh()

  const filteredItems = useMemo(() => {
    const items = lichTrinhsQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.tenTour, item.tieuDe ?? '', item.noiDung ?? '', item.tenDiaDiem ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesTour = selectedTourId === undefined ? true : item.tourId === selectedTourId
      return matchesKeyword && matchesTour
    })
  }, [keyword, lichTrinhsQuery.data, selectedTourId])

  const columns: ColumnsType<AdminLichTrinhItem> = [
    {
      title: 'Tour',
      key: 'tour',
      width: 220,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.tenTour}</Text>
          <Text className="admin-muted">Ngày {record.ngayThu} • Thứ tự {record.thuTuTrongNgay}</Text>
        </div>
      ),
    },
    {
      title: 'Nội dung',
      key: 'content',
      width: 340,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.tieuDe || 'Chưa có tiêu đề'}</Text>
          <Text>{record.noiDung || 'Chưa có mô tả lịch trình'}</Text>
          <Text className="admin-muted">{record.tenDiaDiem || 'Chưa gắn địa điểm'}</Text>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 170,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{record.gioBatDau?.slice(0, 5) || '--:--'} - {record.gioKetThuc?.slice(0, 5) || '--:--'}</Text>
          <Text className="admin-muted">Cập nhật {formatDateTime(record.updatedAt)}</Text>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 240,
      render: (_, record) => (
        <div className="admin-inline-actions">
          <Button onClick={() => {
            setEditingItem(record)
            setModalOpen(true)
            form.setFieldsValue({
              tourId: record.tourId,
              ngayThu: record.ngayThu,
              thuTuTrongNgay: record.thuTuTrongNgay,
              gioBatDau: toTimeInputValue(record.gioBatDau),
              gioKetThuc: toTimeInputValue(record.gioKetThuc),
              tieuDe: record.tieuDe ?? undefined,
              noiDung: record.noiDung ?? undefined,
              diaDiemId: record.diaDiemId ?? undefined,
            })
          }}>
            Chỉnh sửa
          </Button>
          <Popconfirm
            title="Xoá lịch trình này?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => void deleteMutation.mutateAsync({ id: record.id, tourId: record.tourId })}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  const hasError = lichTrinhsQuery.isError || toursQuery.isError || diaDiemsQuery.isError
  const errorMessage = lichTrinhsQuery.error instanceof Error
    ? lichTrinhsQuery.error.message
    : toursQuery.error instanceof Error
      ? toursQuery.error.message
      : diaDiemsQuery.error instanceof Error
        ? diaDiemsQuery.error.message
        : 'Không thể tải lịch trình quản trị'

  const handleSubmit = async (values: LichTrinhFormValues) => {
    const payload = {
      ...values,
      gioBatDau: values.gioBatDau ? `${values.gioBatDau}:00` : null,
      gioKetThuc: values.gioKetThuc ? `${values.gioKetThuc}:00` : null,
      tieuDe: values.tieuDe ?? null,
      noiDung: values.noiDung ?? null,
      diaDiemId: values.diaDiemId ?? null,
    }

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem.id, payload })
    } else {
      await createMutation.mutateAsync(payload)
    }

    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý lịch trình</Title>
          <Paragraph>Thiết kế hành trình chi tiết cho từng tour theo ngày, khung giờ và địa điểm thực hiện.</Paragraph>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({ ngayThu: 1, thuTuTrongNgay: 1, tourId: selectedTourId })
            }}
          >
            + Thêm lịch trình
          </Button>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tour, tiêu đề, nội dung hoặc địa điểm..."
            className="admin-filter-field"
          />
          <Select
            allowClear
            value={selectedTourId}
            onChange={(value) => setSelectedTourId(value)}
            options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))}
            placeholder="Lọc theo tour"
            className="admin-filter-field"
          />
          <Button className="admin-filter-button" onClick={() => {
            setKeyword('')
            setSelectedTourId(undefined)
          }}>
            Xoá bộ lọc
          </Button>
        </div>

        {hasError ? <Alert type="error" showIcon message={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={lichTrinhsQuery.isLoading || toursQuery.isLoading || diaDiemsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có lịch trình" /> }}
          scroll={{ x: 1250 }}
          className="admin-table"
        />
      </div>

      <Modal
        title={editingItem ? 'Cập nhật lịch trình' : 'Thêm lịch trình'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={760}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <div className="admin-modal-grid">
            <Form.Item name="tourId" label="Tour" rules={[{ required: true, message: 'Vui lòng chọn tour' }]} className="full-width">
              <Select options={(toursQuery.data ?? []).map((tour) => ({ value: tour.id, label: `${tour.maTour} • ${tour.tenTour}` }))} />
            </Form.Item>
            <Form.Item name="ngayThu" label="Ngày thứ" rules={[{ required: true, message: 'Vui lòng nhập ngày thứ' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="thuTuTrongNgay" label="Thứ tự trong ngày" rules={[{ required: true, message: 'Vui lòng nhập thứ tự trong ngày' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="gioBatDau" label="Giờ bắt đầu">
              <Input type="time" />
            </Form.Item>
            <Form.Item name="gioKetThuc" label="Giờ kết thúc">
              <Input type="time" />
            </Form.Item>
            <Form.Item name="diaDiemId" label="Địa điểm" className="full-width">
              <Select allowClear options={(diaDiemsQuery.data ?? []).map((item) => ({ value: item.id, label: `${item.tenDiaDiem} • ${item.quocGia}` }))} />
            </Form.Item>
            <Form.Item name="tieuDe" label="Tiêu đề" className="full-width">
              <Input />
            </Form.Item>
            <Form.Item name="noiDung" label="Nội dung" className="full-width">
              <Input.TextArea rows={5} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
