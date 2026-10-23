// param(
//     [Parameter(Mandatory=$false)]
//     [string]$UserEmail = "inconnu@karlit.mg"
// )

// # ... (vos étapes 1 à 3 inchangées) ...

// $OS_Nom = (Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion").ProductName
// $RAM_Octets = (Get-CimInstance CIM_OperatingSystem).TotalVisibleMemorySize
// $RAM_GB = [math]::Round($RAM_Octets / 1024 / 1024, 0)
// $Hostname = $env:COMPUTERNAME
// $Manufacturer = (Get-CimInstance Win32_ComputerSystem).Manufacturer
// $Model = (Get-CimInstance Win32_ComputerSystem).Model

// # 4. Construction de l'objet de données aligné avec votre DTO NestJS
// $Config = [PSCustomObject]@{
//     label           = $Hostname
//     brand           = $Manufacturer
//     model           = $Model
//     processor       = (Get-ItemProperty "HKLM:\HARDWARE\DESCRIPTION\System\CentralProcessor\0").ProcessorNameString
//     ram             = "$RAM_GB Go"
//     storageCapacity = "$([math]::Round((Get-Volume | Where-Object {$_.DriveLetter -eq 'C'}).Size / 1GB, 0)) Go SSD"
//     osVersion       = $OS_Nom
//     userEmail       = $UserEmail # Pour lier côté Angular/NestJS
// }

// # 5. Export JSON dans le Temp
// $Path = "$env:TEMP\karlit_config.json"
// $Config | ConvertTo-Json -Depth 3 | Out-File -FilePath $Path -Encoding utf8
// Write-Host "Configuration exportée avec succès !" -ForegroundColor Green


// @Post('import-json')
//   async importJsonConfig(@Body() configDto: AddComputerDto): Promise<Computers> {
//       // Le DTO correspond déjà exactement aux clés du script PowerShell !
//       return await this.computerService.addComputer(configDto);
//   }

