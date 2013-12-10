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

		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			var cube = new THREE.Mesh(
					new THREE.CubeGeometry(this.size, this.size, this.size),
					new THREE.MeshLambertMaterial({
						color: Math.floor(Math.random() * 16777216),
					}));
			cube.position.set(this.x + l[0], this.y + l[1], this.z + l[2]);
			if (Math.random() < .09) {
				var sphere = new THREE.Mesh(
						new THREE.SphereGeometry(this.size/4 - 2, 32, 32),
						new THREE.MeshLambertMaterial({
							color: 0x0000ff
						}));
				sphere.position.set(this.x + l[0], this.y + l[1], this.z + l[2] + this.size);
				this.spheres.push(sphere);
				scene.add(sphere);
			}
			this.cubes.push(cube);
			scene.add(cube);
		}
	};

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
			}
		}
		console.log(this.spheres.length);
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
