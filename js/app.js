
'use strict';

// ==========================================
// VARIABLES GLOBALES
// ==========================================

const $ = id => document.getElementById(id);

let mode = 'qr';
let current = null;
let logo = '';
let history = [];

try {
    history = JSON.parse(
        localStorage.getItem('codestudio') || '[]'
    );

    if (!Array.isArray(history)) history = [];
} catch {}

// Tipos de códigos disponibles

const types = {
    qr: [
        'Texto o URL',
        'WhatsApp',
        'Wi-Fi',
        'Teléfono',
        'Correo electrónico'
    ],
    bar: [
        'CODE128',
        'CODE39',
        'EAN13',
        'EAN8',
        'UPC',
        'ITF14'
    ]
};

// ==========================================
// CAMPOS DINÁMICOS
// ==========================================

function field(id, label, value = '', type = 'text') {
    const l = document.createElement('label');
    l.textContent = label;

    const i = document.createElement('input');
    i.id = id;
    i.type = type;
    i.value = value;

    l.append(i);
    $('fields').append(l);
}

function fields() {
    $('fields').replaceChildren();

    const t = $('type').value;

    if (t === 'Wi-Fi') {
        field('data', 'Nombre de red');
        field('password', 'Contraseña', '', 'password');

        const l = document.createElement('label');
        l.textContent = 'Seguridad';

        const s = document.createElement('select');
        s.id = 'security';

        for (const v of ['WPA', 'WEP', 'nopass']) {
            s.add(new Option(v, v));
        }

        l.append(s);
        $('fields').append(l);

    } else {
        field(
            'data',
            t === 'WhatsApp'
                ? 'Número internacional (ej. 50212345678)'
                : t === 'Correo electrónico'
                ? 'Dirección de correo'
                : t === 'Teléfono'
                ? 'Número telefónico'
                : 'Contenido',
            t === 'Texto o URL'
                ? 'https://ejemplo.com'
                : ''
        );

        if (t === 'WhatsApp') {
            field('message', 'Mensaje opcional');
        }

        if (t === 'Correo electrónico') {
            field('message', 'Asunto opcional');
        }
    }
}

// ==========================================
// CAMBIAR TIPO DE GENERADOR
// ==========================================

function switchMode(m) {
    mode = m;

    $('expandBarcode').hidden = m !== 'bar';
    $('qrTab').classList.toggle('active', m === 'qr');
    $('barTab').classList.toggle('active', m === 'bar');

    $('logoLabel').hidden = m !== 'qr';

    $('type').replaceChildren(
        ...types[m].map(t => new Option(t, t))
    );

    fields();

    current = null;

    $('preview').textContent =
        'Genera un código para verlo aquí';

    $('status').textContent = '';
}

// ==========================================
// PROCESAR CONTENIDO
// ==========================================

const esc = s => s.replace(/[\\;,:\"]/g, '\\$&');

function payload(raw, t, extra = {}) {
    const v = String(raw).trim();

    if (!v) {
        throw Error('Ingresa contenido.');
    }

    if (t === 'WhatsApp') {
        const n = v.replace(/[+\s()-]/g, '');

        if (!/^\d{7,15}$/.test(n)) {
            throw Error('Número internacional inválido.');
        }

        return 'https://wa.me/' + n +
            '?text=' + encodeURIComponent(extra.message || '');
    }

    if (t === 'Teléfono') {
        return 'tel:' + v;
    }

    if (t === 'Correo electrónico') {
        return 'mailto:' + v +
            '?subject=' +
            encodeURIComponent(extra.message || '');
    }

    if (t === 'Wi-Fi') {
        return `WIFI:T:${extra.security || 'WPA'};S:${esc(v)};P:${esc(extra.password || '')};;`;
    }

    return v;
}

// ==========================================
// CONFIGURACIÓN DEL CÓDIGO
// ==========================================

function settings() {
    const size = Number($('size').value);

    if (!Number.isInteger(size) ||
        size < 128 ||
        size > 2048) {

        throw Error('Tamaño permitido: 128 a 2048 px.');
    }

    return {
        mode,
        type: $('type').value,
        size,
        fg: $('fg').value,
        bg: $('bg').value,
        logo: mode === 'qr' ? logo : ''
    };
}

// ==========================================
// GENERACIÓN DE QR Y CÓDIGOS DE BARRAS
// ==========================================

function make(data, s) {

    // Generar código QR

    if (s.mode === 'qr') {

        if (!window.QRCodeStyling) {
            throw Error(
                'No se cargó la librería QR. Revisa Internet.'
            );
        }

        return {
            qr: new QRCodeStyling({
                width: s.size,
                height: s.size,
                type: 'canvas',
                data: data,
                margin: Math.ceil(s.size * 0.13),

                image: s.logo || undefined,

                qrOptions: {
                    errorCorrectionLevel: 'H'
                },

                dotsOptions: {
                    color: s.fg,
                    type: 'square'
                },

                backgroundOptions: {
                    color: s.bg
                },

                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.22,
                    margin: 4
                }
            })
        };
    }

    // Generar código de barras

    if (!window.JsBarcode) {
        throw Error('No se cargó JsBarcode.');
    }

    const svg = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'svg'
    );

    JsBarcode(svg, data, {
        format: s.type,
        lineColor: s.fg,
        background: s.bg,
        width: 2,
        height: 100,
        margin: 16,
        displayValue: true
    });

    return { svg };
}

