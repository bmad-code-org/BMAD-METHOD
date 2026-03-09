import type { FlowConfig } from "../types.js";

export const cobrancaFlow: FlowConfig = {
  area: "civel",
  areaLabel: "Cível",
  subtipo: "cobranca",
  subtipoLabel: "Cobrança",
  tipoTarefa: "peticao-inicial",
  steps: [
    {
      stepNumber: 1,
      title: "Dados da Dívida",
      requiresLlm: false,
      groups: [
        {
          title: "Credor e Devedor",
          questions: [
            {
              id: "relacao_partes",
              text: "Qual a relação entre as partes?",
              type: "select",
              options: [
                "Contrato de prestação de serviço",
                "Empréstimo pessoal",
                "Venda de produto",
                "Aluguel",
                "Cheque devolvido",
                "Nota promissória",
                "Outro",
              ],
              required: true,
            },
            {
              id: "tipo_devedor",
              text: "O devedor é pessoa física ou jurídica?",
              type: "select",
              options: ["PF", "PJ"],
              required: true,
            },
          ],
        },
        {
          title: "Valor e Prazo",
          questions: [
            {
              id: "faixa_valor",
              text: "Qual a faixa de valor da dívida?",
              type: "select",
              options: [
                "Até R$ 5 mil",
                "R$ 5 a 20 mil",
                "R$ 20 a 50 mil",
                "Acima de R$ 50 mil",
              ],
              required: true,
            },
            {
              id: "data_vencimento",
              text: "Data de vencimento da dívida",
              type: "date",
              required: true,
            },
            {
              id: "tentou_cobranca",
              text: "Já tentou cobrar antes?",
              type: "select",
              options: [
                "Sim, extrajudicialmente",
                "Sim, com protesto",
                "Não",
              ],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Documentação",
      requiresLlm: true,
      groups: [
        {
          title: "Provas da Dívida",
          questions: [
            {
              id: "documentos",
              text: "Quais documentos possui?",
              type: "multiselect",
              options: [
                "Contrato assinado",
                "Nota promissória",
                "Cheque",
                "Notas fiscais",
                "Comprovantes de transferência",
                "Mensagens",
                "E-mails",
                "Nenhum documento formal",
              ],
              required: true,
            },
            {
              id: "divida_reconhecida",
              text: "A dívida é reconhecida pelo devedor?",
              type: "select",
              options: [
                "Sim, devedor reconhece",
                "Parcialmente",
                "Não, devedor contesta",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Situação Atual",
          questions: [
            {
              id: "parcelas_pagas",
              text: "Houve pagamento parcial?",
              type: "select",
              options: [
                "Nenhuma",
                "Algumas parcelas",
                "Maioria paga, faltam poucas",
              ],
              required: true,
            },
            {
              id: "possui_garantia",
              text: "Há garantia vinculada à dívida?",
              type: "select",
              options: [
                "Sim, com garantia real",
                "Sim, com fiador",
                "Não",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial de ação de cobrança com os seguintes dados:

**Partes:**
- Credor: [a ser preenchido pelo advogado]
- Devedor: {{tipo_devedor}}

**Relação entre as partes:**
- Origem: {{relacao_partes}}
- Faixa de valor: {{faixa_valor}}
- Data de vencimento: {{data_vencimento}}
- Cobrança prévia: {{tentou_cobranca}}

**Documentação e provas:**
- Documentos disponíveis: {{documentos}}
- Reconhecimento da dívida: {{divida_reconhecida}}
- Parcelas pagas: {{parcelas_pagas}}
- Garantia: {{possui_garantia}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 318 do CPC (procedimento comum)
- Art. 319 do CPC (requisitos da petição inicial)
- Art. 784 do CPC (títulos executivos extrajudiciais)
- Art. 397 do CC (mora)

Inclua pedidos de: pagamento do valor principal, juros de mora, correção monetária, custas processuais e honorários advocatícios.`,

  legalReferences: [
    "art. 318 CPC",
    "art. 319 CPC",
    "art. 784 CPC",
    "art. 397 CC",
  ],
};
