import type {
  BenefitItem,
  FeaturedTour,
  HeroStat,
  ReviewItem,
  SearchSuggestion,
} from '../types/home'

export const heroStats: HeroStat[] = [
  { id: 1, label: 'Danh mục đang mở', value: 'Nhiều loại tour' },
  { id: 2, label: 'Hỗ trợ tư vấn', value: '24/7 nhanh chóng' },
  { id: 3, label: 'Hình thức giá', value: 'Ngày thường & cuối tuần' },
]

export const searchSuggestions: SearchSuggestion[] = [
  { id: 1, label: 'Điểm đến nổi bật', value: 'Đà Nẵng' },
  { id: 2, label: 'Loại trải nghiệm', value: 'Tour nghỉ dưỡng' },
  { id: 3, label: 'Khởi hành gợi ý', value: 'Cuối tuần này' },
]

export const featuredTours: FeaturedTour[] = [
  {
    id: 1,
    title: 'Đà Nẵng - Hội An - Bà Nà',
    subtitle: 'Hành trình biển và phố cổ phù hợp gia đình',
    duration: '3 ngày 2 đêm',
    transport: 'Máy bay + xe du lịch',
    location: 'Miền Trung',
    departure: 'Khởi hành thứ 6 hằng tuần',
    price: 'Từ 3.490.000đ',
    highlight: 'Lịch trình rõ ràng, dễ đặt theo nhóm',
  },
  {
    id: 2,
    title: 'Phú Quốc nghỉ dưỡng cao cấp',
    subtitle: 'Kết hợp vui chơi và nghỉ dưỡng cuối tuần',
    duration: '3 ngày 2 đêm',
    transport: 'Máy bay',
    location: 'Miền Nam',
    departure: 'Khởi hành thứ 5 và thứ 7',
    price: 'Từ 4.990.000đ',
    highlight: 'Phù hợp khách muốn đặt tour nhanh',
  },
  {
    id: 3,
    title: 'Sapa - Fansipan săn mây',
    subtitle: 'Tour thiên nhiên cho nhóm bạn và công ty',
    duration: '4 ngày 3 đêm',
    transport: 'Xe giường nằm + cáp treo',
    location: 'Miền Bắc',
    departure: 'Khởi hành theo đợt',
    price: 'Từ 3.850.000đ',
    highlight: 'Dễ theo dõi lịch khởi hành và chỗ trống',
  },
]

export const benefitItems: BenefitItem[] = [
  {
    id: 1,
    title: 'Đặt tour đúng nghiệp vụ',
    description: 'Khách hàng chọn theo lịch khởi hành cụ thể thay vì đặt tour chung chung.',
    icon: '🗓️',
  },
  {
    id: 2,
    title: 'Giá minh bạch',
    description: 'Dễ mở rộng giá ngày thường, cuối tuần và giá theo từng nhóm khách.',
    icon: '💳',
  },
  {
    id: 3,
    title: 'Theo dõi booking thuận tiện',
    description: 'Hỗ trợ luồng đặt tour, thanh toán và xác nhận dịch vụ nhất quán.',
    icon: '📋',
  },
  {
    id: 4,
    title: 'Hỗ trợ khách hàng nhanh',
    description: 'Phù hợp với nghiệp vụ liên hệ, phản hồi và chăm sóc sau chuyến đi.',
    icon: '🎧',
  },
]

export const reviewItems: ReviewItem[] = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    tour: 'Đà Nẵng - Hội An',
    rating: 5,
    comment: 'Giao diện rõ ràng, dễ xem thông tin tour và phù hợp để mở rộng phần đặt chỗ sau này.',
  },
  {
    id: 2,
    name: 'Trần Thu Hà',
    tour: 'Phú Quốc nghỉ dưỡng',
    rating: 5,
    comment: 'Các phần giá, lịch trình và hỗ trợ tư vấn được sắp xếp hợp lý như một website đặt tour thực tế.',
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    tour: 'Sapa săn mây',
    rating: 4,
    comment: 'Trang chủ tạo được cảm giác chuyên nghiệp và đúng hướng bài toán quản lý du lịch.',
  },
]
