
var canvas;
var stage;
var bmp;
var ctx;

var foot;
var scalingClip;
var cap;
var scaledObjects = new Array();
var caps = new Array();
var xPosition = 2;

var bottomPosition = 315 // Configure this
var offsetGutter = 3;
var capAdjust = 1;
var graphItemWidth = 30;
var graphItemRegY = 6.7
var scalingItemHeight = 7;

var chartLabelTop = 100;
var chartLabelXPosition = 508;
var chartLabelYPosition = 10;
var gridGutter = 60;

var ribbedProps;
var items = new Array();

var plots = new Array();
var plottingComplete = false;
var topIndex;
var plotStartYPos = 0;

var toScale = 10;
var scalingDone = false;
var g;
var tickcount =0;
var tweenCompleted = false;
var tweenCounter = 0;
var currentPlot;
var plotindices = new Array();

var intr;
var animateCounter = 0;
var newIndex;
var firstDrop = true;
var hideCounter = 0;
var g;

var tempYOffset = 270;
$(document).ready(function(e) 
{
    init();
});
function init()
{
	canvas = document.getElementById("canvas");	
	
	var parentDiv = $("#chartHolder");
	canvas.width = parentDiv.width();
	canvas.height = parentDiv.height();
		
	stage = new Stage(canvas);
	Ticker.setFPS(60);
	Ticker.addListener(window);
	addChartLabels();
	for(var i =0; i<16; i++)
	{
		items.push({val:"item"+i, toScale:(Math.round(Math.random()*10))*3})
		
	}
	addChartItems();
	drawLines();
	dropPlotPoints();
}
function addChartLabels()
{
	topIndex = Math.round(Math.random()*10);
	for(var i=0; i<5; i++)
	{
		var text = new Text(chartLabelTop.toString(), "Droid Sans", "#DDDDDD");
		text.y = chartLabelYPosition;
		text.x = chartLabelXPosition;
		stage.addChild(text);
		chartLabelTop-= 20;
		chartLabelYPosition += gridGutter;
	}
}
function addChartItems()
{
	//Static bottom;
	var tempArr = new Array();
	for(var i=0; i<items.length; i++)
	{
		tempArr.push(items[i]);
	}
	tempArr.sort(compare);
	
	for(var x =0; x< items.length; x++)
	{
		if(items[x].toScale == tempArr[tempArr.length-1].toScale)
		{
			topIndex = x;
			break;
		}
	}
	
	for(var index =0 ; index < items.length; index++)
	{
			var capPosition;
				
			if(index % 2 == 0)
			{
				xPosition+= offsetGutter;
			}
			capPosition = xPosition - capAdjust;
			
			if(index == topIndex)
			{
				newIndex = index;
			}
			
			var image = new Image();
			image.src = "img/volbarbottom.png";
			bmp = new Bitmap(image);
			stage.addChild(bmp);
			bmp.y = bottomPosition;
			bmp.x = xPosition;
			
			//Scaling portion;
			var image2 = new Image()
			image2.src = "img/scaleclip.png";
			bmp = new Bitmap(image2);
			stage.addChild(bmp);
			scalingClip = bmp;
			bmp.y = bottomPosition;
			bmp.x = xPosition;
			
			scaledObjects.push({clip:scalingClip, toScale:items[index].toScale});
			//The cap;
			var image3 = new Image()
		
			image3.src = "img/cap.png";
	
			bmp = new Bitmap(image3);
			bmp.x = capPosition;
			cap = bmp;
			caps.push(cap);
			stage.addChild(bmp);
			
			var plot = new Image();
			plot.src = "img/plot.png";
			bmp = new Bitmap(plot);
			
			stage.addChild(bmp);
			bmp.x = (xPosition) + 5;
			bmp.y = plotStartYPos;
			plots.push({clip:bmp, toPos:320});
			stage.update();
			plotStartYPos -= 40;

			xPosition = xPosition + graphItemWidth;

	}

}
function onMouseOver(e)
{
	console.log("Mouse over");
}
function compare(a,b)
{
	return a.toScale-b.toScale;
}

