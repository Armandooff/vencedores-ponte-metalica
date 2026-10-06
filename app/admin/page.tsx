import TabelaAtletas from "@/components/admin/TabelaAtletas";

export default function PaginaAdmin() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-marinho-900">Painel Administrativo</h1>
        <p className="text-slate-600 mt-1 mb-8">
          Gerencie as inscrições de atletas do projeto.
        </p>
        <TabelaAtletas />
      </div>
    </main>
  );
}
