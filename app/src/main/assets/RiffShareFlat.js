console.log('riffshareflat v1.0.13');
function RiffShareFlat() {
	window.riffshareflat = this;
	return this;
}
RiffShareFlat.prototype.init = function () {
	this.tapSize = 32;
	try {
		console.log('window.devicePixelRatio', window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 31 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}
	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize', this.tapSize, 'devicePixelRatio', window.devicePixelRatio);
	this.tickID = -1;
	this.onAir = false;
	//this.queueAhead = 0.75;
	this.tickerDelay = 1;
	this.tickerStep = 0;
	//console.log('queueAhead', this.queueAhead);
	this.svgns = "http://www.w3.org/2000/svg";
	this.contentDiv = document.getElementById('contentDiv');
	this.contentSVG = document.getElementById('contentSVG');
	this.rakeDiv = document.getElementById('rakeDiv');
	this.contentGroup = document.getElementById('contentGroup');
	//console.log('this.contentGroup',this.contentGroup);
	this.paneGroup = document.getElementById('paneGroup');
	this.linesGroup = document.getElementById('linesGroup');
	this.textGroup = document.getElementById('textGroup');
	this.drumGroup = document.getElementById('drumGroup');
	this.upperGroup = document.getElementById('upperGroup');
	this.counterGroup = document.getElementById('counterGroup');
	this.counterLine = null;
	this.trackGroups = [];
	this.trackGroups[7] = document.getElementById('track1Group');
	this.trackGroups[6] = document.getElementById('track2Group');
	this.trackGroups[5] = document.getElementById('track3Group');
	this.trackGroups[4] = document.getElementById('track4Group');
	this.trackGroups[3] = document.getElementById('track5Group');
	this.trackGroups[2] = document.getElementById('track6Group');
	this.trackGroups[1] = document.getElementById('track7Group');
	this.trackGroups[0] = document.getElementById('track8Group');
	//this.bgGroup = document.getElementById('bgGroup');
	//this.bgImage = document.getElementById('bgImage');
	//this.bgImageWidth = 1280;
	//this.bgImageHeight = 800;
	//this.inChordDelay = 0.01;
	this.sentWhen = 0;
	this.sentMeasure = 0;
	this.nextBeat = 0;
	this.nextWhen = 0;
	this.mark = null;
	this.undoQueue = [];
	this.undoStep = 0;
	this.undoSize = 99;
	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 4;
	this.innerWidth = 3000;
	this.innerHeight = 2000;
	this.minZoom = 1;
	this.maxZoom = 20;
	this.spots = [];
	this.timeOutID = 0;
	this.marginLeft = 18.5;
	this.marginRight = 17;
	this.marginTop = 1;
	this.marginBottom = 1;
	this.tempo = 120; //sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220]);
	this.bgMode = 0; //sureInList(readTextFromlocalStorage('bgMode'), 0, [0, 1, 2]);
	this.contentDiv.style.background = modeBackground(this.bgMode);
	this.drumVolumes = [70, 70, 70, 70, 70, 70, 70, 70];
	/*for (var i = 0; i < 8; i++) {
	this.drumVolumes.push(sureNumeric(readObjectFromlocalStorage('drum' + i), 0, 70, 100));
	}*/
	this.equalizer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	/*for (var i = 0; i < 10; i++) {
	this.equalizer.push(sureNumeric(readObjectFromlocalStorage('equalizer' + i), -10, 0, 10));
	}*/
	this.drumInfo = drumInfo;
	this.trackInfo = trackInfo;
	/*
	this.drumInfo = [{
	sound: _drum_35_0_Chaos_sf2_file,
	pitch: 36, //36
	title: 'Bass drum',
	id: 0,
	volumeRatio: 0.5,
	length: 0.5
	}, {
	sound: _drum_41_26_JCLive_sf2_file,
	pitch: 41, //43
	title: 'Low Tom',
	id: 1,
	volumeRatio: 0.5,
	length: 0.5
	}, {
	sound: _drum_38_22_FluidR3_GM_sf2_file,
	pitch: 38, //40
	title: 'Snare drum',
	id: 2,
	volumeRatio: 0.75,
	length: 0.5
	}, {
	sound: _drum_45_26_JCLive_sf2_file,
	pitch: 45, //47,48,50
	title: 'Mid Tom',
	id: 3,
	volumeRatio: 0.75,
	length: 0.5
	}, {
	sound: _drum_42_26_JCLive_sf2_file,
	pitch: 42, //44
	title: 'Closed Hi-hat',
	id: 4,
	volumeRatio: 0.5,
	length: 1
	}, {
	sound: _drum_46_26_JCLive_sf2_file,
	pitch: 46, //
	title: 'Open Hi-hat',
	id: 5,
	volumeRatio: 0.5,
	length: 1
	}, {
	sound: _drum_51_26_JCLive_sf2_file,
	pitch: 51, //rest
	title: 'Ride Cymbal',
	id: 6,
	volumeRatio: 0.3,
	length: 2
	}, {
	sound: _drum_49_26_JCLive_sf2_file,
	pitch: 49, //
	title: 'Splash Cymbal',
	id: 7,
	volumeRatio: 0.3,
	length: 3
	}
	];
	this.trackInfo = [{
	color: 'rgba(255,204,187,1)',
	shadow: 'rgba(255,204,187,0.4)',
	title: 'Synth Bass',
	order: 2,
	sound: _tone_0390_GeneralUserGS_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track7'), 0, 70, 100),
	nn: 7,
	octave: 3,
	volumeRatio: 0.5
	}, {
	color: 'rgba(204,153,0,1)',
	shadow: 'rgba(204,153,0,0.4)',
	title: 'String Ensemble',
	order: 1,
	sound: _tone_0480_Aspirin_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track6'), 0, 70, 100),
	nn: 6,
	octave: 3,
	volumeRatio: 0.6
	}, {
	color: 'rgba(204,0,204,1)',
	shadow: 'rgba(204,0,204,0.4)',
	title: 'Bass guitar',
	order: 5,
	sound: _tone_0330_SoundBlasterOld_sf2,
	volume: sureNumeric(readObjectFromlocalStorage('track5'), 0, 70, 100),
	nn: 5,
	octave: 2,
	volumeRatio: 0.99
	}, {
	color: 'rgba(00,153,255,1)',
	shadow: 'rgba(00,153,255,0.4)',
	title: 'Acoustic Piano',
	order: 3,
	sound: _tone_0000_Chaos_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track4'), 0, 70, 100),
	nn: 4,
	octave: 3,
	volumeRatio: 0.9
	}, {
	color: 'rgba(153,51,0,1)',
	shadow: 'rgba(153,51,0,0.4)',
	title: 'PalmMute guitar',
	order: 4,
	sound: _tone_0280_LesPaul_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track3'), 0, 70, 100),
	nn: 3,
	octave: 3,
	volumeRatio: 0.9
	}, {
	color: 'rgba(51,51,255,1)',
	shadow: 'rgba(51,51,255,0.4)',
	title: 'Percussive Organ',
	order: 0,
	sound: _tone_0170_JCLive_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track2'), 0, 70, 100),
	nn: 2,
	octave: 4,
	volumeRatio: 0.6
	}, {
	color: 'rgba(0,153,0,1)',
	shadow: 'rgba(0,153,0,0.4)',
	title: 'Acoustic guitar',
	order: 6,
	sound: _tone_0250_Chaos_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track1'), 0, 70, 100),
	nn: 1,
	octave: 3,
	volumeRatio: 0.75
	}, {
	color: 'rgba(255,0,0,1)',
	shadow: 'rgba(255,0,0,0.4)',
	title: 'Distortion guitar',
	order: 7,
	sound: _tone_0300_LesPaul_sf2_file,
	volume: sureNumeric(readObjectFromlocalStorage('track0'), 0, 70, 100),
	nn: 0,
	octave: 3,
	volumeRatio: 0.9
	}

	];*/
	this.setupInput();
	window.onresize = function () {
		riffshareflat.resetSize();
	};
	window.onunload = function () {
		riffshareflat.saveState();
	};
	window.unload = function () {
		riffshareflat.saveState();
	};
	window.onpagehide = function () {
		riffshareflat.saveState();
	};
	window.pagehide = function () {
		riffshareflat.saveState();
	};
	window.onbeforeunload = function () {
		riffshareflat.saveState();
	};
	window.onblur = function () {
		riffshareflat.saveState();
	};
	this.storeDrums = [];
	this.storeTracks = [];
	//this.storeDrums = sureArray(readObjectFromlocalStorage('storeDrums'), []);
	//console.log(this.storeDrums, readObjectFromlocalStorage('storeDrums'));
	/*try {
	var le = this.storeDrums.length;
	} catch (t) {
	console.log(t);
	this.storeDrums = [];
	}*/
	//this.storeTracks = sureArray(readObjectFromlocalStorage('storeTracks'), []);
	//console.log(this.storeTracks, readObjectFromlocalStorage('storeTracks'));
	/*try {
	var le = this.storeTracks.length;
	} catch (t) {
	console.log(t);
	this.storeTracks = [];
	}*/
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContextFunc();
	this.player = new WebAudioFontPlayer();
	//this.player.afterTime = 0.1;
	this.master = new WebAudioFontChannel(this.audioContext);
	this.echoOn = false;
	try {
		var usrAgnt = navigator.userAgent || navigator.vendor || window.opera;
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i//
			.test(usrAgnt) //
			 || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i//
			.test(usrAgnt.substr(0, 4))) {
			this.echoOn = false;
			document.title = 'Mobile RiffShare';
		} else {
			this.echoOn = true;
			document.title = 'Desktop RiffShare';
		}
	} catch (noch) {
		console.log(noch);
	}
	this.echoOn = true;
	if (this.echoOn) {
		console.log('init WebAudioFontReverberator');
		this.reverberator = new WebAudioFontReverberator(this.audioContext);
		this.reverberator.output.connect(this.audioContext.destination);
		this.master.output.connect(this.reverberator.input);
	} else {
		console.log('skip WebAudioFontReverberator');
		this.master.output.connect(this.audioContext.destination);
	}
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].audioNode = this.audioContext.createGain();
		this.trackInfo[i].audioNode.connect(this.master.input);
		this.drumInfo[i].audioNode = this.audioContext.createGain();
		this.drumInfo[i].audioNode.connect(this.master.input);
	}
	for (var i = 0; i < this.drumInfo.length; i++) {
		this.player.adjustPreset(this.audioContext, this.drumInfo[i].sound);
	}
	for (var i = 0; i < this.trackInfo.length; i++) {
		this.player.adjustPreset(this.audioContext, this.trackInfo[i].sound);
	}
	this.resetSize();
	//setInterval(riffshareflat.moveCounter, 100);
	setInterval(riffshareflat.moveBeatCounter, 100);
	this.loadState();

	console.log('done init');
};
RiffShareFlat.prototype.loadState = function () {
	var me = this;
	var check = readTextFromlocalStorage('tempo');
	console.log('check', check);
	if (check) {
		this.loadStorageState();
		this.resetAllLayersNow();
	} else {
		readStringFromWebDB('fullState', function (text) {
			if (text) {
				me.saveCopyStorageState(text);
				me.resetAllLayersNow();
			} else {
				readStringFromIndexedDB('fullState', function (text) {
					if (text) {
						me.saveCopyStorageState(text);
						me.resetAllLayersNow();
					};
				});
			}
		});
	}
	/*
	readStringFromWebDB('fullState',function(text){
	//console.log('readStringFromWebDB',text);
	});
	readStringFromIndexedDB('fullState',function(text){
	//console.log('readStringFromIndexedDB',text);
	});*/
	//var fullState=
};
RiffShareFlat.prototype.saveCopyStorageState = function (fullState) {
	var o = JSON.parse(fullState);
	saveObject2localStorage('flatstate', o.flatstate);
	saveText2localStorage('tempo', '' + o.tempo);
	for (var i = 0; i < 8; i++) {
		saveText2localStorage('drum' + i, o['drum' + i]);
		saveText2localStorage('track' + i, o['track' + i]);
	}
	for (var i = 0; i < 10; i++) {
		saveText2localStorage('equalizer' + i, o['equalizer' + i]);
	}
	saveObject2localStorage('storeDrums', o.storeDrums);
	saveObject2localStorage('storeTracks', o.storeTracks);
	this.loadStorageState();
};
RiffShareFlat.prototype.loadStorageState = function () {
	console.log('loadStorageState');
	this.tempo = sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220, 240]);
	this.bgMode = 1 * sureInList(readTextFromlocalStorage('bgMode'), 0, [0, 1, 2]);
	console.log('bgMode', this.bgMode);
	this.storeDrums = sureArray(readObjectFromlocalStorage('storeDrums'), []);
	this.storeTracks = sureArray(readObjectFromlocalStorage('storeTracks'), []);
	this.drumVolumes = [];
	for (var i = 0; i < 8; i++) {
		this.drumVolumes.push(sureNumeric(readObjectFromlocalStorage('drum' + i), 0, 70, 100));
	}
	this.equalizer = [];
	for (var i = 0; i < 10; i++) {
		this.equalizer.push(sureNumeric(readObjectFromlocalStorage('equalizer' + i), -10, 0, 10));
	}
	var flatstate = readObjectFromlocalStorage('flatstate');

	//console.log(flatstate);
	if (flatstate) {
		try {
			/*if(flatstate.svcntr){
			this.svcntr=flatstate.svcntr;
			}else{
			this.svcntr=0;
			}
			this.svcntr++;*/
			if (flatstate.tx) {
				this.translateX = flatstate.tx;
			}
			if (flatstate.ty) {
				this.translateY = flatstate.ty;
			}
			if (flatstate.tz) {
				this.translateZ = flatstate.tz;
			}
			if (flatstate.orders) {
				for (var i = 0; i < 8; i++) {
					var o = sureNumeric(flatstate.orders[i], 0, i, 7);
					riffshareflat.trackInfo[i].order = o;
				}
				flatstate.orders.sort();
				for (var i = 0; i < 8; i++) {
					if (flatstate.orders[i] == i) {
						//
					} else {
						for (var n = 0; n < 8; n++) {
							riffshareflat.trackInfo[n].order = riffshareflat.trackInfo[n].nn;
						}
						break;
					}
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	}
	this.setModeBackground(this.bgMode);
	this.resetAllLayersNow();
};
RiffShareFlat.prototype.saveState = function () {
	this.stopPlay();
	var fullState = {};
	var flatstate = {
		tx: this.translateX,
		ty: this.translateY,
		tz: this.translateZ,
		orders: []
	};
	//this.svcntr++;
	//flatstate.svcntr=this.svcntr;
	for (var i = 0; i < 8; i++) {
		flatstate.orders.push(this.trackInfo[i].order);
	}
	saveObject2localStorage('flatstate', flatstate);
	fullState.flatstate = flatstate;
	saveText2localStorage('tempo', '' + this.tempo);
	fullState.tempo = this.tempo;
	for (var i = 0; i < 8; i++) {
		saveText2localStorage('drum' + i, '' + this.drumVolumes[i]);
		saveText2localStorage('track' + i, '' + this.trackInfo[7 - i].volume);
		fullState['drum' + i] = '' + this.drumVolumes[i];
		fullState['track' + i] = '' + this.trackInfo[7 - i].volume;
	}
	for (var i = 0; i < 10; i++) {
		saveText2localStorage('equalizer' + i, '' + this.equalizer[i]);
		fullState['equalizer' + i] = '' + this.equalizer[i];
	}
	saveObject2localStorage('storeDrums', this.storeDrums);
	fullState.storeDrums = this.storeDrums;
	saveObject2localStorage('storeTracks', this.storeTracks);
	fullState.storeTracks = this.storeTracks;
	console.log('start copy ----------------------------------------------------------------');

	saveString2WebDB('fullState', JSON.stringify(fullState), function () {
		console.log('done saveString2WebDB');
	});
	saveString2IndexedDB('fullState', JSON.stringify(fullState), function () {
		console.log('done saveString2IndexedDB');
	});
	window.onunload = null;
};
RiffShareFlat.prototype.copyDrums = function () {
	var drums = [];
	for (var i = 0; i < this.storeDrums.length; i++) {
		drums.push({
			beat: this.storeDrums[i].beat,
			drum: this.storeDrums[i].drum
		});
	}
	return drums;
};
RiffShareFlat.prototype.copyTones = function () {
	//console.log(this.storeTracks);
	var tones = [];
	for (var i = 0; i < this.storeTracks.length; i++) {
		tones.push({
			beat: this.storeTracks[i].beat,
			pitch: this.storeTracks[i].pitch,
			track: this.storeTracks[i].track,
			shift: this.storeTracks[i].shift,
			length: this.storeTracks[i].length
		});
	}
	return tones;
};
RiffShareFlat.prototype.setupInput = function () {
	this.startMouseScreenX = 0;
	this.startMouseScreenY = 0;
	this.clickX = 0;
	this.clickY = 0;
	this.twoZoom = false;
	this.twodistance = 0;
	this.twocenter = {
		x: 0,
		y: 0
	};
	this.rakeDiv.addEventListener('mousedown', this.rakeMouseDown, false);
	this.rakeDiv.addEventListener("mousewheel", this.rakeMouseWheel, false);
	this.rakeDiv.addEventListener("DOMMouseScroll", this.rakeMouseWheel, false);
	this.rakeDiv.addEventListener("touchstart", this.rakeTouchStart, false);
	this.rakeDiv.addEventListener("touchmove", this.rakeTouchMove, false);
	this.rakeDiv.addEventListener("touchend", this.rakeTouchEnd, false);
	console.log('done setupInput');
};
RiffShareFlat.prototype.rakeMouseWheel = function (e) {
	e.preventDefault();
	var e = window.event || e;
	var wheelVal = e.wheelDelta || -e.detail;
	var min = Math.min(1, wheelVal);
	var delta = Math.max(-1, min);
	var zoom = riffshareflat.translateZ + delta * (riffshareflat.translateZ) * 0.077;
	if (zoom < riffshareflat.minZoom) {
		zoom = riffshareflat.minZoom;
	}
	if (zoom > riffshareflat.maxZoom) {
		zoom = riffshareflat.maxZoom;
	}
	riffshareflat.translateX = riffshareflat.translateX - (riffshareflat.translateZ - zoom) * e.layerX;
	riffshareflat.translateY = riffshareflat.translateY - (riffshareflat.translateZ - zoom) * e.layerY;
	riffshareflat.translateZ = zoom;
	riffshareflat.adjustContentPosition();
	riffshareflat.queueTiles();
	return false;
};
RiffShareFlat.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
	riffshareflat.rakeDiv.addEventListener('mousemove', riffshareflat.rakeMouseMove, true);
	window.addEventListener('mouseup', riffshareflat.rakeMouseUp, false);
	riffshareflat.startMouseScreenX = mouseEvent.clientX;
	riffshareflat.startMouseScreenY = mouseEvent.clientY;
	riffshareflat.clickX = riffshareflat.startMouseScreenX;
	riffshareflat.clickY = riffshareflat.startMouseScreenY;
};
RiffShareFlat.prototype.rakeMouseMove = function (mouseEvent) {
	mouseEvent.preventDefault();
	var dX = mouseEvent.clientX - riffshareflat.startMouseScreenX;
	var dY = mouseEvent.clientY - riffshareflat.startMouseScreenY;
	riffshareflat.translateX = riffshareflat.translateX + dX * riffshareflat.translateZ;
	riffshareflat.translateY = riffshareflat.translateY + dY * riffshareflat.translateZ;
	riffshareflat.startMouseScreenX = mouseEvent.clientX;
	riffshareflat.startMouseScreenY = mouseEvent.clientY;
	riffshareflat.moveZoom();
};
RiffShareFlat.prototype.rakeMouseUp = function (mouseEvent) {
	mouseEvent.preventDefault();
	riffshareflat.rakeDiv.removeEventListener('mousemove', riffshareflat.rakeMouseMove, true);
	if (Math.abs(riffshareflat.clickX - mouseEvent.clientX) < riffshareflat.translateZ * riffshareflat.tapSize / 8 //
		 && Math.abs(riffshareflat.clickY - mouseEvent.clientY) < riffshareflat.translateZ * riffshareflat.tapSize / 8) {
		riffshareflat.click();
	}
	riffshareflat.adjustContentPosition();
	riffshareflat.queueTiles();
};
RiffShareFlat.prototype.startTouchZoom = function (touchEvent) {
	riffshareflat.twoZoom = true;
	var p1 = riffshareflat.vectorFromTouch(touchEvent.touches[0]);
	var p2 = riffshareflat.vectorFromTouch(touchEvent.touches[1]);
	riffshareflat.twocenter = riffshareflat.vectorFindCenter(p1, p2);
	var d = riffshareflat.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	riffshareflat.twodistance = d;
};
RiffShareFlat.prototype.rakeTouchStart = function (touchEvent) {
	touchEvent.preventDefault();
	riffshareflat.startedTouch = true;
	if (touchEvent.touches.length < 2) {
		riffshareflat.twoZoom = false;
		riffshareflat.startMouseScreenX = touchEvent.touches[0].clientX;
		riffshareflat.startMouseScreenY = touchEvent.touches[0].clientY;
		riffshareflat.clickX = riffshareflat.startMouseScreenX;
		riffshareflat.clickY = riffshareflat.startMouseScreenY;
		riffshareflat.twodistance = 0;
		return;
	} else {
		riffshareflat.startTouchZoom(touchEvent);
	}
};
RiffShareFlat.prototype.rakeTouchMove = function (touchEvent) {
	touchEvent.preventDefault();
	if (touchEvent.touches.length < 2) {
		if (riffshareflat.twoZoom) {
			//
		} else {
			var dX = touchEvent.touches[0].clientX - riffshareflat.startMouseScreenX;
			var dY = touchEvent.touches[0].clientY - riffshareflat.startMouseScreenY;
			riffshareflat.translateX = riffshareflat.translateX + dX * riffshareflat.translateZ;
			riffshareflat.translateY = riffshareflat.translateY + dY * riffshareflat.translateZ;
			riffshareflat.startMouseScreenX = touchEvent.touches[0].clientX;
			riffshareflat.startMouseScreenY = touchEvent.touches[0].clientY;
			riffshareflat.moveZoom();
			return;
		}
	} else {
		if (!riffshareflat.twoZoom) {
			riffshareflat.startTouchZoom(touchEvent);
		} else {
			var p1 = riffshareflat.vectorFromTouch(touchEvent.touches[0]);
			var p2 = riffshareflat.vectorFromTouch(touchEvent.touches[1]);
			var d = riffshareflat.vectorDistance(p1, p2);
			if (d <= 0) {
				d = 1;
			}
			var ratio = d / riffshareflat.twodistance;
			riffshareflat.twodistance = d;
			var zoom = riffshareflat.translateZ / ratio;
			if (zoom < riffshareflat.minZoom) {
				zoom = riffshareflat.minZoom;
			}
			if (zoom > riffshareflat.maxZoom) {
				zoom = riffshareflat.maxZoom;
			}
			riffshareflat.translateX = riffshareflat.translateX - (riffshareflat.translateZ - zoom) * riffshareflat.twocenter.x;
			riffshareflat.translateY = riffshareflat.translateY - (riffshareflat.translateZ - zoom) * riffshareflat.twocenter.y;
			riffshareflat.translateZ = zoom;
			riffshareflat.adjustContentPosition();
		}
	}
};

RiffShareFlat.prototype.rakeTouchEnd = function (touchEvent) {
	touchEvent.preventDefault();
	riffshareflat.queueTiles();
	if (!riffshareflat.twoZoom) {
		if (touchEvent.touches.length < 2) {
			if (riffshareflat.startedTouch) {
				if (Math.abs(riffshareflat.clickX - riffshareflat.startMouseScreenX) < riffshareflat.translateZ * riffshareflat.tapSize / 8 //
					 && Math.abs(riffshareflat.clickY - riffshareflat.startMouseScreenY) < riffshareflat.translateZ * riffshareflat.tapSize / 8) {
					riffshareflat.click();
				}
			} else {
				//console.log('touch ended already');
			}
			riffshareflat.adjustContentPosition();
			return;
		}
	}
	riffshareflat.twoZoom = false;
	riffshareflat.startedTouch = false;
	riffshareflat.adjustContentPosition();
};
RiffShareFlat.prototype.click = function () {
	var xy = this.unzoom(this.clickX, this.clickY, this.translateZ);
	this.clickContentX = xy.x;
	this.clickContentY = xy.y;
	this.runSpots(this.clickContentX, this.clickContentY);
};
RiffShareFlat.prototype.vectorDistance = function (xy1, xy2) {
	var xy = this.vectorSubstract(xy1, xy2);
	var n = this.vectorNorm(xy);
	return n;
};
RiffShareFlat.prototype.vectorSubstract = function (xy1, xy2) {
	return {
		x: xy1.x - xy2.x,
		y: xy1.y - xy2.y
	};
};
RiffShareFlat.prototype.vectorNorm = function (xy) {
	return Math.sqrt(this.vectorNormSquared(xy));
};
RiffShareFlat.prototype.vectorNormSquared = function (xy) {
	return xy.x * xy.x + xy.y * xy.y;
};
RiffShareFlat.prototype.vectorFromTouch = function (touch) {
	return {
		x: touch.clientX,
		y: touch.clientY
	};
};
RiffShareFlat.prototype.vectorFindCenter = function (xy1, xy2) {
	var xy = this.vectorAdd(xy1, xy2);
	return this.vectorScale(xy, 0.5);
};
RiffShareFlat.prototype.vectorAdd = function (xy1, xy2) {
	return {
		x: xy1.x + xy2.x,
		y: xy1.y + xy2.y
	};
};
RiffShareFlat.prototype.vectorScale = function (xy, coef) {
	return {
		x: xy.x * coef,
		y: xy.y * coef
	};
};
RiffShareFlat.prototype.unzoom = function (x, y, z) {
	var xy = {
		x: x * z - this.translateX,
		y: y * z - this.translateY
	};
	if (this.contentDiv.clientWidth * z > this.innerWidth) {
		xy.x = x * z - ((this.contentDiv.clientWidth * z - this.innerWidth) / 2);
	}
	if (this.contentDiv.clientHeight * z > this.innerHeight) {
		xy.y = y * z - ((this.contentDiv.clientHeight * z - this.innerHeight) / 2);
	}
	xy.x = Math.round(xy.x);
	xy.y = Math.round(xy.y);
	return xy;
};
RiffShareFlat.prototype.addSpot = function (id, x, y, w, h, a, stickX, toZoom) {
	this.dropSpot(id);
	var spot = {
		id: id,
		x: x,
		y: y,
		w: w,
		h: h,
		a: a,
		sx: stickX,
		tz: toZoom
	};
	this.spots.push(spot);
	return spot;
};
RiffShareFlat.prototype.runSpots = function (x, y) {
	var needRedraw = false;
	for (var i = this.spots.length - 1; i >= 0; i--) {
		var spot = this.spots[i];
		var checkX = spot.x;
		var checkY = spot.y;
		if (spot.sx) {
			checkX = spot.x + this.stickedX;
		}
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			if (spot.a) {
				spot.a();
			}
			if (spot.tz < this.translateZ && spot.tz > 0) {
				var tox = -checkX;
				if (spot.sx) {
					if (-tox > spot.x) {
						tox = this.translateX;
					} else {
						tox = -spot.x;
					}
				}
				this.startSlideTo(tox, -checkY, spot.tz);
			} else {
				needRedraw = true;
			}
			break;
		}
	}
	if (needRedraw) {
		this.resetAllLayersNow();
	}
};
RiffShareFlat.prototype.startSlideTo = function (x, y, z) {
	var stepCount = 20;
	var dx = (x - this.translateX) / stepCount;
	var dy = (y - this.translateY) / stepCount;
	var dz = (z - this.translateZ) / stepCount;
	var xyz = [];
	for (var i = 0; i < stepCount; i++) {
		xyz.push({
			x: this.translateX + dx * i,
			y: this.translateY + dy * i,
			z: this.translateZ + dz * i
		});
	}
	xyz.push({
		x: x,
		y: y,
		z: z
	});
	this.stepSlideTo(xyz);
};
RiffShareFlat.prototype.stepSlideTo = function (xyz) {
	var n = xyz.shift();
	if (n) {
		this.translateX = n.x;
		this.translateY = n.y;
		this.translateZ = n.z;
		this.adjustContentPosition();
		setTimeout(function () {
			riffshareflat.stepSlideTo(xyz);
		}, 20);
	} else {
		this.resetAllLayersNow();
	}
};
RiffShareFlat.prototype.adjustContentPosition = function () {
	if (this.contentDiv.clientWidth * this.translateZ < this.innerWidth) {
		if (this.translateX < this.contentDiv.clientWidth * this.translateZ - this.innerWidth) {
			this.translateX = this.contentDiv.clientWidth * this.translateZ - this.innerWidth;
		}
		if (this.translateX > 0) {
			this.translateX = 0;
		}
	} else {
		this.translateX = (this.contentDiv.clientWidth * this.translateZ - this.innerWidth) / 2;
	}
	if (this.contentDiv.clientHeight * this.translateZ < this.innerHeight) {
		if (this.translateY < this.contentDiv.clientHeight * this.translateZ - this.innerHeight) {
			this.translateY = this.contentDiv.clientHeight * this.translateZ - this.innerHeight;
		}
		if (this.translateY > 0) {
			this.translateY = 0;
		}
	} else {
		this.translateY = (this.contentDiv.clientHeight * this.translateZ - this.innerHeight) / 2;
	}
	this.moveZoom();
};
RiffShareFlat.prototype.moveZoom = function () {
	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.contentDiv.clientWidth * this.translateZ;
	var h = this.contentDiv.clientHeight * this.translateZ;
	if (w > 1) {
		//
	} else {
		w = 1;
	}
	if (h > 1) {
		//
	} else {
		h = 1;
	}
	this.contentSVG.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reLayoutVertical();
	//this.reLayoutBackGroundImge();
};
RiffShareFlat.prototype.reLayoutVertical = function () {
	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.contentDiv.clientWidth;
	var rightBottomY = this.contentDiv.clientHeight;
	if (this.contentDiv.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.contentDiv.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.contentDiv.clientWidth - leftTopX;
	}
	if (this.contentDiv.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.contentDiv.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.contentDiv.clientHeight - leftTopY;
	}
	var lt = this.unzoom(leftTopX, leftTopY, this.translateZ);
	var xx = lt.x;

	var x = this.marginLeft * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	var dx = 45 * this.tapSize + x + h / 2;
	var dx = x;
	var shift = xx - dx;
	if (xx < dx) {
		shift = 0;
	}
	this.stickedX = shift;
};
RiffShareFlat.prototype.__reLayoutBackGroundImge = function () {
	//var zdiff=this.maxZoom-this.minZoom;

	var rw = this.contentDiv.clientWidth / this.bgImageWidth;
	var rh = this.contentDiv.clientHeight / this.bgImageHeight;

	var rz = rw;
	if (rw < rh) {
		rz = rh;
	}
	//3-1
	//20-
	var r = (1 + 0.5 * (this.maxZoom - this.translateZ) / (this.maxZoom - this.minZoom));
	rz = rz * r;
	x = -this.translateX / r;
	if (this.translateX > 0) {
		x = -this.translateX;
	}
	y = -this.translateY / r;
	if (this.translateY > 0) {
		y = -this.translateY;
	}
	var z = rz * this.translateZ;
	console.log(-this.translateX, x);
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z + ')';
	this.bgImage.setAttribute('transform', transformAttr);
}
RiffShareFlat.prototype._reLayoutBackGroundImge = function () {
	var rz = 1;

	var w = this.innerWidth;
	var h = this.innerHeight;

	//var rw =
	console.log(w, this.bgImageWidth * this.translateZ);

	var maxTranslX = w - this.contentDiv.clientWidth * this.translateZ;
	var maxTranslY = h - this.contentDiv.clientHeight * this.translateZ;
	var maxImgX = w - this.bgImageWidth * rz * this.translateZ;
	var maxImgY = h - this.bgImageHeight * rz * this.translateZ;
	var x = x = -maxImgX * this.translateX / maxTranslX;
	var y = y = -maxImgY * this.translateY / maxTranslY;
	if (maxTranslX == 0) {
		x = 0;
	}
	if (maxTranslY == 0) {
		y = 0;
	}
	x = -this.translateX;
	y = -this.translateY;
	/*
	if (w < this.contentDiv.clientWidth * this.translateZ) {
	x = -this.translateX;
	} else {
	if (this.translateX > 0) {
	x = -this.translateX;
	} else {
	if (-this.translateX > maxTranslX) {
	x = maxImgX - maxTranslX - this.translateX;
	}
	}
	}
	if (h < this.contentDiv.clientHeight * this.translateZ) {
	y = -this.translateY;
	} else {
	if (this.translateY > 0) {
	y = -this.translateY;
	} else {
	if (-this.translateY > maxTranslY) {
	y = maxImgY - maxTranslY - this.translateY;
	}
	}
	}*/
	var z = rz * this.translateZ;
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z * rz + ')';
	//console.log(transformAttr);
	this.bgImage.setAttribute('transform', transformAttr);
};
RiffShareFlat.prototype.resetAllLayersNow = function () {
	this.clearLayerChildren([this.contentGroup]);
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
};
RiffShareFlat.prototype.queueTiles = function () {
	//console.log('queueTiles', this.timeOutID);
	if (this.timeOutID > 0) {
		return;
	}
	this.timeOutID = setTimeout(function () {
			riffshareflat.timeOutID = 0;
			riffshareflat.resetTiles();
		}, 100);
};
RiffShareFlat.prototype.resetTiles = function () {
	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.contentDiv.clientWidth;
	var rightBottomY = this.contentDiv.clientHeight;
	if (this.contentDiv.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.contentDiv.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.contentDiv.clientWidth - leftTopX;
	}
	if (this.contentDiv.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.contentDiv.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.contentDiv.clientHeight - leftTopY;
	}
	var lt = this.unzoom(leftTopX, leftTopY, this.translateZ);
	var rb = this.unzoom(rightBottomX, rightBottomY, this.translateZ);
	var xx = lt.x;
	var yy = lt.y;
	var ww = rb.x - lt.x;
	var hh = rb.y - lt.y;
	//console.log(xx, yy, ww, hh);
	this.addContent(xx, yy, ww, hh);
	this.reLayoutVertical();
};
RiffShareFlat.prototype.addContent = function (x, y, w, h) {
	//this.clearLayers([this.gridLayer]);
	//this.clearSpots();
	this.clearUselessDetails(x, y, w, h, this.contentGroup);
	this.addSmallTiles(x, y, w, h);
};
RiffShareFlat.prototype.startPlay = function () {
	if (this.onAir) {
		console.log('on air already');
		return;
	}
	console.log('startPlay');
	//var N = 4 * 60 / this.tempo;
	//var beatLen = 1 / 16 * N;
	//this.queueAhead=beatLen;
	//console.log('queueAhead', this.queueAhead);
	//console.log(this.trackInfo);
	//console.log(this.drumInfo);
	this.onAir = true;
	this.resetNodeValues();
	/*var N = 4 * 60 / this.tempo;
	var beatLen = 1 / 16 * N;
	var pieceLen = this.cauntMeasures() * N;
	var when=this.audioContext.currentTime;
	this.sendNextPiece(when);
	this.queueNextPiece(pieceLen/2,when+pieceLen);*/
	//this.tickID = 0;
	//this.queueNextPiece(this.audioContext.currentTime, 0);
	this.nextBeat = 0;
	this.nextWhen = 0;
	this.queueNextBeats();
	//this.tickID
	//this.onAir
};
//sendNextBeats
RiffShareFlat.prototype.queueNextBeats = function () {
	//console.log('queueNextBeats', this.nextWhen,this.audioContext.currentTime);
	if (this.onAir) {
		var beat16duration = (4 * 60 / this.tempo) / 16;
		var pieceLen16 = 16 * riffshareflat.cauntMeasures();
		var t = this.audioContext.currentTime;
		if (this.nextWhen < t) {
			this.nextWhen = t;
		}
		//while (this.sentWhen < t + this.queueAhead) {
		while (this.sentWhen < t + beat16duration) {
			this.sendNextBeats(this.nextWhen, this.nextBeat, this.nextBeat);
			this.nextWhen = this.sentWhen + beat16duration;
			this.nextBeat = this.nextBeat + 1;
			if (this.nextBeat >= pieceLen16) {
				this.nextBeat = 0;
			}
		}
		//console.log('	envelopes', this.player.envelopes.length);
		var wait = 0.5 * 1000 * (this.nextWhen - t); //this.audioContext.currentTime);
		//if (this.echoOn) {
		this.tickerStep++;
		if (this.tickerStep >= this.tickerDelay) {
			this.moveBeatCounter();
			this.tickerStep = 0;
		}
		//}
		this.tickID = setTimeout(function () {
				riffshareflat.queueNextBeats();
			}, wait);
	}
}
RiffShareFlat.prototype.moveBeatCounter = function () {
	if (this.onAir) {
		if (this.counterLine) {
			//console.log('moveBeatCounter');
			var N = 4 * 60 / this.tempo;
			var beatLen = 1 / 16 * N;
			var c16 = 16 * this.cauntMeasures();
			var diff = this.nextBeat + (this.audioContext.currentTime - this.nextWhen) / beatLen;
			while (diff < 0) {
				diff = diff + c16;
			}
			var x = diff * this.tapSize;
			var transformAttr = ' translate(' + x + ',0)';
			this.counterLine.setAttribute('transform', transformAttr);
		}
	}
};

