class CONFIG{
	
}

class Facade{
	app:any;
	interactionMode:String="desktop";
	stageBorders:PIXI.Rectangle=new PIXI.Rectangle(0,0,800,500);
	private _Resolution=1;
	static exists:Boolean=false;

	currentModule:any;	

	windowToLocal=(e:any):PIXI.Point=>{
		return new PIXI.Point((e.x+this.stageBorders.x)*this._Resolution,(e.y+this.stageBorders.y)*this._Resolution);
	}

	constructor(){
		if (Facade.exists) throw "Cannot instatiate more than one Facade Singleton.";
		Facade.exists=true;
		try{
			document.createEvent("TouchEvent");
			this.interactionMode="mobile";
		}catch(e){

		}
		this.app = new PIXI.Application(this.stageBorders.width,this.stageBorders.height,{
			backgroundColor:0xff0000,
			antialias:true,
			resolution:this._Resolution,
			roundPixels:true,
		});
		(document.getElementById("game-canvas") as any).append(this.app.view);

		this.app.stage.scale.x=1/this._Resolution;
		this.app.stage.scale.y=1/this._Resolution;

		this.app.stage.interactive=true;

		let _background=new PIXI.Graphics();
		_background.beginFill(0);
		_background.drawRect(0,0,this.stageBorders.width,this.stageBorders.height);
		this.app.stage.addChild(_background);
		
		//TextureData.init(this.app.renderer);
		window.setTimeout(this.init,10);
	}

	init=()=>{
		//this will happen after "preloader"
		let display=new ThreeDisplay();
		display.display.x=(this.stageBorders.width-display.getWidth())/2;
		display.display.y=(this.stageBorders.height-display.getHeight())/2;
		this.app.stage.addChild(display.display);
	}

	updateCurrentModule(o:any){
		if (this.currentModule!=null){
			try{
				this.currentModule.dispose();
			}catch(e){
				try{
					this.currentModule.destroy();
				}catch(e){
				}
			}
		}
		this.currentModule=o;
		this.app.stage.addChild(o);
	}
}

var facade:Facade;
function initialize_game(){
	facade=new Facade();
}