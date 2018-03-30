<?php
//http://molgav.nn.ru/share.php?riff=a0-a0070500-20a00500-0e0d0d0806040b10080c-00ff01ff02ff03ff04ff05ff06ff07ff40104110421043104410451046104710a011a111a211a311a411a511a611a711-0050103400000103400130103400150103400230203400250203400450103400400103400530103400550103400630203400650203400850103400800103400930103400950103400a30203400a50203400c50103400c00103400d30103400d50103400e30203400e50203401050103401000103401130103401150103401230203401250203401450103401400103401530103401550103401630203401650203401850103401800103401930103401950103401a30203401a50203401c50103401c00103401d30103401d50103401e30203401e50203402050103402000103402130103402150103402230203402250203402450103402400103402530103402550103402630203402650203402850103402800103402930103402950103402a30203402a50203402c50103402c00103402d30103402d50103402e30203402e5020340300020340305020340320020540325020540340020740345020740360020c403650200403800210403850204403a0020f403a50203403c0020b403c5020b403e0020a403e5020a40
error_reporting(E_ALL);
ini_set('display_errors', 1);
include("pChart2.1.4/class/pDraw.class.php");
include("pChart2.1.4/class/pImage.class.php");
function drawLine($pimage, $x1,$y1, $x2, $y2, $thk, $r, $g, $b){
	$pimage->drawLine($x1, $y1, $x2, $y2, array("R" => $r, "G" => $g, "B" => $b, "Weight" => $thk/2-2));
	//$pimage->drawRoundedFilledRectangle($x1 - $thk, $y1 - $thk, $x1 + $thk, $y1 + $thk, $thk, array("R" => $r, "G" => $g, "B" => $b, "Surrounding"=>0));
	//$pimage->drawRoundedFilledRectangle($x2 - $thk, $y2 - $thk, $x2 + $thk-1, $y2 + $thk-1, $thk*0.9, array("R" => $r, "G" => $g, "B" => $b, "Surrounding"=>0));
	$pimage->drawFilledCircle(round($x1) , round($y1) ,round($thk/2)-2, array("R" => $r, "G" => $g, "B" => $b));
	$pimage->drawFilledCircle(round($x2) , round($y2) ,round($thk/2)-2, array("R" => $r, "G" => $g, "B" => $b));
}
function decodeState($encoded)
{
    $strings = explode("-", $encoded);
    $drumsData = $strings[4];
    $cnt = strlen($drumsData) / 4;
    $drums = array();
    for($i = 0; $i < $cnt; $i++) {
        $key = hexdec(substr($drumsData, $i * 4, 2));
        $data = hexdec(substr($drumsData, 2 + $i * 4, 2));
        $drum = $key >> 5;
        $i32 = $key & bindec('00011111');
        $beat = 0;
        $t = '';
        if(($data | bindec('00000001')) == $data) {
            $beat = $i32 * 8 + 0;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00000010')) == $data) {
            $beat = $i32 * 8 + 1;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00000100')) == $data) {
            $beat = $i32 * 8 + 2;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00001000')) == $data) {
            $beat = $i32 * 8 + 3;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00010000')) == $data) {
            $beat = $i32 * 8 + 4;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('00100000')) == $data) {
            $beat = $i32 * 8 + 5;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('01000000')) == $data) {
            $beat = $i32 * 8 + 6;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
        if(($data | bindec('10000000')) == $data) {
            $beat = $i32 * 8 + 7;
            array_push($drums, array(
                $beat,
                $drum
            ));
        }
    }
    $trackData = $strings[5];
    $cnt = strlen($trackData) / 9;
    $tracks = array();
    for($i = 0; $i < $cnt; $i++) {
        $beat = hexdec(substr($trackData, $i * 9, 2));
        $track = hexdec(substr($trackData, $i * 9 + 2, 1));
        $len = hexdec(substr($trackData, $i * 9 + 3, 2));
        $pitch = hexdec(substr($trackData, $i * 9 + 5, 2));
        $shift = hexdec(substr($trackData, $i * 9 + 7, 2)) - 64;
        array_push($tracks, array(
            $beat,
            $track,
            $len,
            $pitch,
            $shift
        ));
    }
    $arr = array();
    array_push($arr, $drums, $tracks);
    return $arr;
}
function drumTitle($nn){
	if($nn=='1'){return 'Ride Cymbal';}
	if($nn=='2'){return 'Open Hi-hat';}
	if($nn=='3'){return 'Closed Hi-hat';}
	if($nn=='4'){return 'Mid Tom';}
	if($nn=='5'){return 'Snare drum';}
	if($nn=='6'){return 'Low Tom';}
	if($nn=='7'){return 'Bass drum';}
	return 'Splash Cymbal';
}
try {
    $riff = htmlspecialchars($_GET["riff"]);
    $data = decodeState($riff);
    $state = '';
    $drums = $data[0];
    for($i = 0; $i < count($drums); $i++) {
        $beat = $drums[$i][0];
        $drum = $drums[$i][1];
        $state = $state . ' ' . $drum . '/' . $beat;
    }
    $tracks = $data[1];
    for($i = 0; $i < count($tracks); $i++) {
        $beat = $tracks[$i][0];
        $track = $tracks[$i][1];
        $len = $tracks[$i][2];
        $pitch = $tracks[$i][3];
        $shift = $tracks[$i][4];
        $state = $state . ' ' . $beat . '/' . $track . ':' . $pitch . '-' . $shift . '=' . $len;
    }
    //echo "<p>" . $riff . "</p>";
    $ww = 500;
    $hh = 100;
	$mltpl = 20;
	$lvlsh = 0.75;
	$maxBeat = 1;
	$minPitch = 12 * 5;
	$maxPitch = 0;
	$hasDrums = count($drums) > 0;
	for ($i = 0; $i < count($drums); $i++) {
		$b = $drums[$i][0];
		if ($b > $maxBeat) {
			$maxBeat = $b;
		}
	}
	for ($i = 0; $i < count($tracks); $i++) {
		$b = $tracks[$i][0] + $tracks[$i][2] - 1;
		if ($b > $maxBeat) {
			$maxBeat = $b;
		}
		$max = max($tracks[$i][3], $tracks[$i][3] + $tracks[$i][4]);
		$min = min($tracks[$i][3], $tracks[$i][3] + $tracks[$i][4]);
		if ($max > $maxPitch) {
			$maxPitch = $max;
		}
		if ($min < $minPitch) {
			$minPitch = $min;
		}
	}
	$len = floor($maxBeat / 16) + 1;
	$ww = $len * 16 * $mltpl;
	$hh=1;
	$drumUses = array(false, false, false, false, false, false, false, false);
	for ($i = 0; $i < count($drums); $i++) {
		$drumUses[$drums[$i][1]] = true;
	}
	$drCount = 0;
	for ($i = 0; $i < 8; $i++) {
		if ($drumUses[$i]) {
			$drCount++;
			$drumUses[$i] = $drCount;
		}
	}
	if ($drCount) {
		$hh = $hh + $drCount * $mltpl;
	}
	if ($maxPitch >= $minPitch) {
		$hh = $hh + ($maxPitch - $minPitch + 1) * $mltpl;
	}
	$pimage = new pImage($ww, $hh);
	$pimage->Antialias = TRUE;
	$pimage->drawFilledRectangle(0, 0,$ww, $hh, array("R" => 0xdd, "G" => 0xee, "B" => 0xff));
	//$pimage->setFontProperties(array("FontName" => "pChart2.1.4/fonts/verdana.ttf", "FontSize" => 9));
    //$im = @imagecreate($ww, $hh) or die("Cannot Initialize new GD image stream");
	//imageantialias ( $im , true );
    //$background_color = imagecolorallocate($im, 90, 200, 190);
    //imagerectangle($im, 0, 0, $ww, $hh, $background_color);
    //$text_color = imagecolorallocate($im, 33, 14, 91);
    //imagestring($im, 8,30, 15, $riff, $text_color);
	
	//drawALine($im,32,0, 50, 500,100, $text_color);
	
	//drawALine($im,32, 300,50,70,130, $text_color);
	//
	if ($hh > 1) {
		if ($hasDrums) {
			/*for ($i = 0; $i < 8; $i++) {
				if ($drumUses[$i]) {
					//drawBTx(context2D, 0.5 * mltpl, (0.75 + s + drumUses[i]) * mltpl, drumInfo[i].title);
					$pimage->drawText(0.5 * $mltpl, $hh-$i*$mltpl, "drum".$i, array("R" => 0, "G" => 99, "B" => 55));
				}
			}*/
			for ($i = 0; $i < count($drums); $i++) {
				$x1 = $drums[$i][0] * $mltpl ;
				$y1 = $hh - $drCount * $mltpl + $drumUses[$drums[$i][1]] * $mltpl ;				
				//$y1=100;
				//drawALine($im,$mltpl * 0.8,$x1,$y1, $x1+1, $y1,$text_color);
				//drawLine($pimage, $x1,$y1, $x1+1, $y1, $mltpl * 0.45, 99, 66, 99);
				$pimage->drawFilledCircle(round($x1+$mltpl/2) , round($y1-$mltpl/2) ,round($mltpl/2-1), array("R" => 0, "G" => 0, "B" => 0));
			}
			$pimage->setFontProperties(array("FontName" => "pChart2.1.4/fonts/Forgotte.ttf", "FontSize" => round($mltpl*0.7)));
			$pimage->setShadow(TRUE,array("X"=>1,"Y"=>1,"R"=>99,"G"=>99,"B"=>99,"Alpha"=>90));
			$n=0;
			for ($i = 0; $i < count($drumUses); $i++) {
				$title=''.$drumUses[$i];
				if(strlen($title)>0){
					$pimage->drawText($mltpl/3, round($hh-$mltpl*$n-$mltpl*0.2), drumTitle($title), array("R" => 99, "G" => 99, "B" => 255));
					$n++;
				}
			}
		}
		//$pimage->drawRoundedFilledRectangle(50 , 100 , round($x1 + $mltpl), round($y1) , round(15), array("R" => 0, "G" => 0, "B" => 0));
		$pimage->setShadow(TRUE,array("X"=>3,"Y"=>3,"R"=>99,"G"=>99,"B"=>99,"Alpha"=>0));
		for ($i = 0; $i < count($tracks); $i++) {
			$x1 = $tracks[$i][0] * $mltpl + 0.5 * $mltpl;
			$y1 = ($maxPitch - $tracks[$i][3]) * $mltpl + 0.5 * $mltpl;
			$x2 = $x1 + 1 + ($tracks[$i][2] - 1) * $mltpl;
			$y2 = $y1 - $tracks[$i][4] * $mltpl;
			drawLine($pimage, $x1,$y1, $x2, $y2, $mltpl , 255, 66, 99);
			//line(svg, x1, y1, x2, y2, trackInfo[7 - storeTracks[i].track].color);
			//text(svg, x1, y1, pitchName(storeTracks[i].pitch));
		}
	}
	//
    //imagepng($im, "share/file.png");
    //imagedestroy($im);
	$fileName='s'.date('Y').'-'.date('m').'-'.date('d').'-'.(rand(1,100000000));
	//'testfile';
    $file = fopen("share/".$fileName.".html", "w");
	$html='';
	$html=$html . '<!DOCTYPE html>';
	$html=$html . "\r\n" . '<html>';
	$html=$html . "\r\n" . '    <head>';
	$html=$html . "\r\n" . '		<meta charset="UTF-8">';
	$html=$html . "\r\n" . '        <title>RiffShare</title>';
	$html=$html . "\r\n" . '		<script type="text/javascript" src="http://platform-api.sharethis.com/js/sharethis.js#property=5abcf2eece89f00013641c95&product=inline-share-buttons"></script>';
	$html=$html . "\r\n" . '		<style>';
	$html=$html . "\r\n" . '			body {';
	$html=$html . "\r\n" . '				background-color: #def;';
	$html=$html . "\r\n" . '			}';
	$html=$html . "\r\n" . '			p {';
	$html=$html . "\r\n" . '				text-align: center;';
	$html=$html . "\r\n" . '			} ';
	$html=$html . "\r\n" . '			img {';
	$html=$html . "\r\n" . '				width: 50%;';
	$html=$html . "\r\n" . '			} ';
	$html=$html . "\r\n" . '		</style>';
	$html=$html . "\r\n" . '    </head>';
	$html=$html . "\r\n" . '    <body>';
	$html=$html . "\r\n" . "		<p><a href='https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=" . $riff . "'><img src='".$fileName.".png' /></a></p>";
	$html=$html . "\r\n" . '		<div class="sharethis-inline-share-buttons"></div>';
	$html=$html . "\r\n" . "		<p><a href='https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=" . $riff . "'>Open in editor</a></p>";
	$html=$html . "\r\n" . '    </body>';
	$html=$html . "\r\n" . '</html>';
	$html=$html . "\r\n" . '<html>';
    //fwrite($file, "<html><p><a href='https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=" . $riff . "'>open</a></p><p><img src='file.png' /></p><p>v1.01</p></html>");
	fwrite($file, $html);
    fclose($file);
	$pimage->render("share/".$fileName.".png");
    header('Location: share/'.$fileName.'.html');
    exit();
}
catch(Exception $e) {
    echo '<p>Caught exception: ', $e->getMessage(), "</p>";
}
?>