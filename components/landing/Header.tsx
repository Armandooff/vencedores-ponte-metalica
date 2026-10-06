export default function Header() {
  const links = [
    { href: "#quem-somos", label: "Quem Somos" },
    { href: "#objetivo", label: "Objetivo" },
    { href: "#conquistas", label: "Conquistas" },
    { href: "#como-funcionamos", label: "Como Funcionamos" },
    { href: "#idealizador", label: "Idealizador" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-areia/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          {/* TODO: trocar por /logo.png assim que a arte da logo for adicionada em public/ */}
          <img src="/img.png"alt="Vencedores da Ponte Metálica" className="h-10 w-10 object-contain"
/>
          <span className="font-bold text-marinho-900 hidden sm:inline">Vencedores da Ponte Metálica</span>
        </a>
        <nav className="hidden md:flex gap-6 text-sm text-chumbo/70">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-turquesa-600">
              {l.label}
            </a>
          ))}
        </nav>
        <a href="/cadastro" className="btn-primary text-sm !px-4 !py-2">
          Inscrever Atleta
        </a>
      </div>
    </header>
  );
}
