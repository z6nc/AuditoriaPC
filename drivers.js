import { exec } from 'child_process';
import util from 'util'

const execAsync = util.promisify(exec)

export async function getInfoDriver(){
    const { stdout } = await execAsync(`wmic path Win32_PnPEntity where "ConfigManagerErrorCode <> 0" get Name,DeviceID,ConfigManagerErrorCode`)
    const nombre =  stdout.trim()
}

