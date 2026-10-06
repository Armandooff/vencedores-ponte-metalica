export function calcularIdade(dataNascimento: string): number {
  if (!dataNascimento) return 0;
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) idade--;
  return idade;
}

export function ehMenorDeIdade(dataNascimento: string): boolean {
  if (!dataNascimento) return false;
  return calcularIdade(dataNascimento) < 18;
}
