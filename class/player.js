function Player(cpu,type,x,y)
{
	this.cpu = cpu;
	this.type = type;
	this.gamemotor = main.gameview.gamemotor;
	
	//Atributos
	this.max_steps = global_datos_players[this.type].max_steps;
	this.vel = global_datos_players[this.type].vel;
	this.bando = global_datos_players[this.type].bando;
	this.range_attack = global_datos_players[this.type].range_attack;
	this.attack = global_datos_players[this.type].attack;
	this.max_life = global_datos_players[this.type].max_life;
	this.life = this.max_life;
	this.arrow_color = global_datos_players[this.type].arrow_color;
	this.type_p = type;

	this.x = x;
	this.y = y;
	
	this.monigote = new Monigote(1,this.x,this.y);
	
	this.type = 'player';
	this.remove = false;
	this.imei = -1;
	
	this.estado = 0;
	/*ESTADOS
	0 - Nada
	1 - Acciones por player
	2 - Acciones por CPU
	3 - Seguimiento de Path
	4 - Movimiento
	4 - Atacar
	*/
	
	this.dir = 3;
	
	this.posibilitys = new Array();
	
	this.path = new Array();
	this.last_path_step = 0;
	this.attack_to = [-1,-1];
	
	this.attack_paso = 0;
	this.attack_step = 0;
	
	this.x_move_init = -1;
	this.y_move_init = -1;
	
	
	this.padding_boxs = 5;
	this.alpha_boxs = 0.25;
	this.padding_boxs_paso = 0;
	
	this.Update = function(){
		if(this.estado == 0)
		{
			if(this.type_p != 'civil')
			{
				this.monigote.changeAnim('idle');
			}
			else
			{
				this.dir = 0;
				this.monigote.changeAnim('scary');
			}
		}
		if(this.estado == 1)
		{
			//Actions
			if(this.padding_boxs_paso == 0)
			{
				this.padding_boxs -= 0.5;
				this.alpha_boxs += 0.05;
				if(this.padding_boxs < 1){ this.alpha_boxs = 0.7; this.padding_boxs = 1; this.padding_boxs_paso = 1; }
			}
			if(this.padding_boxs_paso == 1)
			{
				this.padding_boxs += 0.5;
				this.alpha_boxs -= 0.05;
				if(this.padding_boxs > 5){ this.alpha_boxs = 0.25; this.padding_boxs = 5; this.padding_boxs_paso = 0; }
			}
		}
		if(this.estado == 2)
		{
			var is_attack = false;
			for(var i = 0; i < this.gamemotor.objects.length; i += 1)
			{
				if(this.gamemotor.objects[i].type == 'player')
				{
					if(this.gamemotor.objects[i].bando != this.bando)
					{
						var xxx = Math.floor(this.gamemotor.objects[i].x/24);
						var yyy = Math.floor(this.gamemotor.objects[i].y/24);
						
						var path_target_tmp = this.gamemotor.pathFind([this.x,this.y],[this.gamemotor.objects[i].x,this.gamemotor.objects[i].y],{ player : true , free_cell : [xxx,yyy] });
						if(path_target_tmp.length <= this.max_steps + 1)
						{
							this.path = path_target_tmp;
							this.attack_to = this.path[this.path.length - 1];
							if(this.path.length <= this.range_attack + 1)
							{
								this.path = new Array();
								this.last_path_step = 0;
								this.estado = 5;
							}
							else
							{
								var tmp = new Array();
								for(var j = 0; j < this.path.length - 1; j += 1)
								{
									tmp.push(this.path[j]);
								}
								this.path = tmp;
							}
							this.last_path_step = 0;
							this.estado = 3;
							is_attack = true;
							break;
						}
					}
				}
			}
			if(!is_attack)
			{
				for(var i = 0; i < this.gamemotor.objects.length; i += 1)
				{
					if(this.gamemotor.objects[i].type == 'player')
					{
						if(this.gamemotor.objects[i].bando != this.bando)
						{
							var xxx = Math.floor(this.gamemotor.objects[i].x/24);
							var yyy = Math.floor(this.gamemotor.objects[i].y/24);
							
							var path_target_tmp = this.gamemotor.pathFind([this.x,this.y],[this.gamemotor.objects[i].x,this.gamemotor.objects[i].y],{ player : true , free_cell : [xxx,yyy] });
							var new_path =  new Array();
							for(j = 0; j < this.max_steps + 1; j += 1)
							{
								new_path.push(path_target_tmp[j]);
							}
							this.attack_to = [-1,-1];
							this.path = new_path;
							this.last_path_step = 0;
							this.estado = 3;
							break;
						}
					}
				}
			}
		}
		if(this.estado == 3)
		{
			this.monigote.changeAnim('idle');
			this.last_path_step += 1;
			if(this.path[this.last_path_step] != undefined)
			{
				if(this.path[this.last_path_step][0] * 24 + 12 > this.x)
				{
					this.dir = 0;
				}
				if(this.path[this.last_path_step][1] * 24 + 12 < this.y)
				{
					this.dir = 1;
				}
				if(this.path[this.last_path_step][0] * 24 + 12 < this.x)
				{
					this.dir = 2;
				}
				if(this.path[this.last_path_step][1] * 24 + 12 > this.y)
				{
					this.dir = 3;
				}
				this.x_move_init = this.x;
				this.y_move_init = this.y;
				
				this.estado = 4;
			}
			else
			{
				if(this.attack_to[0] > 0)
				{
					this.attack_paso = 0;
					this.attack_step = 0;
					if(this.attack_to[0] * 24 + 12 > this.x)
					{
						this.dir = 0;
					}
					if(this.attack_to[1] * 24 + 12 < this.y)
					{
						this.dir = 1;
					}
					if(this.attack_to[0] * 24 + 12 < this.x)
					{
						this.dir = 2;
					}
					if(this.attack_to[1] * 24 + 12 > this.y)
					{
						this.dir = 3;
					}
					this.estado = 5;
				}
				else
				{
					this.estado = 0;
					this.gamemotor.NextTurn();
				}
			}
		}
		if(this.estado == 4)
		{
			this.monigote.changeAnim('walk');
			var end = false;
			if(this.dir == 0)
			{
				this.x += this.vel;
				if(this.x > this.x_move_init + 24)
				{
					this.x = this.x_move_init + 24;
					end = true;
				}
			}
			if(this.dir == 1)
			{
				this.y -= this.vel;
				if(this.y < this.y_move_init - 24)
				{
					this.y = this.y_move_init - 24;
					end = true;
				}
			}
			if(this.dir == 2)
			{
				this.x -= this.vel;
				if(this.x < this.x_move_init - 24)
				{
					this.x = this.x_move_init - 24;
					end = true;
				}
			}
			if(this.dir == 3)
			{
				this.y += this.vel;
				if(this.y > this.y_move_init + 24)
				{
					this.y = this.y_move_init + 24;
					end = true;
				}
			}
			if(end)
			{
				this.estado = 3;
			}
		}
		if(this.estado == 5)
		{
			if(this.attack_paso == 0)
			{
				this.monigote.changeAnim('attack');
				if(this.monigote.end_anim)
				{
					this.gamemotor.AttackTo(this.attack_to,this.attack);
					this.attack_paso = 1;
				}
			}
			if(this.attack_paso == 1)
			{
				this.monigote.changeAnim('idle');
				this.attack_step += 1;
				if(this.attack_step > 20)
				{
					this.estado = 0;
					this.gamemotor.NextTurn();
				}
			}
		}
		this.monigote.dir = this.dir;
		this.monigote.x = this.x;
		this.monigote.y = this.y;
		this.monigote.Update();
	};
	this.Draw_actions = function(ctx){
		if(this.estado != 1){ return; }
		for(var i = 0; i < this.posibilitys.length; i+=1)
		{
			ctx.save();
				ctx.globalAlpha = this.alpha_boxs;
				if(this.posibilitys[i][2])
				{
					ctx.fillStyle = "#ff0000";
				}
				else
				{
					ctx.fillStyle = "#00ff00";
				}
				ctx.fillRect(this.posibilitys[i][0] + this.padding_boxs * 0.5,this.posibilitys[i][1] + this.padding_boxs * 0.5,24 - this.padding_boxs,24 - this.padding_boxs);
			ctx.restore();
		}
	};
	this.Draw = function(ctx){
		this.monigote.Draw(ctx);
	};
	this.Draw_gui = function(ctx){
		var max_life_bar = 16;
		var life_tmp = (this.life / this.max_life) * max_life_bar;
		
		ctx.fillStyle = '#757575';
		ctx.fillRect(this.x - max_life_bar * 0.5, this.y - 32, max_life_bar, 3);
		
		if(life_tmp > 0)
		{
			ctx.fillStyle = '#bc6b6b';
		}
		if(life_tmp > max_life_bar * 0.25)
		{
			ctx.fillStyle = '#e3961c';
		}
		if(life_tmp > max_life_bar * 0.5)
		{
			ctx.fillStyle = '#8ada7d';
		}
		ctx.fillRect(this.x - max_life_bar * 0.5, this.y - 32, life_tmp, 3);
		
		ctx.beginPath();
		ctx.rect(this.x - max_life_bar * 0.5, this.y - 32, max_life_bar, 3);
		ctx.lineWidth = 0.75;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	};
	this.getPosibilitys = function(){
		this.posibilitys = new Array();
		
		var player_x = Math.floor(this.x/24) * 24;
		var player_y = Math.floor(this.y/24) * 24;
		
		var init_x = Math.floor(this.x/24) * 24 - this.max_steps * 24;
		var init_y = Math.floor(this.y/24) * 24 - this.max_steps * 24;
		
		if(init_x < 0){ init_x = 0;}
		if(init_y < 0){ init_y = 0;}
		
		for(var i = init_y; i < init_y + this.max_steps * 24 * 2 + 24; i += 24)
		{
			for(var j = init_x; j < init_x + this.max_steps * 24 * 2 + 24; j += 24)
			{
				if(i > this.gamemotor.map_info.alto * 24 - 24){ continue; }
				if(j > this.gamemotor.map_info.ancho * 24 - 24){ continue; }
				if((player_x == j)&&(player_y == i)){ continue; }
				var path = this.gamemotor.pathFind([player_x,player_y],[j,i],{ player : true , bando : this.bando });
				var path_non_enemy = this.gamemotor.pathFind([player_x,player_y],[j,i],{});
				var is_enemy = this.gamemotor.getColision(j,i,{ player : true , bando : this.bando , get_enemy : true });
				if(is_enemy)
				{
					if(path_non_enemy.length > 0)
					{
						if(path_non_enemy.length <= this.max_steps + 1)
						{
							this.posibilitys.push([j,i,is_enemy]);
						}
					}
				}
				if(path.length > 0)
				{
					if(path.length <= this.max_steps + 1)
					{
						this.posibilitys.push([j,i,is_enemy]);
					}
				}
			}
		}
	};
	this.deltaLife = function(d){
		this.life += d;
	};
	this.changeType = function(type){
		//Atributos
		this.max_steps = global_datos_players[type].max_steps;
		this.vel = global_datos_players[type].vel;
		this.bando = global_datos_players[type].bando;
		this.range_attack = global_datos_players[type].range_attack;
		this.attack = global_datos_players[type].attack;
		this.max_life = global_datos_players[type].max_life;
		this.life = this.max_life;
		this.arrow_color = global_datos_players[type].arrow_color;
		this.type_p = type;

		this.dir = 3;
	};
}