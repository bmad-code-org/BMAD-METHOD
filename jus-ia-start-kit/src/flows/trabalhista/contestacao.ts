import type { FlowConfig } from "../types.js";

export const contestacaoTrabalhistaFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "contestacao",
  subtipoLabel: "Contestação Trabalhista",
  tipoTarefa: "contestacao",
  steps: [
    {
      stepNumber: 1,
      title: "Dados do Processo",
      requiresLlm: false,
      groups: [
        {
          title: "Processo",
          questions: [
            {
              id: "numero_processo",
              text: "Qual o número do processo?",
              type: "text",
              placeholder: "0000000-00.0000.0.00.0000",
              required: true,
            },
            {
              id: "vara_tribunal",
              text: "Qual a vara e tribunal?",
              type: "text",
              placeholder: "Ex: 1ª Vara do Trabalho de São Paulo",
              required: true,
            },
            {
              id: "tipo_acao",
              text: "Qual o tipo de ação?",
              type: "select",
              options: [
                "Reclamatória trabalhista",
                "Ação de consignação",
                "Inquérito para apuração de falta grave",
                "Outra",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Partes",
          questions: [
            {
              id: "porte_empresa",
              text: "Qual o porte da empresa reclamada?",
              type: "select",
              options: [
                "Microempresa",
                "Pequena empresa",
                "Média empresa",
                "Grande empresa",
              ],
              required: true,
            },
            {
              id: "segmento",
              text: "Qual o segmento da empresa?",
              type: "text",
              placeholder: "Ex: Comércio, Indústria, Serviços",
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Pedidos do Reclamante",
      requiresLlm: true,
      groups: [
        {
          title: "Pedidos a Contestar",
          questions: [
            {
              id: "pedidos_principais",
              text: "Quais os principais pedidos do reclamante?",
              type: "multiselect",
              options: [
                "Horas extras",
                "Verbas rescisórias",
                "Dano moral",
                "Vínculo empregatício",
                "Equiparação salarial",
                "Adicional de insalubridade",
                "Desvio de função",
                "Outro",
              ],
              required: true,
            },
            {
              id: "valor_causa",
              text: "Qual o valor da causa?",
              type: "select",
              options: [
                "Até R$ 20 mil",
                "R$ 20 a 50 mil",
                "R$ 50 a 100 mil",
                "Acima de R$ 100 mil",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Defesa",
          questions: [
            {
              id: "teses_defesa",
              text: "Quais teses de defesa serão utilizadas?",
              type: "multiselect",
              options: [
                "Prescrição",
                "Ausência de provas",
                "Acordo coletivo válido",
                "Justa causa comprovada",
                "Inexistência de vínculo",
                "Pagamento correto",
                "Culpa do reclamante",
              ],
              required: true,
            },
            {
              id: "documentos_empresa",
              text: "Quais documentos a empresa possui?",
              type: "multiselect",
              options: [
                "Controle de ponto",
                "Contracheques",
                "Contrato de trabalho",
                "TRCT",
                "Acordo coletivo",
                "Regulamento interno",
                "Nenhum",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma contestação trabalhista com os seguintes dados:

**Processo:**
- Número: {{numero_processo}}
- Vara/Tribunal: {{vara_tribunal}}
- Tipo de ação: {{tipo_acao}}

**Reclamada:**
- Porte: {{porte_empresa}}
- Segmento: {{segmento}}

**Pedidos do reclamante a contestar:**
- Pedidos principais: {{pedidos_principais}}
- Valor da causa: {{valor_causa}}

**Teses de defesa:**
- Teses: {{teses_defesa}}
- Documentos disponíveis: {{documentos_empresa}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 818 da CLT (ônus da prova)
- Art. 373 do CPC (distribuição do ônus da prova)
- Art. 769 da CLT (aplicação subsidiária do CPC)

Inclua preliminares pertinentes, conteste cada pedido individualmente com fundamentos fáticos e jurídicos, e formule pedidos finais de improcedência total dos pedidos do reclamante, com condenação em honorários advocatícios sucumbenciais.`,

  legalReferences: [
    "art. 818 CLT",
    "art. 373 CPC",
    "art. 769 CLT",
  ],
};
