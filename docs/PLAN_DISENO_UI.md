# Plan de diseño UI/UX — sistema visual v2

Plan de rediseño visual del frontend, complementario a
[`PLAN_ARQUITECTURA.md`](PLAN_ARQUITECTURA.md) (Fases 0–13, completas). La
app es **funcionalmente** completa; este plan define la capa de diseño que
falta: lenguaje visual propio, corporativo y dinámico, con arquitectura de
tokens en capas, patrones de página estandarizados y responsive real.

Dirección visual derivada de tres referencias analizadas (login oscuro con
formas orgánicas; dos dashboards corporativos claros con acento verde,
tarjetas suaves, tablas limpias y micro-etiquetas uppercase), adaptada a la
identidad ya establecida del proyecto: **verde petróleo (hue OKLCH 175)**
como color de marca — no se hereda ninguna paleta externa.

---

## 1. Diagnóstico del estado actual

Lo que ya está bien y **se conserva**:

- Tokens semánticos OKLCH en `app/globals.css` (`--primary`, `--success`,
  `--warning`, `--destructive`, `--info`, familia `--sidebar-*`) mapeados
  vía `@theme inline` — la arquitectura correcta para Tailwind v4.
- Primitivos shadcn/ui con CVA (`components/ui/`), estados
  carga/vacío/error centralizados (`components/shared/`), menú derivado de
  permisos reales.
- Inter + JetBrains Mono ya cargadas (`--font-inter`,
  `--font-jetbrains-mono`).

Lo que falta (el objeto de este plan):

| Área            | Estado actual                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------- |
| Shell           | Sidebar plano de 224px sin secciones ni jerarquía; header vacío (solo UserMenu a la derecha)  |
| Login           | Card genérica centrada sobre fondo claro, sin identidad                                       |
| Dashboard       | Sin jerarquía: stat cards sin icono ni contexto, lista simple con borde                       |
| Tablas          | Primitivo `table.tsx` sin patrón de página (contenedor, header, paginación, estados por fila) |
| Sombras         | Solo `shadow-sm`/`shadow-xs` por defecto de shadcn — sin escala propia                        |
| Radios          | `--radius: 0.5rem` — más angular que la dirección visual buscada                              |
| Responsive      | Sidebar de ancho fijo siempre visible; sin drawer móvil; `p-8` fijo en main                   |
| Ilustraciones   | Ninguna: estados vacíos solo con texto                                                        |
| Micro-jerarquía | Sin eyebrows/etiquetas de sección, sin chips de delta, sin badges tintados suaves             |

---

## 2. Principios de diseño

1. **Corporativo calmado, acento con intención.** Superficies neutras
   (blanco + canvas gris-verde frío); el verde petróleo se reserva para
   acción primaria, estado activo y datos positivos. Nunca más de un
   elemento primario relleno por vista.
2. **Contraste por superficie, no por decoración.** Tres niveles: canvas
   (fondo de página) → card (blanco) → tinte suave (`primary-soft` /
   `muted`). La superficie **ink** (casi-negro verdoso) es el recurso de
   contraste fuerte: fondo del login, header de tabla principal, botón de
   exportar — igual que en las referencias.
3. **Bordes primero, sombras después.** Toda card lleva borde 1px sutil +
   sombra mínima en reposo; la sombra crece solo con la interacción
   (hover/dialog). Las sombras van tintadas con el hue de marca, nunca
   negro puro.
4. **Redondez generosa y consistente.** Radio base 12px; chips y botones de
   acción rápida en pill. Nada de esquinas mezcladas en una misma card.
5. **Jerarquía tipográfica por peso y tamaño, no por color.** Números
   grandes tabulares para datos; micro-etiquetas uppercase con tracking
   para secciones y labels de contexto.
6. **Movimiento discreto.** 150–200ms ease-out; hover eleva 1–2px;
   `prefers-reduced-motion` siempre respetado.
7. **Ilustraciones suaves y básicas.** SVG propios de dos tintas (tinte
   suave + trazo primario) sobre blob orgánico — solo en estados vacíos,
   error y login. Sin librerías de ilustración externas.

---

## 3. Arquitectura de tokens (3 capas)

