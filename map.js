function rgb (r, g, b) {
	return (r * 256 + g) * 256 + b;
}

function choice(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function Level (locations, x, y, z, size) {
	this.locations = locations.slice(0);
	this.z = z;
	this.x = x;
	this.y = y;

	this.size = size;

	this.cubes = [];
	this.spheres = [];

	this.init = function (scene) {
		var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.x = 10 * size;
		pointLight.position.y = 50 * size;
		pointLight.position.z = this.z + 100 * size;
		scene.add(pointLight);

		var rm = Math.pow(2, Math.floor(Math.random() * 4) + 1)-1;
		var bm = Math.pow(2, Math.floor(Math.random() * 4) + 1)-1;
		var gm = Math.pow(2, Math.floor(Math.random() * 4) + 1)-1;

		var scm = Math.max(rm, bm, gm);
		var sc = rgb((rm == scm)*rm*16, (gm == scm)*gm*16, (bm == scm)*bm*16);
		console.log(scm, rm, gm, bm, sc);

		this.rootTone = 440;
		this.scale = [0, 2, 3, 5, 7, 9, 11, 12];

		this.geometry = THREE.BufferGeometryUtils.fromGeometry(new THREE.CubeGeometry(this.size, this.size, this.size));

		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			var r = Math.floor(Math.random() * 16);
			var b = Math.floor(Math.random() * 16);
			var g = Math.floor(Math.random() * 16);
			var c = rgb(rm * r, gm * g, bm * b);
			var cube = new THREE.Mesh(
					this.geometry,
					new THREE.MeshLambertMaterial({
						color: c,
						ambient: c,
					}));
			cube.position.set(this.x + l[0], this.y + l[1], this.z + l[2]);
			if (Math.random() < .09) {
				var sphere = new THREE.Mesh(
						new THREE.SphereGeometry(this.size/4 - 2, 32, 32),
						new THREE.MeshLambertMaterial({
							color: sc,
							ambient: sc,
						}));
				sphere.position.set(this.x + l[0], this.y + l[1], this.z + l[2] + this.size);
				this.spheres.push(sphere);
				scene.add(sphere);
			}
			this.cubes.push(cube);
			scene.add(cube);
		}
	};

	this.denit = function (scene) {
		for (var i =0; i < this.cubes.length; i++) {
			scene.remove(this.cubes[i]);
			this.cubes[i].geometry.dispose();
		}
		for (var i = 0; i < this.spheres.length; i++) {
			scene.remove(this.spheres[i]);
		}
	}

	this.collide = function (pos, height) {
		var size = this.size;
		var hsize = this.size / 2;
		var x = pos.x;
		var y = pos.y;
		var z = pos.z;
		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			if (l[0] + this.x + hsize < x 
					|| l[0] + this.x - hsize > x
					|| l[1] + this.y + hsize < y
					|| l[1] + this.y - hsize > y
					|| l[2] + this.z + hsize < z - height
					|| l[2] + this.z - hsize > z)
				continue;
			return l;
		}
		for (var i = 0; i < this.spheres.length; i++) {
			if (pos.distanceToSquared(this.spheres[i].position) < this.spheres[i].geometry.radius * this.spheres[i].geometry.radius) {
				scene.remove(this.spheres[i]);
				this.spheres.splice(i, 1);
				player.spheres++;
				audio.playNote(this.rootTone * Math.pow(2,Math.floor(Math.random()*Math.log(player.spheres))-3),
					       	choice(this.scale),
					       	Math.pow(3, Math.floor(Math.random() * 1.5)) * Math.pow(2, Math.floor(Math.random()*7)-2),
					       	0.125 * Math.floor(1 + Math.random()*8));
			}
		}
		if (this.spheres.length == 0) {
			console.log('victory for our armed forces abroad.');
		}
		return false;
	};
}

function generateLevel (density, hh, x, y, z) {
	function c(result, depth, size) {
		if (depth == 0) {
			console.log(result.length + " cubes here.");
			console.log(size);
			return new Level(result, x, y, z, size*2);
		}
		var ret = [];
		for (var i = 0; i < result.length; i++) {
			var r = result[i].slice(0);
			for (var j = 0; j < 8; j++) {
				if (Math.random() < density) {
					ret.push([r[0] + Math.floor(j / 4)*size,
							r[1] + (Math.floor(j / 2) % 2)*size,
							r[2] + (j % 2)*size]);
				}
			}
		}
		return c(ret, depth-1, size/2);
	}
	return c([[-hh, -hh, -hh]], 6, hh);
}
