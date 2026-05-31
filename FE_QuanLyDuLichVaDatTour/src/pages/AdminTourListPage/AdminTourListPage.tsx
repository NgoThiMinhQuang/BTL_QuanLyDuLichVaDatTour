import { Alert, Button, Empty, Form, Input, InputNumber, Modal, Popconfirm, Select, Switch, Tag, Typography, message, Pagination, Dropdown, Progress, Tooltip, Space } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState, useEffect } from 'react'
import {
  useAdminDiaDiems,
  useAdminLoaiTours,
  useAdminTours,
  useCreateAdminTour,
  useHideAdminTour,
  useUpdateAdminTour,
  useUpdateAdminTourStatus,
  useAddTourDiemDen,
  useDeleteTourDiemDen,
  useUpdateTourDiemDen,
  useReorderTourDiemDen,
  useAddAnhTour,
  useDeleteAnhTour,
  useSetAvatarAnhTour,
  useReorderAnhTour,
  useUpdateAnhTour,
} from '../../services/admin/admin.hooks'
import type { AdminTourItem, AdminTourStatus, AdminTourDestination, AdminTourImage, AdminLichKhoiHanhItem } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import { adminTourStatusMeta, adminLichKhoiHanhStatusMeta, formatDateTime, mapStatusOptions } from '../../utils/admin'
import './AdminTourListPage.css'
import { useAdminLichKhoiHanhByTour, useAdminLichKhoiHanhs } from '../../services/admin/admin.hooks'
import { formatDate } from '../../utils/formatDate'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarOutlined,
  StarFilled,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PictureOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CarOutlined,
  GlobalOutlined,
  EyeInvisibleOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const { Paragraph, Title, Text } = Typography

