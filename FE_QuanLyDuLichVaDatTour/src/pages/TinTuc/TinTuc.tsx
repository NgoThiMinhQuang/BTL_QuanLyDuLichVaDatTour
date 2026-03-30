import './TinTuc.css'
import { Input, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { TourPhanTrang } from '../../components/common/TourPhanTrang'
import bannerImage from '../../assets/Banner.jpg'

const { Paragraph, Text, Title } = Typography

const NEWS_PAGE_SIZE = 6
const categoryOptions = ['Tất cả', 'Cẩm nang du lịch', 'Điểm đến', 'Văn hóa', 'Ẩm thực', 'Sự kiện'] as const

const newsItems = [
  {
    id: 1,
    category: 'Điểm đến',
    title: 'Top 10 điểm đến hấp dẫn nhất Việt Nam năm 2026',
    excerpt: 'Khám phá những địa điểm du lịch tuyệt vời nhất Việt Nam với vẻ đẹp thiên nhiên hoang sơ và văn hóa đặc sắc.',
    author: 'Nguyễn Văn A',
    date: '20/3/2026',
    featured: true,
  },
  {
    id: 2,
    category: 'Cẩm nang du lịch',
    title: 'Mẹo săn vé máy bay giá tốt cho mùa hè',
    excerpt: 'Những mẹo nhỏ giúp bạn tiết kiệm chi phí khi đặt tour du lịch mà vẫn đảm bảo chất lượng trải nghiệm.',
    author: 'Trần Thị B',
    date: '18/3/2026',
    featured: false,
  },
  {
    id: 3,
    category: 'Ẩm thực',
    title: 'Hành trình khám phá ẩm thực đường phố Sài Gòn',
    excerpt: 'Khám phá những món ăn đường phố đặc sắc và hấp dẫn tại Sài Gòn dành cho tín đồ ẩm thực.',
    author: 'Lê Văn C',
    date: '15/3/2026',
    featured: false,
  },
  {
    id: 4,
    category: 'Sự kiện',
    title: 'Lễ hội hoa anh đào Đà Lạt năm nay có gì đặc biệt?',
    excerpt: 'Thông tin chi tiết về lễ hội hoa anh đào năm nay tại thành phố Đà Lạt cùng các hoạt động nổi bật.',
    author: 'Phạm Thị D',
    date: '12/3/2026',
    featured: false,
  },
  {
    id: 5,
    category: 'Cẩm nang du lịch',
    title: 'Bí quyết chụp ảnh du lịch đẹp như chuyên nghiệp',
    excerpt: 'Những mẹo nhỏ giúp bạn có những bức ảnh du lịch đẹp mắt và ấn tượng trong mọi hành trình.',
    author: 'Hoàng Văn E',
    date: '10/3/2026',
    featured: false,
  },
  {
    id: 6,
    category: 'Văn hóa',
    title: 'Văn hóa làng nghề truyền thống Việt Nam',
    excerpt: 'Tìm hiểu về nét đẹp văn hóa và nghề thủ công truyền thống của người Việt qua các làng nghề nổi tiếng.',
    author: 'Ngô Thị F',
    date: '8/3/2026',
    featured: false,
  },
  {
    id: 7,
    category: 'Điểm đến',
    title: 'Khám phá mùa nước nổi miền Tây',
    excerpt: 'Trải nghiệm vẻ đẹp sông nước và những hoạt động thú vị khi du lịch miền Tây vào mùa nước nổi.',
    author: 'Bùi Văn G',
    date: '5/3/2026',
    featured: false,
  },
]

export default function TinTuc() {
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryOptions)[number]>('Tất cả')
  const [page, setPage] = useState(1)

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return newsItems.filter((item) => {
      const matchesCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        item.title.toLowerCase().includes(normalizedKeyword) ||
        item.excerpt.toLowerCase().includes(normalizedKeyword)

      return matchesCategory && matchesKeyword
    })
  }, [keyword, selectedCategory])

  const featuredItem = filteredItems.find((item) => item.featured) ?? filteredItems[0]
  const regularItems = filteredItems.filter((item) => item.id !== featuredItem?.id)
  const paginatedItems = regularItems.slice((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE)

  const handleCategoryChange = (category: (typeof categoryOptions)[number]) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  return (
    <div className="news-page">
      <section className="news-hero">
        <div className="news-hero-inner">
          <Title className="news-hero-title">Tin tức & Cẩm nang du lịch</Title>
          <Paragraph className="news-hero-description">
            Cập nhật những thông tin mới nhất về du lịch, điểm đến và mẹo hữu ích cho chuyến đi của bạn
          </Paragraph>
        </div>
      </section>

      <div className="news-page-container">
        <section className="news-toolbar">
          <Input.Search
            value={keyword}
            onChange={(event) => handleKeywordChange(event.target.value)}
            placeholder="Tìm kiếm bài viết..."
            allowClear
            enterButton={false}
            size="large"
            className="news-search-input"
          />

          <div className="news-chip-list">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                className={`news-chip ${selectedCategory === category ? 'news-chip-active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {featuredItem ? (
          <article className="news-featured-card">
            <div className="news-featured-image-wrap">
              <img src={bannerImage} alt={featuredItem.title} className="news-featured-image" />
              <Tag className="news-featured-badge">Nổi bật</Tag>
            </div>

            <div className="news-featured-content">
              <Text className="news-featured-category">🏷 {featuredItem.category}</Text>
              <Title className="news-featured-title">{featuredItem.title}</Title>
              <Paragraph className="news-featured-excerpt">{featuredItem.excerpt}</Paragraph>

              <div className="news-meta-row">
                <Text className="news-meta-item">👤 {featuredItem.author}</Text>
                <Text className="news-meta-item">📅 {featuredItem.date}</Text>
              </div>

              <button type="button" className="news-link-button">
                Đọc thêm →
              </button>
            </div>
          </article>
        ) : null}

        <section className="news-grid">
          {paginatedItems.map((item) => (
            <article key={item.id} className="news-card">
              <div className="news-card-image-wrap">
                <img src={bannerImage} alt={item.title} className="news-card-image" />
                <Tag className="news-card-category">{item.category}</Tag>
              </div>

              <div className="news-card-body">
                <Title level={3} className="news-card-title">
                  {item.title}
                </Title>
                <Paragraph className="news-card-excerpt">{item.excerpt}</Paragraph>

                <div className="news-meta-row news-meta-row-compact">
                  <Text className="news-meta-item">👤 {item.author}</Text>
                  <Text className="news-meta-item">📅 {item.date}</Text>
                </div>

                <button type="button" className="news-outline-button">
                  Đọc thêm
                </button>
              </div>
            </article>
          ))}
        </section>

        {regularItems.length > NEWS_PAGE_SIZE ? (
          <TourPhanTrang current={page} pageSize={NEWS_PAGE_SIZE} total={regularItems.length} onChange={setPage} />
        ) : null}
      </div>
    </div>
  )
}