// ==========================================
// GUARDAR HISTORIAL
// ==========================================

function saveHistory(data, s) {

    history.unshift({
        data,
        s: {
            ...s,
            logo: ''
        },
        date: new Date().toLocaleString()
    });

    // Máximo 40 registros

    history = history.slice(0, 40);

    try {
        localStorage.setItem(
            'codestudio',
            JSON.stringify(history)
        );
    } catch {}

    renderHistory();
}

// ==========================================
// MOSTRAR VISTA PREVIA
// ==========================================

function show(data, s, save = true) {

    const result = make(data, s);

    $('preview').replaceChildren();

    if (result.qr) {
        result.qr.append($('preview'));
    } else {
        $('preview').append(result.svg);
    }

    current = {
        ...result,
        s
    };

    // No guardar contraseñas Wi-Fi

    if (save && s.type !== 'Wi-Fi') {
        saveHistory(data, s);
    }
}

function generate() {

    try {
        const s = settings();

        const data = payload(
            $('data').value,
            s.type,
            {
                message: $('message')?.value,
                password: $('password')?.value,
                security: $('security')?.value
            }
        );

        show(data, s);

        $('status').textContent = 'Código generado.';

    } catch (e) {

        $('status').textContent =
            'Error: ' + (e.message || e);
    }
}

// ==========================================
// CONVERTIR CÓDIGO A PNG O SVG
// ==========================================

async function blobFor(c, format) {

    if (c.qr) {
        return await c.qr.getRawData(format);
    }

    const xml = new XMLSerializer()
        .serializeToString(c.svg);

    const b = new Blob(
        [xml],
        { type: 'image/svg+xml' }
    );

    if (format === 'svg') {
        return b;
    }

    const url = URL.createObjectURL(b);

    try {

        const im = new Image();
        im.src = url;

        await im.decode();

        const cv = document.createElement('canvas');

        cv.width = Math.max(
            c.s.size,
            im.naturalWidth
        );

        cv.height = Math.round(
            cv.width *
            im.naturalHeight /
            im.naturalWidth
        );

        cv.getContext('2d').drawImage(
            im,
            0,
            0,
            cv.width,
            cv.height
        );

        return await new Promise((res, rej) => {

            cv.toBlob(
                b => b
                    ? res(b)
                    : rej(Error('No se pudo crear PNG')),
                'image/png'
            );

        });

    } finally {
        URL.revokeObjectURL(url);
    }
}

// ==========================================
// DESCARGAR ARCHIVOS
// ==========================================

function download(blob, name) {

    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = u;
    a.download = name;
    a.click();

    setTimeout(
        () => URL.revokeObjectURL(u),
        3000
    );
}

async function exportCode(f) {

    try {

        if (!current) {
            throw Error('Genera un código primero.');
        }

        download(
            await blobFor(current, f),
            'codigo.' + f
        );

    } catch (e) {
        $('status').textContent = e.message;
    }
}

// ==========================================
// MOSTRAR HISTORIAL
// ==========================================

