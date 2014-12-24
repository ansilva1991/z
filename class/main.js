function Main()
{
	this.canvas;
	this.ctx;
	this.img;
	this.orientation = 'portrait';
	
	this.gameview;
	
	this.loading_bar = new Image();
	this.loading_bar.src = 'files/gui/loading_bar.png';
	
	this.last_click = -1;
	
	this.Start = function(){
		this.canvas = document.createElement("canvas");
		this.canvas.style.cssText="idtkscale:ScaleAspectFit;";  // CocoonJS extension
		this.canvas.width = 320;
		this.canvas.height = 480;
		
		document.body.appendChild(this.canvas);
		
		this.canvas.addEventListener('touchstart',this.trackTouch,false);
		this.canvas.addEventListener('touchmove',this.trackTouch,false);
		this.canvas.addEventListener('touchend',this.trackTouch,false);
		this.canvas.addEventListener('touchcancel',this.trackTouch,false);
		
		this.canvas.addEventListener('mousedown',this.trackMouse,false);
		this.canvas.addEventListener('mousemove',this.trackMouse,false);
		this.canvas.addEventListener('mouseup',this.trackMouse,false);
		 
		this.ctx = this.canvas.getContext('2d',true);
		
		window.addEventListener('deviceorientation', function (event) {
			main.orientation = 'portrait';
			if((window.orientation == 90)||(window.orientation == -90))
			{
				main.orientation = 'landscape';
			}
			main.Rotate();
		}, true);
		
		this.loading_bar.onload = function(){
			main.gameview = new GameView(main);
			main.gameview.Start();
		};
	};
	this.trackTouch = function(e){
		e.preventDefault();
		var type = e.type;
		var x = e.changedTouches[0].clientX;
		var y = e.changedTouches[0].clientY;
		
		main.processInput(type,x,y);
	};
	this.trackMouse = function(e){
		var type = 'mousemove';
		if(e.type == 'mousedown'){ type = 'touchstart'; }
		if(e.type == 'mousemove'){ type = 'touchmove'; }
		if(e.type == 'mouseup'){ type = 'touchend'; }
		
		var x = e.clientX;
		var y = e.clientY;
		
		main.processInput(type,x,y);
	};
	this.processInput = function(type,x,y){
		if(type == 'touchstart')
		{
			this.last_click = new Date();
			this.last_click = this.last_click.getTime();
		}
		if(type == 'touchmove')
		{
			if(this.last_click > 0)
			{
				var d = new Date();
				d = d.getTime();
				
				if(this.last_click < d - 200)
				{
					this.gameview.Mousemove(x,y);
				}
			}
		}
		if(type == 'touchend')
		{
			var d = new Date();
			d = d.getTime();
			
			if(this.last_click > d - 200)
			{
				this.gameview.Mouseclick(x,y);
			}
			this.gameview.Mousecancel();
			this.last_click = -1;
		}
	};
	this.Rotate = function(){
		if(this.orientation == 'portrait')
		{
			this.canvas.width = 320;
			this.canvas.height = 480;
		}
		if(this.orientation == 'landscape')
		{
			this.canvas.width = 480;
			this.canvas.height = 320;
		}
		this.ctx.imageSmoothingEnabled = false;
	};
}