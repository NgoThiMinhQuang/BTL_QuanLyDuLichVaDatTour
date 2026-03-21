import { Space, Typography } from 'antd'

const { Paragraph, Title } = Typography

interface SectionHeaderProps {
  title: string
  description: string
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <Space direction="vertical" size={4} className="section-header">
      <Title level={2} className="section-title">
        {title}
      </Title>
      <Paragraph className="section-description">{description}</Paragraph>
    </Space>
  )
}
