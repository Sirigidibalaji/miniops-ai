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

                        Copy-Item $env:ENV_FILE $envPath -Force

                        try {
                            if (Test-Path $pidPath) {
                                $oldPid = [int](Get-Content $pidPath)
                                Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
                            }

                            $process = Start-Process -FilePath "node.exe" `
                                -ArgumentList "src/server.js" `
                                -WorkingDirectory $backend `
                                -PassThru

                            Set-Content $pidPath $process.Id

                            $healthy = $false

                            for ($i = 0; $i -lt 30; $i++) {
                                Start-Sleep -Seconds 2

                                try {
                                    $response = Invoke-WebRequest `
                                        -Uri "http://localhost:5000/api/health" `
                                        -TimeoutSec 3

                                    if ($response.StatusCode -eq 200) {
                                        $healthy = $true
                                        break
                                    }
                                } catch {
                                    if ($process.HasExited) {
                                        throw "Backend process stopped unexpectedly."
                                    }
                                }
                            }

                            if (-not $healthy) {
                                throw "Backend health check failed."
                            }

                            Write-Host "Backend deployed successfully."
                        }
                        finally {
                            Remove-Item $envPath -Force -ErrorAction SilentlyContinue
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

                    if (Test-Path $pidPath) {
                        $oldPid = [int](Get-Content $pidPath)
                        Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
                    }

                    $vite = Join-Path $frontend "node_modules/vite/bin/vite.js"

                    $process = Start-Process -FilePath "node.exe" `
                        -ArgumentList "`"$vite`" preview --host 0.0.0.0 --port 4173 --strictPort" `
                        -WorkingDirectory $frontend `
                        -PassThru

                    Set-Content $pidPath $process.Id

                    $ready = $false

                    for ($i = 0; $i -lt 15; $i++) {
                        Start-Sleep -Seconds 2

                        try {
                            $response = Invoke-WebRequest `
                                -Uri "http://localhost:4173" `
                                -TimeoutSec 3

                            if ($response.StatusCode -eq 200) {
                                $ready = $true
                                break
                            }
                        } catch {
                            if ($process.HasExited) {
                                throw "Frontend process stopped unexpectedly."
                            }
                        }
                    }

                    if (-not $ready) {
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