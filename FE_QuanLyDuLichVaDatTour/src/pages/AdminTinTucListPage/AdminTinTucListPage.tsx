import { Alert, Button, Empty, Form, Image, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useAdminTinTucs, useCreateAdminTinTuc, useUpdateAdminTinTuc, useUpdateAdminTinTucStatus } from '../../services/admin/admin.hooks'
import type { AdminTinTucItem, AdminTinTucStatus } from '../../types/admin'
import { resolveApiAssetUrl } from '../../constants/api'
import { adminTinTucStatusMeta, formatDateTime, mapStatusOptions, toDateTimeLocalValue } from '../../utils/admin'
import './AdminTinTucListPage.css'

const { Paragraph, Text, Title } = Typography

const statusOptions = mapStatusOptions(adminTinTucStatusMeta)

type TinTucFormValues = {
  tieuDe: string
  slug: string
  tomTat?: string
  noiDung: string
  anhDaiDien?: string
  danhMuc?: string
  ngayDang: string
  trangThai: AdminTinTucStatus
}

export default function AdminTinTucListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminTinTucStatus | undefined>()
  const [editingItem, setEditingItem] = useState<AdminTinTucItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm<TinTucFormValues>()

  const tinTucsQuery = useAdminTinTucs()
  const createTinTucMutation = useCreateAdminTinTuc()
  const updateTinTucMutation = useUpdateAdminTinTuc()
  const updateStatusMutation = useUpdateAdminTinTucStatus()

  const filteredItems = useMemo(() => {
    const items = tinTucsQuery.data ?? []
    return items.filter((item) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [item.tieuDe, item.slug, item.tomTat ?? '', item.danhMuc ?? ''].some((value) => value.toLowerCase().includes(normalizedKeyword))
      const matchesStatus = statusFilter === undefined ? true : item.trangThai === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [keyword, statusFilter, tinTucsQuery.data])

  const columns: ColumnsType<AdminTinTucItem> = [
    {
      title: 'Bài viết',
      key: 'article',
      width: 360,
      render: (_, record) => (
        <div className="admin-inline-actions" style={{ alignItems: 'flex-start' }}>
          {record.anhDaiDien ? (
            <Image src={resolveApiAssetUrl(record.anhDaiDien)} width={84} height={64} style={{ objectFit: 'cover', borderRadius: 12 }} preview={false} />
          ) : (
            <div className="admin-details-card" style={{ width: 84, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text className="admin-muted">No image</Text>
            </div>
          )}
          <div className="admin-table-stack">
            <Text strong>{record.tieuDe}</Text>
            <Text className="admin-muted">/{record.slug}</Text>
            <Text className="admin-muted">{record.tomTat || 'Chưa có tóm tắt'}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'danhMuc',
      key: 'danhMuc',
      width: 140,
      render: (value?: string | null) => value || '-',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'ngayDang',
      key: 'ngayDang',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 140,
      render: (value: AdminTinTucStatus) => <Tag color={adminTinTucStatusMeta[value].color}>{adminTinTucStatusMeta[value].label}</Tag>,
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
              tieuDe: record.tieuDe,
              slug: record.slug,
              tomTat: record.tomTat ?? undefined,
              noiDung: record.noiDung,
              anhDaiDien: record.anhDaiDien ?? undefined,
              danhMuc: record.danhMuc ?? undefined,
              ngayDang: toDateTimeLocalValue(record.ngayDang),
              trangThai: record.trangThai,
            })
          }}>
            Chỉnh sửa
          </Button>
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => void updateStatusMutation.mutateAsync({
              id: record.id,
              trangThai: record.trangThai === 'hien_thi' ? 'an' : 'hien_thi',
            })}
          >
            {record.trangThai === 'hien_thi' ? 'Ẩn bài' : 'Hiển thị'}
          </Button>
        </div>
      ),
    },
  ]

  const hasError = tinTucsQuery.isError
  const errorMessage = tinTucsQuery.error instanceof Error ? tinTucsQuery.error.message : 'Không thể tải tin tức quản trị'

  const handleSubmit = async (values: TinTucFormValues) => {
    if (editingItem) {
      await updateTinTucMutation.mutateAsync({
        id: editingItem.id,
        payload: {
          ...values,
          tomTat: values.tomTat ?? null,
          anhDaiDien: values.anhDaiDien ?? null,
          danhMuc: values.danhMuc ?? null,
        },
      })
    } else {
      await createTinTucMutation.mutateAsync({
        ...values,
        tomTat: values.tomTat ?? null,
        anhDaiDien: values.anhDaiDien ?? null,
        danhMuc: values.danhMuc ?? null,
      })
    }

    setModalOpen(false)
    setEditingItem(null)
    form.resetFields()
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý tin tức</Title>
          <Paragraph>Soạn thảo và kiểm soát nội dung truyền thông, bài viết tư vấn và bản tin khuyến mãi cho website du lịch.</Paragraph>
        </div>
        <div className="admin-page-header-actions">
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
              form.setFieldsValue({ trangThai: 'nhap' })
            }}
          >
            + Tạo bài viết
          </Button>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tiêu đề, slug hoặc danh mục..."
            className="admin-filter-field"
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={statusOptions}
            placeholder="Trạng thái"
            className="admin-filter-field"
          />
          <Button className="admin-filter-button" onClick={() => {
            setKeyword('')
            setStatusFilter(undefined)
          }}>
            Xoá bộ lọc
          </Button>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={tinTucsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có bài viết" /> }}
          scroll={{ x: 1400 }}
          className="admin-table"
        />
      </div>

      <Modal
        title={editingItem ? 'Cập nhật bài viết' : 'Tạo bài viết'}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          setEditingItem(null)
          form.resetFields()
        }}
        onOk={() => void form.submit()}
        confirmLoading={createTinTucMutation.isPending || updateTinTucMutation.isPending}
        width={860}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => void handleSubmit(values)}>
          <div className="admin-modal-grid">
            <Form.Item name="tieuDe" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]} className="full-width">
              <Input />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="danhMuc" label="Danh mục">
              <Input />
            </Form.Item>
            <Form.Item name="anhDaiDien" label="Ảnh đại diện (URL hoặc path)" className="full-width">
              <Input />
            </Form.Item>
            <Form.Item name="ngayDang" label="Ngày đăng" rules={[{ required: true, message: 'Vui lòng chọn ngày đăng' }]}>
              <Input type="datetime-local" />
            </Form.Item>
            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="tomTat" label="Tóm tắt" className="full-width">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]} className="full-width">
              <Input.TextArea rows={10} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
