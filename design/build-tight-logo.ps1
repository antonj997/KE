# Dense slab lettering and arched lower row derived from the supplied original.
Add-Type -AssemblyName System.Drawing
$culture=[System.Globalization.CultureInfo]::InvariantCulture
function Convert-Outline($Outline,$WarpX=0,$WarpY=0,$WarpWidth=1,$WarpHeight=1,$Arch=0) {
    $points=$Outline.PathPoints; $types=$Outline.PathTypes
    $d=[System.Text.StringBuilder]::new()
    function XY($p){
        $py=[double]$p.Y
        if($Arch -gt 0){
            $nx=($p.X-($WarpX+$WarpWidth/2))/($WarpWidth/2)
            $rise=$Arch*[Math]::Max(0.0,1.0-$nx*$nx)
            $ry=[Math]::Max(0.0,[Math]::Min(1.0,($py-$WarpY)/$WarpHeight))
            $py-=$rise*[Math]::Pow($ry,1.15)
        }
        return $p.X.ToString('0.###',$culture)+' '+$py.ToString('0.###',$culture)
    }
    for($i=0;$i -lt $points.Length;$i++){
        $kind=$types[$i] -band 7
        if($kind -eq 0){[void]$d.Append('M'+(XY $points[$i]))}
        elseif($kind -eq 1){[void]$d.Append('L'+(XY $points[$i]))}
        elseif($kind -eq 3){[void]$d.Append('C'+(XY $points[$i])+' '+(XY $points[$i+1])+' '+(XY $points[$i+2]));$i+=2}
        if($types[$i] -band 128){[void]$d.Append('Z')}
    }
    return $d.ToString()
}
function Get-TightText([string]$Text,[double]$X,[double]$Y,[double]$Width,[double]$Height,[double]$Gap=2,[double]$Arch=0){
    $face=[System.Drawing.FontFamily]::new('Bernard MT Condensed')
    $style=if($face.IsStyleAvailable([System.Drawing.FontStyle]::Bold)){[int][System.Drawing.FontStyle]::Bold}else{[int][System.Drawing.FontStyle]::Regular}
    $glyphs=[System.Collections.Generic.List[object]]::new()
    $inkWidth=0.0
    $inkTop=[double]::PositiveInfinity;$inkBottom=[double]::NegativeInfinity
    foreach($ch in $Text.ToCharArray()){
        if($ch -eq ' '){$glyphs.Add(@{Path=$null;Width=12.0});$inkWidth+=12;continue}
        $p=[System.Drawing.Drawing2D.GraphicsPath]::new()
        $p.AddString([string]$ch,$face,$style,[single]100,[System.Drawing.PointF]::new(0,0),[System.Drawing.StringFormat]::GenericTypographic)
        $b=$p.GetBounds();$glyphs.Add(@{Path=$p;Bounds=$b;Width=[double]$b.Width});$inkWidth+=$b.Width
        $inkTop=[Math]::Min($inkTop,$b.Top);$inkBottom=[Math]::Max($inkBottom,$b.Bottom)
    }
    $sx=($Width-$Gap*($glyphs.Count-1))/$inkWidth
    $cursor=$X
    $result=[System.Text.StringBuilder]::new()
    foreach($g in $glyphs){
        if($null -eq $g.Path){$cursor+=$g.Width*$sx+$Gap;continue}
        $sy=$Height/($inkBottom-$inkTop)
        $m=[System.Drawing.Drawing2D.Matrix]::new([single]$sx,0,0,[single]$sy,[single]($cursor-$g.Bounds.X*$sx),[single]($Y-$inkTop*$sy))
        $g.Path.Transform($m);$m.Dispose()
        [void]$result.Append('<path d="'+(Convert-Outline $g.Path $X $Y $Width $Height $Arch)+'"/>')
        $cursor+=$g.Width*$sx+$Gap
        $g.Path.Dispose()
    }
    $face.Dispose()
    return $result.ToString()
}
function Get-WordmarkK([string]$D,[double]$X,[double]$Y,[double]$Width,[double]$Height){
    $result=[System.Text.StringBuilder]::new()
    foreach($part in [regex]::Matches($D,'[MLHVQZ][^MLHVQZ]*')){
        $command=$part.Value.Substring(0,1)
        [void]$result.Append($command)
        $values=[regex]::Matches($part.Value.Substring(1),'-?[0-9]+(?:\.[0-9]+)?')
        for($i=0;$i -lt $values.Count;$i++){
            $v=[double]::Parse($values[$i].Value,$culture)
            if($command -eq 'H' -or ($command -ne 'V' -and $i%2 -eq 0)){$v=$X+($v-18)*$Width/62}
            else{$v=$Y+($v-18)*$Height/59}
            if($i -gt 0){[void]$result.Append(' ')}
            [void]$result.Append($v.ToString('0.###',$culture))
        }
    }
    return '<path d="'+$result.ToString()+'"/>'
}
$assetDir=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../assets'))
$approved=[System.IO.File]::ReadAllText((Join-Path $assetDir 'logo-proposals/kragsta-kraft-skylt-ren.svg'))
$kPath=[regex]::Matches($approved,'<path d="([^"]+)"')[-1].Groups[1].Value
$k=Get-WordmarkK $kPath 164 38 150 215
$ragsta=Get-TightText 'RAGSTA' 314 38 724 215 2
$elektriska=Get-TightText 'ELEKTRISKA' 45 272 1110 288 2 88
$telephone=Get-TightText '076-016 97 90' 215 525 770 133 2
$letters=$k+$ragsta+$elektriska
$main='<g fill="#073a24" stroke="#073a24" stroke-width="10" stroke-linejoin="round" transform="translate(9 9)">'+$letters+'</g><g fill="#ff8508" stroke="#073a24" stroke-width="7" stroke-linejoin="round">'+$letters+'</g>'
$phone='<g fill="#073a24" stroke="#073a24" stroke-width="8" stroke-linejoin="round" transform="translate(7 7)">'+$telephone+'</g><g fill="#ff8508" stroke="#073a24" stroke-width="6" stroke-linejoin="round">'+$telephone+'</g>'
$title='<title id="title">Kragsta Elektriska</title>'
$description='<desc id="desc">Tät, hög klackseriflogotyp i originalets stil: orange bokstäver med mörkgrön kontur, välvd ELEKTRISKA-rad och det valda K:ets blixtform.</desc>'
$compact='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 590" role="img" aria-labelledby="title desc">'+$title+$description+$main+'</svg>'
$full='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" role="img" aria-labelledby="title desc">'+$title+$description+$main+$phone+'</svg>'
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-elektriska.svg'),$compact)
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-elektriska-full.svg'),$full)
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-icon.svg'),$approved)
Write-Output 'Built tight condensed lettering, arched lower row, and matching outlined phone line.'
