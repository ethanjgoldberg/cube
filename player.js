var keys = {};
addEventListener('keydown', function (e) {
	keys[e.keyCode] = true;
});
addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
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

	this.grounded = false;
	this.height = 1.5;

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
			this.vx += 16*dvx;
			this.vy += 16*dvy;
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
			return (this.z < levels[levels.length-1].z);
		}
	};

	this.collide = function () {
		for (var i = 0; i < levels.length; i++) {
			if (levels[i].collide(this.position, this.height)) return true;
		}
		return false;
	};

	this.turn = function (dx, dy) {
		this.gamma -= dx / 256;
		this.alpha -= dy / 256;
		if (this.alpha > Math.PI) this.alpha = Math.PI;
		if (this.alpha < 0) this.alpha = 0;
	}

	this.moveHandler = function (e) {
		var dx = e.movementX || e.mozMovementX || e.webkitMovementX;
		var dy = e.movementY || e.mozMovementY || e.webkitMovementY;

		this.turn(dx, dy);
	}

	addEventListener('mousemove', this.moveHandler.bind(this));
};
