import { z } from "zod";
import { CATEGORIAS_ATLETA } from "@/lib/categorias";
import { calcularIdade } from "@/lib/idade";

const cpfOpcional = z
  .string()
  .optional()
  .transform((valor) => valor?.replace(/\D/g, "") ?? "");

const camposGeraisSchema = z.object({
  // Conta de acesso ao portal do atleta
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  senha: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
  confirmarSenha: z.string().min(1, "Confirme a senha"),

  nomeCompleto: z.string().min(3, "Informe o nome completo"),
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  telefone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 11, "Telefone inválido"),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos"),
  categoria: z.enum(CATEGORIAS_ATLETA, {
    required_error: "Escolha a categoria",
    invalid_type_error: "Escolha a categoria",
  }),

  cep: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "CEP deve ter 8 dígitos"),
  bairro: z.string().min(2, "Informe o bairro"),
  endereco: z.string().min(3, "Informe o endereço"),
  numero: z.string().min(1, "Informe o número"),
  codJuv: z.string().optional(),
  cadUnico: z.string().min(1, "Informe o número do CadÚnico"),

  consentimento: z
    .boolean()
    .refine((v) => v === true, "É necessário autorizar o uso dos dados para concluir"),
});

// Campos exigidos apenas quando o atleta é menor de idade.
const camposResponsavelSchema = z.object({
  nomeMae: z.string().optional(),
  nomePai: z.string().optional(),
  telefoneMae: z.string().optional(),
  telefonePai: z.string().optional(),
  cpfMae: cpfOpcional,
  cpfPai: cpfOpcional,
});

export const atletaSchema = camposGeraisSchema
  .merge(camposResponsavelSchema)
  .superRefine((data, ctx) => {
    if (data.senha !== data.confirmarSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmarSenha"],
        message: "As senhas não coincidem",
      });
    }

    const idade = calcularIdade(data.dataNascimento);
    if (idade >= 18) return;

    const obrigatoriosMenor = [
      "nomeMae",
      "nomePai",
      "telefoneMae",
      "telefonePai",
    ] as const;

    for (const campo of obrigatoriosMenor) {
      const valor = data[campo];
      if (!valor || valor.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [campo],
          message: "Obrigatório para atletas menores de 18 anos",
        });
      }
    }

    for (const campo of ["cpfMae", "cpfPai"] as const) {
      if (data[campo].length !== 11) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [campo],
          message:
            campo === "cpfMae"
              ? "Informe o CPF da mãe com 11 dígitos"
              : "Informe o CPF do pai com 11 dígitos",
        });
      }
    }
  });

export type AtletaFormData = z.infer<typeof atletaSchema>;
