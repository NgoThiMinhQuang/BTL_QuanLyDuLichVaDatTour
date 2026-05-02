import { Alert, Button, Form, Input, Rate, Space, Typography } from 'antd'
import { useState } from 'react'
import { MessageOutlined, SendOutlined } from '@ant-design/icons'
import { taoDanhGia } from '../../services/review/review'

const { Paragraph, Title, Text } = Typography
const { TextArea } = Input

interface ReviewFormProps {
  bookingId: number
  tenTour: string
  onSuccess: () => void
}

interface ReviewFormValues {
  soSao: number
  noiDung: string
}

export function ReviewForm({ bookingId, tenTour, onSuccess }: ReviewFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (values: ReviewFormValues) => {
    try {
      setSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      await taoDanhGia({
        bookingId,
        soSao: values.soSao,
        noiDung: values.noiDung,
      })

      setSuccessMessage('Đánh giá của bạn đã được ghi nhận. Cảm ơn bạn đã chia sẻ!')
      onSuccess()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể gửi đánh giá')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <div className="header-icon-box">
          <MessageOutlined className="header-icon" />
        </div>
        <div>
          <Title level={3} className="review-form-title">Đánh giá chuyến đi</Title>
          <Paragraph className="review-form-subtitle">
            Bạn thấy thế nào về tour <Text strong>{tenTour}</Text>?
          </Paragraph>
        </div>
      </div>

      {errorMessage ? <Alert type="error" showIcon title={errorMessage} className="review-alert" /> : null}
      {successMessage ? <Alert type="success" showIcon title={successMessage} className="review-alert" /> : null}

      {!successMessage && (
        <Form layout="vertical" onFinish={handleSubmit} className="custom-review-form">
          <Form.Item 
            label={<Text className="form-label">Chất lượng tour</Text>} 
            name="soSao" 
            rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
          >
            <Rate className="form-rate" />
          </Form.Item>
          
          <Form.Item 
            label={<Text className="form-label">Cảm nhận của bạn</Text>} 
            name="noiDung" 
            rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}
          >
            <TextArea 
              rows={4} 
              maxLength={2000} 
              placeholder="Hãy chia sẻ những điều bạn thích hoặc góp ý để chúng tôi hoàn thiện hơn..." 
              className="form-textarea"
            />
          </Form.Item>

          <Button 
            type="primary" 
            htmlType="submit" 
            loading={submitting} 
            icon={<SendOutlined />}
            className="submit-review-btn"
          >
            Gửi đánh giá ngay
          </Button>
        </Form>
      )}
    </div>
  )
}
