export default function PageHero({
  kicker,
  titulo,
  descricao,
  children,
}: {
  kicker: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-16 pt-32 text-white md:pb-20 md:pt-36">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-sun/15 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-sun/10 blur-[100px]" />
      <div className="container-x relative">
        <span className="kicker text-sun">
          <span className="h-px w-8 bg-sun" />
          {kicker}
        </span>
        <div className="mt-5 max-w-4xl">
          <h1 className="font-display text-[clamp(2.8rem,6.5vw,5.6rem)] uppercase leading-[0.9]">
            {titulo}
          </h1>
          {descricao && (
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              {descricao}
            </p>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
