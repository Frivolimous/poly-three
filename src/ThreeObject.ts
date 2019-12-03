interface IThreeObject{
  vertices?:number[][],
  faces?:number[][],
  faceColor?:number,
  edgeColor?:number,
  vertexColor?:number,
}

class ThreeObject{
  display:PIXI.Sprite=new PIXI.Sprite;
  graphics:PIXI.Graphics=new PIXI.Graphics;

  vertices:ThreePoint[]=[];
  faces:ThreePolygon[]=[];

  tilt:PIXI.Point=new PIXI.Point(0.5,0.2);
  perspective=new ThreePoint(750,0,1000);

  alpha0:number=0;
  alpha1:number=0.9;

  center:ThreePoint=new ThreePoint(0,0,0);
  offset:PIXI.Point=new PIXI.Point(0,0);

  constructor(private config:IThreeObject){
    this.display.interactive=true;
    for (let i=0;i<config.vertices.length;i++){
      this.vertices.push(new ThreePoint(config.vertices[i][0],config.vertices[i][1],config.vertices[i][2]));
    }
    for (let i=0;i<config.faces.length;i++){
      let points:ThreePoint[]=[];
      for (let j=0;j<config.faces[i].length;j++){
        points.push(this.vertices[config.faces[i][j]]);
      }
      this.faces.push(new ThreePolygon(points));
    }

    config.faceColor=config.faceColor || 0x0033ee;
    
    this.display.addChild(this.graphics);

    this.resetPoints(true);
    this.sortPolyList();
    this.draw();
  }

  rotateBy(radians:number){
    for (let i=0;i<this.vertices.length;i++){
      let x = this.vertices[i].x-this.center.x;
      let y = this.vertices[i].y-this.center.y;
      this.vertices[i].x=this.center.x + x*Math.cos(radians) + y*Math.sin(radians);
      this.vertices[i].y=this.center.y + y*Math.cos(radians) - x*Math.sin(radians);
    }
    this.redraw();
  }

  yawBy(radians:number){
    for (let i=0;i<this.vertices.length;i++){
      let z = this.vertices[i].z-this.center.z;
      let x = this.vertices[i].x-this.center.x;
      this.vertices[i].z=this.center.z + z*Math.cos(radians) + x*Math.sin(radians);
      this.vertices[i].x=this.center.x + x*Math.cos(radians) - z*Math.sin(radians);
    }
    this.redraw();
  }

  tiltBy(radians:number){
     for (let i=0;i<this.vertices.length;i++){
      let z = this.vertices[i].z-this.center.z;
      let y = this.vertices[i].y-this.center.y;
      this.vertices[i].z=this.center.z + z*Math.cos(radians) + y*Math.sin(radians);
      this.vertices[i].y=this.center.y + y*Math.cos(radians) - z*Math.sin(radians);
    }
    this.redraw();
  }
  
  redraw(){
    this.resetPoints();
    this.sortPolyList();
    this.draw();  
  }

  resetPoints(resize:boolean=false){
    this.vertices.forEach((point:ThreePoint)=>{
      let point2d=this.threeToPoint(point);
      point.set2d(point2d.x,point2d.y);
      point.distance=point.distanceTo(this.perspective);
    });

    if (resize){
      this.offset.set(Infinity,Infinity);
      
      for (let i=0;i<this.vertices.length;i++){
        if (this.vertices[i].x2<this.offset.x){
          this.offset.x=this.vertices[i].x2;
        }
        if (this.vertices[i].y2<this.offset.y){
          this.offset.y=this.vertices[i].y2;
        }
        this.center.x+=this.vertices[i].x;
        this.center.y+=this.vertices[i].y;
        this.center.z+=this.vertices[i].z;
      }
      this.center.x/=this.vertices.length;
      this.center.y/=this.vertices.length;
      this.center.z/=this.vertices.length;
    }else{

    }
    for (let i=0;i<this.vertices.length;i++){
      this.vertices[i].x2-=this.offset.x;
      this.vertices[i].y2-=this.offset.y;
    }
  }

  threeToPoint(point:ThreePoint):PIXI.Point{
    let x = point.x/(1+point.y*0.0005)+point.y*this.tilt.x;
    let y = 0 - point.z/(1+point.y*0.0005) - point.y*this.tilt.y;
    return new PIXI.Point(x,y);
  }

	sortPolyList(){
    this.faces.forEach((e:ThreePolygon)=>{e.setAverageDistance()});
    
		this.faces.sort((a:ThreePolygon,b:ThreePolygon):number=>{
			let dA=a.averageDistance;
			let dB=b.averageDistance;
			
			if (dA<dB){
				return 1;
			}else if (dB<dA){
				return -1;
			}else{
				return 0;
			}
		});
  }
  
  draw(){
    this.graphics.clear();
    for (let i=0;i<this.faces.length;i+=1){
      if (this.faces[i].vertices.length===1){

      }else if (this.faces[i].vertices.length===2){
        if (!this.config.edgeColor){
          continue;
        }
        this.graphics.lineStyle(1,this.config.edgeColor);
        this.faces[i].drawTo(this.graphics);
      }else{
        let alpha:number=this.alpha0+(this.alpha1-this.alpha0)*(1-i/(this.faces.length));
        this.graphics.lineStyle(0);
        this.graphics.beginFill(this.config.faceColor,alpha);
        this.faces[i].drawTo(this.graphics);
        this.graphics.endFill();
      }
    }

    if (this.config.vertexColor){
      this.graphics.beginFill(this.config.vertexColor);
      for (let i=0;i<this.vertices.length;i++){
        this.graphics.drawCircle(this.vertices[i].x2,this.vertices[i].y2,5);
      }
    }
  }

  getWidth(){
    return this.graphics.width;
  }

  getHeight(){
    return this.graphics.height;
  }
}

class ThreePolygon{
  averageDistance:number;
	constructor(public vertices:Array<ThreePoint>){}

	setAverageDistance(){
		this.averageDistance=0;
		for (let i=0;i<this.vertices.length;i++){
      //console.log(this.vertices)
			this.averageDistance+=this.vertices[i].distance;
		}
		this.averageDistance/=this.vertices.length;
		return this.averageDistance;
  }
  
  drawTo(canvas:PIXI.Graphics){
    canvas.moveTo(this.vertices[this.vertices.length-1].x2,this.vertices[this.vertices.length-1].y2);
    for (let i=0;i<this.vertices.length;i+=1){
      canvas.lineTo(this.vertices[i].x2,this.vertices[i].y2);
    }
  }
}

class ThreePoint{
  public x2:number;
  public y2:number;
  public distance:number;

	constructor(public x?:number,public y?:number,public z?:number){
	}
  
  set2d (x?:number, y?:number){
    this.x2=x;
    this.y2=y;
  }

  distanceTo(point2:ThreePoint):number{
		return Math.sqrt((this.x-point2.x)*(this.x-point2.x)+(this.y-point2.y)*(this.y-point2.y)+(this.z-point2.z)*(this.z-point2.z));
  }
}