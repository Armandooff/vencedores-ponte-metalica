export default function Idealizador() {
  return (
    <section id="idealizador" className="py-20 px-6 md:px-16 bg-marinho-900 text-white">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-center">
        <div className="w-32 h-32 rounded-full bg-white/10 mx-auto md:mx-0 flex items-center justify-center text-xs text-white/60">
          Foto
        </div>
        <div className="md:col-span-2">
          <span className="text-sm font-semibold text-pordosol-500 uppercase tracking-wide">
            Idealizador
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2">Nome do Idealizador</h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            Um breve texto sobre a trajetória e a motivação de quem criou o
            projeto Vencedores da Ponte Metálica.
          </p>
        </div>
      </div>
    </section>
  );
}
