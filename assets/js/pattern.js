
class lockPattern {
	constructor(canvas, config){
		if(!(canvas instanceof HTMLCanvasElement)){
			throw new Error(`${canvas} is not of the type HTML Canvas Element`);
		}
		this.canvas = canvas;
		try {
			this.ctx = this.canvas.getContext("2d");
		}
		catch(e){
			console.log(e);
			return;
		}
		Object.defineProperty(this.__proto__, "size", {
			enumerable: true,
			get : function(){
					return 3;
			},
			set : function(){
				const value = arguments[0];
				if(isNaN(value)){
					throw new Error (`value for size is not a number!`);
				}
				if(value < 3){
					throw new Error (`value of size should not be less than 3!`);
				}
				const setter = this.__lookupSetter__("size");
				delete this.size;
				this.__defineGetter__("size", function(){
					return value;
				});
				this.__defineSetter__("size", setter);
			}	
		});
		
		Object.defineProperty(this.__proto__, "line_width", {
			enumerable: true,
			get : function(){
				return 4;
			},
			set : function(){
				const value = arguments[0];
				if(isNaN(value)){
					throw new Error (`value for line_width is not a number!`);
				}
				const setter = this.__lookupSetter__("line_width");
				delete this.line_width;
				this.__defineGetter__("line_width", function(){
					return value;
				});
				this.__defineSetter__("line_width", setter);
			}
		});
		
		Object.defineProperty(this.__proto__, "min_connect", {
			enumerable: true,
			get : function(){
				return 4;
			},
			set : function(){
				const value = arguments[0];
				if(isNaN(value)){
					throw new Error (`value for min_connect is not a number!`);
				}
				const setter = this.__lookupSetter__("min_connect");
				delete this.min_connect;
				this.__defineGetter__("min_connect", function(){
					return value;
				});
				this.__defineSetter__("min_connect", setter);
			}
		});	
		
		Object.defineProperty(this.__proto__, "background_radius", {
			enumerable: true,
			get : function(){
				return 20;
			},
			set : function(){
				const value = arguments[0];
				if(isNaN(value)){
					throw new Error (`value for background_radius is not a number!`);
				}
				
				const setter = this.__lookupSetter__("background_radius");
				delete this.background_radius;
				this.__defineGetter__("background_radius", function(){
					return value;
				});
				this.__defineSetter__("background_radius", setter);
			}
		});
		
		Object.defineProperty(this.__proto__, "radius", {
			enumerable: true,
			get : function(){
				return 5;
			},
			set : function(){
				const value = arguments[0];
				if(isNaN(value)){
					throw new Error (`value for radius is not a number!`);
				}
				if(value > this.background_radius){
					throw new Error (`value for radius can't be greater than background_radius!`);
				}
				const setter = this.__lookupSetter__("radius");
				delete this.radius;
				this.__defineGetter__("radius", function(){
					return value;
				});
				this.__defineSetter__("radius", setter);
			}
		});
		Object.defineProperty(this.__proto__, "background_radius_line_width", {
			enumerable: true,
			get : function(){
				return 4;
			},
			set : function (){
				const value = arguments[0];
				if(isNaN(value)){
					throw new Error (`value for background_radius_line_width is not a number!`);
				}
				if(value < 4){
					throw new Error (`value for background_radius_line_width should not be less than 4 you can set its color to match background_radius if you want to disable it!`);
				}
				const setter = this.__lookupSetter__("background_radius_line_width");
				delete this.background_radius_line_width;
				this.__defineGetter__("background_radius_line_width", function(){
					return value;
				});
				this.__defineSetter__("background_radius_line_width", setter);
			}
		});
		
		Object.defineProperty(this.__proto__, "transparency", {
			enumerable: true,
			get : function(){
				return false;
			},
			set : function(){
				const value = arguments[0];
				if((typeof value != "boolean")){
					throw new Error (`value for transparency can only be true or false!`);
				}
				const setter = this.__lookupSetter__("transparency");
				delete this.transparency;
				this.__defineGetter__("transparency", function(){
					return value;
				});
				this.__defineSetter__("transparency", setter);
			}
		});
		
		Object.defineProperty(this.__proto__, "onconnect", {
			enumerable: true,
			get : function(){
				return null;
			},
			set : function(){
				const value = arguments[0];
				if((typeof value != "function")){
					throw new Error (`value for onconnect can only be a function!`);
				}
				const setter = this.__lookupSetter__("onconnect");
				delete this.onconnect;
				this.__defineGetter__("onconnect", function(){
					return value;
				});
				this.__defineSetter__("onconnect", setter);
			}
		});
		Object.defineProperty(this.__proto__, "onfailedconnect", {
			enumerable: true,
			get : function(){
				return null;
			},
			set : function(){
				const value = arguments[0];
				if((typeof value != "function")){
					throw new Error (`value for onfailedconnect can only be a function!`);
				}
				const setter = this.__lookupSetter__("onfailedconnect");
				delete this.onconnect;
				this.__defineGetter__("onfailedconnect", function(){
					return value
				});
				this.__defineSetter__("onfailedconnect", setter);
			}
		});
		
		this.background_radius_color = "#fff";
		this.background_radius_line_color = "lightgreen";
		this.error_background_radius_line_color = "firebrick";
		this.error_line_color = "firebrick";
		this.radius_color = "#ccc";
		this.line_color = "lightgreen";
		
		if(config && (typeof config == "object")){
			for(let setting in config){
				let canSet = (setting in this);
				if(canSet){
					this[setting] = config[setting];
				}
			}
		}
	}
	
