function initAudio() {
	window.AudioContext = (
			window.AudioContext ||
			window.webkitAudioContext ||
			null
			);
	if (!AudioContext) {
		alert('Your browser does not support the WebAudio api. I\'m sorry, but you\'ll have to play without sound.');
		return;
	}


	ctx = new AudioContext();

	var bufferSize = 4096;
	var createPink = function() {
		var b0, b1, b2, b3, b4, b5, b6;
		b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
		var node = ctx.createScriptProcessor(bufferSize, 1, 1);
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0);
			for (var i = 0; i < bufferSize; i++) {
				var white = Math.random() * 2 - 1;
				b0 = 0.99886 * b0 + white * 0.0555179;
				b1 = 0.99332 * b1 + white * 0.0750759;
				b2 = 0.96900 * b2 + white * 0.1538520;
				b3 = 0.86650 * b3 + white * 0.3104856;
				b4 = 0.55000 * b4 + white * 0.5329522;
				b5 = -0.7616 * b5 - white * 0.0168980;
				output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
				output[i] *= 0.11; // (roughly) compensate for gain
				b6 = white * 0.115926;
			}
		}
		return node;
	}

	mainVolume = ctx.createGain();
	mainVolume.gain = .5;
	mainVolume.connect(ctx.destination);

	function playNote(root, detune, repeat, dur) {
		console.log(root, detune, repeat, dur);

		oscillator = ctx.createOscillator();
		oscillator.frequency.value = root;
		oscillator.detune.value = detune * 100;

		gainNode = ctx.createGain();

		delayNode = ctx.createDelay(repeat);
		delayNode.delayTime.value = repeat;
		delayNode.connect(mainVolume);

		decayNode = ctx.createGain();
		decayNode.gain.value = .97;

		delayNode.connect(decayNode);
		decayNode.connect(delayNode);

		oscillator.connect(gainNode);
		gainNode.connect(mainVolume);
		gainNode.connect(delayNode);

		var now = ctx.currentTime;
		gainNode.gain.setValueAtTime(now, 0);
		console.log(.125 / Math.log(root / 20));
		gainNode.gain.linearRampToValueAtTime(
				.125 / Math.log(root / 20), now + .1);
		gainNode.gain.linearRampToValueAtTime(0, now + .1 + dur);

		oscillator.start(now);
	}

	jetPack = ctx.createGain();
	jetPack.gain.value = 0;
	jetPack.connect(mainVolume);
	pink = createPink();
	pink.connect(jetPack);

	return {playNote: playNote, jetPack: jetPack};
}

function go () {
	var WIDTH = window.innerWidth - 20;
	var HEIGHT = window.innerHeight - 20;

	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 100000;

	var container = document.getElementById('c');
	container.requestPointerLock = container.requestPointerLock ||
		container.mozRequestPointerLock ||
		container.webkitRequestPointerLock;
	container.onclick = function () {
		container.requestPointerLock();
	}

	var renderer = new THREE.WebGLRenderer();

	var camera = new THREE.PerspectiveCamera(
			VIEW_ANGLE,
			ASPECT,
			NEAR,
			FAR);
	camera.rotation.order = "ZYX";
	camera.position.z = 300;

	scene = new THREE.Scene();

	scene.add(camera);
	renderer.setSize(WIDTH, HEIGHT);

	container.appendChild(renderer.domElement);

	player = new Player;

	var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(1, 16, 16),
			new THREE.MeshLambertMaterial({
				color: 0xFF0000,
			}));
	//scene.add(sphere);

	var ambientLight = new THREE.AmbientLight(0x999999);
	scene.add(ambientLight);

	var density = .4;
	var hh = 1000;
	levels = [generateLevel(density, hh, player.x, player.y, 0)];
	levels[0].init(scene);

	audio = initAudio();

	(function tick() {
		player.tick();
		camera.position = player.position;
		//console.log(camera.position.x, camera.position.y, camera.position.z);

		camera.rotation.set(player.alpha, player.beta, player.gamma);
		//console.log(camera.rotation.x, camera.rotation.y, camera.rotation.z);

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	})();
}
