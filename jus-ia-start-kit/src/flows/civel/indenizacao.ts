import type { FlowConfig } from "../types.js";

export const indenizacaoFlow: FlowConfig = {
  area: "civel",
  areaLabel: "Cível",
  subtipo: "indenizacao",
  subtipoLabel: "Indenização",
  tipoTarefa: "peticao-inicial",
  steps: [
    {
      stepNumber: 1,
      title: "Dados do Fato",
      requiresLlm: false,
      groups: [
        {
          title: "Tipo de Dano",
          questions: [
            {
              id: "tipo_indenizacao",
              text: "Qual o tipo de indenização pretendida?",
              type: "select",
              options: [
                "Dano material",
                "Dano moral",
                "Danos estéticos",
                "Lucros cessantes",
                "Dano material e moral",
              ],
              required: true,
            },
            {
              id: "origem",
              text: "Qual a origem do dano?",
              type: "select",
              options: [
                "Acidente de trânsito",
                "Erro médico",
                "Relação de consumo",
                "Relação contratual",
                "Ato ilícito",
                "Outro",
              ],
              required: true,
            },
            {
              id: "data_fato",
              text: "Data do fato",
              type: "date",
              required: true,
            },
          ],
        },
        {
          title: "Partes",
          questions: [
            {
              id: "tipo_responsavel",
              text: "O responsável é pessoa física, jurídica ou poder público?",
              type: "select",
              options: ["PF", "PJ", "Poder Público"],
              required: true,
            },
            {
              id: "relacao_com_responsavel",
              text: "Qual a relação com o responsável?",
              type: "select",
              options: [
                "Consumidor",
                "Contratante",
                "Terceiro",
                "Paciente",
                "Outro",
              ],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Detalhes e Provas",
      requiresLlm: true,
      groups: [
        {
          title: "Extensão do Dano",
          questions: [
            {
              id: "descricao_dano",
              text: "Descrição do dano sofrido",
              type: "text",
              placeholder: "Descreva brevemente o dano sofrido",
              required: true,
            },
            {
              id: "valor_estimado",
              text: "Valor estimado da indenização",
              type: "select",
              options: [
                "Até R$ 10 mil",
                "R$ 10 a 50 mil",
                "R$ 50 a 100 mil",
                "Acima de R$ 100 mil",
              ],
              required: true,
            },
            {
              id: "consequencias",
              text: "Quais as consequências do dano?",
              type: "multiselect",
              options: [
                "Gastos médicos",
                "Perda de renda",
                "Dano psicológico",
                "Dano estético",
                "Perda de bem material",
                "Outro",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Provas",
          questions: [
            {
              id: "provas",
              text: "Quais provas possui?",
              type: "multiselect",
              options: [
                "Boletim de ocorrência",
                "Laudos médicos",
                "Fotos",
                "Vídeos",
                "Testemunhas",
                "Notas fiscais",
                "Orçamentos",
                "Contratos",
                "Nenhuma",
              ],
              required: true,
            },
            {
              id: "tentou_acordo",
              text: "Tentou acordo extrajudicial?",
              type: "select",
              options: ["Sim, sem sucesso", "Não"],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial de ação de indenização por responsabilidade civil com os seguintes dados:

**Partes:**
- Autor: [a ser preenchido pelo advogado]
- Réu: {{tipo_responsavel}}
- Relação: {{relacao_com_responsavel}}

**Fato gerador:**
- Origem: {{origem}}
- Data do fato: {{data_fato}}
- Tipo de indenização: {{tipo_indenizacao}}

**Extensão do dano:**
- Descrição: {{descricao_dano}}
- Valor estimado: {{valor_estimado}}
- Consequências: {{consequencias}}

**Provas disponíveis:**
- Provas: {{provas}}
- Tentativa de acordo: {{tentou_acordo}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 186 do CC (ato ilícito)
- Art. 927 do CC (obrigação de reparar o dano)
- Art. 944 do CC (indenização mede-se pela extensão do dano)
- Art. 14 do CDC (responsabilidade do fornecedor)

Inclua pedidos de: indenização por danos materiais e/ou morais, juros de mora, correção monetária, custas processuais e honorários advocatícios.`,

  legalReferences: [
    "art. 186 CC",
    "art. 927 CC",
    "art. 944 CC",
    "art. 14 CDC",
  ],
};
