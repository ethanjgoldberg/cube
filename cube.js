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

	var ambientLight = new THREE.AmbientLight(0x333399);
	scene.add(ambientLight);

	var density = .4;
	var hh = 1000;
	levels = [generateLevel(density, hh, player.x, player.y, 0)];
	levels[0].init(scene);

	(function tick() {
		if (player.tick()) {
		}
		camera.position = player.position;

		camera.rotation.set(player.alpha, player.beta, player.gamma);

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	})();
}
