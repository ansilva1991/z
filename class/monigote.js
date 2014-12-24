function Monigote(n,x,y)
{
	this.id_ch = n;
	
	this.x = x;
	this.y = y;
	
	this.frame = 0;
	this.pos = 0;
	this.step = 0;
	
	this.dir = 3;
	
	this.anim = 'idle';
	
	this.bitmap = main.gameview.resources.sprites['ch_' + n];

	this.end_anim = false;
	
	this.graphic_scale = 1;

	this.offset_x = 0;

	this.Update = function(){
		if(this.anim == 'idle')
		{
			this.bitmap = main.gameview.resources.sprites['ch_' + n + '_b'];
			
			this.step += 1;
			if(this.step > 5)
			{
				this.step = 0;
				if(this.frame == 0){ this.pos = 1; this.frame = 1; return;}
				if(this.frame == 1){ this.pos = 0; this.frame = 0; return;}
			}
		}
		if(this.anim == 'walk')
		{
			this.bitmap = main.gameview.resources.sprites['ch_' + n];
			
			this.step += 1;
			if(this.step > 5)
			{
				this.step = 0;
				if(this.frame == 0){ this.pos = 1; this.frame = 1; return;}
				if(this.frame == 1){ this.pos = 0; this.frame = 2; return;}
				if(this.frame == 2){ this.pos = 2; this.frame = 3; return;}
				if(this.frame == 3){ this.pos = 0; this.frame = 0; return;}
			}
		}
		if(this.anim == 'attack')
		{
			this.bitmap = main.gameview.resources.sprites['ch_' + n + '_c'];
			
			this.step += 1;
			if(this.step > 1)
			{
				this.step = 0;
				if(this.frame == 0){ this.pos = 0; this.frame = 1; return;}
				if(this.frame == 1){ this.pos = 1; this.frame = 2; return;}
				if(this.frame == 2){ this.pos = 1; this.frame = 3; return;}
				if(this.frame == 3){ this.pos = 1; this.frame = 4; return;}
				if(this.frame == 4){ this.pos = 2; this.frame = 5; return;}
				if(this.frame == 5){ this.pos = 2; this.frame = 6; this.end_anim = true; return;}
			}
		}
		if(this.anim == 'scary')
		{
			this.bitmap = main.gameview.resources.sprites['ch_' + n + '_d'];
			
			this.step += 1;
			this.offset_x = Math.sin(this.step) * 0.75;
			if(this.step > 10)
			{
				this.step = 0;
				this.pos = Math.round(Math.random() * 3);
			}
		}
	};
	this.changeAnim = function(n)
	{
		if(this.anim != n)
		{
			this.offset_x = 0;
			this.frame = 0;
			this.pos = 0;
			this.step = 0;
			this.end_anim = false;
			this.anim = n;
		}
	}
	this.Draw = function(ctx){
		ctx.drawImage(this.bitmap,this.pos * 32 * this.graphic_scale ,this.dir * 32 * this.graphic_scale,32 * this.graphic_scale,32 * this.graphic_scale,this.x - 16 + this.offset_x,this.y - 28,32,32);
	};
}