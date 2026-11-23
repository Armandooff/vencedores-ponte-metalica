import { z } from "zod";
import { calcularIdade } from "@/lib/idade";

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
  rg: z.string().min(5, "RG inválido"),

  modalidade: z.literal("bodyboard"),
  nivel: z.enum(["iniciante", "intermediario", "avancado"], {
    required_error: "Escolha o nível",
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
  rgMae: z.string().optional(),
  rgPai: z.string().optional(),
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

    const obrigatoriosMenor: (keyof typeof camposResponsavelSchema.shape)[] = [
      "nomeMae",
      "nomePai",
      "telefoneMae",
      "telefonePai",
      "rgMae",
      "rgPai",
    ];

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
  });

export type AtletaFormData = z.infer<typeof atletaSchema>;