	addEventListener(type, value) {
		type = `on${type}`;
		if(this.__proto__.hasOwnProperty(type)){
			if((typeof value != "function")){return;}
			if(this[type]){
				const callback = this[type];
				this[type] = function(ev){
					callback.call(this, ev);
					value.call(this, ev);
				}
			}
			else {
				this[type] = value;
			}
		}
	} 
	
	setscale (){
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		const each_width_gap = ((this.width-(2*this.background_radius)) / 
		(this.size-1)) - (.5*this.background_radius_line_width);
		
		const each_height_gap = ((this.height-(2*this.background_radius)) / 
		(this.size-1)) - (.5*this.background_radius_line_width);
		
		
		this.each_width_gap = each_width_gap;
		this.each_height_gap = each_height_gap;
	}
	get_x(cur_col){
		const x = (this.each_width_gap * cur_col) + this.background_radius + 
		(.5*this.background_radius_line_width);
		return x;
	}
	get_y(cur_row){
		const y = (this.each_height_gap * cur_row) + this.background_radius + 
		(.5*this.background_radius_line_width);
		return y;
	}
	rescale(){
		this.setscale();
		let cur_row = 0, cur_col = 0, x = 0, y = 0;
		const points = this.points;
		for (let i = 0; i < points.length; i++) {
			cur_row = Math.floor(i / this.size);
			cur_col = i % this.size; 
			
			
			points[i].x = this.get_x(cur_col);
			points[i].y = this.get_y(cur_row);	
		}
		this.display();
	}
	initiate(){
		this.setscale();
		this.points = [];
		let cur_row = 0, cur_col = 0, x = 0, y = 0;
		const total_size = this.size*this.size;
		for(let i = 0; i < total_size; i++){
			cur_row = Math.floor(i / this.size);
			cur_col = i % this.size; 

			x = this.get_x(cur_col);
			y = this.get_y(cur_row);
			
			this.points.push({
				x: x,
				y: y
			});
		}
		this.connecting = false;
		this.path_finder = new Path2D();
		this.reset()
		this.display();
		this.set_controls();
	}
	display (){
		const points = this.points;
		const ctx = this.ctx;
		ctx.clearRect(0,0,this.width, this.height);
		for(let i = 0; i < this.points.length; i++){
			const point = points[i];
			ctx.beginPath();
			ctx.arc(point.x, point.y, this.background_radius, (Math.PI/180)*0, (Math.PI/180)*360, false);
			if(this.is_selected(i)){
				if(!this.connecting && this.selected.length < this.min_connect){
					ctx.strokeStyle = this.error_background_radius_line_color;
				}
				else {
					ctx.strokeStyle = 
					(this.connecting && this.transparency) ? this.background_radius_color : 
					this.background_radius_line_color;
				}
			}else {
				ctx.strokeStyle = this.background_radius_color;
			}
			
			ctx.fillStyle = this.background_radius_color;
			ctx.fill();
			ctx.lineWidth = this.background_radius_line_width;
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(point.x, point.y, this.radius, (Math.PI/180)*0, (Math.PI/180)*360, false);
			ctx.fillStyle = this.radius_color;
			ctx.fill();
			ctx.closePath();
		}
		
		if(this.selected.length > 0 && (!this.connecting || this.transparency == false)){
			ctx.beginPath();
			ctx.moveTo(this.points[this.selected[0]].x, this.points[this.selected[0]].y);
			for(let i = 1; i < this.selected.length; i++){
				let point = this.points[this.selected[i]];
				ctx.lineTo(point.x, point.y);
			}	
			if(this.connecting === true && (this.cursor.x && this.cursor.y)){
				const lst_pos = this.points[this.selected[this.selected.length-1]];
				ctx.lineTo(this.cursor.x, this.cursor.y);
			}		
			ctx.lineWidth = this.line_width;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			if(!this.connecting && this.selected.length < this.min_connect){
				ctx.strokeStyle = this.error_line_color;
			}else {
				ctx.strokeStyle = this.line_color;
				
				
			}
			
			ctx.stroke();
			ctx.restore();
			ctx.closePath();
		}
		
		
	}

