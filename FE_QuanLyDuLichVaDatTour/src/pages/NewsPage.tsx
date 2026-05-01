import './NewsPage.css'
import { Input, Tag, Typography, Empty, Spin } from 'antd'
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
  TagOutlined
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

  if (isLoading) {
    return (
      <div className="news-page-loading">
        <Spin size="large" description="Đang tải tin tức du lịch..." />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="news-page-empty">
        <Empty 
          description="Không thể tải danh sách tin tức. Vui lòng thử lại sau." 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  return (
    <div className="news-page">
      {/* Hero Section */}
      <section className="news-hero">
        <div className="news-hero-overlay" />
        <div className="news-hero-content">
          <Tag className="news-hero-badge">CẨM NANG DU LỊCH</Tag>
          <Title className="news-hero-title">Khám Phá Thế Giới <br/> Qua Từng Trang Viết</Title>
          <Paragraph className="news-hero-description">
            Cập nhật những thông tin mới nhất về du lịch, điểm đến văn hóa và mẹo hữu ích cho hành trình trọn vẹn của bạn.
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
              placeholder="Tìm bài viết, mẹo du lịch..."
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
            <Empty description="Không tìm thấy bài viết nào phù hợp với tìm kiếm của bạn." />
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredItem && (
              <article className="news-featured-card">
                <div className="featured-image-container">
                  <img src={getImageUrl(featuredItem.anhDaiDien)} alt={featuredItem.tieuDe} className="featured-image" />
                  <div className="featured-overlay" />
                  <Tag className="featured-tag">Nổi bật</Tag>
                </div>

                <div className="featured-content">
                  <div className="featured-meta-top">
                    <TagOutlined className="meta-icon" />
                    <span className="featured-category">{featuredItem.danhMuc || 'Tin tức'}</span>
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
                      <span>Quản trị viên</span>
                    </div>
                    <div className="featured-date">
                      <CalendarOutlined className="footer-icon" />
                      <span>{formatDisplayDate(featuredItem.ngayDang)}</span>
                    </div>
                    <Link to={getTinTucChiTietPath(featuredItem.id)} className="featured-read-more">
                      Chi tiết <ArrowRightOutlined />
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
                    <img src={getImageUrl(item.anhDaiDien)} alt={item.tieuDe} className="article-image" />
                    <Tag className="article-tag">{item.danhMuc || 'Du lịch'}</Tag>
                  </div>

                  <div className="article-info">
                    <div className="article-meta">
                      <span className="article-date">
                        <CalendarOutlined /> {formatDisplayDate(item.ngayDang)}
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
                        Xem bài viết <ArrowRightOutlined />
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
