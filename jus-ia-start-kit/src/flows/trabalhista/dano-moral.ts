import type { FlowConfig } from "../types.js";

export const danoMoralFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "dano-moral",
  subtipoLabel: "Dano Moral",
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
      title: "Detalhes do Dano",
      requiresLlm: true,
      groups: [
        {
          title: "Caracterização do Dano",
          questions: [
            {
              id: "tipo_dano",
              text: "Qual o tipo de dano sofrido?",
              type: "select",
              options: [
                "Assédio moral",
                "Assédio sexual",
                "Discriminação",
                "Acidente de trabalho",
                "Exposição indevida",
                "Revista íntima",
                "Outro",
              ],
              required: true,
            },
            {
              id: "frequencia",
              text: "Qual a frequência das ocorrências?",
              type: "select",
              options: [
                "Episódio único",
                "Recorrente",
                "Sistemático",
              ],
              required: true,
            },
            {
              id: "periodo_ocorrencias",
              text: "Por quanto tempo ocorreram os fatos?",
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
          title: "Impacto e Provas",
          questions: [
            {
              id: "consequencias",
              text: "Quais consequências o dano causou?",
              type: "multiselect",
              options: [
                "Afastamento médico",
                "Tratamento psicológico",
                "Perda salarial",
                "Danos à reputação",
                "Nenhuma consequência formal",
              ],
              required: true,
            },
            {
              id: "provas_disponiveis",
              text: "Quais provas estão disponíveis?",
              type: "multiselect",
              options: [
                "Mensagens",
                "E-mails",
                "Testemunhas",
                "Laudos médicos",
                "Câmeras",
                "Documentos",
                "Nenhuma",
              ],
              required: true,
            },
            {
              id: "registrou_ocorrencia",
              text: "Registrou a ocorrência formalmente?",
              type: "select",
              options: [
                "Sim, BO",
                "Sim, RH ou ouvidoria",
                "Não",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial trabalhista de indenização por dano moral com os seguintes dados:

**Partes:**
- Reclamante: [a ser preenchido pelo advogado]
- Reclamada: {{empregador_tipo}}

**Vínculo empregatício:**
- Regime: {{regime}}
- Cargo: {{cargo}}
- Tempo de serviço: {{tempo_servico}}
- Faixa salarial: {{faixa_salarial}}

**Caracterização do dano:**
- Tipo de dano: {{tipo_dano}}
- Frequência: {{frequencia}}
- Período das ocorrências: {{periodo_ocorrencias}}

**Impacto e provas:**
- Consequências: {{consequencias}}
- Provas disponíveis: {{provas_disponiveis}}
- Registro de ocorrência: {{registrou_ocorrencia}}

{{#refinement_context}}

**Fundamente com base em:**
- Arts. 223-A a 223-G da CLT (dano extrapatrimonial nas relações de trabalho)
- Art. 186 do Código Civil (ato ilícito)
- Art. 927 do Código Civil (obrigação de reparar o dano)

Inclua pedidos de: indenização por dano moral com arbitramento judicial do valor, considerando a gravidade da ofensa, a condição econômica das partes e o caráter pedagógico, além de honorários advocatícios.`,

  legalReferences: [
    "art. 223-A a 223-G CLT",
    "art. 186 CC",
    "art. 927 CC",
  ],
};
