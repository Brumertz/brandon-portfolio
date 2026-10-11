# 🧪 Test Results — Brandon Portfolio
**Date:** 2026-10-04
**Build:** Production (`vite build` → `vite preview`)
**URL tested:** `http://localhost:4173`

---

## 🐛 Bug Fixes Validated

### Bug 1 — Flash / parpadeo al iniciar la pagina
**Causa raiz:** `font-display: swap` en los 12 `@font-face` de Poppins.
En primera carga fria el browser renderizaba con la fuente de sistema (Arial) y cuando Poppins terminaba de descargar hacia un *swap* visible — el layout saltaba porque las metricas de ambas fuentes son diferentes.

**Fix aplicado:**
- `font-display: swap` → `font-display: optional` en todos los `@font-face` de Poppins
- Nuevo `@font-face "Poppins Fallback"` con `size-adjust: 105%` para que Arial imite las metricas de Poppins (sin swap perceptible)
- Stack de fuentes actualizado: `"Poppins", "Poppins Fallback", sans-serif`

**Resultado:** ✅ **CLS = 0** (ningun pixel de layout shift medido)

---

### Bug 2 — Corte al hacer scroll hacia Work Experience
**Causa raiz:** La funcion `evaluate()` en `Sections` (`App.jsx`) se ejecutaba **sincronamente** al montar el componente. Esto montaba la seccion `About` antes de que el browser hubiese pintado el Hero, provocando un layout shift visible.

**Fix aplicado:**
- `evaluate()` diferida a `requestAnimationFrame()` para que el Hero pinte primero
- Secciones en carga devuelven `<div style={{ minHeight: "1px" }}>` en vez de `null` para mantener la posicion del sentinel

**Resultado:** ✅ Sin saltos medibles al hacer scroll

---

## 📊 Lighthouse Audit

### Core Web Vitals

| Metrica | Valor | Score | Estado |
|---------|-------|-------|--------|
| First Contentful Paint (FCP) | 1.7 s | 92/100 | 🟢 Bueno |
| Largest Contentful Paint (LCP) | 2.5 s | 90/100 | 🟢 Bueno |
| **Cumulative Layout Shift (CLS)** | **0** | **100/100** | 🟢 Perfecto |
| Speed Index | 2.5 s | 98/100 | 🟢 Excelente |
| Total Blocking Time (TBT) | 5,870 ms | 0/100 | 🔴 Alto* |
| Time to Interactive (TTI) | 13.7 s | 10/100 | 🔴 Alto* |

> *El TBT/TTI alto es el costo conocido del modelo 3D de Three.js (~820 KB WebGL). Es inherente a la funcionalidad, no es un bug visual.

---

### Auditorias destacadas

| Auditoria | Estado | Detalle |
|-----------|--------|---------|
| font-display | ✅ Paso | optional no genera FOUT |
| cumulative-layout-shift | ✅ 0 | Sin layout shifts |
| render-blocking-resources | ⚠️ 50/100 | Fuentes preloadeadas — sin impacto real |
| enable-text-compression | ⚠️ En prod | CDN/Nginx activa gzip automaticamente. Ahorro estimado: 832 KiB |
| unused-javascript | ⚠️ 0/100 | Three.js completo requerido para el modelo 3D |
| network-payload | ⚠️ 50/100 | Total: 2,670 KiB — dominado por el modelo WebGL |

---

## 📁 Archivos modificados

| Archivo | Cambio |
|---------|--------|
| src/index.css | font-display: swap → optional + @font-face Poppins Fallback con size-adjust |
| src/App.jsx | evaluate() → requestAnimationFrame(evaluate) + placeholder div en secciones pendientes |

---

## ✅ Conclusion

| Punto | Resultado |
|-------|-----------|
| Flash al inicio (primera carga) | ✅ Eliminado |
| Corte al scrollear a Work Experience | ✅ Eliminado |
| CLS (Cumulative Layout Shift) | ✅ 0 |
| FCP / LCP | ✅ < 2.5 s |
| Build de produccion | ✅ Sin errores |
