import type { FastifyInstance } from "fastify";
import { getAreas, getTiposTarefa } from "../config/flows.js";
import { trabalhistaArea } from "../flows/trabalhista/index.js";
import { civelArea } from "../flows/civel/index.js";

export async function homeRoutes(app: FastifyInstance): Promise<void> {
  // GET / — Landing page
  app.get("/", async (_request, reply) => {
    return reply.view("pages/home.njk", {
      tiposTarefa: getTiposTarefa(),
      areas: getAreas(),
    });
  });

  // POST /selecionar — Handle tipo + area selection
  app.post<{ Body: { tipo_tarefa: string; area: string } }>(
    "/selecionar",
    async (request, reply) => {
      const { tipo_tarefa, area } = request.body;

      // Get subtipos for the selected area
      let areaConfig;
      let areaLabel = "";
      if (area === "trabalhista") {
        areaConfig = trabalhistaArea;
        areaLabel = "Trabalhista";
      } else if (area === "civel") {
        areaConfig = civelArea;
        areaLabel = "Cível";
      }

      if (!areaConfig) {
        return reply.view("pages/not-available.njk", {
          availableFlows: [],
        });
      }

      const tiposTarefa = getTiposTarefa();
      const tipoTarefaLabel =
        tiposTarefa.find((t) => t.value === tipo_tarefa)?.label || tipo_tarefa;

      return reply.view("pages/select-subtipo.njk", {
        area,
        areaLabel,
        tipoTarefa: tipo_tarefa,
        tipoTarefaLabel,
        subtipos: areaConfig.subtipos,
      });
    },
  );
}
