# Modern full wordmark derived from the user-approved Kragsta K/lightning symbol.
# Name and telephone number are taken from the user's supplied existing logo.
Add-Type -AssemblyName System.Drawing
$culture = [System.Globalization.CultureInfo]::InvariantCulture
function Get-Outline([string]$Text, [string]$Family, [double]$X, [double]$Y, [double]$Width, [double]$Height) {
    $outline = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $face = [System.Drawing.FontFamily]::new($Family)
    $outline.AddString($Text,$face,[int][System.Drawing.FontStyle]::Bold,[single]100,[System.Drawing.PointF]::new(0,0),[System.Drawing.StringFormat]::GenericTypographic)
    $bounds=$outline.GetBounds()
    $sx=$Width/$bounds.Width; $sy=$Height/$bounds.Height
    $matrix=[System.Drawing.Drawing2D.Matrix]::new([single]$sx,0,0,[single]$sy,[single]($X-$bounds.X*$sx),[single]($Y-$bounds.Y*$sy))
    $outline.Transform($matrix)
    $points=$outline.PathPoints; $types=$outline.PathTypes
    $d=[System.Text.StringBuilder]::new()
    function XY($p) { return $p.X.ToString('0.###',$culture)+' '+$p.Y.ToString('0.###',$culture) }
    for($i=0;$i -lt $points.Length;$i++) {
        $kind=$types[$i] -band 7
        if($kind -eq 0){[void]$d.Append('M'+(XY $points[$i]))}
        elseif($kind -eq 1){[void]$d.Append('L'+(XY $points[$i]))}
        elseif($kind -eq 3){[void]$d.Append('C'+(XY $points[$i])+' '+(XY $points[$i+1])+' '+(XY $points[$i+2]));$i+=2}
        if($types[$i] -band 128){[void]$d.Append('Z')}
    }
    $outline.Dispose();$face.Dispose();$matrix.Dispose()
    return $d.ToString()
}
$assetDir=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../assets'))
$approved=[System.IO.File]::ReadAllText((Join-Path $assetDir 'logo-proposals/kragsta-kraft-skylt-ren.svg'))
$kPath=[regex]::Matches($approved,'<path d="([^"]+)"')[-1].Groups[1].Value
$ragsta=Get-Outline 'RAGSTA' 'Rockwell' 345 42 690 155
$elektriska=Get-Outline 'ELEKTRISKA' 'Rockwell' 58 226 1084 155
$telephone=Get-Outline '076-016 97 90' 'Rockwell Condensed' 390 438 420 54
# Match the approved K's stem cap height; the bolt slightly overshoots its baseline.
$scale=(155/59).ToString('0.######',$culture)
$tx=(170-18*(155/59)).ToString('0.######',$culture)
$ty=(42-18*(155/59)).ToString('0.######',$culture)
$k="<path d=`"$kPath`" transform=`"matrix($scale 0 0 $scale $tx $ty)`" stroke-width=`"2.5`"/>"
$kDepth="<path d=`"$kPath`" transform=`"matrix($scale 0 0 $scale $tx $ty)`" stroke-width=`"3`"/>"
$letters="<path d=`"$ragsta`"/><path d=`"$elektriska`"/>"
$main="<g fill=`"#073a24`" stroke=`"#073a24`" stroke-width=`"7`" stroke-linejoin=`"round`" transform=`"translate(5 5)`">$kDepth$letters</g><g fill=`"#ff8508`" stroke=`"#073a24`" stroke-width=`"6.5`" stroke-linejoin=`"round`">$k$letters</g>"
$title='<title id="title">Kragsta Elektriska</title>'
$description='<desc id="desc">Moderniserad två-radig logotyp med orange klackseriffer, mörkgrön kontur och den godkända K-blixten som första bokstav.</desc>'
$compact="<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"0 0 1200 420`" role=`"img`" aria-labelledby=`"title desc`">$title$description$main</svg>"
$full="<svg xmlns=`"http://www.w3.org/2000/svg`" viewBox=`"0 0 1200 540`" role=`"img`" aria-labelledby=`"title desc`">$title$description$main<path d=`"$telephone`" fill=`"#073a24`"/></svg>"
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-elektriska.svg'),$compact)
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-elektriska-full.svg'),$full)
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-icon.svg'),$approved)
Write-Output 'Built matching full logo, invoice wordmark, and approved app icon.'