	link_paths (){
		const selected = this.selected;
		const points = this.points;
		const prev_index = selected[selected.length-2];
		const last_index = selected[selected.length-1];
		const lst = points[last_index];
		const prev = points[prev_index];
		const prev_row = Math.floor(prev_index / this.size);


		let row = Math.floor(last_index / this.size);
		if(prev_index > last_index){
			row = prev_row - row;
		}
		
			let dir = null;
			let change = 0;
			if(lst.x == prev.x && prev_index > last_index){dir = "up";}
			if(lst.x == prev.x && prev_index < last_index){dir = "down";}
			if(lst.y == prev.y && prev_index < last_index){dir = "right";}
			if(lst.y == prev.y && prev_index > last_index){dir = "left";}
			if(lst.x < prev.x && lst.y > prev.y){dir = "sw"; change = this.size-1}
			if(lst.x > prev.x && lst.y > prev.y){dir = "se"; change = this.size+1}
			if(lst.x < prev.x && lst.y < prev.y){dir = "nw"; change = this.size+1}
			if(lst.x > prev.x && lst.y < prev.y){dir = "ne"; change = this.size-1}
			let dirs = ["sw", "nw", "ne", "se"];
			if(dirs.indexOf(dir) > -1){
				let expected = change * row;
				if(prev_index > last_index){
					expected = prev_index - expected;
				}
				else {
					expected += prev_index;
				}
				if(expected !== last_index) {return; }
			}
			let i = prev_index;
			for(i; 
			(dir == "sw" || dir == "se" || dir == "down" || dir == "right") ? i < last_index :
			(dir == "up" || dir == "left" || dir == "nw" || dir == "ne") ? i > last_index :
			null
			;
			(dir == "up") ? i-=this.size :
			(dir == "down") ? i+=this.size :
			(dir == "left") ? i-- :
			(dir == "right") ? i++:
			(dir == "sw" || dir == "se") ? i+=change : 
			(dir == "nw" || dir == "ne") ? i-=change : null){
				if(this.is_selected(i)){continue;}
				else {
					this.selected.splice(this.selected.length-1, 0, i);
				}
		}
	}


	check_collision (x, y){
		const ctx =  this.ctx;
		const res = ctx.isPointInPath(this.path_finder, x, y);
		return res;
	}

