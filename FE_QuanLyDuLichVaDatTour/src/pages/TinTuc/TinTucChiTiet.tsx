import './TinTuc.css'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Spin, Tag, Typography } from 'antd'
import { Link, useParams } from 'react-router'
import bannerImage from '../../assets/Banner.jpg'
import { resolveApiAssetUrl } from '../../constant/api'
import { layChiTietTinTuc } from '../../services/tin-tuc/layChiTietTinTuc'
import { PATHS } from '../../paths'

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
      <section className="news-hero">
        <div className="news-hero-inner">
          <Breadcrumb
            className="news-detail-breadcrumb"
            items={[
              { title: <Link to={PATHS.home}>Trang chủ</Link> },
              { title: <Link to={PATHS.tinTuc}>Tin tức</Link> },
              { title: item.tieuDe },
            ]}
          />
          <Title className="news-hero-title">{item.tieuDe}</Title>
          <Paragraph className="news-hero-description">
            {item.tomTat ?? 'Cập nhật những thông tin mới nhất từ TravelViet.'}
          </Paragraph>
        </div>
      </section>

      <div className="news-page-container">
        <article className="news-detail-card">
          <img src={imageUrl} alt={item.tieuDe} className="news-detail-image" />

          <div className="news-detail-body">
            <div className="news-detail-meta">
              <Tag className="news-card-category">{item.danhMuc ?? 'Tin tức'}</Tag>
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
      </div>
    </div>
  )
}
