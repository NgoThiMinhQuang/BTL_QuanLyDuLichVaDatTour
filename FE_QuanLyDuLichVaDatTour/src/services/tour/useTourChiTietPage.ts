import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { resolveApiAssetUrl } from '../../constants/api'
import type { DepartureItem, TourGalleryItem, TourInfoFact } from '../../types/tour'
import { layBangGiaLichKhoiHanh, layLichKhoiHanhTour, layLichTrinhTour, layTourChiTiet } from './layTourChiTiet'
// custom hook gom toàn bộ logic lấy dữ liệu cho trang chi tiết tour.
export function useTourChiTietPage(tourId: number, isValidId: boolean) {
  const detailQuery = useQuery({
    queryKey: ['tour', 'detail', tourId],
    queryFn: () => layTourChiTiet(tourId),
    enabled: isValidId,
  })

  const itineraryQuery = useQuery({
    queryKey: ['tour', 'itinerary', tourId],
    queryFn: () => layLichTrinhTour(tourId),
    enabled: isValidId,
  })

  const departuresQuery = useQuery({
    queryKey: ['tour', 'departures', tourId],
    queryFn: () => layLichKhoiHanhTour(tourId),
    enabled: isValidId,
  })
// lịch khởi hành đang được chọn.
  const [selectedDeparture, setSelectedDeparture] = useState<DepartureItem | null>(null)
// chọn lịch nào thì hệ thống tự chọn lịch đầu tiên.
  useEffect(() => {
    if (!selectedDeparture && departuresQuery.data && departuresQuery.data.length > 0) {
      setSelectedDeparture(departuresQuery.data[0])
      return
    }
// không còn tồn tại trong danh sách nữa thì hệ thống chọn lại lịch đầu tiên.
    if (selectedDeparture && departuresQuery.data) {
      const stillExists = departuresQuery.data.find((item) => item.id === selectedDeparture.id)
      if (!stillExists) {
        setSelectedDeparture(departuresQuery.data[0] ?? null)
      }
    }
  }, [departuresQuery.data, selectedDeparture])
// pri bảng giá theo lịch khởi hành đang chọn.
  const pricingQuery = useQuery({
    queryKey: ['tour', 'departure-pricing', selectedDeparture?.id],
    queryFn: () => layBangGiaLichKhoiHanh(selectedDeparture!.id),
    enabled: Boolean(selectedDeparture?.id),
  })
// dùng để xử lý danh sách ảnh tour.
  const gallery = useMemo<TourGalleryItem[]>(() => {
    return (detailQuery.data?.anhTours ?? [])
      .slice()
      .sort((a, b) => Number(b.isAvatar) - Number(a.isAvatar) || a.thuTu - b.thuTu)
      .map((item) => ({
        id: item.id,
        imageUrl: resolveApiAssetUrl(item.linkAnh) ?? '',
        alt: item.moTa ?? detailQuery.data?.tenTour ?? 'Tour image',
        isAvatar: item.isAvatar,
      }))
      .filter((item) => item.imageUrl)
  }, [detailQuery.data])

  const heroImage = gallery[0]?.imageUrl ?? ''
// tạo ra các thông tin tóm tắt của tour để hiển thị ở phần đầu trang chi tiết.
  const infoFacts = useMemo<TourInfoFact[]>(() => {
    if (!detailQuery.data) return []

    return [
      { key: 'xuat-phat', label: 'Điểm xuất phát', value: detailQuery.data.tenDiaDiemKhoiHanh },
      { key: 'thoi-luong', label: 'Thời lượng', value: `${detailQuery.data.soNgay} ngày ${detailQuery.data.soDem} đêm` },
      { key: 'phuong-tien', label: 'Phương tiện', value: detailQuery.data.phuongTien ?? 'Đang cập nhật' },
      { key: 'loai-tour', label: 'Loại tour', value: detailQuery.data.tenLoaiTour },
    ]
  }, [detailQuery.data])
// dùng để nhóm lịch trình theo từng ngày.
  const itineraryByDay = useMemo(() => {
    const grouped = new Map<number, typeof itineraryQuery.data>()

    ;(itineraryQuery.data ?? []).forEach((item) => {
      const existing = grouped.get(item.ngayThu) ?? []
      existing.push(item)
      grouped.set(item.ngayThu, existing)
    })

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([day, items]) => ({
        day,
        items: (items ?? []).slice().sort((a, b) => a.thuTuTrongNgay - b.thuTuTrongNgay),
      }))
  }, [itineraryQuery.data])

  return {
    detailQuery,
    itineraryQuery,
    departuresQuery,
    pricingQuery,
    selectedDeparture,
    setSelectedDeparture,
    gallery,
    heroImage,
    infoFacts,
    itineraryByDay,
  }
}
