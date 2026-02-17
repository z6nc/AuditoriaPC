import { exec } from 'child_process';
import util from 'util'
import { convertidorGB } from './helper/helpers.js';

const execAsync = util.promisify(exec)

async function nombreAlmacenamiento() {
    const { stdout } = await execAsync('wmic diskdrive get Model')
    const arrAlmacenamiento = stdout.trim().split('\n').slice(1)
    return arrAlmacenamiento
}

export async function obtenerAlmacenamiento() {
    try {
        const NombresAlmacenamiento = await nombreAlmacenamiento()
        let resultadosAlmacenamiento = []
        const { stdout } = await execAsync('wmic logicaldisk get caption,freespace,size')
        const destructurado = stdout.trim().split('\n')
        for (let i = 1; i <= destructurado.length - 1; i++) {
            const unidadAlmacen = destructurado[parseInt(i)].trim().split(' ')
            const usado = parseFloat(unidadAlmacen[9]) - parseFloat(unidadAlmacen[7])
            resultadosAlmacenamiento.push({
                NombreUnidad: NombresAlmacenamiento[i - 1].trim(),
                Unidad: unidadAlmacen[0],
                LibreAlmacenamiento: `${convertidorGB(parseFloat(unidadAlmacen[7]))} GB`,
                TotalAlmacenamiento: `${convertidorGB(parseFloat(unidadAlmacen[9]))} GB`,
                UsadoAlmacenamiento: `${convertidorGB(usado)} GB`
            })
        }
        return resultadosAlmacenamiento
    } catch {
        return ["Info de disco no disponible (Error de permisos o no es Windows)"];
    }
}


