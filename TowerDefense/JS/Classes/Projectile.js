class Projectile extends Sprite {
    constructor({ position = { x: 0, y: 0 }, enemy }) {
        super({position,imageSrc:'img/Effects/Bullet.png'})
        this.velocity = {
            x: 0,
            y:0
        }
        this.enemy = enemy
        this.radius = 10
    }
    

    update() {
        this.draw()

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y, 
            this.enemy.center.x - this.position.x 
        )
        
        const power = 15
        this.velocity.x = Math.cos(angle) * power  // Speed of the projectiles
        this.velocity.y = Math.sin(angle) * power // can be adjusted later to be faster/slower

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
