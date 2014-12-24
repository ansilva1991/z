function GameView(main)
{
	this.canvas = main.canvas;
	this.ctx = main.ctx;
	
	this.etapa = 'none';
	this.etapa_start = false;
	
	this.last_loop = 0;
	this.loop;
	this.loops_x_second = 0;
	
	this.values_tmp = new Object();
	
	this.images_load = new Array(
		{
			src : 'files/gui/logo_dep.jpg',
			name : 'logo_dep',
			type : 'gui'
		},
		{
			src : 'files/tiles/tile_test.png',
			name : 'tile_test',
			type : 'tiles'
		},
		{
			src : 'files/sprites/ch_1.png',
			name : 'ch_1',
			type : 'sprites'
		},
		{
			src : 'files/sprites/ch_1_b.png',
			name : 'ch_1_b',
			type : 'sprites'
		},
		{
			src : 'files/sprites/ch_1_c.png',
			name : 'ch_1_c',
			type : 'sprites'
		},
		{
			src : 'files/sprites/ch_1_d.png',
			name : 'ch_1_d',
			type : 'sprites'
		},
		{
			src : 'files/gui/arrow_player.png',
			name : 'arrow_player',
			type : 'gui'
		},
		{
			src : 'files/gui/title_back.png',
			name : 'title_back',
			type : 'gui'
		},
		{
			src : 'files/gui/title_clouds.png',
			name : 'title_clouds',
			type : 'gui'
		},
		{
			src : 'files/gui/title_tree.png',
			name : 'title_tree',
			type : 'gui'
		},
		{
			src : 'files/gui/title_hand.png',
			name : 'title_hand',
			type : 'gui'
		},
		{
			src : 'files/gui/title_ohh.png',
			name : 'title_ohh',
			type : 'gui'
		},
		{
			src : 'files/gui/title_zombies.png',
			name : 'title_zombies',
			type : 'gui'
		},
		{
			src : 'files/gui/title_moon.png',
			name : 'title_moon',
			type : 'gui'
		},
		{
			src : 'files/gui/title_button_play.png',
			name : 'title_button_play',
			type : 'gui'
		},
		{
			src : 'files/gui/title_button_config.png',
			name : 'title_button_config',
			type : 'gui'
		},
		{
			src : 'files/gui/title_button_level.png',
			name : 'title_button_level',
			type : 'gui'
		},
		{
			src : 'files/gui/title_button_right.png',
			name : 'title_button_right',
			type : 'gui'
		},
		{
			src : 'files/gui/title_button_left.png',
			name : 'title_button_left',
			type : 'gui'
		},
		{
			src : 'files/gui/title_star.png',
			name : 'title_star',
			type : 'gui'
		},
		{
			src : 'files/gui/title_star_b.png',
			name : 'title_star_b',
			type : 'gui'
		},
		{
			src : 'files/gui/title_numbers.png',
			name : 'title_numbers',
			type : 'gui'
		}

	);
	this.total_resources = this.images_load.length;
	
	this.resources = { gui : new Object(), tiles : new Object() , sprites : new Object()};
	
	this.gamemotor;
	this.titlemotor;
	
	this.Start = function(){
		this.changeEtapa('load_screen');
		this.loop = function(){
			var d = new Date();
			var dif = d.getTime() - main.gameview.last_loop;
			if(dif >= (1000/30)-1)
			{
				main.gameview.last_loop = d.getTime();
				main.gameview.Update();
				main.gameview.loops_x_second += 1;
			}
			webkitRequestAnimationFrame(main.gameview.loop);
		};
		this.loop();
	};
	this.Update = function(){
		if(this.etapa == 'load_screen')
		{
			if(!this.etapa_start)
			{
				this.values_tmp.porcentaje = 0;
				this.etapa_start = true;
				
				for(var i = 0; i < this.images_load.length; i += 1)
				{
					var tmp = new Image();
					tmp.src = this.images_load[i].src;
					tmp.onload = function(){
						main.gameview.values_tmp.porcentaje += 100/main.gameview.total_resources;
					};
					main.gameview.resources[this.images_load[i].type][this.images_load[i].name] = tmp;
				}
			}
			
			//Update
			if(this.values_tmp.porcentaje > 99.999)
			{
				this.changeEtapa('game');
				return;
			}
			//Draw
			this.ctx.fillStyle = "#fff";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
			
			this.ctx.textAlign = 'center';
			this.ctx.font = "30px zombie";
			this.ctx.fillStyle = "#000";
			this.ctx.fillText(this.values_tmp.porcentaje.toFixed(2) + " %", this.canvas.width * 0.5 , this.canvas.height * 0.45);
			
			this.ctx.drawImage(main.loading_bar,0,0,this.canvas.width * (this.values_tmp.porcentaje/100),58,0,this.canvas.height * 0.5,this.canvas.width * (this.values_tmp.porcentaje/100),58);
		}
		if(this.etapa == 'logo_screen')
		{
			if(!this.etapa_start)
			{
				this.values_tmp.paso = 0;
				this.values_tmp.time = 0;
				this.values_tmp.alpha = 0;
				
				this.etapa_start = true;
			}
			//Update
			if(this.values_tmp.paso == 0)
			{
				this.values_tmp.alpha += 0.05;
				if(this.values_tmp.alpha > 1)
				{
					this.values_tmp.alpha = 1;
					this.values_tmp.paso = 1;
				}
			}
			if(this.values_tmp.paso == 1)
			{
				this.values_tmp.time += 1;
				if(this.values_tmp.time > 20)
				{
					this.values_tmp.alpha = 1;
					this.values_tmp.paso = 2;
				}
			}
			if(this.values_tmp.paso == 2)
			{
				this.values_tmp.alpha -= 0.05;
				if(this.values_tmp.alpha < 0)
				{
					this.values_tmp.alpha = 0;
					this.changeEtapa('game');
					return;
				}
			}
			//Draw
			this.ctx.fillStyle = "#fff";
			this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
			
			this.ctx.save();
				this.ctx.globalAlpha = this.values_tmp.alpha;
				this.ctx.drawImage(this.resources.gui.logo_dep,0,0,this.resources.gui.logo_dep.width,this.resources.gui.logo_dep.height,this.canvas.width * 0.5 - this.resources.gui.logo_dep.width * 0.5,this.canvas.height * 0.5 - this.resources.gui.logo_dep.height * 0.5,this.resources.gui.logo_dep.width,this.resources.gui.logo_dep.height);
			this.ctx.restore();
		}
		if(this.etapa == 'title')
		{
			if(!this.etapa_start)
			{
				this.titlemotor = new TitleMotor(this);
				this.titlemotor.Start('init');
				this.etapa_start = true;
			}
			this.titlemotor.Update();
		}
		if(this.etapa == 'game')
		{
			if(!this.etapa_start)
			{
				this.gamemotor = new GameMotor(this,2);
				this.gamemotor.Start();
				this.etapa_start = true;
			}
			this.gamemotor.Update();
		}
	};
	this.changeEtapa = function(n){
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		
		this.etapa = n;
		this.etapa_start = false;
		this.values_tmp = new Object();
	};
	this.Mouseclick = function(x,y){
		if(this.etapa == 'game')
		{
			if(this.etapa_start)
			{
				this.gamemotor.Mouseclick(x,y);
			}
		}
		if(this.etapa == 'title')
		{
			if(this.etapa_start)
			{
				this.titlemotor.Mouseclick(x,y);
			}
		}
	};
	this.Mousemove = function(x,y){
		if(this.etapa == 'game')
		{
			if(this.etapa_start)
			{
				this.gamemotor.Mousemove(x,y);
			}
		}
	};
	this.Mousecancel = function(){
		if(this.etapa == 'game')
		{
			if(this.etapa_start)
			{
				this.gamemotor.Mousecancel();
			}
		}
	};
}