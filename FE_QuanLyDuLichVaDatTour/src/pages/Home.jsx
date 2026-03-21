import { Button, Card, Space, Typography, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useCounterStore } from '../store/counterStore'

const { Title, Text, Paragraph } = Typography

async function fetchTodo() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  if (!res.ok) throw new Error('Lỗi gọi API')
  return res.json()
}

export default function Home() {
  const { count, increase, decrease } = useCounterStore()

  const { data, isLoading, error } = useQuery({
    queryKey: ['todo'],
    queryFn: fetchTodo,
  })

  return (
    <Card>
      <Title level={2}>Trang Home</Title>

      <Text>Counter từ Zustand: {count}</Text>
      <br />
      <br />

      <Space>
        <Button type="primary" onClick={increase}>Tăng</Button>
        <Button danger onClick={decrease}>Giảm</Button>
      </Space>

      <br />
      <br />

      <Title level={4}>TanStack Query demo</Title>

      {isLoading && <Spin />}
      {error && <Text type="danger">Có lỗi khi gọi API</Text>}
      {data && <Paragraph>Todo title: {data.title}</Paragraph>}
    </Card>
  )
}