const statusTabs: Array<{ key: 'tat_ca' | AdminTourStatus; label: string }> = [
  { key: 'tat_ca', label: 'Tất cả' },
  { key: 'dang_mo_ban', label: 'Đang mở bán' },
  { key: 'nhap', label: 'Nháp' },
  { key: 'an', label: 'Ẩn' },
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
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const [tourModalOpen, setTourModalOpen] = useState(false)
  const [editingTour, setEditingTour] = useState<AdminTourItem | null>(null)
  const [form] = Form.useForm()

  // ── Destination management state ──
  const [destinationModalOpen, setDestinationModalOpen] = useState(false)
  const [destTourId, setDestTourId] = useState<number | null>(null)
  const [destTourName, setDestTourName] = useState('')
  const [destEditingId, setDestEditingId] = useState<number | null>(null)
  const [destForm] = Form.useForm()
  const [destEditForm] = Form.useForm()

  // ── Image management state ──
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [imageTourId, setImageTourId] = useState<number | null>(null)
  const [imageTourName, setImageTourName] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [imageDescEditOpen, setImageDescEditOpen] = useState(false)
  const [imageEditingItem, setImageEditingItem] = useState<AdminTourImage | null>(null)
  const [imageDescForm] = Form.useForm()

  // ── Seat capacity management state ──
  const [capacityModalOpen, setCapacityModalOpen] = useState(false)
  const [capacityTourId, setCapacityTourId] = useState<number | null>(null)
  const [capacityTourName, setCapacityTourName] = useState('')

  const toursQuery = useAdminTours()
  const loaiToursQuery = useAdminLoaiTours()
  const diaDiemsQuery = useAdminDiaDiems()
  const lichKhoiHanhsQuery = useAdminLichKhoiHanhs()
  const updateStatusMutation = useUpdateAdminTourStatus()
  const hideTourMutation = useHideAdminTour()
  const createTourMutation = useCreateAdminTour()
  const updateTourMutation = useUpdateAdminTour()

  const addDiemDenMutation = useAddTourDiemDen()
  const deleteDiemDenMutation = useDeleteTourDiemDen()
  const updateDiemDenMutation = useUpdateTourDiemDen()
  const reorderDiemDenMutation = useReorderTourDiemDen()

  const addAnhTourMutation = useAddAnhTour()
  const deleteAnhTourMutation = useDeleteAnhTour()
  const setAvatarMutation = useSetAvatarAnhTour()
  const reorderAnhTourMutation = useReorderAnhTour()
  const updateAnhTourMutation = useUpdateAnhTour()

  const tours = toursQuery.data ?? []
  const loaiTours = loaiToursQuery.data ?? []
  const diaDiems = diaDiemsQuery.data ?? []
  const lichKhoiHanhs = lichKhoiHanhsQuery.data ?? []

  // Tính số chỗ tổng hợp cho mỗi tour
  const tourSeatsStats = useMemo(() => {
    const stats: Record<number, { total: number; sold: number; available: number }> = {}
    lichKhoiHanhs.forEach(lkh => {
      if (!stats[lkh.tourId]) {
        stats[lkh.tourId] = { total: 0, sold: 0, available: 0 }
      }
      stats[lkh.tourId].total += lkh.soChoToiDa || 0
      stats[lkh.tourId].sold += lkh.soChoDaDat || 0
      stats[lkh.tourId].available += lkh.soChoConLai || 0
    })
    return stats
  }, [lichKhoiHanhs])

  const selectedTour = useMemo(() => {
    if (imageTourId) return tours.find(t => t.id === imageTourId) ?? null
    if (destTourId) return tours.find(t => t.id === destTourId) ?? null
    return null
  }, [tours, imageTourId, destTourId])

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

  const stats = useMemo(() => {
    return {
      total: tours.length,
      active: tours.filter(t => t.trangThai === 'dang_mo_ban').length,
      paused: tours.filter(t => t.trangThai === 'tam_ngung').length,
      inactive: tours.filter(t => t.trangThai === 'an' || t.trangThai === 'ngung_kinh_doanh').length,
    }
  }, [tours])

  useEffect(() => {
    setCurrentPage(1)
  }, [keyword, activeStatus, loaiTourFilter, diaDiemFilter])

  const paginatedTours = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredTours.slice(start, start + pageSize)
  }, [filteredTours, currentPage])

  // ── Tour modal ──
  const handleOpenTourModal = (tour?: AdminTourItem) => {
    if (tour) {
      setEditingTour(tour)
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
        anhTours: tour.anhTours.map((a) => a.linkAnh),
      })
    } else {
      setEditingTour(null)
      form.setFieldsValue({
        trangThai: 'nhap',
        isNoiBat: false,
        soNgay: 1,
        soDem: 0,
        giaTuThamKhao: 0,
      })
    }
    setTourModalOpen(true)
  }

  const handleSubmitTour = async () => {
    try {
      const values = await form.validateFields()
      if (editingTour) {
        await updateTourMutation.mutateAsync({ id: editingTour.id, payload: values })
      } else {
        await createTourMutation.mutateAsync(values)
      }
      setTourModalOpen(false)
      setEditingTour(null)
      form.resetFields()
      void message.success(editingTour ? 'Cập nhật tour thành công' : 'Tạo tour thành công')
    } catch { /* antd validation */ }
  }

  // ── Destination management ──
  const handleOpenDestinationModal = (tour: AdminTourItem) => {
    setDestTourId(tour.id)
    setDestTourName(tour.tenTour)
    setDestEditingId(null)
    destForm.resetFields()
    setDestinationModalOpen(true)
  }

  const handleAddDestination = async () => {
    if (destTourId === null) return
    try {
      const values = await destForm.validateFields()
      await addDiemDenMutation.mutateAsync({ tourId: destTourId, payload: values })
      destForm.resetFields()
      void message.success('Đã thêm điểm đến')
    } catch { /* validation */ }
  }

  const handleDeleteDestination = async (id: number) => {
    await deleteDiemDenMutation.mutateAsync(id)
    void message.success('Đã xoá điểm đến')
  }

  const handleEditDestination = (dest: AdminTourDestination) => {
    setDestEditingId(dest.id)
    destEditForm.setFieldsValue({ ghiChu: dest.ghiChu ?? '' })
  }

  const handleSaveEditDestination = async () => {
    if (destEditingId === null) return
    try {
      const values = await destEditForm.validateFields()
      await updateDiemDenMutation.mutateAsync({ tourDiemDenId: destEditingId, payload: values })
      setDestEditingId(null)
      destEditForm.resetFields()
      void message.success('Đã cập nhật điểm đến')
    } catch { /* validation */ }
  }

  const handleMoveDestination = async (destinations: AdminTourDestination[], index: number, direction: 'up' | 'down') => {
    if (destTourId === null) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= destinations.length) return
    const reordered = [...destinations]
      ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]
    const ids = reordered.map(d => d.id)
    await reorderDiemDenMutation.mutateAsync({ tourId: destTourId, diemDenIds: ids })
    void message.success('Đã sắp xếp lại điểm đến')
  }

  // ── Image management ──
  const handleOpenImageModal = (tour: AdminTourItem) => {
    setImageTourId(tour.id)
    setImageTourName(tour.tenTour)
    setImageInput('')
    setImageModalOpen(true)
  }

  // ── Seat capacity management ──
  const handleOpenCapacityModal = (tour: AdminTourItem) => {
    setCapacityTourId(tour.id)
    setCapacityTourName(tour.tenTour)
    setCapacityModalOpen(true)
  }

  const handleAddImage = async () => {
    if (imageTourId === null) return
    if (!imageInput.trim()) return
    await addAnhTourMutation.mutateAsync({ tourId: imageTourId, payload: { linkAnh: imageInput.trim() } })
    setImageInput('')
    void message.success('Đã thêm ảnh')
  }

  const handleDeleteImage = async (id: number) => {
    await deleteAnhTourMutation.mutateAsync(id)
    void message.success('Đã xoá ảnh')
  }

  const handleSetAvatar = async (id: number) => {
    await setAvatarMutation.mutateAsync(id)
    void message.success('Đã đặt ảnh đại diện')
  }

  const handleMoveImage = async (images: AdminTourImage[], index: number, direction: 'up' | 'down') => {
    if (imageTourId === null) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return
    const reordered = [...images]
      ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]
    const ids = reordered.map(img => img.id)
    await reorderAnhTourMutation.mutateAsync({ tourId: imageTourId, anhTourIds: ids })
    void message.success('Đã sắp xếp lại ảnh')
  }

  const handleOpenImageDescEdit = (img: AdminTourImage) => {
    setImageEditingItem(img)
    imageDescForm.setFieldsValue({ moTa: img.moTa ?? '' })
    setImageDescEditOpen(true)
  }

  // ── Helpers ──
  const hasError = toursQuery.isError || loaiToursQuery.isError || diaDiemsQuery.isError
  const errorMessage = toursQuery.error instanceof Error
    ? toursQuery.error.message
    : loaiToursQuery.error instanceof Error
      ? loaiToursQuery.error.message
      : diaDiemsQuery.error instanceof Error
        ? diaDiemsQuery.error.message
        : 'Không thể tải dữ liệu quản lý tour'

  const isSubmitting = createTourMutation.isPending || updateTourMutation.isPending

  const getTourActions = (record: AdminTourItem): MenuProps['items'] => {
    return [
      {
        key: 'grp-content',
        type: 'group',
        label: 'QUẢN LÝ NỘI DUNG',
        children: [
          {
            key: 'edit',
            label: 'Chỉnh sửa tour',
            icon: <EditOutlined />,
            onClick: () => void handleOpenTourModal(record)
          },
          {
            key: 'destinations',
            label: 'Quản lý điểm đến',
            icon: <EnvironmentOutlined />,
            onClick: () => void handleOpenDestinationModal(record)
          },
          {
            key: 'images',
            label: 'Quản lý ảnh',
            icon: <PictureOutlined />,
            onClick: () => void handleOpenImageModal(record)
          },
        ]
      },
      {
        key: 'grp-capacity',
        type: 'group',
        label: 'VẬN HÀNH',
        children: [
          {
            key: 'capacity',
            label: 'Quản lý số chỗ',
            icon: <TeamOutlined />,
            onClick: () => void handleOpenCapacityModal(record)
          },
        ]
      },
      { type: 'divider' },
      {
        key: 'toggle-visibility',
        label: record.trangThai === 'an' ? 'Khôi phục tour' : 'Ẩn tour',
        icon: <EyeInvisibleOutlined />,
        danger: record.trangThai !== 'an',
        onClick: () => void (record.trangThai === 'an'
          ? updateStatusMutation.mutateAsync({ id: record.id, trangThai: 'nhap' })
          : hideTourMutation.mutateAsync(record.id)),
      },
    ]
  }

  const currentDestinations = selectedTour?.diemDens ?? []
  const currentImages = selectedTour?.anhTours ?? []

  return (
    <div className="admin-tour-list-page">
      <div className="admin-tour-list-header">
        <div>
          <Title level={1}>Quản lý tour</Title>
          <Paragraph>Điều phối danh mục tour, tình trạng mở bán, tuyến điểm và các thông tin hiển thị ra khách hàng.</Paragraph>
        </div>
        <Button type="primary" size="large" className="admin-tour-list-create-button" onClick={() => void handleOpenTourModal()}>
          + Tạo tour mới
        </Button>
      </div>

      <div className="admin-tour-list-card" style={{ padding: '32px' }}>
        <div className="tour-stats-grid">
          <div className="tour-stat-card">
            <div className="stat-icon"><AppstoreOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng số tour</div>
            </div>
          </div>
          <div className="tour-stat-card active-stat">
            <div className="stat-icon"><CheckCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.active}</div>
              <div className="stat-label">Đang mở bán</div>
            </div>
          </div>
          <div className="tour-stat-card paused-stat">
            <div className="stat-icon"><PauseCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.paused}</div>
              <div className="stat-label">Tạm ngưng</div>
            </div>
          </div>
          <div className="tour-stat-card inactive-stat">
            <div className="stat-icon"><StopOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.inactive}</div>
              <div className="stat-label">Ngừng / Ẩn</div>
            </div>
          </div>
        </div>

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

        <div className="admin-tour-list-container">
          {toursQuery.isLoading || loaiToursQuery.isLoading || diaDiemsQuery.isLoading ? (
            <Empty description="Đang tải dữ liệu..." />
          ) : filteredTours.length === 0 ? (
            <Empty description="Không có tour phù hợp" />
          ) : (
            paginatedTours.map((tour) => {
              const avatar = tour.anhTours?.find(a => a.isAvatar)?.linkAnh || tour.anhTours?.[0]?.linkAnh
              
              return (
                <div key={tour.id} className="admin-tour-row">
                  <div className="tour-col-image">
                    {avatar ? (
                      <img src={avatar} alt={tour.tenTour} className="tour-mini-image" />
                    ) : (
                      <div className="tour-mini-image-placeholder"><PictureOutlined /></div>
                    )}
                  </div>

                  <div className="tour-col-info">
                    <div className="tour-title-wrap">
                      <h3 className="tour-name">{tour.tenTour}</h3>
                      {tour.isNoiBat && <Tag color="gold" size="small" className="tour-badge-featured">Nổi bật</Tag>}
                    </div>
                    <div className="tour-meta-row">
                      <span className="tour-code-tag">{tour.maTour}</span>
                      <span className="tour-type">{tour.tenLoaiTour}</span>
                    </div>
                  </div>

                  <div className="tour-col-stats">
                    <div className="stat-line">
                      <ClockCircleOutlined /> <span>{getDurationLabel(tour)}</span>
                    </div>
                    <div className="stat-line">
                      <EnvironmentOutlined /> <span title={tour.tenDiemXuatPhat}>Từ: {tour.tenDiemXuatPhat}</span>
                    </div>
                  </div>

                  <div className="tour-col-status">
                    <Tag color={adminTourStatusMeta[tour.trangThai].color} className="status-dropdown-tag">
                      {adminTourStatusMeta[tour.trangThai].label}
                    </Tag>
                  </div>

                  <div className="tour-col-price">
                    <div className="price-value">{formatMoney(tour.giaTuThamKhao)}</div>
                  </div>

                  <div className="tour-col-seats">
                    {(() => {
                      const seats = tourSeatsStats[tour.id]
                      if (!seats) {
                        return <span style={{ color: '#94a3b8', fontSize: 12 }}>Chưa có lịch</span>
                      }
                      const fillRate = seats.total > 0 ? Math.round((seats.sold / seats.total) * 100) : 0
                      const isLow = seats.available > 0 && seats.available <= 5
                      return (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: isLow ? '#f59e0b' : '#1e293b' }}>
                            {seats.available} / {seats.total}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {fillRate}% đã đặt
                          </div>
                          {isLow && (
                            <Tag color="warning" style={{ fontSize: 10, marginTop: 2 }}>
                              Sắp hết
                            </Tag>
                          )}
                        </div>
                      )
                    })()}
                  </div>

                  <div className="tour-col-actions">
                    <div className="quick-actions">
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        title="Sửa tour"
                        onClick={() => void handleOpenTourModal(tour)}
                      />
                      <Button 
                        type="text" 
                        icon={<EnvironmentOutlined />} 
                        title="Điểm đến"
                        onClick={() => void handleOpenDestinationModal(tour)}
                      />
                      <Button 
                        type="text" 
                        icon={<PictureOutlined />} 
                        title="Quản lý ảnh"
                        onClick={() => void handleOpenImageModal(tour)}
                      />
                      <Dropdown menu={{ items: getTourActions(tour) }} trigger={['click']} placement="bottomRight">
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {filteredTours.length > 0 && (
          <div className="admin-tour-list-pagination">
            <Pagination
              current={currentPage}
              total={filteredTours.length}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>

      {/* ── Tour create/edit modal ── */}
      <Modal
        title={editingTour ? 'Cập nhật tour' : 'Tạo tour mới'}
        open={tourModalOpen}
        onCancel={() => { setTourModalOpen(false); setEditingTour(null); form.resetFields() }}
        onOk={() => void handleSubmitTour()}
        confirmLoading={isSubmitting}
        width={780}
        destroyOnHidden
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
          <Form.Item name="anhTours" label="Ảnh tour (URL, mỗi dòng 1 ảnh)">
            <Input.TextArea rows={3} placeholder="Nhập URL ảnh, mỗi ảnh một dòng" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Destination management modal ── */}
      <Modal
        title={`Quản lý điểm đến: ${destTourName}`}
        open={destinationModalOpen}
        onCancel={() => { setDestinationModalOpen(false); setDestTourId(null); setDestEditingId(null) }}
        footer={null}
        width={700}
        destroyOnHidden
      >
        <div style={{ marginBottom: 16 }}>
          <Form form={destForm} layout="inline" onFinish={() => void handleAddDestination()}>
            <Form.Item name="diaDiemId" label="Điểm đến" rules={[{ required: true, message: 'Chọn điểm đến' }]} style={{ flex: 1 }}>
              <Select
                options={diaDiems.map(d => ({ value: d.id, label: d.tenDiaDiem }))}
                placeholder="Chọn điểm đến"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>
            <Form.Item name="ghiChu" label="Ghi chú">
              <Input placeholder="Ghi chú (tuỳ chọn)" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={addDiemDenMutation.isPending}>Thêm</Button>
            </Form.Item>
          </Form>
        </div>

        {currentDestinations.length === 0 ? (
          <Empty description="Chưa có điểm đến nào" />
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {currentDestinations.map((dest, index) => (
              <div key={dest.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <Tag>{dest.thuTu}</Tag>
                <div style={{ flex: 1 }}>
                  <Text strong>{dest.tenDiaDiem}</Text>
                  {dest.ghiChu && <div><Text type="secondary" style={{ fontSize: 12 }}>{dest.ghiChu}</Text></div>}
                </div>
                {destEditingId === dest.id ? (
                  <Form form={destEditForm} layout="inline" onFinish={() => void handleSaveEditDestination()}>
                    <Form.Item name="ghiChu" style={{ margin: 0 }}>
                      <Input size="small" placeholder="Ghi chú" style={{ width: 140 }} />
                    </Form.Item>
                    <Button size="small" type="primary" htmlType="submit" loading={updateDiemDenMutation.isPending}>Lưu</Button>
                    <Button size="small" onClick={() => setDestEditingId(null)}>Huỷ</Button>
                  </Form>
                ) : (
                  <>
                    <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => handleMoveDestination(currentDestinations, index, 'up')} />
                    <Button size="small" icon={<ArrowDownOutlined />} disabled={index === currentDestinations.length - 1} onClick={() => handleMoveDestination(currentDestinations, index, 'down')} />
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleEditDestination(dest)} />
                    <Popconfirm title="Xoá điểm đến này?" onConfirm={() => handleDeleteDestination(dest.id)}>
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Image management modal ── */}
      <Modal
        title={`Quản lý ảnh: ${imageTourName}`}
        open={imageModalOpen}
        onCancel={() => { setImageModalOpen(false); setImageTourId(null) }}
        footer={null}
        width={750}
        destroyOnHidden
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Nhập URL ảnh..."
            onPressEnter={() => void handleAddImage()}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={() => void handleAddImage()} loading={addAnhTourMutation.isPending}>Thêm ảnh</Button>
        </div>

        {currentImages.length === 0 ? (
          <Empty description="Chưa có ảnh nào" />
        ) : (
          <div className="admin-tour-image-list">
            {currentImages.map((img, index) => (
              <div key={img.id} className={`admin-tour-image-item ${img.isAvatar ? 'is-avatar' : ''}`}>
                <div className="admin-tour-image-thumb-wrap">
                  <img src={img.linkAnh} alt={img.moTa ?? `Ảnh ${index + 1}`} className="admin-tour-image-thumb" />
                  {img.isAvatar && (
                    <div className="admin-tour-image-avatar-badge">
                      <StarFilled style={{ color: '#faad14' }} /> Đại diện
                    </div>
                  )}
                </div>
                <div className="admin-tour-image-info">
                  <Text className="admin-tour-image-url" ellipsis>{img.linkAnh}</Text>
                  {img.moTa && <Text type="secondary" style={{ fontSize: 12 }}>{img.moTa}</Text>}
                  <Text type="secondary" style={{ fontSize: 11 }}>Thứ tự: {index + 1}</Text>
                </div>
                <div className="admin-tour-image-actions">
                  <Button size="small" icon={<ArrowUpOutlined />} disabled={index === 0} onClick={() => handleMoveImage(currentImages, index, 'up')} />
                  <Button size="small" icon={<ArrowDownOutlined />} disabled={index === currentImages.length - 1} onClick={() => handleMoveImage(currentImages, index, 'down')} />
                  {!img.isAvatar && (
                    <Button size="small" icon={<StarOutlined />} onClick={() => handleSetAvatar(img.id)}>Đặt đại diện</Button>
                  )}
                  <Button size="small" icon={<EditOutlined />} onClick={() => handleOpenImageDescEdit(img)} />
                  <Popconfirm title="Xoá ảnh này?" onConfirm={() => handleDeleteImage(img.id)}>
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* ── Image description edit modal ── */}
      <Modal
        title="Cập nhật mô tả ảnh"
        open={imageDescEditOpen}
        onCancel={() => { setImageDescEditOpen(false); setImageEditingItem(null) }}
        onOk={async () => {
          if (!imageEditingItem) return
          try {
            const values = await imageDescForm.validateFields()
            await updateAnhTourMutation.mutateAsync({ anhTourId: imageEditingItem.id, payload: { moTa: values.moTa } })
            setImageDescEditOpen(false)
            setImageEditingItem(null)
            void message.success('Đã cập nhật mô tả')
          } catch { /* validation */ }
        }}
        width={480}
      >
        <Form form={imageDescForm} layout="vertical">
          <Form.Item name="moTa" label="Mô tả ảnh">
            <Input.TextArea rows={3} placeholder="Nhập mô tả cho ảnh này" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Seat capacity management modal ── */}
      <SeatCapacityModal
        open={capacityModalOpen}
        tourId={capacityTourId}
        tourName={capacityTourName}
        onClose={() => { setCapacityModalOpen(false); setCapacityTourId(null) }}
      />
    </div>
  )
}

// ── Seat Capacity Modal Component ──
interface SeatCapacityModalProps {
  open: boolean
  tourId: number | null
  tourName: string
  onClose: () => void
}

function SeatCapacityModal({ open, tourId, tourName, onClose }: SeatCapacityModalProps) {
  const { data: lichKhoiHanhs, isLoading } = useAdminLichKhoiHanhByTour(tourId ?? undefined)

  const stats = useMemo(() => {
    if (!lichKhoiHanhs) return { totalSlots: 0, soldSlots: 0, availableSlots: 0 }
    const totalSlots = lichKhoiHanhs.reduce((sum, item) => sum + (item.soChoToiDa || 0), 0)
    const soldSlots = lichKhoiHanhs.reduce((sum, item) => sum + (item.soChoDaDat || 0), 0)
    const availableSlots = lichKhoiHanhs.reduce((sum, item) => sum + (item.soChoConLai || 0), 0)
    return { totalSlots, soldSlots, availableSlots }
  }, [lichKhoiHanhs])

  const statusColorMap: Record<string, { bg: string; text: string }> = {
    mo_ban: { bg: '#f0fdf4', text: '#16a34a' },
    het_cho: { bg: '#fef2f2', text: '#dc2626' },
    da_khoi_hanh: { bg: '#eff6ff', text: '#2563eb' },
    da_ket_thuc: { bg: '#f8fafc', text: '#64748b' },
    da_huy: { bg: '#fef3c7', text: '#d97706' },
  }

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined style={{ color: '#6366f1' }} />
          <span>Quản lý số chỗ: {tourName}</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      <div style={{ marginTop: 16 }}>
        {/* Stats summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>{stats.totalSlots}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Tổng số chỗ</div>
          </div>
          <div style={{ background: '#fef2f2', padding: 16, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{stats.soldSlots}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Đã đặt</div>
          </div>
          <div style={{ background: '#f0fdf4', padding: 16, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{stats.availableSlots}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Còn trống</div>
          </div>
        </div>

        {isLoading ? (
          <Empty description="Đang tải dữ liệu..." />
        ) : !lichKhoiHanhs || lichKhoiHanhs.length === 0 ? (
          <Empty description="Chưa có lịch khởi hành nào cho tour này" />
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {lichKhoiHanhs.map((lkh) => {
              const percent = lkh.soChoToiDa > 0 ? Math.round((lkh.soChoDaDat / lkh.soChoToiDa) * 100) : 0
              const statusStyle = statusColorMap[lkh.trangThai] || { bg: '#f8fafc', text: '#64748b' }

              return (
                <div key={lkh.id} style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  background: '#fff'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                        <Tag style={{ background: '#e0e7ff', color: '#4338ca', border: 'none' }}>{lkh.maDotTour}</Tag>
                        <span style={{ marginLeft: 8 }}>{formatDate(lkh.ngayKhoiHanh)} → {formatDate(lkh.ngayKetThuc)}</span>
                      </div>
                      {lkh.noiTapTrung && (
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          <EnvironmentOutlined style={{ marginRight: 4 }} />
                          {lkh.noiTapTrung}
                        </div>
                      )}
                    </div>
                    <Tag style={{ background: statusStyle.bg, color: statusStyle.text, border: 'none', borderRadius: 8 }}>
                      {adminLichKhoiHanhStatusMeta[lkh.trangThai]?.label || lkh.trangThai}
                    </Tag>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13 }}>
                          <Text strong>{lkh.soChoDaDat}</Text> / {lkh.soChoToiDa} chỗ
                        </span>
                        <span style={{ fontSize: 12, color: percent >= 80 ? '#f59e0b' : '#64748b' }}>
                          {percent}% đã đặt
                        </span>
                      </div>
                      <Progress
                        percent={percent}
                        size="small"
                        showInfo={false}
                        strokeColor={{
                          '0%': percent >= 80 ? '#f59e0b' : '#6366f1',
                          '100%': percent >= 100 ? '#ef4444' : percent >= 80 ? '#fbbf24' : '#a855f7',
                        }}
                        strokeWidth={8}
                      />
                    </div>
                    <Tooltip title="Số chỗ còn lại">
                      <div style={{
                        background: lkh.soChoConLai <= 0 ? '#fef2f2' : lkh.soChoConLai <= 5 ? '#fffbeb' : '#f0fdf4',
                        color: lkh.soChoConLai <= 0 ? '#dc2626' : lkh.soChoConLai <= 5 ? '#d97706' : '#16a34a',
                        padding: '8px 16px',
                        borderRadius: 8,
                        fontWeight: 600,
                        minWidth: 60,
                        textAlign: 'center'
                      }}>
                        {lkh.soChoConLai}
                        <div style={{ fontSize: 10, fontWeight: 400 }}>còn</div>
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {lichKhoiHanhs && lichKhoiHanhs.length > 0 && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Để quản lý chi tiết lịch khởi hành và số chỗ, vui lòng truy cập trang
              <a href="/admin/lich-khoi-hanh" style={{ marginLeft: 4 }}>Quản lý Lịch khởi hành</a>
            </Text>
          </div>
        )}
      </div>
    </Modal>
  )
}