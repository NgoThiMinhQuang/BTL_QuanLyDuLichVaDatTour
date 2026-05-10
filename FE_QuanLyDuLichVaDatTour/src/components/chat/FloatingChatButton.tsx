import { useState, useEffect, useRef } from 'react'
import { Card, Input, Button, List, Typography, Empty, Tag } from 'antd'
import { MessageOutlined, CloseOutlined, CustomerServiceOutlined } from '@ant-design/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useAuthStore } from '../../store/authStore'
import { API_BASE_URL } from '../../constants/api'

const { Text } = Typography

interface Message {
  id: number
  bookingId: number | null
  nguoiGuiId: number
  hoTenNguoiGui: string
  vaiTro: string
  noiDung: string
  daDoc: boolean
  thoiGianGui: string
}

export function FloatingChatButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const token = useAuthStore(state => state.accessToken)
  const user = useAuthStore(state => state.currentUser)

  const { data, refetch } = useQuery({
    queryKey: ['chat-general-messages'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/tin-nhan/general`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Không thể tải tin nhắn')
      return response.json() as Promise<Message[]>
    },
    enabled: !!token && open,
    refetchInterval: 5000,
  })

  useEffect(() => {
    if (data) setMessages(data)
  }, [data])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMutation = useMutation({
    mutationFn: async (noiDung: string) => {
      const response = await fetch(`${API_BASE_URL}/tin-nhan/general`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ noiDung }),
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

  const isMyMessage = (msg: Message) => msg.nguoiGuiId === user?.id

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#1677ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(22, 119, 255, 0.4)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)' }}
        title="Hỗ trợ trực tuyến"
      >
        <MessageOutlined />
      </div>

      {open && (
        <Card
          title={
            <span>
              <CustomerServiceOutlined /> Hỗ trợ trực tuyến
            </span>
          }
          className="floating-chat-card"
          styles={{
            body: { padding: 0, display: 'flex', flexDirection: 'column', height: 500 },
            header: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0' },
          }}
          extra={<CloseOutlined onClick={() => setOpen(false)} />}
          style={{
            position: 'fixed',
            right: 24,
            bottom: 96,
            width: 380,
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderRadius: 12,
          }}
        >
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {!user ? (
              <Empty description="Vui lòng đăng nhập để chat" />
            ) : messages.length === 0 ? (
              <Empty description="Chưa có tin nhắn nào. Hãy gửi câu hỏi đầu tiên!" />
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
                        maxWidth: '80%',
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

          <div style={{ padding: 12, borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={!user ? "Đăng nhập để chat" : "Nhập tin nhắn..."}
              disabled={sendMutation.isPending || !user}
            />
            <Button
              type="primary"
              icon={<MessageOutlined />}
              loading={sendMutation.isPending}
              onClick={handleSend}
              disabled={!user}
            >
              Gửi
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}