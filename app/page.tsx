import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import QuemSomos from "@/components/landing/QuemSomos";
import Treinos from "@/components/landing/Treinos";
import Conquistas from "@/components/landing/Conquistas";
import Galeria from "@/components/landing/Galeria";
import NoticiasPreview from "@/components/landing/NoticiasPreview";
import Idealizador from "@/components/landing/Idealizador";
import CtaFinal from "@/components/landing/CtaFinal";

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <QuemSomos />
        <Treinos />
        <Conquistas />
        <Galeria />
        <NoticiasPreview />
        <Idealizador />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
