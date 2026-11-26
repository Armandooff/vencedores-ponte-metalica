import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/components/landing/Hero";
import QuemSomos from "@/components/landing/QuemSomos";
import Treinos from "@/components/landing/Treinos";
import Conquistas from "@/components/landing/Conquistas";
import Galeria from "@/components/landing/Galeria";
import Idealizador from "@/components/landing/Idealizador";
import CtaFinal from "@/components/landing/CtaFinal";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuemSomos />
        <Treinos />
        <Conquistas />
        <Galeria />
        <Idealizador />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
