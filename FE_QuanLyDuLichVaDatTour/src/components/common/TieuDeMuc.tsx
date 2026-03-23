import { Space, Typography } from 'antd'

const { Paragraph, Title } = Typography

interface TieuDeMucProps {
  title: string
  description: string
}

export function TieuDeMuc({ title, description }: TieuDeMucProps) {
  return (
    <Space direction="vertical" size={4} className="section-header">
      <Title level={2} className="section-title">
        {title}
      </Title>
      <Paragraph className="section-description">{description}</Paragraph>
    </Space>
  )
}