	find_point (x, y){
		const points = this.points;
		let res = false;
		for(let i = 0; i < points.length; i++){
			let point = points[i];
			let min_x = points[i].x - this.background_radius;
			let max_x = points[i].x + this.background_radius;
			let min_y = points[i].y - this.background_radius;
			let max_y = points[i].y + this.background_radius;
					
			if((x >= min_x && x <= max_x) && (y >= min_y && y <= max_y)){
				const point = points[i];
				this.path_finder.closePath();
				this.path_finder.arc(point.x, point.y, this.background_radius, 
				(Math.PI/180)*0, (Math.PI/180)*360, false);
				
				if(this.check_collision(x, y)){res = i;}
				break;
			}
		}
		return res;
	}

	set_controls (){
		const connect_dots = (ev) => {
			let x, y;
			if(ev.type === "mousemove"){x = ev.pageX; y = ev.pageY;}
			else if(ev.type === "touchmove"){
				x = ev.touches[0].pageX; 
				y = ev.touches[0].pageY;
			}
			else {return;}
			const pos = this.get_pos(x, y);
			x = pos.x,
			y = pos.y;
			
			this.cursor = {
				x: x,
				y: y
			}
			let res = this.find_point(x, y);
			if(res !== false && !this.is_selected(res)){
				this.selected.push(res);
				this.link_paths();
			}
			this.display();
		}
				
		const end_draw = (ev) => {
			this.canvas.removeEventListener("mousemove", 	connect_dots)
			this.canvas.removeEventListener("touchmove", 	connect_dots);
			this.canvas.removeEventListener("mouseout",		end_draw);
			this.canvas.removeEventListener("touchleave",	end_draw);
			this.canvas.removeEventListener("mouseup",		end_draw);
			this.canvas.removeEventListener("touchend",		end_draw);
			
			this.connecting = false;
			this.cursor = {};
			this.display();
			
			if(this.selected.length < this.min_connect){
				
				if(this.onfailedconnect){
					const event = this.create_event('onfailedconnect');
					this.onfailedconnect.call(this, event);
				}
			}
			else {
				if(this.onconnect){
					const event = this.create_event('onconnect');
					this.onconnect.call(this, event);
				}
			}
			this.display();
			
		}
		
		
		const start_draw = (ev) => {
			this.selected = [];
			this.display();
			
			let x, y;
			if(ev.type === "mousedown"){x = ev.pageX; y = ev.pageY;}
			else if(ev.type === "touchstart"){
				x = ev.touches[0].pageX; 
				y = ev.touches[0].pageY;
			}
			else {return;}
			const pos = this.get_pos(x, y);
			x = pos.x,
			y = pos.y;
			
			let res = this.find_point(x, y);
			if(res === false){
				return;
			}
			else {
				this.selected.push(res);
				this.connecting = true;
				this.display();
				this.cursor = {
					x: res.x,
					y: res.y
				};
				this.canvas.addEventListener("mousemove",		connect_dots, false);
				this.canvas.addEventListener("touchmove",		connect_dots, false);
				this.canvas.addEventListener("mouseout",		end_draw, false);
				this.canvas.addEventListener("touchleave",		end_draw, false);
				this.canvas.addEventListener("mouseup",			end_draw, false);
				this.canvas.addEventListener("touchend",		end_draw, false);
			}
		}
		
		
		this.canvas.addEventListener("mousedown",	start_draw, false);
		this.canvas.addEventListener("touchstart",	start_draw, false);
		
	}
	get_pos(x, y){
		let box = this.canvas.getBoundingClientRect();
		return {
			x:x - box.left,
			y:y - box.top
		}
	}
	
	create_event(name) {
		let event = new Event(name, {target: this, timeStamp: Date.now()});
		Object.defineProperty(event, 'target', {value: this, enumerable:true, writable: false});
		Object.defineProperty(event, 'path', {value: [this], enumerable:true, writable: false});
		return event;
	}
	
	reset (){
		if(!this.connecting){
			this.selected = [];
			this.cursor = {};
			this.display();
		}
	}

	is_selected (data){
		const points = this.selected;
		let res = false;
		if(points.findIndex((res)=>{
			return res === data;
		}) !== -1){
			res = true;
		}
		return res;
	}
}






