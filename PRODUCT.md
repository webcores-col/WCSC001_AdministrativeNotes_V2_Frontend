# Product

## Register

product

## Platform

web

## Users

Personal interno de COINTRAMIN que opera el back-office del sistema de notas
administrativas: usuarios con rol ADMIN y roles operativos que gestionan
asociados (miembros de la cooperativa), pagarés (documentos de deuda),
catálogos y otros usuarios del sistema. El menú y las acciones disponibles se
derivan de los permisos reales de la sesión. El uso es principalmente en
escritorio durante horario laboral, con soporte responsive real (rail de
iconos en tablet, drawer en móvil) para consultas puntuales fuera del puesto
fijo. La tarea recurrente es registrar y consultar pagarés ligados a un
asociado con certeza de estar frente al documento correcto.

## Product Purpose

Frontend BFF (Next.js + Auth.js) del sistema WCSC001 Administrative Notes:
da acceso administrativo a asociados, pagarés, catálogos y usuarios de
COINTRAMIN, consumiendo el contrato real del backend V2 en producción. El
éxito se mide en que el personal registre y consulte pagarés sin ambigüedad
ni errores de captura, con permisos que reflejan exactamente el rol de cada
usuario y trazabilidad de quién tocó cada registro.

## Positioning

El registro único y confiable del ciclo de vida de los pagarés y sus
asociados en COINTRAMIN: un solo lugar donde cada pagaré, desde su alta
hasta su eliminación lógica, queda documentado con la certeza de que es el
documento correcto.

## Brand Personality

Confiable, preciso y calmado. Corporativo sin ser frío: el verde petróleo se
reserva para la acción primaria y el dato positivo, nunca como decoración.
La superficie ink (casi negro verdoso) es el único recurso de contraste
fuerte del sistema y se usa con moderación deliberada — hoy en el login, el
header de la tabla protagonista de Pagarés y el botón de exportar.

## Anti-references

SaaS genérico: dashboards de plantilla con cards flotantes idénticas,
gradientes decorativos, glassmorphism, ilustraciones de stock, el
hero-metric template. También el extremo opuesto — banca tradicional
rígida, excesivamente formal y sin calidez.

## Design Principles

Contraste por superficie, no por decoración: la jerarquía se construye en
capas (canvas → card → tinte suave), nunca con adornos añadidos. Un solo
elemento primario relleno por vista: el acento de marca se reserva para la
acción que más importa en cada pantalla. La firma visual sale del negocio
real, no de referencias externas — el talonario (folio + troquel) explica
cada pieza nueva por el objeto real del negocio, el pagaré, no por moda del
momento. La palabra es material de diseño: cada label, toast y error se
redacta desde el lado del usuario con el vocabulario canónico del proyecto,
nunca ad-hoc por componente. Ilustración y decoración con moderación
extrema: solo en vacíos, error y login — nunca en headers ni cards de
datos.

## Accessibility & Inclusion

WCAG 2.2 AA como piso: contraste AA verificado en toda combinación nueva
(incluidos badges tintados y texto sobre ink), foco visible siempre,
`aria-current` en navegación, objetivos táctiles ≥24px CSS (≥40px ya en
móvil), y `prefers-reduced-motion` respetado en toda animación nueva.
