# Script to generate sitemap.xml automatically from HTML files
# Purpose: Keep sitemap aligned with the current folder structure and file dates

param(
    [string]$Domain = "https://agungperkasaborepile.com",
    [string]$OutputFile = "sitemap.xml"
)

$RootPath = (Get-Location).Path

# Files and folders that should not appear in the public sitemap
$ExcludedPathPatterns = @(
    "head-snippet.html",
    "save web design juni 2026"
)

# URL metadata keyed by relative path
$PriorityMap = @{
    "index.html" = @{ priority = "1.0"; changefreq = "weekly" }
    "artikel/artikel.html" = @{ priority = "0.9"; changefreq = "weekly" }
    "galeri/gallery.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "harga/harga-bore-pile-2026.html" = @{ priority = "0.9"; changefreq = "weekly" }
    "harga/harga-bore-pile-30cm.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "harga/harga-bore-pile-40cm.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "harga/harga-bore-pile-50cm.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-jakarta.html" = @{ priority = "0.9"; changefreq = "weekly" }
    "jasa/bore-pile-bekasi.html" = @{ priority = "0.9"; changefreq = "weekly" }
    "jasa/bore-pile-bogor.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-bsd.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-cibubur.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-cikarang.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-ciputat.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-depok.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-karawaci.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-pamulang.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "jasa/bore-pile-tangerang.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "artikel/bore-pile-vs-strauss.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "artikel/borepile-vs-tiang-pancang.html" = @{ priority = "0.8"; changefreq = "monthly" }
    "artikel/proses-bore-pile.html" = @{ priority = "0.8"; changefreq = "monthly" }
}

function Get-RelativeUrlPath {
    param(
        [System.IO.FileInfo]$File
    )

    $RelativePath = $File.FullName.Substring($RootPath.Length + 1).Replace([System.IO.Path]::DirectorySeparatorChar, "/")
    return $RelativePath
}

$HtmlFiles = Get-ChildItem -Recurse -Filter *.html | Where-Object {
    $RelativePath = Get-RelativeUrlPath $_
    -not ($ExcludedPathPatterns | Where-Object { $RelativePath -like "*$_*" })
}

$XmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
$XmlStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
$XmlEnd = '</urlset>'

$UrlEntries = @()

# Homepage is always the first entry.
$IndexFile = Get-Item "index.html"
$IndexLastMod = $IndexFile.LastWriteTime.ToString("yyyy-MM-dd")
$UrlEntries += @"
    <url>
        <loc>$Domain/</loc>
        <lastmod>$IndexLastMod</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
"@

$HtmlFiles |
    Sort-Object @{ Expression = { Get-RelativeUrlPath $_ } } |
    ForEach-Object {
        $RelativePath = Get-RelativeUrlPath $_

        if ($RelativePath -eq "index.html") {
            return
        }

        $FileLastMod = $_.LastWriteTime.ToString("yyyy-MM-dd")
        $Metadata = $PriorityMap[$RelativePath]
        $Priority = if ($Metadata) { $Metadata.priority } else { "0.8" }
        $ChangeFreq = if ($Metadata) { $Metadata.changefreq } else { "monthly" }

        $UrlEntries += @"
    <url>
        <loc>$Domain/$RelativePath</loc>
        <lastmod>$FileLastMod</lastmod>
        <changefreq>$ChangeFreq</changefreq>
        <priority>$Priority</priority>
    </url>
"@
    }

$SitemapContent = @(
    $XmlHeader
    $XmlStart
    $UrlEntries
    $XmlEnd
) -join "`n"

$SitemapContent | Set-Content -Path $OutputFile -Encoding UTF8

Write-Host "[OK] Sitemap generated: $OutputFile"
Write-Host "[OK] Total URLs: $($UrlEntries.Count)"
Write-Host "[OK] Domain: $Domain"
