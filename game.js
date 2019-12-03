var ThreeDisplay = (function () {
    function ThreeDisplay() {
        var _this = this;
        this.display = new PIXI.Sprite();
        this.myBorders = new PIXI.Rectangle(0, 0, 700, 300);
        this.keyDown = function (e) {
            switch (e.key) {
                case "a":
                    _this.controlled.rotateBy(0.1);
                    break;
                case "d":
                    _this.controlled.rotateBy(-0.1);
                    break;
                case "w":
                    _this.controlled.tiltBy(-0.1);
                    break;
                case "s":
                    _this.controlled.tiltBy(0.1);
                    break;
                case "q":
                    _this.controlled.yawBy(0.1);
                    break;
                case "e":
                    _this.controlled.yawBy(-0.1);
                    break;
            }
        };
        this.onMove = function (e) {
            if (e.down) {
                var dX = e.position.x - e.startPosition.x;
                var dY = e.position.y - e.startPosition.y;
                e.startPosition.set(e.position.x, e.position.y);
                _this.controlled.rotateBy(-dX / 100);
                _this.controlled.tiltBy(dY / 100);
            }
        };
        var myObject;
        myObject = new ThreeObject(ThreeGen.makePrism([[-50, -50], [-50, 50], [0, 0], [50, 50], [50, -50]], 120, { faceColor: 0xffcc00, edgeColor: 0xffcc00 }));
        this.display.addChild(myObject.display);
        this.controlled = myObject;
        myObject.display.x = 100;
        myObject.display.y = 100;
        this.mouse = new Mouse(this.controlled.display);
        this.mouse.moveCallback = this.onMove;
        window.addEventListener('keydown', this.keyDown);
    }
    ThreeDisplay.prototype.getWidth = function () {
        return this.myBorders.width;
    };
    ThreeDisplay.prototype.getHeight = function () {
        return this.myBorders.height;
    };
    return ThreeDisplay;
}());
var Mouse = (function () {
    function Mouse(canvas) {
        var _this = this;
        this.canvas = canvas;
        this.down = false;
        this.startPosition = new PIXI.Point(0, 0);
        this.position = new PIXI.Point(0, 0);
        this.mouseDown = function (e) {
            e.data.getLocalPosition(_this.canvas, _this.startPosition);
            _this.down = true;
        };
        this.mouseUp = function (e) {
            _this.down = false;
        };
        this.mouseMove = function (e) {
            if (_this.moveCallback) {
                e.data.getLocalPosition(_this.canvas, _this.position);
                _this.moveCallback(_this);
            }
        };
        canvas.on('mousedown', this.mouseDown);
        canvas.on('mouseup', this.mouseUp);
        canvas.on('mouseupoutside', this.mouseUp);
        canvas.on('mousemove', this.mouseMove);
    }
    return Mouse;
}());
var ThreeGen = (function () {
    function ThreeGen() {
    }
    ThreeGen.makeRectangular = function (width, depth, height, config) {
        var points = [[0, 0, 0], [width, 0, 0], [width, depth, 0], [0, depth, 0],
            [0, 0, height], [width, 0, height], [width, depth, height], [0, depth, height]];
        var faces = [];
        if (config.edgeColor) {
            faces.push([0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]);
        }
        faces.push([0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]);
        return { faces: faces, vertices: points, faceColor: config.faceColor, edgeColor: config.edgeColor, vertexColor: config.vertexColor };
    };
    ThreeGen.makePyramid = function (width, depth, height, config) {
        var points = [[0, 0, 0], [0, depth, 0], [width, depth, 0], [width, 0, 0], [width / 2, depth / 2, height]];
        var faces = [];
        if (config.edgeColor) {
            faces.push([0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [2, 4], [3, 4]);
        }
        faces.push([0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 4, 4]);
        return { faces: faces, vertices: points, faceColor: config.faceColor, edgeColor: config.edgeColor, vertexColor: config.vertexColor };
    };
    ThreeGen.makePlane = function (width, depth, config) {
        var points = [[0, 0, 0], [width, 0, 0], [width, depth, 0], [0, depth, 0]];
        var faces = [[0, 1, 2, 3]];
        return { faces: faces, vertices: points, faceColor: config.faceColor, edgeColor: config.edgeColor, vertexColor: config.vertexColor };
    };
    ThreeGen.makePyramidal = function (base, height, config) {
        var points = [];
        var faces = [];
        var topPoint = [0, 0, height];
        var basePoly = [];
        var prev = base.length - 1;
        for (var i = 0; i < base.length; i += 1) {
            points.push([base[i][0], base[i][1], 0]);
            topPoint[0] += base[i][0] / base.length;
            topPoint[1] += base[i][1] / base.length;
            basePoly.push(i);
            faces.push([prev, i, base.length]);
            prev = i;
        }
        if (config.edgeColor) {
            prev = base.length - 1;
            for (var i = 0; i < base.length; i++) {
                faces.push([i, base.length]);
                faces.push([prev, i]);
                prev = i;
            }
        }
        faces.push(basePoly);
        points.push(topPoint);
        return { faces: faces, vertices: points, faceColor: config.faceColor, edgeColor: config.edgeColor, vertexColor: config.vertexColor };
    };
    ThreeGen.makePrism = function (base, height, config) {
        var points = [];
        var faces = [];
        var basePoly = [];
        var topPoly = [];
        var bottomPoints = [];
        var topPoints = [];
        var prev = base.length - 1;
        for (var i = 0; i < base.length; i += 1) {
            basePoly.push(i);
            topPoly.push(i + base.length);
            bottomPoints.push([base[i][0], base[i][1], 0]);
            topPoints.push([base[i][0], base[i][1], height]);
            faces.push([prev, i, i + base.length, prev + base.length]);
            prev = i;
        }
        if (config.edgeColor) {
            prev = bottomPoints.length - 1;
            for (var i = 0; i < bottomPoints.length; i++) {
                faces.push([i, i + base.length], [prev, i], [prev + base.length, i + base.length]);
                prev = i;
            }
        }
        faces.push(basePoly, topPoly);
        points = bottomPoints.concat(topPoints);
        return { faces: faces, vertices: points, faceColor: config.faceColor, edgeColor: config.edgeColor, vertexColor: config.vertexColor };
    };
    ThreeGen.makeCylinder = function (width, height, config) {
        var center = new PIXI.Point(width / 2, width / 2);
        var distance = width / 2;
        var topPoints = [];
        var bottomPoints = [];
        var sides = 100;
        var topBase = [];
        var bottomBase = [];
        var faces = [];
        var prev = sides - 1;
        for (var i = 0; i < sides; i++) {
            var angle = Math.PI * 2 * i / sides;
            bottomPoints.push([center.x + distance * Math.cos(angle), center.x + distance * Math.sin(angle), 0]);
            topPoints.push([bottomPoints[i][0], bottomPoints[i][1], height]);
            topBase.push(i);
            bottomBase.push(sides + i);
            faces.push([prev, i, i + sides, prev + sides]);
        }
        if (config.edgeColor) {
            prev = bottomPoints.length - 1;
            for (var i = 0; i < sides; i++) {
                faces.push([prev, i], [prev + sides, i + sides]);
                prev = i;
            }
        }
        faces.push(topBase, bottomBase);
        var points = bottomPoints.concat(topPoints);
        return { faces: faces, vertices: points, faceColor: config.faceColor, edgeColor: config.edgeColor, vertexColor: config.vertexColor };
    };
    return ThreeGen;
}());
var ThreeObject = (function () {
    function ThreeObject(config) {
        this.config = config;
        this.display = new PIXI.Sprite;
        this.graphics = new PIXI.Graphics;
        this.vertices = [];
        this.faces = [];
        this.tilt = new PIXI.Point(0.5, 0.2);
        this.perspective = new ThreePoint(750, 0, 1000);
        this.alpha0 = 0;
        this.alpha1 = 0.9;
        this.center = new ThreePoint(0, 0, 0);
        this.offset = new PIXI.Point(0, 0);
        this.display.interactive = true;
        for (var i = 0; i < config.vertices.length; i++) {
            this.vertices.push(new ThreePoint(config.vertices[i][0], config.vertices[i][1], config.vertices[i][2]));
        }
        for (var i = 0; i < config.faces.length; i++) {
            var points = [];
            for (var j = 0; j < config.faces[i].length; j++) {
                points.push(this.vertices[config.faces[i][j]]);
            }
            this.faces.push(new ThreePolygon(points));
        }
        config.faceColor = config.faceColor || 0x0033ee;
        this.display.addChild(this.graphics);
        this.resetPoints(true);
        this.sortPolyList();
        this.draw();
    }
    ThreeObject.prototype.rotateBy = function (radians) {
        for (var i = 0; i < this.vertices.length; i++) {
            var x = this.vertices[i].x - this.center.x;
            var y = this.vertices[i].y - this.center.y;
            this.vertices[i].x = this.center.x + x * Math.cos(radians) + y * Math.sin(radians);
            this.vertices[i].y = this.center.y + y * Math.cos(radians) - x * Math.sin(radians);
        }
        this.redraw();
    };
    ThreeObject.prototype.yawBy = function (radians) {
        for (var i = 0; i < this.vertices.length; i++) {
            var z = this.vertices[i].z - this.center.z;
            var x = this.vertices[i].x - this.center.x;
            this.vertices[i].z = this.center.z + z * Math.cos(radians) + x * Math.sin(radians);
            this.vertices[i].x = this.center.x + x * Math.cos(radians) - z * Math.sin(radians);
        }
        this.redraw();
    };
    ThreeObject.prototype.tiltBy = function (radians) {
        for (var i = 0; i < this.vertices.length; i++) {
            var z = this.vertices[i].z - this.center.z;
            var y = this.vertices[i].y - this.center.y;
            this.vertices[i].z = this.center.z + z * Math.cos(radians) + y * Math.sin(radians);
            this.vertices[i].y = this.center.y + y * Math.cos(radians) - z * Math.sin(radians);
        }
        this.redraw();
    };
    ThreeObject.prototype.redraw = function () {
        this.resetPoints();
        this.sortPolyList();
        this.draw();
    };
    ThreeObject.prototype.resetPoints = function (resize) {
        var _this = this;
        if (resize === void 0) { resize = false; }
        this.vertices.forEach(function (point) {
            var point2d = _this.threeToPoint(point);
            point.set2d(point2d.x, point2d.y);
            point.distance = point.distanceTo(_this.perspective);
        });
        if (resize) {
            this.offset.set(Infinity, Infinity);
            for (var i = 0; i < this.vertices.length; i++) {
                if (this.vertices[i].x2 < this.offset.x) {
                    this.offset.x = this.vertices[i].x2;
                }
                if (this.vertices[i].y2 < this.offset.y) {
                    this.offset.y = this.vertices[i].y2;
                }
                this.center.x += this.vertices[i].x;
                this.center.y += this.vertices[i].y;
                this.center.z += this.vertices[i].z;
            }
            this.center.x /= this.vertices.length;
            this.center.y /= this.vertices.length;
            this.center.z /= this.vertices.length;
        }
        else {
        }
        for (var i = 0; i < this.vertices.length; i++) {
            this.vertices[i].x2 -= this.offset.x;
            this.vertices[i].y2 -= this.offset.y;
        }
    };
    ThreeObject.prototype.threeToPoint = function (point) {
        var x = point.x / (1 + point.y * 0.0005) + point.y * this.tilt.x;
        var y = 0 - point.z / (1 + point.y * 0.0005) - point.y * this.tilt.y;
        return new PIXI.Point(x, y);
    };
    ThreeObject.prototype.sortPolyList = function () {
        this.faces.forEach(function (e) { e.setAverageDistance(); });
        this.faces.sort(function (a, b) {
            var dA = a.averageDistance;
            var dB = b.averageDistance;
            if (dA < dB) {
                return 1;
            }
            else if (dB < dA) {
                return -1;
            }
            else {
                return 0;
            }
        });
    };
    ThreeObject.prototype.draw = function () {
        this.graphics.clear();
        for (var i = 0; i < this.faces.length; i += 1) {
            if (this.faces[i].vertices.length === 1) {
            }
            else if (this.faces[i].vertices.length === 2) {
                if (!this.config.edgeColor) {
                    continue;
                }
                this.graphics.lineStyle(1, this.config.edgeColor);
                this.faces[i].drawTo(this.graphics);
            }
            else {
                var alpha = this.alpha0 + (this.alpha1 - this.alpha0) * (1 - i / (this.faces.length));
                this.graphics.lineStyle(0);
                this.graphics.beginFill(this.config.faceColor, alpha);
                this.faces[i].drawTo(this.graphics);
                this.graphics.endFill();
            }
        }
        if (this.config.vertexColor) {
            this.graphics.beginFill(this.config.vertexColor);
            for (var i = 0; i < this.vertices.length; i++) {
                this.graphics.drawCircle(this.vertices[i].x2, this.vertices[i].y2, 5);
            }
        }
    };
    ThreeObject.prototype.getWidth = function () {
        return this.graphics.width;
    };
    ThreeObject.prototype.getHeight = function () {
        return this.graphics.height;
    };
    return ThreeObject;
}());
var ThreePolygon = (function () {
    function ThreePolygon(vertices) {
        this.vertices = vertices;
    }
    ThreePolygon.prototype.setAverageDistance = function () {
        this.averageDistance = 0;
        for (var i = 0; i < this.vertices.length; i++) {
            this.averageDistance += this.vertices[i].distance;
        }
        this.averageDistance /= this.vertices.length;
        return this.averageDistance;
    };
    ThreePolygon.prototype.drawTo = function (canvas) {
        canvas.moveTo(this.vertices[this.vertices.length - 1].x2, this.vertices[this.vertices.length - 1].y2);
        for (var i = 0; i < this.vertices.length; i += 1) {
            canvas.lineTo(this.vertices[i].x2, this.vertices[i].y2);
        }
    };
    return ThreePolygon;
}());
var ThreePoint = (function () {
    function ThreePoint(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    ThreePoint.prototype.set2d = function (x, y) {
        this.x2 = x;
        this.y2 = y;
    };
    ThreePoint.prototype.distanceTo = function (point2) {
        return Math.sqrt((this.x - point2.x) * (this.x - point2.x) + (this.y - point2.y) * (this.y - point2.y) + (this.z - point2.z) * (this.z - point2.z));
    };
    return ThreePoint;
}());
var CONFIG = (function () {
    function CONFIG() {
    }
    return CONFIG;
}());
var Facade = (function () {
    function Facade() {
        var _this = this;
        this.interactionMode = "desktop";
        this.stageBorders = new PIXI.Rectangle(0, 0, 800, 500);
        this._Resolution = 1;
        this.windowToLocal = function (e) {
            return new PIXI.Point((e.x + _this.stageBorders.x) * _this._Resolution, (e.y + _this.stageBorders.y) * _this._Resolution);
        };
        this.init = function () {
            var display = new ThreeDisplay();
            display.display.x = (_this.stageBorders.width - display.getWidth()) / 2;
            display.display.y = (_this.stageBorders.height - display.getHeight()) / 2;
            _this.app.stage.addChild(display.display);
        };
        if (Facade.exists)
            throw "Cannot instatiate more than one Facade Singleton.";
        Facade.exists = true;
        try {
            document.createEvent("TouchEvent");
            this.interactionMode = "mobile";
        }
        catch (e) {
        }
        this.app = new PIXI.Application(this.stageBorders.width, this.stageBorders.height, {
            backgroundColor: 0xff0000,
            antialias: true,
            resolution: this._Resolution,
            roundPixels: true,
        });
        document.getElementById("game-canvas").append(this.app.view);
        this.app.stage.scale.x = 1 / this._Resolution;
        this.app.stage.scale.y = 1 / this._Resolution;
        this.app.stage.interactive = true;
        var _background = new PIXI.Graphics();
        _background.beginFill(0);
        _background.drawRect(0, 0, this.stageBorders.width, this.stageBorders.height);
        this.app.stage.addChild(_background);
        window.setTimeout(this.init, 10);
    }
    Facade.prototype.updateCurrentModule = function (o) {
        if (this.currentModule != null) {
            try {
                this.currentModule.dispose();
            }
            catch (e) {
                try {
                    this.currentModule.destroy();
                }
                catch (e) {
                }
            }
        }
        this.currentModule = o;
        this.app.stage.addChild(o);
    };
    Facade.exists = false;
    return Facade;
}());
var facade;
function initialize_game() {
    facade = new Facade();
}
