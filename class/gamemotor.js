function GameMotor(gameview,level)
{
	this.gameview = gameview;
	this.level = level;
	
	this.canvas = this.gameview.canvas;
	this.ctx = this.gameview.ctx;
	
	this.map_scroll_x = 0;
	this.map_scroll_y = 0;
	
	this.scale_map = 2;
	
	this.scroll_start_x = -1;
	this.scroll_start_y = -1;
	this.scroll_point_x = -1;
	this.scroll_point_y = -1;
	
	this.scroll_last_distance = -1;
	
	this.objects = new Array();
	
	this.etapa = 'move';
	
	this.map_info;
	
	this.last_turn = -1;
	
	this.arrow_player_yyy = 0;
	
	this.Start = function(){
		this.map_info = global_datos_mapas[this.level];
		
		if(this.canvas.width > this.map_info.ancho * 24 * this.scale_map)
		{
			this.map_scroll_x = (this.canvas.width * 0.5 - this.map_info.ancho * 24 * 0.5 * this.scale_map) / this.scale_map;
		}
		if(this.canvas.height > this.map_info.alto * 24 * this.scale_map)
		{
			this.map_scroll_y = (this.canvas.height * 0.5 - this.map_info.alto * 24 * 0.5 * this.scale_map) / this.scale_map;
		}
		this.objects.push(new Player(false,'player',156,60));
		this.objects.push(new Player(true,'civil',156,84));
		this.objects.push(new Player(true,'civil',156 + 24,84));
		this.objects.push(new Player(true,'zombie',36,36));
		this.objects.push(new Player(true,'zombie',60,36));
		this.NextTurn();
	};
	this.Update = function(){
		if(this.etapa == 'move_start')
		{
			if(this.objects[this.last_turn].cpu)
			{
				this.objects[this.last_turn].estado = 2;
			}
			else
			{
				this.objects[this.last_turn].getPosibilitys();
				this.objects[this.last_turn].estado = 1;
			}
			this.etapa = 'on_move';
		}
		if(this.etapa == 'on_move')
		{
			this.arrow_player_yyy += 0.1;
		}
		if(this.etapa == 'scroll')
		{
			this.arrow_player_yyy += 0.1;
			
			var distance = parseInt(Math.sqrt(((this.map_scroll_x - this.scroll_point_x)*(this.map_scroll_x - this.scroll_point_x)) + ((this.map_scroll_y - this.scroll_point_y)*(this.map_scroll_y - this.scroll_point_y))));
			if(this.scroll_last_distance == distance)
			{
				distance = 0;
			}
			else
			{
				this.scroll_last_distance = distance;
			}
			
			if((this.canvas.width > this.map_info.ancho * 24 * this.scale_map)&&(this.canvas.height > this.map_info.alto * 24 * this.scale_map))
			{
				this.etapa = 'move_start';
			}
			else
			{
				if(distance == 0)
				{
					this.map_scroll_x = this.scroll_point_x;
					if(this.canvas.height < this.map_info.alto * 24 * this.scale_map)
					{
						this.map_scroll_y = this.scroll_point_y;
					}
					
					this.etapa = 'move_start';
				}
				else
				{
					this.map_scroll_x += (this.scroll_point_x - this.map_scroll_x) *0.2;
					if(this.canvas.height < this.map_info.alto * 24 * this.scale_map)
					{
						this.map_scroll_y += (this.scroll_point_y - this.map_scroll_y) *0.2;
					}
				}
			}
		}
		for(var i = 0; i < this.objects.length; i+=1)
		{
			if(this.objects[i].remove){ continue; }
			this.objects[i].Update();
		}
		this.Draw();
	};
	this.Draw = function(){
		this.ctx.fillStyle = "#312834";
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

		this.ctx.save();
		//Scalar
			this.ctx.scale(this.scale_map,this.scale_map);
			this.ctx.translate(this.map_scroll_x,this.map_scroll_y);
			//Mapa
			var cont_x_linea = 0;
			var linea = 0;
			for(var i = 0; i < this.map_info.base.length; i += 1)
			{
				if(this.map_info.base[i] != 0)
				{
					var x_tile = ((this.map_info.base[i] - (Math.floor((this.map_info.base[i] - 1) / 10) * 10) - 1) * 24);
					var y_tile = (Math.floor((this.map_info.base[i] - 1) / 10)) * 24;
					this.ctx.drawImage(this.gameview.resources.tiles[this.map_info.tiles],x_tile,y_tile,128,128,cont_x_linea * 24,linea * 24,24,24);
				}
				cont_x_linea += 1;
				if(cont_x_linea > this.map_info.ancho - 1)
				{
					cont_x_linea = 0;
					linea += 1;
				}
			}
			for(var i = 0; i < this.objects.length; i+=1)
			{
				if(this.objects[i].remove){ continue; }
				if(this.objects[i].type == 'player')
				{
					this.objects[i].Draw_actions(this.ctx);
				}
			}
			
			var list_tmp = new Array();
			for(var j = 0; j < this.objects.length; j += 1)
			{
				if(this.objects[j].remove){ continue; }
				list_tmp.push(-1);
			}
			for(var j = 0; j < this.objects.length; j += 1)
			{
				if(this.objects[j].remove){ continue; }
				for(var h = 0; h < list_tmp.length; h += 1)
				{
					if(list_tmp[h] == -1)
					{
						list_tmp[h] = j;
						break;
					}
					if(this.objects[list_tmp[h]].y > this.objects[j].y)
					{
						for(var k = list_tmp.length - 1; k > h; k -= 1)
						{
							list_tmp[k] = list_tmp[k - 1]; 
						}
						list_tmp[h] = j;
						break;
					}
				}
			}
			for(var j = 0; j < list_tmp.length; j += 1)
			{
				if(list_tmp[j] == -1){ continue; }
				this.objects[list_tmp[j]].Draw(this.ctx);
			}
			
			for(var i = 0; i < this.objects.length; i+=1)
			{
				if(this.objects[i].remove){ continue; }
				if(this.objects[i].type == 'player')
				{
					this.objects[i].Draw_gui(this.ctx);
				}
			}
			//GUI Bottom
			if((this.etapa == 'on_move')||(this.etapa == 'scroll')||(this.etapa == 'move_start'))
			{
				if(this.last_turn > -1)
				{
					this.ctx.drawImage(this.gameview.resources.gui.arrow_player,this.objects[this.last_turn].arrow_color * 48 ,0,48,76,this.objects[this.last_turn].x - 6,this.objects[this.last_turn].y - 50 + Math.floor(Math.sin(this.arrow_player_yyy * Math.PI) * 5),12,19);
				}
			}
		this.ctx.restore();
	};
	this.Mouseclick = function(x,y){
		var tmp_x = x / this.scale_map - this.map_scroll_x;
		var tmp_y = y / this.scale_map - this.map_scroll_y;
		
		var x_square = Math.floor(tmp_x / 24) * 24;
		var y_square = Math.floor(tmp_y / 24) * 24;
		
		if(this.objects[this.last_turn].estado == 1)
		{
			for(var i = 0; i < this.objects[this.last_turn].posibilitys.length; i+=1)
			{
				if((this.objects[this.last_turn].posibilitys[i][0] == x_square)&&(this.objects[this.last_turn].posibilitys[i][1] == y_square))
				{
					this.etapa = 'in_move';
					
					var player_x = Math.floor(this.objects[this.last_turn].x/24) * 24;
					var player_y = Math.floor(this.objects[this.last_turn].y/24) * 24;
					
					this.objects[this.last_turn].attack_to = [-1,-1];
					this.objects[this.last_turn].path = this.pathFind([player_x,player_y],[x_square,y_square],{ player : true , bando : this.objects[this.last_turn].bando });
					if(this.objects[this.last_turn].posibilitys[i][2])
					{
						this.objects[this.last_turn].path = this.pathFind([player_x,player_y],[x_square,y_square],{});
						this.objects[this.last_turn].attack_to = this.objects[this.last_turn].path[this.objects[this.last_turn].path.length - 1];
						if(this.objects[this.last_turn].path.length <= this.objects[this.last_turn].range_attack + 1)
						{
							this.objects[this.last_turn].path = new Array();
							this.objects[this.last_turn].last_path_step = 0;
							this.objects[this.last_turn].estado = 5;
						}
						else
						{
							var tmp = new Array();
							for(var j = 0; j < this.objects[this.last_turn].path.length - 1; j += 1)
							{
								tmp.push(this.objects[this.last_turn].path[j]);
							}
							this.objects[this.last_turn].path = tmp;
						}
					}
					this.objects[this.last_turn].last_path_step = 0;
					this.objects[this.last_turn].estado = 3;
					break;
				}
			}
		}
	};
	this.Mousemove = function(x,y){
		if(this.etapa == 'scroll'){ return; }
		if(this.scroll_point_x < 0)
		{
			this.scroll_start_x = this.map_scroll_x;
			this.scroll_start_y = this.map_scroll_y;
			this.scroll_point_x = x;
			this.scroll_point_y = y;
		}
		
		if(this.canvas.width < this.map_info.ancho * 24 * this.scale_map)
		{
			var delta_x = this.scroll_start_x - (this.scroll_point_x - x) / this.scale_map;
			
			if(delta_x > 0){ delta_x = 0; }
			if(delta_x < -((this.map_info.ancho * 24) - this.canvas.width / this.scale_map)){ delta_x = -((this.map_info.ancho * 24) - this.canvas.width / this.scale_map); }
			
			this.map_scroll_x = delta_x;
		}
		if(this.canvas.height < this.map_info.alto * 24 * this.scale_map)
		{
			var delta_y = this.scroll_start_y - (this.scroll_point_y - y) / this.scale_map;
			
			if(delta_y > 0){ delta_y = 0; }
			if(delta_y < -((this.map_info.alto * 24) - this.canvas.height / this.scale_map)){ delta_y = -((this.map_info.alto * 24) - this.canvas.height / this.scale_map); }
			
			this.map_scroll_y = delta_y;
		}
		
		
		
	};
	this.Mousecancel = function(){
		this.scroll_point_x = -1;
	};
	this.ScrollTo = function(id_object){
		var delta_x = -this.objects[id_object].x + this.canvas.width * 0.25;
		var delta_y = -this.objects[id_object].y + this.canvas.height * 0.25;
		
		if(delta_x > 0){ delta_x = 0; }
		if(delta_x < -((this.map_info.ancho * 24) - this.canvas.width / this.scale_map)){ delta_x = -((this.map_info.ancho * 24) - this.canvas.width / this.scale_map); }
		
		if(delta_y > 0){ delta_y = 0; }
		if(delta_y < -((this.map_info.alto * 24) - this.canvas.height / this.scale_map)){ delta_y = -((this.map_info.alto * 24) - this.canvas.height / this.scale_map); }
			
		this.scroll_point_x = delta_x;
		this.scroll_point_y = delta_y;
		
		this.etapa = 'scroll';
	};
	this.NextTurn = function(){
		var firts_turn = -1;
		var next_turn = -1;
		for(var i = 0; i < this.objects.length; i += 1)
		{
			if(this.objects[i].remove){ continue; }
			if(this.objects[i].type == 'player')
			{
				if(this.objects[i].max_steps > 0)
				{
					if(firts_turn == -1){ firts_turn = i; }
					if(i > this.last_turn){  next_turn = i; break; }	
				}
			}
		}
		
		if(next_turn == -1){ next_turn = firts_turn; }
		
		this.last_turn = next_turn;
		this.arrow_player_yyy = 0;
		
		this.ScrollTo(this.last_turn);
	};
	this.pathFind = function(start,end,options){
		
		var world_bi = [[]];
		
		for (var y=0; y < this.map_info.alto; y++)
		{
			world_bi[y] = [];
			for (var x=0; x < this.map_info.ancho; x++)
			{
				if(this.getColision(x*24,y*24,options))
				{
					world_bi[y][x] = 1;
				}
				else
				{
					world_bi[y][x] = 0;
				}
			}
		}
		var x_init = Math.floor(start[0]/24);
		var y_init = Math.floor(start[1]/24);
		
		var x_end = Math.floor(end[0]/24);
		var y_end = Math.floor(end[1]/24);
		
		if(x_init < 0){ x_init = 0; }
		if(x_init > this.map_info.ancho - 1){ x_init = this.map_info.ancho - 1; }
		if(y_init < 0){ y_init = 0; }
		if(y_init > this.map_info.alto - 1){ y_init = this.map_info.alto - 1; }
		
		if(x_end < 0){ x_end = 0; }
		if(x_end > this.map_info.ancho - 1){ x_end = this.map_info.ancho - 1; }
		if(y_end < 0){ y_end = 0; }
		if(y_end > this.map_info.alto - 1){ y_end = this.map_info.alto - 1; }


		var grid = new PF.Grid(this.map_info.ancho, this.map_info.alto, world_bi);
		var finder = new PF.AStarFinder();
		var path = finder.findPath(x_init, y_init, x_end, y_end, grid);
		return path;
	};
	this.getColision = function(x,y,options){
		var point_map = (Math.floor(x/24) + Math.floor(y/24) * this.map_info.ancho);
		var xxx = Math.floor(x/24);
		var yyy = Math.floor(y/24);
		
		if(options.free_cell != undefined)
		{
			if((xxx == options.free_cell[0])&&(yyy == options.free_cell[1]))
			{
				return false;
			}
		}
		
		if(xxx < 0){ return true; }
		if(yyy < 0){ return true; }
		
		if(xxx > this.map_info.ancho - 1){ return true; }
		if(yyy > this.map_info.alto - 1){ return true; }
		
		if(this.map_info.mask[point_map] == 1){ return true; }
		
		
		if(options != undefined)
		{
			if(options.player != undefined)
			{
				for(var i = 0; i < this.objects.length; i += 1)
				{
					if(this.objects[i].remove){ continue; }
					if(this.objects[i].type == 'player')
					{
						var x = Math.floor(this.objects[i].x/24) * 24;
						var y = Math.floor(this.objects[i].y/24) * 24;
						
						if((xxx * 24 == x)&&(yyy * 24 == y))
						{
							if(options.get_enemy != undefined)
							{
								if(this.objects[i].bando != options.bando)
								{
									return true;
								}
							}
							else
							{
								return true;
							}
						}
					}
				}
			}
		}
		
		return false;
	};
	this.AttackTo = function(to,attack){
		for(var i = 0; i < this.objects.length; i += 1)
		{
			if(this.objects[i].remove){ continue; }
			if(this.objects[i].type == 'player')
			{
				var xxx = Math.floor(this.objects[i].x / 24) * 24;
				var yyy = Math.floor(this.objects[i].y / 24) * 24;
				if((xxx == to[0] * 24)&&(yyy == to[1] * 24))
				{
					if(this.objects[i].type_p == 'civil'){
						this.objects[i].changeType(this.objects[this.last_turn].type_p);
						return;
					}
					this.objects.push(new Particles(this.objects[i].x,this.objects[i].y + 1,'simple',{ 
						offset: [0,-10],
						create_random: [[0,0],[0,0]],
						velocity_random: [[-1,1],[-2,-0.5]],
						gravity: [270,0.2],
						alpha: [1,0.75],
						floor_in: 14,
						size: [0.1,4],
						max_life: [50,60],
						max_particles: 30,
						spawn_time: 0,
						particle_type: 'rect',
						unique_anim: true,
						color: '#ff0000'
					}));
					this.objects[i].deltaLife(-attack);
					break;					
				}
			}
		}
	};
}