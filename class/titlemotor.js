function TitleMotor(gameview){
	this.gameview = gameview;
	
	this.canvas = this.gameview.canvas;
	this.ctx = this.gameview.ctx;

	this.globalAlpha = 0;

	this.objects = new Array();
	this.graphic_scale = 1;

	this.list_sprites = new Object();
	this.list_buttons = new Object();
	this.list_overlays = new Object();
	this.levels;

	this.etapa = 'none';
	this.etapa_start = false;
	this.values_tmp = new Object();

	this.Start = function(etapa){
		this.levels = new Levels(this);
		//Iniciar Sprites
		this.list_sprites.back = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_back,0,0,1,"center",this)) - 1 ];
		this.list_sprites.moon = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_moon,0,0,1,"center",this)) - 1 ];
		this.list_sprites.hand = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_hand,0,0,0,"center",this)) - 1 ];
		this.list_sprites.tree = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_tree,0,0,1,"center",this)) - 1 ];
		this.list_sprites.cloud_a = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_clouds,0,0,0.25,"center",this)) - 1 ];
		this.list_sprites.cloud_b = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_clouds,240,0,0.25,"center",this)) - 1 ];
		this.list_sprites.zombies = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_zombies,0,0,0,"center",this)) - 1 ];
		this.list_sprites.ohh = this.objects[this.objects.push(new Sprite(this.gameview.resources.gui.title_ohh,0,0,0,"center",this)) - 1 ];
		this.list_buttons.play = this.objects[this.objects.push(new Button(this.gameview.resources.gui.title_button_play,0,0,0,"center",this,function(parent){
			parent.parent.changeEtapa('levels');
		})) - 1 ];
		this.list_buttons.config = this.objects[this.objects.push(new Button(this.gameview.resources.gui.title_button_config,0,0,0,"center",this,function(parent){
			console.log('Config');

		})) - 1 ];
		this.list_overlays.a = this.objects[this.objects.push(new Overlay(0,this)) - 1 ];
		this.list_buttons.right = this.objects[this.objects.push(new Button(this.gameview.resources.gui.title_button_right,0,0,0,"center",this,function(parent){
			var levels = parent.parent.levels;
			if(levels.page < levels.max_pages - 1){
				levels.page += 1;
			}
		})) - 1 ];
		this.list_buttons.left = this.objects[this.objects.push(new Button(this.gameview.resources.gui.title_button_left,0,0,0,"center",this,function(parent){
			var levels = parent.parent.levels;
			if(levels.page > 0){
				levels.page -= 1;
			}
		})) - 1 ];

		this.changeEtapa(etapa);
	};
	this.Update = function(){
		if(this.etapa == 'init'){
			if(!this.etapa_start){
				this.globalAlpha = 0;
				this.values_tmp.paso = 0;
				this.values_tmp.step = 0;

				this.list_sprites.zombies.alpha = 0;
				this.list_sprites.ohh.alpha = 0;
				this.list_overlays.a.alpha = 0;

				this.etapa_start = true;
			}
			if(this.values_tmp.paso == 0){
				this.values_tmp.step += 1;
				if(this.values_tmp.step > 20){
					this.values_tmp.paso = 1;
					this.values_tmp.step = 0;
					this.list_sprites.ohh.alpha = 1;
					this.list_sprites.hand.y = this.canvas.height * 0.9;
					this.list_sprites.hand.alpha = 1;
				}
				if(this.globalAlpha < 1){
					this.globalAlpha += 0.1;
				}
				
			}
			if(this.values_tmp.paso == 1){
				this.values_tmp.step += 1;
				if(this.list_sprites.hand.y > this.canvas.height * 0.29){
					this.list_sprites.hand.y -= 3;
					this.list_sprites.hand.x = this.list_sprites.hand.x = this.canvas.width * 0.25 + Math.sin(this.values_tmp.step);
				}
				if(this.list_sprites.hand.y < this.canvas.height * 0.29){
					this.list_sprites.hand.y = this.canvas.height * 0.29;
				}
				if(this.values_tmp.step > 70){ this.values_tmp.paso = 2; }
			}
			if(this.values_tmp.paso == 2){
				this.values_tmp.step += 1;
				if(this.list_sprites.hand.y > this.canvas.height * 0.29){
					this.list_sprites.hand.y -= 7;
					this.list_sprites.hand.x = this.list_sprites.hand.x = this.canvas.width * 0.25 + Math.sin(this.values_tmp.step);
				}
				if(this.list_sprites.hand.y <= this.canvas.height * 0.29){
					this.list_sprites.hand.y = this.canvas.height * 0.29;
					this.values_tmp.paso = 2;
					this.values_tmp.step = 0;
					this.list_sprites.zombies.alpha = 1;
					this.changeEtapa('title');
				}
			}
		}
		if(this.etapa == 'title'){
			if(!this.etapa_start){
				this.globalAlpha = 1;
				this.list_sprites.hand.alpha = 1;
				this.list_sprites.ohh.alpha = 1;
				this.list_sprites.zombies.alpha = 1;
				this.list_buttons.play.alpha = 1;
				this.list_buttons.config.alpha = 1;
				this.list_overlays.a.alpha = 0;
				this.levels.alpha = 0;
				this.etapa_start = true;
			}
		}
		if(this.etapa == 'levels'){
			if(!this.etapa_start){
				this.globalAlpha = 1;
				this.list_sprites.hand.alpha = 1;
				this.list_sprites.ohh.alpha = 0;
				this.list_sprites.zombies.alpha = 0;
				this.list_buttons.play.alpha = 0;
				this.list_buttons.config.alpha = 0;
				this.list_buttons.right.alpha = 1;
				this.list_buttons.left.alpha = 1;
				this.list_overlays.a.alpha = 0.75;
				this.levels.alpha = 1;
				this.etapa_start = true;
			}
		}
		//OnlyCenter
		this.list_sprites.back.x = this.canvas.width * 0.25;
		this.list_sprites.back.y = this.canvas.height * 0.25;


		if(main.orientation == 'portrait'){
			this.list_sprites.moon.x = this.canvas.width * 0.25;
			this.list_sprites.moon.y = this.canvas.height * 0.20;

			this.list_sprites.tree.x = this.canvas.width * 0.25;
			this.list_sprites.tree.y = this.canvas.height * 0.25;

			if(this.etapa != 'init'){
				this.list_sprites.hand.x = this.canvas.width * 0.25;
				this.list_sprites.hand.y = this.canvas.height * 0.29;
			}

			this.list_sprites.zombies.x = this.canvas.width * 0.25;
			this.list_sprites.zombies.y = this.canvas.height * 0.18;

			this.list_sprites.ohh.x = this.canvas.width * 0.15;
			this.list_sprites.ohh.y = this.canvas.height * 0.10;

			this.list_buttons.play.x = this.canvas.width * 0.15;
			this.list_buttons.play.y = this.canvas.height * 0.40;

			this.list_buttons.config.x = this.canvas.width * 0.35;
			this.list_buttons.config.y = this.canvas.height * 0.40;

			this.list_buttons.right.x = this.canvas.width * 0.395;
			this.list_buttons.right.y = this.canvas.height * 0.45;

			this.list_buttons.left.x = this.canvas.width * 0.095;
			this.list_buttons.left.y = this.canvas.height * 0.45;
		}
		if(main.orientation == 'landscape'){
			this.list_sprites.moon.x = this.canvas.width * 0.25;
			this.list_sprites.moon.y = this.canvas.height * 0.25;

			this.list_sprites.tree.x = this.canvas.width * 0.25;
			this.list_sprites.tree.y = this.canvas.height * 0.25;

			if(this.etapa != 'init'){
				this.list_sprites.hand.x = this.canvas.width * 0.25;
				this.list_sprites.hand.y = this.canvas.height * 0.29;
			}

			this.list_sprites.zombies.x = this.canvas.width * 0.25;
			this.list_sprites.zombies.y = this.canvas.height * 0.21;

			this.list_sprites.ohh.x = this.canvas.width * 0.15;
			this.list_sprites.ohh.y = this.canvas.height * 0.10;

			this.list_buttons.play.x = this.canvas.width * 0.15;
			this.list_buttons.play.y = this.canvas.height * 0.40;

			this.list_buttons.config.x = this.canvas.width * 0.35;
			this.list_buttons.config.y = this.canvas.height * 0.40;

			this.list_buttons.right.x = this.canvas.width * 0.462;
			this.list_buttons.right.y = this.canvas.height * 0.25;

			this.list_buttons.left.x = this.canvas.width * 0.038;
			this.list_buttons.left.y = this.canvas.height * 0.25;
		}

		//Inifinit Scroll
		this.list_sprites.cloud_a.y = this.canvas.height * 0.25;
		this.list_sprites.cloud_b.y = this.canvas.height * 0.35;

		this.list_sprites.cloud_a.x += 1;
		this.list_sprites.cloud_b.x += 0.5;

		if(this.list_sprites.cloud_a.x > this.canvas.width){
			this.list_sprites.cloud_a.x = -this.list_sprites.cloud_a.width * 0.5;
		}
		if(this.list_sprites.cloud_b.x > this.canvas.width){
			this.list_sprites.cloud_b.x = -this.list_sprites.cloud_b.width * 0.5;
		}
		this.Draw();
	};
	this.Draw = function(){
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

		this.ctx.save();
			this.ctx.scale(2,2);
			this.ctx.globalAlpha = this.globalAlpha;
			for(var i = 0; i < this.objects.length; i += 1){
				this.objects[i].Draw(this.ctx);
			}
			this.levels.Draw(this.ctx);
		this.ctx.restore();
	};
	this.changeEtapa = function(n){
		this.etapa = n;
		this.etapa_start = false;

		this.values_tmp = new Object();
	};
	this.Mouseclick = function(x,y){
		var x = x/2;
		var y = y/2;

		for(var i = 0; i < this.objects.length; i += 1){
			if(this.objects[i].action != undefined){
				this.objects[i].Click(x,y);	
			}
		}
	};
	var Sprite = function(spr,x,y,alpha,position,parent){
		this.spr = spr;
		this.x = x;
		this.y = y;
		this.width = this.spr.width / parent.graphic_scale;
		this.height = this.spr.height / parent.graphic_scale;
		this.alpha = alpha;
		this.position = position;

		if(this.position == "center"){
			this.xxx = -this.width * 0.5;
			this.yyy = -this.height * 0.5;
		}
		this.Click = function(){

		};
		this.Draw = function(ctx){
			ctx.save();
				ctx.globalAlpha = this.alpha;
				ctx.drawImage(this.spr,0,0,this.spr.width,this.spr.height,this.x + this.xxx,this.y + this.yyy,this.width,this.height);
			ctx.restore();
		};
	};
	var Button = function(spr,x,y,alpha,position,parent,action){
		this.spr = spr;
		this.x = x;
		this.y = y;
		this.width = this.spr.width / parent.graphic_scale;
		this.height = this.spr.height / parent.graphic_scale;
		this.alpha = alpha;
		this.position = position;
		this.action = action;
		this.parent = parent;

		if(this.position == "center"){
			this.xxx = -this.width * 0.5;
			this.yyy = -this.height * 0.5;
		}

		this.Click = function(x,y){
			if(this.alpha < 1){ return; }
			if((x > this.x + this.xxx)&&(x < this.x + this.xxx + this.width )&&(y > this.y + this.yyy)&&(y < this.y + this.yyy + this.height)){
				this.action(this);
			}	
		};
		this.Draw = function(ctx){
			ctx.save();
				ctx.globalAlpha = this.alpha;
				ctx.drawImage(this.spr,0,0,this.spr.width,this.spr.height,this.x + this.xxx,this.y + this.yyy,this.width,this.height);
			ctx.restore();
		};
	}
	var Overlay = function(alpha,parent){
		this.alpha = alpha;
		this.parent = parent;
		this.Draw = function(ctx){
			ctx.save();
				ctx.globalAlpha = this.alpha;
				ctx.fillStyle = "#000";
				ctx.fillRect(0,0,this.parent.canvas.width,this.parent.canvas.height);
			ctx.restore();
		}
	};
	var Levels = function(parent){
		this.x = 0;
		this.y = 0;
		this.page = 0;
		this.alpha = 0;

		this.levels = [];
		for(var i= 0; i < 100;i+=1){
			this.levels.push({ star : Math.round(Math.random()*3) });
		}
		this.max_pages = Math.ceil(this.levels.length / 12);
		this.Draw = function(ctx){
			if(main.orientation == 'portrait'){
				var max_p_linea = 3;
				var margin_left = 15;
				var margin_top = 15;
				var margin_in = 6;
				var max_line = 4;
			}
			if(main.orientation == 'landscape'){
				var max_p_linea = 4;
				var margin_left = 38;
				var margin_top = 15;
				var margin_in = 3;
				var max_line = 3;
			}

			ctx.save();
				ctx.globalAlpha = this.alpha;
				var cont = 0;
				var linea = 0;

				for(var i = this.page * 12; i < this.levels.length; i += 1){
					
					ctx.drawImage(parent.gameview.resources.gui.title_button_level,0,0,38 * parent.graphic_scale,39 * parent.graphic_scale,margin_left + cont * (39 + margin_in), margin_top + linea * (39 + margin_in),38,39);
					//Number
					if(i < 10){
						ctx.drawImage(parent.gameview.resources.gui.title_numbers,10 * i,0,10 * parent.graphic_scale,15 * parent.graphic_scale,margin_left + cont * (39 + margin_in) + 14, margin_top + linea * (39 + margin_in) + 12,10,15)
					}else{
						var unidad = ((i/10) - parseInt(i/10)) * 10;
						var decena = parseInt(i/10);
						ctx.drawImage(parent.gameview.resources.gui.title_numbers,10 * decena,0,10 * parent.graphic_scale,15 * parent.graphic_scale,margin_left + cont * (39 + margin_in) + 9, margin_top + linea * (39 + margin_in) + 12,10,15)
						ctx.drawImage(parent.gameview.resources.gui.title_numbers,10 * unidad,0,10 * parent.graphic_scale,15 * parent.graphic_scale,margin_left + cont * (39 + margin_in) + 19, margin_top + linea * (39 + margin_in) + 12,10,15)
					}
					//Stars
					if(this.levels[i].star > 0){
						ctx.drawImage(parent.gameview.resources.gui.title_star,0,0,17 * parent.graphic_scale,17 * parent.graphic_scale,margin_left + cont * (39 + margin_in) - 3,margin_top + linea * (39 + margin_in) + 25,17,17);
					}
					if(this.levels[i].star > 2){
						ctx.drawImage(parent.gameview.resources.gui.title_star_b,0,0,17 * parent.graphic_scale,17 * parent.graphic_scale,margin_left + cont * (39 + margin_in) + 23,margin_top + linea * (39 + margin_in) + 25,17,17);
					}
					if(this.levels[i].star > 1){
						ctx.drawImage(parent.gameview.resources.gui.title_star,0,0,17 * parent.graphic_scale,17 * parent.graphic_scale,margin_left + cont * (39 + margin_in) + 10,margin_top + linea * (39 + margin_in) + 27,17,17);
					}

					cont += 1;
					if(cont > max_p_linea - 1){ cont = 0; linea += 1;}
					if(linea > max_line - 1){ break; }
				}
			ctx.restore();
		};
	};
}