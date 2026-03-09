import type { FlowConfig } from "../types.js";

export const rescisaoIndiretaFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "rescisao-indireta",
  subtipoLabel: "Rescisão Indireta",
  tipoTarefa: "peticao-inicial",
  steps: [
    {
      stepNumber: 1,
      title: "Dados do Vínculo",
      requiresLlm: false,
      groups: [
        {
          title: "Relação de Trabalho",
          questions: [
            {
              id: "regime",
              text: "Qual o regime de trabalho?",
              type: "select",
              options: ["CLT", "PJ", "Autônomo", "Temporário"],
              required: true,
            },
            {
              id: "cargo",
              text: "Qual o cargo exercido?",
              type: "text",
              required: true,
            },
            {
              id: "tempo_servico",
              text: "Quanto tempo de serviço?",
              type: "select",
              options: [
                "Menos de 1 ano",
                "1 a 3 anos",
                "3 a 5 anos",
                "Mais de 5 anos",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Remuneração",
          questions: [
            {
              id: "salario_tipo",
              text: "Qual o tipo de salário?",
              type: "select",
              options: ["Fixo", "Comissão", "Misto"],
              required: true,
            },
            {
              id: "faixa_salarial",
              text: "Qual a faixa salarial?",
              type: "select",
              options: [
                "Até 2 SM",
                "2 a 5 SM",
                "5 a 10 SM",
                "Acima de 10 SM",
              ],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Motivos da Rescisão",
      requiresLlm: true,
      groups: [
        {
          title: "Falta Grave do Empregador",
          questions: [
            {
              id: "motivo_principal",
              text: "Qual o motivo principal da rescisão indireta?",
              type: "select",
              options: [
                "Atraso reiterado de salários",
                "Não recolhimento de FGTS",
                "Assédio moral",
                "Desvio de função",
                "Redução salarial",
                "Condições de trabalho inadequadas",
              ],
              required: true,
            },
            {
              id: "motivos_adicionais",
              text: "Há motivos adicionais?",
              type: "multiselect",
              options: [
                "Atraso reiterado de salários",
                "Não recolhimento de FGTS",
                "Assédio moral",
                "Desvio de função",
                "Redução salarial",
                "Condições de trabalho inadequadas",
              ],
              required: false,
            },
            {
              id: "inicio_problemas",
              text: "Há quanto tempo os problemas começaram?",
              type: "select",
              options: [
                "Menos de 3 meses",
                "3 a 6 meses",
                "6 a 12 meses",
                "Mais de 1 ano",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Evidências",
          questions: [
            {
              id: "provas_disponiveis",
              text: "Quais provas estão disponíveis?",
              type: "multiselect",
              options: [
                "Contracheques",
                "Extratos FGTS",
                "Mensagens",
                "Testemunhas",
                "E-mails",
                "Fotos ou vídeos",
                "Documentos médicos",
                "Nenhuma",
              ],
              required: true,
            },
            {
              id: "comunicou_empregador",
              text: "Comunicou o empregador sobre os problemas?",
              type: "select",
              options: [
                "Sim, formalmente",
                "Sim, verbalmente",
                "Não",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial trabalhista de rescisão indireta do contrato de trabalho com os seguintes dados:

**Partes:**
- Reclamante: [a ser preenchido pelo advogado]
- Reclamada: [a ser preenchido pelo advogado]

**Vínculo empregatício:**
- Regime: {{regime}}
- Cargo: {{cargo}}
- Tempo de serviço: {{tempo_servico}}
- Tipo de salário: {{salario_tipo}}
- Faixa salarial: {{faixa_salarial}}

**Motivos da rescisão indireta:**
- Motivo principal: {{motivo_principal}}
- Motivos adicionais: {{motivos_adicionais}}
- Início dos problemas: {{inicio_problemas}}

**Evidências:**
- Provas disponíveis: {{provas_disponiveis}}
- Comunicação ao empregador: {{comunicou_empregador}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 483 da CLT (hipóteses de rescisão indireta)
- Art. 487 da CLT (aviso prévio)
- Súmula 13 do TST (mora salarial)

Inclua pedidos de: reconhecimento da rescisão indireta, pagamento de verbas rescisórias como dispensa sem justa causa (saldo de salário, aviso prévio, 13º proporcional, férias + 1/3, FGTS + 40%), guias para seguro-desemprego, e honorários advocatícios.`,

  legalReferences: [
    "art. 483 CLT",
    "art. 487 CLT",
    "Súmula 13 TST",
  ],
};
