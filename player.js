var keys = {};
addEventListener('keydown', function (e) {
	keys[e.keyCode] = true;
});
addEventListener('keyup', function (e) {
	keys[e.keyCode] = false;
});

function Player () {
	this.x = 0;
	this.y = 0;
	this.z = 40;

	this.vx = 0;
	this.vy = 0;
	this.vz = 0;

	this.alpha = 0;
	this.beta = 0;
	this.gamma = 0;

	this.grounded = false;
	this.height = 4;

	this.perspectiveM = function () {
		var m = Matrix.RotationX(this.alpha)
			.x(Matrix.RotationY(this.beta))
			.x(Matrix.RotationZ(this.gamma)).ensure4x4()
			.x(Matrix.Translation($V([this.x, this.y, this.z])).ensure4x4());
		return m;
	};

	this.tick = function () {
		var dvx = 0;
		var dvy = 0;
		if (keys[87] || keys[188]) {
			dvx += Math.sin(this.gamma);
			dvy += Math.cos(this.gamma);
		} 
		if (keys[79] || keys[83]) {
			dvx += -Math.sin(this.gamma);
			dvy += -Math.cos(this.gamma);
		} 
		if (keys[65]) {
			dvx += Math.cos(this.gamma);
			dvy += -Math.sin(this.gamma);
		} 
		if (keys[69] || keys[68]) {
			dvx += -Math.cos(this.gamma);
			dvy += Math.sin(this.gamma);
		}

		if (dvx || dvy) {
			var mag = Math.sqrt(dvx * dvx +
					dvy * dvy);
			dvx /= mag * 256;
			dvy /= mag * 256;

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

		this.vz += -0.01;

		this.x += this.vx;
		if (level.above(this.x, this.y)) {
			if (this.z < level.height + this.height) {
				this.x -= this.vx;
			}
		}
		this.y += this.vy;
		if (level.above(this.x, this.y)) {
			if (this.z < level.height + this.height) {
				this.y -= this.vy;
			}
		}
		this.z += this.vz;

		this.grounded = false;
		if (this.z < level.height + this.height) {
			if (level.above(this.x, this.y)) {
				this.z = level.height + this.height;
				this.vz = 0;
				this.grounded = true;
			} else {
				return (this.z < level.height);
			}
		}
	};

	this.turn = function (dx, dy) {
		this.gamma -= dx / 256;
		this.alpha += dy / 256;
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