```
Capa 1 · Primitivos     --green-*, --slate-*, --ink, escala de sombras/radios
        (globals.css)   Nunca se usan directo en componentes.
Capa 2 · Semánticos     --primary, --surface-*, --border-*, --success…
        (globals.css)   Apuntan a primitivos. Lo que consume Tailwind vía @theme.
Capa 3 · De componente  Variantes CVA en components/ui/* (button, badge…)
        (CVA)           Solo clases Tailwind sobre tokens semánticos.
```

Regla: **ningún color/ sombra/ radio hardcodeado en JSX**. Si un componente
necesita un valor nuevo, se promueve a token primero.

### 3.1 Paleta propia (primitivos)

Escala de marca sobre el hue 175 existente + neutrales fríos + **ink**:

```css
/* Marca — verde petróleo, hue 175 */
--green-50: oklch(0.97 0.012 175);
--green-100: oklch(0.94 0.03 175); /* tinte activo sidebar, fondos suaves */
--green-200: oklch(0.88 0.05 175);
--green-300: oklch(0.78 0.08 175);
--green-400: oklch(0.65 0.1 175);
--green-500: oklch(0.55 0.1 175); /* acento vivo: deltas, gráficos */
--green-600: oklch(0.45 0.09 175); /* --primary actual — se mantiene */
--green-700: oklch(0.38 0.08 175); /* hover del primario */
--green-800: oklch(0.3 0.05 175);
--green-900: oklch(0.25 0.035 175);

/* Ink — superficie oscura de marca (login, header de tabla, botón export) */
--ink: oklch(0.22 0.022 185);
--ink-soft: oklch(0.28 0.025 185); /* blobs/inputs sobre ink */
--ink-softer: oklch(0.34 0.028 185);

/* Neutrales fríos (hue 247, ya usado) */
--slate-50: oklch(0.985 0.002 247);
--slate-100: oklch(0.965 0.004 247); /* canvas de página */
--slate-200: oklch(0.94 0.005 247);
--slate-300: oklch(0.9 0.006 247); /* --border actual */
--slate-500: oklch(0.5 0.015 250); /* --muted-foreground actual */
```

### 3.2 Semánticos nuevos (además de los existentes)

```css
--surface-canvas: var(--slate-100); /* fondo del área de contenido */
--surface-card: oklch(1 0 0);
--surface-soft: var(--slate-50); /* mini-cards internas, filas hover */
--surface-ink: var(--ink);
--surface-ink-foreground: oklch(0.97 0.003 247);
--primary-soft: var(--green-100); /* activo de nav, icon-tiles, badges */
--primary-soft-foreground: var(--green-800);
--border-subtle: oklch(
  0.93 0.004 247
); /* borde de cards (más suave que --border) */
```

Los tokens semánticos existentes se **re-apuntan** a primitivos (mismo valor
visual, `--background` pasa a `--slate-100` para dar contraste real a las
cards blancas, como en las referencias). Los badges de estado ganan variante
tintada: `success-soft`, `warning-soft`, `destructive-soft`, `info-soft`
(fondo al 12–15% + texto al tono 700 del hue correspondiente).

### 3.3 Radios

```css
--radius: 0.75rem; /* 12px base (antes 8px) */
--radius-sm: 8px; /* inputs compactos, badges rectangulares */
--radius-md: 10px; /* botones, inputs */
--radius-lg: 12px; /* cards, popovers */
--radius-xl: 16px; /* cards protagonistas, contenedor de tabla */
--radius-2xl: 20px; /* card del login, promo del sidebar */
/* pill = rounded-full: chips, botones de filtro, avatares */
```

### 3.4 Sombras (escala propia, tintadas con ink)

```css
--shadow-xs: 0 1px 2px oklch(0.22 0.022 185 / 0.05);
--shadow-sm:
  0 1px 2px oklch(0.22 0.022 185 / 0.06), 0 2px 8px oklch(0.22 0.022 185 / 0.04); /* card en reposo */
--shadow-md:
  0 2px 4px oklch(0.22 0.022 185 / 0.05),
  0 8px 20px oklch(0.22 0.022 185 / 0.08); /* hover, dropdown, popover */
--shadow-lg:
  0 4px 8px oklch(0.22 0.022 185 / 0.06),
  0 16px 40px oklch(0.22 0.022 185 / 0.12); /* dialogs, card del login */
--shadow-brand: 0 8px 24px oklch(0.45 0.09 175 / 0.28); /* solo CTA primario en login/hero */
```

