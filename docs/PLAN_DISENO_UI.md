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

> **Revisión v2** — cambios sobre la primera versión del plan, tras
> crítica de diseño: (1) se añade una **firma visual propia** («el
> talonario», §3) para que la identidad salga del objeto real del negocio
> y no de las referencias; (2) el login deja de copiar los adornos de la
> referencia y adopta esa firma; (3) se añaden **voz y microcopia** (§7) y
> **estándares de interacción** (§8) — la palabra y el comportamiento son
> material de diseño, no solo el color; (4) el responsive de tablas pasa a
> **container queries** y la tipografía de títulos a escala fluida.

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
| Microcopia      | Sin vocabulario canónico ni voz definida: labels y toasts se redactan ad-hoc por componente   |

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
8. **La palabra es parte del diseño.** Cada label, toast y error se redacta
   desde el lado del usuario, con el vocabulario canónico de §7 — nunca
   ad-hoc por componente.

---

## 3. Firma visual: el talonario

El elemento propio que ninguna referencia presta: el negocio gira alrededor
de un **documento legal numerado** — el pagaré vive en un talonario, con
folio y borde troquelado. De ahí salen las dos piezas de la firma, sobrias
y reproducibles en CSS puro:

- **El folio.** Todo identificador de pagaré se trata como folio de
  documento: chip en JetBrains Mono `tabular-nums` (`PG-2026-0341`) sobre
  `surface-soft`, radio `sm`, tracking ligero. Es el único dato que se
  presenta siempre en chip — cédulas y montos van en mono pero sin chip.
  Aparece en tablas, en el título del detalle de pagaré y en los toasts
  («Pagaré PG-2026-0341 creado»).
- **El troquel.** Una línea punteada de perforación (1px, guiones cortos,
  color del texto al 25%) marca las superficies que «emiten documento»:
  bajo el header ink de la tabla de Pagarés, en el borde superior de la
  card del login (el formulario es el documento que se desprende del
  talonario) y en el encabezado de la card de detalle de un pagaré.

Reglas de contención: **máximo un troquel por vista**, nunca en cards de
datos genéricas, nunca como decoración de secciones. Si un elemento nuevo
pide troquel y no representa un documento, la respuesta es no. La firma es
el único riesgo estético del sistema; todo lo demás permanece quieto.

---

## 4. Arquitectura de tokens (3 capas)

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

### 4.1 Paleta propia (primitivos)

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

### 4.2 Semánticos nuevos (además de los existentes)

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

### 4.3 Radios

```css
--radius: 0.75rem; /* 12px base (antes 8px) */
--radius-sm: 8px; /* inputs compactos, badges rectangulares, chip de folio */
--radius-md: 10px; /* botones, inputs */
--radius-lg: 12px; /* cards, popovers */
--radius-xl: 16px; /* cards protagonistas, contenedor de tabla */
--radius-2xl: 20px; /* card del login, promo del sidebar */
/* pill = rounded-full: chips, botones de filtro, avatares */
```

### 4.4 Sombras (escala propia, tintadas con ink)

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

### 4.5 Espaciado

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

### 4.6 Tipografía

| Rol               | Spec                                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Título de página  | Inter semibold, fluido: `text-[clamp(1.5rem,1.2rem+1.2vw,1.875rem)] tracking-tight`                                           |
| Título de sección | Inter semibold `text-lg`                                                                                                      |
| Dato/stat grande  | Inter bold, fluido: `text-[clamp(1.75rem,1.4rem+1.4vw,2.25rem)] tabular-nums tracking-tight`                                  |
| Cuerpo            | Inter regular `text-sm` (14px, la app es densa en datos)                                                                      |
| Micro-etiqueta    | `text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground` — secciones del sidebar, labels de stat, eyebrows |
| Identificadores   | JetBrains Mono `text-sm tabular-nums` — cédulas, nº de pagaré (chip de folio, §3), montos en tablas                           |

La escala fluida con `clamp()` reemplaza los saltos por breakpoint en
títulos y stats: el tamaño acompaña al viewport sin escalones.

### 4.7 Movimiento

```
--ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
Duraciones: 150ms (color/opacidad) · 200ms (transform/sombra) · 300ms (drawer/dialog)
```

Patrones: hover de card interactiva (`-translate-y-0.5` + sombra), press de
botón (`active:scale-[0.98]`), entrada de dialog/drawer (fade + slide 8px,
ya provisto por tw-animate-css), skeleton con `animate-pulse`. Todo bajo
`motion-safe:`.

---

## 5. Patrones de componentes

