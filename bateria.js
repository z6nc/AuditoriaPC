import { exec } from 'child_process';
import util from 'util'
const execAsync = util.promisify(exec)

export async function getInfoPorcentajeBateria() {
    const { stdout } = await execAsync('powershell (Get-WmiObject Win32_Battery).EstimatedChargeRemaining')
    const porcentajeBt = stdout.trim() + " %"
    return porcentajeBt
}

export async function getInfoStatusBateria() {
    const Dbateria = {
        1: "Descargando",
        2: "Conectado / cargando",
        3: "Carga completa",
        4: "Batería baja"

    }
    const { stdout } = await execAsync('powershell (Get-WmiObject Win32_Battery).BatteryStatus')
    return Dbateria[Number(stdout)]

}

export async function getPlanEnergetico() {
    const { stdout } = await execAsync('powercfg /list')
    return stdout.trim()
}

