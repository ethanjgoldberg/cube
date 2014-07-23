var keys = {};
addEventListener('keydown', function (e) {
	keys[e.keyCode] = true;
});
addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});
var pink = false;
addEventListener('keydown', function (e) {
	if (!pink && e.keyCode == 32) {
		pink = true;
		audio.jetPack.gain.value = .01;
	}
});
addEventListener('keyup', function (e) {
	if (pink && e.keyCode == 32) {
		pink = false;
		audio.jetPack.gain.value = 0;
	}
});


function Player () {
	this.position = new THREE.Vector3(0, 0, 40);

	Object.defineProperty(this, 'x', {
		get: function () {
			return this.position.x;
		},
		set: function (x) {
			this.position.x = x;
		}
	});
	Object.defineProperty(this, 'y', {
		get: function () {
			return this.position.y;
		},
		set: function (y) {
			this.position.y = y;
		}
	});
	Object.defineProperty(this, 'z', {
		get: function () {
			return this.position.z;
		},
		set: function (z) {
			this.position.z = z;
		}
	});

	this.vx = 0;
	this.vy = 0;
	this.vz = 0;

	this.alpha = Math.PI;
	this.beta = 0;
	this.gamma = 0;

	this.spheres = 0;
	this.grounded = false;

	this.height = 16;
	this.groundSpeed = 32;

	this.tick = function () {
		var dvx = 0;
		var dvy = 0;
		if (keys[87] || keys[188]) {
			// forward
			dvx += -Math.sin(this.gamma);
			dvy += Math.cos(this.gamma);
		} 
		if (keys[79] || keys[83]) {
			// backward
			dvx += Math.sin(this.gamma);
			dvy += -Math.cos(this.gamma);
		} 
		if (keys[65]) {
			// left
			dvx += -Math.cos(this.gamma);
			dvy += -Math.sin(this.gamma);
		} 
		if (keys[69] || keys[68]) {
			// right
			dvx += Math.cos(this.gamma);
			dvy += Math.sin(this.gamma);
		}

		if (dvx || dvy) {
			var mag = Math.sqrt(dvx * dvx +
					dvy * dvy);
			dvx /= mag * 64;
			dvy /= mag * 64;

			this.vx += dvx;
			this.vy += dvy;
		}

		if (keys[32]) {
			this.vz += .02;
		}
		if (this.grounded) {
			this.vx += this.groundSpeed*dvx;
			this.vy += this.groundSpeed*dvy;
			this.vx *= .5;
			this.vy *= .5;
		}

		var l;

		this.x += this.vx;
		if (l = this.collide()) {
			this.x -= this.vx;
			this.vx = 0;
		}
		this.y += this.vy;
		if (l = this.collide()) {
			this.y -= this.vy;
			this.vy = 0;
		}

		this.vz += -0.01;
		this.grounded = false;
		this.z += this.vz;
		if (l = this.collide()) {
			this.z -= this.vz;
			this.vz = 0;
			this.grounded = true;
		} else {
			return (this.z < level.z);
		}
	};

	this.collide = function () {
		if (level.collide(this.position, this.height)) return true;
		return false;
	};

	this.turn = function (dx, dy) {
		this.gamma -= dx / 256;
		this.alpha -= dy / 256;
		if (this.alpha > Math.PI) this.alpha = Math.PI;
		if (this.alpha < 0) this.alpha = 0;
	}

	this.moveHandler = function (e) {
		var dx, dy;
		if (e.movementX != undefined) {
			dx = e.movementX;
			dy = e.movementY; //maybe not a good assumption, but i give so few fucks.
		} else if (e.mozMovementX != undefined) {
			dx = e.mozMovementX;
			dy = e.mozMovementY;
		} else if (e.webkitMovementX) {
			dx = e.webkitMovementX;
			dy = e.webkitMovementY;
		} else {
			return;
		}

		this.turn(dx, dy);
	}

	addEventListener('mousemove', this.moveHandler.bind(this));
};
