$patterns = @(
    '((?:src|href)=["\''])(imgs/[^"\'']*?)\s([^"\'']*?)(\1)',
    '(url\(["\'']?)(?:\.\./)?imgs/[^"\'']*?\s[^"\'']*(["\'']?\))'
)

Get-ChildItem -Recurse -Include *.html,*.css | ForEach-Object {
    $path = $_.FullName
    $text = Get-Content -Raw -Path $path
    $newText = $text

    foreach ($pattern in $patterns) {
        do {
            $oldText = $newText
            $newText = $newText -replace $pattern, '$1$2%20$3$4'
        } while ($newText -ne $oldText)
    }

    if ($newText -ne $text) {
        Set-Content -Path $path -Value $newText -Encoding utf8
        Write-Output "Updated $path"
    }
}
