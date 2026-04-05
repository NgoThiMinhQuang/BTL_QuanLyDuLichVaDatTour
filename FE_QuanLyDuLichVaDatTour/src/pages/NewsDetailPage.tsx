import './NewsDetailPage.css'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Card, Spin, Tag, Typography } from 'antd'
import { Link, useParams } from 'react-router'
import bannerImage from '../assets/Banner.jpg'
import { resolveApiAssetUrl } from '../constants/api'
import { layChiTietTinTuc } from '../services/tin-tuc/layChiTietTinTuc'
import { PATHS } from '../constants/paths'

const { Paragraph, Text, Title } = Typography

function formatDisplayDate(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString('vi-VN')
}

export default function TinTucChiTiet() {
  const { id } = useParams()
  const newsId = Number(id)
  const isValidId = Number.isInteger(newsId) && newsId > 0

  const query = useQuery({
    queryKey: ['tin-tuc', 'detail', newsId],
    queryFn: () => layChiTietTinTuc(newsId),
    enabled: isValidId,
  })

  if (!isValidId) {
    return <div className="news-page news-page-state">Tin tức không hợp lệ.</div>
  }

  if (query.isLoading) {
    return (
      <div className="news-page news-page-state">
        <Spin size="large" />
      </div>
    )
  }

  if (query.isError || !query.data) {
    return <div className="news-page news-page-state">Không thể tải chi tiết tin tức.</div>
  }

  const item = query.data
  const imageUrl = resolveApiAssetUrl(item.anhDaiDien) ?? bannerImage

  return (
    <div className="news-page news-detail-page">
      <section className="news-detail-hero">
        <div className="news-detail-hero-inner">
          <Breadcrumb
            className="news-detail-breadcrumb"
            items={[
              { title: <Link to={PATHS.home}>Trang chủ</Link> },
              { title: <Link to={PATHS.tinTuc}>Tin tức</Link> },
              { title: item.tieuDe },
            ]}
          />
          <Tag className="news-detail-hero-tag">{item.danhMuc ?? 'Tin tức'}</Tag>
          <Title className="news-detail-hero-title">{item.tieuDe}</Title>
          <Paragraph className="news-detail-hero-description">
            {item.tomTat ?? 'Cập nhật những thông tin mới nhất từ TravelViet.'}
          </Paragraph>
        </div>
      </section>

      <div className="news-page-container news-detail-container">
        <div className="news-detail-layout">
          <article className="news-detail-card">
            <img src={imageUrl} alt={item.tieuDe} className="news-detail-image" />

            <div className="news-detail-body">
              <div className="news-detail-meta">
                <Text className="news-meta-item">📅 {formatDisplayDate(item.ngayDang)}</Text>
                <Text className="news-meta-item">👤 TravelViet</Text>
              </div>

              {item.tomTat ? <Paragraph className="news-detail-summary">{item.tomTat}</Paragraph> : null}

              <div
                className="news-detail-content"
                dangerouslySetInnerHTML={{ __html: item.noiDung }}
              />
            </div>
          </article>

          <aside className="news-detail-sidebar">
            <Card className="news-detail-sidebar-card" variant="borderless">
              <Title level={4} className="news-detail-sidebar-title">Thông tin bài viết</Title>
              <div className="news-detail-sidebar-list">
                <div className="news-detail-sidebar-item">
                  <span className="news-detail-sidebar-label">Chuyên mục</span>
                  <span className="news-detail-sidebar-value">{item.danhMuc ?? 'Tin tức'}</span>
                </div>
                <div className="news-detail-sidebar-item">
                  <span className="news-detail-sidebar-label">Ngày đăng</span>
                  <span className="news-detail-sidebar-value">{formatDisplayDate(item.ngayDang)}</span>
                </div>
                <div className="news-detail-sidebar-item">
                  <span className="news-detail-sidebar-label">Tác giả</span>
                  <span className="news-detail-sidebar-value">TravelViet</span>
                </div>
              </div>
            </Card>

            <Card className="news-detail-sidebar-card news-detail-sidebar-highlight" variant="borderless">
              <Title level={4} className="news-detail-sidebar-title">Khám phá thêm</Title>
              <Paragraph className="news-detail-sidebar-text">
                Theo dõi thêm các cẩm nang, ưu đãi và điểm đến nổi bật để lên kế hoạch chuyến đi phù hợp hơn.
              </Paragraph>
              <Link to={PATHS.tinTuc} className="news-detail-sidebar-link">
                Xem tất cả bài viết →
              </Link>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
