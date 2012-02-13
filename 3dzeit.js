var stage;
var prevrow;
var opacity = 0;
var ribWidth = 23;
var ribHeight = 10;
var slidedirection = 1;
var counter = 0;
var vertCoordArray;
var o = {x:140, y:440};
var ribLeft = 100;
var ribTop = 210;
var matrixLength = 10;
var opacityIncrementFactor = 0.01;
var divHeightValues = new Array();
var focuscount = 1;
var focuschanged = false;
var selectedrow;
var baseOpacity = 0.06;

$(document).ready(function(e) {
    init();
});
function tick()
{
	if(selectedrow)
	{
		for(var i=0; i<selectedrow.length; i++)
		{
			var h = selectedrow[i].style.height.split("px")[0];
			if(opacity <= 1)
			{
				selectedrow[i].style.opacity = opacity;
				opacity+= opacityIncrementFactor;
			}
		}
		
	}
}
function performSlide(e, i)
{
	var oldfocuscount = focuscount;
	var factor = i;

	if(oldfocuscount != factor)
	{
		opacity = baseOpacity;
		doScroll(factor, oldfocuscount);
	}
}
function init()
{
	var stage = new Stage();
	Ticker.setFPS(60);
	Ticker.addListener(window);
	initRange();
	createVerticalCoords();
}
function initRange()
{
	$(":range").rangeinput(
	{
		onSlide: function(e, i)  
		{
			performSlide(e, i);
		},
		progress: true,
		value: 0,

		change: function(e, i) 
		{
			performSlide(e, i);
		},

		speed: 2

	});
}
function createVerticalCoords()
{
	vertCoordArray = new Array();
	for(var i=0; i<matrixLength; i++)
	{
		if(i == 0)
		{
			vertCoordArray.push(o);
		}
		else
		{
			var newO = {x:vertCoordArray[i-1].x+ribWidth, y:vertCoordArray[i-1].y+ribHeight};
			vertCoordArray.push(newO);
		}
		drawDivs(i);
	}
	counter++;
	if(counter < matrixLength)
	{
		o = {x:vertCoordArray[1].x, y:vertCoordArray[0].y-ribHeight};
		createVerticalCoords();
	}
}
function doScroll(value, oldfocus)
{
	focuscount = value;
	if(value <matrixLength)
	{
		var items = new Array();
		var previtem = document.getElementsByClassName(classString+(oldfocus));
		prevrow = previtem;
		
		var rib = document.getElementById("ribbon");
		var leftval = ribLeft + (ribWidth * value);
		var topval = ribTop - (ribHeight * value);
		
		rib.style.left = (leftval) + "px";
		rib.style.top = (topval) + "px";
		
		var len = previtem.length;
		for(var j=len-1; j>=0; j--)
		{
			var cls = previtem[j]
			cls.style.opacity = baseOpacity;
		}
	}
	else
	{
		var currItem = document.getElementsByClassName(classString+value);
		for(var i=0; i<currItem.length; i++)
		{
			currItem[i].style.opacity = baseOpacity;
		}
	}
	if(value <10)
	{
		var currItem = document.getElementsByClassName(classString+value);
		for(var i=0; i<currItem.length; i++)
		{
			currItem[i].style.opacity = baseOpacity;
		}

	}
	selectedrow = currItem;
	focuschanged = true;
}
function drawDivs(value)
{
	var maj = document.getElementById("major");
	
	//Creating a random number based data set.

	var h = getDummyPlotHeight();
	divHeightValues.push(h);
	
	var html = divTemplate.split(divBottom).join(vertCoordArray[value].y+"px");
	html = html.split(divLeft).join(vertCoordArray[value].x+"px");
	
	html = html.split(divHeight).join(h);
	html = html.split(divClassName).join(classAssignString+value);
	maj.innerHTML += html;
}
function getDummyPlotHeight()
{
	return Math.round(Math.random()*100)+"px";
}
