---
title: "Jak přizpůsobit BMad"
description: Přizpůsobení agentů, workflow a modulů se zachováním kompatibility s aktualizacemi
sidebar:
  order: 7
---

Použijte soubory `.customize.yaml` k přizpůsobení chování agentů, person a nabídek při zachování vašich změn napříč aktualizacemi.

## Kdy to použít

- Chcete změnit jméno, osobnost nebo komunikační styl agenta
- Potřebujete, aby si agenti pamatovali kontextově specifické informace projektu
- Chcete přidat vlastní položky nabídky, které spouštějí vaše vlastní workflow nebo prompty
- Chcete, aby agenti prováděli specifické akce při každém spuštění

:::note[Předpoklady]
- BMad nainstalován ve vašem projektu (viz [Jak nainstalovat BMad](./install-bmad.md))
- Textový editor pro YAML soubory
:::

:::caution[Chraňte svá přizpůsobení]
Vždy používejte soubory `.customize.yaml` popsané zde místo přímé editace souborů agentů. Instalátor přepíše soubory agentů během aktualizací, ale zachová vaše změny v `.customize.yaml`.
:::

## Kroky

### 1. Najděte soubory přizpůsobení

Po instalaci najdete jeden soubor `.customize.yaml` na agenta v:

```text
_bmad/_config/agents/
├── core-bmad-master.customize.yaml
├── bmm-dev.customize.yaml
├── bmm-pm.customize.yaml
└── ... (jeden soubor na instalovaného agenta)
```

### 2. Upravte soubor přizpůsobení

Otevřete soubor `.customize.yaml` pro agenta, kterého chcete upravit. Každá sekce je volitelná — přizpůsobte pouze to, co potřebujete.

| Sekce              | Chování   | Účel                                                     |
| ------------------ | --------- | -------------------------------------------------------- |
| `agent.metadata`   | Nahrazuje | Přepsat zobrazované jméno agenta                         |
| `persona`          | Nahrazuje | Nastavit roli, identitu, styl a principy                 |
| `memories`         | Přidává   | Přidat trvalý kontext, který si agent vždy pamatuje      |
| `menu`             | Přidává   | Přidat vlastní položky nabídky pro workflow nebo prompty |
| `critical_actions` | Přidává   | Definovat instrukce při spuštění agenta                  |
| `prompts`          | Přidává   | Vytvořit znovupoužitelné prompty pro akce nabídky        |

Sekce označené **Nahrazuje** zcela přepíší výchozí hodnoty agenta. Sekce označené **Přidává** doplní existující konfiguraci.

**Jméno agenta**

Změňte, jak se agent představí:

```yaml
agent:
  metadata:
    name: 'Spongebob' # Výchozí: "Amelia"
```

**Persona**

Nahraďte osobnost, roli a komunikační styl agenta:

```yaml
persona:
  role: 'Senior Full-Stack Engineer'
  identity: 'Lives in a pineapple (under the sea)'
  communication_style: 'Spongebob annoying'
  principles:
    - 'Never Nester, Spongebob Devs hate nesting more than 2 levels deep'
    - 'Favor composition over inheritance'
```

Sekce `persona` nahrazuje celou výchozí personu, takže nastavte všechna čtyři pole.

**Memories**

Přidejte trvalý kontext, který si agent bude vždy pamatovat:

```yaml
memories:
  - 'Works at Krusty Krab'
  - 'Favorite Celebrity: David Hasselhoff'
  - 'Learned in Epic 1 that it is not cool to just pretend that tests have passed'
```

**Položky nabídky**

Přidejte vlastní záznamy do nabídky agenta. Každá položka potřebuje `trigger`, cíl (`workflow` cestu nebo `action` referenci) a `description`:

```yaml
menu:
  - trigger: my-workflow
    workflow: 'my-custom/workflows/my-workflow.yaml'
    description: My custom workflow
  - trigger: deploy
    action: '#deploy-prompt'
    description: Deploy to production
```

**Kritické akce**

Definujte instrukce, které se spustí při startu agenta:

```yaml
critical_actions:
  - 'Check the CI Pipelines with the XYZ Skill and alert user on wake if anything is urgently needing attention'
```

**Vlastní prompty**

Vytvořte znovupoužitelné prompty, na které mohou položky nabídky odkazovat s `action="#id"`:

```yaml
prompts:
  - id: deploy-prompt
    content: |
      Deploy the current branch to production:
      1. Run all tests
      2. Build the project
      3. Execute deployment script
```

### 3. Aplikujte změny

Po editaci přeinstalujte pro aplikaci změn:

```bash
npx bmad-method install
```

Instalátor detekuje existující instalaci a nabídne tyto možnosti:

| Možnost                      | Co udělá                                                               |
| ---------------------------- | ---------------------------------------------------------------------- |
| **Quick Update**             | Aktualizuje všechny moduly na nejnovější verzi a aplikuje přizpůsobení |
| **Modify BMad Installation** | Plný instalační postup pro přidání nebo odebrání modulů                |

Pro změny pouze přizpůsobení je **Quick Update** nejrychlejší možnost.

## Řešení problémů

**Změny se nezobrazují?**

- Spusťte `npx bmad-method install` a vyberte **Quick Update** pro aplikaci změn
- Zkontrolujte, že vaše YAML syntaxe je platná (na odsazení záleží)
- Ověřte, že jste upravili správný soubor `.customize.yaml` pro daného agenta

**Agent se nenačítá?**

- Zkontrolujte YAML syntaxi pomocí online YAML validátoru
- Ujistěte se, že jste nenechali pole prázdná po odkomentování
- Zkuste se vrátit k původní šabloně a znovu sestavit

**Potřebujete resetovat agenta?**

- Vymažte nebo smažte soubor `.customize.yaml` agenta
- Spusťte `npx bmad-method install` a vyberte **Quick Update** pro obnovení výchozích hodnot

## Přizpůsobení workflow

Přizpůsobení existujících BMad Method workflow a skills přijde brzy.

## Přizpůsobení modulů

Návod na tvorbu rozšiřujících modulů a přizpůsobení existujících modulů přijde brzy.
