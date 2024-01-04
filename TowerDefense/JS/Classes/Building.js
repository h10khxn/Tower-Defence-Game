class Building extends Sprite{
    constructor({ position = { x: 0, y: 0 } }) {
        super({
            position,
            imageSrc: './img/Tower 05.png',
            frames: {
                max:1
            }
        })
    
        this.width = 64
        this.height = 64 ////////// Revist for size of tower editing
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        }
        this.projectiles = []
        this.radius = 250
        this.target
        this.elaspedSpawnTime = 0
    }

    draw() {
        super.draw()

        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'rgba(0, 0, 255, 0.05)' // Arc around towers
        c.fill()
    }

    update() {
        this.draw()
        if (this.elaspedSpawnTime % 100 === 0 && this.target) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target 
                })
            )
        }
        this.elaspedSpawnTime++
    }
}

