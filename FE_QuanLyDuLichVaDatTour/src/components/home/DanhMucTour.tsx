import './DanhMucTour.css'
import { Alert, Button, Card, Col, Empty, Row, Skeleton, Typography } from 'antd'
import { useLoaiTour } from '../../services/tour/tour.hooks'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { 
  CompassOutlined, 
  CoffeeOutlined, 
  FlagOutlined, 
  GlobalOutlined, 
  AppstoreOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import React from 'react'

const { Paragraph, Title } = Typography

const getCategoryTheme = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('khám phá') || lowerName.includes('trải nghiệm')) {
    return { icon: <CompassOutlined />, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', shadow: 'rgba(59, 130, 246, 0.25)' };
  }
  if (lowerName.includes('nghỉ dưỡng') || lowerName.includes('resort') || lowerName.includes('biển')) {
    return { icon: <CoffeeOutlined />, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', shadow: 'rgba(245, 158, 11, 0.25)' };
  }
  if (lowerName.includes('trong nước') || lowerName.includes('nội địa')) {
    return { icon: <FlagOutlined />, color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', shadow: 'rgba(16, 185, 129, 0.25)' };
  }
  if (lowerName.includes('quốc tế') || lowerName.includes('nước ngoài')) {
    return { icon: <GlobalOutlined />, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', shadow: 'rgba(139, 92, 246, 0.25)' };
  }
  return { icon: <AppstoreOutlined />, color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', shadow: 'rgba(236, 72, 153, 0.25)' };
};

export function DanhMucTour() {
  const { data, error, isLoading, refetch } = useLoaiTour()

  return (
    <Card id="danh-muc-tour" className="home-section category-section" variant="borderless">
      <TieuDeMuc
        title="Khám phá theo phong cách du lịch bạn yêu thích"
        description="Từ nghỉ dưỡng, trải nghiệm gia đình đến hành trình khám phá, mỗi danh mục sẽ giúp bạn tìm tour phù hợp nhanh hơn."
      />

      {isLoading ? (
        <Row gutter={[20, 20]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col xs={24} md={12} xl={8} key={index}>
              <div className="category-modern-card skeleton">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : null}

      {!isLoading && error ? (
        <Alert
          type="error"
          showIcon
          title="Không tải được danh mục tour"
          description="Hãy kiểm tra backend đang chạy hoặc tải lại để xem các danh mục hiện có."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : null}

      {!isLoading && !error && data?.length === 0 ? <Empty description="Chưa có danh mục tour để hiển thị" /> : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <Row gutter={[20, 20]}>
          {data.map((item) => {
            const theme = getCategoryTheme(item.ten);
            
            return (
              <Col xs={24} md={12} xl={8} key={item.id}>
                <div 
                  className="category-modern-card group"
                  style={{ 
                    backgroundColor: theme.bg, 
                    borderColor: theme.border,
                    '--theme-color': theme.color,
                    '--theme-shadow': theme.shadow
                  } as React.CSSProperties}
                >
                  {/* Decorative background watermark */}
                  <div className="category-bg-icon">
                    {theme.icon}
                  </div>

                  <div className="category-card-header">
                    <div className={`category-status-tag ${item.trangThai === 'hoat_dong' ? 'active' : ''}`}>
                      {item.trangThai === 'hoat_dong' ? 'Đang mở' : item.trangThai}
                    </div>
                    <div className="category-card-icon">
                      {theme.icon}
                    </div>
                  </div>
                  
                  <div className="category-card-body">
                    <Title level={4} className="category-modern-title">
                      {item.ten}
                    </Title>
                    <Paragraph className="category-modern-description">
                      {item.moTa || 'Danh mục phù hợp để khám phá thêm các tour đang mở bán và lựa chọn hành trình phù hợp.'}
                    </Paragraph>
                  </div>
                  
                  <div className="category-card-footer">
                    <span className="category-action-text">Xem chi tiết</span>
                    <div className="category-action-icon-wrapper">
                      <ArrowRightOutlined className="category-action-icon" />
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : null}
    </Card>
  )
}
