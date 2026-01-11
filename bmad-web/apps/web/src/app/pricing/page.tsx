import Link from 'next/link';
import { Check, X, Zap, Users, Building2, Sparkles } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-bmad" />
            <span className="text-xl font-bold">BMAD</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Comece Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Planos para cada{' '}
          <span className="bg-gradient-bmad bg-clip-text text-transparent">
            etapa da jornada
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Comece gratis e escale conforme seu projeto cresce. Cancele quando quiser.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <span className="text-sm font-medium">Mensal</span>
          <button className="relative h-6 w-11 rounded-full bg-primary transition-colors">
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform" />
          </button>
          <span className="text-sm font-medium">
            Anual <span className="text-green-500">(2 meses gratis)</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-4">
          {/* Free */}
          <PricingCard
            name="Free"
            description="Para experimentar o poder do BMAD"
            price="0"
            period="para sempre"
            icon={<Sparkles className="h-6 w-6" />}
            features={[
              { text: '1 projeto ativo', included: true },
              { text: '3 agentes (Barry, PM, Architect)', included: true },
              { text: 'Quick-Flow (5 workflows)', included: true },
              { text: '50 mensagens/mes', included: true },
              { text: 'Export Markdown', included: true },
              { text: 'Colaboracao', included: false },
              { text: 'Historico completo', included: false },
            ]}
            ctaText="Comecar Gratis"
            ctaLink="/register"
          />

          {/* Starter */}
          <PricingCard
            name="Starter"
            description="Para empreendedores solo"
            price="29"
            period="/mes"
            icon={<Zap className="h-6 w-6" />}
            features={[
              { text: '3 projetos ativos', included: true },
              { text: '9 agentes (BMM completo)', included: true },
              { text: 'Quick-Flow + BMAD Method', included: true },
              { text: '500 mensagens/mes', included: true },
              { text: 'Export PDF e DOCX', included: true },
              { text: 'Historico 30 dias', included: true },
              { text: 'Suporte email', included: true },
            ]}
            ctaText="Iniciar Trial"
            ctaLink="/register?plan=starter"
          />

          {/* Pro - Featured */}
          <PricingCard
            name="Pro"
            description="Para freelancers e times"
            price="79"
            period="/mes"
            icon={<Users className="h-6 w-6" />}
            featured
            features={[
              { text: '10 projetos ativos', included: true },
              { text: 'Todos os 21+ agentes', included: true },
              { text: 'Todos os 50+ workflows', included: true },
              { text: 'Mensagens ilimitadas*', included: true },
              { text: 'Colaboracao (3 usuarios)', included: true },
              { text: 'Integracoes (GitHub, Notion)', included: true },
              { text: 'Suporte prioritario', included: true },
            ]}
            ctaText="Comecar Pro"
            ctaLink="/register?plan=pro"
            badge="Mais Popular"
          />

          {/* Team */}
          <PricingCard
            name="Team"
            description="Para startups em crescimento"
            price="199"
            period="/mes"
            icon={<Building2 className="h-6 w-6" />}
            features={[
              { text: 'Projetos ilimitados', included: true },
              { text: 'Ate 10 usuarios', included: true },
              { text: 'Agentes customizados', included: true },
              { text: 'Jira, Confluence, Slack', included: true },
              { text: 'API access', included: true },
              { text: 'Analytics', included: true },
              { text: 'Onboarding dedicado', included: true },
            ]}
            ctaText="Falar com Vendas"
            ctaLink="/contact?plan=team"
          />
        </div>

        {/* Enterprise CTA */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border bg-card p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h3 className="text-2xl font-bold">Enterprise</h3>
              <p className="mt-2 text-muted-foreground">
                Para empresas que precisam de SSO, compliance, SLA e suporte dedicado.
              </p>
            </div>
            <Link
              href="/contact?plan=enterprise"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Solicitar Proposta
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="container py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Comparativo Completo
        </h2>
        <div className="mx-auto max-w-5xl overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-semibold">Recurso</th>
                <th className="p-4 text-center font-semibold">Free</th>
                <th className="p-4 text-center font-semibold">Starter</th>
                <th className="p-4 text-center font-semibold text-primary">Pro</th>
                <th className="p-4 text-center font-semibold">Team</th>
              </tr>
            </thead>
            <tbody>
              <FeatureRow
                feature="Projetos"
                values={['1', '3', '10', 'Ilimitados']}
              />
              <FeatureRow
                feature="Agentes"
                values={['3', '9 (BMM)', '21+', '21+ Custom']}
              />
              <FeatureRow
                feature="Workflows"
                values={['5', '20', '50+', '50+ Custom']}
              />
              <FeatureRow
                feature="Mensagens/mes"
                values={['50', '500', 'Ilimitado*', 'Ilimitado']}
              />
              <FeatureRow
                feature="Usuarios"
                values={['1', '1', '3', '10']}
              />
              <FeatureRow
                feature="Historico"
                values={['7 dias', '30 dias', 'Completo', 'Completo']}
              />
              <FeatureRow
                feature="Export PDF/DOCX"
                values={[false, true, true, true]}
              />
              <FeatureRow
                feature="Integracoes"
                values={[false, false, true, true]}
              />
              <FeatureRow
                feature="API Access"
                values={[false, false, false, true]}
              />
              <FeatureRow
                feature="Suporte"
                values={['Comunidade', 'Email', 'Prioritario', 'Dedicado']}
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Perguntas Frequentes
        </h2>
        <div className="mx-auto max-w-3xl space-y-6">
          <FAQ
            question="Posso mudar de plano a qualquer momento?"
            answer="Sim! Voce pode fazer upgrade ou downgrade a qualquer momento. Ao fazer upgrade, o valor sera calculado proporcionalmente. Ao fazer downgrade, o credito sera aplicado na proxima fatura."
          />
          <FAQ
            question="O que acontece quando acabo as mensagens do mes?"
            answer="Voce pode continuar usando o BMAD, mas as respostas dos agentes serao limitadas. Voce pode comprar pacotes extras de mensagens ou fazer upgrade para um plano maior."
          />
          <FAQ
            question="Como funciona o trial do plano Pro?"
            answer="Voce tem 14 dias para testar todas as funcionalidades do Pro sem compromisso. Nao pedimos cartao de credito. Ao final do trial, voce escolhe se quer assinar ou voltar para o Free."
          />
          <FAQ
            question="Vocês oferecem desconto para startups?"
            answer="Sim! Startups em aceleradoras parceiras (YC, 500, etc.) tem 50% de desconto no primeiro ano. Entre em contato para verificar elegibilidade."
          />
          <FAQ
            question="Meus dados estao seguros?"
            answer="Absolutamente. Usamos criptografia em transito e em repouso. Seus projetos sao privados e nunca usados para treinar modelos. Planos Enterprise tem opcao de deploy on-premise."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-bmad p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Pronto para comecar?
          </h2>
          <p className="mb-6 text-white/80">
            Junte-se a milhares de desenvolvedores e empreendedores que ja usam BMAD.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-primary shadow-lg hover:bg-white/90"
          >
            Comecar Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>BMAD - Build More, Architect Dreams</p>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({
  name,
  description,
  price,
  period,
  icon,
  features,
  ctaText,
  ctaLink,
  featured,
  badge,
}: {
  name: string;
  description: string;
  price: string;
  period: string;
  icon: React.ReactNode;
  features: { text: string; included: boolean }[];
  ctaText: string;
  ctaLink: string;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-card p-6 ${
        featured ? 'border-primary ring-2 ring-primary' : ''
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          {badge}
        </div>
      )}

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold">R${price}</span>
        <span className="text-muted-foreground">{period}</span>
      </div>

      <ul className="mb-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            {feature.included ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground/50" />
            )}
            <span className={feature.included ? '' : 'text-muted-foreground/50'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaLink}
        className={`block w-full rounded-lg py-2 text-center text-sm font-medium transition-colors ${
          featured
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'border border-input bg-background hover:bg-accent'
        }`}
      >
        {ctaText}
      </Link>
    </div>
  );
}

function FeatureRow({
  feature,
  values,
}: {
  feature: string;
  values: (string | boolean)[];
}) {
  return (
    <tr className="border-b">
      <td className="p-4 font-medium">{feature}</td>
      {values.map((value, index) => (
        <td key={index} className="p-4 text-center">
          {typeof value === 'boolean' ? (
            value ? (
              <Check className="mx-auto h-4 w-4 text-green-500" />
            ) : (
              <X className="mx-auto h-4 w-4 text-muted-foreground/50" />
            )
          ) : (
            <span className={index === 2 ? 'font-medium text-primary' : ''}>
              {value}
            </span>
          )}
        </td>
      ))}
    </tr>
  );
}

function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="font-semibold">{question}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}
