import { Alert, Button, Form, Input, Rate, Space, Typography } from 'antd'
import { useState } from 'react'
import { taoDanhGia } from '../../services/review/review'

const { Paragraph, Title } = Typography
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

      setSuccessMessage('Đánh giá của bạn đã được ghi nhận.')
      onSuccess()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể gửi đánh giá')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="review-form-wrap">
      <Space orientation="vertical" size={14} className="review-form-stack">
        <div>
          <Title level={3} className="review-form-title">Đánh giá tour</Title>
          <Paragraph className="review-form-subtitle">Chia sẻ cảm nhận của bạn về tour {tenTour}.</Paragraph>
        </div>

        {errorMessage ? <Alert type="error" showIcon title={errorMessage} /> : null}
        {successMessage ? <Alert type="success" showIcon title={successMessage} /> : null}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Số sao" name="soSao" rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}>
            <Rate />
          </Form.Item>
          <Form.Item label="Nội dung đánh giá" name="noiDung" rules={[{ required: true, message: 'Vui lòng nhập nội dung đánh giá' }]}>
            <TextArea rows={5} maxLength={2000} placeholder="Hãy chia sẻ trải nghiệm của bạn sau chuyến đi..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Gửi đánh giá</Button>
        </Form>
      </Space>
    </div>
  )
}
