class ThreeDisplay{
	display:PIXI.Sprite=new PIXI.Sprite();
	myBorders:PIXI.Rectangle=new PIXI.Rectangle(0,0,700,300);

	mainIObject:IThreeObject;

	controlled:ThreeObject;
	mouse:Mouse;
	
	constructor(){
		
		//Setup Objects
		let myObject;
		//myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		myObject=new ThreeObject(ThreeGen.makePrism([[-50,-50],[-50,50],[0,0],[50,50],[50,-50]],120,{faceColor:0xffcc00,edgeColor:0xffcc00}));
		//myObject=new ThreeObject(ThreeGen.makeCylinder(100,100,{faceColor:0x00ccff,edgeColor:0xdd00dd}));
		this.display.addChild(myObject.display);
		this.controlled=myObject;
		myObject.display.x=100;
		myObject.display.y=100;

		this.mouse=new Mouse(this.controlled.display);
		this.mouse.moveCallback=this.onMove;
		window.addEventListener('keydown',this.keyDown);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=40;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=80;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=120;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=-19;
		// myObject.display.y=7;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=21;
		// myObject.display.y=7;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=61;
		// myObject.display.y=7;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=101;
		// myObject.display.y=7;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=-38;
		// myObject.display.y=14;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=2;
		// myObject.display.y=14;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=42;
		// myObject.display.y=14;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=82;
		// myObject.display.y=14;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=-57;
		// myObject.display.y=21;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=-17;
		// myObject.display.y=21;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=23;
		// myObject.display.y=21;
		// this.display.addChild(myObject.display);
		// myObject=new ThreeObject(ThreeGen.makeRectangular(40,40,40,{faceColor:0x00ccff}));
		// myObject.display.x=63;
		// myObject.display.y=21;
		// this.display.addChild(myObject.display);

	}

	getWidth(){
		return this.myBorders.width;
	}

	getHeight(){
		return this.myBorders.height;
	}

	keyDown=(e:any)=>{
		switch(e.key){
			case "a": this.controlled.rotateBy(0.1); break;
			case "d": this.controlled.rotateBy(-0.1); break;
			case "w": this.controlled.tiltBy(-0.1); break;
			case "s": this.controlled.tiltBy(0.1); break;
			case "q": this.controlled.yawBy(0.1); break;
			case "e": this.controlled.yawBy(-0.1); break;
		}
	}

	onMove=(e:Mouse)=>{
		if (e.down){
			let dX:number=e.position.x-e.startPosition.x;
			let dY:number=e.position.y-e.startPosition.y;
			e.startPosition.set(e.position.x,e.position.y);

			this.controlled.rotateBy(-dX/100);
			this.controlled.tiltBy(dY/100);
		}
	}

}

class Mouse{
	down:boolean=false;
	startPosition:PIXI.Point=new PIXI.Point(0,0);
	position:PIXI.Point=new PIXI.Point(0,0);
	moveCallback:(e:Mouse)=>void;

	constructor(private canvas:PIXI.Container){
		canvas.on('mousedown',this.mouseDown);
		canvas.on('mouseup',this.mouseUp);
		canvas.on('mouseupoutside',this.mouseUp);
		canvas.on('mousemove',this.mouseMove);
	}

	mouseDown=(e:PIXI.interaction.InteractionEvent)=>{
		e.data.getLocalPosition(this.canvas,this.startPosition);
		this.down=true;
	}

	mouseUp=(e:PIXI.interaction.InteractionEvent)=>{
		this.down=false;
	}

	mouseMove=(e:PIXI.interaction.InteractionEvent)=>{
		//console.log(e);
		if (this.moveCallback){
			e.data.getLocalPosition(this.canvas,this.position);
			this.moveCallback(this);
		}
	}
}