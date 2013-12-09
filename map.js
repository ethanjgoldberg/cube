function Level (locations, x, y, z) {
	this.locations = locations.slice(0);
	this.z = z;
	this.x = x;
	this.y = y;

	this.size = 1;

	this.cubes = [];

	this.init = function (scene) {
		var pointLight = new THREE.DirectionalLight(0xFFFFFF);
		pointLight.position.x = 10;
		pointLight.position.y = 50;
		pointLight.position.z = this.z + 100;
		scene.add(pointLight);

		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			var cube = new THREE.Mesh(
					new THREE.CubeGeometry(this.size, this.size, this.size),
					new THREE.MeshLambertMaterial({
						color: Math.floor(Math.random() * 16777216),
					}));
			cube.position.set(this.x + l[0]*this.size, this.y + l[1]*this.size, this.z + l[2]*this.size);
			cube.castShadow = true;
			cube.receiveShadow = true;
			this.cubes.push(cube);
			scene.add(cube);
		}
	};

	this.collide = function (x, y, z, height) {
		var size = this.size;
		var hsize = this.size / 2;
		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			if (size * l[0] + this.x + hsize < x 
					|| size * l[0] + this.x - hsize > x
					|| size * l[1] + this.y + hsize < y
					|| size * l[1] + this.y - hsize > y
					|| size * l[2] + this.z + hsize < z - height
					|| size * l[2] + this.z - hsize > z)
				continue;
			return true;
		}
		return false;
	};
}

function generateLevel (density, hwidth, hheight, ox, oy, z) {
	var r = [];
	for (var i = -hwidth; i < hwidth; i++) {
		for (var j = -hheight; j < hheight; j++) {
			for (var k = -hheight; k < hheight; k++) {
				if (Math.random() < density)
					r.push([i, j, k]);
			}
		}
	}
	return new Level(r, ox, oy, z);
}
