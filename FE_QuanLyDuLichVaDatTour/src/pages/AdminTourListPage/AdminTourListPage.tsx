import { Alert, Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag, Typography, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import {
  useAdminDiaDiems,
  useAdminLoaiTours,
  useAdminTours,
  useCreateAdminTour,
  useHideAdminTour,
  useUpdateAdminTour,
  useUpdateAdminTourStatus,
} from '../../services/admin/admin.hooks'
import type { AdminTourItem, AdminTourStatus } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import { adminTourStatusMeta, formatDateTime, mapStatusOptions } from '../../utils/admin'
import './AdminTourListPage.css'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined,
  StarFilled,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Paragraph, Title, Text } = Typography

interface TourImageItem {
  url: string
  moTa?: string
  isAvatar: boolean
}

const statusTabs: Array<{ key: 'tat_ca' | AdminTourStatus; label: string }> = [
  { key: 'tat_ca', label: 'Tất cả' },
  { key: 'nhap', label: 'Nháp' },
  { key: 'dang_mo_ban', label: 'Đang mở bán' },
  { key: 'tam_ngung', label: 'Tạm ngưng' },
  { key: 'an', label: 'Ẩn' },
  { key: 'ngung_kinh_doanh', label: 'Ngừng kinh doanh' },
]

const statusOptions = mapStatusOptions(adminTourStatusMeta)

function getDurationLabel(tour: AdminTourItem) {
  return `${tour.soNgay}N${tour.soDem}Đ`
}

