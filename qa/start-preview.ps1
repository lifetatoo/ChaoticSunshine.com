param([Parameter(Mandatory=$true)][string]$SiteDirectory)
$ErrorActionPreference='Stop'
$resolvedSite=(Resolve-Path -LiteralPath $SiteDirectory).Path
if(-not (Test-Path -LiteralPath (Join-Path $resolvedSite 'index.html'))){throw 'Build the website before opening the preview.'}
$connection=[Net.Sockets.TcpClient]::new()
try{$connection.Connect('127.0.0.1',8813);Write-Output 'Preview is already running at http://127.0.0.1:8813';return}catch{}finally{$connection.Dispose()}
$env:CS_BUILD_DIR=$resolvedSite
$previewHome=Split-Path -Parent $resolvedSite
$repo=Split-Path -Parent $PSScriptRoot
$node=(Get-Command node).Source
$process=Start-Process -FilePath $node -ArgumentList 'qa/serve-preview.cjs' -WorkingDirectory $repo -WindowStyle Hidden -RedirectStandardOutput (Join-Path $previewHome 'preview-server.log') -RedirectStandardError (Join-Path $previewHome 'preview-server-error.log') -PassThru
Write-Output "Preview started independently of the chat command session. Process $($process.Id). Open http://127.0.0.1:8813"
