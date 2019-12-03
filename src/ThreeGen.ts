class ThreeGen{
  static makeRectangular(width:number,depth:number,height:number,config:IThreeObject):IThreeObject{
		let points:number[][]=[[0,0,0],[width,0,0],[width,depth,0],[0,depth,0],
													[0,0,height],[width,0,height],[width,depth,height],[0,depth,height]];

		let faces:number[][]=[];
		if (config.edgeColor){
			faces.push([0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]);
		}
		faces.push([0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]);

    return {faces:faces,vertices:points,faceColor:config.faceColor,edgeColor:config.edgeColor,vertexColor:config.vertexColor};
	}

	static makePyramid(width:number,depth:number,height:number,config?:IThreeObject):IThreeObject{
		let points:number[][]=[[0,0,0],[0,depth,0],[width,depth,0],[width,0,0],[width/2,depth/2,height]];
		
		let faces:number[][]=[];
		if (config.edgeColor){
			faces.push([0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]);
		}
		faces.push([0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,4,4]);
		return {faces:faces,vertices:points,faceColor:config.faceColor,edgeColor:config.edgeColor,vertexColor:config.vertexColor};
	}

	static makePlane(width:number,depth:number,config?:IThreeObject):IThreeObject{
		let points:number[][]=[[0,0,0],[width,0,0],[width,depth,0],[0,depth,0]];
		let faces:number[][]=[[0,1,2,3]];
		
		return {faces:faces,vertices:points,faceColor:config.faceColor,edgeColor:config.edgeColor,vertexColor:config.vertexColor};
	}


	static makePyramidal(base:number[][],height:number,config?:IThreeObject):IThreeObject{
		let points:number[][]=[];
		let faces:number[][]=[];
		
		let topPoint=[0,0,height];
		let basePoly=[];

		let prev=base.length-1;
		for (let i=0;i<base.length;i+=1){
			points.push([base[i][0],base[i][1],0]);

			topPoint[0]+=base[i][0]/base.length;
			topPoint[1]+=base[i][1]/base.length;

			basePoly.push(i);
			faces.push([prev,i,base.length]);
			prev=i;
		}
		
		if (config.edgeColor){
			prev=base.length-1;
			for (let i=0;i<base.length;i++){
				faces.push([i,base.length]);
				faces.push([prev,i]);
        prev=i;
      }
		}

		faces.push(basePoly);
		points.push(topPoint)

    return {faces:faces,vertices:points,faceColor:config.faceColor,edgeColor:config.edgeColor,vertexColor:config.vertexColor};
  }
  
	static makePrism(base:number[][],height:number,config?:IThreeObject):IThreeObject{
		let points:number[][]=[];
		let faces:number[][]=[];
		
		let basePoly=[];
		let topPoly=[];

		let bottomPoints:number[][]=[];
		let topPoints:number[][]=[];

		let prev:number=base.length-1;
		for (let i=0;i<base.length;i+=1){
			basePoly.push(i);
			topPoly.push(i+base.length);

			bottomPoints.push([base[i][0],base[i][1],0]);
			topPoints.push([base[i][0],base[i][1],height]);
			faces.push([prev,i,i+base.length,prev+base.length]);
			prev=i;
		}

		if (config.edgeColor){
			prev=bottomPoints.length-1;
			for (let i=0;i<bottomPoints.length;i++){
				faces.push([i,i+base.length],[prev,i],[prev+base.length,i+base.length]);
				prev=i;
			}
		}
		faces.push(basePoly,topPoly);

		points=bottomPoints.concat(topPoints);

		return {faces:faces,vertices:points,faceColor:config.faceColor,edgeColor:config.edgeColor,vertexColor:config.vertexColor};
	}

	static makeCylinder(width:number,height:number,config:IThreeObject):IThreeObject{
		let center:PIXI.Point=new PIXI.Point(width/2,width/2);
		let distance:number=width/2;

		let topPoints:number[][]=[];
		let bottomPoints:number[][]=[];
		let sides:number=100;
		let topBase:number[]=[];
		let bottomBase:number[]=[];

		let faces:number[][]=[];

		let prev=sides-1;
		for (let i=0;i<sides;i++){
			let angle=Math.PI*2*i/sides;
			bottomPoints.push([center.x+distance*Math.cos(angle),center.x+distance*Math.sin(angle),0]);
			topPoints.push([bottomPoints[i][0],bottomPoints[i][1],height]);
			topBase.push(i);
			bottomBase.push(sides+i);

			faces.push([prev,i,i+sides,prev+sides]);
		}
		
		if (config.edgeColor){
			prev=bottomPoints.length-1;
			for (let i=0;i<sides;i++){
				faces.push([prev,i],[prev+sides,i+sides]);
				prev=i;
			}
		}
		faces.push(topBase,bottomBase);

		let points=bottomPoints.concat(topPoints);

    return {faces:faces,vertices:points,faceColor:config.faceColor,edgeColor:config.edgeColor,vertexColor:config.vertexColor};
	}
}