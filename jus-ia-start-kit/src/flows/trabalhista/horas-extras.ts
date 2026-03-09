import type { FlowConfig } from "../types.js";

export const horasExtrasFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "horas-extras",
  subtipoLabel: "Horas Extras",
  tipoTarefa: "peticao-inicial",
  steps: [
    {
      stepNumber: 1,
      title: "Dados do Caso",
      requiresLlm: false,
      groups: [
        {
          title: "Relação de Trabalho",
          questions: [
            {
              id: "empregador_tipo",
              text: "O empregador é pessoa jurídica ou física?",
              type: "select",
              options: ["Pessoa Jurídica (empresa)", "Pessoa Física"],
              required: true,
            },
            {
              id: "regime",
              text: "Qual o regime de trabalho?",
              type: "select",
              options: ["CLT", "PJ", "Autônomo", "Temporário"],
              required: true,
            },
            {
              id: "jornada_contratual",
              text: "Qual a jornada contratual?",
              type: "select",
              options: ["44h semanais", "36h semanais", "30h semanais", "Outra"],
              required: true,
            },
          ],
        },
        {
          title: "Período",
          questions: [
            {
              id: "data_inicio",
              text: "Data de início do contrato",
              type: "date",
              required: true,
            },
            {
              id: "data_fim",
              text: "Data de término (ou atual se ainda empregado)",
              type: "date",
              required: true,
            },
            {
              id: "ainda_empregado",
              text: "Ainda está empregado?",
              type: "select",
              options: ["Sim", "Não"],
              required: true,
            },
          ],
        },
        {
          title: "Horas Extras",
          questions: [
            {
              id: "horas_extras_semana",
              text: "Quantas horas extras estimadas por semana?",
              type: "select",
              options: [
                "Até 5 horas",
                "5 a 10 horas",
                "10 a 20 horas",
                "Mais de 20 horas",
              ],
              required: true,
            },
            {
              id: "banco_horas",
              text: "Havia banco de horas?",
              type: "select",
              options: ["Sim, formal", "Sim, informal", "Não"],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Detalhes do Caso",
      requiresLlm: true,
      groups: [
        {
          title: "Provas e Evidências",
          questions: [
            {
              id: "registro_ponto",
              text: "Havia registro de ponto?",
              type: "select",
              options: [
                "Sim, eletrônico",
                "Sim, manual",
                "Não havia controle",
              ],
              required: true,
            },
            {
              id: "testemunhas",
              text: "Existem testemunhas?",
              type: "select",
              options: ["Sim", "Não", "Não sei"],
              required: true,
            },
            {
              id: "pagamento_parcial",
              text: "Houve pagamento parcial de horas extras?",
              type: "select",
              options: [
                "Sim, parcial (algumas horas pagas)",
                "Não, nenhum pagamento",
                "Sim, todas pagas mas sem adicional correto",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial trabalhista de horas extras com os seguintes dados:

**Partes:**
- Reclamante: [a ser preenchido pelo advogado]
- Reclamada: {{empregador_tipo}}

**Vínculo empregatício:**
- Regime: {{regime}}
- Jornada contratual: {{jornada_contratual}}
- Período: {{data_inicio}} a {{data_fim}}
- Situação atual: {{ainda_empregado}}

**Horas extras:**
- Volume estimado: {{horas_extras_semana}} por semana
- Banco de horas: {{banco_horas}}
- Registro de ponto: {{registro_ponto}}
- Pagamento anterior: {{pagamento_parcial}}
- Testemunhas: {{testemunhas}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 59 da CLT (limite de horas extras)
- Art. 71 da CLT (intervalo intrajornada)
- Súmula 85 do TST (compensação de jornada)
- Súmula 338 do TST (ônus da prova do registro de ponto)

Inclua pedidos de: horas extras com adicional de 50% (dias úteis) e 100% (domingos/feriados), reflexos em DSR, férias + 1/3, 13º salário, FGTS + 40%, e honorários advocatícios.`,

  legalReferences: [
    "art. 59 CLT",
    "art. 71 CLT",
    "Súmula 85 TST",
    "Súmula 338 TST",
  ],
};
