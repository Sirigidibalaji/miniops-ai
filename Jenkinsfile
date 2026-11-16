pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Validation') {
            steps {
                dir('backend') {
                    bat 'npm ci'
                    bat 'node --check src/server.js'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                withCredentials([file(
                    credentialsId: 'miniops-env',
                    variable: 'ENV_FILE'
                )]) {
                    powershell '''
                        $backend = Join-Path $env:WORKSPACE "backend"
                        $envPath = Join-Path $backend ".env"
                        $pidPath = Join-Path $backend "deployment.pid"
                        $outLog = Join-Path $backend "deploy-backend.out.log"
                        $errLog = Join-Path $backend "deploy-backend.err.log"

                        $node = (Get-Command node.exe -ErrorAction Stop).Source

                        Write-Host "Node executable: $node"
                        Write-Host "Backend directory: $backend"

                        if (-not (Test-Path $env:ENV_FILE)) {
                            throw "Jenkins environment credential file was not found."
                        }

                        Copy-Item $env:ENV_FILE $envPath -Force

                        try {
                            if (Test-Path $pidPath) {
                                $oldPid = [int](Get-Content $pidPath)

                                $oldProcess = Get-CimInstance Win32_Process `
                                    -Filter "ProcessId = $oldPid" `
                                    -ErrorAction SilentlyContinue

                                if ($oldProcess -and
                                    $oldProcess.Name -eq "node.exe" -and
                                    $oldProcess.CommandLine -like "*src/server.js*") {
                                    Stop-Process -Id $oldPid -Force
                                    Start-Sleep -Seconds 2
                                }

                                Remove-Item $pidPath -Force
                            }

                            if (Test-NetConnection localhost -Port 5000 -InformationLevel Quiet) {
                                throw "Port 5000 is already occupied."
                            }

                            Remove-Item $outLog, $errLog `
                                -Force -ErrorAction SilentlyContinue

                            Write-Host "Starting MiniOps AI backend..."

                            $process = Start-Process `
                                -FilePath $node `
                                -ArgumentList "src/server.js" `
                                -WorkingDirectory $backend `
                                -RedirectStandardOutput $outLog `
                                -RedirectStandardError $errLog `
                                -PassThru

                            Set-Content $pidPath $process.Id

                            Write-Host "Backend process ID: $($process.Id)"

                            $healthy = $false

                            for ($i = 0; $i -lt 30; $i++) {
                                Start-Sleep -Seconds 2

                                $process.Refresh()

                                if ($process.HasExited) {
                                    Write-Host "Backend process exited."
                                    break
                                }

                                try {
                                    $response = Invoke-WebRequest `
                                        -Uri "http://localhost:5000/api/health" `
                                        -TimeoutSec 3

                                    if ($response.StatusCode -eq 200) {
                                        $healthy = $true
                                        break
                                    }
                                }
                                catch {
                                    Write-Host "Waiting for backend health..."
                                }
                            }

                            if (-not $healthy) {
                                Write-Host "========== BACKEND OUTPUT =========="

                                if (Test-Path $outLog) {
                                    Get-Content $outLog -Tail 50
                                }

                                Write-Host "========== BACKEND ERRORS =========="

                                if (Test-Path $errLog) {
                                    Get-Content $errLog -Tail 50
                                }

                                throw "Backend health check failed. Check the logs above."
                            }

                            Write-Host "Backend deployed successfully."
                        }
                        finally {
                            Remove-Item $envPath -Force `
                                -ErrorAction SilentlyContinue
                        }
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                powershell '''
                    $frontend = Join-Path $env:WORKSPACE "frontend"
                    $pidPath = Join-Path $frontend "deployment.pid"
                    $outLog = Join-Path $frontend "deploy-frontend.out.log"
                    $errLog = Join-Path $frontend "deploy-frontend.err.log"

                    $node = (Get-Command node.exe -ErrorAction Stop).Source
                    $vite = Join-Path $frontend "node_modules/vite/bin/vite.js"

                    if (-not (Test-Path $vite)) {
                        throw "Vite executable not found."
                    }

                    if (Test-Path $pidPath) {
                        $oldPid = [int](Get-Content $pidPath)

                        $oldProcess = Get-CimInstance Win32_Process `
                            -Filter "ProcessId = $oldPid" `
                            -ErrorAction SilentlyContinue

                        if ($oldProcess -and
                            $oldProcess.Name -eq "node.exe" -and
                            $oldProcess.CommandLine -like "*vite*preview*") {
                            Stop-Process -Id $oldPid -Force
                            Start-Sleep -Seconds 2
                        }

                        Remove-Item $pidPath -Force
                    }

                    if (Test-NetConnection localhost -Port 4173 -InformationLevel Quiet) {
                        throw "Port 4173 is already occupied."
                    }

                    Remove-Item $outLog, $errLog `
                        -Force -ErrorAction SilentlyContinue

                    Write-Host "Starting MiniOps AI frontend..."

                    $process = Start-Process `
                        -FilePath $node `
                        -ArgumentList "`"$vite`" preview --host 0.0.0.0 --port 4173 --strictPort" `
                        -WorkingDirectory $frontend `
                        -RedirectStandardOutput $outLog `
                        -RedirectStandardError $errLog `
                        -PassThru

                    Set-Content $pidPath $process.Id

                    $ready = $false

                    for ($i = 0; $i -lt 15; $i++) {
                        Start-Sleep -Seconds 2
                        $process.Refresh()

                        if ($process.HasExited) {
                            break
                        }

                        try {
                            $response = Invoke-WebRequest `
                                -Uri "http://localhost:4173" `
                                -TimeoutSec 3

                            if ($response.StatusCode -eq 200) {
                                $ready = $true
                                break
                            }
                        }
                        catch {
                            Write-Host "Waiting for frontend..."
                        }
                    }

                    if (-not $ready) {
                        Write-Host "========== FRONTEND OUTPUT =========="

                        if (Test-Path $outLog) {
                            Get-Content $outLog -Tail 40
                        }

                        Write-Host "========== FRONTEND ERRORS =========="

                        if (Test-Path $errLog) {
                            Get-Content $errLog -Tail 40
                        }

                        throw "Frontend health check failed."
                    }

                    Write-Host "Frontend deployed successfully."
                '''
            }
        }
    }

    post {
        success {
            echo 'MiniOps AI CI/CD pipeline completed successfully!'
            echo 'Frontend: http://localhost:4173'
            echo 'Backend: http://localhost:5000'
        }

        failure {
            echo 'MiniOps AI pipeline failed. Check Console Output.'
        }
    }
}