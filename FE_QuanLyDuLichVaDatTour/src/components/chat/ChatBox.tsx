import { useState, useEffect, useRef } from 'react'
import { Card, Input, Button, List, Typography, Spin, Empty, Tag } from 'antd'
import { SendOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useAuthStore } from '../../store/authStore'
import { API_BASE_URL } from '../../constants/api'

const { Text } = Typography

interface Message {
  id: number
  bookingId: number
  nguoiGuiId: number
  hoTenNguoiGui: string
  vaiTro: string
  noiDung: string
  daDoc: boolean
  thoiGianGui: string
}

interface ChatBoxProps {
  bookingId: number
}

export function ChatBox({ bookingId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const token = useAuthStore.getState().accessToken

  const currentUserId = useAuthStore(state => state.user?.id)

  // Fetch messages every 5 seconds
  const { data, refetch } = useQuery({
    queryKey: ['chat-messages', bookingId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/tin-nhan/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Không thể tải tin nhắn')
      return response.json() as Promise<Message[]>
    },
    refetchInterval: 5000,
    enabled: !!token,
  })

  useEffect(() => {
    if (data) setMessages(data)
  }, [data])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMutation = useMutation({
    mutationFn: async (noiDung: string) => {
      const response = await fetch(`${API_BASE_URL}/api/tin-nhan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, noiDung }),
      })
      if (!response.ok) throw new Error('Gửi tin nhắn thất bại')
      return response.json() as Promise<Message>
    },
    onSuccess: (newMsg) => {
      setMessages(prev => [...prev, newMsg])
      setNewMessage('')
    },
  })

  const handleSend = () => {
    if (!newMessage.trim()) return
    sendMutation.mutate(newMessage.trim())
  }

  const isMyMessage = (msg: Message) => msg.nguoiGuiId === currentUserId

  return (
    <Card
      title={
        <span>
          <CustomerServiceOutlined /> Hỗ trợ trực tuyến
        </span>
      }
      className="chat-box-card"
      styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: 500 } }}
    >
      {/* Messages List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.length === 0 ? (
          <Empty description="Chưa có tin nhắn nào" />
        ) : (
          <List
            dataSource={messages}
            renderItem={(msg) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: isMyMessage(msg) ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    background: isMyMessage(msg) ? '#1677ff' : '#f5f5f5',
                    color: isMyMessage(msg) ? 'white' : 'black',
                    padding: '10px 14px',
                    borderRadius: 12,
                    borderTopLeftRadius: !isMyMessage(msg) ? 4 : 12,
                    borderTopRightRadius: isMyMessage(msg) ? 4 : 12,
                  }}
                >
                  {!isMyMessage(msg) && (
                    <Text strong style={{ color: '#1677ff', fontSize: 12, display: 'block', marginBottom: 4 }}>
                      {msg.hoTenNguoiGui} {msg.vaiTro === 'Admin' && <Tag color="red">Admin</Tag>}
                    </Text>
                  )}
                  <Text style={{ color: isMyMessage(msg) ? 'white' : 'inherit' }}>{msg.noiDung}</Text>
                  <div style={{ textAlign: 'right', marginTop: 4 }}>
                    <Text style={{ fontSize: 11, opacity: 0.7 }}>
                      {dayjs(msg.thoiGianGui).format('HH:mm DD/MM/YYYY')}
                    </Text>
                  </div>
                </div>
              </div>
            )}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: 12, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Nhập tin nhắn..."
          disabled={sendMutation.isPending}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={sendMutation.isPending}
          onClick={handleSend}
        >
          Gửi
        </Button>
      </div>
    </Card>
  )
}
