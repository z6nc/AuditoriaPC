import { exec } from 'child_process';
import util from 'util'
import os from 'os';
import { convertidorGB } from './helper/helpers.js';


const execAsync = util.promisify(exec)

export async function ListadoUserPC() {
    try {
        const { stdout } = await execAsync(
            'wmic useraccount get Name,Disabled,PasswordRequired'
        )

        const lineas = stdout.trim().split('\n').slice(1)
        const users = []

        for (const linea of lineas) {
            const [Activo, Usuario, PasswordRequiere] = linea.trim().split(/\s+/)

            users.push({
                Usuario,
                Activos: Activo,
                PasswordRequiere
            })
        }

        return users
    } catch (error) {
        console.error(error)
    }
}



export function obtenerDatosBasicos() {
    const uptimeSec = os.uptime();
    const dias = Math.floor(uptimeSec / 86400);
    const horas = Math.floor((uptimeSec % 86400) / 3600);
    const tiempo = `${dias}d ${horas}h ${(Math.floor(uptimeSec % 3600) / 60).toFixed(0)}m`;

    return {
        hostname: os.hostname(),
        usuario: os.userInfo().username,
        sistema: `${os.type()} ${os.release()} (${os.arch()})`,
        uptime: tiempo
    };
}

export async function obtenerGrafica() {
    try {
        const { stdout } = await execAsync(`wmic path win32_VideoController get name`)
        const tarjetaGrafica = stdout.trim().split('\n')
        return tarjetaGrafica.length > 1 ? tarjetaGrafica[1].trim() : "No detectado"
    } catch {
        return "No disponible (Requiere Windows)";
    }
}

export async function getInfoRamDetallada() {
    //Diccionario DRR
    const listaDRR = {
        24: "DDR3",
        26: "DDR4",
        30: "DDR5",
        34: "DDR5 Nueva Generacion",
        0: "NS"
    }

    try {
        const { stdout } = await execAsync('wmic memorychip get Capacity,Speed,Manufacturer,PartNumber,SMBIOSMemoryType')
        const lineaRam = stdout.trim().split('\n').slice(1)
        const listaRam = []

        for (const ram of lineaRam) {
            const [Capacidad, Fabricante, NumDeParte, DDR, Velocidad] = ram.trim().split(/\s{2,}/)
            listaRam.push({
                Fabricante,
                NumeroDePartes: NumDeParte,
                CapacidadRam: convertidorGB(Capacidad) + " RAM",
                VersiondeDRR: listaDRR[DDR],
                Velocidades: Velocidad + " MHz",
            })
        }
        return listaRam
    } catch (err) {
        return `Error al obtener informacion de la RAM ${err}`
    }
}

export async function getAntivirus() {
    try {
        const listAntivirus = []
        const { stdout } = await execAsync('powershell "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct | Select displayName"')
        const antiVirus = stdout.trim().split('\n')
        antiVirus.slice(2).map(v => {
            listAntivirus.push(v)
        })
        return listAntivirus
    } catch (e) {
        console.error(`no se pudo ejecutra el comando ${e}`)
        return "No tienes Nada"
    }

}

export async function getHardwarePC() {
    try {
        const { stdout } = await execAsync('wmic csproduct get Version')
        const VersionPc = stdout.trim().split('\n')
        return {
            versionPc: VersionPc[1].trim(),
            cpu: os.cpus()[0].model,
            nucleos: os.cpus().length,
            ramTotal: convertidorGB(os.totalmem()) + " GB",
            ramLibre: convertidorGB(os.freemem()) + " GB",
        }
    } catch (error) {
        console.error("Error obteniendo Hardware:", error)
        return null
    }

}

export async function getInfoMotherBoard() {
    try {

        const { stdout } = await execAsync(
            'powershell "Get-WmiObject Win32_BaseBoard | Format-List Product,Manufacturer,SerialNumber"'
        )

        const data = {}
        const lines = stdout.trim().split('\n')

        for (const line of lines) {
            const [key, value] = line.split(':').map(s => s.trim())

            if (key && value) {
                data[key] = value
            }
        }
        return {
            NombreProducto: data.Product || null,
            Fabricante: data.Manufacturer || null,
            NumeroSerie: data.SerialNumber || null
        }

    } catch (error) {
        console.error("Error obteniendo motherboard:", error)
        return null
    }
}

export async function getInfoMonitor() {
    try {
        const { stdout } = await execAsync('powershell "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentRefreshRate, CurrentHorizontalResolution, CurrentVerticalResolution"')
        const array = stdout.trim().split('\n')
        const infoMonitor = array[2].trim().split(/\s{2,}/);
        return ({
            hz: infoMonitor[1],
            horizontal: infoMonitor[2],
            vertical: infoMonitor[3]
        }
        )
    } catch (error) {
        console.log(error)
        return null
    }

}

