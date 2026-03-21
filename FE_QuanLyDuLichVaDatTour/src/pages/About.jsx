import { Card, Typography } from 'antd'

const { Title, Paragraph } = Typography

export default function About() {
  return (
    <Card>
      <Title level={2}>Trang About</Title>
      <Paragraph>Đây là trang ví dụ cho React Router.</Paragraph>
    </Card>
  )
}