Uso: card en reposo = `border-subtle + shadow-sm`; hover interactivo =
`shadow-md + -translate-y-0.5`; nunca sombra sin borde en superficies claras.

### 3.5 Espaciado

Grid de 4px. Valores canónicos (no inventar intermedios):

| Token | Uso                                                        |
| ----- | ---------------------------------------------------------- |
| 4/8   | Interior de chips, gap icono-texto                         |
| 12    | Gap entre campos relacionados, padding de celdas compactas |
| 16    | Padding de inputs/botones, gap interno de card             |
| 20/24 | **Padding de card (24)**, gap entre cards de una sección   |
| 32    | Gap entre secciones de página                              |
| 24→40 | Gutter de página, fluido: `px-6 md:px-8 2xl:px-10`         |

Contenedor de contenido: `max-w-[1440px] mx-auto` para pantallas ultra-anchas.

### 3.6 Tipografía

| Rol               | Spec                                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Título de página  | Inter semibold `text-2xl md:text-3xl tracking-tight`                                                                          |
| Título de sección | Inter semibold `text-lg`                                                                                                      |
| Dato/stat grande  | Inter bold `text-3xl tabular-nums tracking-tight`                                                                             |
| Cuerpo            | Inter regular `text-sm` (14px, la app es densa en datos)                                                                      |
| Micro-etiqueta    | `text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground` — secciones del sidebar, labels de stat, eyebrows |
| Identificadores   | JetBrains Mono `text-sm tabular-nums` — cédulas, nº de pagaré, montos en tablas                                               |

### 3.7 Movimiento

```
--ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
Duraciones: 150ms (color/opacidad) · 200ms (transform/sombra) · 300ms (drawer/dialog)
```

Patrones: hover de card interactiva (`-translate-y-0.5` + sombra), entrada
de dialog/drawer (fade + slide 8px, ya provisto por tw-animate-css),
skeleton con `animate-pulse`. Todo bajo `motion-safe:`.

---

## 4. Patrones de componentes

### 4.1 Shell (AppShell / Sidebar / Topbar)

**Sidebar** (264px expandido):

- Bloque de marca arriba: logotipo/monograma en tile `primary-soft`
  redondeado + "Pagarés COINTRAMIN".
- Secciones con micro-etiqueta uppercase: `MENÚ PRINCIPAL` (Dashboard,
  Asociados, Pagarés) y `ADMINISTRACIÓN` (Catálogos, Usuarios) — la
  partición se declara en `lib/menu/menu-definition.ts` con un campo
  `section`, el filtro por permisos no cambia.
- Ítem activo: fondo `primary-soft`, texto `primary-soft-foreground`,
  radio `md`, indicador de 3px en el borde izquierdo con `--primary`.
  Inactivo: `text-muted-foreground`, hover `bg-surface-soft`.
- Pie del sidebar: separador + acceso a Perfil y Cerrar sesión (hoy
  escondidos en el UserMenu del header).
- Fondo blanco (`--sidebar: white`) con `border-r border-subtle` — el
  contraste contra el canvas gris hace la separación, no un gris propio.

**Topbar** (sticky, `h-16`, blanco, `border-b border-subtle`):

- Izquierda: botón hamburguesa (solo `< lg`) + breadcrumb/título corto.
- Derecha: botones icono circulares `ghost` (radio full, borde sutil) para
  futuras acciones + UserMenu con avatar (iniciales sobre `primary-soft`) +
  nombre y rol en dos líneas (`≥ md`).

**Responsive del shell:**

| Rango     | Comportamiento                                                                       |
| --------- | ------------------------------------------------------------------------------------ |
| `≥ lg`    | Sidebar fijo 264px                                                                   |
| `md`–`lg` | Rail de iconos 72px (tooltips con el label)                                          |
| `< md`    | Sidebar oculto; drawer off-canvas (nuevo primitivo `sheet.tsx`) desde el hamburguesa |

Main: `bg-surface-canvas`, `px-6 py-6 md:px-8 md:py-8`, `gap-8` entre
secciones.

### 4.2 Login (identidad de marca)

