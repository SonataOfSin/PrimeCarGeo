import { Header } from "@/components/primevibe/Header";
import { Hero } from "@/components/primevibe/Hero";
import { BookingWidget } from "@/components/primevibe/BookingWidget";
import { Fleet } from "@/components/primevibe/Fleet";
import { Airport } from "@/components/primevibe/Airport";
import { Destinations } from "@/components/primevibe/Destinations";
import { Pricing } from "@/components/primevibe/Pricing";
import { Services } from "@/components/primevibe/Services";
import { WhyDrivero } from "@/components/primevibe/WhyDrivero";
import { Corporate } from "@/components/primevibe/Corporate";
import { Testimonials } from "@/components/primevibe/Testimonials";
import { FAQ } from "@/components/primevibe/FAQ";
import { Contact } from "@/components/primevibe/Contact";
import { Footer } from "@/components/primevibe/Footer";
import { FloatingActions } from "@/components/primevibe/FloatingActions";
import { useReveal } from "@/hooks/useReveal";

const Index = () => {
  useReveal();
  return (
  <div className="min-h-dvh bg-background text-foreground pb-14 md:pb-0">
    <Header />
    <main>
      <Hero />
      <BookingWidget />
      <Fleet />
      <Services />
      <Airport />
      <Destinations />
      <Pricing />
      <WhyDrivero />
      <Corporate />
      <Testimonials />
      <FAQ />
      <Contact />
    </main>
    <Footer />
    <FloatingActions />
  </div>
  );
};

export default Index;
