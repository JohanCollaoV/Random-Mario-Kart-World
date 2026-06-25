# Changelog

## v2.1 (en desarrollo) — Cambios sin commit

### Refactor: sistema de toggle genérico para imágenes

- **Antes:** solo `Cielos Helados` tenía toggle de imagen en Modo KDU, manejado con un booleano suelto `mostrarHelados`.
- **Ahora:** sistema extensible `toggleTracks` que permite configurar imágenes alternativas para cualquier pista. Se agregaron:
  - **Castillo Bowser** → `arielllorando.webp` ("Ariel llorando")
  - **Pradera Mu-Mu** → `lechedetoro.jpg` ("Leche de toro")
  - **Cielos Helados** → `mcflurry.png` ("Helados") (ya existía)
- Nuevo estado `toggleState` (objeto `{ trackName: boolean }`) reemplaza al booleano `mostrarHelados`.

### Cambios en nombres alternativos (Modo KDU)

Varios `nombreAlt` modificados en `js/data.js`:

| Pista | Antes | Ahora |
|-------|-------|-------|
| Circuito Mario Bros. | "...Chupa el pico" | "...Chupa el pico punto" |
| Estadio Wario | "Estadio" | "Estadio de Furros" |
| Galéon de Wario | "Galeon" | "Galeon de Furros" |
| Estadio Peach | "Estadio de Perras" | "Estadio de Pitshulas" |
| Playa de Peach | "Playa de Tulas" | "Playa de Pichulas" |
| Ciudad Salina | "Salina" | "Salina Satelite" |
| Cascadas Cheep Cheep | "Cascadas Chupa Chupa" | "Cascadas Chupa Chupa... Pico" |
| Gruta Diente de León | "Gruta" | "Gruta Lo Urdes" |
| Pradera Mu-Mu | "Te saco leche de P Toro" | "Te saco leche de Toro" |
| Monte Chocolate | "Monte Chocoleit" | "Te saco Chocolate" |
| Aldea Arbórea | "La pista de Cristoweco" | "La pista de Cristolini" |
| Circuito Mario | "...Chupa el pico" | "...Chupa el pico sin punto" |

### Assets nuevos

- `assets/images/tracks/arielllorando.webp` — imagen toggle para Castillo Bowser
- `assets/images/tracks/lechedetoro.jpg` — imagen toggle para Pradera Mu-Mu

---

## v2.0 — APK Offline + Layout Responsive

- Header con flexbox y dos logos (KDU + Mario Aniversario)
- Layout responsive con soporte para tablet (horizontal)
- Service Worker v4 con precarga completa de assets
- APK generado como Trusted Web Activity (offline)
- Modo KDU/Nintendo con toggle iOS-style
- Corrección de rutas de logos e imágenes
- Los nombres alternativos de todas las pistas se movieron a `data.js`

## v1.0 — Initial Commit

- Randomizador básico de 30 pistas de Mario Kart World
- Tabla con selección aleatoria
- Persistencia en localStorage
- Animación de sorteo