### 5.1 Shell (AppShell / Sidebar / Topbar)

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
secciones. Primer elemento tabulable del shell: skip-link «Ir al
contenido» (visible solo con foco), destino `#main` con
`scroll-margin-top` para que el topbar sticky no lo tape.

### 5.2 Login (identidad de marca)

Escena oscura de marca — el patrón de la referencia traducido al verde
petróleo y a la firma del talonario (§3):

- Fondo `--ink` a pantalla completa con 2 formas orgánicas SVG en
  `--ink-soft`/`--ink-softer` (absolutas, `overflow-hidden`, `aria-hidden`)
  y 2–3 puntos suaves al 30% — mismos motivos decorativos que las
  ilustraciones (§6), sin glifos prestados de la referencia.
- Marca centrada arriba de la card (wordmark blanco).
- Card `w-full max-w-sm`, fondo `--ink-soft`, `radius-2xl`, `shadow-lg`,
  sin borde, con **troquel en el borde superior** y eyebrow-folio
  («ACCESO · PAGARÉS», micro-etiqueta) — el formulario es el documento que
  se desprende del talonario.
- Inputs sobre `--ink-softer` con micro-etiqueta uppercase dentro del campo
  (label 11px + valor), texto blanco, focus ring `--green-400`.
- CTA pill blanco con texto ink y flecha en `--green-500`; hover
  `shadow-brand`.
- Errores de credenciales: mismo patrón actual (mensaje bajo el form),
  sobre fondo `destructive/15` con texto claro legible en oscuro.

Es la **única** pantalla oscura de la v1 (el dark mode global sigue fuera de
alcance); usa tokens `--ink*` directamente, sin activar `.dark`.

### 5.3 Dashboard

- **Header de página**: saludo fluido («Hola, {nombre}») + subtítulo
  muted; a la derecha chip de fecha (pill, borde sutil, icono calendario).
  Se extrae como componente compartido `PageHeader` (título, descripción,
  slot de acciones) y se reutiliza en todos los módulos.
- **Acciones rápidas** bajo el header: primario «Nuevo pagaré» + outline
  «Nuevo asociado», derivadas de `permissions[]` — el patrón de par de
  acciones de las referencias, aplicado a las dos altas reales del negocio.
