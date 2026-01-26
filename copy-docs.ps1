# Script para copiar documentação para o repositório FA-360
# Execute este script no PowerShell

$sourceDir = "C:\Users\José Ferreira\.gemini\antigravity\brain\08f644a7-d927-463e-ba7f-aee41158a7a5"
$targetDir = "C:\Users\José Ferreira\FA-360-Antigravity\docs"

# Criar estrutura de pastas
New-Item -ItemType Directory -Force -Path "$targetDir\architecture" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\implementation" | Out-Null

# Copiar ficheiros de arquitetura
Copy-Item "$sourceDir\01_SISTEMA_AUTOMACAO_PROJETOS.md" "$targetDir\architecture\01_project_automation_system.md" -Force
Copy-Item "$sourceDir\02_FEEENGINE_V12.md" "$targetDir\architecture\02_feeengine_v12.md" -Force
Copy-Item "$sourceDir\03_DESIGN_SYSTEM_HYPER_PREMIUM.md" "$targetDir\architecture\03_design_system.md" -Force
Copy-Item "$sourceDir\04_ANTI_GHOST_DIGITAL_FINGERPRINT.md" "$targetDir\architecture\04_anti_ghost_fingerprint.md" -Force

# Copiar plano de implementação
Copy-Item "$sourceDir\implementation_plan.md" "$targetDir\implementation\feeengine_v12_legal_pt.md" -Force

Write-Host "✅ Documentação copiada com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Ficheiros criados:" -ForegroundColor Cyan
Write-Host "  📁 docs/architecture/" -ForegroundColor Yellow
Write-Host "    - 01_project_automation_system.md"
Write-Host "    - 02_feeengine_v12.md"
Write-Host "    - 03_design_system.md"
Write-Host "    - 04_anti_ghost_fingerprint.md"
Write-Host "  📁 docs/implementation/" -ForegroundColor Yellow
Write-Host "    - feeengine_v12_legal_pt.md"
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "  1. cd 'C:\Users\José Ferreira\FA-360-Antigravity'"
Write-Host "  2. git add docs/"
Write-Host "  3. git commit -m 'Add comprehensive technical documentation'"
Write-Host "  4. git push"
