<?php
//http://molgav.nn.ru/share.php?riff=a0-a0070500-20a00500-0e0d0d0806040b10080c-00ff01ff02ff03ff04ff05ff06ff07ff40104110421043104410451046104710a011a111a211a311a411a511a611a711-0050103400000103400130103400150103400230203400250203400450103400400103400530103400550103400630203400650203400850103400800103400930103400950103400a30203400a50203400c50103400c00103400d30103400d50103400e30203400e50203401050103401000103401130103401150103401230203401250203401450103401400103401530103401550103401630203401650203401850103401800103401930103401950103401a30203401a50203401c50103401c00103401d30103401d50103401e30203401e50203402050103402000103402130103402150103402230203402250203402450103402400103402530103402550103402630203402650203402850103402800103402930103402950103402a30203402a50203402c50103402c00103402d30103402d50103402e30203402e5020340300020340305020340320020540325020540340020740345020740360020c403650200403800210403850204403a0020f403a50203403c0020b403c5020b403e0020a403e5020a40
echo "<p>test</p>";

function decodeState($encoded) {
	$strings = explode("-", $encoded);
	$drumsData=$strings[4];
	$cnt = strlen($drumsData) / 4;
	$drums=array();
	for ($i = 0; $i < $cnt; $i++) {
		$key = hexdec(substr($drumsData,$i * 4, 2));
		$data = hexdec(substr($drumsData, 2+$i * 4, 2));
		$drum = $key >> 5;
		$i32 = $key & bindec('00011111');
		$beat=0;
		$t='';
		if (($data | bindec('00000001')) == $data){$beat=$i32*8+0; array_push($drums,array($beat,$drum));}
		if (($data | bindec('00000010')) == $data){$beat=$i32*8+1; array_push($drums,array($beat,$drum));}
		if (($data | bindec('00000100')) == $data){$beat=$i32*8+2; array_push($drums,array($beat,$drum));}
		if (($data | bindec('00001000')) == $data){$beat=$i32*8+3; array_push($drums,array($beat,$drum));}
		if (($data | bindec('00010000')) == $data){$beat=$i32*8+4; array_push($drums,array($beat,$drum));}
		if (($data | bindec('00100000')) == $data){$beat=$i32*8+5; array_push($drums,array($beat,$drum));}
		if (($data | bindec('01000000')) == $data){$beat=$i32*8+6; array_push($drums,array($beat,$drum));}
		if (($data | bindec('10000000')) == $data){$beat=$i32*8+7; array_push($drums,array($beat,$drum));}		
	}
	$trackData=$strings[5];
	$cnt = strlen($trackData) / 9;
	$tracks=array();
	for ($i = 0; $i < $cnt; $i++) {
		$beat=hexdec(substr($trackData, $i * 9, 2));
		$track=hexdec(substr($trackData, $i * 9+2, 1));
		$len=hexdec(substr($trackData, $i * 9+3, 2));
		$pitch=hexdec(substr($trackData, $i * 9+5, 2));
		$shift=hexdec(substr($trackData, $i * 9+7, 2))-64;
		array_push($tracks,array($beat,$track,$len,$pitch,$shift));
	}
	$arr=array();
	array_push($arr,$drums,$tracks);
	return $arr;
}
try {
	$riff=htmlspecialchars($_GET["riff"]);
	$data=decodeState($riff);
	$state='';
	$drums=$data[0];	
	for ($i = 0; $i < count($drums); $i++) {
		$beat=$drums[$i][0];
		$drum=$drums[$i][1];
		$state=$state.' '.$drum.'/'.$beat;
	}
	$tracks=$data[1];
	for ($i = 0; $i < count($tracks); $i++) {
		$beat=$tracks[$i][0];
		$track=$tracks[$i][1];
		$len=$tracks[$i][2];
		$pitch=$tracks[$i][3];
		$shift=$tracks[$i][4];
		$state=$state.' '.$beat.'/'.$track.':'.$pitch.'-'.$shift.'='.$len;
	}
	echo "<p>".$riff."</p>";
	$w=500;
	$h=300;
	$im = @imagecreate($w,$h) or die("Cannot Initialize new GD image stream");
	$background_color = imagecolorallocate($im, 90, 200, 190);
	imagerectangle ($im,0,0,$w,$h,$background_color);
	$text_color = imagecolorallocate($im, 33, 14, 91);
	imagestring($im, 3, 15, 99,  $riff, $text_color);
	imagepng($im,"share/file.png");
	imagedestroy($im);
	$file = fopen("share/file.html", "w");
	fwrite($file, "<html><p>".$state."</p><p><img src='file.png' /></p></html>");
	fclose($file);
	echo "<p>done</p>";
	header('Location: share/file.html');
	exit();
} catch (Exception $e) {
    echo '<p>Caught exception: ',  $e->getMessage(), "</p>";
}
?>
