import FormularioAtleta from "@/components/cadastro/FormularioAtleta";

export default function PaginaCadastro() {
  return (
    <main className="min-h-screen bg-marinho-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-marinho-900">Inscrição de Atleta</h1>
        <p className="text-slate-600 mt-1 mb-8">
          Preencha os dados abaixo. Se o atleta for menor de 18 anos, os campos
          dos responsáveis aparecerão automaticamente.
        </p>
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <FormularioAtleta />
        </div>
      </div>
    </main>
  );
}