export default function AdminTourListPage() {
  const [keyword, setKeyword] = useState('')
  const [activeStatus, setActiveStatus] = useState<'tat_ca' | AdminTourStatus>('tat_ca')
  const [loaiTourFilter, setLoaiTourFilter] = useState<number | undefined>()
  const [diaDiemFilter, setDiaDiemFilter] = useState<number | undefined>()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<AdminTourItem | null>(null)
  const [form] = Form.useForm()
  const [imageInput, setImageInput] = useState('')
  const [images, setImages] = useState<TourImageItem[]>([])
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null)
  const [imageDescInput, setImageDescInput] = useState('')
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const toursQuery = useAdminTours()
  const loaiToursQuery = useAdminLoaiTours()
  const diaDiemsQuery = useAdminDiaDiems()
  const updateStatusMutation = useUpdateAdminTourStatus()
  const hideTourMutation = useHideAdminTour()
  const createTourMutation = useCreateAdminTour()
  const updateTourMutation = useUpdateAdminTour()

  const tours = toursQuery.data ?? []
  const loaiTours = loaiToursQuery.data ?? []
  const diaDiems = diaDiemsQuery.data ?? []

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesKeyword = keyword.trim().length === 0
        ? true
        : [tour.maTour, tour.tenTour, tour.tenLoaiTour, tour.tenDiemXuatPhat, tour.phuongTien ?? '', ...(tour.diemDens ?? []).map((item) => item.tenDiaDiem)]
            .some((value) => value.toLowerCase().includes(keyword.trim().toLowerCase()))

      const matchesStatus = activeStatus === 'tat_ca' ? true : tour.trangThai === activeStatus
      const matchesLoaiTour = loaiTourFilter === undefined ? true : tour.loaiTourId === loaiTourFilter
      const matchesDiaDiem = diaDiemFilter === undefined ? true : tour.diemXuatPhatId === diaDiemFilter

      return matchesKeyword && matchesStatus && matchesLoaiTour && matchesDiaDiem
    })
  }, [activeStatus, diaDiemFilter, keyword, loaiTourFilter, tours])

  const handleOpenModal = (tour?: AdminTourItem) => {
    if (tour) {
      setEditingTour(tour)
      const existingImages: TourImageItem[] = (tour.anhTours ?? []).map((a) => ({
        url: a.linkAnh,
        moTa: a.moTa,
        isAvatar: a.isAvatar,
      }))
      setImages(existingImages)
      form.setFieldsValue({
        maTour: tour.maTour,
        tenTour: tour.tenTour,
        loaiTourId: tour.loaiTourId,
        diemXuatPhatId: tour.diemXuatPhatId,
        soNgay: tour.soNgay,
        soDem: tour.soDem,
        phuongTien: tour.phuongTien,
        giaTuThamKhao: tour.giaTuThamKhao,
        moTaNgan: tour.moTaNgan,
        moTaChiTiet: tour.moTaChiTiet,
        dieuKienTour: tour.dieuKienTour,
        isNoiBat: tour.isNoiBat,
        trangThai: tour.trangThai,
        diemDenIds: tour.diemDens.map((d) => d.diaDiemId),
      })
    } else {
      setEditingTour(null)
      setImages([])
      form.setFieldsValue({
        trangThai: 'nhap',
        isNoiBat: false,
        soNgay: 1,
        soDem: 0,
        giaTuThamKhao: 0,
      })
    }
    setImageInput('')
    setModalOpen(true)
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      const newImage: TourImageItem = {
        url: imageInput.trim(),
        isAvatar: images.length === 0,
      }
      setImages([...images, newImage])
      setImageInput('')
      void message.success('Đã thêm ảnh')
    }
  }

  const handleRemoveImage = (index: number) => {
    const removed = images[index]
    const newImages = images.filter((_, i) => i !== index)
    if (removed.isAvatar && newImages.length > 0) {
      newImages[0].isAvatar = true
    }
    setImages(newImages)
    void message.success('Đã xóa ảnh')
  }

  const handleMoveImageUp = (index: number) => {
    if (index > 0) {
      const newImages = [...images]
      ;[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
      setImages(newImages)
    }
  }

  const handleMoveImageDown = (index: number) => {
    if (index < images.length - 1) {
      const newImages = [...images]
      ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
      setImages(newImages)
    }
  }

  const handleSetAvatar = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isAvatar: i === index,
    }))
    setImages(newImages)
    void message.success('Đã đặt ảnh đại diện')
  }

  const handleOpenImageEdit = (index: number) => {
    setEditingImageIndex(index)
    setImageDescInput(images[index].moTa || '')
    setImageModalOpen(true)
  }

  const handleSaveImageEdit = () => {
    if (editingImageIndex !== null) {
      const newImages = [...images]
      newImages[editingImageIndex] = {
        ...newImages[editingImageIndex],
        moTa: imageDescInput.trim() || undefined,
      }
      setImages(newImages)
    }
    setImageModalOpen(false)
    setEditingImageIndex(null)
    setImageDescInput('')
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        anhTours: images.length > 0 ? images.map((img) => img.url) : undefined,
      }

      if (editingTour) {
        await updateTourMutation.mutateAsync({ id: editingTour.id, payload })
      } else {
        await createTourMutation.mutateAsync(payload)
      }

      setModalOpen(false)
      setEditingTour(null)
      form.resetFields()
      setImages([])
      void message.success(editingTour ? 'Cập nhật tour thành công' : 'Tạo tour thành công')
    } catch { /* form validation error handled by antd */ }
  }

  const columns: ColumnsType<AdminTourItem> = [
    {
      title: 'Tour',
      key: 'tour',
      width: 300,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.tenTour}</Text>
          <Text className="admin-muted">{record.maTour} • {record.tenLoaiTour}</Text>
          <Text className="admin-muted">Điểm đi: {record.tenDiemXuatPhat}</Text>
        </div>
      ),
    },
    {
      title: 'Hành trình',
      key: 'itinerary',
      width: 280,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{getDurationLabel(record)} • {record.phuongTien || 'Chưa có phương tiện'}</Text>
          <Text className="admin-muted">Điểm đến: {record.diemDens.length > 0 ? record.diemDens.map((item) => item.tenDiaDiem).join(', ') : 'Chưa có'}</Text>
        </div>
      ),
    },
    {
      title: 'Giá & nổi bật',
      key: 'pricing',
      width: 160,
      render: (_, record) => (
        <div className="admin-table-stack">
          <span className="admin-tour-list-price">{formatMoney(record.giaTuThamKhao)}</span>
          {record.isNoiBat ? <Tag color="gold">Nổi bật</Tag> : <Text className="admin-muted">Tour thường</Text>}
        </div>
      ),
    },
    {
      title: 'Ảnh',
      key: 'images',
      width: 80,
      align: 'center',
      render: (_, record) => (
        record.anhTours && record.anhTours.length > 0
          ? <Tag color="blue">{record.anhTours.length} ảnh</Tag>
          : <Text className="admin-muted">—</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 140,
      render: (value: AdminTourStatus) => <Tag color={adminTourStatusMeta[value].color}>{adminTourStatusMeta[value].label}</Tag>,
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 160,
      render: (value: string) => <Text className="admin-muted">{formatDateTime(value)}</Text>,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 260,
      fixed: 'right',
      render: (_, record) => (
        <Space size={8} className="admin-tour-list-action-stack">
          <Button size="small" onClick={() => void handleOpenModal(record)}>Sửa</Button>
          <Select
            size="small"
            value={record.trangThai}
            onChange={(nextStatus) => void updateStatusMutation.mutateAsync({ id: record.id, trangThai: nextStatus as AdminTourStatus })}
            options={statusOptions}
            className="admin-tour-list-status-select"
          />
          {record.trangThai === 'an' ? (
            <Popconfirm
              title="Khôi phục tour?"
              description="Tour sẽ trở về trạng thái nháp và có thể được mở bán lại."
              onConfirm={() => void updateStatusMutation.mutateAsync({ id: record.id, trangThai: 'nhap' })}
              okText="Khôi phục"
              cancelText="Hủy"
            >
              <Button size="small">Khôi phục</Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Ẩn tour?"
              description="Tour sẽ không hiển thị với khách hàng. Bạn có thể khôi phục sau."
              onConfirm={() => void hideTourMutation.mutateAsync(record.id)}
              okText="Ẩn tour"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button size="small" danger ghost>Ẩn tour</Button>
            </Popconfirm>
          )}
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

  const isSubmitting = createTourMutation.isPending || updateTourMutation.isPending

  return (
    <div className="admin-tour-list-page">
      <div className="admin-tour-list-header">
        <div>
          <Title level={1}>Quản lý tour</Title>
          <Paragraph>Điều phối danh mục tour, tình trạng mở bán, tuyến điểm và các thông tin hiển thị ra khách hàng.</Paragraph>
        </div>

        <Button type="primary" size="large" className="admin-tour-list-create-button" onClick={() => void handleOpenModal()}>
          + Tạo tour mới
        </Button>
      </div>

      <div className="admin-tour-list-card">
        <div className="admin-tour-list-toolbar">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tên tour, mã tour, loại tour hoặc điểm đến..."
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

          <Button className="admin-tour-list-filter-button" onClick={() => {
            setKeyword('')
            setLoaiTourFilter(undefined)
            setDiaDiemFilter(undefined)
            setActiveStatus('tat_ca')
          }}>
            Xoá lọc
          </Button>
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

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredTours}
          loading={toursQuery.isLoading || loaiToursQuery.isLoading || diaDiemsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Không có tour phù hợp" /> }}
          scroll={{ x: 1680 }}
          className="admin-tour-list-table"
        />
      </div>

      <Modal
        title={editingTour ? 'Cập nhật tour' : 'Tạo tour mới'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingTour(null); form.resetFields(); setImages([]) }}
        onOk={() => void handleSubmit()}
        confirmLoading={isSubmitting}
        width={780}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="admin-tour-form">
          <div className="admin-modal-grid">
            <Form.Item name="maTour" label="Mã tour" rules={[{ required: true, message: 'Vui lòng nhập mã tour' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="tenTour" label="Tên tour" rules={[{ required: true, message: 'Vui lòng nhập tên tour' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="loaiTourId" label="Loại tour" rules={[{ required: true, message: 'Vui lòng chọn loại tour' }]}>
              <Select options={loaiTours.map((item) => ({ value: item.id, label: item.ten }))} />
            </Form.Item>
            <Form.Item name="diemXuatPhatId" label="Điểm xuất phát" rules={[{ required: true, message: 'Vui lòng chọn điểm xuất phát' }]}>
              <Select options={diaDiems.map((item) => ({ value: item.id, label: item.tenDiaDiem }))} />
            </Form.Item>
            <Form.Item name="soNgay" label="Số ngày" rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
            <Form.Item name="soDem" label="Số đêm">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="phuongTien" label="Phương tiện">
              <Input />
            </Form.Item>
            <Form.Item name="giaTuThamKhao" label="Giá từ" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
              <Select options={statusOptions} />
            </Form.Item>
            <Form.Item name="diemDenIds" label="Điểm đến">
              <Select
                mode="multiple"
                options={diaDiems.map((item) => ({ value: item.id, label: item.tenDiaDiem }))}
                placeholder="Chọn các điểm đến"
              />
            </Form.Item>
          </div>

          <Form.Item name="isNoiBat" label="Tour nổi bật" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="moTaNgan" label="Mô tả ngắn">
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item name="moTaChiTiet" label="Mô tả chi tiết">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="dieuKienTour" label="Điều kiện tour">
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className="admin-tour-image-section">
            <Text strong>Ảnh tour</Text>
            <div className="admin-tour-image-input-row">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Nhập URL ảnh..."
                onPressEnter={() => void handleAddImage()}
              />
              <Button type="primary" onClick={() => void handleAddImage()}>Thêm ảnh</Button>
            </div>
            {images.length > 0 && (
              <div className="admin-tour-image-list">
                {images.map((img, index) => (
                  <div key={index} className={`admin-tour-image-item ${img.isAvatar ? 'is-avatar' : ''}`}>
                    <div className="admin-tour-image-thumb-wrap">
                      <img src={img.url} alt={`Ảnh ${index + 1}`} className="admin-tour-image-thumb" />
                      {img.isAvatar && (
                        <div className="admin-tour-image-avatar-badge">
                          <StarFilled style={{ color: '#faad14' }} /> Đại diện
                        </div>
                      )}
                    </div>
                    <div className="admin-tour-image-info">
                      <Text className="admin-tour-image-url" ellipsis>{img.url}</Text>
                      {img.moTa && <Text type="secondary" style={{ fontSize: 12 }}>{img.moTa}</Text>}
                      <Text type="secondary" style={{ fontSize: 11 }}>Thứ tự: {index + 1}</Text>
                    </div>
                    <div className="admin-tour-image-actions">
                      <Button size="small" icon={<ArrowUpOutlined />} onClick={() => void handleMoveImageUp(index)} disabled={index === 0} />
                      <Button size="small" icon={<ArrowDownOutlined />} onClick={() => void handleMoveImageDown(index)} disabled={index === images.length - 1} />
                      <Button size="small" icon={img.isAvatar ? <StarFilled /> : <StarOutlined />} onClick={() => void handleSetAvatar(index)}>
                        {img.isAvatar ? 'Bỏ đại diện' : 'Đặt đại diện'}
                      </Button>
                      <Button size="small" icon={<EditOutlined />} onClick={() => void handleOpenImageEdit(index)}>Mô tả</Button>
                      <Button size="small" danger icon={<DeleteOutlined />} onClick={() => void handleRemoveImage(index)}>Xóa</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {images.length === 0 && (
              <Text type="secondary" className="admin-tour-image-hint">Chưa có ảnh nào. Nhập URL ảnh và nhấn Thêm.</Text>
            )}
          </div>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa mô tả ảnh"
        open={imageModalOpen}
        onCancel={() => { setImageModalOpen(false); setEditingImageIndex(null) }}
        onOk={() => void handleSaveImageEdit()}
        width={480}
      >
        <Form layout="vertical">
          <Form.Item label="Mô tả ảnh">
            <Input.TextArea
              value={imageDescInput}
              onChange={(e) => setImageDescInput(e.target.value)}
              rows={3}
              placeholder="Nhập mô tả cho ảnh này (không bắt buộc)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}