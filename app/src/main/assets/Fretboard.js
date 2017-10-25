console.log('fretshare v1.0.14');
function FretShare() {
	window.fretshare = this;
	return this;
}
FretShare.prototype.init = function () {
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
	this.queueAhead = 0.75;
	console.log('queueAhead', this.queueAhead);
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
	this.trackInfo = [{
			title: 'Bass guitar',
			sound: _tone_0340_Aspirin_sf2_file,
			volume: 70,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}, {
			title: 'Acoustic guitar',
			sound: _tone_0250_Chaos_sf2_file,
			volume: 70,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.5
		}, {
			title: 'Distortion guitar',
			sound: _tone_0300_LesPaul_sf2_file,
			volume: 70,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.7
		}
		, {
			title: 'PalmMute distortion',
			sound: _tone_0280_LesPaul_sf2_file,
			volume: 70,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.5
		}
		, {
			title: 'PalmMute clean',
			sound: _tone_0280_JCLive_sf2_file,
			volume: 70,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.5
		}
	];
	this.strings = [28, 23, 19, 14, 9, 4];
	this.notes = [];
	this.beats = [];
	/*
	= [{
	beat: 33,
	length: 2,
	string: 2,
	fret: 4
	}, {
	beat: 5,
	length: 2,
	string: 3,
	fret: 2
	}, {
	beat: 0,
	length: 2,
	string: 5,
	fret: 1
	}, {
	beat: 5,
	length: 2,
	string: 4,
	fret: 5
	}, {
	beat: 16,
	length: 5,
	string: 0,
	fret: 0
	}, {
	beat: 17,
	length: 4,
	string: 1,
	fret: 1
	}, {
	beat: 18,
	length: 3,
	string: 2,
	fret: 2
	}, {
	beat: 19,
	length: 2,
	string: 3,
	fret: 3
	}, {
	beat: 20,
	length: 1,
	string: 4,
	fret: 4
	}, {
	beat: 21,
	length: 5,
	string: 5,
	fret: 5
	}, {
	beat: 34,
	length: 8,
	string: 0,
	fret: 9
	}, {
	beat: 34,
	length: 8,
	string: 1,
	fret: 7
	}, {
	beat: 35,
	length: 8,
	string: 2,
	fret: 5
	}, {
	beat: 35,
	length: 8,
	string: 3,
	fret: 3
	}, {
	beat: 35,
	length: 8,
	string: 4,
	fret: 1
	}, {
	beat: 35,
	length: 8,
	string: 5,
	fret: 19
	}
	];*/
	/*
	this.trackGroups = [];
	this.trackGroups[7] = document.getElementById('track1Group');
	this.trackGroups[6] = document.getElementById('track2Group');
	this.trackGroups[5] = document.getElementById('track3Group');
	this.trackGroups[4] = document.getElementById('track4Group');
	this.trackGroups[3] = document.getElementById('track5Group');
	this.trackGroups[2] = document.getElementById('track6Group');
	this.trackGroups[1] = document.getElementById('track7Group');
	this.trackGroups[0] = document.getElementById('track8Group');
	 */
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
	this.translateZ = 1;
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
	this.tempo = sureInList(readTextFromlocalStorage('frettempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220]);
	this.selchan = sureInList(readTextFromlocalStorage('fretchan'), 1, [0, 1, 2]);
	this.bgMode = sureInList(readTextFromlocalStorage('fretbgMode'), 0, [0, 1, 2]);
	this.contentDiv.style.background = modeBackground(this.bgMode);
	//this.drumVolumes = [];
	/*for (var i = 0; i < 8; i++) {
	this.drumVolumes.push(sureNumeric(readObjectFromlocalStorage('drum' + i), 0, 70, 100));
	}*/
	//this.equalizer = [];
	/*for (var i = 0; i < 10; i++) {
	this.equalizer.push(sureNumeric(readObjectFromlocalStorage('equalizer' + i), -10, 0, 10));
	}*/
	//this.drumInfo = drumInfo;
	//this.trackInfo = trackInfo;
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
		fretshare.resetSize();
	};
	window.onbeforeunload = function () {
		fretshare.saveState();
	};
	window.onblur = function () {
		fretshare.saveState();
	};
	var flatstate = readObjectFromlocalStorage('fretflatstate');
	//console.log(flatstate);
	if (flatstate) {
		try {
			if (flatstate.tx) {
				this.translateX = flatstate.tx;
			}
			if (flatstate.ty) {
				this.translateY = flatstate.ty;
			}
			if (flatstate.tz) {
				this.translateZ = flatstate.tz;
			}
			/*if (flatstate.orders) {
			for (var i = 0; i < 8; i++) {
			var o = sureNumeric(flatstate.orders[i], 0, i, 7);
			fretshare.trackInfo[i].order = o;
			}
			flatstate.orders.sort();
			for (var i = 0; i < 8; i++) {
			if (flatstate.orders[i] == i) {
			//
			} else {
			for (var n = 0; n < 8; n++) {
			fretshare.trackInfo[n].order = fretshare.trackInfo[n].nn;
			}
			break;
			}
			}
			}*/
		} catch (ex) {
			console.log(ex);
		}
	}
	//this.storeDrums = sureArray(readObjectFromlocalStorage('storeDrums'), []);
	//console.log(this.storeDrums, readObjectFromlocalStorage('storeDrums'));
	/*try {
	var le = this.storeDrums.length;
	} catch (t) {
	console.log(t);
	this.storeDrums = [];
	}*/
	//this.storeTracks = sureArray(readObjectFromlocalStorage('storeTracks'), []);


	this.notes = sureArray(readObjectFromlocalStorage('storeFrets'), []);
	this.beats = sureArray(readObjectFromlocalStorage('storeBeats'), []);

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
	this.reverberator = new WebAudioFontReverberator(this.audioContext);
	this.reverberator.output.connect(this.audioContext.destination);
	this.master = new WebAudioFontChannel(this.audioContext);
	this.master.output.connect(this.reverberator.input);
	for (var i = 0; i < this.trackInfo.length; i++) {

		this.trackInfo[i].audioNode = this.audioContext.createGain();
		this.trackInfo[i].audioNode.connect(this.master.input);
		this.player.adjustPreset(this.audioContext, this.trackInfo[i].sound);
		//console.log(i,this.trackInfo[i].audioNode);
	}
	//console.log(this.trackInfo);
	/*for (var i = 0; i < 8; i++) {
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
	}*/
	this.resetSize();
	//setInterval(fretshare.moveCounter, 100);
	setInterval(fretshare.moveBeatCounter, 100);

	console.log('done init');
};
FretShare.prototype.saveState = function () {
	this.stopPlay();

	var flatstate = {
		tx: this.translateX,
		ty: this.translateY,
		tz: this.translateZ,
		orders: []
	};
	/*for (var i = 0; i < 8; i++) {
	flatstate.orders.push(this.trackInfo[i].order);
	}*/
	saveObject2localStorage('fretflatstate', flatstate);
	saveText2localStorage('frettempo', '' + this.tempo);
	saveText2localStorage('fretchan', '' + this.selchan);

	/*
	for (var i = 0; i < 8; i++) {
	saveText2localStorage('drum' + i, '' + this.drumVolumes[i]);
	saveText2localStorage('track' + i, '' + this.trackInfo[7 - i].volume);
	}
	for (var i = 0; i < 10; i++) {
	saveText2localStorage('equalizer' + i, '' + this.equalizer[i]);
	}
	saveObject2localStorage('storeDrums', this.storeDrums);
	saveObject2localStorage('storeTracks', this.storeTracks);
	 */
	saveObject2localStorage('storeFrets', this.notes);
	saveObject2localStorage('storeBeats', this.beats);
	window.onunload = null;
};
FretShare.prototype.copyDrums = function () {
	var drums = [];
	for (var i = 0; i < this.storeDrums.length; i++) {
		drums.push({
			beat: this.storeDrums[i].beat,
			drum: this.storeDrums[i].drum
		});
	}
	return drums;
};
FretShare.prototype.copyTones = function () {
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
FretShare.prototype.copyNotes = function () {
	var notes = [];
	for (var i = 0; i < this.notes.length; i++) {
		notes.push({
			beat: this.notes[i].beat,
			fret: this.notes[i].fret,
			string: this.notes[i].string,
			length: this.notes[i].length
		});
	}
	return notes;
};
FretShare.prototype.setupInput = function () {
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
FretShare.prototype.rakeMouseWheel = function (e) {
	e.preventDefault();
	var e = window.event || e;
	var wheelVal = e.wheelDelta || -e.detail;
	var min = Math.min(1, wheelVal);
	var delta = Math.max(-1, min);
	var zoom = fretshare.translateZ + delta * (fretshare.translateZ) * 0.077;
	if (zoom < fretshare.minZoom) {
		zoom = fretshare.minZoom;
	}
	if (zoom > fretshare.maxZoom) {
		zoom = fretshare.maxZoom;
	}
	fretshare.translateX = fretshare.translateX - (fretshare.translateZ - zoom) * e.layerX;
	fretshare.translateY = fretshare.translateY - (fretshare.translateZ - zoom) * e.layerY;
	fretshare.translateZ = zoom;
	fretshare.adjustContentPosition();
	fretshare.queueTiles();
	return false;
};
FretShare.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
	fretshare.rakeDiv.addEventListener('mousemove', fretshare.rakeMouseMove, true);
	window.addEventListener('mouseup', fretshare.rakeMouseUp, false);
	fretshare.startMouseScreenX = mouseEvent.clientX;
	fretshare.startMouseScreenY = mouseEvent.clientY;
	fretshare.clickX = fretshare.startMouseScreenX;
	fretshare.clickY = fretshare.startMouseScreenY;
};
FretShare.prototype.rakeMouseMove = function (mouseEvent) {
	mouseEvent.preventDefault();
	var dX = mouseEvent.clientX - fretshare.startMouseScreenX;
	var dY = mouseEvent.clientY - fretshare.startMouseScreenY;
	fretshare.translateX = fretshare.translateX + dX * fretshare.translateZ;
	fretshare.translateY = fretshare.translateY + dY * fretshare.translateZ;
	fretshare.startMouseScreenX = mouseEvent.clientX;
	fretshare.startMouseScreenY = mouseEvent.clientY;
	fretshare.moveZoom();
};
FretShare.prototype.rakeMouseUp = function (mouseEvent) {
	mouseEvent.preventDefault();
	fretshare.rakeDiv.removeEventListener('mousemove', fretshare.rakeMouseMove, true);
	if (Math.abs(fretshare.clickX - mouseEvent.clientX) < fretshare.translateZ * fretshare.tapSize / 8 //
		 && Math.abs(fretshare.clickY - mouseEvent.clientY) < fretshare.translateZ * fretshare.tapSize / 8) {
		fretshare.click();
	}
	fretshare.adjustContentPosition();
	fretshare.queueTiles();
};
FretShare.prototype.startTouchZoom = function (touchEvent) {
	fretshare.twoZoom = true;
	var p1 = fretshare.vectorFromTouch(touchEvent.touches[0]);
	var p2 = fretshare.vectorFromTouch(touchEvent.touches[1]);
	fretshare.twocenter = fretshare.vectorFindCenter(p1, p2);
	var d = fretshare.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	fretshare.twodistance = d;
};
FretShare.prototype.rakeTouchStart = function (touchEvent) {
	touchEvent.preventDefault();
	fretshare.startedTouch = true;
	if (touchEvent.touches.length < 2) {
		fretshare.twoZoom = false;
		fretshare.startMouseScreenX = touchEvent.touches[0].clientX;
		fretshare.startMouseScreenY = touchEvent.touches[0].clientY;
		fretshare.clickX = fretshare.startMouseScreenX;
		fretshare.clickY = fretshare.startMouseScreenY;
		fretshare.twodistance = 0;
		return;
	} else {
		fretshare.startTouchZoom(touchEvent);
	}
};
FretShare.prototype.rakeTouchMove = function (touchEvent) {
	touchEvent.preventDefault();
	if (touchEvent.touches.length < 2) {
		if (fretshare.twoZoom) {
			//
		} else {
			var dX = touchEvent.touches[0].clientX - fretshare.startMouseScreenX;
			var dY = touchEvent.touches[0].clientY - fretshare.startMouseScreenY;
			fretshare.translateX = fretshare.translateX + dX * fretshare.translateZ;
			fretshare.translateY = fretshare.translateY + dY * fretshare.translateZ;
			fretshare.startMouseScreenX = touchEvent.touches[0].clientX;
			fretshare.startMouseScreenY = touchEvent.touches[0].clientY;
			fretshare.moveZoom();
			return;
		}
	} else {
		if (!fretshare.twoZoom) {
			fretshare.startTouchZoom(touchEvent);
		} else {
			var p1 = fretshare.vectorFromTouch(touchEvent.touches[0]);
			var p2 = fretshare.vectorFromTouch(touchEvent.touches[1]);
			var d = fretshare.vectorDistance(p1, p2);
			if (d <= 0) {
				d = 1;
			}
			var ratio = d / fretshare.twodistance;
			fretshare.twodistance = d;
			var zoom = fretshare.translateZ / ratio;
			if (zoom < fretshare.minZoom) {
				zoom = fretshare.minZoom;
			}
			if (zoom > fretshare.maxZoom) {
				zoom = fretshare.maxZoom;
			}
			fretshare.translateX = fretshare.translateX - (fretshare.translateZ - zoom) * fretshare.twocenter.x;
			fretshare.translateY = fretshare.translateY - (fretshare.translateZ - zoom) * fretshare.twocenter.y;
			fretshare.translateZ = zoom;
			fretshare.adjustContentPosition();
		}
	}
};

FretShare.prototype.rakeTouchEnd = function (touchEvent) {
	touchEvent.preventDefault();
	fretshare.queueTiles();
	if (!fretshare.twoZoom) {
		if (touchEvent.touches.length < 2) {
			if (fretshare.startedTouch) {
				if (Math.abs(fretshare.clickX - fretshare.startMouseScreenX) < fretshare.translateZ * fretshare.tapSize / 8 //
					 && Math.abs(fretshare.clickY - fretshare.startMouseScreenY) < fretshare.translateZ * fretshare.tapSize / 8) {
					fretshare.click();
				}
			} else {
				//console.log('touch ended already');
			}
			fretshare.adjustContentPosition();
			return;
		}
	}
	fretshare.twoZoom = false;
	fretshare.startedTouch = false;
	fretshare.adjustContentPosition();
};
FretShare.prototype.click = function () {
	var xy = this.unzoom(this.clickX, this.clickY, this.translateZ);
	this.clickContentX = xy.x;
	this.clickContentY = xy.y;
	this.runSpots(this.clickContentX, this.clickContentY);
};
FretShare.prototype.vectorDistance = function (xy1, xy2) {
	var xy = this.vectorSubstract(xy1, xy2);
	var n = this.vectorNorm(xy);
	return n;
};
FretShare.prototype.vectorSubstract = function (xy1, xy2) {
	return {
		x: xy1.x - xy2.x,
		y: xy1.y - xy2.y
	};
};
FretShare.prototype.vectorNorm = function (xy) {
	return Math.sqrt(this.vectorNormSquared(xy));
};
FretShare.prototype.vectorNormSquared = function (xy) {
	return xy.x * xy.x + xy.y * xy.y;
};
FretShare.prototype.vectorFromTouch = function (touch) {
	return {
		x: touch.clientX,
		y: touch.clientY
	};
};
FretShare.prototype.vectorFindCenter = function (xy1, xy2) {
	var xy = this.vectorAdd(xy1, xy2);
	return this.vectorScale(xy, 0.5);
};
FretShare.prototype.vectorAdd = function (xy1, xy2) {
	return {
		x: xy1.x + xy2.x,
		y: xy1.y + xy2.y
	};
};
FretShare.prototype.vectorScale = function (xy, coef) {
	return {
		x: xy.x * coef,
		y: xy.y * coef
	};
};
FretShare.prototype.unzoom = function (x, y, z) {
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
FretShare.prototype.addSpot = function (id, x, y, w, h, a, stickX, toZoom) {
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
FretShare.prototype.runSpots = function (x, y) {
	//console.log('runSpots', x, y);
	var needRedraw = false;
	for (var i = this.spots.length - 1; i >= 0; i--) {
		var spot = this.spots[i];
		var checkX = spot.x;
		var checkY = spot.y;
		if (spot.sx) {
			checkX = spot.x + this.stickedX;
		}
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			//console.log('spot', spot);
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
FretShare.prototype.startSlideTo = function (x, y, z) {
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
FretShare.prototype.stepSlideTo = function (xyz) {
	var n = xyz.shift();
	if (n) {
		this.translateX = n.x;
		this.translateY = n.y;
		this.translateZ = n.z;
		this.adjustContentPosition();
		setTimeout(function () {
			fretshare.stepSlideTo(xyz);
		}, 20);
	} else {
		this.resetAllLayersNow();
	}
};
FretShare.prototype.adjustContentPosition = function () {
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
FretShare.prototype.moveZoom = function () {
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
FretShare.prototype.reLayoutVertical = function () {
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
FretShare.prototype.__reLayoutBackGroundImge = function () {
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
FretShare.prototype._reLayoutBackGroundImge = function () {
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
FretShare.prototype.resetAllLayersNow = function () {
	this.clearLayerChildren([this.contentGroup]);
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
};
FretShare.prototype.queueTiles = function () {
	//console.log('queueTiles', this.timeOutID);
	if (this.timeOutID > 0) {
		return;
	}
	this.timeOutID = setTimeout(function () {
			fretshare.timeOutID = 0;
			fretshare.resetTiles();
		}, 100);
};
FretShare.prototype.resetTiles = function () {
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
	this.addContent(xx, yy, ww, hh);
	this.reLayoutVertical();
};
FretShare.prototype.addContent = function (x, y, w, h) {
	//this.clearLayers([this.gridLayer]);
	//this.clearSpots();
	this.clearUselessDetails(x, y, w, h, this.contentGroup);
	this.addSmallTiles(x, y, w, h);
};
FretShare.prototype.startPlay = function () {
	if (this.onAir) {
		console.log('on air already');
		return;
	}
	console.log('startPlay');
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
FretShare.prototype.queueNextBeats = function () {
	//console.log('queueNextBeats', this.nextWhen,this.audioContext.currentTime);
	if (this.onAir) {
		var beat16duration = (4 * 60 / this.tempo) / 16;
		var pieceLen16 = 16 * fretshare.cauntMeasures();
		var t = this.audioContext.currentTime;
		if (this.nextWhen < t) {
			this.nextWhen = t;
		}
		while (this.sentWhen < t + this.queueAhead) {
			this.sendNextBeats(this.nextWhen, this.nextBeat, this.nextBeat);
			this.nextWhen = this.sentWhen + beat16duration;
			this.nextBeat = this.nextBeat + 1;
			if (this.nextBeat >= pieceLen16) {
				this.nextBeat = 0;
			}
		}
		//console.log('	envelopes', this.player.envelopes.length);
		var wait = 0.5 * 1000 * (this.nextWhen - this.audioContext.currentTime);
		this.moveBeatCounter();
		this.tickID = setTimeout(function () {
				fretshare.queueNextBeats();
			}, wait);
	}
}
FretShare.prototype.moveBeatCounter = function () {
	if (this.onAir) {
		if (this.counterLine) {
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

FretShare.prototype.stopPlay = function () {
	this.onAir = false;
	clearTimeout(this.tickID);
	this.player.cancelQueue(this.audioContext);
	this.resetAllLayersNow();
};
FretShare.prototype.resetNodeValues = function () {
	for (var i = 0; i < this.trackInfo.length; i++) {
		console.log(this.trackInfo[i]);
		this.trackInfo[i].audioNode.gain.value = this.trackInfo[i].volume / 100;
		//this.drumInfo[i].audioNode.gain.value = this.drumVolumes[i] / 100;
	}
	/*
	this.master.band32.gain.value = this.equalizer[0];
	this.master.band64.gain.value = this.equalizer[1];
	this.master.band128.gain.value = this.equalizer[2];
	this.master.band256.gain.value = this.equalizer[3];
	this.master.band512.gain.value = this.equalizer[4];
	this.master.band1k.gain.value = this.equalizer[5];
	this.master.band2k.gain.value = this.equalizer[6];
	this.master.band4k.gain.value = this.equalizer[7];
	this.master.band8k.gain.value = this.equalizer[8];
	this.master.band16k.gain.value = this.equalizer[9];
	 */
	//this.master.output.gain.value = 0.1;
};
FretShare.prototype.cauntMeasures = function () {
	var mx = 0;
	/*for (var i = 0; i < this.storeDrums.length; i++) {
	if (mx < this.storeDrums[i].beat) {
	mx = this.storeDrums[i].beat;
	}
	}
	for (var i = 0; i < this.storeTracks.length; i++) {
	if (mx < this.storeTracks[i].beat) {
	mx = this.storeTracks[i].beat;
	}
	}
	 */
	for (var i = 0; i < this.notes.length; i++) {
		if (mx < this.notes[i].beat) {
			mx = this.notes[i].beat;
		}
	}
	var le = Math.ceil((mx + 1) / 16);
	if (le > 16) {
		le = 16;
	}
	return le;
}
FretShare.prototype.cauntDrumMeasures = function () {
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
FretShare.prototype.cauntToneMeasures = function (nn) {
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
FretShare.prototype.sendNextBeats = function (when, startBeat, endBeat) {
	
	this.sentWhen = when;
	this.sentBeat = startBeat;
	var N = 4 * 60 / this.tempo;
	var beatLen = 1 / 16 * N;
	/*for (var i = 0; i < this.storeDrums.length; i++) {
	var hit = this.storeDrums[i];
	if (hit.beat >= startBeat && hit.beat <= endBeat) {
	var channel = this.drumInfo[hit.drum];
	var r = 1.0 - Math.random() * 0.2;
	this.player.queueWaveTable(this.audioContext, channel.audioNode, channel.sound, when + beatLen * (hit.beat - startBeat), channel.pitch, channel.length, r * channel.volumeRatio);
	}
	}*/
	var sorted = [];
	for (var i = 0; i < this.notes.length; i++) {
		var note = this.notes[i];
		if (note.beat >= startBeat && note.beat <= endBeat) {
			sorted.push(note);
		}
	}
	sorted.sort(function (n1, n2) {
		var r = 1000 * (n2.beat - n1.beat);

		if (n1.beat == n2.beat) {
			if (fretshare.beats[n1.beat] == 1) {
				r = r + (n1.string - n2.string);
			} else {
				r = r + (n2.string - n1.string);
			}
		}
		return r;
	});
	//console.log(sorted);
	var currentBeat = -1;
	//var currentTrack = -1;
	var inChordCount = 0;
	for (var i = 0; i < sorted.length; i++) {
		var note = sorted[i];
		if (note.beat != currentBeat) {
			currentBeat = note.beat;
			//currentTrack = note.track;
			inChordCount = 0;
		}
		var channel = this.trackInfo[this.selchan];
		if (this.beats[note.beat] == 3 && this.selchan == 1) {
			channel = this.trackInfo[4];
		}
		if (this.beats[note.beat] == 3 && this.selchan == 2) {
			channel = this.trackInfo[3];
		}
		var r = 0.6 - Math.random() * 0.2;
		var pitch = channel.octave * 12 + note.fret + this.strings[note.string];
		var duration = 0.075 + note.length * beatLen;
		var volume = r * channel.volumeRatio;
		if (this.beats[note.beat] == 2) {
			duration = 0.05;
			volume = volume * 1.5;
		}
		this.player.queueWaveTable(this.audioContext, channel.audioNode, channel.sound, when + beatLen * (note.beat - startBeat) + inChordCount * channel.inChordDelay, pitch, duration, volume);
		inChordCount++;
	}
};

FretShare.prototype.addSmallTiles = function (left, top, width, height) {
	var x = 0;
	var y = 0;
	var w = this.innerWidth;
	var h = this.innerHeight;
	var g = this.rakeGroup(x, y, w, h, 'grdlin', this.paneGroup, left, top, width, height);
	if (g) {
		//this.tileRectangle(g, 0, 0, this.innerWidth, this.innerHeight, 'rgba(0,0,0,0.8)');
		//this.tileText(g, x - this.tapSize * 0.5, y + this.tapSize * 4, this.tapSize * 7, 'RiffShare', '#333');

		this.tileCircle(g, 1.5 * this.tapSize, 1.5 * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		var startLabel = 'Play';
		if (this.onAir) {
			startLabel = 'Stop';
		}
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 1.75, this.tapSize, startLabel, modeDrumColor(this.bgMode));
		this.addSpot('plybt', 1 * this.tapSize, 1 * this.tapSize, (this.marginLeft - 2) * this.tapSize, this.tapSize * 1, function () {
			if (fretshare.onAir) {
				fretshare.stopPlay();
			} else {
				fretshare.startPlay();
			}
		});
		/*
		this.tileCircle(g, 1.5 * this.tapSize, (9 + 1.5 * 1) * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * (9.3 + 1.5 * 1), this.tapSize * 0.9, 'Save & Share', '#fff');
		this.addSpot('svsh', 1 * this.tapSize, (8.5 + 1.5 * 1) * this.tapSize, (this.marginLeft - 2) * this.tapSize, this.tapSize, function () {
		window.open('export.html', '_self')
		});*/
		this.tileCircle(g, 1.5 * this.tapSize, 3 * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 3.25, 1 * this.tapSize, 'File', modeDrumColor(this.bgMode));
		//console.log(this.marginLeft * this.tapSize, this.tapSize * 6);
		this.addSpot('flop', 1 * this.tapSize, 2.5 * this.tapSize, (this.marginLeft - 2) * this.tapSize, this.tapSize * 1, function () {
			window.open('fretfile.html', '_self')
		});
		this.tileCircle(g, 1.5 * this.tapSize, 4.5 * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 4.75, 1 * this.tapSize, 'Clear all', modeDrumColor(this.bgMode));
		this.addSpot('clrsng', 1 * this.tapSize, 4 * this.tapSize, (this.marginLeft - 2) * this.tapSize, 1 * this.tapSize, function () {
			fretshare.userActionClearChords();
		});

		this.tileCircle(g, 1.5 * this.tapSize, 6 * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 6.25, 1 * this.tapSize, 'Repeat chords', modeDrumColor(this.bgMode));
		this.addSpot('rptsng', 1 * this.tapSize, 5.5 * this.tapSize, (this.marginLeft - 2) * this.tapSize, 1 * this.tapSize, function () {
			fretshare.userRepeatChords();
		});

		this.tileCircle(g, 1.5 * this.tapSize, 10.5 * this.tapSize, 0.5 * this.tapSize, this.selchan == 0 ? modeDrumColor(this.bgMode) : modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 10.75, 1 * this.tapSize, this.trackInfo[0].title, modeDrumColor(this.bgMode));
		this.addSpot('ins0', 1 * this.tapSize, 10 * this.tapSize, (this.marginLeft - 2) * this.tapSize, 1 * this.tapSize, function () {
			fretshare.userActionChangeChannel(0);
		});
		this.tileCircle(g, 1.5 * this.tapSize, 12 * this.tapSize, 0.5 * this.tapSize, this.selchan == 1 ? modeDrumColor(this.bgMode) : modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 12.25, 1 * this.tapSize, this.trackInfo[1].title, modeDrumColor(this.bgMode));
		this.addSpot('ins1', 1 * this.tapSize, 11.5 * this.tapSize, (this.marginLeft - 2) * this.tapSize, 1 * this.tapSize, function () {
			fretshare.userActionChangeChannel(1);
		});
		this.tileCircle(g, 1.5 * this.tapSize, 13.5 * this.tapSize, 0.5 * this.tapSize, this.selchan == 2 ? modeDrumColor(this.bgMode) : modeDrumShadow(this.bgMode));
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 13.75, 1 * this.tapSize, this.trackInfo[2].title, modeDrumColor(this.bgMode));
		this.addSpot('ins2', 1 * this.tapSize, 13 * this.tapSize, (this.marginLeft - 2) * this.tapSize, 1 * this.tapSize, function () {
			fretshare.userActionChangeChannel(2);
		});

		/*
		this.tileCircle(g, 7 * this.tapSize, 52 * this.tapSize, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileText(g, 7 * this.tapSize, y + this.tapSize * 52.3, this.tapSize * 1.0, 'Swap with ' + this.findTrackInfo(1).title, this.findTrackInfo(1).color);
		this.addSpot('swp', 6.5 * this.tapSize, 51.5 * this.tapSize, (this.marginLeft - 7.5) * this.tapSize, this.tapSize, function () {
		//console.log(fretshare.findTrackInfo(0).title,'<->',fretshare.findTrackInfo(1).title);
		fretshare.userActionSwap(); //fretshare.findTrackInfo(0).nn,fretshare.findTrackInfo(1).nn);
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
		fretshare.userUpInstrument();
		});
		this.addSpot('octdwn', 2 * this.tapSize, 51.5 * this.tapSize, this.tapSize, this.tapSize, function () {
		fretshare.userDownInstrument();
		});
		this.addSpot('clrtrak', 3 * this.tapSize, 51.5 * this.tapSize, this.tapSize, this.tapSize, function () {
		fretshare.userClearInstrument();
		});
		 */
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

		/*
		var in16 = fretshare.cauntToneMeasures(this.findTrackInfo(0).nn);

		var stopX = (16 * in16 + this.marginLeft + 0.5) * this.tapSize;
		//console.log('len',fretshare.cauntMeasures());
		this.tileCircle(g, stopX, 0.5 * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, stopX - 0.25 * this.tapSize, 0.75 * this.tapSize, this.tapSize * 1.0, 'Repeat ' + this.findTrackInfo(0).title, this.findTrackInfo(0).color);
		this.addSpot('rptins', stopX - 0.5 * this.tapSize, 0, this.tapSize, this.tapSize, function () {
		fretshare.userRepeatInstrument();
		});
		var dr16 = fretshare.cauntDrumMeasures();
		stopX = (16 * dr16 + this.marginLeft + 0.5) * this.tapSize;
		this.tileCircle(g, stopX, (12 * 5 + 8 + 1.5) * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, stopX - 0.25 * this.tapSize, (12 * 5 + 8 + 1.75) * this.tapSize, this.tapSize * 1.0, 'Repeat Drums', modeDrumColor(this.bgMode));
		this.addSpot('rptdrms', stopX - 0.5 * this.tapSize, (12 * 5 + 8 + 1) * this.tapSize, this.tapSize, this.tapSize, function () {
		//console.log('rptdrms');
		fretshare.userRepeatDrums();
		});
		this.tileCircle(g, (this.marginLeft + 0.5) * this.tapSize, (12 * 5 + 8 + 1.5) * this.tapSize, 0.5 * this.tapSize, modeDrumShadow(this.bgMode));
		this.tileText(g, (this.marginLeft + 0.5) * this.tapSize, (12 * 5 + 8 + 1.75) * this.tapSize, this.tapSize * 1.0, 'Clear Drums', modeDrumColor(this.bgMode));
		this.addSpot('clrdrms', (this.marginLeft) * this.tapSize, (12 * 5 + 8 + 1) * this.tapSize, this.tapSize, this.tapSize, function () {
		fretshare.userClearDrum();
		});

		for (var i = 0; i < in16; i++) {
		var tx = (16 * i + this.marginLeft + 0.5) * this.tapSize;
		var ty = 0.5 * this.tapSize;
		this.tileCircle(g, tx, ty, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileLine(g, tx, ty - 0.3 * this.tapSize, tx - 0.3 * this.tapSize, ty + 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, tx, ty - 0.3 * this.tapSize, tx + 0.3 * this.tapSize, ty + 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		var s = this.addSpot('supins' + i, tx - 0.5 * this.tapSize, 0, this.tapSize, this.tapSize, function () {
		//console.log('up' + this.i);
		fretshare.userUpMeasure(this.i);
		});
		s.i = i;
		this.tileCircle(g, tx + this.tapSize, ty, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileLine(g, tx + this.tapSize, ty + 0.3 * this.tapSize, tx + 0.7 * this.tapSize, ty - 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		this.tileLine(g, tx + this.tapSize, ty + 0.3 * this.tapSize, tx + 1.3 * this.tapSize, ty - 0.1 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
		s = this.addSpot('sdwnins' + i, tx + 0.5 * this.tapSize, 0, this.tapSize, this.tapSize, function () {
		//console.log('down' + this.i);
		fretshare.userDownMeasure(this.i);
		});
		s.i = i;
		}
		 */
	}

	//this.tileFrets(left, top, width, height);
	//this.tileEqualizer(left, top, width, height);
	//this.tileDrumVolumes(left, top, width, height);
	//this.tileToneVolumes(left, top, width, height);
	this.tileTempo(left, top, width, height);
	this.tileColorMode(left, top, width, height);
	//this.tilePianoLines(left, top, width, height);
	this.tileCounter(left, top, width, height);
	this.tileFretStrings(left, top, width, height);
	this.tileFretBars(left, top, width, height);
	this.tileBarNumbers(left, top, width, height);
	this.tileNoteLines(left, top, width, height);
	this.tileNoteSpots(left, top, width, height);
	this.tileNoteChooser(left, top, width, height);
	/*
	try {
	this.tileDrums(left, top, width, height);
	} catch (e) {
	console.log(e);
	}
	try {
	this.tileTones(left, top, width, height);
	} catch (e) {
	console.log(e);
	}*/
};
FretShare.prototype.noteLabelColor = function (bgMode, fret) {
	if (bgMode == 2) {
		return '#fff'
	} else {
		return '#000'
	}
};
FretShare.prototype.noteColor = function (bgMode, fret) {
	if (bgMode == 2) {
		if (fret < 1) {
			return '#000'
		}
		if (fret < 2) {
			return '#222'
		}
		if (fret < 3) {
			return '#444'
		}
		if (fret < 4) {
			return '#666'
		}
		if (fret < 5) {
			return '#777'
		}
		if (fret < 6) {
			return '#888'
		}
		return '#999'
	} else {
		if (fret < 1) {
			return '#fff'
		}
		if (fret < 2) {
			return '#ddd'
		}
		if (fret < 3) {
			return '#bbb'
		}
		if (fret < 4) {
			return '#999'
		}
		if (fret < 5) {
			return '#888'
		}
		if (fret < 6) {
			return '#777'
		}
		return '#666'
	}
};
FretShare.prototype.tileNoteLines = function (left, top, width, height) {
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16;
	var h = this.tapSize * 12 * 5;
	for (var i = 0; i < 16; i++) {
		var x = this.tapSize * (this.marginLeft + 16 * i);
		//this.tileLine(g, x, y, x+1, y, '#000', 0.95*this.tapSize);
		var g = this.rakeGroup(x, y, w, h, 'nts' + i, this.linesGroup, left, top, width, height);
		if (g) {
			for (var n = 0; n < this.notes.length; n++) {
				var note = this.notes[n];
				if (note.beat >= i * 16 && note.beat < (i + 1) * 16) {
					var d = note.beat % 16;
					var xx = x + this.tapSize * (0.5 + d);
					var yy = y + this.tapSize * (note.string + 0.5);
					//this.tileCircle(g, xx, yy, this.tapSize / 2, 'rgba(127,127,127,0.95)');
					//var xx=x + this.tapSize * (0.5+d);
					this.tileLine(g, xx, yy, (note.length - 1) * this.tapSize + 1 + xx, yy, this.noteColor(this.bgMode, note.fret), 0.95 * this.tapSize);
					this.tileText(g, xx - 0.3 * this.tapSize, yy + 0.3 * this.tapSize, this.tapSize * 1.5, '' + (note.fret + 0), this.noteLabelColor(this.bgMode));
				}
			}
		}
	}
}
FretShare.prototype.tileNoteChooser = function (left, top, width, height) {
	if (this.mark) {
		var x = this.tapSize * (this.marginLeft + this.mark.beat);
		var y = this.tapSize * (this.marginTop + this.mark.string);
		var w = 16 * this.tapSize;
		var h = 16 * this.tapSize;
		var g = this.rakeGroup(x, y, w, h, 'chsrmark', this.upperGroup, left, top, width, height);
		if (g) {
			this.tileRectangle(g, x, y, w, h, 'rgba(127,127,127,0.95)');
			for (var p = 1; p < 16; p++) {
				this.tileLine(g, x, y + p * this.tapSize, x + 16 * this.tapSize, y + p * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
			}
			for (var b = 1; b < 17; b++) {
				this.tileLine(g, x + b * this.tapSize, y, x + b * this.tapSize, y + 16 * this.tapSize, modeBackground(this.bgMode), 0.1 * this.tapSize);
			}
			this.tileText(g, x + 0.15 * this.tapSize, y + this.tapSize * 0.8, this.tapSize * 1, '*', '#000');
			this.tileText(g, x + 0.15 * this.tapSize, y + this.tapSize * 3.8, this.tapSize * 1, 'III', '#222');
			this.tileText(g, x + 0.15 * this.tapSize, y + this.tapSize * 5.8, this.tapSize * 1, 'V', '#333');
			this.tileText(g, x + 0.15 * this.tapSize, y + this.tapSize * 7.8, this.tapSize * 1, 'VII', '#444');
			this.tileText(g, x + 0.15 * this.tapSize, y + this.tapSize * 9.8, this.tapSize * 1, 'IX', '#555');
			this.tileText(g, x + 0.15 * this.tapSize, y + this.tapSize * 12.8, this.tapSize * 1, 'XII', '#555');
			this.addSpot('lenSpot', x, y, w, h, function () {
				var length = 1 + Math.floor((fretshare.clickContentX - fretshare.tapSize * fretshare.marginLeft) / fretshare.tapSize) - fretshare.mark.beat;
				var fret = Math.floor((fretshare.clickContentY - fretshare.tapSize * fretshare.marginTop) / fretshare.tapSize) - fretshare.mark.string;
				//console.log('beat',fretshare.mark.beat, 'length',length,'string',fretshare.mark.string,'fret',fret);
				fretshare.userActionAddChord(fretshare.mark.beat, length, fretshare.mark.string, fret);
				fretshare.mark = null;
			});
		}
	}
};
FretShare.prototype.tileNoteSpots = function (left, top, width, height) {
	if (this.mark) {
		/*var x = this.tapSize * (this.marginLeft + this.mark.beat);
		var y = this.tapSize * (this.marginTop + 6 - this.mark.string - 1);
		var w = this.tapSize;
		var h = this.tapSize;
		var g = this.rakeGroup(x, y, w, h, 'mrk', this.upperGroup, left, top, width, height);
		if (g) {
		this.tileCircle(g, x + this.tapSize * 0.5, y + this.tapSize * 0.5, this.tapSize / 3, 'rgba(127,127,127,0.5)');
		}*/
	} else {
		this.addSpot('chordSpot', this.tapSize * this.marginLeft, this.tapSize * this.marginTop, this.tapSize * 16 * 17, this.tapSize * 6, function () {
			var beat = Math.floor((fretshare.clickContentX - fretshare.tapSize * fretshare.marginLeft) / fretshare.tapSize);
			var string = Math.floor((fretshare.clickContentY - fretshare.tapSize * fretshare.marginTop) / fretshare.tapSize);
			//console.log(beat, string);
			var note = fretshare.findChordNote(beat, string);
			if (note) {
				fretshare.userActionDropChord(note.beat, note.length, note.string, note.fret);
			} else {

				fretshare.mark = {
					beat: beat,
					string: string
				};
			}
		});
	}
};
FretShare.prototype.tileFretStrings = function (left, top, width, height) {
	var x = this.tapSize * this.marginLeft;
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16 * 17;
	var h = this.tapSize * 12 * 5;
	var g = this.rakeGroup(x, y, w, h, 'frlins', this.linesGroup, left, top, width, height);
	if (g) {
		//this.tileRectangle(g, x, y + this.tapSize * 0, w, this.tapSize * 0.01, modeDrumColor(this.bgMode));

		this.tileRectangle(g, x, y + this.tapSize * 0.5, w, this.tapSize * 0.05, modeDrumColor(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 1.5, w, this.tapSize * 0.07, modeDrumColor(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 2.5, w, this.tapSize * 0.09, modeDrumColor(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 3.5, w, this.tapSize * 0.11, modeDrumColor(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 4.5, w, this.tapSize * 0.13, modeDrumColor(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 5.5, w, this.tapSize * 0.14, modeDrumColor(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 6.5, 1, this.tapSize * 0.01, modeDrumColor(this.bgMode));
	}
};
FretShare.prototype.tileeatLabelUp = function (g, x, y) {
	this.tileLine(g, x + 0.5 * this.tapSize, y + 0.3 * this.tapSize, x + 0.5 * this.tapSize, y + 0.7 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
	this.tileLine(g, x + 0.5 * this.tapSize, y + 0.3 * this.tapSize, x + 0.3 * this.tapSize, y + 0.5 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
	this.tileLine(g, x + 0.5 * this.tapSize, y + 0.3 * this.tapSize, x + 0.7 * this.tapSize, y + 0.5 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
}
FretShare.prototype.tileeatLabelDown = function (g, x, y) {
	this.tileLine(g, x + 0.5 * this.tapSize, y + 0.3 * this.tapSize, x + 0.5 * this.tapSize, y + 0.7 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
	this.tileLine(g, x + 0.5 * this.tapSize, y + 0.7 * this.tapSize, x + 0.3 * this.tapSize, y + 0.5 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
	this.tileLine(g, x + 0.5 * this.tapSize, y + 0.7 * this.tapSize, x + 0.7 * this.tapSize, y + 0.5 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
}
FretShare.prototype.tileeatLabelX = function (g, x, y) {
	this.tileLine(g, x + 0.3 * this.tapSize, y + 0.3 * this.tapSize, x + 0.7 * this.tapSize, y + 0.7 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
	this.tileLine(g, x + 0.3 * this.tapSize, y + 0.7 * this.tapSize, x + 0.7 * this.tapSize, y + 0.3 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
}
FretShare.prototype.tileeatLabelPM = function (g, x, y) {
	this.tileLine(g, x + 0.2 * this.tapSize, y + 0.8 * this.tapSize, x + 0.8 * this.tapSize, y + 0.2 * this.tapSize, modeBackground(this.bgMode), this.tapSize / 10);
}
FretShare.prototype.tileBarNumbers = function (left, top, width, height) {
	var x = this.tapSize * this.marginLeft;
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16 * 17;
	var h = this.tapSize * 12 + 6 + 4
		var g = this.rakeGroup(x, y, w, h, 'brnm', this.linesGroup, left, top, width, height);
	if (g) {
		for (var i = 1; i < 17; i++) {
			this.tileText(g, x + (16 * i - 1.5) * this.tapSize, y + this.tapSize * 9, this.tapSize * 2, '' + (i + 0), modeDrumColor(this.bgMode));
		}
		for (var i = 0; i < 16 * 16; i++) {
			if (this.beatExists(i)) {
				this.tileCircle(g, x + this.tapSize * (i + 0.5), y + this.tapSize * 7, this.tapSize / 2, modeDrumShadow(this.bgMode));
				/*var lbl='v';
				if(this.beats[i]){
				lbl='^';
				if(this.beats[i]==2){
				lbl='x';
				}
				}
				this.tileText(g, x + ( i + 0.25) * this.tapSize, y + this.tapSize * 7.2, this.tapSize * 1.25, lbl , modeDrumColor(this.bgMode));
				 */
				if (this.beats[i]) {
					if (this.beats[i] == 3) {
						this.tileeatLabelPM(g, x + this.tapSize * i, y + this.tapSize * 6.5);
					} else {
						if (this.beats[i] == 2) {
							this.tileeatLabelX(g, x + this.tapSize * i, y + this.tapSize * 6.5);
						} else {
							this.tileeatLabelUp(g, x + this.tapSize * i, y + this.tapSize * 6.5);
						}
					}
				} else {
					this.tileeatLabelDown(g, x + this.tapSize * i, y + this.tapSize * 6.5);
				}
				var s = this.addSpot('beatMd' + i, x + this.tapSize * i, y + this.tapSize * 6.5, this.tapSize, this.tapSize, function () {
						//console.log('spot', this);
						//fretshare.setModeBackground(this.bgm)
						//fretshare.userActionChangeScheme(this.bgm);
						fretshare.userActionToggleBeatMode(this.beat);
					});
				s.beat = i;

			}
		}
	}
};
FretShare.prototype.tileFretBars = function (left, top, width, height) {
	var x = this.tapSize * this.marginLeft;
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16 * 17;
	var h = this.tapSize * 12 * 5;
	var g = this.rakeGroup(x, y, w, h, 'frbars', this.linesGroup, left, top, width, height);
	if (g) {
		for (var i = 1; i < 17; i++) {
			this.tileRectangle(g, x + (16 * i) * this.tapSize, y - 0.5 * this.tapSize, this.tapSize * 0.1, 7 * this.tapSize, modeDrumColor(this.bgMode));
			this.tileRectangle(g, x + (16 * i - 8) * this.tapSize, y, this.tapSize * 0.03, 6 * this.tapSize, modeDrumColor(this.bgMode));
			for (var n = 0; n < 15; n++) {
				this.tileRectangle(g, x + (16 * i - n - 1) * this.tapSize, y, this.tapSize * 0.005, 6 * this.tapSize, modeDrumColor(this.bgMode));
			}
			//this.tileText(g, x + (16 * i - 1.5) * this.tapSize, y + this.tapSize * 8, this.tapSize * 2, '' + (i + 0), modeDrumColor(this.bgMode));
		}
	}
};
FretShare.prototype.tileDrumMeasure = function (n, left, top, width, height) {
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
FretShare.prototype.existsDrum = function (beat, drum) {
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (this.storeDrums[i].beat == beat && this.storeDrums[i].drum == drum) {
			return true;
		}
	}
	return false;
}
FretShare.prototype.dropDrum = function (beat, drum) {
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (this.storeDrums[i].beat == beat && this.storeDrums[i].drum == drum) {
			this.storeDrums.splice(i, 1);
			break;
		}
	}
}
FretShare.prototype.setDrum = function (beat, drum) {
	this.dropDrum(beat, drum);
	this.storeDrums.push({
		beat: beat,
		drum: drum
	});
}
FretShare.prototype.tilePianoLines = function (left, top, width, height) {
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
FretShare.prototype.tileDrums = function (left, top, width, height) {
	for (var i = 0; i < 16; i++) {
		this.tileDrumMeasure(i, left, top, width, height);
	}
	this.addSpot('drumSpot', this.tapSize * this.marginLeft, this.tapSize * (this.marginTop + 12 * 5), this.tapSize * 16 * 16, this.tapSize * 8, function () {
		var beat = Math.floor((fretshare.clickContentX - fretshare.tapSize * fretshare.marginLeft) / fretshare.tapSize);
		var drum = Math.floor((fretshare.clickContentY - fretshare.tapSize * (fretshare.marginTop + 12 * 5)) / fretshare.tapSize);
		if (fretshare.existsDrum(beat, drum)) {
			fretshare.userActionDropDrum(beat, drum);
		} else {
			fretshare.userActionAddDrum(beat, drum);
		}
	});
};
FretShare.prototype.findNote = function (beat, pitch, track) {
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (this.storeTracks[i].track == track && this.storeTracks[i].pitch == pitch && this.storeTracks[i].beat == beat) {
			return this.storeTracks[i];
		}
	}
	return null;
};
FretShare.prototype.findChordNote = function (beat, string) {

	for (var i = 0; i < this.notes.length; i++) {
		if (this.notes[i].string == string && this.notes[i].beat == beat) {
			return this.notes[i];
		}
	}
	return null;
};
FretShare.prototype.beatExists = function (beat) {

	for (var i = 0; i < this.notes.length; i++) {
		if (this.notes[i].beat == beat) {
			return true;
		}
	}
	return false;
};
FretShare.prototype.dropNote = function (beat, pitch, track) {
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (this.storeTracks[i].track == track && this.storeTracks[i].pitch == pitch && this.storeTracks[i].beat == beat) {
			this.storeTracks.splice(i, 1);
			break;
		}
	}
};
FretShare.prototype.dropChordNote = function (beat, string) {
	for (var i = 0; i < this.notes.length; i++) {
		if (this.notes[i].string == string && this.notes[i].beat == beat) {
			this.notes.splice(i, 1);
			break;
		}
	}
};
FretShare.prototype.addNote = function (beat, pitch, track, length, shift) {
	this.storeTracks.push({
		beat: beat,
		pitch: pitch,
		track: track,
		length: length,
		shift: shift
	});
};
FretShare.prototype.addChordNote = function (beat, length, string, fret) {
	this.notes.push({
		beat: beat,
		length: length,
		string: string,
		fret: fret
	});
};
FretShare.prototype.pitchName = function (pitch) {
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
FretShare.prototype.tilePartTones = function (measure, octave, track, left, top, width, height, bottom) {
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

FretShare.prototype.tileCounter = function (left, top, width, height) {
	if (this.onAir) {
		var x = this.tapSize * this.marginLeft;
		var y = 0;
		var w = this.innerWidth;
		var h = this.tapSize * 8;
		var g = this.rakeGroup(x, y, w, h, 'cntr', this.counterGroup, left, top, width, height);
		if (g) {
			this.tileRectangle(g, 0, 0, this.tapSize * 0.001, this.tapSize * 0.001, '#000');
			this.tileRectangle(g, this.innerWidth, this.innerHeight, this.tapSize * 0.001, this.tapSize * 0.001, '#000');

			this.counterLine = this.tileRectangle(g, x + this.tapSize * 0.3, y, this.tapSize * 0.4, h, modeDrumColor(this.bgMode));
		}
	}
};
FretShare.prototype.tileTones = function (left, top, width, height) {
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
		var beat = Math.floor((fretshare.clickContentX - fretshare.tapSize * fretshare.marginLeft) / fretshare.tapSize);
		var pitch = 60 - Math.floor((fretshare.clickContentY - fretshare.tapSize * fretshare.marginTop) / fretshare.tapSize) - 1;
		var nn = fretshare.findTrackInfo(0).nn;
		if (fretshare.findNote(beat, pitch, nn)) {
			fretshare.userActionDropNote(beat, pitch, nn);
		} else {
			if (fretshare.mark) {
				var abeat = fretshare.mark.beat;
				var alength = beat - fretshare.mark.beat + 1;
				var apitch = fretshare.mark.pitch;
				var ashift = pitch - fretshare.mark.pitch;
				if (abeat > beat) {
					abeat = beat;
					alength = fretshare.mark.beat + 1 - beat;
					apitch = pitch;
					ashift = fretshare.mark.pitch - pitch;
				}
				fretshare.userActionAddNote(abeat, apitch, nn, alength, ashift);
				fretshare.mark = null;
			} else {
				if (beat < 16 * 16) {
					fretshare.mark = {
						beat: beat,
						pitch: pitch
					};
				}
			}
		}

	});
};
FretShare.prototype.setModeBackground = function (bgMode) {
	this.bgMode = bgMode;
	saveText2localStorage('fretbgMode', '' + bgMode);
	//console.log(this.bgMode,modeBackground(this.bgMode));
	this.contentDiv.style.background = modeBackground(this.bgMode);
};
/*
FretShare.prototype.modeDrumColor = function (bgMode) {
if (bgMode == 2) {
return '#033';
}
return '#ccc';
};
FretShare.prototype.modeDrumShadow = function (bgMode) {
if (bgMode == 2) {
return '#9a9';
}
return '#666';
};
FretShare.prototype.modeBackground = function (bgMode) {
if (bgMode == 1) {
return '#31424C';
}
if (bgMode == 2) {
//return '#C8D1D2';
return '#eef';
}
return '#000609';
};*/
FretShare.prototype.tileColorMode = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 6);
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
					//fretshare.setModeBackground(this.bgm)
					fretshare.userActionChangeScheme(this.bgm);
				});
			s.bgm = i;
		}
	}
};

FretShare.prototype.tileTempo = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 7.5);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tmpo', this.textGroup, left, top, width, height);
	var cw = 11 / 8;
	if (g) {
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * 11, this.tapSize * 0.9, modeDrumShadow(this.bgMode));
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * cw * (this.tempo - 60) / 20, this.tapSize * 0.9, modeDrumColor(this.bgMode));
		this.tileText(g, x - this.tapSize * 5.5, y + this.tapSize * 0.75, this.tapSize, 'Tempo ' + this.tempo + ' bpm', modeDrumColor(this.bgMode));
		for (var i = 0; i < 8; i++) {
			var s = this.addSpot('tempo' + i, x + this.tapSize * cw * i, y, this.tapSize * cw, this.tapSize, function () {
					fretshare.userActionTempo(this.tempo);
				});
			s.tempo = i * 20 + 80;
		}
	}
};
/*
FretShare.prototype.findTrackInfo = function (order) {
//console.log(this.trackInfo);
for (var i = 0; i < 8; i++) {
if (this.trackInfo[i].order == order) {
return this.trackInfo[i];
}
}
return null;
};*/
FretShare.prototype.getTrackOrders = function () {
	var o = [];
	for (var i = 0; i < 8; i++) {
		o.push(this.trackInfo[i].order);
	}
	return o;
};
FretShare.prototype.setTrackOrders = function (o) {
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].order = o[i];
	}
};
FretShare.prototype.upTrack = function (order) {
	var track = this.findTrackInfo(order);
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order < track.order) {
			this.trackInfo[i].order++;
		}
	}
	track.order = 0;
};
FretShare.prototype.tileToneVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 11);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tnvlm', this.linesGroup, left, top, width, height);
	var sk = 0;
	if (g) {
		for (var i = 0; i < 8; i++) {
			var track = this.findTrackInfo(i);
			if (i > 0) {
				sk = 2;
				//this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * (i + sk), this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.3)');
				this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * (i + sk), this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
				this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5 + sk), this.tapSize * 0.5, modeDrumShadow(this.bgMode));
				var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2 + sk), this.tapSize * 17, this.tapSize * 1, function () {
						fretshare.userActionUpTrack(this.order);
					});
				s.order = i;
				if (this.trackInfo[i].sound.zones[0].buffer) {
					this.tileText(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.75 + sk), this.tapSize * 1.0, track.title, track.color);
				}
				/*for (var v = 0; v < 11; v++) {
				var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * (i + sk), this.tapSize, this.tapSize, function () {
				fretshare.userActionToneVolume(this.track, this.volume);
				});
				s.track = track;
				s.volume = v * 10;
				}*/
			} else {
				this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * (i + sk), this.tapSize * 11, this.tapSize * 0.9, modeDrumShadow(this.bgMode));
				this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * (i + sk), this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
				this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5 + sk), this.tapSize * 0.5, modeDrumShadow(this.bgMode));
				/*var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2 + sk), this.tapSize * 5, this.tapSize * 1, function () {
				fretshare.userActionUpTrack(this.order);
				});
				s.order = i;*/
				if (this.trackInfo[i].sound.zones[0].buffer) {
					this.tileText(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.75 + sk), this.tapSize * 1.0, track.title, track.color);
				}
				for (var v = 0; v < 11; v++) {
					var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * (i + sk), this.tapSize, this.tapSize, function () {
							fretshare.userActionToneVolume(this.track, this.volume);
						});
					s.track = track;
					s.volume = v * 10;
				}
			}
		}
	}
};
FretShare.prototype.tileDrumVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drvlm', this.textGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 8; i++) {
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * 11, this.tapSize * 0.9, modeDrumShadow(this.bgMode));
			var n = this.drumVolumes[i] / 10;
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * (1 + n), this.tapSize * 0.9, modeDrumColor(this.bgMode));
			for (var v = 0; v < 11; v++) {
				var s = this.addSpot('voldru' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * i, this.tapSize, this.tapSize, function () {
						fretshare.userActionDrumVolume(this.drum, this.volume);
					});
				s.drum = i;
				s.volume = v * 10;
			}
			if (this.drumInfo[i].sound.zones[0].buffer) {
				this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * (i + 0.75), this.tapSize, this.drumInfo[i].title, modeDrumColor(this.bgMode));
			}
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
FretShare.prototype.tileFrets = function (left, top, width, height) {
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
FretShare.prototype.tileEqualizer = function (left, top, width, height) {
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
			var ey = n < 0 ? y + this.tapSize * 10 : y + this.tapSize * 10 - this.tapSize * n;
			this.tileRectangle(g, x + this.tapSize * i * sz, ey, this.tapSize * 0.95 * sz, this.tapSize * (1 + Math.abs(n)), modeDrumColor(this.bgMode));
			for (var v = -10; v <= 10; v++) {
				var s = this.addSpot('eq' + i + 'x' + v, x + this.tapSize * i * sz, y - this.tapSize * (v - 10), this.tapSize * 0.95 * sz, this.tapSize, function () {
						fretshare.userActionEqualizer(this.band, this.volume);
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
FretShare.prototype.msEdgeHook = function (g) {
	if (g.childNodes && (!(g.children))) {
		g.children = g.childNodes;
		//console.log('try layer.children',layer.children);
	}
};
FretShare.prototype.clearUselessDetails = function (x, y, w, h, layer) {
	this.msEdgeHook(layer);
	for (var i = 0; i < layer.children.length; i++) {
		var group = layer.children[i];
		this.clearUselessNodes(x, y, w, h, group);
	}
};
FretShare.prototype.clearUselessNodes = function (x, y, w, h, layer) {
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
FretShare.prototype.outOfView = function (child, x, y, w, h) {
	var tbb = child.getBBox();
	return !(this.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
};
FretShare.prototype.clearSpots = function () {
	this.spots = [];
};
FretShare.prototype.findSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			return this.spots[i];
		}
	}
	return null;
};
FretShare.prototype.dropSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			this.spots.splice(i, 1);
			break;
		}
	}
};
FretShare.prototype.rakeGroup = function (x, y, w, h, id, layer, left, top, width, height) {
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
FretShare.prototype.childExists = function (id, layer) {
	this.msEdgeHook(layer);
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (t.id == id) {
			return true;
		}
	}
	return false;
};
FretShare.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
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
FretShare.prototype.resetSize = function () {
	this.innerWidth = (this.marginLeft + this.marginRight + 16 * 16) * this.tapSize;
	this.innerHeight = (this.marginTop + this.marginBottom + 6 + 15) * this.tapSize;
	this.contentSVG.style.width = this.contentDiv.clientWidth + 'px';
	this.contentSVG.style.height = this.contentDiv.clientHeight + 'px';
	document.getElementById('undobutton').style.width = this.tapSize + 'px';
	document.getElementById('undobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.width = this.tapSize + 'px';
	document.getElementById('redobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.top = (5 * 2 + this.tapSize) + 'px';
	this.adjustContentPosition();
	this.queueTiles();
};
FretShare.prototype.tileLine = function (g, x1, y1, x2, y2, strokeColor, strokeWidth) {
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
FretShare.prototype.tileEllipse = function (g, x, y, rx, ry, fillColor, strokeColor, strokeWidth) {
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
/*FretShare.prototype.tilePolygon = function (g, x, y, r, fillColor, strokeColor, strokeWidth) {
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
FretShare.prototype.tileCircle = function (g, x, y, r, fillColor, strokeColor, strokeWidth) {
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
FretShare.prototype.tileRectangle = function (g, x, y, w, h, fillColor, strokeColor, strokeWidth, r) {
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
FretShare.prototype.tileText = function (g, x, y, fontSize, text, bgColor, strokeColor, strokeWidth, fontFamily, fontStyle) {
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
FretShare.prototype.clearLayerChildren = function (layers) {
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
FretShare.prototype.makeUndo = function (level) {
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
FretShare.prototype.clearUndo = function () {
	this.undoQueue = [];
	this.undoStep = 0;
}
FretShare.prototype.setUndoStatus = function () {
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
FretShare.prototype.redoNext = function () {
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
FretShare.prototype.undoLast = function () {
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
FretShare.prototype.pushAction = function (action) {
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
FretShare.prototype.userActionUpTrack = function (order) {
	var before = this.getTrackOrders();
	this.upTrack(order);
	var after = this.getTrackOrders();
	fretshare.pushAction({
		caption: 'Up ' + order,
		undo: function () {
			fretshare.setTrackOrders(before);
			fretshare.mark = null;
		},
		redo: function () {
			fretshare.setTrackOrders(after);
			fretshare.mark = null;
		}
	});
};
FretShare.prototype.userActionToneVolume = function (track, volume) {
	var before = this.getTrackOrders();
	this.upTrack(track.order);
	var after = this.getTrackOrders();
	var old = track.volume;
	fretshare.pushAction({
		caption: 'Volume ' + volume + ' for ' + track.title,
		undo: function () {
			track.volume = old;
			fretshare.setTrackOrders(before);
			fretshare.mark = null;
			fretshare.resetNodeValues();
		},
		redo: function () {
			track.volume = volume;
			fretshare.setTrackOrders(after);
			fretshare.mark = null;
			fretshare.resetNodeValues();
		}
	});
};
FretShare.prototype.userActionDrumVolume = function (nn, volume) {
	var old = this.drumVolumes[nn];
	fretshare.pushAction({
		caption: 'Volume ' + volume + ' for drum ' + nn,
		undo: function () {
			fretshare.drumVolumes[nn] = old;
			fretshare.resetNodeValues();
		},
		redo: function () {
			fretshare.drumVolumes[nn] = volume;
			fretshare.resetNodeValues();
		}
	});
};
FretShare.prototype.userActionTempo = function (tempo) {
	var old = this.tempo;
	fretshare.pushAction({
		caption: 'Tempo ' + tempo,
		undo: function () {
			fretshare.tempo = old;
		},
		redo: function () {
			fretshare.tempo = tempo;
		}
	});
};
FretShare.prototype.userActionEqualizer = function (band, volume) {
	var old = this.equalizer[band];
	fretshare.pushAction({
		caption: 'Equalizer ' + band + ' = ' + volume,
		undo: function () {
			fretshare.equalizer[band] = old;
			fretshare.resetNodeValues();
		},
		redo: function () {
			fretshare.equalizer[band] = volume;
			fretshare.resetNodeValues();
		}
	});
};
FretShare.prototype.userActionAddDrum = function (beat, drum) {
	fretshare.pushAction({
		caption: 'Add drum ' + drum + ' to ' + beat,
		undo: function () {
			fretshare.dropDrum(beat, drum);
		},
		redo: function () {
			fretshare.setDrum(beat, drum);
		}
	});
};
FretShare.prototype.userActionDropDrum = function (beat, drum) {
	fretshare.pushAction({
		caption: 'Drop drum ' + drum + ' from ' + beat,
		undo: function () {
			fretshare.setDrum(beat, drum);
		},
		redo: function () {
			fretshare.dropDrum(beat, drum);
		}
	});
};
FretShare.prototype.userActionAddChord = function (beat, length, string, fret) {
	fretshare.pushAction({
		caption: 'Add chord ' + beat + '/' + length + '/' + string + '/' + fret,
		undo: function () {
			fretshare.dropChordNote(beat, string);
		},
		redo: function () {
			fretshare.addChordNote(beat, length, string, fret);
		}
	});
};
FretShare.prototype.userActionDropChord = function (beat, length, string, fret) {
	fretshare.pushAction({
		caption: 'Drop chord ' + beat + '/' + length + '/' + string + '/' + fret,
		undo: function () {
			fretshare.addChordNote(beat, length, string, fret);
		},
		redo: function () {
			fretshare.dropChordNote(beat, string);
		}
	});
};
FretShare.prototype.userActionAddNote = function (beat, pitch, track, length, shift) {
	fretshare.pushAction({
		caption: 'Add note ' + beat + '/' + pitch + '/' + track + '/' + length + '/' + shift,
		undo: function () {
			fretshare.dropNote(beat, pitch, track);
		},
		redo: function () {
			fretshare.addNote(beat, pitch, track, length, shift);
		}
	});
};
FretShare.prototype.userActionDropNote = function (beat, pitch, track) {
	var old = this.findNote(beat, pitch, track);
	fretshare.pushAction({
		caption: 'Drop note ' + beat + '/' + pitch + '/' + track,
		undo: function () {
			fretshare.addNote(old.beat, old.pitch, old.track, old.length, old.shift);
		},
		redo: function () {

			fretshare.dropNote(beat, pitch, track);
		}
	});
};
FretShare.prototype.userActionSwap = function () {
	//console.log(fretshare.findTrackInfo(0).title,'<->',fretshare.findTrackInfo(1).title);
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
	fretshare.pushAction({
		caption: 'Swap ' + track1.title + ' with ' + track0.title,
		undo: function () {
			fretshare.storeTracks = old;
			fretshare.setTrackOrders(before);
			fretshare.mark = null;
		},
		redo: function () {
			fretshare.storeTracks = nw;
			fretshare.setTrackOrders(after);
			fretshare.mark = null;
		}
	});
};
FretShare.prototype.userUpInstrument = function () {
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
	fretshare.pushAction({
		caption: 'up instrument ' + nn,
		undo: function () {
			fretshare.storeTracks = pre;
		},
		redo: function () {
			fretshare.storeTracks = after;
		}
	});
};
FretShare.prototype.userDownInstrument = function () {
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
	fretshare.pushAction({
		caption: 'down instrument ' + nn,
		undo: function () {
			fretshare.storeTracks = pre;
		},
		redo: function () {
			fretshare.storeTracks = after;
		}
	});
};
FretShare.prototype.userUpMeasure = function (msr) {
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
	fretshare.pushAction({
		caption: 'up measure ' + msr + ' for instrument ' + nn,
		undo: function () {
			fretshare.storeTracks = pre;
		},
		redo: function () {
			fretshare.storeTracks = after;
		}
	});
};
FretShare.prototype.userDownMeasure = function (msr) {
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
	fretshare.pushAction({
		caption: 'down measure ' + msr + ' for instrument ' + nn,
		undo: function () {
			fretshare.storeTracks = pre;
		},
		redo: function () {
			fretshare.storeTracks = after;
		}
	});
};
FretShare.prototype.userClearInstrument = function () {
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
	fretshare.pushAction({
		caption: 'clear instrument ' + nn,
		undo: function () {
			fretshare.storeTracks = pre;
		},
		redo: function () {
			fretshare.storeTracks = after;
		}
	});
};
FretShare.prototype.userClearDrum = function () {
	var pre = this.copyDrums();
	var after = [];
	fretshare.pushAction({
		caption: 'clear drums',
		undo: function () {
			fretshare.storeDrums = pre;
		},
		redo: function () {
			fretshare.storeDrums = after;
		}
	});
};
FretShare.prototype.userRepeatInstrument = function () {
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
	fretshare.pushAction({
		caption: 'repeat instrument ' + nn,
		undo: function () {
			fretshare.storeTracks = pre;
		},
		redo: function () {
			fretshare.storeTracks = after;
		}
	});
};
FretShare.prototype.userRepeatChords = function () {
	//var nn = this.findTrackInfo(0).nn;
	var pre = this.copyNotes();
	var after = this.copyNotes();
	//var c16 = 16 * this.cauntToneMeasures(nn);
	var c16 = 16 * this.cauntMeasures();
	var preBeats = [];
	var afterBeats = [];
	for (var i = 0; i < c16; i++) {
		preBeats[i] = this.beats[i];
		afterBeats[i] = this.beats[i];
		afterBeats[i + c16] = this.beats[i];
	}
	for (var i = 0; i < pre.length; i++) {
		after.push({
			beat: pre[i].beat + c16,
			string: pre[i].string,
			fret: pre[i].fret,
			length: pre[i].length
		});

	}
	fretshare.pushAction({
		caption: 'Repeat chords',
		undo: function () {
			fretshare.notes = pre;
			fretshare.beats = preBeats;
		},
		redo: function () {
			fretshare.notes = after;
			fretshare.beats = afterBeats;
		}
	});
};
FretShare.prototype.userRepeatDrums = function () {
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
	fretshare.pushAction({
		caption: 'repeat drums',
		undo: function () {
			fretshare.storeDrums = pre;
		},
		redo: function () {
			fretshare.storeDrums = after;
		}
	});
};
FretShare.prototype.userActionClearAll = function () {
	this.saveState();
	addStateToHistory();
	var d = this.copyDrums();
	var t = this.copyTones();
	fretshare.pushAction({
		caption: 'Clear all',
		undo: function () {
			fretshare.storeDrums = d;
			fretshare.storeTracks = t;
			fretshare.mark = null;
		},
		redo: function () {
			fretshare.storeDrums = [];
			fretshare.storeTracks = [];
			fretshare.mark = null;
		}
	});
};
FretShare.prototype.userActionClearChords = function () {
	this.saveState();
	//addStateToHistory();
	var d = this.copyNotes();
	var b = this.beats;
	//var t = this.copyTones();
	fretshare.pushAction({
		caption: 'Clear all',
		undo: function () {
			fretshare.notes = d;
			fretshare.beats = b;
			//fretshare.storeTracks = t;
			fretshare.mark = null;
		},
		redo: function () {
			fretshare.notes = [];
			fretshare.beats = [];
			//fretshare.storeTracks = [];
			fretshare.mark = null;
		}
	});
};
FretShare.prototype.userActionChangeScheme = function (nn) {
	var olds = this.bgMode;
	var news = nn;
	fretshare.pushAction({
		caption: 'Change background mode ' + nn,
		undo: function () {
			fretshare.setModeBackground(olds)
		},
		redo: function () {
			fretshare.setModeBackground(news)
		}
	});
};
FretShare.prototype.userActionChangeChannel = function (nn) {
	var olds = this.selchan;
	var news = nn;
	fretshare.pushAction({
		caption: 'Change channel ' + nn,
		undo: function () {
			fretshare.selchan = olds;
		},
		redo: function () {
			fretshare.selchan = news;
		}
	});
};
FretShare.prototype.userActionToggleBeatMode = function (beat) {
	var olds = 0;
	var news = 1;
	if (this.beats[beat]) {
		olds = this.beats[beat];
	}
	if (olds == 1) {
		news = 2;
	}
	if (olds == 2) {
		news = 3;
	}
	if (olds == 3) {
		news = 0;
	}
	fretshare.pushAction({
		caption: 'Toggle beat mode ' + beat,
		undo: function () {
			fretshare.beats[beat] = olds;
		},
		redo: function () {
			fretshare.beats[beat] = news;
		}
	});
};
window.onload = function () {
	console.log('create fretshare');
	new FretShare();
	fretshare.init();
};
