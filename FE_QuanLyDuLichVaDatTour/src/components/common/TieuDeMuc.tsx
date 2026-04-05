import { Space, Typography } from 'antd'

const { Paragraph, Title } = Typography

interface TieuDeMucProps {
  title: string
  description: string
}

export function TieuDeMuc({ title, description }: TieuDeMucProps) {
  return (
    <Space direction="vertical" size={10} className="section-header">
      <Title className="section-title">{title}</Title>
      <Paragraph className="section-description">{description}</Paragraph>
    </Space>
  )
}
