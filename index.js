import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { obtenerInformacionRedes } from './redes.js';
import { obtenerDatosBasicos, ListadoUserPC, obtenerGrafica, getHardwarePC, getInfoRamDetallada, getAntivirus, getInfoMotherBoard, getInfoMonitor } from './datosPC.js';
import { obtenerAlmacenamiento } from './Almacenamiento.js';
import { getInfoDriver } from './drivers.js';
import { getInfoPorcentajeBateria, getInfoStatusBateria, getPlanEnergetico } from './bateria.js';


const esVerdadero = v =>
    (typeof v === "string") ? v.toLowerCase() === "true" : Boolean(v);
const formatearBytes = b => b ?? "N/D";

async function generarReporte() {
    console.log("⏳ Generando reporte, por favor espere...");

    // 1. Ejecución de tus funciones (SIN CAMBIOS)
    const datosOS = obtenerDatosBasicos();
    const [Almacenamiento, NombreTarjetaGrafica, Redes, listadoUsers, HardwarePC,
        infoRam, antiVirus, infoMotherBoard, infoMonitor, infoDriver,
        porcentajeBateria, statusBateria, planEnergetico] = await Promise.all([
            obtenerAlmacenamiento(),
            obtenerGrafica(),
            obtenerInformacionRedes(),
            ListadoUserPC(),
            getHardwarePC(),
            getInfoRamDetallada(),
            getAntivirus(),
            getInfoMotherBoard(),
            getInfoMonitor(),
            getInfoDriver(),
            getInfoPorcentajeBateria(),
            getInfoStatusBateria(),
            getPlanEnergetico()
        ]);

    // 2. Construcción del Texto del Reporte
    let contenido = `
🛡️  REPORTE DE SISTEMA AUTOMATIZADO
═══════════════════════════════════════════════
📅 FECHA : ${new Date().toLocaleString("es-PE")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣  INFORMACIÓN BÁSICA DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Hostname        : ${datosOS.hostname ?? "N/D"}
• Usuario actual  : ${datosOS.usuario ?? "N/D"}
• Sistema         : ${datosOS.sistema ?? "N/D"}
• Tiempo activo   : ${datosOS.uptime ?? "N/D"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2️⃣  HARDWARE PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Modelo PC       : ${HardwarePC.versionPc ?? "N/D"}

🖥️  MONITOR
   ↳ Frecuencia   : ${infoMonitor?.hz ?? "NS"} Hz
   ↳ Resolución   : ${infoMonitor?.horizontal ?? "NS"} x ${infoMonitor?.vertical ?? "NS"}

🧩  PLACA MADRE
   ↳ Nombre       : ${infoMotherBoard.NombreProducto ?? "N/D"}
   ↳ Fabricante   : ${infoMotherBoard.Fabricante ?? "N/D"}
   ↳ Serie        : ${infoMotherBoard.NumeroSerie ?? "N/D"}

⚙️  PROCESADOR
   ↳ Modelo       : ${HardwarePC.cpu ?? "N/D"}
   ↳ Núcleos      : ${HardwarePC.nucleos ?? "N/D"}

🎮  TARJETA GRÁFICA
   ↳ ${NombreTarjetaGrafica ?? "No detectada"}

🧠  MEMORIA RAM
   ↳ Total        : ${formatearBytes(HardwarePC.ramTotal)}
   ↳ Disponible   : ${formatearBytes(HardwarePC.ramLibre)}

📚 LISTA DE MÓDULOS RAM
------------------------------------------------
`;

    if (Array.isArray(infoRam) && infoRam.length > 0) {
        infoRam.forEach((ram, idx) => {
            contenido += `
   🔹 Módulo ${idx + 1}
      • Fabricante   : ${ram.Fabricante ?? "Desconocido"}
      • Capacidad    : ${ram.CapacidadRam ?? "N/D"}
      • Part Number  : ${ram.NumeroDePartes ?? "N/D"}
      • Tipo DDR     : ${ram.VersiondeDRR ?? "N/D"}
      • Velocidad    : ${ram.Velocidades ?? "N/D"}
`;
        });
    } else {
        contenido += `   (No se detectaron módulos RAM)\n`;
    }

    contenido += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3️⃣  BATERÍA Y ENERGÍA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Porcentaje batería : ${porcentajeBateria}
• Estado batería     : ${statusBateria}

🔋 Plan energético:
${planEnergetico}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4️⃣  ALMACENAMIENTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (Array.isArray(Almacenamiento) && Almacenamiento.length > 0 && typeof Almacenamiento[0] !== "string") {
        Almacenamiento.forEach((disco, i) => {
            contenido += `
   💽 Unidad ${i + 1}
      • Letra        : ${disco.Unidad ?? "N/D"}
      • Nombre       : ${disco.NombreUnidad ?? "Desconocido"}
      • Total        : ${disco.TotalAlmacenamiento ?? "N/D"}
      • Usado        : ${disco.UsadoAlmacenamiento ?? "N/D"}
      • Libre        : ${disco.LibreAlmacenamiento ?? "N/D"}
`;
        });
    } else {
        contenido += `   ⚠️ ${Almacenamiento ?? "No hay información"}\n`;
    }

    contenido += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5️⃣  ANTIVIRUS INSTALADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (Array.isArray(antiVirus) && antiVirus.length > 0) {
        antiVirus.forEach((v, idx) => {
            contenido += `   ${idx + 1}. ${v ?? "No detectado"}\n`;
        });
    } else {
        contenido += `   (No se detectaron antivirus)\n`;
    }

    contenido += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6️⃣  ESTADO DE DRIVERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Estado general : ${infoDriver?.hz ?? "NS"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7️⃣  USUARIOS DEL SISTEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (Array.isArray(listadoUsers) && listadoUsers.length > 0) {
        listadoUsers.forEach((u, idx) => {
            contenido += `
   👤 Usuario ${idx + 1}
      • Nombre        : ${u.Usuario ?? "N/D"}
      • Requiere pass : ${esVerdadero(u.PasswordRequiere) ? "Sí" : "No"}
      • Activo        : ${esVerdadero(u.Activos) ? "Sí" : "No"}
`;
        });
    } else {
        contenido += `   (No se detectaron usuarios)\n`;
    }

    contenido += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8️⃣  REDES Y CONECTIVIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    if (Array.isArray(Redes) && Redes.length > 0) {
        Redes.forEach((red, idx) => {
            contenido += `
   🌐 Adaptador ${idx + 1}
      • Nombre        : ${red.NombreAdaptador ?? "Desconocido"}
      • IPv4          : ${red.RedIPV4 ?? "N/D"}
      • Máscara       : ${red.Address ?? "N/D"}
      • MAC           : ${red.Mac ?? "N/D"}
`;

            if (Array.isArray(red.Wifi) && red.Wifi.length > 0) {
                contenido += `      📶 Redes WiFi guardadas:\n`;
                red.Wifi.forEach(wifi => {
                    contenido += `         • ${wifi.Nombre ?? "N/D"}  →  ${wifi.Password ?? "(Oculta)"}\n`;
                });
            } else {
                contenido += `      📶 WiFi guardadas: Ninguna\n`;
            }
        });
    }

    contenido += `
═══════════════════════════════════════════════
✅ FIN DEL REPORTE
═══════════════════════════════════════════════
`;


    // 3. Guardado del Archivo
    const nombreArchivo = `Reporte_${datosOS.hostname}.txt`;
    const documentos = path.join(os.homedir(), "Documents");

    // Ruta final del archivo
    const rutaFinal = path.join(documentos, nombreArchivo);

    try {
        await fs.writeFile(rutaFinal, contenido);

        console.log(`\n✅ ¡Reporte Creado! Revisar archivo: ${rutaFinal}`);
    } catch (error) {
        console.error("❌ Error al guardar el archivo:", error);
    }
}

generarReporte().then(() => {
    console.log("\nPresiona ENTER para salir...");
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
});
