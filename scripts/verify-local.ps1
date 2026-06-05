$ErrorActionPreference = "Stop"

function Assert-HttpOk {
    param(
        [string] $Name,
        [string] $Url
    )

    $response = Invoke-WithRetry -Name $Name -Command {
        Invoke-WebRequest -Uri $Url -UseBasicParsing
    }
    if ($response.StatusCode -ne 200) {
        throw "$Name returned HTTP $($response.StatusCode)"
    }

    Write-Host "[ok] $Name -> $Url"
}

function Assert-ProtectedRedirect {
    param(
        [string] $Url
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -MaximumRedirection 0 -UseBasicParsing
    }
    catch {
        $response = $_.Exception.Response
        if ($null -eq $response) {
            throw
        }
    }

    if ([int] $response.StatusCode -ne 307) {
        throw "Protected frontend returned HTTP $([int] $response.StatusCode), expected 307"
    }

    $location = $response.Headers["Location"]
    if (-not $location.StartsWith("/login")) {
        throw "Protected frontend did not redirect to login"
    }

    Write-Host "[ok] Protected frontend -> redirects to login"
}

function Invoke-WithRetry {
    param(
        [string] $Name,
        [scriptblock] $Command,
        [int] $Attempts = 12,
        [int] $DelaySeconds = 2
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            return & $Command
        }
        catch {
            if ($attempt -eq $Attempts) {
                throw "$Name did not become ready after $Attempts attempts. $($_.Exception.Message)"
            }

            Start-Sleep -Seconds $DelaySeconds
        }
    }
}

Write-Host "Verifying Meridian local setup..."

$health = Invoke-WithRetry -Name "API health" -Command {
    Invoke-RestMethod -Uri "http://localhost:8001/health"
}

if ($health.status -ne "healthy") {
    throw "Backend health status is '$($health.status)', expected 'healthy'"
}

if ($health.database -ne "connected") {
    throw "Database status is '$($health.database)', expected 'connected'"
}

Write-Host "[ok] API health -> status=$($health.status), database=$($health.database), version=$($health.version)"

Assert-HttpOk -Name "FastAPI docs" -Url "http://localhost:8001/docs"
Assert-HttpOk -Name "Frontend login" -Url "http://localhost:3001/login"
Assert-ProtectedRedirect -Url "http://localhost:3001"

Write-Host "Meridian local setup verification passed."
