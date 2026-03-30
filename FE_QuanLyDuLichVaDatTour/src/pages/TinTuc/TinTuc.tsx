import './TinTuc.css'
import { Input, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { getTinTucChiTietPath } from '../../paths'
import bannerImage from '../../assets/Banner.jpg'
import { TourPhanTrang } from '../../components/common/TourPhanTrang'
import { resolveApiAssetUrl } from '../../constant/api'
import { TIN_TUC_PAGE_SIZE, useTinTucPage } from '../../services/tin-tuc/useTinTucPage'

const { Paragraph, Text, Title } = Typography

function formatDisplayDate(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString('vi-VN')
}

function getSummary(summary: string | null, content: string) {
  if (summary?.trim()) {
    return summary
  }

  return `${content.replace(/<[^>]+>/g, '').slice(0, 160).trim()}...`
}

export default function TinTuc() {
  const {
    data,
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
    return <div className="news-page news-page-state">Đang tải tin tức...</div>
  }

  if (isError) {
    return <div className="news-page news-page-state">Không thể tải danh sách tin tức.</div>
  }

  if (!data || data.length === 0) {
    return <div className="news-page news-page-state">Chưa có tin tức để hiển thị.</div>
  }

  if (!featuredItem) {
    return <div className="news-page news-page-state">Không tìm thấy tin tức phù hợp.</div>
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

        <article className="news-featured-card">
          <div className="news-featured-image-wrap">
            <img src={getImageUrl(featuredItem.anhDaiDien)} alt={featuredItem.tieuDe} className="news-featured-image" />
            <Tag className="news-featured-badge">Nổi bật</Tag>
          </div>

          <div className="news-featured-content">
            <Text className="news-featured-category">🏷 {featuredItem.danhMuc ?? 'Tin tức'}</Text>
            <Title className="news-featured-title">{featuredItem.tieuDe}</Title>
            <Paragraph className="news-featured-excerpt">{getSummary(featuredItem.tomTat, featuredItem.noiDung)}</Paragraph>

            <div className="news-meta-row">
              <Text className="news-meta-item">👤 TravelViet</Text>
              <Text className="news-meta-item">📅 {formatDisplayDate(featuredItem.ngayDang)}</Text>
            </div>

            <Link to={getTinTucChiTietPath(featuredItem.id)} className="news-link-button">
              Đọc thêm →
            </Link>
          </div>
        </article>

        <section className="news-grid">
          {paginatedItems.map((item) => (
            <article key={item.id} className="news-card">
              <div className="news-card-image-wrap">
                <img src={getImageUrl(item.anhDaiDien)} alt={item.tieuDe} className="news-card-image" />
                <Tag className="news-card-category">{item.danhMuc ?? 'Tin tức'}</Tag>
              </div>

              <div className="news-card-body">
                <Title level={3} className="news-card-title">
                  {item.tieuDe}
                </Title>
                <Paragraph className="news-card-excerpt">{getSummary(item.tomTat, item.noiDung)}</Paragraph>

                <div className="news-meta-row news-meta-row-compact">
                  <Text className="news-meta-item">👤 TravelViet</Text>
                  <Text className="news-meta-item">📅 {formatDisplayDate(item.ngayDang)}</Text>
                </div>

                <Link to={getTinTucChiTietPath(item.id)} className="news-outline-button">
                  Đọc thêm
                </Link>
              </div>
            </article>
          ))}
        </section>

        {regularItems.length > TIN_TUC_PAGE_SIZE ? (
          <TourPhanTrang current={page} pageSize={TIN_TUC_PAGE_SIZE} total={regularItems.length} onChange={setPage} />
        ) : null}
      </div>
    </div>
  )
}
