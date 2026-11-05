# Uniform cap height and natural slab-serif proportions, based on the approved K.
Add-Type -AssemblyName System.Drawing
$culture=[System.Globalization.CultureInfo]::InvariantCulture
function Outline-Data($Outline){
    $pts=$Outline.PathPoints;$types=$Outline.PathTypes;$d=[System.Text.StringBuilder]::new()
    function XY($p){return $p.X.ToString('0.###',$culture)+' '+$p.Y.ToString('0.###',$culture)}
    for($i=0;$i -lt $pts.Length;$i++){
        switch($types[$i] -band 7){
            0 {[void]$d.Append('M'+(XY $pts[$i]))}
            1 {[void]$d.Append('L'+(XY $pts[$i]))}
            3 {[void]$d.Append('C'+(XY $pts[$i])+' '+(XY $pts[$i+1])+' '+(XY $pts[$i+2]));$i+=2}
        }
        if($types[$i] -band 128){[void]$d.Append('Z')}
    }
    return $d.ToString()
}
function Normalize-K([string]$D,[double]$Height){
    $scale=$Height/59;$dOut=[System.Text.StringBuilder]::new()
    foreach($part in [regex]::Matches($D,'[MLHVQZ][^MLHVQZ]*')){
        $cmd=$part.Value.Substring(0,1);[void]$dOut.Append($cmd)
        $vals=[regex]::Matches($part.Value.Substring(1),'-?[0-9]+(?:\.[0-9]+)?')
        for($j=0;$j -lt $vals.Count;$j++){
            $v=([double]::Parse($vals[$j].Value,$culture)-18)*$scale
            if($j -gt 0){[void]$dOut.Append(' ')}
            [void]$dOut.Append($v.ToString('0.###',$culture))
        }
    }
    return $dOut.ToString()
}
function New-LetterRow([string]$Text,[double]$Height,[bool]$InitialK=$false){
    $face=[System.Drawing.FontFamily]::new('Rockwell')
    $style=[int][System.Drawing.FontStyle]::Bold
    $full=[System.Drawing.Drawing2D.GraphicsPath]::new()
    $full.AddString($Text,$face,$style,[single]100,[System.Drawing.PointF]::new(0,0),[System.Drawing.StringFormat]::GenericTypographic)
    $bounds=$full.GetBounds();$scale=$Height/$bounds.Height;$full.Dispose()
    $glyphs=[System.Collections.Generic.List[object]]::new();$width=0.0
    for($i=0;$i -lt $Text.Length;$i++){
        $ch=$Text.Substring($i,1)
        if($ch -eq ' '){$g=@{D='';Width=$Height*0.23}}
        elseif($InitialK -and $i -eq 0){$g=@{D=(Normalize-K $kPath $Height);Width=62*$Height/59}}
        else{
            $p=[System.Drawing.Drawing2D.GraphicsPath]::new()
            $p.AddString($ch,$face,$style,[single]100,[System.Drawing.PointF]::new(0,0),[System.Drawing.StringFormat]::GenericTypographic)
            $b=$p.GetBounds()
            # Identical X/Y scale preserves the font's letter proportions.
            $m=[System.Drawing.Drawing2D.Matrix]::new([single]$scale,0,0,[single]$scale,[single](-$b.X*$scale),[single](-$bounds.Y*$scale))
            $p.Transform($m);$m.Dispose();$g=@{D=(Outline-Data $p);Width=$b.Width*$scale};$p.Dispose()
        }
        $glyphs.Add($g);$width+=$g.Width
    }
    $face.Dispose();$width+=2*($glyphs.Count-1)
    return @{Glyphs=$glyphs;Width=$width;Height=$Height}
}
function Place-Row($Row,[double]$Center,[double]$Y,[double]$Arch=0){
    $cursor=$Center-$Row.Width/2;$start=$cursor;$d=[System.Text.StringBuilder]::new()
    foreach($g in $Row.Glyphs){
        $mid=$cursor+$g.Width/2
        $normalized=($mid-$Center)/($Row.Width/2)
        $placedY=$Y-$Arch*[Math]::Max(0.0,1.0-$normalized*$normalized)
        if($g.D){[void]$d.Append('<path d="'+$g.D+'" transform="translate('+$cursor.ToString('0.###',$culture)+' '+$placedY.ToString('0.###',$culture)+')"/>')}
        $cursor+=$g.Width+2
    }
    return $d.ToString()
}
$assetDir=[System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../assets'))
$approved=[System.IO.File]::ReadAllText((Join-Path $assetDir 'logo-proposals/kragsta-kraft-skylt-ren.svg'))
$kPath=[regex]::Matches($approved,'<path d="([^"]+)"')[-1].Groups[1].Value
$top=New-LetterRow 'KRAGSTA' 170 $true
$lower=New-LetterRow 'ELEKTRISKA' 170
$phone=New-LetterRow '076-016 97 90' 96
$canvasWidth=[Math]::Ceiling($lower.Width+90);$center=$canvasWidth/2
$letters=(Place-Row $top $center 36)+(Place-Row $lower $center 248 22)
$digits=Place-Row $phone $center 447
$main='<g fill="#073a24" stroke="#073a24" stroke-width="8" stroke-linejoin="round" transform="translate(6 6)">'+$letters+'</g><g fill="#ff8508" stroke="#073a24" stroke-width="6" stroke-linejoin="round">'+$letters+'</g>'
$number='<g fill="#073a24" stroke="#073a24" stroke-width="6" stroke-linejoin="round" transform="translate(5 5)">'+$digits+'</g><g fill="#ff8508" stroke="#073a24" stroke-width="4.5" stroke-linejoin="round">'+$digits+'</g>'
$meta='<title id="title">Kragsta Elektriska</title><desc id="desc">Tätt staplad klackseriflogotyp där namnets båda rader har samma bokstavshöjd och naturliga proportioner som den godkända K-blixten.</desc>'
$compact='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+$canvasWidth.ToString($culture)+' 450" role="img" aria-labelledby="title desc">'+$meta+$main+'</svg>'
$full='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+$canvasWidth.ToString($culture)+' 580" role="img" aria-labelledby="title desc">'+$meta+$main+$number+'</svg>'
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-elektriska.svg'),$compact)
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-elektriska-full.svg'),$full)
[System.IO.File]::WriteAllText((Join-Path $assetDir 'kragsta-icon.svg'),$approved)
Write-Output ('Built both name rows at a 170-unit cap height with uniform scaling; canvas width '+$canvasWidth+'.')