RiffShareFlat.prototype.stopPlay = function () {
	this.onAir = false;
	clearTimeout(this.tickID);
	this.player.cancelQueue(this.audioContext);
	this.resetAllLayersNow();
};
RiffShareFlat.prototype.resetNodeValues = function () {
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].audioNode.gain.setValueAtTime(this.trackInfo[i].volume / 100, 0);
		this.drumInfo[i].audioNode.gain.setValueAtTime(this.drumVolumes[i] / 100, 0);
	}
	this.master.band32.gain.setValueAtTime(this.equalizer[0], 0);
	this.master.band64.gain.setValueAtTime(this.equalizer[1], 0);
	this.master.band128.gain.setValueAtTime(this.equalizer[2], 0);
	this.master.band256.gain.setValueAtTime(this.equalizer[3], 0);
	this.master.band512.gain.setValueAtTime(this.equalizer[4], 0);
	this.master.band1k.gain.setValueAtTime(this.equalizer[5], 0);
	this.master.band2k.gain.setValueAtTime(this.equalizer[6], 0);
	this.master.band4k.gain.setValueAtTime(this.equalizer[7], 0);
	this.master.band8k.gain.setValueAtTime(this.equalizer[8], 0);
	this.master.band16k.gain.setValueAtTime(this.equalizer[9], 0);
	//this.master.output.gain.value = 0.1;
};
RiffShareFlat.prototype.cauntMeasures = function () {
	var mx = 0;
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (mx < this.storeDrums[i].beat) {
			mx = this.storeDrums[i].beat;
		}
	}
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (mx < this.storeTracks[i].beat) {
			mx = this.storeTracks[i].beat;
		}
	}
	var le = Math.ceil((mx + 1) / 16);
	if (le > 16) {
		le = 16;
	}
	return le;
}
RiffShareFlat.prototype.cauntDrumMeasures = function () {
	var mx = 0;
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (mx < this.storeDrums[i].beat) {
			mx = this.storeDrums[i].beat;
		}
	}
	var le = Math.ceil((mx + 1) / 16);
	if (le > 16) {
		le = 16;
	}
	return le;
}
RiffShareFlat.prototype.cauntToneMeasures = function (nn) {
	var mx = 0;
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (mx < this.storeTracks[i].beat && nn == this.storeTracks[i].track) {
			mx = this.storeTracks[i].beat;
		}
	}
	var le = Math.ceil((mx + 1) / 16);
	if (le > 16) {
		le = 16;
	}
	return le;
}
RiffShareFlat.prototype.sendNextBeats = function (when, startBeat, endBeat) {
	//console.log('sendNextBeats',  startBeat,'at',when,'count', this.player.envelopes.length);
	this.sentWhen = when;
	this.sentBeat = startBeat;
	var N = 4 * 60 / this.tempo;
	var beatLen = 1 / 16 * N;
	for (var i = 0; i < this.storeDrums.length; i++) {
		var hit = this.storeDrums[i];
		if (hit.beat >= startBeat && hit.beat <= endBeat) {
			var channel = this.drumInfo[hit.drum];
			var zones = channel.sound;
			if (channel.info) {
				zones = window[channel.info.variable];
				//console.log(channel.sound,channel.info,channel.info.variable,zones);
			}
			var r = 1.0 - Math.random() * 0.2;
			//this.player.queueWaveTable(this.audioContext, channel.audioNode, channel.sound, when + beatLen * (hit.beat - startBeat), channel.pitch, channel.length, r * channel.volumeRatio);
			this.player.queueWaveTable(this.audioContext, channel.audioNode, zones, when + beatLen * (hit.beat - startBeat), channel.pitch, channel.length, r * channel.volumeRatio);
		}
	}
	var notes = [];
	for (var i = 0; i < this.storeTracks.length; i++) {
		var note = this.storeTracks[i];
		if (note.beat >= startBeat && note.beat <= endBeat) {
			notes.push(note);
		}
	}
	notes.sort(function (n1, n2) {
		var r = 1000 * (n1.beat - n2.beat) + 100000 * (n1.track - n2.track);
		if (n1.beat == n2.beat) {
			r = r + (n1.pitch - n2.pitch);
		}
		return r;
	});
	var currentBeat = -1;
	var currentTrack = -1;
	var inChordCount = 0;
	for (var i = 0; i < notes.length; i++) {
		var note = notes[i];
		if (note.beat != currentBeat || note.track != currentTrack) {
			currentBeat = note.beat;
			currentTrack = note.track;
			inChordCount = 0;
		}
		var channel = this.trackInfo[7 - note.track];
		var zones = channel.sound;
		if (channel.info) {
			zones = window[channel.info.variable];
			//console.log(channel.sound,channel.info,channel.info.variable,zones);
		}
		var shift = [{
				when: note.length * beatLen,
				pitch: note.shift + channel.octave * 12 + note.pitch
			}
		];
		var r = 0.6 - Math.random() * 0.2;
		//this.player.queueWaveTable(this.audioContext, channel.audioNode, channel.sound, when + beatLen * (note.beat - startBeat) + inChordCount * channel.inChordDelay, channel.octave * 12 + note.pitch, 0.075 + note.length * beatLen, r * channel.volumeRatio, shift);
		this.player.queueWaveTable(this.audioContext, channel.audioNode, zones, when + beatLen * (note.beat - startBeat) + inChordCount * channel.inChordDelay, channel.octave * 12 + note.pitch, 0.075 + note.length * beatLen, r * channel.volumeRatio, shift);
		inChordCount++;
	}
};

