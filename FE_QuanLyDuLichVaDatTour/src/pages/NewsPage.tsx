import './NewsPage.css'
import { Input, Tag, Typography, Empty, Spin, Divider, Button } from 'antd'
import { Link } from 'react-router'
import { getTinTucChiTietPath } from '../constants/paths'
import bannerImage from '../assets/Banner.jpg'
import { TourPhanTrang } from '../components/common/TourPhanTrang'
import { resolveApiAssetUrl } from '../constants/api'
import { TIN_TUC_PAGE_SIZE, useTinTucPage } from '../services/tin-tuc/useTinTucPage'
import { 
  UserOutlined, 
  CalendarOutlined, 
  ArrowRightOutlined,
  SearchOutlined,
  TagOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

const { Paragraph, Text, Title } = Typography

function formatDisplayDate(value: string) {
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value
  return parsedDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getSummary(summary: string | null, content: string) {
  if (summary?.trim()) return summary
  return `${content.replace(/<[^>]+>/g, '').slice(0, 160).trim()}...`
}

export default function TinTuc() {
  const {
    isLoading,
    isError,
    keyword,
    selectedCategory,
    page,
    categoryOptions,
    featuredItem,
    regularItems,
    paginatedItems,
    setKeyword,
    setSelectedCategory,
    setPage,
  } = useTinTucPage()

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  const getImageUrl = (path?: string | null) => resolveApiAssetUrl(path) ?? bannerImage

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  if (isLoading) {
    return (
      <div className="news-page-loading">
        <Spin size="large" />
        <Text strong>Đang tải cẩm nang du lịch...</Text>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="news-page-empty">
        <Empty 
          description="Rất tiếc, không thể tải danh sách tin tức vào lúc này." 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero">
        <div className="news-hero-overlay" />
        <div className="news-hero-content">
          <Tag className="news-hero-badge">Cẩm Nang Du Lịch</Tag>
          <Title className="news-hero-title">Hành Trình Khám Phá <br/> Bắt Đầu Từ Đây</Title>
          <Paragraph className="news-hero-description">
            Cung cấp những thông tin mới nhất, mẹo du lịch hữu ích và những câu chuyện truyền cảm hứng cho chuyến đi của bạn.
          </Paragraph>
        </div>
      </section>

      <div className="news-page-main">
        {/* Search & Filter Toolbar */}
        <section className="news-toolbar">
          <div className="news-search-box">
            <Input
              prefix={<SearchOutlined className="search-icon" />}
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="Tìm kiếm bài viết, mẹo du lịch..."
              variant="borderless"
              className="news-search-field"
            />
          </div>

          <div className="news-categories">
            {categoryOptions.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {!featuredItem && !isLoading ? (
          <div className="news-no-results">
            <Empty description="Không tìm thấy bài viết nào phù hợp." />
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredItem && (
              <article className="news-featured-card">
                <div className="featured-image-container">
                  <img src={getImageUrl(featuredItem.anhDaiDien)} alt={featuredItem.tieuDe} className="featured-image" />
                  <Tag className="featured-tag">Tiêu điểm</Tag>
                </div>

                <div className="featured-content">
                  <div className="featured-meta-top">
                    <TagOutlined />
                    <span>{featuredItem.danhMuc || 'Tin tức'}</span>
                    <Divider type="vertical" />
                    <ClockCircleOutlined />
                    <span>{calculateReadingTime(featuredItem.noiDung)} phút đọc</span>
                  </div>
                  
                  <Title className="featured-title">
                    <Link to={getTinTucChiTietPath(featuredItem.id)}>{featuredItem.tieuDe}</Link>
                  </Title>
                  
                  <Paragraph className="featured-excerpt" ellipsis={{ rows: 3 }}>
                    {getSummary(featuredItem.tomTat, featuredItem.noiDung)}
                  </Paragraph>

                  <div className="featured-footer">
                    <div className="featured-author">
                      <UserOutlined className="footer-icon" />
                      <span>TravelViet Editor</span>
                    </div>
                    <div className="featured-date">
                      <CalendarOutlined className="footer-icon" />
                      <span>{formatDisplayDate(featuredItem.ngayDang)}</span>
                    </div>
                    <Link to={getTinTucChiTietPath(featuredItem.id)} className="featured-read-more">
                      Xem chi tiết <ArrowRightOutlined />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* News Grid */}
            <section className="news-articles-grid">
              {paginatedItems.map((item) => (
                <article key={item.id} className="article-card">
                  <div className="article-image-box">
                    <Link to={getTinTucChiTietPath(item.id)}>
                      <img src={getImageUrl(item.anhDaiDien)} alt={item.tieuDe} className="article-image" />
                    </Link>
                    <Tag className="article-tag">{item.danhMuc || 'Du lịch'}</Tag>
                  </div>

                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-date">
                        <CalendarOutlined /> {formatDisplayDate(item.ngayDang)}
                        <Divider type="vertical" />
                        <ClockCircleOutlined /> {calculateReadingTime(item.noiDung)}'
                      </span>
                    </div>
                    
                    <Title level={4} className="article-title">
                      <Link to={getTinTucChiTietPath(item.id)}>{item.tieuDe}</Link>
                    </Title>
                    
                    <Paragraph className="article-summary" ellipsis={{ rows: 2 }}>
                      {getSummary(item.tomTat, item.noiDung)}
                    </Paragraph>

                    <div className="article-footer">
                      <Link to={getTinTucChiTietPath(item.id)} className="article-link">
                        Đọc tiếp <ArrowRightOutlined />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Pagination */}
            {regularItems.length > TIN_TUC_PAGE_SIZE ? (
              <div className="news-pagination-wrap">
                <TourPhanTrang 
                  current={page} 
                  pageSize={TIN_TUC_PAGE_SIZE} 
                  total={regularItems.length} 
                  onChange={setPage} 
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

