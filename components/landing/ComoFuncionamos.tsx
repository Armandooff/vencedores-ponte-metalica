export default function ComoFuncionamos() {
  const etapas = [
    { numero: "01", titulo: "Inscrição", texto: "Cadastro do atleta pelo portal, com dados básicos e de responsáveis quando menor de idade." },
    { numero: "02", titulo: "Triagem", texto: "Equipe do projeto avalia a inscrição e confirma vaga na turma." },
    { numero: "03", titulo: "Treinos", texto: "Aulas regulares na praia, com acompanhamento técnico e social." },
    { numero: "04", titulo: "Acompanhamento", texto: "Evolução do atleta é registrada no painel administrativo." },
  ];

  return (
    <section id="como-funcionamos" className="py-20 px-6 md:px-16 bg-marinho-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-marinho-900 text-center">Como Funcionamos</h2>
        <div className="badge-accent mx-auto mt-3" />
        <div className="grid md:grid-cols-4 gap-6 mt-10">
          {etapas.map((e) => (
            <div key={e.numero} className="card">
              <span className="text-2xl font-bold text-pordosol-500">{e.numero}</span>
              <h3 className="font-semibold text-turquesa-600 mt-2">{e.titulo}</h3>
              <p className="text-sm text-chumbo/70 mt-2">{e.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
