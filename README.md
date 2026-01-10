# Dynamic Photography Portfolio | Headless CMS via Google Sheets

> Una solución de portafolio web de alto rendimiento, autoadministrable y sin costes de servidor, diseñada para profesionales visuales que requieren flexibilidad y diseño sin barreras técnicas.

## 📋 Descripción del Proyecto

Este repositorio aloja una aplicación web estática (SPA) construida con **HTML5, CSS3 y JavaScript (ES6)**, que implementa una arquitectura *Serverless* no convencional. En lugar de utilizar bases de datos tradicionales o CMS complejos (como WordPress), el sistema utiliza **Google Sheets** como backend dinámico.

El objetivo es ofrecer al cliente final una interfaz de administración familiar (una hoja de cálculo) que permite actualizaciones en tiempo real de galerías, textos y enlaces, manteniendo el frontend ligero, rápido y alojado gratuitamente.

## Características Técnicas

* **Arquitectura Headless (Google Sheets API):** El contenido se consume dinámicamente mediante la lectura de un feed CSV publicado desde Google Sheets. No requiere reconstrucción (build) para actualizar contenidos.
* **Diseño Masonry Inteligente:** Implementación de **CSS Grid con flujo denso** (`grid-auto-flow: dense`) que interpreta directivas de diseño (`vertical`, `horizontal`, `big`) desde la base de datos para crear composiciones visuales asimétricas y modernas.
* **Google Drive como CDN:** Las imágenes se renderizan directamente desde Google Drive mediante un algoritmo de conversión de enlaces, eliminando la necesidad de hostings de imágenes externos.
* **Responsive & Mobile-First:** Navegación híbrida que actúa como sidebar fijo en escritorio y se transforma en un menú off-canvas con transiciones suaves en dispositivos móviles.
* **Optimización de Rendimiento:** Carga diferida (`lazy loading`) nativa en imágenes y animaciones basadas en `IntersectionObserver` para una experiencia de usuario fluida (60fps).

## Stack Tecnológico

* **Frontend:** HTML5 Semántico, CSS3 (Variables, Grid, Flexbox), Vanilla JavaScript.
* **Gestión de Datos:** Google Sheets (CSV Export).
* **Librerías:** `PapaParse.js` (Para el parsing de datos CSV).
* **Iconografía:** FontAwesome 6.
* **Tipografía:** Google Fonts (Playfair Display & Lato).
