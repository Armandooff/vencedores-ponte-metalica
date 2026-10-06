export default function CtaCadastro() {
  return (
    <section className="py-16 px-6 md:px-16 bg-pordosol-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-marinho-900">
          Quer inscrever um atleta no projeto?
        </h2>
        <p className="mt-3 text-chumbo/70">
          O cadastro leva poucos minutos. Menores de 18 anos precisam dos dados
          de um responsável.
        </p>
        <a href="/cadastro" className="btn-primary inline-block mt-6">
          Fazer Inscrição
        </a>
      </div>
    </section>
  );
}
