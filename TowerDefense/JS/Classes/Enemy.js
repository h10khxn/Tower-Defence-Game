class Enemy extends Sprite{
	constructor({position = {x:0, y:0}},speed){
		super({position,imageSrc:'img/Dices and Objects/enemy_new.png',frames: {max:8}})
		this.position = position
		this.width=50
		this.height=50
		this.waypointIndex=0
		this.center={
			x:this.position.x + this.width/2,
			y:this.position.y + this.width/2
        }
        this.radius = 25
        this.health = 100
        this.velocity = {
            x:0,
            y:0
        }
		this.speed = speed
    }
    
	draw(){
		super.draw()

        // Health Bar
        c.fillStyle = 'red'
        c.fillRect(this.position.x+35, this.position.y +40, this.width, 5)

        c.fillStyle = 'green'
        c.fillRect(this.position.x+35, this.position.y +40, this.width * (this.health / 100), 5)
    }
    
	update(){
		this.draw()
		super.update()
		const waypoint = waypoints[this.waypointIndex]
		const yDistance = waypoint.y- this.center.y
		const xDistance = waypoint.x - this.center.x
		const angle = Math.atan2(yDistance, xDistance)
        this.velocity.x = Math.cos(angle)*this.speed
        this.velocity.y = Math.sin(angle)*this.speed
		this.position.x += this.velocity.x 
		this.position.y += this.velocity.y 
		this.center = {
			x:this.position.x + this.width/2,
			y:this.position.y + this.width/2
		}
		
		if(
			Math.abs(Math.round(this.center.x)- Math.round(waypoint.x))<
                Math.abs(this.velocity.x) &&
		 	Math.abs(Math.round(this.center.y) - Math.round(waypoint.y))< Math.abs(this.velocity.y) &&
            this.waypointIndex < waypoints.length - 1
        ) {
			this.waypointIndex++
		}
	}
}



