Start-Sleep -Seconds 4

$diseases = @(
    @{ id = "disease-1"; name = "Raiva" },
    @{ id = "disease-2"; name = "Parvovirose" },
    @{ id = "disease-3"; name = "Cinomose" },
    @{ id = "disease-4"; name = "Dermatite" },
    @{ id = "disease-5"; name = "Otite" },
    @{ id = "disease-6"; name = "Gengivite" },
    @{ id = "disease-7"; name = "Gastroenterite" },
    @{ id = "disease-8"; name = "Alergia" },
    @{ id = "disease-9"; name = "Pulga" },
    @{ id = "disease-10"; name = "Carrapato" },
    @{ id = "disease-11"; name = "Verme" },
    @{ id = "disease-12"; name = "Conjuntivite" },
    @{ id = "disease-13"; name = "Cataratas" },
    @{ id = "disease-14"; name = "Artrite" },
    @{ id = "disease-15"; name = "Diabetes" }
)

foreach ($disease in $diseases) {
    $body = $disease | ConvertTo-Json
    Invoke-WebRequest -Uri "http://localhost:3333/diseases" -Method POST -ContentType "application/json" -Body $body -ErrorAction SilentlyContinue | Out-Null
    Write-Host "✓ Criada: $($disease.name)"
}

Write-Host "`n✅ Todas as 15 doenças foram inseridas!"
