const itens = [
  "Bodyboard",
  "Ponte dos Ingleses",
  "Educação",
  "Comunidade",
  "Iracema",
  "Respeito ao mar",
];

export default function Marquee() {
  const faixa = [...itens, ...itens, ...itens, ...itens];
  return (
    <div className="relative overflow-hidden border-y border-ink/10 bg-sun py-4 text-ink">
      <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copia) => (
          <div
            key={copia}
            className="flex items-center gap-8"
            aria-hidden={copia === 1}
          >
            {faixa.map((item, i) => (
              <span key={`${copia}-${i}`} className="flex items-center gap-8">
                <span className="font-display text-xl uppercase tracking-wide sm:text-2xl">
                  {item}
                </span>
                <span className="text-lg">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
