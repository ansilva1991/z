function Particles(x,y,type,options)
{
	/*Options
		- create_random: [[-5,5],[-5,5]],
		- velocity_random: [[-1,1],[-1,1]],
		- gravity: [270,1],
		- alpha: [0,1],
		- size: [2,6],
		- max_life: [3,6],
		- max_particles: 10,
		- spawn_time: 0,
		- particle_type: 'circle',
		- unique_anim: true,
		- color: '#ff0000' 
	*/
	this.x = x;
	this.y = y;
	this.remove = false;

	this.step = 0;
	this.type = 'particle';
	this.type_p = type;
	this.options = options;
	this.floor_in = 0;

	this.estado = 0;
	this.particles = new Array();
	this.particles_total_count = 0;
	this.particles_count = 0;

	this.Update = function(){
		if(this.type_p == 'simple'){
			if(this.estado == 0){
				if(this.options.spawn_time > 0){
					this.step += 1;
					if(this.step > this.options.spawn_time){
						this.step = 0;
						if(this.particles_count < this.options.max_particles){
							this.addParticle();
						}
					}
				}
				else
				{
					for(var i = 0; i < this.options.max_particles; i += 1)
					{
						this.addParticle();
					}
				}
				if(this.particles_total_count >= this.options.max_particles)
				{
					if(this.options.unique_anim){ this.estado = 1; }
				}
				for(var i = 0; i < this.particles.length; i += 1)
				{
					if(this.particles[i].remove){ continue; }
					this.particles[i].Update();
				}
			}
			if(this.estado == 1){
				if(this.options.floor_in > 0){
					this.floor_in += 1;
					if(this.floor_in > this.options.floor_in){
						this.options.offset[0] = this.x + this.options.offset[0];
						this.options.offset[1] = this.y + this.options.offset[1];
						this.x = 0;
						this.y = 0;
						this.estado = 2;
					}	
				}
				if(this.particles_count < 1){
					this.remove = true;
				}
				for(var i = 0; i < this.particles.length; i += 1)
				{
					if(this.particles[i].remove){ continue; }
					this.particles[i].Update();
				}	
			}
			if(this.estado == 2){
				if(this.particles_count < 1){
					this.remove = true;
				}
			}
		}
	};
	this.Draw = function(ctx){
		if(this.type_p == 'simple'){
			ctx.save();
				ctx.translate(this.x + this.options.offset[0],this.y + this.options.offset[1]);
					for(var i = 0; i < this.particles.length; i += 1)
					{
						if(this.particles[i].remove){ continue; }
						this.particles[i].Draw(ctx);
					}
			ctx.restore();
		}
	};

	//SubClase
	var Particle = function(x,y,type,options,parent){
		this.x = x;
		this.y = y;

		this.type = type;
		this.remove = false;

		this.options = options;
		this.life = 0;
		this.gravity = 0;

		this.gravity_x = Math.cos(this.options.gravity[0] * Math.PI /180) * this.gravity;
		this.gravity_y = -Math.sin(this.options.gravity[0] * Math.PI /180) * this.gravity;

		if(this.options.alpha[0] > this.options.alpha[1]){ this.alpha_type = 'decrement'; }
		if(this.options.alpha[1] > this.options.alpha[0]){ this.alpha_type = 'increment'; }

		this.alpha = this.options.alpha[0];

		this.Update = function(ctx){
			this.gravity += this.options.gravity[1]; 
			this.gravity_x = Math.cos(this.options.gravity[0] * Math.PI /180) * this.gravity;
			this.gravity_y = -Math.sin(this.options.gravity[0] * Math.PI /180) * this.gravity;

			this.x += this.options.velocity[0] + this.gravity_x;
			this.y += this.options.velocity[1] + this.gravity_y;

			if(this.alpha_type == 'decrement'){
				this.alpha -= 1/this.options.max_life;
				if(this.alpha < this.options.alpha[1]){ this.alpha = this.options.alpha[1]; }
			}
			if(this.alpha_type == 'increment'){
				this.alpha += 1/this.options.max_life;
				if(this.alpha > this.options.alpha[1]){ this.alpha = this.options.alpha[1]; }
			}
		};
		this.Draw = function(ctx){
			this.life += 1;
			if(this.life > this.options.max_life){ 
				this.remove = true; 
				parent.particles_count -= 1;
				return; 
			}
			
			ctx.globalAlpha = this.alpha;
			ctx.fillStyle = this.options.color;
			if(this.type == 'rect'){
				ctx.fillRect(this.x - this.options.size * 0.5,this.y - this.options.size * 0.5,this.options.size,this.options.size);
			}
			if(this.type == 'circle'){
				ctx.beginPath();
			    	ctx.arc(this.x - this.options.size * 0.5, this.y - this.options.size * 0.5, this.options.size, 0, 2 * Math.PI, false);
			    	ctx.fill();
			}
		};
	};
	this.addParticle = function(){
		var xxx = this.options.create_random[0][0] + (this.options.create_random[0][1] - this.options.create_random[0][0]) * Math.random();
		var yyy = this.options.create_random[1][0] + (this.options.create_random[1][1] - this.options.create_random[1][0]) * Math.random();

		var velocity_xxx = this.options.velocity_random[0][0] + (this.options.velocity_random[0][1] - this.options.velocity_random[0][0]) * Math.random();
		var velocity_yyy = this.options.velocity_random[1][0] + (this.options.velocity_random[1][1] - this.options.velocity_random[1][0]) * Math.random();
		var max_life = this.options.max_life[0] + (this.options.max_life[1] - this.options.max_life[0]) * Math.random();
		var size = this.options.size[0] + (this.options.size[1] - this.options.size[0]) * Math.random();
		this.particles.push(new Particle(xxx,yyy,this.options.particle_type,{ 
				color: this.options.color, 
				velocity: [velocity_xxx,velocity_yyy], 
				alpha: this.options.alpha,
				max_life: max_life,
				size: size,
				gravity: this.options.gravity
		},this));
		this.particles_total_count += 1;
		this.particles_count += 1;
	};
}