function tick()
{

	for(var i=0; i<scaledObjects.length; i++)
	{
			
		
			var scalingClip = scaledObjects[i].clip;
			toScale = scaledObjects[i].toScale;
			var cap = caps[i];
			$("#ribbedDiv").regY = graphItemRegY;
			scalingClip.regY = graphItemRegY;
			var s= scalingClip.scaleY;
			var h = s * scalingItemHeight;
			//console.log(Math.round(h)+"  "+plots[i].y);
			if(scalingClip.scaleY < toScale)
			{
				scalingClip.scaleY += 0.5;
				cap.y = bottomPosition - (s*scalingItemHeight);
				


			}
			else if(scalingClip.scaleY > toScale)
			{
				scalingClip.scaleY -= 0.5;
				cap.y = bottomPosition - (s*scalingItemHeight)
				
			}
		
	}
	
	if(plottingComplete)
	{
		g.clear();
		g.setStrokeStyle(2);
		g.beginStroke(Graphics.getRGB(249,225,142));
		traceLocations();
	}
	stage.update();
}
function onComplete()
{
	tweenCounter++;
	if(tweenCounter == 16)
	{
		doCleanPlot();
		if(firstDrop)
		{
			getRealData();
			firstDrop = false;
		}
	}
	
}
function getRealData()
{
	for(var m=0; m<plots.length; m++)
	{
		plots[m].toPos = tempYOffset - Math.round(Math.random()*100);

	}
	dropPlotPoints();
}
function animateBackground(value)
{
	chartHolder.addEventListener("webkitTransitionEnd", onEnd);
	if(value == 0)
	{
		$("#chartHolder").addClass("animateLeft");	
	}
	else if(value == 1)
	{
		$("#chartHolder").addClass("animateRight");	

	}
}
function createDummyChartCoordinates()
{
	for(var i =0; i<scaledObjects.length; i++)
	{
		var scaleval = Math.round(Math.random()*10)*3;
		scaledObjects[i].toScale = scaleval;
	}
}
function doScroll(value)
{
	tweenCompleted = false;
	animateBackground(value);
	hideLabels();
	createDummyChartCoordinates();
	//doTopIndexCalculation()
	createDummyPlotPositions();
	dropPlotPoints();
	tweenCounter = 0;
	
}
function doTopIndexCalculation()
{
	var tempArr = new Array();
	for(var x =0; x<scaledObjects.length; x++)
	{
		tempArr.push(scaledObjects[x]);
	}
	tempArr.sort(compare);
	for(var z=0; z<scaledObjects.length; z++)
	{
		if(scaledObjects[z].toScale == tempArr[tempArr.length-1].toScale)
		{
			topIndex = z;
			break;
		}
	}
}
function createDummyPlotPositions()
{
	g.clear();
	for(var m=0; m<plots.length; m++)
	{
		plots[m].toPos = tempYOffset - Math.round(Math.random()*100);

	}
}
function hideLabels()
{
	$("#w1").addClass("animateDown");
	$("#w2").addClass("animateDown");
	$("#w3").addClass("animateDown");
	$("#w4").addClass("animateDown");

	w1.addEventListener("webkitTransitionEnd", onHide);
	w2.addEventListener("webkitTransitionEnd", onHide);
	w3.addEventListener("webkitTransitionEnd", onHide);
	w4.addEventListener("webkitTransitionEnd", onHide);



}
function onEnd(e)
{
	$("#chartHolder").removeClass("animateLeft");	
	$("#chartHolder").removeClass("animateRight");	
}
function onHide(e)
{
	hideCounter++;
	$("#w1").removeClass("animateDown");
	$("#w2").removeClass("animateDown");
	$("#w3").removeClass("animateDown");
	$("#w4").removeClass("animateDown");

	$("#w1").addClass("resetLabelPos");
	$("#w2").addClass("resetLabelPos");
	$("#w3").addClass("resetLabelPos");
	$("#w4").addClass("resetLabelPos");	
}
function drawLines()
{
	g = new Graphics();
	g.setStrokeStyle(2);
	g.beginStroke(Graphics.getRGB(249,225,142));
	var s = new Shape(g);
	s.width = 560;
	s.height = 420;
	stage.addChild(s);
}
function dropPlotPoints()
{
	plottingComplete = false;
	for(var i=0; i<plots.length; i++)
	{
		Tween.get(plots[i].clip).to({x:plots[i].clip.x, y:plots[i].toPos}, 100*(Math.random()+i)).call(onComplete);
	}	
	plottingComplete = true			
}
function traceLocations()
{
	for(var i=0; i<plots.length; i++)
	{
		g.lineTo(plots[i].clip.x+8, plots[i].clip.y+7);
	}
}
function plotLines()
{
	g.setStrokeStyle(2);
	g.beginStroke(Graphics.getRGB(249,225,142));
	for(var i=0; i<plots.length; i++)
	{
		if(plots[i].clip.y > 0)
		{
			g.lineTo(plots[i].clip.x+8, plots[i].clip.y+7);
			
		}

	}
	doCleanPlot();
	g.endStroke();
	
}
function doCleanPlot()
{
	for(var i=0; i<plots.length;i++)
	{
		stage.removeChild(plots[i]);
	}
	for(var i=0; i<plots.length;i++)
	{
		var bmp = plots[i].clip;
		stage.addChild(bmp);
	}
}
