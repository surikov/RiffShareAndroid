function testing() {
	console.log('testing');

	/*saveString2IndexedDB('somedata', 'dsrnj \n\n\n\dsfbgdrn dgfs' + (new Date()), function () {
	console.log('done save')
	});
	readStringFromIndexedDB('somedata', function (text) {
	console.log('done read', text)
	});*/
	/*saveString2WebDB('somedata', 'dsrnj \n\n\n\dsfbgdrn dgfs' + (new Date()), function () {
	console.log('done save')
	});*/
	/*readStringFromWebDB('somedata', function (text) {
	console.log('done read', text)
	});*/
}

function readStringFromWebDB(name, ondone) {
	try {
		var database = getWebDB();
		database.transaction(function (sqlTransaction) {
			try {
				var sql = 'select ftext from cfg where fname=\'' + name + '\';';
				sqlTransaction.executeSql(sql, [], function (a, b) {
					console.log(sql, b);
					if (b.rows.length > 0) {
						ondone(b.rows[0].ftext);
					} else {
						ondone(null);
					}
				}, function (a, b) {
					console.log(a, b);
					ondone(null);
				});
			} catch (e) {
				console.log(e);
				ondone(null);
			}
		});
	} catch (e) {
		console.log(e);
		ondone(null);
	}
}
function saveString2WebDB(name, text, ondone) {
	try {
		var database = getWebDB();
		database.transaction(function (sqlTransaction) {
			try {
				sqlTransaction.executeSql('create table if not exists cfg(fname text, ftext text)');
				sqlTransaction.executeSql('delete from cfg where fname="' + name + '"');
				sqlTransaction.executeSql('insert into cfg (fname,ftext) values(\'' + name + '\',\'' + text + '\');');
			} catch (e) {
				console.log(e);
			}
			ondone();
		});
	} catch (e) {
		console.log(e);
		ondone();
	}
}
function saveString2IndexedDB(name, text, ondone) {
	try {
		doStoreIndexedDB(function (idbObjectStore) {
			saveString2ObjectStore(idbObjectStore, name, text, ondone);
		});
	} catch (e) {
		console.log(e);
		ondone(null);
	}
}
function readStringFromIndexedDB(name, ondone) {
	try {
		doStoreIndexedDB(function (idbObjectStore) {
			readStringFromObjectStore(idbObjectStore, name, ondone);
		});
	} catch (e) {
		console.log(e);
		ondone(null);
	}
}
function getWebDB() {
	var database = window.openDatabase('websql', 1, 'CfgDB', 256 * 1024);
	return database;
}
function doStoreIndexedDB(ondone) {
	try {
		var idbFactory = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		var idbOpenDBRequest = idbFactory.open('indexedDB', 2);
		idbOpenDBRequest.onupgradeneeded = function (event) {
			console.log(event);
			var idbDatabase = event.target.result;
			var idbObjectStore = idbDatabase.createObjectStore('objectStore');
		}
		idbOpenDBRequest.onerror = function (event) {
			console.log(event);
			ondone(null);
		};
		idbOpenDBRequest.onsuccess = function (event) {
			var idbDatabase = event.target.result;
			var idbTransaction = idbDatabase.transaction('objectStore', 'readwrite');
			var idbObjectStore = idbTransaction.objectStore('objectStore');
			ondone(idbObjectStore);
		};
	} catch (e) {
		console.log(e);
		ondone(null);
	}
}
function saveString2ObjectStore(idbObjectStore, name, text, ondone) {
	try {
		var idbRequest = idbObjectStore.delete (name);
		idbRequest.onerror = function (event) {
			ondone();
		};
		idbRequest.onsuccess = function (event) {

			try {
				var idbRequest2 = idbObjectStore.add(text, name);
				idbRequest2.onerror = function (event) {
					console.log(event);
					ondone();
				};
				idbRequest2.onsuccess = function (event) {
					ondone();
				}
			} catch (e) {
				console.log(e);
				ondone();
			}
		};
	} catch (e) {
		console.log(e);
		ondone();
	}
}
function readStringFromObjectStore(idbObjectStore, name, ondone) {
	try {
		var idbRequest = idbObjectStore.get(name);
		idbRequest.onerror = function (event) {
			console.log(event);
			ondone(null);
		};
		idbRequest.onsuccess = function (event) {
			ondone(idbRequest.result);
		};
	} catch (e) {
		console.log(e);
		ondone(null);
	}
}

