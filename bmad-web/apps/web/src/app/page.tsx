import Link from 'next/link';
import { ArrowRight, Bot, Workflow, FileText, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-bmad" />
            <span className="text-xl font-bold">BMAD</span>
          </div>
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

      {/* Hero Section */}
      <section className="container py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build More,{' '}
            <span className="bg-gradient-bmad bg-clip-text text-transparent">
              Architect Dreams
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Framework de desenvolvimento agil impulsionado por IA com 21 agentes
            especializados e mais de 50 workflows guiados para transformar suas
            ideias em software de qualidade.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              Iniciar Projeto
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Tudo que voce precisa para desenvolver com excelencia
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Bot className="h-10 w-10" />}
              title="21+ Agentes IA"
              description="PM, Arquiteto, Dev, UX Designer, Tech Writer e muito mais"
            />
            <FeatureCard
              icon={<Workflow className="h-10 w-10" />}
              title="50+ Workflows"
              description="Da analise a implementacao, guias passo-a-passo"
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10" />}
              title="Artefatos Automaticos"
              description="PRD, arquitetura, epics, stories gerados automaticamente"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Quick Flow"
              description="De ideia a especificacao em menos de 5 minutos"
            />
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="container py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Escolha seu ritmo de desenvolvimento
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <TrackCard
              title="Quick Flow"
              time="~5 min"
              description="Para bug fixes, pequenas features e ajustes rapidos"
              color="green"
            />
            <TrackCard
              title="BMAD Method"
              time="~15 min"
              description="Para produtos e plataformas com escopo moderado"
              color="blue"
              featured
            />
            <TrackCard
              title="Enterprise"
              time="~30 min"
              description="Para sistemas complexos com requisitos de compliance"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-bmad p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Pronto para transformar suas ideias?
          </h2>
          <p className="mb-6 text-white/80">
            Junte-se a milhares de desenvolvedores que ja usam o BMAD para criar
            software de qualidade.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-primary shadow-lg hover:bg-white/90"
          >
            Comece Agora - E Gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>BMAD - Build More, Architect Dreams</p>
          <p className="mt-2">
            Framework de desenvolvimento agil impulsionado por IA
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center shadow-sm">
      <div className="mb-4 inline-flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function TrackCard({
  title,
  time,
  description,
  color,
  featured,
}: {
  title: string;
  time: string;
  description: string;
  color: 'green' | 'blue' | 'purple';
  featured?: boolean;
}) {
  const colorClasses = {
    green: 'border-green-500 bg-green-500/10',
    blue: 'border-blue-500 bg-blue-500/10',
    purple: 'border-purple-500 bg-purple-500/10',
  };

  return (
    <div
      className={`rounded-xl border-2 p-6 ${colorClasses[color]} ${featured ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {time} para primeira story
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {featured && (
        <div className="mt-4 inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          Mais Popular
        </div>
      )}
    </div>
  );
}
