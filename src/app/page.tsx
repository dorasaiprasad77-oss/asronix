import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AIAnalyzer from "@/components/AIAnalyzer";
import Portfolio from "@/components/Portfolio";
import Reviews from "@/components/Reviews";
import BookingForm from "@/components/BookingForm";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AIAnalyzer />
      <Portfolio />
      <Reviews />
      <BookingForm />
      <Contact />
    </>
  );
}
