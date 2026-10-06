export default function NossoObjetivo() {
  const pilares = [
    { titulo: "Esporte", texto: "Formação técnica em bodyboard e surf para atletas de todas as idades." },
    { titulo: "Educação", texto: "Apoio escolar e valores como disciplina, respeito e trabalho em equipe." },
    { titulo: "Comunidade", texto: "Fortalecimento de vínculos entre famílias da Ponte Metálica e região." },
  ];

  return (
    <section id="objetivo" className="py-20 px-6 md:px-16 bg-marinho-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-marinho-900 text-center">Nosso Objetivo</h2>
        <div className="badge-accent mx-auto mt-3" />
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {pilares.map((p) => (
            <div key={p.titulo} className="card">
              <h3 className="font-semibold text-turquesa-600">{p.titulo}</h3>
              <p className="text-sm text-chumbo/70 mt-2">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
