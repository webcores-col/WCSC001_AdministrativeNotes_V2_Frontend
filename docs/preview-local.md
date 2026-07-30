# Ambiente de preview local (runner auto-hospedado)

Permite revisar una rama/PR de este frontend corriendo de verdad en el
navegador — contra el backend V2 que ya corrés localmente — antes de
mergear a `main`, sin tocar el pipeline de CD ni el VPS de producción.

## Por qué existe

Dashboard, Listados y Formularios viven detrás de sesión y necesitan el
backend real + Postgres para renderizar con datos de verdad. No hay forma
de verlos en CI (`ubuntu-latest` no tiene tu backend ni tu DB), así que
este ambiente corre en tu propia máquina vía un runner de GitHub Actions
auto-hospedado, disparado a mano.

## Arquitectura

- **Runner**: `wsl2-local-preview`, registrado solo en este repo con el
  label `local-preview` (no `self-hosted` a secas) — así ningún workflow
  existente (`ci.yml`, `e2e.yml`, `cd.yml`, que piden `ubuntu-latest`) se
  ve afectado por su presencia.
- **Disparo**: siempre `workflow_dispatch` manual, nunca automático en
  push/PR. Un runner auto-hospedado ejecuta lo que diga el workflow en tu
  propia PC — que corra solo con cualquier push (tuyo o de un
  colaborador) sería un riesgo real de ejecución de código no revisado.
  `workflow_dispatch` además requiere permiso de escritura en el repo
  para dispararse.
- **Backend/DB**: se **reutiliza** el `wcsc-v2-api`/`wcsc-v2-db` que ya
  tenés corriendo localmente (con datos sembrados) — el ambiente efímero
  es solo el frontend. Nada de esto los levanta, migra ni destruye.
- **Frontend efímero**: `preview-up.yml` hace build de producción de la
  rama pedida y lo corre como unidad transient de `systemd --user`
  (`wcsc-preview`) en el puerto que elijas (default `3005`), con un
  `AUTH_SECRET` generado al vuelo (no persiste, no hace falta
  guardarlo). `preview-down.yml` hace `systemctl --user stop wcsc-preview`.
  **Por qué systemd y no `setsid nohup ... &`**: el runner corre cada job
  dentro de su propio cgroup y lo destruye completo al terminar,
  matando cualquier proceso detached aunque haya cambiado de sesión —
  confirmado en producción: el server arrancaba y respondía bien, y aun
  así moría apenas el job terminaba. `systemd-run --user` crea la unidad
  en el cgroup del usuario, fuera del árbol del job.
- Ver logs del preview en vivo: `journalctl --user -u wcsc-preview -f`.

## Cómo usarlo

1. Asegurate de que tu backend local responda: `curl http://localhost:3000/health`.
2. GitHub → Actions → **Preview local (levantar)** → Run workflow → indicá
   la rama (`ref`) que querés revisar.
3. Cuando el job termine, va a decir `Preview arriba en http://localhost:3005`
   (o el puerto que hayas puesto) — abrilo en tu navegador.
4. Cuando termines: Actions → **Preview local (destruir)** → Run workflow
   (con el mismo `port` que usaste al levantarlo, si no fue el default).

Solo puede haber un preview a la vez (si corrés "levantar" con uno ya
activo, falla con un mensaje claro pidiendo destruir el anterior primero).

## Setup del runner (ya hecho, referencia para reinstalar)

El runner vive en `~/actions-runners/wcsc001-frontend-preview/` (fuera de
cualquier repo, no versionado). No se instaló como servicio systemd
(no había sudo passwordless disponible en la sesión que lo configuró) —
corre como proceso de usuario vía `nohup ./run.sh &`. Si la PC/WSL2 se
reinicia, el runner deja de escuchar y hay que volver a arrancarlo:

```bash
cd ~/actions-runners/wcsc001-frontend-preview
nohup ./run.sh > runner.log 2>&1 &
disown
```

Verificar que quedó online:

```bash
gh api repos/webcores-col/WCSC001_AdministrativeNotes_V2_Frontend/actions/runners \
  --jq '.runners[] | {name, status}'
```

Si en algún momento se quiere pasar a un servicio real (persiste solo tras
reinicios sin este comando manual), hace falta sudo para
`sudo ./svc.sh install && sudo ./svc.sh start` desde ese mismo directorio.

## Para desregistrar el runner por completo

```bash
cd ~/actions-runners/wcsc001-frontend-preview
./config.sh remove --token <token de un nuevo registration-token, ver abajo>
```

El token de remoción se genera igual que el de registro:

```bash
gh api -X POST repos/webcores-col/WCSC001_AdministrativeNotes_V2_Frontend/actions/runners/remove-token --jq '.token'
```
