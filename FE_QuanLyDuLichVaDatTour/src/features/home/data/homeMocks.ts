import type { BenefitItem, HeroStat, ReviewItem, SearchSuggestion } from '../types/home'

export const heroStats: HeroStat[] = [
  { id: 1, label: 'Hành trình nổi bật', value: '500+' },
  { id: 2, label: 'Khách hàng tin chọn', value: '10K+' },
  { id: 3, label: 'Điểm đến hấp dẫn', value: '50+' },
]

export const searchSuggestions: SearchSuggestion[] = [
  { id: 1, label: 'Điểm đến nổi bật', value: 'Đà Nẵng' },
  { id: 2, label: 'Loại trải nghiệm', value: 'Tour nghỉ dưỡng' },
  { id: 3, label: 'Khởi hành gợi ý', value: 'Cuối tuần này' },
]

export const benefitItems: BenefitItem[] = [
  {
    id: 1,
    title: 'Lịch trình rõ ràng',
    description: 'Dễ xem từng ngày trong tour để biết hành trình, thời gian và điểm dừng nổi bật trước khi đặt.',
    icon: '🗓️',
  },
  {
    id: 2,
    title: 'Khởi hành linh hoạt',
    description: 'Theo dõi các đợt khởi hành sắp tới để chủ động chọn thời gian phù hợp với gia đình hoặc nhóm bạn.',
    icon: '🧳',
  },
  {
    id: 3,
    title: 'Giá minh bạch',
    description: 'Thông tin giá được hiển thị rõ ràng để bạn dễ so sánh tour, ngân sách và kế hoạch chuyến đi.',
    icon: '💳',
  },
  {
    id: 4,
    title: 'Hỗ trợ nhanh chóng',
    description: 'Luôn sẵn sàng hỗ trợ tư vấn tour, chọn lịch khởi hành và giải đáp các bước đặt chuyến đi phù hợp.',
    icon: '🎧',
  },
]

export const reviewItems: ReviewItem[] = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    tour: 'Đà Nẵng - Hội An',
    rating: 5,
    comment: 'Trang chủ dễ nhìn, xem tour nhanh và phần lịch khởi hành giúp mình chọn chuyến phù hợp mà không bị rối.',
  },
  {
    id: 2,
    name: 'Trần Thu Hà',
    tour: 'Phú Quốc nghỉ dưỡng',
    rating: 5,
    comment: 'Mình thích cách hiển thị tour nổi bật và ưu đãi, cảm giác giống một website đặt tour thực tế hơn nhiều.',
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    tour: 'Sapa săn mây',
    rating: 4,
    comment: 'Giao diện hiện đại, rõ ràng và hợp với nhu cầu xem nhanh điểm đến, thời lượng tour và các đợt khởi hành gần nhất.',
  },
]
