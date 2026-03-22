import { Space } from 'antd'
import { ContactCtaSection } from '../features/home/components/ContactCtaSection'
import { CustomerReviewSection } from '../features/home/components/CustomerReviewSection'
import { FeaturedToursSection } from '../features/home/components/FeaturedToursSection'
import { HeroSection } from '../features/home/components/HeroSection'
import { PromoSection } from '../features/home/components/PromoSection'
import { TourCategorySection } from '../features/home/components/TourCategorySection'
import { UpcomingDeparturesSection } from '../features/home/components/UpcomingDeparturesSection'
import { WhyChooseUsSection } from '../features/home/components/WhyChooseUsSection'
import { useFeaturedTours } from '../features/home/hooks/useFeaturedTours'

export default function Home() {
  const { data: featuredTours = [] } = useFeaturedTours()

  return (
    <Space direction="vertical" size={0} className="home-page">
      <HeroSection />
      <FeaturedToursSection />
      <TourCategorySection />
      <UpcomingDeparturesSection tours={featuredTours} />
      <PromoSection />
      <WhyChooseUsSection />
      <CustomerReviewSection />
      <ContactCtaSection />
    </Space>
  )
}
