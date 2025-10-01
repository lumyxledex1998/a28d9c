# Baileys Super Bot

Estructura lista para 1000+ plugins con Baileys.

- index.js: arranque y conexión
- handler.js: router de mensajes y permisos
- lib/simple.js: helpers (reply, sendFile, buttons, normalizeJid, parseMention)
- lib/db.js: base JSON con lowdb
- plugins/: tus comandos aqui (carga dinámica)
- config.js: dueños, keys y ajustes

## Ejecutar

1) Instala dependencias

```
npm install
```

2) Inicia el bot y escanea el QR

```
npm start
```

Los datos de sesión quedan en `sessions/`.

## Plugins

Crea un archivo `.js` en `plugins/` exportando por defecto una función:

```js
export default async function (m, extra) {
  if (extra.command === 'hola') {
    return m.reply('Hola!')
  }
}

export const command = ['hola']
export const tags = ['main']
```

El handler detecta prefijos a partir de `global.prefix` (define si gustas) y `plugin.command`.
