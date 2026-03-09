import type { FlowConfig } from "../types.js";

export const acumuloFuncaoFlow: FlowConfig = {
  area: "trabalhista",
  areaLabel: "Trabalhista",
  subtipo: "acumulo-funcao",
  subtipoLabel: "Acúmulo de Função",
  tipoTarefa: "peticao-inicial",
  steps: [
    {
      stepNumber: 1,
      title: "Dados do Vínculo",
      requiresLlm: false,
      groups: [
        {
          title: "Contrato",
          questions: [
            {
              id: "cargo_registrado",
              text: "Qual o cargo registrado em carteira?",
              type: "text",
              placeholder: "Ex: Auxiliar Administrativo",
              required: true,
            },
            {
              id: "cargo_exercido",
              text: "Qual o cargo efetivamente exercido?",
              type: "text",
              placeholder: "Ex: Auxiliar Administrativo + Financeiro",
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
            {
              id: "recebeu_adicional",
              text: "Recebeu algum adicional pelo acúmulo?",
              type: "select",
              options: ["Sim", "Não"],
              required: true,
            },
          ],
        },
      ],
    },
    {
      stepNumber: 2,
      title: "Detalhes do Acúmulo",
      requiresLlm: true,
      groups: [
        {
          title: "Funções Acumuladas",
          questions: [
            {
              id: "funcoes_extras",
              text: "Descreva as funções exercidas além do cargo contratado",
              type: "text",
              placeholder: "Descreva as funções exercidas além do cargo contratado",
              required: true,
            },
            {
              id: "inicio_acumulo",
              text: "Quando começou o acúmulo de função?",
              type: "select",
              options: [
                "Desde a contratação",
                "Após promoção",
                "Após saída de colega",
                "Após reestruturação",
              ],
              required: true,
            },
            {
              id: "frequencia_acumulo",
              text: "Com que frequência exerce as funções extras?",
              type: "select",
              options: [
                "Diariamente",
                "Várias vezes por semana",
                "Eventualmente",
              ],
              required: true,
            },
          ],
        },
        {
          title: "Provas",
          questions: [
            {
              id: "provas_disponiveis",
              text: "Quais provas estão disponíveis?",
              type: "multiselect",
              options: [
                "E-mails com atribuições",
                "Testemunhas",
                "Descrição de cargo",
                "Contracheques",
                "Prints de sistemas",
                "Nenhuma",
              ],
              required: true,
            },
            {
              id: "outros_exercem",
              text: "Há outro funcionário específico para a função acumulada?",
              type: "select",
              options: [
                "Sim, há funcionário específico",
                "Sim, havia antes",
                "Não sei",
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
  promptTemplate: `Elabore uma petição inicial trabalhista de adicional por acúmulo de função com os seguintes dados:

**Partes:**
- Reclamante: [a ser preenchido pelo advogado]
- Reclamada: [a ser preenchido pelo advogado]

**Vínculo empregatício:**
- Cargo registrado: {{cargo_registrado}}
- Cargo efetivamente exercido: {{cargo_exercido}}
- Regime: {{regime}}
- Tempo de serviço: {{tempo_servico}}
- Faixa salarial: {{faixa_salarial}}
- Recebeu adicional: {{recebeu_adicional}}

**Detalhes do acúmulo:**
- Funções extras exercidas: {{funcoes_extras}}
- Início do acúmulo: {{inicio_acumulo}}
- Frequência: {{frequencia_acumulo}}

**Provas:**
- Provas disponíveis: {{provas_disponiveis}}
- Existência de funcionário específico para a função: {{outros_exercem}}

{{#refinement_context}}

**Fundamente com base em:**
- Art. 456, parágrafo único da CLT (condição do contrato de trabalho)
- Art. 468 da CLT (alteração contratual lesiva)

Inclua pedidos de: pagamento de adicional por acúmulo de função com reflexos em férias + 1/3, 13º salário, FGTS, DSR, e honorários advocatícios.`,

  legalReferences: [
    "art. 456, parágrafo único CLT",
    "art. 468 CLT",
  ],
};
