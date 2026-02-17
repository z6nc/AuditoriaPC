import { exec } from 'child_process';
import os from 'os';
import util from 'util'

const execAsync = util.promisify(exec)
let InformacionPC = []

async function PerfilesWifi() {
    // Logica Historial Wifi 
    let listaHistorialWifi = []
    try {
        const { stdout } = await execAsync('netsh wlan show profiles')

        const perfiles = [
            ...new Set(
                stdout
                    .split('\n')
                    .map(l => l.replace('\r', '').trim())
                    .filter(l => l.includes('Perfil de todos los usuarios'))
                    .map(l => l.split(':')[1].trim())
            )
        ]
        await Promise.all(
            perfiles.map((async (NombreWifi) => {
                const { stdout } = await execAsync(`netsh wlan show profile name="${NombreWifi}" key=clear | findstr /C:"Contenido de la clave`)
                const contraseña = stdout.trim().split(':')
                listaHistorialWifi.push({
                    Nombre: NombreWifi,
                    Password: contraseña[1].trim()
                })

            })
            )
        )
        return listaHistorialWifi
    } catch {
        console.error("Error No se pudo")
    }

}

export async function obtenerInformacionRedes() {
    try {
        // let InformacionPC = []
        const redesAll = os.networkInterfaces()
        for (const indice in redesAll) {
            const infoRedes = redesAll[indice]
            for (const red of infoRedes)
                if (red.family === "IPv4" && red.internal === false) {
                    InformacionPC.push(
                        {
                            RedIPV4: red.address,
                            Address: red.netmask,
                            Mac: red.mac,
                            Wifi: await PerfilesWifi()

                        }
                    )
                }
        }
        // console.dir(InformacionPC, { depth: null, colors: true });
        return InformacionPC
    } catch (err) {
        console.error(err)
    }
}
// --- ESTA ES LA CORRECCIÓN DE LA EJECUCIÓN ---
// (async () => {
//     await obtenerInformacionRedes();
// })();