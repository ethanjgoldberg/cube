var size = 4;
var hsize = size / 2;

function Level (locations, offsetX, offsetY, height) {
	this.locations = locations;
	this.height = height;
	this.offsetX = -offsetX;
	this.offsetY = -offsetY;

	this.init = function () {
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		var r = [];
		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			r = r.concat([
				size*l[0] + hsize + this.offsetX,
				size*l[1] + hsize + this.offsetY, 0,
				size*l[0] - hsize + this.offsetX,
				size*l[1] + hsize + this.offsetY, 0,
				size*l[0] + hsize + this.offsetX,
				size*l[1] - hsize + this.offsetY, 0,
				size*l[0] - hsize + this.offsetX,
				size*l[1] - hsize + this.offsetY, 0,
				]);
		}
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(r), gl.STATIC_DRAW);
	};

	this.above = function (x, y) {
		x = -x;
		y = -y;
		for (var i = 0; i < this.locations.length; i++) {
			var l = this.locations[i];
			if (size * l[0] + hsize + this.offsetX < x 
					|| size * l[0] - hsize + this.offsetX > x
					|| size * l[1] + hsize + this.offsetY < y
					|| size * l[1] - hsize + this.offsetY > y)
				continue;
			return true;
		}
		return false;
	};
}

function generateLevel (density, hwidth, hheight, ox, oy) {
	var r = [];
	for (var i = -hwidth; i < hwidth; i++) {
		for (var j = -hheight; j < hheight; j++) {
			if (Math.random() < density) {
				r.push([i, j]);
			}
		}
	}
	return new Level(r, ox, oy, 0);
}
