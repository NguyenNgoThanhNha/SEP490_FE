import ChatPopup from "@/components/organisms/ChatPopup/ChatPopup"
import HeroSection from "@/components/organisms/HeroSection/HeroSection"
import ProductsSection from "@/components/organisms/ProductionSection/ProductionSection"
import ServicesSection from "@/components/organisms/ServiceSection/ServiceSection"
import TrialSection from "@/components/organisms/TrialSection/TrialSection"


const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <ServicesSection />
      <TrialSection />
      <ChatPopup />
    </>

  )
}
export default LandingPage