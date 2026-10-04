<# : batch script
@echo off
title Update Website ke Hosting cPanel (Rumahweb)
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -Command "& ([scriptblock]::Create((Get-Content -Raw '%~f0')))"
echo.
pause
exit /b %ERRORLEVEL%
#>

$FtpServer = "ftp://ftp.tokoplastikjaya.com"
$Username  = "testing@tokoplastikjaya.com"
$Password  = "Testing213#"

[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

$FilesToUpload = Get-ChildItem -Path $CurrentDir -File | Where-Object {
    $_.Name -notlike "*.bat" -and 
    $_.Name -notlike "*.ps1" -and 
    $_.Name -notlike "*.git*" -and 
    $_.Name -notlike ".*"
}

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   Mengupdate Website ke Hosting cPanel       " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Server   : $FtpServer"
Write-Host "Akun     : $Username"
Write-Host "Total    : $($FilesToUpload.Count) file"
Write-Host "----------------------------------------------"

$SuccessCount = 0
$FailCount = 0

foreach ($file in $FilesToUpload) {
    $targetUri = "$FtpServer/$($file.Name)"
    Write-Host -NoNewline "Mengunggah $($file.Name) ... "
    
    try {
        $ftpRequest = [System.Net.FtpWebRequest]::Create($targetUri)
        $ftpRequest.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
        $ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftpRequest.UseBinary = $true
        $ftpRequest.KeepAlive = $false
        $ftpRequest.UsePassive = $true
        $ftpRequest.EnableSsl = $false

        $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $ftpRequest.ContentLength = $fileBytes.Length

        $requestStream = $ftpRequest.GetRequestStream()
        $requestStream.Write($fileBytes, 0, $fileBytes.Length)
        $requestStream.Close()

        $response = $ftpRequest.GetResponse()
        $response.Close()

        Write-Host "BERHASIL" -ForegroundColor Green
        $SuccessCount++
    }
    catch {
        Write-Host "GAGAL: $($_.Exception.Message)" -ForegroundColor Red
        $FailCount++
    }
}

Write-Host "----------------------------------------------"
if ($FailCount -eq 0 -and $SuccessCount -gt 0) {
    Write-Host "Deploy Selesai! Semua file berhasil diperbarui di hosting." -ForegroundColor Green
} else {
    Write-Host "Selesai: $SuccessCount berhasil, $FailCount gagal." -ForegroundColor Yellow
}
Write-Host "==============================================" -ForegroundColor Cyan
