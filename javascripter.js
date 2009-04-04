//
// 
// Copyright (c) KUMAGAI Kentaro ku0522a*gmail.com
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
// 
// 
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
// 
// based on 
//  javascripter's script
//  	http://d.hatena.ne.jp/javascripter/20080910/1221063750
//  and arikui's idea
// 		http://d.hatena.ne.jp/arikui/20090402/1238678654
//

(function(){

  var canvas = document.createElement("canvas");
  var w = canvas.width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
  var h = canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);
  var context = canvas.getContext("2d");
  var drawing = false;
  var point = {
    x: null,
    y: null
  };

var toolMode = 'draw';
  canvas.addEventListener("mousedown", dispatch, false);
  canvas.addEventListener("mouseup",   dispatch, false);
  canvas.addEventListener("mousemove", dispatch, false);
  context.strokeStyle = "black";
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 3;

window.canvas  = canvas;
window.context  = context;

function dispatch(ev) {
	var handlersForMode = eventHandlers[toolMode];
	var f = handlersForMode[ev.type];
	f.apply(handlersForMode, arguments);
}

function enterMode(modename) {
	eventHandlers[toolMode].__leave();
	toolMode = modename;
	eventHandlers[toolMode].__enter();
}

function cursorPosition(e) {
	return [
	   e.clientX - window.pageXOffset,
	   e.clientY + window.pageYOffset
	];
}

function clearRoundedRect(X,Y,width,height,radius){
	var x1,x2,y1,y2;
	
	if ( width > 0 )
		[x1, x2] = [X, X + width];
	else
		[x1, x2] = [X + width, X];
	if ( height > 0 )
		[y1, y2] = [Y, Y + height];
	else
		[y1, y2] = [Y + height, Y];

	context.clearRect(X,Y,width,height);
	
	[x,y] = [x1, y1];
	context.beginPath();
	context.moveTo(x+radius,y);
	context.quadraticCurveTo(x,y,x,y+radius);
	context.lineTo(x,y);
	context.closePath();
	context.fill(); 

	[x,y] = [x2 - radius, y1];
	context.beginPath();
	context.moveTo(x,y);
	context.quadraticCurveTo(x+radius,y,x+radius,y+radius);
	context.lineTo(x+radius,y);
	context.closePath();
	context.fill(); 

	[x,y] = [x1, y2 - radius];
	context.beginPath();
	context.moveTo(x,y);
	context.quadraticCurveTo(x,y+radius,x+radius,y+radius);
	context.lineTo(x,y+radius);
	context.closePath();
	context.fill(); 

	[x,y] = [x2, y2 ];
	context.beginPath();
	context.moveTo(x,y-radius);
	context.quadraticCurveTo(x,y,x-radius,y);
	context.lineTo(x,y);
	context.closePath();
	context.fill(); 

}


var eventHandlers = {
	draw: {
		mousedown: function(e){
		  e.preventDefault();
		  drawing = true;
		  point.x = e.clientX - window.pageXOffset;
		  point.y = e.clientY + window.pageYOffset;
		},
		mouseup: function(e){
		  e.preventDefault();
		  drawing = false;
		  point.x = null;
		  point.y = null;
		},
		mousemove: function(e){
		  e.preventDefault();
		  if(!drawing) return;
		  context.beginPath();
		  context.moveTo(point.x, point.y);
		  context.lineTo(point.x = e.clientX - window.pageXOffset, point.y = e.clientY + window.pageYOffset);
		  context.closePath();
		  context.stroke();
		},
		__leave: function () {
			
		}
	},
	selection: {
		_fill: function () {
			context.fillRect(0, 0, w, h);
			// context.beginPath();
			// context.moveTo(0, 0);
			// context.lineTo(w, 0);
			// context.lineTo(w, h);
			// context.lineTo(0, h);
			// context.closePath();
			// context.fill();
		
		},
		__enter: function () {
			this._fill();
			canvas.style.opacity = 0.7;

			context.save();
		},
		mousedown: function(e){
		  e.preventDefault();
		  drawing = true;
		  this.x = e.clientX - window.pageXOffset;
		  this.y = e.clientY + window.pageYOffset;
		},
		mouseup: function(e){
		  e.preventDefault();
		  drawing = false;
		  point.x = null;
		  point.y = null;
		},
		mousemove: function(e){
		  e.preventDefault();
		  if(!drawing) return;

		  	var [x, y] = cursorPosition(e);
			
			this._fill();


			clearRoundedRect(
				this.x,
				this.y,
				x - this.x,
				y - this.y,
				5
			);

		},
		__leave: function () {
			
		}
	}

}

	var toolbox = document.createElement('div');
	with(toolbox.style ) {
		position = "fixed";
		top = "0";
		left = "0";
		zIndex = "19999";
		width = 32;
		height = 80;
		border = "1px solid #aaa";
	}
	document.body.appendChild(toolbox);

var closebox = document.createElement('div');
closebox.style.paddingRight = '7px';
closebox.style.background = 'rgb(243,243,243)';
closebox.style.margin = 0;
closebox.style.padding = 0;
closebox.style.textAlign = 'right';
toolbox.appendChild(closebox);
var closex = document.createElement('span');
closex.onclick = function () {
	toolbox.style.opacity = 0;
}
closex.innerHTML = 'X';
closex.style.cursor = 'pointer';
closex.style.fontSize = '14px';
closex.style.margin = '3px';
closex.style.fontWeight = 'bold';
closebox.appendChild(closex);

	var pen = document.createElement('img');
	pen.src = 'data:image/png;base64,'+
'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'+
'/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kEAwEvGB5iJGUAAAAZdEVYdENv'+
'bW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADBUlEQVRYw+2XXWhTVxzAfye59yY3ibVD1Lq4'+
'TV+GD4If+DBxwuaGA7HDDxybCDJc4psgTKhlb8pAGPgc9GmzzjJQyMY2tGb4kTJaLTWL4keDTmti'+
'q2mTXtYk5375UIUpqfbjDmH2vB04h9/v/v//8z/3CMMwXF7h8PGKx4zA/1fAcewJrVO8Bme6O+g8'+
'fYTCvWt8tOlrVq/7HFUL1Jd0HW8FUskEd6+e5asvvkFRdH776SB/jJZZv2VP3fW2ZXuXglQywZ3M'+
'ab7ccRA9PBfn+g0+sN/k8u9HqdUqdfeYpumNQCqZYOB2hk+3f4vjDyEzPZhXunCyaYTwo/jrB9qy'+
'rOkLpJIJrqTbeG/thwyZLtniECO5m1jZC3QER1i1IYZfUf+bU/AUvm1LM2HRj7h9GEtWyIdnc04f'+
'5l50Me+v3znuftd1p16E/4ZrmsrI/YuY1TIl41esf2xy898htu8HgnrY+2P4PNzIp5HVMtlcmcKj'+
'XxB6lFhLG8FQxPtGVA9eq5TI5srcH6wh9Cjxljb00CzvO2EqmaA3fYxtmzc+C+8rk39YQ+hvEWs5'+
'RnCC8Eml4Cn8s83NaAENI99JrVLir74yhUcSAlHi+4+jhxq8vwvqw4fJ3CpTeFjBDSwg3nqCULhh'+
'0vX0UoHL6Z/pvfj9WNifgz8oViG4kN1ThE9I4M8zR9m4qRk1oGLkO6mOjsEHilUcdQGx/T8SCs+e'+
'2lkWL6mBUnGA0lA/TYtWokbmYZmjdHUkGRyuYitNxFvbCUcap9zIBOLFEcj2dLBs2VIcq4I0Cuhz'+
'3mXIsLH884m3thOZ1Tjte+SFEehNt/PJ1r0UB3PcutrJpUu9RBctZ2fsOyINb0wbLoQYX2C4+ID+'+
'O1m6L5zkbl8Pqz/exZ4Dh2honOvZ/4Oqqojx3gVd50/x981uVqzZStPbS5CmiWWaSClxHBvXcRE+'+
'H4qioCgKAU1DVVWCwSA+38T6m23b4ws4roNP+HAcBylNTFMipYk0a8iaHPsCTXsGrj2ZTyoNMy+j'+
'GYHXXuAxuR9rssv+7CwAAAAASUVORK5CYII=';
	toolbox.appendChild(pen);
	pen.addEventListener( 'click', function (ev) {
		enterMode( 'draw' );
	} ,false);

	var selection = document.createElement('img');
	selection.src = 'data:image/png;base64,'+
'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A'+
'/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kEAwEuHXcT4asAAAAZdEVYdENv'+
'bW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAB4UlEQVRYw+2WwY6bQBBEq4cxRnLIb0SbVa5x'+
'LMVf70iOc8phlUsU7T8YIWRgunKAGSAbs8uyki9wGcPYXdVvipYlyzLihpfBja/FwGJgMTBqIE1T'+
'PPz6OWt97rJjm8fTAV8+fwXZzKqp6/F0eNaAjE3CNE1BEn8efwNsCpMAoQAJAu3z5gPB9jvE/d0n'+
'iAiyLJtHoG2pEW7XRqwVD8KdmykERjOw2+69fhBhK94965lSQpuNwe9nE/BCvjKH7EPXHRW8LQEo'+
'gx57KiRA1XAMIRfQtyWgvssg7EloOA6fB4QjmUmAZNdBwNvrtBfMgbkuoi8iYK6JV1X1JANs21V/'+
'H0R9MBkMeQLOuekGnHMoimLwFvgufRj7bwVIQId0PIGiKKCq0zKgqijLMhC4+/DxVXP+eDqgqiqo'+
'KowxLydgjIG1FrvtHt9/fIOIvGrdbfcwkYGITBvFJFGWJfI8x/l8Rp7nKIoCl8sFZVmCJIwxAS1B'+
'RCbCer3GarVCkiTYbDZI36dI36WI4/iqif8egYggjmNEUYQkSeCcQ13XqKoKdV2DZCgoIs29MbBR'+
'BGstrLUwxjQ1bDRK4OocEJFQzFMhCHU6KNgZEIB4sjdrEP1rSCAwdmR4yvSgLn/JFgOLgZsb+Avu'+
'r67QWpoDHgAAAABJRU5ErkJggg==';
	toolbox.appendChild(selection);
	selection.addEventListener( 'click', function (ev) {
		enterMode( 'selection' );
	} ,false);


	// toolbox.addEventListener("mousedown", function(e){
	// alert(1)
	// }, false );
} )()
