export default function ComoNasceu() {
  return (
    <section id="como-nasceu" className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div className="aspect-video bg-marinho-50 rounded-xl flex items-center justify-center text-marinho-700/40 text-sm">
          Foto/vídeo histórico do projeto
        </div>
        <div>
          <span className="text-sm font-semibold text-turquesa-600 uppercase tracking-wide">
            Como Nasceu
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-marinho-900 mt-2">
            A origem do Vencedores da Ponte Metálica
          </h2>
          <p className="mt-4 text-chumbo/80 leading-relaxed">
            Conte aqui a história de fundação: onde, quando e por que o projeto
            começou, e quem foram as primeiras pessoas envolvidas.
          </p>
        </div>
      </div>
    </section>
  );
}
