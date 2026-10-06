export default function Footer() {
  return (
    <footer className="py-10 px-6 md:px-16 bg-marinho-900 text-white/70 text-sm text-center">
      <p>Vencedores da Ponte Metálica — Praia de Iracema, Fortaleza (CE)</p>
      <p className="mt-1">© {new Date().getFullYear()} — Todos os direitos reservados</p>
    </footer>
  );
}
