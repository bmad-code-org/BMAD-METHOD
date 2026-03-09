import type { FastifyInstance } from "fastify";
import { getAreas, getTiposTarefa, getAllFlows } from "../config/flows.js";
import { trabalhistaArea } from "../flows/trabalhista/index.js";
import { civelArea } from "../flows/civel/index.js";

const SITE_URL = process.env.SITE_URL || "https://jus-ia.com";

export async function homeRoutes(app: FastifyInstance): Promise<void> {
  // GET /sitemap.xml — Dynamic sitemap
  app.get("/sitemap.xml", async (_request, reply) => {
    const flows = getAllFlows();
    const today = new Date().toISOString().split("T")[0];

    const urls = [
      `  <url><loc>${SITE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
      ...flows.map(
        (f) =>
          `  <url><loc>${SITE_URL}/${f.area}/${f.subtipo}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    return reply.type("application/xml").send(xml);
  });

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