////////////////////////////////////
function saveObject2localStorage(name, o) {
	console.log('saveObject2localStorage', name, o);
	localStorage.setItem(name, JSON.stringify(o));
}
function readObjectFromlocalStorage(name) {
	var o = null;
	try {
		o = JSON.parse(localStorage.getItem(name));
	} catch (ex) {
		console.log(ex);
		return {};
	}
	return o;
}
function saveText2localStorage(name, text) {
	console.log('saveText2localStorage', name, text);
	localStorage.setItem(name, text);
}
function readTextFromlocalStorage(name) {
	var o = '';
	try {
		o = localStorage.getItem(name);
	} catch (ex) {
		console.log(ex);
	}
	return o;
}
function sureArray(v, defaultValue) {
	if (v) {
		if (v.length > 0) {
			return v;
		} else {
			return defaultValue;
		}
	} else {
		return defaultValue;
	}
}
function sureNumeric(v, minValue, defaultValue, maxValue) {
	var r = defaultValue;
	try {
		r = Number.parseFloat(v);
	} catch (ex) {
		console.log(ex);
	}
	if (isNaN(r)) {
		r = defaultValue;
	}
	if (r < minValue) {
		r = minValue;
	}
	if (r > maxValue) {
		r = maxValue;
	}
	return r;
}
function sureInList(v, defaultValue, items) {
	var r = defaultValue;
	for (var i = 0; i < items.length; i++) {
		if (items[i] == v) {
			return v;
		}
	}
	return r;
}
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value;
		});
	return vars;
}
function decodeState(encoded) {
	try {
		//addStateToHistory();
		var strings = encoded.split('-');
		var tempo = parseInt(strings[0], 16);
		//console.log('tempo',tempo);
		saveText2localStorage('tempo', '' + tempo);
		for (var i = 0; i < 8; i++) {
			var n = 10 * parseInt(strings[1].substring(i, i + 1), 16);
			//console.log('track'+i,n);
			saveText2localStorage('track' + i, '' + n);
		}
		for (var i = 0; i < 8; i++) {
			var n = 10 * parseInt(strings[2].substring(i, i + 1), 16);
			//console.log('drum'+i,n);
			saveText2localStorage('drum' + i, '' + n);
		}
		//console.log(strings[3]);
		for (var i = 0; i < 10; i++) {
			var t = strings[3].substring(i * 2, i * 2 + 2);
			var n = parseInt(t, 16) - 10;
			//console.log('equalizer'+i,n,t);
			saveText2localStorage('equalizer' + i, '' + n);
		}
		var storeDrums = [];
		var cnt = strings[4].length / 4;
		//console.log(cnt,strings[4]);
		for (var i = 0; i < cnt; i++) {
			var key = parseInt(strings[4].substring(i * 4, i * 4 + 2), 16);
			var data = parseInt(strings[4].substring(i * 4 + 2, i * 4 + 4), 16);
			var drum = key >> 5;
			var i32 = key & parseInt('11111', 2);
			//console.log(pad0(key.toString(2),8),pad0(data.toString(2),8),drum,i32);
			if ((data | parseInt('00000001', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 0
				}); //console.log('drum',drum,i32*8+0);
			if ((data | parseInt('00000010', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 1
				}); //console.log('drum',drum,i32*8+1);
			if ((data | parseInt('00000100', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 2
				}); //console.log('drum',drum,i32*8+2);
			if ((data | parseInt('00001000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 3
				}); //console.log('drum',drum,i32*8+3);
			if ((data | parseInt('00010000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 4
				}); //console.log('drum',drum,i32*8+4);
			if ((data | parseInt('00100000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 5
				}); //console.log('drum',drum,i32*8+5);
			if ((data | parseInt('01000000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 6
				}); //console.log('drum',drum,i32*8+6);
			if ((data | parseInt('10000000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 7
				}); //console.log('drum',drum,i32*8+7);
		}
		saveObject2localStorage('storeDrums', storeDrums);
		var storeTracks = [];
		cnt = strings[5].length / 9;
		for (var i = 0; i < cnt; i++) {
			var beat = parseInt(strings[5].substring(i * 9, i * 9 + 2), 16);
			var track = parseInt(strings[5].substring(i * 9 + 2, i * 9 + 2 + 1), 16);
			var length = parseInt(strings[5].substring(i * 9 + 3, i * 9 + 3 + 2), 16);
			var pitch = parseInt(strings[5].substring(i * 9 + 5, i * 9 + 5 + 2), 16);
			var shift = parseInt(strings[5].substring(i * 9 + 7, i * 9 + 7 + 2), 16) - 64;
			//console.log(beat,track,length,pitch,shift);
			storeTracks.push({
				track: track,
				beat: beat,
				length: length,
				shift: shift,
				pitch: pitch
			});
		}
		for(var i=0;i<8;i++){
				saveText2localStorage('reDrum'+i, '0');
				saveText2localStorage('reTrack'+i, '0');
			}
		if(strings[6]){
			for(var i=0;i<8;i++){
				var r = parseInt(strings[6].substring(i * 3, i * 3 + 3), 16);
				//drumInfo[i].replacement=r;
				saveText2localStorage('reDrum'+i, '' + r);
			}
		}
		if(strings[7]){
			for(var i=0;i<8;i++){
				var r = parseInt(strings[7].substring(i * 3, i * 3 + 3), 16);
				//trackInfo[7-i].replacement=r;
				saveText2localStorage('reTrack'+(7-i), '' + r);
			}
		}
		saveObject2localStorage('storeTracks', storeTracks);
		
	} catch (ex) {
		console.log(ex);
	}
	//vvv.rfff();
}
function pad0(value, size) {
	for (var i = value.length; i < size; i++) {
		value = '0' + value;
	}
	return value;
}
function encodeState() {
	var txt = '';
	try {
		var tempo = 1 * sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220, 240]);
		
		txt = tempo.toString(16);
		//console.log(txt,tempo,readTextFromlocalStorage('tempo'));
		
		var tracks = '';
		for (var i = 0; i < 8; i++) {
			var n = Math.round(sureNumeric(readTextFromlocalStorage('track' + i), 0, 60, 100) / 10).toString(16);
			tracks = tracks + n;
		}
		txt = txt + '-' + tracks;
		var drums = '';
		for (var i = 0; i < 8; i++) {
			var n = Math.round(sureNumeric(readTextFromlocalStorage('drum' + i), 0, 60, 100) / 10).toString(16);
			drums = drums + n;
		}
		txt = txt + '-' + drums;
		var equalizer = '';
		for (var i = 0; i < 10; i++) {
			var n = pad0(Math.round(sureNumeric(readTextFromlocalStorage('equalizer' + i), -10, 60, 10) + 10).toString(16), 2);
			equalizer = equalizer + n;
		}
		txt = txt + '-' + equalizer;
		var storeDrums = readObjectFromlocalStorage('storeDrums');
		var drumData = "";
		for (var di = 0; di < 8; di++) {
			for (var bi = 0; bi < 32; bi++) {
				var part = [];
				for (var i = 0; i < storeDrums.length; i++) {
					var drum = storeDrums[i].drum;
					var beat = storeDrums[i].beat;
					if (drum == di && beat >= bi * 8 && beat < (bi + 1) * 8) {
						part.push(beat - bi * 8);
					}
				}
				if (part.length > 0) {
					var key = di << 5 | bi;
					var data = 0;
					for (var t = 0; t < part.length; t++) {
						data = data | (1 << part[t]);
					}
					drumData = drumData + pad0(key.toString(16), 2) + pad0(data.toString(16), 2);
				}
			}
		}
		txt = txt + '-' + drumData;
		var storeTracks = readObjectFromlocalStorage('storeTracks');
		var pitchData = '';
		for (var bi = 0; bi < 256; bi++) {
			var data = '';
			for (var i = 0; i < storeTracks.length; i++) {
				var beat = storeTracks[i].beat;
				var length = storeTracks[i].length;
				var pitch = storeTracks[i].pitch;
				var shift = 64 + storeTracks[i].shift;
				var track = storeTracks[i].track;
				if (beat == bi) {
					var nd = pad0(beat.toString(16), 2) + track.toString(16) + pad0(length.toString(16), 2) + pad0(pitch.toString(16), 2) + pad0(shift.toString(16), 2);
					pitchData = pitchData + nd;
					//console.log(beat,track.toString(16),shift,nd);
				}
			}
		}
		txt = txt + '-' + pitchData;
		var drumreplacements = '';
		for (var r = 0; r < 8; r++) {
			drumreplacements = drumreplacements + hex3(sureNumeric(readTextFromlocalStorage('reDrum' + r), 0, 0, 1000));
		}
		txt = txt + '-' + drumreplacements;
		var ireplacements = '';
		for (var r = 0; r < 8; r++) {
			ireplacements = ireplacements + hex3(sureNumeric(readTextFromlocalStorage('reTrack' + (7 - r)), 0, 0, 2000));
		}
		txt = txt + '-' + ireplacements;
	} catch (ex) {
		console.log(ex);
	}
	console.log(txt);
	return txt;
}
function hex3(n) {
	var nn = 1 * n;
	var s = nn.toString(16);
	if (s.length < 2) {
		return '00' + s;
	}
	if (s.length < 3) {
		return '0' + s;
	}
	return s;
}
function addStateToHistory(nocut) {
	var hstry = sureArray(readObjectFromlocalStorage('history'), []);
	var state = {};
	state.label = '' + new Date();
	state.storeDrums = sureArray(readObjectFromlocalStorage('storeDrums'), []);
	state.storeTracks = sureArray(readObjectFromlocalStorage('storeTracks'), []);

	for (var i = 0; i < 10; i++) {
		state['equalizer' + i] = readTextFromlocalStorage('equalizer' + i);
	}
	for (var i = 0; i < 8; i++) {
		state['drum' + i] = readTextFromlocalStorage('drum' + i);
		state['track' + i] = readTextFromlocalStorage('track' + i);
	}
	state['tempo'] = readTextFromlocalStorage('tempo');
	state['flatstate'] = readObjectFromlocalStorage('flatstate');
	hstry.push(state);
	if (nocut) {
		//
	} else {
		while (hstry.length > 23) {
			hstry.shift();
		}
	}
	saveObject2localStorage('history', hstry);
}
function removeStateFromHistory(n) {
	var hstry = sureArray(readObjectFromlocalStorage('history'), []);
	if (hstry.length > n) {
		var state = hstry[n];
		hstry.splice(n, 1);
		saveObject2localStorage('history', hstry);
		saveObject2localStorage('storeDrums', state.storeDrums);
		saveObject2localStorage('storeTracks', state.storeTracks);
		saveObject2localStorage('flatstate', state.flatstate);
		saveText2localStorage('tempo', state.tempo);
		for (var i = 0; i < 10; i++) {
			saveText2localStorage('equalizer' + i, state['equalizer' + i]);
		}
		for (var i = 0; i < 8; i++) {
			saveText2localStorage('drum' + i, state['drum' + i]);
			saveText2localStorage('track' + i, state['track' + i]);
		}
	}
}

function modeDrumColor(bgMode) {
	if (bgMode == 2) {
		return '#233';
	}
	return '#ccc';
}
function modeDrumShadow(bgMode) {
	if (bgMode == 2) {
		return '#9a9';
	}
	return '#566';
}
function modeNoteName(bgMode) {
	if (bgMode == 0) {
		return '#000';
	}
	return '#fff';
}
function modeBackground(bgMode) {
	if (bgMode == 1) {
		return '#31424C';
	}
	if (bgMode == 2) {
		//return '#C8D1D2';
		return '#eef';
	}
	return '#000609';
}