function renderHistory() {

    $('history').replaceChildren();

    if (!history.length) {

        $('history').textContent =
            'Todavía no hay códigos guardados.';

        return;
    }

    history.forEach(h => {

        const row = document.createElement('div');
        row.className = 'entry';

        const span = document.createElement('span');

        span.textContent =
            h.s.type + ' · ' +
            h.data + ' · ' +
            h.date;

        const b = document.createElement('button');

        b.textContent = 'Abrir';

        b.onclick = () => {

            try {

                switchMode(h.s.mode);

                $('type').value = h.s.type;

                fields();

                $('fg').value = h.s.fg;
                $('bg').value = h.s.bg;
                $('size').value = h.s.size;
                $('data').value = h.data;

                show(h.data, h.s, false);

                $('status').textContent =
                    'Código recuperado. Para editar contenido estructurado, vuelve a ingresar sus campos.';

            } catch (e) {
                $('status').textContent = e.message;
            }
        };

        row.append(span, b);

        $('history').append(row);
    });
}

// ==========================================
// EVENTOS DE LOS BOTONES
// ==========================================

$('qrTab').onclick = () => switchMode('qr');

$('barTab').onclick = () => switchMode('bar');

$('type').onchange = fields;

$('generate').onclick = generate;

$('png').onclick = () => exportCode('png');

$('svg').onclick = () => exportCode('svg');

// ==========================================
// CARGAR LOGOTIPO
// ==========================================

$('logo').onchange = async () => {

    const f = $('logo').files[0];

    logo = '';

    if (!f) return;

    if (f.size > 2e6) {

        $('status').textContent =
            'Logotipo máximo 2 MB.';

        $('logo').value = '';

        return;
    }

    const r = new FileReader();

    r.onload = () => logo = r.result;

    r.readAsDataURL(f);
};

// ==========================================
// ELIMINAR HISTORIAL
// ==========================================

$('clear').onclick = () => {

    history = [];

    try {
        localStorage.removeItem('codestudio');
    } catch {}

    renderHistory();
};

// ==========================================
// IMPRIMIR CÓDIGO
// ==========================================

$('print').onclick = async () => {

    if (!current) {

        $('status').textContent =
            'Genera un código primero.';

        return;
    }

    const w = window.open('', '_blank');

    if (!w) {

        $('status').textContent =
            'Permite ventanas emergentes.';

        return;
    }

    try {

        const u = URL.createObjectURL(
            await blobFor(current, 'png')
        );

        const im = w.document.createElement('img');

        im.src = u;
        im.style.maxWidth = '100%';

        w.document.body.append(im);

        await im.decode();

        w.print();

        URL.revokeObjectURL(u);

    } catch (e) {

        w.close();

        $('status').textContent = e.message;
    }
};

// ==========================================
// GENERACIÓN MASIVA DESDE EXCEL O CSV
// ==========================================

$('batchGo').onclick = async () => {

    const b = $('batchGo');

    b.disabled = true;

    try {

        const f = $('batch').files[0];

        if (!f) {
            throw Error('Selecciona un archivo.');
        }

        if (!window.XLSX || !window.JSZip) {
            throw Error(
                'No se cargaron las librerías de importación.'
            );
        }

        const s = settings();

        if (s.type === 'Wi-Fi') {
            throw Error(
                'La generación masiva no admite Wi-Fi.'
            );
        }

        const wb = XLSX.read(
            await f.arrayBuffer(),
            {
                type: 'array',
                raw: true
            }
        );

        const rows = XLSX.utils.sheet_to_json(
            wb.Sheets[wb.SheetNames[0]],
            {
                raw: false,
                defval: ''
            }
        );

        if (!rows.length ||
            !('contenido' in rows[0])) {

            throw Error(
                'Se requiere una columna llamada contenido.'
            );
        }

        if (rows.length > 200) {
            throw Error('Máximo 200 filas por lote.');
        }

        const zip = new JSZip();
        const errors = [];

        let ok = 0;

        for (let i = 0; i < rows.length; i++) {

            try {

                const data = payload(
                    rows[i].contenido,
                    s.type,
                    {
                        message: rows[i].mensaje || ''
                    }
                );

                const c = {
                    ...make(data, s),
                    s
                };

                zip.file(
                    `codigo-${i + 1}.png`,
                    await blobFor(c, 'png')
                );

                ok++;

            } catch (e) {

                errors.push(
                    `Fila ${i + 2}: ${e.message || e}`
                );
            }

            $('batchStatus').textContent =
                `Procesando ${i + 1}/${rows.length}`;
        }

        if (errors.length) {
            zip.file(
                'errores.txt',
                errors.join('\n')
            );
        }

        download(
            await zip.generateAsync({
                type: 'blob'
            }),
            'codigos.zip'
        );

        $('batchStatus').textContent =
            `${ok} códigos generados; ${errors.length} errores.`;

    } catch (e) {

        $('batchStatus').textContent = e.message;

    } finally {

        b.disabled = false;
    }
};

