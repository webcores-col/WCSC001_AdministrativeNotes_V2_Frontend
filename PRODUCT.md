# Product

## Register

product

## Platform

web

## Users

Personal administrativo y operativo interno de COINTRAMIN que gestiona asociados, pagarés (notas administrativas) y catálogos desde una oficina, en jornada laboral. Tres roles con distinto alcance — Administrador, Operador y Consulta — reflejan permisos reales, no un rol hardcodeado en el cliente. El trabajo es repetitivo pero de alto cuidado: cada pantalla maneja datos financieros y legales donde un error de registro tiene consecuencias reales, no un contexto casual ni exploratorio.

## Product Purpose

Reemplaza el sistema legacy interno de COINTRAMIN (una aplicación Node.js básica, sin arquitectura de permisos ni experiencia cuidada) como fuente de verdad oficial para gestionar asociados, pagarés, catálogos y usuarios. Éxito es que el personal registre y consulte esta información con precisión y sin fricción frente al proceso anterior, con una interfaz que refleja permisos reales por rol.

## Positioning

La reconstrucción completa —arquitectura BFF, permisos reales por rol, identidad visual propia— del sistema de gestión de asociados y pagarés de COINTRAMIN. La V2 es ahora la única fuente de verdad, no una capa nueva sobre el v1.

## Brand Personality

Corporativo, calmado y preciso — nunca genérico ni decorativo. La voz es directa y del lado del usuario (ver `docs/PLAN_DISENO_UI.md` §7): sentence case, verbos activos, el mismo verbo en todo un flujo, errores que explican qué pasó y cómo seguir en vez de disculparse.

## Anti-references

No debe sentirse como una repintada del legacy v1 (una app Node.js básica, sin identidad propia). Tampoco debe calcar las referencias visuales usadas como inspiración inicial (gratafy, Bankio, Oripio) ni caer en clichés de dashboard SaaS/fintech genérico — la identidad sale del objeto real del negocio, no de plantillas prestadas.

## Design Principles

La firma visual nace del negocio real, no de referencias prestadas: cada elemento distintivo (el folio del pagaré, el troquel) representa algo verdadero sobre el documento, no una decoración importada. El contraste se usa con propósito — el acento y la superficie oscura (ink) se reservan para lo que de verdad importa. La palabra es tan de diseño como el color: vocabulario canónico y voz activa en toda la app. Los permisos son siempre reales: lo que el usuario ve y puede hacer se deriva de `session.permissions[]`, nunca de una suposición del cliente. Precisión antes que ornamento, dado que el usuario está enfocado en una tarea con datos financieros/legales, no explorando.

## Accessibility & Inclusion

Contraste AA mínimo en toda combinación de color; foco visible siempre (ring de 3px); tamaños táctiles ≥40px en móvil (≥24px CSS por WCAG 2.2); el color nunca es el único portador de significado (badges siempre con texto); todo SVG decorativo lleva `aria-hidden`; `prefers-reduced-motion` siempre respetado.