RiffShareFlat.prototype.addSmallTiles = function (left, top, width, height) {
	var x = 0;
	var y = 0;
	var w = this.innerWidth;
	var h = this.innerHeight;
	var g = this.rakeGroup(x, y, w, h, 'grdlin', this.paneGroup, left, top, width, height);
	var me = this;
	if (g) {
		//this.tileRectangle(g, 0, 0, this.innerWidth, this.innerHeight, 'rgba(0,0,0,0.8)');
		//this.tileText(g, x - this.tapSize * 0.5, y + this.tapSize * 4, this.tapSize * 7, 'RiffShare', '#333');

		this.tileCircle(g, 6 * this.tapSize, 6 * this.tapSize, 5 * this.tapSize, modeDrumShadow(this.bgMode));
		var startLabel = 'Play';
		if (this.onAir) {
			startLabel = 'Stop';
		}
		this.tileText(g, 4 * this.tapSize, y + this.tapSize * 9, this.tapSize * 10, startLabel, modeDrumColor(this.bgMode));
		this.addSpot('plybt', 0, 1 * this.tapSize, this.marginLeft * this.tapSize, this.tapSize * 10, function () {
			if (riffshareflat.onAir) {
				riffshareflat.stopPlay();
			} else {
				//saveString2IndexedDB('testing','123');
				riffshareflat.startPlay();
			}

		});
		/*
		this.tileCircle(g, 1.5 * this.tapSize, (9 + 1.5 * 1) * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * (9.3 + 1.5 * 1), this.tapSize * 0.9, 'Save & Share', '#fff');
		this.addSpot('svsh', 1 * this.tapSize, (8.5 + 1.5 * 1) * this.tapSize, (this.marginLeft - 2) * this.tapSize, this.tapSize, function () {
		window.open('export.html', '_self')
		});*/
		this.tileCircle(g, 11 * this.tapSize, 13 * this.tapSize, 1 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, 10.75 * this.tapSize, 13.75 * this.tapSize, 2.5 * this.tapSize, 'Share riff', modeDrumColor(this.bgMode));
		//this.tileText(g, 10.75 * this.tapSize, 13.75 *this.tapSize , 2.5 * this.tapSize, 'Share '+this.svcntr, modeDrumColor(this.bgMode));
		this.addSpot('shareriff', 10 * this.tapSize, 12 * this.tapSize, 7 * this.tapSize, this.tapSize * 2, function () {
			riffshareflat.saveState();
			var encoded = encodeState();
			/*
			var url = "https://surikov.github.io/RiffShareAndroid/app/src/main/assets/load.html?riff=" + encoded;
			var tiny = 'https://tinyurl.com/create.php?url=' + url;
			window.open(tiny, '_self')
			 */
			var top = 0;
			for (var i = 0; i < me.trackInfo.length; i++) {
				if (me.trackInfo[i].order == 0) {
					top = i;
					break;
				}
			}
			var url = "http://molgav.nn.ru/share.php?top=" + top + "&mode=" + me.bgMode + "&riff=" + encoded;
			window.open(url, '_self')
			//console.log(me.trackInfo,url);
		});

		this.tileCircle(g, 4 * this.tapSize, 15 * this.tapSize, 3 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, 3 * this.tapSize, y + this.tapSize * 17, 7 * this.tapSize, 'File', modeDrumColor(this.bgMode));
		this.addSpot('flop', 0, 12 * this.tapSize, 10 * this.tapSize, this.tapSize * 6, function () {
			window.open('file.html', '_self')
		});
		this.tileCircle(g, 3 * this.tapSize, 21 * this.tapSize, 2 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 22, 4 * this.tapSize, 'Clear all', modeDrumColor(this.bgMode));
		this.addSpot('clrsng', 0, 19 * this.tapSize, this.marginLeft * this.tapSize, 4 * this.tapSize, function () {
			riffshareflat.userActionClearAll();
		});

		this.tileCircle(g, 7 * this.tapSize, 52 * this.tapSize, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileText(g, 7 * this.tapSize, y + this.tapSize * 52.3, this.tapSize * 1.0, 'Swap with ' + this.findTrackInfo(1).title, this.findTrackInfo(1).color);
		this.addSpot('swp', 6.5 * this.tapSize, 51.5 * this.tapSize, (this.marginLeft - 7.5) * this.tapSize, this.tapSize, function () {
			//console.log(riffshareflat.findTrackInfo(0).title,'<->',riffshareflat.findTrackInfo(1).title);
			riffshareflat.userActionSwap(); //riffshareflat.findTrackInfo(0).nn,riffshareflat.findTrackInfo(1).nn);
		});
		this.tileCircle(g, 1.5 * this.tapSize, 52 * this.tapSize, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileCircle(g, 2.5 * this.tapSize, 52 * this.tapSize, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileCircle(g, 3.5 * this.tapSize, 52 * this.tapSize, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileText(g, 4.1 * this.tapSize, y + this.tapSize * 52.3, this.tapSize * 1.0, 'Clear', this.findTrackInfo(0).color);

		this.tileLine(g, 1.5 * this.tapSize, 52 * this.tapSize - 0.35 * this.tapSize, 1.5 * this.tapSize - 0.3 * this.tapSize, 52 * this.tapSize - 0.05 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 1.5 * this.tapSize, 52 * this.tapSize - 0.35 * this.tapSize, 1.5 * this.tapSize + 0.3 * this.tapSize, 52 * this.tapSize - 0.05 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 1.5 * this.tapSize, 52 * this.tapSize - 0.15 * this.tapSize, 1.5 * this.tapSize - 0.3 * this.tapSize, 52 * this.tapSize + 0.15 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 1.5 * this.tapSize, 52 * this.tapSize - 0.15 * this.tapSize, 1.5 * this.tapSize + 0.3 * this.tapSize, 52 * this.tapSize + 0.15 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);

		this.tileLine(g, 2.5 * this.tapSize, 52 * this.tapSize + 0.35 * this.tapSize, 2.5 * this.tapSize - 0.3 * this.tapSize, 52 * this.tapSize + 0.05 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 2.5 * this.tapSize, 52 * this.tapSize + 0.35 * this.tapSize, 2.5 * this.tapSize + 0.3 * this.tapSize, 52 * this.tapSize + 0.05 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 2.5 * this.tapSize, 52 * this.tapSize + 0.15 * this.tapSize, 2.5 * this.tapSize - 0.3 * this.tapSize, 52 * this.tapSize - 0.15 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 2.5 * this.tapSize, 52 * this.tapSize + 0.15 * this.tapSize, 2.5 * this.tapSize + 0.3 * this.tapSize, 52 * this.tapSize - 0.15 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);

		//this.tileLine(g, 2.5 * this.tapSize, 52 * this.tapSize + 0.3 * this.tapSize, 2.5 * this.tapSize - 0.3 * this.tapSize, 52 * this.tapSize - 0.1 * this.tapSize, '#000', 0.1 * this.tapSize);
		//this.tileLine(g, 2.5 * this.tapSize, 52 * this.tapSize + 0.3 * this.tapSize, 2.5 * this.tapSize + 0.3 * this.tapSize, 52 * this.tapSize - 0.1 * this.tapSize, '#000', 0.1 * this.tapSize);

		this.tileLine(g, 3.5 * this.tapSize - 0.2 * this.tapSize, 52 * this.tapSize - 0.2 * this.tapSize, 3.5 * this.tapSize + 0.2 * this.tapSize, 52 * this.tapSize + 0.2 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, 3.5 * this.tapSize + 0.2 * this.tapSize, 52 * this.tapSize - 0.2 * this.tapSize, 3.5 * this.tapSize - 0.2 * this.tapSize, 52 * this.tapSize + 0.2 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.addSpot('octup', 1 * this.tapSize, 51.5 * this.tapSize, this.tapSize, this.tapSize, function () {
			riffshareflat.userUpInstrument();
		});
		this.addSpot('octdwn', 2 * this.tapSize, 51.5 * this.tapSize, this.tapSize, this.tapSize, function () {
			riffshareflat.userDownInstrument();
		});
		this.addSpot('clrtrak', 3 * this.tapSize, 51.5 * this.tapSize, this.tapSize, this.tapSize, function () {
			riffshareflat.userClearInstrument();
		});
		/*this.tileCircle(g, 7 * this.tapSize, 51.5 * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 8 * this.tapSize, y + this.tapSize * 51.8, this.tapSize * 0.9, 'Transpose down', this.findTrackInfo(0).color);
		this.addSpot('trdwn', 6.5 * this.tapSize, 51 * this.tapSize, (this.marginLeft - 2) * this.tapSize, this.tapSize, function () {
		console.log('trdwn');
		});
		this.tileCircle(g, 7 * this.tapSize, 50.5 * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 8 * this.tapSize, y + this.tapSize * 50.8, this.tapSize * 0.9, 'Transpose up', this.findTrackInfo(0).color);
		this.addSpot('trupp', 6.5 * this.tapSize, 50 * this.tapSize, (this.marginLeft - 2) * this.tapSize, this.tapSize, function () {
		console.log('trupp');
		});*/

		var in16 = riffshareflat.cauntToneMeasures(this.findTrackInfo(0).nn);

		var stopX = (16 * in16 + this.marginLeft + 0.5) * this.tapSize;
		//console.log('len',riffshareflat.cauntMeasures());
		this.tileCircle(g, stopX, 0.5 * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, stopX - 0.25 * this.tapSize, 0.75 * this.tapSize, this.tapSize * 1.0, 'Repeat ' + this.findTrackInfo(0).title, this.findTrackInfo(0).color);
		this.addSpot('rptins', stopX - 0.5 * this.tapSize, 0, this.tapSize, this.tapSize, function () {
			riffshareflat.userRepeatInstrument();
		});
		var dr16 = riffshareflat.cauntDrumMeasures();
		stopX = (16 * dr16 + this.marginLeft + 0.5) * this.tapSize;
		this.tileCircle(g, stopX, (12 * 5 + 8 + 1.5) * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, stopX - 0.25 * this.tapSize, (12 * 5 + 8 + 1.75) * this.tapSize, this.tapSize * 1.0, 'Repeat Drums', modeDrumColor(this.bgMode));
		this.addSpot('rptdrms', stopX - 0.5 * this.tapSize, (12 * 5 + 8 + 1) * this.tapSize, this.tapSize, this.tapSize, function () {
			//console.log('rptdrms');
			riffshareflat.userRepeatDrums();
		});
		this.tileCircle(g, (this.marginLeft + 0.5) * this.tapSize, (12 * 5 + 8 + 1.5) * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, (this.marginLeft + 0.5) * this.tapSize, (12 * 5 + 8 + 1.75) * this.tapSize, this.tapSize * 1.0, 'Clear Drums', modeDrumColor(this.bgMode));
		this.addSpot('clrdrms', (this.marginLeft) * this.tapSize, (12 * 5 + 8 + 1) * this.tapSize, this.tapSize, this.tapSize, function () {
			riffshareflat.userClearDrum();
		});

		for (var i = 0; i < in16; i++) {
			var tx = (16 * i + this.marginLeft + 0.5) * this.tapSize;
			var ty = 0.5 * this.tapSize;
			this.tileCircle(g, tx, ty, 0.5 * this.tapSize, this.findTrackInfo(0).color);
			this.tileLine(g, tx, ty - 0.3 * this.tapSize, tx - 0.3 * this.tapSize, ty + 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
			this.tileLine(g, tx, ty - 0.3 * this.tapSize, tx + 0.3 * this.tapSize, ty + 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
			var s = this.addSpot('supins' + i, tx - 0.5 * this.tapSize, 0, this.tapSize, this.tapSize, function () {
					//console.log('up' + this.i);
					riffshareflat.userUpMeasure(this.i);
				});
			s.i = i;
			this.tileCircle(g, tx + this.tapSize, ty, 0.5 * this.tapSize, this.findTrackInfo(0).color);
			this.tileLine(g, tx + this.tapSize, ty + 0.3 * this.tapSize, tx + 0.7 * this.tapSize, ty - 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
			this.tileLine(g, tx + this.tapSize, ty + 0.3 * this.tapSize, tx + 1.3 * this.tapSize, ty - 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
			s = this.addSpot('sdwnins' + i, tx + 0.5 * this.tapSize, 0, this.tapSize, this.tapSize, function () {
					//console.log('down' + this.i);
					riffshareflat.userDownMeasure(this.i);
				});
			s.i = i;
		}

	}

	//this.tileFrets(left, top, width, height);
	this.tileEqualizer(left, top, width, height);
	this.tileDrumVolumes(left, top, width, height);
	this.tileToneVolumes(left, top, width, height);
	this.tileTempo(left, top, width, height);
	this.tileColorMode(left, top, width, height);
	this.tilePianoLines(left, top, width, height);
	this.tileCounter(left, top, width, height);

	try {
		this.tileDrums(left, top, width, height);
	} catch (e) {
		console.log(e);
	}
	try {
		this.tileTones(left, top, width, height);
	} catch (e) {
		console.log(e);
	}
};
RiffShareFlat.prototype.tileDrumMeasure = function (n, left, top, width, height) {
	var x = this.tapSize * (this.marginLeft + n * 16);
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 16;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drms' + n, this.drumGroup, left, top, width, height);
	if (g) {
		var track = this.findTrackInfo(0);
		this.tileText(g, x + this.tapSize * 13, y + this.tapSize * 2.5, this.tapSize * 3, '' + (n + 1), track.color);
		for (var i = 0; i < 8; i++) {
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 0 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.05)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 0 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.10)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 1 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.15)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 1 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.20)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 2 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.25)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 2 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.30)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 3 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.35)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 3 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.40)');
		}
		/*for (var i = 0; i < 8; i++) {
		for (var k = 0; k < 4; k++) {
		this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + k * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.55)');
		this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + k * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(127,127,127,0.55)');
		}
		}*/
		for (var i = 0; i < this.storeDrums.length; i++) {
			if (this.storeDrums[i].beat >= n * 16 && this.storeDrums[i].beat < (n + 1) * 16) {
				var xx = x + this.tapSize * (0.5 + this.storeDrums[i].beat - n * 16);
				var yy = y + this.tapSize * (0.5 + this.storeDrums[i].drum);
				this.tileLine(g, xx, yy, 1 + xx, yy, modeDrumColor(this.bgMode), this.tapSize);
			}
		}
	}
};
RiffShareFlat.prototype.existsDrum = function (beat, drum) {
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (this.storeDrums[i].beat == beat && this.storeDrums[i].drum == drum) {
			return true;
		}
	}
	return false;
}
RiffShareFlat.prototype.dropDrum = function (beat, drum) {
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (this.storeDrums[i].beat == beat && this.storeDrums[i].drum == drum) {
			this.storeDrums.splice(i, 1);
			break;
		}
	}
}
RiffShareFlat.prototype.setDrum = function (beat, drum) {
	this.dropDrum(beat, drum);
	this.storeDrums.push({
		beat: beat,
		drum: drum
	});
}
RiffShareFlat.prototype.tilePianoLines = function (left, top, width, height) {
	var x = this.tapSize * this.marginLeft;
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16 * 17;
	var h = this.tapSize * 12 * 5;
	var g = this.rakeGroup(x, y, w, h, 'pnlins', this.linesGroup, left, top, width, height);
	if (g) {
		if (this.bgMode == 2) {
			for (var i = 0; i < 5; i++) {
				this.tileRectangle(g, x, y + this.tapSize * (10 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (8 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (7 + i * 12), w, this.tapSize * 0.05, 'rgba(0,0,0,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (5 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (3 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (1 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (0 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (2 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (4 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (6 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (7 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (9 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
				//this.tileRectangle(g, x, y + this.tapSize * (11 + i * 12), w, this.tapSize * 0.9, 'rgba(0,0,0,0.05)');
			}
		} else {
			for (var i = 0; i < 5; i++) {
				this.tileRectangle(g, x, y + this.tapSize * (0 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (2 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (4 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (6 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (7 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (9 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
				this.tileRectangle(g, x, y + this.tapSize * (11 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.05)');
			}
		}

		//for (var i = 0; i < 5; i++) {
		//for (var k = 0; k < 16 * 16; k++) {
		//this.tileText(g, x + this.tapSize * k*16, y + this.tapSize * (i*12+11+0.75), 1.4*this.tapSize, 'C' + (5-i) , '#000');
		/*this.tileText(g, x + this.tapSize * (0.2+k*16), y + this.tapSize * (i*12+11+0.75-2), 1.4*this.tapSize, 'D' , '#000');
		this.tileText(g, x + this.tapSize * (0.2+k*16), y + this.tapSize * (i*12+11+0.75-4), 1.4*this.tapSize, 'E' , '#000');
		this.tileText(g, x + this.tapSize * (0.2+k*16), y + this.tapSize * (i*12+11+0.75-5), 1.4*this.tapSize, 'F' , '#000');
		this.tileText(g, x + this.tapSize * (0.2+k*16), y + this.tapSize * (i*12+11+0.75-7), 1.4*this.tapSize, 'G' , '#000');
		this.tileText(g, x + this.tapSize * (0.2+k*16), y + this.tapSize * (i*12+11+0.75-9), 1.4*this.tapSize, 'A' , '#000');
		this.tileText(g, x + this.tapSize * (0.2+k*16), y + this.tapSize * (i*12+11+0.75-11), 1.4*this.tapSize, 'B' , '#000');*/
		//}
		//}
		for (var i = 1; i < 16 * 16; i++) {
			this.tileRectangle(g, x + this.tapSize * i, y, this.tapSize * 0.03, this.tapSize * 5 * 12, modeBackground(this.bgMode));
		}
		var track = this.findTrackInfo(0);
		for (var i = 0; i < 4; i++) {
			this.tileRectangle(g, x, y + this.tapSize * (11.94 + i * 12), w, this.tapSize * 0.03, track.color);
		}
		for (var i = 16; i < 16 * 16; i = i + 16) {
			this.tileRectangle(g, x + this.tapSize * i, y, this.tapSize * 0.05, this.tapSize * (8 + 5 * 12 + 1), track.color);
		}
		for (var i = 0; i < 16 * 16; i = i + 16) {

			this.tileRectangle(g, x + this.tapSize * (i + 8.05), y, this.tapSize * 0.007, this.tapSize * (8 + 5 * 12), track.color); //modeBackground(this.bgMode));
		}
	}
};
RiffShareFlat.prototype.tileDrums = function (left, top, width, height) {
	for (var i = 0; i < 16; i++) {
		this.tileDrumMeasure(i, left, top, width, height);
	}
	this.addSpot('drumSpot', this.tapSize * this.marginLeft, this.tapSize * (this.marginTop + 12 * 5), this.tapSize * 16 * 16, this.tapSize * 8, function () {
		var beat = Math.floor((riffshareflat.clickContentX - riffshareflat.tapSize * riffshareflat.marginLeft) / riffshareflat.tapSize);
		var drum = Math.floor((riffshareflat.clickContentY - riffshareflat.tapSize * (riffshareflat.marginTop + 12 * 5)) / riffshareflat.tapSize);
		if (riffshareflat.existsDrum(beat, drum)) {
			riffshareflat.userActionDropDrum(beat, drum);
		} else {
			riffshareflat.userActionAddDrum(beat, drum);
		}
	});
};
RiffShareFlat.prototype.findNote = function (beat, pitch, track) {
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (this.storeTracks[i].track == track && this.storeTracks[i].pitch == pitch && this.storeTracks[i].beat == beat) {
			return this.storeTracks[i];
		}
	}
	return null;
};
RiffShareFlat.prototype.dropNote = function (beat, pitch, track) {
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (this.storeTracks[i].track == track && this.storeTracks[i].pitch == pitch && this.storeTracks[i].beat == beat) {
			this.storeTracks.splice(i, 1);
			break;
		}
	}
};
RiffShareFlat.prototype.addNote = function (beat, pitch, track, length, shift) {
	this.storeTracks.push({
		beat: beat,
		pitch: pitch,
		track: track,
		length: length,
		shift: shift
	});
};
RiffShareFlat.prototype.pitchName = function (pitch) {
	var o = Math.ceil(pitch / 12);
	var n = pitch % 12;
	var t = 'C';
	if (n == 1) {
		t = 'C#';
	}
	if (n == 2) {
		t = 'D';
	}
	if (n == 3) {
		t = 'D#';
	}
	if (n == 4) {
		t = 'E';
	}
	if (n == 5) {
		t = 'F';
	}
	if (n == 6) {
		t = 'F#';
	}
	if (n == 7) {
		t = 'G';
	}
	if (n == 8) {
		t = 'G#';
	}
	if (n == 9) {
		t = 'A';
	}
	if (n == 10) {
		t = 'A#';
	}
	if (n == 11) {
		t = 'B';
	}
	return '' + t;
}
RiffShareFlat.prototype.tilePartTones = function (measure, octave, track, left, top, width, height, bottom) {
	var x = this.tapSize * (this.marginLeft + 16 * measure);
	var y = this.tapSize * (this.marginTop + 12 * (4 - octave));
	var w = this.tapSize * 16;
	var h = this.tapSize * 12;
	var g = this.rakeGroup(x, y, w, h, 'tnOm' + measure + 'x' + octave + 'x' + track.nn, this.trackGroups[track.order], left, top, width, height);
	if (g) {
		/*if(bottom){
		this.tileText(g, x+0.1*this.tapSize , y +11.7*this.tapSize, 1.2*this.tapSize, 'C' + (octave+1) , '#000');
		}*/
		for (var i = 0; i < this.storeTracks.length; i++) {
			var p = this.storeTracks[i];
			if (p.track == track.nn) {
				if (p.beat >= measure * 16) {
					if (p.beat < (measure + 1) * 16) {
						if (p.pitch >= octave * 12) {
							if (p.pitch < (1 + octave) * 12) {
								var far = track.order * 0.03 * this.tapSize;
								var xx = x + this.tapSize * (0.5 + p.beat % 16) + far;
								var yy = y + this.tapSize * (12.5 - p.pitch % 12 - 1) - far;
								var le = p.length - 1;
								var r = this.tapSize;
								if (track.order > 0) {
									this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, track.shadow, r);
								} else {
									this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, track.color, r);
									//this.tileCircle(g, xx, yy, this.tapSize / 5, '#000');
									this.tileText(g, xx - 0.4 * this.tapSize, yy + 0.2 * this.tapSize, 1.0 * this.tapSize, this.pitchName(p.pitch), modeNoteName(this.bgMode));
								}
							}
						}
					}
				}
			}
		}
	}
};

RiffShareFlat.prototype.tileCounter = function (left, top, width, height) {
	if (this.onAir) {
		var x = this.tapSize * this.marginLeft;
		var y = 0;
		var w = this.innerWidth;
		var h = this.innerHeight;
		var g = this.rakeGroup(x, y, w, h, 'cntr', this.counterGroup, left, top, width, height);
		if (g) {
			this.tileRectangle(g, 0, 0, this.tapSize * 0.001, this.tapSize * 0.001, '#000');
			this.tileRectangle(g, this.innerWidth, this.innerHeight, this.tapSize * 0.001, this.tapSize * 0.001, '#000');

			this.counterLine = this.tileRectangle(g, x + this.tapSize * 0.3, y, this.tapSize * 0.4, h, this.findTrackInfo(0).shadow);
		}
	}
};
RiffShareFlat.prototype.tileTones = function (left, top, width, height) {
	for (var m = 0; m < 16; m++) {
		for (var o = 0; o < 5; o++) {
			for (var t = 0; t < 8; t++) {
				this.tilePartTones(m, o, this.findTrackInfo(7 - t), left, top, width, height, t == 0);
			}
		}
	}
	if (this.mark) {
		var x = this.tapSize * (this.marginLeft + this.mark.beat);
		var y = this.tapSize * (this.marginTop + 12 * 5 - this.mark.pitch - 1);
		var w = this.tapSize;
		var h = this.tapSize;
		var g = this.rakeGroup(x, y, w, h, 'mrk', this.upperGroup, left, top, width, height);
		if (g) {
			this.tileCircle(g, x + this.tapSize * 0.5, y + this.tapSize * 0.5, this.tapSize / 3, 'rgba(127,127,127,0.5)');
		}
	}
	this.addSpot('toneSpot', this.tapSize * this.marginLeft, this.tapSize * this.marginTop, this.tapSize * 16 * 17, this.tapSize * 12 * 5, function () {
		var beat = Math.floor((riffshareflat.clickContentX - riffshareflat.tapSize * riffshareflat.marginLeft) / riffshareflat.tapSize);
		var pitch = 60 - Math.floor((riffshareflat.clickContentY - riffshareflat.tapSize * riffshareflat.marginTop) / riffshareflat.tapSize) - 1;
		var nn = riffshareflat.findTrackInfo(0).nn;
		if (riffshareflat.findNote(beat, pitch, nn)) {
			riffshareflat.userActionDropNote(beat, pitch, nn);
		} else {
			if (riffshareflat.mark) {
				var abeat = riffshareflat.mark.beat;
				var alength = beat - riffshareflat.mark.beat + 1;
				var apitch = riffshareflat.mark.pitch;
				var ashift = pitch - riffshareflat.mark.pitch;
				if (abeat > beat) {
					abeat = beat;
					alength = riffshareflat.mark.beat + 1 - beat;
					apitch = pitch;
					ashift = riffshareflat.mark.pitch - pitch;
				}
				riffshareflat.userActionAddNote(abeat, apitch, nn, alength, ashift);
				riffshareflat.mark = null;
			} else {
				if (beat < 16 * 16) {
					riffshareflat.mark = {
						beat: beat,
						pitch: pitch
					};
				}
			}
		}

	});
};
RiffShareFlat.prototype.setModeBackground = function (bgMode) {
	console.log('setModeBackground', bgMode);
	this.bgMode = bgMode;
	saveText2localStorage('bgMode', '' + bgMode);
	//console.log(this.bgMode,modeBackground(this.bgMode));
	this.contentDiv.style.background = modeBackground(this.bgMode);
};
/*
RiffShareFlat.prototype.modeDrumColor = function (bgMode) {
if (bgMode == 2) {
return '#033';
}
return '#ccc';
};
RiffShareFlat.prototype.modeDrumShadow = function (bgMode) {
if (bgMode == 2) {
return '#9a9';
}
return '#666';
};
RiffShareFlat.prototype.modeBackground = function (bgMode) {
if (bgMode == 1) {
return '#31424C';
}
if (bgMode == 2) {
//return '#C8D1D2';
return '#eef';
}
return '#000609';
};*/
RiffShareFlat.prototype.tileColorMode = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 36 + 1 - 2);
	var w = this.tapSize * 12;
	var h = this.tapSize * 2;
	var g = this.rakeGroup(x, y, w, h, 'colorscheme', this.textGroup, left, top, width, height);
	var cw = 11 / 3;
	if (g) {
		this.tileText(g, x - this.tapSize * 5.5, y + this.tapSize * 0.75, this.tapSize, 'Background mode', modeDrumColor(this.bgMode));
		for (var i = 0; i < 3; i++) {
			this.tileRectangle(g, x + this.tapSize * cw * i, y, this.tapSize * (cw - 0.1), this.tapSize * 0.9, modeBackground(i));
			var s = this.addSpot('colorscheme' + i, x + this.tapSize * cw * i, y, this.tapSize * cw, this.tapSize, function () {
					console.log('spot', this);
					//riffshareflat.setModeBackground(this.bgm)
					riffshareflat.userActionChangeScheme(this.bgm);
				});
			s.bgm = i;
		}
	}
};

RiffShareFlat.prototype.tileTempo = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 36 + 1);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tmpo', this.textGroup, left, top, width, height);
	var cw = 11 / 9;
	if (g) {
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * 11, this.tapSize * 0.9, modeDrumShadow(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * cw * (this.tempo - 60) / 20, this.tapSize * 0.9, modeDrumColor(this.bgMode));
		this.tileText(g, x - this.tapSize * 5.5, y + this.tapSize * 0.75, this.tapSize, 'Tempo ' + this.tempo + ' bpm', modeDrumColor(this.bgMode));
		for (var i = 0; i < 9; i++) {
			var s = this.addSpot('tempo' + i, x + this.tapSize * cw * i, y, this.tapSize * cw, this.tapSize, function () {
					riffshareflat.userActionTempo(this.tempo);
				});
			s.tempo = i * 20 + 80;
		}
	}
};
RiffShareFlat.prototype.findTrackNum = function (order) {
	//console.log(this.trackInfo);
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order == order) {
			return i;
		}
	}
	return -1;
};
RiffShareFlat.prototype.findTrackInfo = function (order) {
	//console.log(this.trackInfo);
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order == order) {
			return this.trackInfo[i];
		}
	}
	return null;
};
RiffShareFlat.prototype.getTrackOrders = function () {
	var o = [];
	for (var i = 0; i < 8; i++) {
		o.push(this.trackInfo[i].order);
	}
	return o;
};
RiffShareFlat.prototype.setTrackOrders = function (o) {
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].order = o[i];
	}
};
RiffShareFlat.prototype.upTrack = function (order) {
	var track = this.findTrackInfo(order);
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order < track.order) {
			this.trackInfo[i].order++;
		}
	}
	track.order = 0;
};
RiffShareFlat.prototype.tileToneVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 11);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tnvlm', this.linesGroup, left, top, width, height);
	var sk = 0;
	var me = this;
	if (g) {
		for (var i = 0; i < 8; i++) {
			var track = this.findTrackInfo(i);
			if (i > 0) {
				sk = 2;
				//this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * (i + sk), this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.3)');
				this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * (i + sk), this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
				//this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5 + sk), this.tapSize * 0.5, modeDrumShadow(this.bgMode));
				var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2 + sk), this.tapSize * 17, this.tapSize * 1, function () {
						riffshareflat.userActionUpTrack(this.order);
						riffshareflat.closeMenuIns();
					});
				s.order = i;
				//console.log(track,this.trackInfo[i].sound.zones[0].buffer);
				//if (this.trackInfo[i].sound.zones[0].buffer) {
				//console.log(i,me.findTrackNum(i));
				this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * (i + 0.75 + sk), this.tapSize * 1.0, me.findTrackTitle(me.findTrackNum(i)), track.color);
				//}
				/*for (var v = 0; v < 11; v++) {
				var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * (i + sk), this.tapSize, this.tapSize, function () {
				riffshareflat.userActionToneVolume(this.track, this.volume);
				});
				s.track = track;
				s.volume = v * 10;
				}*/
			} else {
				this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * (i + sk), this.tapSize * 11, this.tapSize * 0.9, modeDrumShadow(this.bgMode));
				this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * (i + sk), this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
				this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5 + sk), this.tapSize * 0.5, modeDrumShadow(this.bgMode));
				/*var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2 + sk), this.tapSize * 5, this.tapSize * 1, function () {
				riffshareflat.userActionUpTrack(this.order);
				});
				s.order = i;*/
				//if (this.trackInfo[i].sound.zones[0].buffer) {
				this.tileText(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.75 + sk), this.tapSize * 1.0, me.findTrackTitle(me.findTrackNum(i)), track.color);
				//}
				for (var v = 0; v < 11; v++) {
					var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * (i + sk), this.tapSize, this.tapSize, function () {
							riffshareflat.userActionToneVolume(this.track, this.volume);
						});
					s.track = track;
					s.volume = v * 10;
				}
			}
		}
		this.addSpot('insUpReplaceSelect', x + this.tapSize * 0, y + this.tapSize * 0, this.tapSize * 2, this.tapSize * 1, function () {
			//console.log('insUpReplaceSelect');
			me.openMenuUpperInstrument();
		});
	}
};
RiffShareFlat.prototype.tileDrumVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drvlm', this.textGroup, left, top, width, height);
	var me = this;
	if (g) {
		for (var i = 0; i < 8; i++) {
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * 11, this.tapSize * 0.9, modeDrumShadow(this.bgMode));
			var n = this.drumVolumes[i] / 10;
			if (!(n)) {
				n = 0;
			}
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * (1 + n), this.tapSize * 0.9, modeDrumColor(this.bgMode));
			for (var v = 0; v < 11; v++) {
				var s = this.addSpot('voldru' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * i, this.tapSize, this.tapSize, function () {
						riffshareflat.userActionDrumVolume(this.drum, this.volume);
					});
				s.drum = i;
				s.volume = v * 10;
			}
			//if (this.drumInfo[i].sound.zones[0].buffer) {
			this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5), this.tapSize * 0.5, modeDrumShadow(this.bgMode));
			this.tileText(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.75), this.tapSize, this.findDrumTitle(i), modeDrumColor(this.bgMode));
			var s = this.addSpot('drumReplaceSelect' + i, x + this.tapSize * 0.0, y + this.tapSize * i, this.tapSize * 2, this.tapSize * 1, function () {
					//console.log('drumReplaceSelect',this.order);
					me.openMenuDrum(this.order);
				});
			s.order = i;
			//}
		}
		/*
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 0.75, this.tapSize * 0.9, 'Bass drum', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 1.75, this.tapSize * 0.9, 'Low tom', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 2.75, this.tapSize * 0.9, 'Snare drum', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 3.75, this.tapSize * 0.9, 'Mid Tom', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 4.75, this.tapSize * 0.9, 'Closed Hi-hat', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 5.75, this.tapSize * 0.9, 'Open Hi-hat', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 6.75, this.tapSize * 0.9, 'Ride Cymbal', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 7.75, this.tapSize * 0.9, 'Splash Cymbal', '#ffffff');
		 */
	}
};
RiffShareFlat.prototype.tileFrets = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 0);
	var y = this.tapSize * (this.marginTop + 12 * 5 + 8 + 1);
	var w = this.tapSize * 16;
	var h = this.tapSize * 6;
	for (var m = 0; m < 16; m++) {
		var g = this.rakeGroup(x + m * 16 * this.tapSize, y, w, h, 'frts' + m, this.textGroup, left, top, width, height);
		if (g) {
			for (var i = 0; i < 6; i++) {
				this.tileRectangle(g, x + m * 16 * this.tapSize, y + (1 + i) * this.tapSize //
				, w, this.tapSize * (0.01 + i / 100) //
				, modeDrumColor(this.bgMode));
			}
			for (var i = 1; i < 16; i++) {
				this.tileRectangle(g, x + (i + m * 16) * this.tapSize, y + 1 * this.tapSize //
				, 0.005 * this.tapSize, h - 1 * this.tapSize //
				, modeDrumColor(this.bgMode));
			}
		}
	}
}
RiffShareFlat.prototype.tileEqualizer = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 17.5);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 34 + 1);
	var w = this.tapSize * 10;
	var h = this.tapSize * 21;
	var sz = 1.65;
	var g = this.rakeGroup(x, y, w, h, 'eqlzr', this.textGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 10; i++) {
			this.tileRectangle(g, x + this.tapSize * i * sz, y, this.tapSize * 0.95 * sz, this.tapSize * 21, modeDrumShadow(this.bgMode));
			var n = this.equalizer[i];
			if (!(n)) {
				n = 0;
			}
			var ey = n < 0 ? y + this.tapSize * 10 : y + this.tapSize * 10 - this.tapSize * n;
			this.tileRectangle(g, x + this.tapSize * i * sz, ey, this.tapSize * 0.95 * sz, this.tapSize * (1 + Math.abs(n)), modeDrumColor(this.bgMode));
			for (var v = -10; v <= 10; v++) {
				var s = this.addSpot('eq' + i + 'x' + v, x + this.tapSize * i * sz, y - this.tapSize * (v - 10), this.tapSize * 0.95 * sz, this.tapSize, function () {
						riffshareflat.userActionEqualizer(this.band, this.volume);
					});
				s.band = i;
				s.volume = v;
			}
		}
		this.tileText(g, x + this.tapSize * (0 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '65', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (1 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '125', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (2 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '250', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (3 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '500', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (4 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '1k', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (5 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '1k', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (6 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '2k', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (7 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '4k', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (8 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '8k', modeBackground(this.bgMode));
		this.tileText(g, x + this.tapSize * (9 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '16k', modeBackground(this.bgMode));
	}
};
RiffShareFlat.prototype.msEdgeHook = function (g) {
	if (g.childNodes && (!(g.children))) {
		g.children = g.childNodes;
		//console.log('try layer.children',layer.children);
	}
};
RiffShareFlat.prototype.clearUselessDetails = function (x, y, w, h, layer) {
	this.msEdgeHook(layer);
	for (var i = 0; i < layer.children.length; i++) {
		var group = layer.children[i];
		this.clearUselessNodes(x, y, w, h, group);
	}
};
RiffShareFlat.prototype.clearUselessNodes = function (x, y, w, h, layer) {
	this.msEdgeHook(layer);
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (this.outOfView(t, x, y, w, h)) {
			layer.removeChild(t);
			i--;
		} else {
			//
		}
	}
};
RiffShareFlat.prototype.outOfView = function (child, x, y, w, h) {
	var tbb = child.getBBox();
	return !(this.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
};
RiffShareFlat.prototype.clearSpots = function () {
	this.spots = [];
};
RiffShareFlat.prototype.findSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			return this.spots[i];
		}
	}
	return null;
};
RiffShareFlat.prototype.dropSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			this.spots.splice(i, 1);
			break;
		}
	}
};
RiffShareFlat.prototype.rakeGroup = function (x, y, w, h, id, layer, left, top, width, height) {
	if (this.collision(x, y, w, h, left, top, width, height)) {
		if (!this.childExists(id, layer)) {
			var g = document.createElementNS(this.svgns, 'g');
			g.id = id;
			layer.appendChild(g);
			return g;
		} else {
			//console.log(id,'exists');
		}
	}
	return null;
};
RiffShareFlat.prototype.childExists = function (id, layer) {
	this.msEdgeHook(layer);
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (t.id == id) {
			return true;
		}
	}
	return false;
};
RiffShareFlat.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
	if (x1 + w1 < x2 //
		 || x1 > x2 + w2 //
		 || y1 + h1 < y2 //
		 || y1 > y2 + h2 //
	)
	{
		return false;
	} else {
		return true;

	}
};
/*
RiffShareFlat.prototype.openMenu = function () {
var o = document.getElementById('menuitems');
var html = '';
for (var i = 0; i < trackInfo.length; i++) {
html = html + "<div id='insLine" + i + "' class='menubuttonRow'>" + trackInfo[i].title + "</div>";
}
for (var i = 0; i < drumInfo.length; i++) {
html = html + "<div id='drmLine" + i + "' class='menubuttonRow'>" + drumInfo[i].title + "</div>";
}
o.innerHTML = html;
o.scrollTop = 0;
document.getElementById('menuDiv').style.width = '7cm';
document.getElementById('menuDiv').style.background = modeBackground(this.bgMode);
document.getElementById('menuDiv').style.color = modeDrumColor(this.bgMode);
for (var i = 0; i < trackInfo.length; i++) {
this.setMenuInsAction(i);
}
for (var i = 0; i < drumInfo.length; i++) {
this.setMenuDrumAction(i);
}
};
RiffShareFlat.prototype.setMenuInsAction = function (n) {
var me = this;
document.getElementById('insLine' + n).onclick = function (e) {
me.openMenuInstrument(n);
};
}
RiffShareFlat.prototype.setMenuDrumAction = function (n) {
var me = this;
document.getElementById('drmLine' + n).onclick = function (e) {
me.openMenuDrum(n);
};
}*/
RiffShareFlat.prototype.findTrackTitle = function (n) {
	var title = trackInfo[n].title;
	if (trackInfo[n].replacement) {
		title = '' + (trackInfo[n].replacement - 1) + ': ' + trackInfo[n].info.title;
	}
	return title;
};
RiffShareFlat.prototype.findDrumTitle = function (n) {
	var title = drumInfo[n].title;
	if (drumInfo[n].replacement) {
		title = '' + (drumInfo[n].replacement - 1) + ': ' + drumInfo[n].info.title;
	}
	return title;
};
var menuInstrumentLibFilled = false;
var menuInstrumentLibKey = 0;
RiffShareFlat.prototype.openMenuUpperInstrument = function () {
	var me = this;
	this.closeMenuDrum();
	for (var i = 0; i < this.trackInfo.length; i++) {
		if (this.trackInfo[i].order == 0) {
			menuInstrumentLibKey = i;
			break;
		}
	}
	document.getElementById('menuTitle1').innerText = this.findTrackTitle(menuInstrumentLibKey);
	if (menuInstrumentLibFilled) {
		console.log('skip ins chooser');
	} else {
		console.log('create ins chooser');
		var o = document.getElementById('menuitems1');
		var html = '';
		html = html + "<div id='insLineDefault' class='menubuttonRow'>Default</div>";
		for (var i = 0; i < this.player.loader.instrumentKeys().length; i++) {
			var info = this.player.loader.instrumentInfo(i);
			html = html + "<div id='insSel" + i + "' class='menubuttonRow'>" + i + ': ' + info.title + "</div>";
		}
		html = html + "<div class='menubuttonRow'>&nbsp;</div>";
		html = html + "<div class='menubuttonRow'>&nbsp;</div>";
		html = html + "<div class='menubuttonRow'>&nbsp;</div>";
		o.innerHTML = html;

		for (var i = 0; i < this.player.loader.instrumentKeys().length; i++) {
			this.setMenuInsSelect(i);
		}
		document.getElementById('insLineDefault').onclick = function (e) {
			me.closeMenuIns();
			me.userActionReplaceIns(menuInstrumentLibKey, 0);
			me.resetAllLayersNow();
		};
		menuInstrumentLibFilled = true;
	}
	document.getElementById('menuDiv1').style.width = '7cm';
	document.getElementById('menuDiv1').style.background = modeBackground(this.bgMode);
	document.getElementById('menuDiv1').style.color = modeDrumColor(this.bgMode);
}
var menuDrumLibFilled = false;
var menuDrumLibKey = 0;
RiffShareFlat.prototype.openMenuDrum = function (ndrum) {
	var me = this;
	this.closeMenuIns();
	menuDrumLibKey = ndrum;
	document.getElementById('menuTitle2').innerText = this.findDrumTitle(menuDrumLibKey);
	if (menuDrumLibFilled) {
		console.log('skip ins chooser');
	} else {
		var o = document.getElementById('menuitems2');
		var html = '';
		html = html + "<div id='drmLineDefault' class='menubuttonRow'>Default</div>";
		for (var i = 0; i < this.player.loader.drumKeys().length; i++) {
			var info = this.player.loader.drumInfo(i);
			html = html + "<div id='drmSel" + i + "' class='menubuttonRow'>" + i + ': ' + info.title + "</div>";
		}
		html = html + "<div class='menubuttonRow'>&nbsp;</div>";
		html = html + "<div class='menubuttonRow'>&nbsp;</div>";
		html = html + "<div class='menubuttonRow'>&nbsp;</div>";
		o.innerHTML = html;
		
		for (var i = 0; i < this.player.loader.drumKeys().length; i++) {
			this.setMenuDrumSelect(i);
		}
		document.getElementById('drmLineDefault').onclick = function (e) {
			me.closeMenuDrum();
			me.userActionReplaceDrum(menuDrumLibKey, 0);
			me.resetAllLayersNow();
		};
		menuDrumLibFilled = true;
	}
	document.getElementById('menuDiv2').style.width = '7cm';
		document.getElementById('menuDiv2').style.background = modeBackground(this.bgMode);
		document.getElementById('menuDiv2').style.color = modeDrumColor(this.bgMode);
}
RiffShareFlat.prototype.setMenuInsSelect = function (inskey) {
	var me = this;
	document.getElementById('insSel' + inskey).onclick = function (e) {
		var info = me.player.loader.instrumentInfo(inskey);
		me.player.loader.startLoad(me.audioContext, info.url, info.variable);
		me.player.loader.waitLoad(function () {
			me.closeMenuIns();
			me.userActionReplaceIns(menuInstrumentLibKey, inskey + 1);
			me.resetAllLayersNow();
		});
	};
}
RiffShareFlat.prototype.setMenuDrumSelect = function ( i) {
	var me = this;
	document.getElementById('drmSel' + i).onclick = function (e) {
		var info = me.player.loader.drumInfo(i);
		me.player.loader.startLoad(me.audioContext, info.url, info.variable);
		me.player.loader.waitLoad(function () {
			me.closeMenuDrum();
			me.userActionReplaceDrum(menuDrumLibKey, i + 1);
			me.resetAllLayersNow();
		});
	};
}
RiffShareFlat.prototype.closeMenuIns = function () {

	document.getElementById('menuDiv1').style.width = '0cm';
};
RiffShareFlat.prototype.closeMenuDrum = function () {
	document.getElementById('menuDiv2').style.width = '0cm';
};
RiffShareFlat.prototype.resetSize = function () {
	this.innerWidth = (this.marginLeft + this.marginRight + 16 * 16) * this.tapSize;
	this.innerHeight = (this.marginTop + this.marginBottom + 8 + 5 * 12) * this.tapSize;
	this.contentSVG.style.width = this.contentDiv.clientWidth + 'px';
	this.contentSVG.style.height = this.contentDiv.clientHeight + 'px';
	document.getElementById('undobutton').style.width = this.tapSize + 'px';
	document.getElementById('undobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.width = this.tapSize + 'px';
	document.getElementById('redobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.top = (5 * 2 + this.tapSize) + 'px';
	//document.getElementById('menubutton').style.width = this.tapSize + 'px';
	//document.getElementById('menubutton').style.height = this.tapSize + 'px';
	//document.getElementById('menubutton').style.top = (5 * 2 + 2*this.tapSize) + 'px';
	this.adjustContentPosition();
	this.queueTiles();
};
RiffShareFlat.prototype.tileLine = function (g, x1, y1, x2, y2, strokeColor, strokeWidth) {
	var line = document.createElementNS(this.svgns, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	if (strokeColor) {
		line.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		line.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	line.setAttributeNS(null, 'stroke-linecap', 'round');
	g.appendChild(line);
	return line;
};
RiffShareFlat.prototype.tileEllipse = function (g, x, y, rx, ry, fillColor, strokeColor, strokeWidth) {
	var e = document.createElementNS(this.svgns, 'ellipse');
	e.setAttributeNS(null, 'cx', x);
	e.setAttributeNS(null, 'cy', y);
	e.setAttributeNS(null, 'rx', rx);
	e.setAttributeNS(null, 'ry', ry);
	if (fillColor) {
		e.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		e.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		e.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(e);
	return e;
};
/*RiffShareFlat.prototype.tilePolygon = function (g, x, y, r, fillColor, strokeColor, strokeWidth) {
var polygon = document.createElementNS(this.svgns, 'polygon');
polygon.setAttributeNS(null, 'cx', x);
polygon.setAttributeNS(null, 'cy', y);
polygon.setAttributeNS(null, 'r', r);
if (fillColor) {
polygon.setAttributeNS(null, 'fill', fillColor);
}
if (strokeColor) {
polygon.setAttributeNS(null, 'stroke', strokeColor);
}
if (strokeWidth) {
polygon.setAttributeNS(null, 'stroke-width', strokeWidth);
}
g.appendChild(polygon);
return polygon;
};*/
RiffShareFlat.prototype.tileCircle = function (g, x, y, r, fillColor, strokeColor, strokeWidth) {
	var circle = document.createElementNS(this.svgns, 'circle');
	circle.setAttributeNS(null, 'cx', x);
	circle.setAttributeNS(null, 'cy', y);
	circle.setAttributeNS(null, 'r', r);
	if (fillColor) {
		circle.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		circle.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		circle.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(circle);
	return circle
};
RiffShareFlat.prototype.tileRectangle = function (g, x, y, w, h, fillColor, strokeColor, strokeWidth, r) {
	var rect = document.createElementNS(this.svgns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	if (fillColor) {
		rect.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		rect.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		rect.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	if (r) {
		rect.setAttributeNS(null, 'rx', r);
		rect.setAttributeNS(null, 'ry', r);
	}
	g.appendChild(rect);
	return rect;
};
RiffShareFlat.prototype.tileText = function (g, x, y, fontSize, text, bgColor, strokeColor, strokeWidth, fontFamily, fontStyle) {
	var txt = document.createElementNS(this.svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', fontSize);
	if (bgColor) {
		txt.setAttributeNS(null, 'fill', bgColor);
	}
	if (fontFamily) {
		txt.setAttributeNS(null, 'font-family', fontFamily);
	}
	if (fontStyle) {
		txt.setAttributeNS(null, 'font-style', fontStyle);
	}
	if (strokeColor) {
		txt.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		txt.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	txt.innerHTML = text;
	g.appendChild(txt);
	return txt;
};
RiffShareFlat.prototype.clearLayerChildren = function (layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		this.msEdgeHook(layer);
		for (var n = 0; n < layer.children.length; n++) {
			var g = layer.children[n];
			while (g.children.length > 0) {
				g.removeChild(g.children[0]);
			}
		}
	}
};
RiffShareFlat.prototype.makeUndo = function (level) {
	console.log('makeUndo', level);
	var last = null;
	for (var i = this.undoQueue.length - 1; i >= level; i--) {
		var u = this.undoQueue.pop();
		u.undo();
		last = u;
	}
	if (last) {
		this.resetAllLayersNow();
		this.startSlideTo(last.x, last.y, last.z);
	}
};
RiffShareFlat.prototype.clearUndo = function () {
	this.undoQueue = [];
	this.undoStep = 0;
}
RiffShareFlat.prototype.setUndoStatus = function () {
	if (this.undoStep < this.undoQueue.length) {
		document.getElementById('redoimg').src = "redoActive.png";
	} else {
		document.getElementById('redoimg').src = "redo.png";
	}
	if (this.undoStep > 0) {
		document.getElementById('undoimg').src = "undoActive.png";
	} else {
		document.getElementById('undoimg').src = "undo.png";
	}
};
RiffShareFlat.prototype.redoNext = function () {
	if (this.undoStep < this.undoQueue.length) {
		var a = this.undoQueue[this.undoStep];
		console.log('redo', a.caption);
		a.redo();
		this.undoStep++;
		this.resetAllLayersNow();
		this.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
};
RiffShareFlat.prototype.undoLast = function () {
	if (this.undoStep > 0) {
		this.undoStep--;
		var a = this.undoQueue[this.undoStep];
		console.log('undo', a.caption);
		a.undo();
		this.resetAllLayersNow();
		this.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
};
RiffShareFlat.prototype.pushAction = function (action) {
	console.log('pushAction', action.caption);
	action.x = this.translateX;
	action.y = this.translateY;
	action.z = this.translateZ;
	action.redo();
	var rm = this.undoQueue.length - this.undoStep;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.pop();
	}
	this.undoQueue.push(action);
	this.undoStep++;
	rm = this.undoQueue.length - this.undoSize;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.shift();
		this.undoStep--;
	}
	this.setUndoStatus();
};
RiffShareFlat.prototype.userActionUpTrack = function (order) {
	var before = this.getTrackOrders();
	this.upTrack(order);
	var after = this.getTrackOrders();
	riffshareflat.pushAction({
		caption: 'Up ' + order,
		undo: function () {
			riffshareflat.setTrackOrders(before);
			riffshareflat.mark = null;
		},
		redo: function () {
			riffshareflat.setTrackOrders(after);
			riffshareflat.mark = null;
		}
	});
};
RiffShareFlat.prototype.userActionToneVolume = function (track, volume) {
	var before = this.getTrackOrders();
	this.upTrack(track.order);
	var after = this.getTrackOrders();
	var old = track.volume;
	riffshareflat.pushAction({
		caption: 'Volume ' + volume + ' for ' + track.title,
		undo: function () {
			track.volume = old;
			riffshareflat.setTrackOrders(before);
			riffshareflat.mark = null;
			riffshareflat.resetNodeValues();
		},
		redo: function () {
			track.volume = volume;
			riffshareflat.setTrackOrders(after);
			riffshareflat.mark = null;
			riffshareflat.resetNodeValues();
		}
	});
};
RiffShareFlat.prototype.userActionDrumVolume = function (nn, volume) {
	var old = this.drumVolumes[nn];
	riffshareflat.pushAction({
		caption: 'Volume ' + volume + ' for drum ' + nn,
		undo: function () {
			riffshareflat.drumVolumes[nn] = old;
			riffshareflat.resetNodeValues();
		},
		redo: function () {
			riffshareflat.drumVolumes[nn] = volume;
			riffshareflat.resetNodeValues();
		}
	});
};
RiffShareFlat.prototype.userActionTempo = function (tempo) {
	var old = this.tempo;
	riffshareflat.pushAction({
		caption: 'Tempo ' + tempo,
		undo: function () {
			riffshareflat.tempo = old;
		},
		redo: function () {
			riffshareflat.tempo = tempo;
		}
	});
};
RiffShareFlat.prototype.userActionEqualizer = function (band, volume) {
	var old = this.equalizer[band];
	riffshareflat.pushAction({
		caption: 'Equalizer ' + band + ' = ' + volume,
		undo: function () {
			riffshareflat.equalizer[band] = old;
			riffshareflat.resetNodeValues();
		},
		redo: function () {
			riffshareflat.equalizer[band] = volume;
			riffshareflat.resetNodeValues();
		}
	});
};
RiffShareFlat.prototype.userActionAddDrum = function (beat, drum) {
	riffshareflat.pushAction({
		caption: 'Add drum ' + drum + ' to ' + beat,
		undo: function () {
			riffshareflat.dropDrum(beat, drum);
		},
		redo: function () {
			riffshareflat.setDrum(beat, drum);
		}
	});
};
RiffShareFlat.prototype.userActionDropDrum = function (beat, drum) {
	riffshareflat.pushAction({
		caption: 'Drop drum ' + drum + ' from ' + beat,
		undo: function () {
			riffshareflat.setDrum(beat, drum);
		},
		redo: function () {
			riffshareflat.dropDrum(beat, drum);
		}
	});
};
RiffShareFlat.prototype.userActionAddNote = function (beat, pitch, track, length, shift) {
	riffshareflat.pushAction({
		caption: 'Add note ' + beat + '/' + pitch + '/' + track + '/' + length + '/' + shift,
		undo: function () {
			riffshareflat.dropNote(beat, pitch, track);
		},
		redo: function () {
			riffshareflat.addNote(beat, pitch, track, length, shift);
		}
	});
};
RiffShareFlat.prototype.userActionDropNote = function (beat, pitch, track) {
	var old = this.findNote(beat, pitch, track);
	riffshareflat.pushAction({
		caption: 'Drop note ' + beat + '/' + pitch + '/' + track,
		undo: function () {
			riffshareflat.addNote(old.beat, old.pitch, old.track, old.length, old.shift);
		},
		redo: function () {

			riffshareflat.dropNote(beat, pitch, track);
		}
	});
};
RiffShareFlat.prototype.userActionSwap = function () {
	//console.log(riffshareflat.findTrackInfo(0).title,'<->',riffshareflat.findTrackInfo(1).title);
	var track0 = this.findTrackInfo(0);
	var track1 = this.findTrackInfo(1);
	var old = this.copyTones();
	var nw = this.copyTones();
	for (var i = 0; i < nw.length; i++) {
		if (nw[i].track == track0.nn) {
			nw[i].track = track1.nn;
		} else {
			if (nw[i].track == track1.nn) {
				nw[i].track = track0.nn;
			}
		}
	}
	//console.log(fromN, toN);
	var before = this.getTrackOrders();
	this.upTrack(track1.order);
	var after = this.getTrackOrders();
	riffshareflat.pushAction({
		caption: 'Swap ' + track1.title + ' with ' + track0.title,
		undo: function () {
			riffshareflat.storeTracks = old;
			riffshareflat.setTrackOrders(before);
			riffshareflat.mark = null;
		},
		redo: function () {
			riffshareflat.storeTracks = nw;
			riffshareflat.setTrackOrders(after);
			riffshareflat.mark = null;
		}
	});
};
RiffShareFlat.prototype.userUpInstrument = function () {
	var nn = this.findTrackInfo(0).nn;
	var pre = this.copyTones();
	var after = [];
	for (var i = 0; i < pre.length; i++) {
		if (pre[i].pitch >= 12 * 4 && nn == pre[i].track) {
			return;
		}
		if (nn == pre[i].track) {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch + 12,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		} else {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		}

	}
	riffshareflat.pushAction({
		caption: 'up instrument ' + nn,
		undo: function () {
			riffshareflat.storeTracks = pre;
		},
		redo: function () {
			riffshareflat.storeTracks = after;
		}
	});
};
RiffShareFlat.prototype.userDownInstrument = function () {
	var nn = this.findTrackInfo(0).nn;
	var pre = this.copyTones();
	var after = [];
	for (var i = 0; i < pre.length; i++) {
		if (pre[i].pitch < 12 && nn == pre[i].track) {
			return;
		}
		if (nn == pre[i].track) {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch - 12,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		} else {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		}

	}
	riffshareflat.pushAction({
		caption: 'down instrument ' + nn,
		undo: function () {
			riffshareflat.storeTracks = pre;
		},
		redo: function () {
			riffshareflat.storeTracks = after;
		}
	});
};
RiffShareFlat.prototype.userUpMeasure = function (msr) {
	var nn = this.findTrackInfo(0).nn;
	var pre = this.copyTones();
	var after = [];
	for (var i = 0; i < pre.length; i++) {
		if (pre[i].beat >= msr * 16 && pre[i].beat < (1 + msr) * 16 && nn == pre[i].track) {
			if (pre[i].pitch >= 12 * 5 - 1) {
				return;
			}
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch + 1,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		} else {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		}
	}
	riffshareflat.pushAction({
		caption: 'up measure ' + msr + ' for instrument ' + nn,
		undo: function () {
			riffshareflat.storeTracks = pre;
		},
		redo: function () {
			riffshareflat.storeTracks = after;
		}
	});
};
RiffShareFlat.prototype.userDownMeasure = function (msr) {
	var nn = this.findTrackInfo(0).nn;
	var pre = this.copyTones();
	var after = [];
	for (var i = 0; i < pre.length; i++) {
		if (pre[i].beat >= msr * 16 && pre[i].beat < (1 + msr) * 16 && nn == pre[i].track) {
			if (pre[i].pitch < 1) {
				return;
			}
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch - 1,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		} else {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		}
	}
	riffshareflat.pushAction({
		caption: 'down measure ' + msr + ' for instrument ' + nn,
		undo: function () {
			riffshareflat.storeTracks = pre;
		},
		redo: function () {
			riffshareflat.storeTracks = after;
		}
	});
};
RiffShareFlat.prototype.userClearInstrument = function () {
	var nn = this.findTrackInfo(0).nn;
	var pre = this.copyTones();
	var after = [];
	for (var i = 0; i < pre.length; i++) {
		if (nn == pre[i].track) {
			//
		} else {
			after.push({
				beat: pre[i].beat,
				pitch: pre[i].pitch,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		}
	}
	riffshareflat.pushAction({
		caption: 'clear instrument ' + nn,
		undo: function () {
			riffshareflat.storeTracks = pre;
		},
		redo: function () {
			riffshareflat.storeTracks = after;
		}
	});
};
RiffShareFlat.prototype.userClearDrum = function () {
	var pre = this.copyDrums();
	var after = [];
	riffshareflat.pushAction({
		caption: 'clear drums',
		undo: function () {
			riffshareflat.storeDrums = pre;
		},
		redo: function () {
			riffshareflat.storeDrums = after;
		}
	});
};
RiffShareFlat.prototype.userRepeatInstrument = function () {
	var nn = this.findTrackInfo(0).nn;
	var pre = this.copyTones();
	var after = this.copyTones();
	var c16 = 16 * this.cauntToneMeasures(nn);
	for (var i = 0; i < pre.length; i++) {
		if (nn == pre[i].track && pre[i].beat + c16 < 16 * 16) {
			after.push({
				beat: pre[i].beat + c16,
				pitch: pre[i].pitch,
				track: pre[i].track,
				shift: pre[i].shift,
				length: pre[i].length
			});
		}
	}
	riffshareflat.pushAction({
		caption: 'repeat instrument ' + nn,
		undo: function () {
			riffshareflat.storeTracks = pre;
		},
		redo: function () {
			riffshareflat.storeTracks = after;
		}
	});
};
RiffShareFlat.prototype.userRepeatDrums = function () {
	var pre = this.copyDrums();
	var after = this.copyDrums();
	var c16 = 16 * this.cauntDrumMeasures();
	for (var i = 0; i < pre.length; i++) {
		if (pre[i].beat + c16 < 16 * 16) {
			after.push({
				beat: pre[i].beat + c16,
				drum: pre[i].drum
			});
		}
	}
	riffshareflat.pushAction({
		caption: 'repeat drums',
		undo: function () {
			riffshareflat.storeDrums = pre;
		},
		redo: function () {
			riffshareflat.storeDrums = after;
		}
	});
};
RiffShareFlat.prototype.userActionClearAll = function () {
	this.saveState();
	addStateToHistory();
	var d = this.copyDrums();
	var t = this.copyTones();
	riffshareflat.pushAction({
		caption: 'Clear all',
		undo: function () {
			riffshareflat.storeDrums = d;
			riffshareflat.storeTracks = t;
			riffshareflat.mark = null;
		},
		redo: function () {
			riffshareflat.storeDrums = [];
			riffshareflat.storeTracks = [];
			riffshareflat.mark = null;
		}
	});
};
RiffShareFlat.prototype.userActionChangeScheme = function (nn) {
	var olds = this.bgMode;
	var news = nn;
	riffshareflat.pushAction({
		caption: 'Change background mode ' + nn,
		undo: function () {
			riffshareflat.setModeBackground(olds)
		},
		redo: function () {
			riffshareflat.setModeBackground(news)
		}
	});
};
RiffShareFlat.prototype.userActionReplaceDrum = function (drmNum, smplNum) {
	var me = this;
	var smplOld = drumInfo[drmNum].replacement;
	riffshareflat.pushAction({
		caption: 'Replace drum ' + smplNum,
		undo: function () {
			drumInfo[drmNum].replacement = smplOld;
			if (smplOld) {
				drumInfo[drmNum].info = me.player.loader.drumInfo(smplOld - 1);
			} else {
				drumInfo[drmNum].info = null;
			}
		},
		redo: function () {
			drumInfo[drmNum].replacement = smplNum;
			if (smplNum) {
				drumInfo[drmNum].info = me.player.loader.drumInfo(smplNum - 1);
			} else {
				drumInfo[drmNum].info = null;
			}
		}
	});
};
RiffShareFlat.prototype.userActionReplaceIns = function (insNum, smplNum) {
	var me = this;
	var smplOld = trackInfo[insNum].replacement;
	riffshareflat.pushAction({
		caption: 'Replace instrument ' + smplNum,
		undo: function () {
			trackInfo[insNum].replacement = smplOld;
			if (smplOld) {
				trackInfo[insNum].info = me.player.loader.instrumentInfo(smplOld - 1);
			} else {
				trackInfo[insNum].info = null;
			}
		},
		redo: function () {
			trackInfo[insNum].replacement = smplNum;
			if (smplNum) {
				trackInfo[insNum].info = me.player.loader.instrumentInfo(smplNum - 1);
			} else {
				trackInfo[insNum].info = null;
			}
		}
	});
};
window.onload = function () {
	console.log('create riffshareflat');
	new RiffShareFlat();
	riffshareflat.init();
};