Escena oscura de marca — traducción del patrón de la referencia al verde
petróleo:

- Fondo `--ink` a pantalla completa con 2–3 blobs orgánicos SVG en
  `--ink-soft`/`--ink-softer` (formas absolutas, `overflow-hidden`,
  decorativas con `aria-hidden`) y 2 glifos «＋» pequeños al 20% de opacidad.
- Marca centrada arriba de la card (wordmark blanco).
- Card `w-full max-w-sm`, fondo `--ink-soft`, `radius-2xl`, `shadow-lg`,
  sin borde. Inputs sobre `--ink-softer` con micro-etiqueta uppercase
  dentro del campo (label 11px + valor), texto blanco, focus ring
  `--green-400`.
- CTA pill blanco con texto ink y flecha en `--green-500`; hover
  `shadow-brand`.
- Errores de credenciales: mismo patrón actual (mensaje bajo el form),
  sobre fondo `destructive/15` con texto claro legible en oscuro.

Es la **única** pantalla oscura de la v1 (el dark mode global sigue fuera de
alcance); usa tokens `--ink*` directamente, sin activar `.dark`.

### 4.3 Dashboard

- **Header de página**: saludo `text-3xl` («Hola, {nombre}») + subtítulo
  muted; a la derecha chip de fecha (pill, borde sutil, icono calendario).
  Se extrae como componente compartido `PageHeader` (título, descripción,
  slot de acciones) y se reutiliza en todos los módulos.
