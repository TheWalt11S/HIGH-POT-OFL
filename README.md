
# HIGH POT OFL

![Version](https://img.shields.io/badge/Versión-1.2-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Status](https://img.shields.io/badge/Estado-En_desarrollo-green)

## Web site
https://thewalt11s.github.io/HIGH-POT-OFL/

## Descripción

**HIGH POT OFL** es una aplicación web diseñada para generar,
personalizar y descargar códigos QR y códigos de barras de
manera rápida, sencilla y eficiente.

La plataforma cuenta con una interfaz moderna, intuitiva y
adaptable a diferentes dispositivos, permitiendo crear códigos
sin necesidad de instalar programas adicionales.

Todo el procesamiento se realiza directamente desde el navegador,
sin necesidad de utilizar un servidor o una base de datos.

## Características principales

### Generador de códigos QR

- Texto personalizado.
- Enlaces URL.
- WhatsApp.
- Redes Wi-Fi.
- Números telefónicos.
- Correo electrónico.
- Inserción de logotipos personalizados.
- Personalización de colores.
- Configuración de dimensiones.

### Generador de códigos de barras

Formatos compatibles:

- CODE 128.
- CODE 39.
- EAN-13.
- EAN-8.
- UPC.
- ITF-14.

También permite visualizar los códigos de barras en una ventana
ampliada, facilitando su lectura directamente desde la pantalla.

### Funcionalidades adicionales

- Descarga de códigos en formato PNG y SVG.
- Generación masiva mediante archivos Excel y CSV.
- Descarga de múltiples códigos en archivos ZIP.
- Impresión directa de códigos.
- Historial local de códigos generados.
- Modo claro y modo oscuro.
- Guardado automático de preferencias.
- Diseño responsive.
- Procesamiento local desde el navegador.
- Sin necesidad de crear una cuenta.

## Tecnologías utilizadas

| Tecnología | Descripción |
|------------|-------------|
| HTML5 | Estructura de la aplicación. |
| CSS3 | Diseño y personalización visual. |
| JavaScript | Lógica y funcionamiento. |
| QR Code Styling | Generación de códigos QR. |
| JsBarcode | Generación de códigos de barras. |
| SheetJS | Lectura de archivos Excel y CSV. |
| JSZip | Generación de archivos comprimidos. |
| LocalStorage | Almacenamiento local de preferencias e historial. |

## Estructura del proyecto

```text
HIGH-POT-OFL/
│
├── index.html
│
├── css/
│   └── styles.css
│
├── js/
│   └── app.js
│
└── README.md
```

## Instalación y ejecución

### Requisitos

- Navegador web actualizado.
- Conexión a Internet para cargar las librerías externas.
- Visual Studio Code (opcional).
- Extensión Live Server (opcional).

### Instalación

1. Clona o descarga el repositorio desde GitHub.
2. Abre la carpeta del proyecto.
3. Ejecuta el archivo `index.html` desde tu navegador.

También puedes utilizar Visual Studio Code:

1. Abre la carpeta del proyecto.
2. Instala la extensión Live Server.
3. Haz clic derecho sobre `index.html`.
4. Selecciona `Open with Live Server`.

## Cómo utilizar HIGH POT OFL

1. Selecciona el generador de códigos QR o códigos de barras.
2. Selecciona el tipo de código que deseas generar.
3. Ingresa la información correspondiente.
4. Personaliza los colores y las dimensiones.
5. Presiona el botón **Generar código**.
6. Descarga, imprime o visualiza el código generado.

## Generación masiva

HIGH POT OFL permite generar múltiples códigos utilizando
archivos Excel o CSV.

El archivo debe contener una columna llamada `contenido`.

Ejemplo:

| contenido |
|-----------|
| PRODUCTO-001 |
| PRODUCTO-002 |
| PRODUCTO-003 |
| PRODUCTO-004 |

Después de importar el archivo, selecciona el formato deseado
y presiona el botón **Generar ZIP**.

## Apariencia

La aplicación cuenta con dos temas visuales:

- **Modo claro:** interfaz limpia, moderna y minimalista.
- **Modo oscuro:** interfaz diseñada para reducir el brillo
  de la pantalla en ambientes con poca iluminación.

La preferencia seleccionada se almacena automáticamente
en el navegador.

## Privacidad

HIGH POT OFL procesa la información directamente desde
el navegador del usuario.

- No requiere registro de usuarios.
- No utiliza una base de datos externa.
- No envía el contenido de los códigos a un servidor propio.
- El historial se almacena localmente.
- Las contraseñas Wi-Fi no se guardan en el historial.

## Próximas actualizaciones

- [ ] Escáner de códigos QR mediante cámara.
- [ ] Escáner de códigos de barras.
- [ ] Exportación en formato PDF.
- [ ] Diseñador de etiquetas personalizadas.
- [ ] Impresión de múltiples etiquetas.
- [ ] Funcionamiento sin conexión a Internet.
- [ ] Aplicación web progresiva (PWA).
- [ ] Nuevos estilos de códigos QR.
- [ ] Soporte para múltiples idiomas.

## Contribuciones

Las sugerencias, reportes de errores y propuestas de mejora
son bienvenidas mediante la sección Issues de GitHub.

## Autor

Desarrollado por **Walter Daniel Aguilar**.

Proyecto enfocado en ofrecer herramientas digitales accesibles,
prácticas y eficientes para usuarios y empresas.

## Licencia

Pendiente de definir.

---

**HIGH POT OFL**

*Crea. Personaliza. Escanea.*

© 2026 HIGH POT OFL.
