import type { FlowConfig } from "../types.js";

export const contestacaoCivelFlow: FlowConfig = {
  area: "civel",
  areaLabel: "Cível",
  subtipo: "contestacao",
  subtipoLabel: "Contestação Cível",
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
              text: "Número do processo",
              type: "text",
              required: true,
            },
            {
              id: "vara_tribunal",
              text: "Vara e tribunal",
              type: "text",
              required: true,
            },
            {
              id: "tipo_acao_autor",
              text: "Qual o tipo de ação movida pelo autor?",
              type: "select",
              options: [
                "Cobrança",
                "Indenização",
                "Obrigação de fazer",
                "Revisional",
                "Consignação",
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
              id: "posicao_cliente",
              text: "Posição do cliente no processo",
              type: "select",
              options: [
                "Réu pessoa física",
                "Réu pessoa jurídica",
              ],
              required: true,
            },
            {
              id: "valor_causa",
              text: "Valor da causa",
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
      ],
    },
    {
      stepNumber: 2,
      title: "Estratégia de Defesa",
      requiresLlm: true,
      groups: [
        {
          title: "Preliminares",
          questions: [
            {
              id: "preliminares",
              text: "Quais preliminares deseja alegar?",
              type: "multiselect",
              options: [
                "Inépcia da inicial",
                "Ilegitimidade passiva",
                "Falta de interesse de agir",
                "Incompetência",
                "Litispendência",
                "Coisa julgada",
                "Prescrição",
                "Decadência",
                "Nenhuma",
              ],
              required: true,
            },
            {
              id: "merito_defesa",
              text: "Qual a tese principal de defesa no mérito?",
              type: "select",
              options: [
                "Fato não ocorreu",
                "Fato ocorreu diferente",
                "Inexistência de dano",
                "Culpa exclusiva do autor",
                "Caso fortuito ou força maior",
                "Pagamento já realizado",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Provas",
          questions: [
            {
              id: "documentos_defesa",
              text: "Quais documentos possui para defesa?",
              type: "multiselect",
              options: [
                "Contrato",
                "Comprovantes de pagamento",
                "E-mails",
                "Protocolo",
                "Fotos",
                "Testemunhas",
                "Perícia",
                "Nenhum",
              ],
              required: true,
            },
            {
              id: "pedido_reconvencao",
              text: "Deseja fazer pedido reconvencional?",
              type: "select",
              options: ["Sim", "Não"],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma contestação cível com os seguintes dados:

**Processo:**
- Número: {{numero_processo}}
- Vara/Tribunal: {{vara_tribunal}}
- Tipo de ação: {{tipo_acao_autor}}
- Valor da causa: {{valor_causa}}

**Partes:**
- Contestante: {{posicao_cliente}}

**Estratégia de defesa:**
- Preliminares: {{preliminares}}
- Tese de mérito: {{merito_defesa}}

**Provas e pedidos:**
- Documentos: {{documentos_defesa}}
- Reconvenção: {{pedido_reconvencao}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 335 do CPC (prazo para contestação)
- Art. 336 do CPC (ônus de impugnar especificamente)
- Art. 337 do CPC (preliminares de contestação)
- Art. 343 do CPC (reconvenção)

Inclua: preliminares aplicáveis, impugnação específica dos fatos, defesa de mérito, requerimento de provas e pedidos finais.`,

  legalReferences: [
    "art. 335 CPC",
    "art. 336 CPC",
    "art. 337 CPC",
    "art. 343 CPC",
  ],
};