- **Stat cards** (grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`, gap 16):
  icon-tile 40px (`primary-soft`, radio `md`, icono lucide `--primary`) +
  micro-etiqueta + número fluido `tabular-nums` + pie contextual muted
  («total registrados»). Card entera clicable: hover eleva. Deltas
  (`+N este mes`) como chip tintado `success-soft` solo cuando el backend
  exponga el dato — no inventar métricas.
- **Asociados recientes**: pasa de `<ul>` con borde a card de tabla del
  patrón 5.4, con avatar de iniciales por fila.

### 5.4 Patrón de página de listado (asociados, pagarés, usuarios, catálogos)

Estructura única, en este orden:

1. `PageHeader`: título + descripción + acción primaria («Nuevo asociado»).
2. Barra de herramientas: búsqueda (input con icono lupa, `max-w-xs`) +
   filtros como chips/selects pill + contador de resultados muted.
3. **Card de tabla**: contenedor `radius-xl`, borde sutil, `overflow-hidden`;
   header de tabla sobre `surface-soft` con micro-etiquetas uppercase
   (variante `ink` — header casi-negro con texto blanco y **troquel**
   debajo (§3) — reservada solo para la tabla principal de Pagarés, el
   módulo protagonista); filas `h-14` con divisores `border-subtle`, hover
   `surface-soft`; nº de pagaré como chip de folio (§3); montos en mono
   tabular alineados a la derecha; estado como badge tintado
   (`success-soft` Activo / `secondary` Inactivo / `destructive-soft` para
   errores); columna de acciones con dropdown de icono fantasma.
4. Pie de card: paginación (existente) + «Mostrando X–Y de Z».

**Responsive de tablas — container queries**: la card de tabla es un
`@container`; el cambio de presentación se decide por el **ancho del
contenedor**, no del viewport (Tailwind v4 lo trae nativo). Por debajo de
`@3xl` (~768px de contenedor) el mismo componente renderiza lista de cards
apiladas (título, subtítulo, badge y acción) reutilizando las celdas
definidas por columna; entre `@3xl` y `@5xl`, scroll horizontal dentro de
la card (`overflow-x-auto`) con columnas secundarias ocultas. Así la misma
tabla funciona en una columna estrecha del dashboard y a página completa
sin duplicar lógica.

### 5.5 Formularios y diálogos

- Labels arriba, `text-sm font-medium`; inputs `h-10 radius-md`, borde
  `--input`, focus ring actual (3px primario al 50%).
- Secciones de formulario largas (AssociateFieldset) agrupadas en cards con
  título de sección + descripción muted; grid `grid-cols-1 md:grid-cols-2`
  con `gap-4`, campos de ancho completo con `md:col-span-2`.
- Pie de acciones pegado abajo a la derecha: secundario fantasma + primario
  relleno; en `< md` botones a ancho completo apilados.
- Dialogs: `radius-xl`, `shadow-lg`, overlay `ink/40` con blur sutil
  (`backdrop-blur-[2px]`); destructivos con icon-tile `destructive-soft`
  junto al título y la consecuencia explícita en la descripción
  («Se eliminará el pagaré PG-2026-0341. Esta acción no se puede
  deshacer.»).
- Comportamiento de validación y foco: ver §8.

### 5.6 Estados compartidos (`components/shared/`)

- **EmptyState**: ilustración SVG suave (§6) + título + descripción +
  acción opcional; centrado, `py-16`. La copia invita a actuar (§7).
- **ErrorState**: mismo layout con ilustración de error + botón
  «Reintentar» outline.
- **LoadingState**: skeletons que respetan la silueta real del patrón
  (stat card, fila de tabla `h-14`, formulario) — no barras genéricas.

### 5.7 Primitivos nuevos a incorporar (shadcn/ui)

`sheet` (drawer móvil), `tooltip` (rail de iconos), `avatar` (iniciales),
`tabs` (reemplaza el CatalogTabs casero si aplica), `progress` (futuro),
`kbd` (atajo de búsqueda, futuro). Todos con los tokens de este plan, sin
estilos ad-hoc.

**Estados completos por primitivo**: todo componente interactivo define sus
seis estados — default / hover / focus-visible / active / disabled /
loading — en su CVA. El botón en loading conserva su ancho (spinner
reemplaza al icono, no al texto) y queda `disabled`; la fila de tabla
clicable tiene hover y focus-visible propios.

---

## 6. Ilustraciones suaves (guía)

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

## 7. Voz y microcopia (es-CO)

La palabra se diseña con el mismo rigor que el color. Reglas:

- **Voz activa, del lado del usuario.** Los controles dicen exactamente qué
  pasa: «Guardar cambios», no «Enviar»; «Crear pagaré», no «Aceptar».
- **El mismo verbo en todo el flujo.** El botón «Crear pagaré» produce el
  toast «Pagaré PG-2026-0341 creado» — nunca un sinónimo a mitad de camino.
- **Sentence case** en todo (botones, títulos, menús); las mayúsculas
  sostenidas solo existen en micro-etiquetas (§4.6).
- **Específico antes que ingenioso.** Nada de «¡Ups!» ni disculpas: los
  errores dicen qué pasó y cómo seguir, mapeados desde `error.code` del
  envelope (convención existente): «La cédula ya está registrada. Consulte
  el asociado existente o corrija el número.»
- **Los vacíos invitan a actuar**: «Todavía no hay pagarés para este
  asociado. Cree el primero con "Nuevo pagaré".» El vacío por búsqueda es
  otro mensaje: «Sin resultados para “{término}”. Revise el número o
  intente con el nombre.»

**Vocabulario canónico** (un nombre por concepto, en UI y en toasts):

| Se dice                                                   | Nunca                                    |
| --------------------------------------------------------- | ---------------------------------------- |
| Pagaré                                                    | Nota, nota administrativa, doc           |
| Asociado                                                  | Cliente, usuario (salvo módulo Usuarios) |
| Nuevo pagaré (abre el formulario) / Crear pagaré (submit) | Agregar, Añadir, Registrar               |
| Guardar cambios                                           | Enviar, Actualizar, Aceptar              |
| Eliminar (con confirmación)                               | Borrar, Remover                          |
| Cerrar sesión                                             | Salir, Logout                            |

**Formatos regionales** (helpers en `lib/format.ts`, siempre vía `Intl`):

- Moneda: `Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })` → «$ 2.500.000».
- Fechas: `Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })` → «12 jun 2026»; fechas relativas solo en listados («hace 2 h») con el valor absoluto en `title`.
- Cédulas: agrupadas con puntos («1.045.228.917»), en mono tabular.

---

## 8. Estándares de interacción

Comportamiento uniforme en toda la app — es parte del sistema de diseño,
no una decisión por pantalla:

- **Validación de formularios**: primera validación en `blur`
  (`mode: 'onTouched'` de react-hook-form), revalidación en `change` una
  vez tocado; error inline bajo el campo con `aria-invalid` +
  `aria-describedby`. En submit fallido, el foco salta al primer campo con
  error. El submit en curso muestra spinner sin cambiar el ancho del botón
  y bloquea reenvíos.
- **Feedback**: éxito → toast con el verbo del botón (§7); error de negocio
  que pertenece a un campo → inline en el campo, no toast; error de sistema
  → `ErrorState` o toast persistente con «Reintentar». Un toast nunca es el
  único registro de un error.
- **Confirmación**: solo para acciones destructivas e irreversibles
  (eliminar), con la consecuencia explícita en el dialog. Las acciones
  reversibles no confirman — se ejecutan y notifican.
- **Búsqueda y filtros**: debounce de 300ms; el estado «sin resultados»
  (con el término buscado) es distinto del «sin datos» (§7); todo filtro
  activo queda visible y removible desde la toolbar; búsqueda y página
  viven en la URL (patrón existente con `useSearchParams`) para que el
  atrás del navegador funcione.
- **Foco y teclado**: skip-link (§5.1); focus trap y retorno de foco en
  dialogs y drawer (lo dan Radix `Dialog`/`Sheet`); orden de tabulación =
  orden visual; `Esc` cierra siempre el overlay superior.
- **Estabilidad de layout**: skeletons con la silueta y altura reales
  (§5.6) + alturas mínimas reservadas en cards de datos → CLS ≈ 0; nunca
  spinner a pantalla completa; las imágenes/ilustraciones declaran
  dimensiones.

---

## 9. Accesibilidad (se mantiene y se refuerza)

- Contraste AA mínimo en toda combinación nueva (verificar `primary-soft`
  vs `primary-soft-foreground`, badges tintados, texto sobre ink).
- Focus visible siempre (ring 3px existente); WCAG 2.2: targets ≥ 24px CSS
  (esta app usa ≥ 40px en móvil) y foco nunca oculto tras el topbar sticky
  (`scroll-padding-top` global).
- `aria-current="page"` en nav (existente), `aria-hidden` en todo SVG
  decorativo (blobs del login, ilustraciones, troquel).
- El color nunca es el único portador de significado: badges siempre con
  texto, deltas con signo.

---

## 10. Fases de implementación

Continuación del roadmap (los PR se numeran como Fase 14.x); cada fase deja
`lint + typecheck + test` en verde y es desplegable por sí sola. La voz y
microcopia (§7) y los estándares de interacción (§8) aplican
transversalmente desde 14.2 — cada fase redacta su copia con el
vocabulario canónico al tocar cada pantalla.

| Fase | Contenido                                                                                                            | Archivos principales                                       | Estado |
| ---- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| 14.1 | **Fundaciones**: paleta primitiva + semánticos nuevos, radios 12px, escala de sombras, motion, `lib/format.ts`       | `app/globals.css`, `lib/format.ts`                         | ✅     |
| 14.2 | **Shell**: sidebar seccionado con activo `primary-soft`, topbar sticky, drawer móvil (`sheet`), rail `md`, skip-link | `components/layout/*`, `lib/menu/menu-definition.ts`       | ✅     |
| 14.3 | **Login talonario**: escena ink + card documento con troquel y eyebrow-folio                                         | `app/(public)/login/`, `components/domain/auth/LoginForm`  | ✅     |
| 14.4 | **Dashboard**: `PageHeader` compartido, acciones rápidas, stat cards con icon-tile, tabla de recientes               | `app/(app)/dashboard/`, `components/shared/PageHeader.tsx` | ✅     |
| 14.5 | **Patrón de listado**: card de tabla + toolbar + container queries (cards en contenedor angosto), folio en Pagarés   | `app/(app)/{asociados,pagares,usuarios,catalogos}/`        | ✅     |
| 14.6 | **Formularios y diálogos**: secciones en card, pies de acción, dialogs `radius-xl`, validación §8                    | `components/domain/*`                                      | ✅     |
| 14.7 | **Estados e ilustraciones**: SVG propios en Empty/Error, skeletons con silueta real, copia de vacíos §7              | `components/shared/`                                       | ✅     |

Todas las fases implementadas. Nota de 14.5: las identificaciones se
muestran crudas (sin agrupar) en los listados porque los e2e las buscan
por valor exacto; el formato con puntos queda para dashboard y detalle.

Riesgos controlados: los e2e de Playwright seleccionan por rol/texto (no
por clase) — el vocabulario canónico de §7 **puede cambiar textos que los
e2e buscan**, así que 14.4–14.6 revisan `tests/e2e/` al renombrar labels;
la suite completa se corre en 14.2 y 14.5, las dos fases que más tocan
estructura de DOM. El cambio de `--background` a canvas gris afecta a todas
las vistas desde 14.1: es intencional y de bajo riesgo (solo color).

Fuera de alcance (sin cambios respecto al plan general): dark mode global,
i18n, gráficos/charts (no hay endpoint de series temporales en el contrato).
