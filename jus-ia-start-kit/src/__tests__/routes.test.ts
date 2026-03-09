import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify from "fastify";
import fastifyView from "@fastify/view";
import fastifyFormbody from "@fastify/formbody";
import nunjucks from "nunjucks";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homeRoutes } from "../routes/home.js";
import { flowRoutes } from "../routes/flow.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const templatesDir = join(__dirname, "..", "templates");

async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(fastifyFormbody);
  await app.register(fastifyView, {
    engine: { nunjucks },
    templates: templatesDir,
  });
  await app.register(homeRoutes);
  await app.register(flowRoutes);

  return app;
}

describe("Routes Integration", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /", () => {
    it("returns 200", async () => {
      const response = await app.inject({ method: "GET", url: "/" });
      expect(response.statusCode).toBe(200);
    });

    it("contains page content", async () => {
      const response = await app.inject({ method: "GET", url: "/" });
      expect(response.body).toContain("Jus IA");
    });
  });

  describe("GET /health", () => {
    it("returns ok status", async () => {
      const response = await app.inject({ method: "GET", url: "/health" });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: "ok" });
    });
  });

  describe("POST /selecionar", () => {
    it("returns 200 for trabalhista", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/selecionar",
        payload: { tipo_tarefa: "peticao-inicial", area: "trabalhista" },
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Horas Extras");
    });

    it("returns 200 for civel", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/selecionar",
        payload: { tipo_tarefa: "peticao-inicial", area: "civel" },
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Cobrança");
    });

    it("returns not-available for unknown area", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/selecionar",
        payload: { tipo_tarefa: "peticao-inicial", area: "penal" },
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("disponível");
    });
  });

  describe("GET /:area/:subtipo (deep links)", () => {
    it("returns 200 for trabalhista/horas-extras", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/trabalhista/horas-extras",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Dados do Caso");
    });

    it("returns 200 for civel/cobranca", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/civel/cobranca",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Dados da Dívida");
    });

    it("returns not-available for unknown flow", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/trabalhista/nao-existe",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("disponível");
    });
  });

  describe("POST /:area/iniciar", () => {
    it("starts horas-extras flow", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/trabalhista/iniciar",
        payload: { subtipo: "horas-extras", _tipo_tarefa: "peticao-inicial" },
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Dados do Caso");
    });

    it("starts cobranca flow", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/civel/iniciar",
        payload: { subtipo: "cobranca", _tipo_tarefa: "peticao-inicial" },
      });
      expect(response.statusCode).toBe(200);
    });

    it("returns not-available for unknown subtipo", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/trabalhista/iniciar",
        payload: { subtipo: "nao-existe" },
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("disponível");
    });
  });

  describe("POST /:area/:subtipo/step/:stepNumber (step submission)", () => {
    it("advances from step 1 to step 2 in horas-extras", async () => {
      const response = await app.inject({
        method: "POST",
        url: "/trabalhista/horas-extras/step/1",
        payload: {
          _area: "trabalhista",
          _subtipo: "horas-extras",
          _tipo_tarefa: "peticao-inicial",
          _step: "1",
          _total_steps: "5",
          _responses: "{}",
          empregador_tipo: "Pessoa Jurídica (empresa)",
          regime: "CLT",
          jornada_contratual: "44h semanais",
          data_inicio: "2020-01-01",
          data_fim: "2024-01-01",
          ainda_empregado: "Não",
          horas_extras_semana: "5 a 10 horas",
          banco_horas: "Não",
        },
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toContain("Detalhes do Caso");
    });

    it("shows preview after final step in horas-extras", async () => {
      const responses = JSON.stringify({
        empregador_tipo: "Pessoa Jurídica (empresa)",
        regime: "CLT",
        jornada_contratual: "44h semanais",
        data_inicio: "2020-01-01",
        data_fim: "2024-01-01",
        ainda_empregado: "Não",
        horas_extras_semana: "5 a 10 horas",
        banco_horas: "Não",
      });

      const response = await app.inject({
        method: "POST",
        url: "/trabalhista/horas-extras/step/2",
        payload: {
          _area: "trabalhista",
          _subtipo: "horas-extras",
          _tipo_tarefa: "peticao-inicial",
          _step: "2",
          _total_steps: "5",
          _responses: responses,
          registro_ponto: "Sim, eletrônico",
          testemunhas: "Sim",
          pagamento_parcial: "Não, nenhum pagamento",
        },
      });
      expect(response.statusCode).toBe(200);
      // Should contain the assembled prompt with CLT reference
      expect(response.body).toContain("CLT");
    });
  });

  describe("All registered flows have valid deep links", () => {
    const flows = [
      "/trabalhista/horas-extras",
      "/trabalhista/rescisao-indireta",
      "/trabalhista/dano-moral",
      "/trabalhista/acumulo-funcao",
      "/trabalhista/contestacao",
      "/civel/cobranca",
      "/civel/indenizacao",
      "/civel/obrigacao-fazer",
      "/civel/contestacao",
      "/civel/contrato",
    ];

    for (const flowUrl of flows) {
      it(`GET ${flowUrl} returns 200`, async () => {
        const response = await app.inject({ method: "GET", url: flowUrl });
        expect(response.statusCode).toBe(200);
      });
    }
  });
});
