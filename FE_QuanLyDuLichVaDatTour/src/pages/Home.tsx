import { Space } from 'antd'
import { ContactCtaSection } from '../features/home/components/ContactCtaSection'
import { CustomerReviewSection } from '../features/home/components/CustomerReviewSection'
import { FeaturedToursSection } from '../features/home/components/FeaturedToursSection'
import { HeroSection } from '../features/home/components/HeroSection'
import { PromoSection } from '../features/home/components/PromoSection'
import { TourCategorySection } from '../features/home/components/TourCategorySection'
import { WhyChooseUsSection } from '../features/home/components/WhyChooseUsSection'

export default function Home() {
  return (
    <Space direction="vertical" size={0} className="home-page">
      <HeroSection />
      <TourCategorySection />
      <FeaturedToursSection />
      <PromoSection />
      <WhyChooseUsSection />
      <CustomerReviewSection />
      <ContactCtaSection />
    </Space>
  )
}
