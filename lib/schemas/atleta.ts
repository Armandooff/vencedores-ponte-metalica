import { z } from "zod";
import { calcularIdade } from "@/lib/idade";

const camposGeraisSchema = z.object({
  nomeCompleto: z.string().min(3, "Informe o nome completo"),
  dataNascimento: z.string().min(1, "Informe a data de nascimento"),
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, "CPF deve ter 11 dígitos"),
  rg: z.string().min(5, "RG inválido"),
  cep: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, "CEP deve ter 8 dígitos"),
  bairro: z.string().min(2, "Informe o bairro"),
  endereco: z.string().min(3, "Informe o endereço"),
  numero: z.string().min(1, "Informe o número"),
  codJuv: z.string().optional(),
  cadUnico: z.string().min(1, "Informe o número do CadÚnico"),
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
