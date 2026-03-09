import type { FlowConfig } from "../types.js";

export const obrigacaoFazerFlow: FlowConfig = {
  area: "civel",
  areaLabel: "Cível",
  subtipo: "obrigacao-fazer",
  subtipoLabel: "Obrigação de Fazer",
  tipoTarefa: "peticao-inicial",
  steps: [
    {
      stepNumber: 1,
      title: "Dados da Obrigação",
      requiresLlm: false,
      groups: [
        {
          title: "Origem",
          questions: [
            {
              id: "origem_obrigacao",
              text: "Qual a origem da obrigação?",
              type: "select",
              options: [
                "Contrato",
                "Decisão judicial anterior",
                "Lei ou regulamento",
                "Relação de consumo",
                "Outro",
              ],
              required: true,
            },
            {
              id: "tipo_obrigante",
              text: "Quem deveria cumprir a obrigação?",
              type: "select",
              options: ["PF", "PJ", "Poder Público"],
              required: true,
            },
          ],
        },
        {
          title: "Obrigação",
          questions: [
            {
              id: "descricao_obrigacao",
              text: "Descrição da obrigação",
              type: "text",
              placeholder: "O que deveria ser feito ou entregue?",
              required: true,
            },
            {
              id: "prazo_original",
              text: "Prazo original para cumprimento",
              type: "date",
              required: true,
            },
            {
              id: "urgencia",
              text: "Qual o grau de urgência?",
              type: "select",
              options: [
                "Urgente - risco de dano irreparável",
                "Moderada",
                "Baixa - pode aguardar rito normal",
              ],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Detalhes",
      requiresLlm: true,
      groups: [
        {
          title: "Inadimplência",
          questions: [
            {
              id: "notificou",
              text: "Notificou o obrigado?",
              type: "select",
              options: [
                "Sim, com AR",
                "Sim, por e-mail",
                "Sim, verbal",
                "Não",
              ],
              required: true,
            },
            {
              id: "motivo_recusa",
              text: "Qual o motivo da recusa ou inadimplência?",
              type: "select",
              options: [
                "Alega impossibilidade",
                "Ignora pedidos",
                "Contesta obrigação",
                "Desconhecido",
              ],
              required: true,
            },
            {
              id: "prejuizo",
              text: "Qual o prejuízo causado?",
              type: "text",
              placeholder: "Qual o prejuízo pela não realização?",
              required: true,
            },
          ],
        },
        {
          title: "Provas",
          questions: [
            {
              id: "documentos",
              text: "Quais documentos possui?",
              type: "multiselect",
              options: [
                "Contrato",
                "Notificação",
                "E-mails",
                "Mensagens",
                "Protocolo de atendimento",
                "Fotos",
                "Nenhum",
              ],
              required: true,
            },
            {
              id: "pedido_tutela",
              text: "Deseja pedir tutela de urgência?",
              type: "select",
              options: [
                "Sim, com tutela de urgência",
                "Não, apenas rito normal",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial de ação de obrigação de fazer com os seguintes dados:

**Partes:**
- Autor: [a ser preenchido pelo advogado]
- Réu: {{tipo_obrigante}}

**Obrigação:**
- Origem: {{origem_obrigacao}}
- Descrição: {{descricao_obrigacao}}
- Prazo original: {{prazo_original}}
- Urgência: {{urgencia}}

**Inadimplência:**
- Notificação: {{notificou}}
- Motivo da recusa: {{motivo_recusa}}
- Prejuízo: {{prejuizo}}

**Provas e pedidos:**
- Documentos: {{documentos}}
- Tutela de urgência: {{pedido_tutela}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 497 do CPC (tutela específica das obrigações de fazer)
- Art. 536 do CPC (cumprimento de sentença de obrigação de fazer)
- Art. 537 do CPC (multa periódica - astreintes)
- Art. 300 do CPC (tutela de urgência)

Inclua pedidos de: cumprimento da obrigação de fazer, fixação de astreintes em caso de descumprimento, tutela de urgência (se aplicável), custas processuais e honorários advocatícios.`,

  legalReferences: [
    "art. 497 CPC",
    "art. 536 CPC",
    "art. 537 CPC",
    "art. 300 CPC",
  ],
};