- **Stat cards** (grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`, gap 16):
  icon-tile 40px (`primary-soft`, radio `md`, icono lucide `--primary`) +
  micro-etiqueta + número `text-3xl tabular-nums` + pie contextual muted
  («total registrados»). Card entera clicable: hover eleva. Deltas
  (`+N este mes`) como chip tintado `success-soft` solo cuando el backend
  exponga el dato — no inventar métricas.
- **Asociados recientes**: pasa de `<ul>` con borde a card de tabla del
  patrón 4.4, con avatar de iniciales por fila.

### 4.4 Patrón de página de listado (asociados, pagarés, usuarios, catálogos)

Estructura única, en este orden:

1. `PageHeader`: título + descripción + acción primaria («Nuevo asociado»).
2. Barra de herramientas: búsqueda (input con icono lupa, `max-w-xs`) +
   filtros como chips/selects pill + contador de resultados muted.
3. **Card de tabla**: contenedor `radius-xl`, borde sutil, `overflow-hidden`;
   header de tabla sobre `surface-soft` con micro-etiquetas uppercase
   (variante `ink` — header casi-negro con texto blanco, como la
   referencia — reservada solo para la tabla principal de Pagarés, el
   módulo protagonista); filas `h-14` con divisores `border-subtle`, hover
   `surface-soft`; montos e identificadores en mono tabular alineados a la
   derecha; estado como badge tintado (`success-soft` Activo /
   `secondary` Inactivo / `destructive-soft` para errores); columna de
   acciones con dropdown de icono fantasma.
4. Pie de card: paginación (existente) + «Mostrando X–Y de Z».

**Responsive de tablas**: `< md` la tabla no se comprime — el mismo
componente de página renderiza lista de cards apiladas (título, subtítulo,
badge y acción) reutilizando las celdas definidas por columna; `md`–`lg`
scroll horizontal dentro de la card (`overflow-x-auto`), columnas
secundarias con `hidden lg:table-cell`.

### 4.5 Formularios y diálogos

- Labels arriba, `text-sm font-medium`; inputs `h-10 radius-md`, borde
  `--input`, focus ring actual (3px primario al 50%).
- Secciones de formulario largas (AssociateFieldset) agrupadas en cards con
  título de sección + descripción muted; grid `grid-cols-1 md:grid-cols-2`
  con `gap-4`, campos de ancho completo con `md:col-span-2`.
- Pie de acciones pegado abajo a la derecha: secundario fantasma + primario
  relleno; en `< md` botones a ancho completo apilados.
- Dialogs: `radius-xl`, `shadow-lg`, overlay `ink/40` con blur sutil
  (`backdrop-blur-[2px]`); destructivos con icon-tile `destructive-soft`
  junto al título.

### 4.6 Estados compartidos (`components/shared/`)

- **EmptyState**: ilustración SVG suave (§5) + título + descripción +
  acción opcional; centrado, `py-16`.
- **ErrorState**: mismo layout con ilustración de error + botón
  «Reintentar» outline.
- **LoadingState**: skeletons que respetan la silueta real del patrón
  (stat card, fila de tabla `h-14`, formulario) — no barras genéricas.

### 4.7 Primitivos nuevos a incorporar (shadcn/ui)

`sheet` (drawer móvil), `tooltip` (rail de iconos), `avatar` (iniciales),
`tabs` (reemplaza el CatalogTabs casero si aplica), `progress` (futuro),
`kbd` (atajo de búsqueda, futuro). Todos con los tokens de este plan, sin
estilos ad-hoc.

---

## 5. Ilustraciones suaves (guía)

Estilo propio, minimalista, coherente con lucide:

- **Composición**: blob orgánico de fondo (`primary-soft` o
  `--slate-200`) + motivo lineal encima (documento, carpeta, lupa,
  usuarios) con trazo 1.5px en `--primary` (o `--destructive` en errores)
  - 2–3 puntos/cruces decorativos al 30%.
- **Tamaño**: 160×120px en empty states, 200×150px en pantallas completas.
- **Formato**: componentes React SVG en `components/shared/illustrations/`
  (`EmptyAssociates`, `EmptyNotes`, `EmptyResults`, `ErrorCloud`), colores
  solo vía `currentColor`/variables — nunca hex incrustado, nunca PNG.
- **Dónde no**: nada de ilustraciones en headers, cards de datos ni
  formularios — solo estados sin datos.

---

## 6. Accesibilidad (se mantiene y se refuerza)

- Contraste AA mínimo en toda combinación nueva (verificar `primary-soft`
  vs `primary-soft-foreground`, badges tintados, texto sobre ink).
- Focus visible siempre (ring 3px existente); orden de foco en el drawer
  móvil con focus-trap (lo da el primitivo `sheet` de Radix).
- `aria-current="page"` en nav (existente), `aria-hidden` en todo SVG
  decorativo, tamaños táctiles ≥ 40px en móvil.
- El color nunca es el único portador de significado: badges siempre con
  texto, deltas con signo.

---

## 7. Fases de implementación

Continuación del roadmap (los PR se numeran como Fase 14.x); cada fase deja
`lint + typecheck + test` en verde y es desplegable por sí sola.

| Fase | Contenido                                                                                                 | Archivos principales                                       |
| ---- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 14.1 | **Fundaciones**: paleta primitiva + semánticos nuevos, radios 12px, escala de sombras, tokens de motion   | `app/globals.css`                                          |
| 14.2 | **Shell**: sidebar seccionado con activo `primary-soft`, topbar sticky, drawer móvil (`sheet`), rail `md` | `components/layout/*`, `lib/menu/menu-definition.ts`       |
| 14.3 | **Login de marca**: escena ink + blobs + card oscura                                                      | `app/(public)/login/`, `components/domain/auth/LoginForm`  |
| 14.4 | **Dashboard**: `PageHeader` compartido, stat cards con icon-tile, tabla de recientes                      | `app/(app)/dashboard/`, `components/shared/PageHeader.tsx` |
| 14.5 | **Patrón de listado**: card de tabla + toolbar + responsive (cards en móvil) aplicado a los 4 módulos     | `app/(app)/{asociados,pagares,usuarios,catalogos}/`        |
| 14.6 | **Formularios y diálogos**: secciones en card, pies de acción, dialogs `radius-xl`                        | `components/domain/*`                                      |
| 14.7 | **Estados e ilustraciones**: SVG propios en Empty/Error, skeletons con silueta real                       | `components/shared/`                                       |

Riesgos controlados: los e2e de Playwright seleccionan por rol/texto (no
por clase), así que el rediseño no debería romperlos — se corren completos
en 14.2 y 14.5, las dos fases que tocan estructura de DOM. El cambio de
`--background` a canvas gris afecta a todas las vistas desde 14.1: es
intencional y de bajo riesgo (solo color).

Fuera de alcance (sin cambios respecto al plan general): dark mode global,
i18n, gráficos/charts (no hay endpoint de series temporales en el contrato).
