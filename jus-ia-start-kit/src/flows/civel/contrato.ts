import type { FlowConfig } from "../types.js";

export const contratoRevisaoFlow: FlowConfig = {
  area: "civel",
  areaLabel: "Cível",
  subtipo: "contrato",
  subtipoLabel: "Contrato (Revisão)",
  tipoTarefa: "contrato",
  steps: [
    {
      stepNumber: 1,
      title: "Dados do Contrato",
      requiresLlm: false,
      groups: [
        {
          title: "Tipo de Contrato",
          questions: [
            {
              id: "tipo_contrato",
              text: "Qual o tipo de contrato?",
              type: "select",
              options: [
                "Aluguel",
                "Prestação de serviço",
                "Financiamento",
                "Empréstimo",
                "Seguro",
                "Outro",
              ],
              required: true,
            },
            {
              id: "partes_contrato",
              text: "Quais as partes do contrato?",
              type: "select",
              options: ["PF x PF", "PF x PJ", "PJ x PJ"],
              required: true,
            },
            {
              id: "data_contrato",
              text: "Data de assinatura do contrato",
              type: "date",
              required: true,
            },
            {
              id: "vigencia",
              text: "Situação do contrato",
              type: "select",
              options: ["Em vigor", "Encerrado", "Rescindido"],
              required: true,
            },
          ],
        },
        {
          title: "Problema",
          questions: [
            {
              id: "problema_principal",
              text: "Qual o problema principal do contrato?",
              type: "select",
              options: [
                "Cláusula abusiva",
                "Reajuste abusivo",
                "Descumprimento",
                "Vício de consentimento",
                "Onerosidade excessiva",
                "Outro",
              ],
              required: true,
            },
            {
              id: "tentou_negociar",
              text: "Tentou negociar com a outra parte?",
              type: "select",
              options: ["Sim, sem sucesso", "Não"],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Detalhes da Revisão",
      requiresLlm: true,
      groups: [
        {
          title: "Cláusulas",
          questions: [
            {
              id: "clausulas_contestadas",
              text: "Cláusulas que deseja revisar",
              type: "text",
              placeholder: "Quais cláusulas deseja revisar?",
              required: true,
            },
            {
              id: "valor_atual",
              text: "Valor atual do contrato",
              type: "text",
              placeholder: "Valor mensal ou total atual",
              required: true,
            },
            {
              id: "valor_pretendido",
              text: "Valor pretendido",
              type: "text",
              placeholder: "Valor que considera justo",
              required: true,
            },
            {
              id: "fundamentacao",
              text: "Fundamentação legal principal",
              type: "select",
              options: [
                "CDC - relação de consumo",
                "CC - onerosidade excessiva",
                "CC - lesão",
                "Lei do Inquilinato",
                "Outro",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Documentação",
          questions: [
            {
              id: "documentos",
              text: "Quais documentos possui?",
              type: "multiselect",
              options: [
                "Contrato original",
                "Aditivos",
                "Comprovantes de pagamento",
                "Notificações",
                "Extratos",
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
                "Não",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial de ação revisional de contrato com os seguintes dados:

**Contrato:**
- Tipo: {{tipo_contrato}}
- Partes: {{partes_contrato}}
- Data: {{data_contrato}}
- Vigência: {{vigencia}}

**Problema:**
- Problema principal: {{problema_principal}}
- Tentativa de negociação: {{tentou_negociar}}

**Revisão pretendida:**
- Cláusulas contestadas: {{clausulas_contestadas}}
- Valor atual: {{valor_atual}}
- Valor pretendido: {{valor_pretendido}}
- Fundamentação: {{fundamentacao}}

**Documentação e pedidos:**
- Documentos: {{documentos}}
- Tutela de urgência: {{pedido_tutela}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 317 do CC (correção do valor da prestação)
- Art. 478 do CC (resolução por onerosidade excessiva)
- Art. 51 do CDC (nulidade de cláusulas abusivas)
- Art. 6º, V do CDC (modificação de cláusulas desproporcionais)

Inclua pedidos de: revisão das cláusulas abusivas, adequação dos valores, tutela de urgência (se aplicável), custas processuais e honorários advocatícios.`,

  legalReferences: [
    "art. 317 CC",
    "art. 478 CC",
    "art. 51 CDC",
    "art. 6º, V CDC",
  ],
};
