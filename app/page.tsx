import Header from "@/components/landing/Header";
import QuemSomos from "@/components/landing/QuemSomos";
import NossoObjetivo from "@/components/landing/NossoObjetivo";
import ComoNasceu from "@/components/landing/ComoNasceu";
import ComoFuncionamos from "@/components/landing/ComoFuncionamos";
import Conquistas from "@/components/landing/Conquistas";
import Idealizador from "@/components/landing/Idealizador";
import CtaCadastro from "@/components/landing/CtaCadastro";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <Header />
      <QuemSomos />
      <NossoObjetivo />
      <ComoNasceu />
      <ComoFuncionamos />
      <Conquistas />
      <Idealizador />
      <CtaCadastro />
      <Footer />
    </main>
  );
}