// ==========================================
// INICIALIZAR GENERADOR
// ==========================================

switchMode('qr');
renderHistory();

// ==========================================
// MODO OSCURO Y MODO CLARO
// ==========================================

function applyTheme(theme) {

    const dark = theme === 'dark';

    document.documentElement.dataset.theme =
        dark ? 'dark' : 'light';

    $('themeToggle').setAttribute(
        'aria-pressed',
        String(dark)
    );

    $('themeToggle').setAttribute(
        'aria-label',
        dark
            ? 'Activar modo claro'
            : 'Activar modo oscuro'
    );

    $('themeIcon').textContent =
        dark ? '☀' : '☾';

    $('themeText').textContent =
        dark ? 'Modo claro' : 'Modo oscuro';
}

// Aplicar tema inicial

applyTheme(
    document.documentElement.dataset.theme
);

// Evento para cambiar de tema

$('themeToggle').addEventListener('click', () => {

    const theme =
        document.documentElement.dataset.theme === 'dark'
            ? 'light'
            : 'dark';

    applyTheme(theme);

    // Guardar preferencia del usuario

    try {
        localStorage.setItem(
            'codestudio-theme',
            theme
        );
    } catch {}
});


// ==========================================
// AMPLIAR CÓDIGO DE BARRAS
// ==========================================

let previousOverflow = '';

function openBarcodeModal() {

    if (!current || !current.svg || mode !== 'bar') {

        $('status').textContent =
            'Genera un código de barras primero.';

        return;
    }

    const modal = $('barcodeModal');
    const preview = $('expandedPreview');

    // Limpiar vista anterior

    preview.replaceChildren();

    // Crear una copia del código generado

    const expanded = current.svg.cloneNode(true);

    // Obtener dimensiones originales

    const width = parseFloat(
        expanded.getAttribute('width')
    );

    const height = parseFloat(
        expanded.getAttribute('height')
    );

    // Mantener las proporciones del código

    if (width > 0 && height > 0) {

        expanded.setAttribute(
            'viewBox',
            `0 0 ${width} ${height}`
        );

    }

    expanded.removeAttribute('width');
    expanded.removeAttribute('height');

    expanded.setAttribute(
        'preserveAspectRatio',
        'xMidYMid meet'
    );

    // Mostrar código ampliado

    preview.appendChild(expanded);

    modal.hidden = false;

    // Bloquear desplazamiento de la página

    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    $('closeBarcode').focus();
}

// ==========================================
// CERRAR VENTANA AMPLIADA
// ==========================================

function closeBarcodeModal() {

    $('barcodeModal').hidden = true;

    document.body.style.overflow = previousOverflow;

    $('expandedPreview').replaceChildren();

    $('expandBarcode').focus();
}

// ==========================================
// EVENTOS
// ==========================================

// Abrir ventana

$('expandBarcode').addEventListener(
    'click',
    openBarcodeModal
);

// Cerrar mediante botón

$('closeBarcode').addEventListener(
    'click',
    closeBarcodeModal
);

// Cerrar al presionar fuera de la ventana

$('barcodeModal').addEventListener('click', e => {

    if (e.target === $('barcodeModal')) {

        closeBarcodeModal();

    }

});

// Cerrar con la tecla Escape

document.addEventListener('keydown', e => {

    if (
        e.key === 'Escape' &&
        !$('barcodeModal').hidden
    ) {

        closeBarcodeModal();

    }

});
