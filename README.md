# Comandos CMD y PowerShell usados en este Proyecto 

## Inventariar modelos de discos fisicos
**Comando**
```cmd
wmic diskdrive get Model
```
**Descripcion**: lista cada disco fisico detectado por Windows para asociarlo con su modelo comercial.

## Medir capacidad y espacio en unidades logicas
**Comando**
```cmd
wmic logicaldisk get caption,freespace,size
```
**Descripcion**: obtiene para cada letra de unidad su tamanio total y espacio libre para calcular porcentajes de uso.

## Consultar porcentaje estimado de bateria
**Comando**
```powershell
powershell (Get-WmiObject Win32_Battery).EstimatedChargeRemaining
```
**Descripcion**: devuelve el porcentaje aproximado de carga disponible en la bateria del equipo.

## Determinar el estado actual de la bateria
**Comando**
```powershell
powershell (Get-WmiObject Win32_Battery).BatteryStatus
```
**Descripcion**: lee el codigo de estado expuesto por WMI para saber si la bateria descarga, carga o esta llena.

## Listar planes de energia configurados
**Comando**
```cmd
powercfg /list
```
**Descripcion**: muestra todos los planes de energia instalados e identifica cual se encuentra activo.

## Enumerar cuentas de usuario locales
**Comando**
```cmd
wmic useraccount get Name,Disabled,PasswordRequired
```
**Descripcion**: presenta el listado de usuarios junto a su estado y si requieren contrasena para iniciar sesion.

## Identificar la tarjeta de video instalada
**Comando**
```cmd
wmic path win32_VideoController get name
```
**Descripcion**: consulta por WMI el nombre comercial del adaptador de video principal configurado en Windows.

## Detallar modulos de memoria RAM
**Comando**
```cmd
wmic memorychip get Capacity,Speed,Manufacturer,PartNumber,SMBIOSMemoryType
```
**Descripcion**: devuelve la capacidad, velocidad, fabricante y tipo de cada modulo RAM detectado.

## Listar antivirus registrados en Windows Security Center
**Comando**
```powershell
powershell "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct | Select displayName"
```
**Descripcion**: interroga el repositorio SecurityCenter2 para saber que productos antivirus estan instalados.

## Obtener el modelo comercial del equipo
**Comando**
```cmd
wmic csproduct get Version
```
**Descripcion**: expone el identificador y modelo reportado por el fabricante del hardware.

## Leer datos de la tarjeta madre
**Comando**
```powershell
powershell "Get-WmiObject Win32_BaseBoard | Format-List Product,Manufacturer,SerialNumber"
```
**Descripcion**: muestra producto, fabricante y numero de serie de la placa base mediante WMI.

## Recuperar frecuencia y resolucion de la pantalla
**Comando**
```powershell
powershell "Get-CimInstance Win32_VideoController | Select-Object Name, CurrentRefreshRate, CurrentHorizontalResolution, CurrentVerticalResolution"
```
**Descripcion**: expone la configuracion activa de refresco y resolucion del adaptador de video.

## Detectar dispositivos con errores de driver
**Comando**
```cmd
wmic path Win32_PnPEntity where "ConfigManagerErrorCode <> 0" get Name,DeviceID,ConfigManagerErrorCode
```
**Descripcion**: lista hardware Plug and Play cuyo administrador de dispositivos reporta errores o drivers faltantes.

## Enumerar perfiles Wi-Fi guardados
**Comando**
```cmd
netsh wlan show profiles
```
**Descripcion**: genera el inventario de redes inalambricas almacenadas en la maquina.

## Recuperar la contrasena de un perfil Wi-Fi especifico
**Comando**
```cmd
netsh wlan show profile name="<NombreWifi>" key=clear | findstr /C:"Contenido de la clave"
```
**Descripcion**: imprime la clave de seguridad del perfil indicado cuando se ejecuta con privilegios administrativos.
