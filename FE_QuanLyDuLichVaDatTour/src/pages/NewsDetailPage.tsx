import './NewsDetailPage.css'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Button, Card, Divider, Spin, Tag, Typography } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, FolderOutlined, HomeOutlined, RightOutlined, UserOutlined } from '@ant-design/icons'
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
              { title: <Link to={PATHS.home}><HomeOutlined /> Trang chủ</Link> },
              { title: <Link to={PATHS.tinTuc}>Tin tức</Link> },
              { title: <span className="news-detail-breadcrumb-current">{item.tieuDe}</span> },
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
                <Text className="news-meta-item"><CalendarOutlined /> {formatDisplayDate(item.ngayDang)}</Text>
                <Text className="news-meta-item"><UserOutlined /> TravelViet</Text>
                <Text className="news-meta-item"><FolderOutlined /> {item.danhMuc ?? 'Tin tức'}</Text>
                <Text className="news-meta-item"><ClockCircleOutlined /> 5 phút đọc</Text>
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
                  <span className="news-detail-sidebar-label"><FolderOutlined /> Chuyên mục</span>
                  <span className="news-detail-sidebar-value">{item.danhMuc ?? 'Tin tức'}</span>
                </div>
                <Divider className="news-detail-sidebar-divider" />
                <div className="news-detail-sidebar-item">
                  <span className="news-detail-sidebar-label"><CalendarOutlined /> Ngày đăng</span>
                  <span className="news-detail-sidebar-value">{formatDisplayDate(item.ngayDang)}</span>
                </div>
                <Divider className="news-detail-sidebar-divider" />
                <div className="news-detail-sidebar-item">
                  <span className="news-detail-sidebar-label"><UserOutlined /> Tác giả</span>
                  <span className="news-detail-sidebar-value">TravelViet</span>
                </div>
              </div>
            </Card>

            <Card className="news-detail-sidebar-card news-detail-sidebar-highlight" variant="borderless">
              <Title level={4} className="news-detail-sidebar-title">Khám phá thêm</Title>
              <Paragraph className="news-detail-sidebar-text">
                Theo dõi thêm các cẩm nang, ưu đãi và điểm đến nổi bật để lên kế hoạch chuyến đi phù hợp hơn.
              </Paragraph>
              <Button type="primary" block className="news-detail-sidebar-button">
                <Link to={PATHS.tinTuc}>
                  Xem tất cả bài viết <RightOutlined />
                </Link>
              </Button>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
