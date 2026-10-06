type Conquista = { titulo: string; descricao: string; ano: string };

const conquistasPadrao: Conquista[] = [
  { ano: "2023", titulo: "1º Campeonato Comunitário", descricao: "Primeira competição interna reunindo mais de 40 atletas." },
  { ano: "2024", titulo: "Parceria com escolas locais", descricao: "Ampliação do projeto para atender alunos de 3 escolas públicas." },
  { ano: "2025", titulo: "Atletas em competições estaduais", descricao: "Primeiros atletas do projeto representando o Ceará." },
];

export default function Conquistas({
  itens = conquistasPadrao,
}: {
  itens?: Conquista[];
}) {
  return (
    <section id="conquistas" className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-marinho-900 text-center">Conquistas</h2>
        <div className="badge-accent mx-auto mt-3" />
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {itens.map((c) => (
            <div key={c.titulo} className="card">
              <span className="inline-block text-xs font-bold text-pordosol-600 bg-pordosol-100 px-2.5 py-1 rounded-full">
                {c.ano}
              </span>
              <h3 className="font-semibold mt-3 text-marinho-900">{c.titulo}</h3>
              <p className="text-chumbo/70 text-sm mt-2">{c.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
