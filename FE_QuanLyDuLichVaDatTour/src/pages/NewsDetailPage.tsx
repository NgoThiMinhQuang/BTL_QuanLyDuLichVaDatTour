import './NewsDetailPage.css'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Spin, Tag, Typography } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, HomeOutlined, RightOutlined, UserOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router'
import bannerImage from '../assets/Banner.jpg'
import { resolveApiAssetUrl } from '../constants/api'
import { layChiTietTinTuc } from '../services/tin-tuc/layChiTietTinTuc'
import { PATHS } from '../constants/paths'

const { Paragraph, Title } = Typography

function formatDisplayDate(value: string) {
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return value
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

  if (!isValidId) return <div className="news-page news-page-state">Tin tức không hợp lệ.</div>
  if (query.isLoading) return <div className="news-page news-page-state"><Spin size="large" /></div>
  if (query.isError || !query.data) return <div className="news-page news-page-state">Không thể tải chi tiết tin tức.</div>

  const item = query.data
  const imageUrl = resolveApiAssetUrl(item.anhDaiDien) ?? bannerImage

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <div className="news-page news-detail-page">
      <div className="news-detail-shell">
        <div className="news-detail-topbar">
          <Link to={PATHS.tinTuc} className="news-detail-back-link">
            <RightOutlined /> Tin tức
          </Link>
          <span className="news-detail-topbar-meta">Cẩm nang du lịch</span>
        </div>

        <section className="news-detail-hero-card">
          <div className="news-detail-hero-media">
            <img src={imageUrl} alt={item.tieuDe} className="news-detail-hero-image" />
          </div>

          <div className="news-detail-hero-copy">
            <Tag className="news-detail-hero-chip">{item.danhMuc ?? 'Kinh nghiệm'}</Tag>
            <div className="news-detail-kicker">
              <span className="news-detail-kicker-item"><CalendarOutlined /> {formatDisplayDate(item.ngayDang)}</span>
              <span className="news-detail-kicker-item"><ClockCircleOutlined /> {calculateReadingTime(item.noiDung)} phút đọc</span>
              <span className="news-detail-kicker-item"><UserOutlined /> TravelViet Team</span>
            </div>
            <Title className="news-detail-title">{item.tieuDe}</Title>
            <Paragraph className="news-detail-summary">
              {item.tomTat ?? 'Khám phá những câu chuyện thú vị và kinh nghiệm quý báu cho hành trình của bạn.'}
            </Paragraph>
          </div>
        </section>

        <section className="news-detail-grid">
          <article className="news-detail-article">
            <div className="news-detail-content" dangerouslySetInnerHTML={{ __html: item.noiDung }} />
          </article>

          <aside className="news-detail-aside">
            <Card className="news-detail-card news-detail-card-compact" variant="borderless">
              <Title level={4} className="news-detail-card-title">Thông tin bài viết</Title>
              <div className="news-detail-info-list">
                <div className="news-detail-info-row"><span>Chuyên mục</span><strong>{item.danhMuc ?? 'Tin tức'}</strong></div>
                <div className="news-detail-info-row"><span>Ngày xuất bản</span><strong>{formatDisplayDate(item.ngayDang)}</strong></div>
                <div className="news-detail-info-row"><span>Thời gian đọc</span><strong>{calculateReadingTime(item.noiDung)} phút</strong></div>
              </div>
            </Card>

            <Card className="news-detail-card news-detail-card-accent" variant="borderless">
              <Title level={4} className="news-detail-card-title news-detail-card-title-light">Khám phá thêm</Title>
              <Paragraph className="news-detail-card-text">
                Xem thêm các bài viết khác để chuẩn bị tốt hơn cho chuyến đi.
              </Paragraph>
              <Button type="primary" block className="news-detail-cta">
                <Link to={PATHS.tinTuc}>Tất cả bài viết <RightOutlined /></Link>
              </Button>
            </Card>
          </aside>
        </section>
      </div>
    </div>
  )
}
