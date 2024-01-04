const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

c.fillStyle='white'
c.fillRect(0,0,canvas.width, canvas.height)

const placementTilesData2D = []

for (let i = 0; i < placementTilesData.length; i += 20) {
	placementTilesData2D.push(placementTilesData.slice(i, i + 20))
}

const placementTiles = []

placementTilesData2D.forEach((row, y) => {
	row.forEach((symbol, x) => {
		if (symbol === 241) {
			//Add building placement thiles here
			placementTiles.push(
				new PlacementTile({
					position: {
						x:x * 64,
						y:y * 64
					}
				})
			)
		}
	})
})

const image = new Image()
image.onload = () =>{
	animate()
	
}
image.src = 'img/Map.png'

const enemies = []

function spawnEnemies(spawnCount,waveSpeed) {
	for (let i = 1; i < spawnCount + 1; i++){ //
		const yOffset = i*150
		enemies.push(
			new Enemy({
			position:  { x: waypoints[0].x, y:waypoints[0].y-yOffset}
			},waveSpeed
			)
		)
	}
}

const buildings = []
let activeTile = undefined
let enemyCount = 3
let speedcount = 2
let wavecount = 0
let hearts = 10
let coins = 100
const explosions=[]
spawnEnemies(enemyCount,speedcount)


function animate(){
	const animationId= requestAnimationFrame(animate)

	c.drawImage(image, 0, 0)

	for (let i = enemies.length - 1; i >= 0; i--) {
		const enemy = enemies[i]
		enemy.update()
		enemy.draw()

		if (enemy.position.y > canvas.height) {
			hearts -=1
			enemies.splice(i, 1)
			document.querySelector('#hearts').innerHTML = hearts
			if (hearts ===0) {
				
				console.log('game over')
				cancelAnimationFrame(animationId)
				document.querySelector('#gameOver').style.display='flex'
			}
		}
	}
	for (let i = explosions.length - 1; i >= 0; i--) {
		const explosion = explosions[i]
		explosion.draw()
		explosion.update()
	
		if (explosion.frames.current +1 >= explosion.frames.max ) {
		  explosions.splice(i, 1)
		}
	
		//console.log(explosions)
	  }


	//tracking total amount of enemies
	if (enemies.length === 0) { // Offset to 1 to fit our data
		if (wavecount %2 !==0){
			enemyCount += 2
			//Progressively removes more towers when wave count increases
			if (wavecount <= 5) {
				removeBuilding(buildings[0]) 
			}
			else if (wavecount > 5 && wavecount <= 10) {
				removeBuilding(buildings[0])
				removeBuilding(buildings[1])
			}
			else if (wavecount > 10) {
				removeBuilding(buildings[0])
				removeBuilding(buildings[1])
				removeBuilding(buildings[2])
			}
			
		}
		speedcount += 0.75 // Modify this number for waves
		spawnEnemies(enemyCount, speedcount)
		document.querySelector('#waves').innerHTML = 'Waves: ' + (wavecount + 1)
		wavecount += 1
	}
	placementTiles.forEach((tile) => {
		tile.update(mouse)
	})

	buildings.forEach((building) => {
		building.update()
		building.target = null
		const validEnemies = enemies.filter(enemy => {
			const xDifference = enemy.center.x - building.center.x
			const yDifference = enemy.center.y - building.center.y
			const distance = Math.hypot(xDifference, yDifference)
			return distance < enemy.radius + building.radius
		})
		building.target = validEnemies[0]

		for (let i = building.projectiles.length - 1; i >= 0; i--) {
			const projectile = building.projectiles[i]

			projectile.update()

			const xDifference = projectile.enemy.center.x - projectile.position.x
			const yDifference = projectile.enemy.center.y - projectile.position.y
			const distance = Math.hypot(xDifference, yDifference)

			//This is when a projectile hits an enemy
			if (distance < projectile.enemy.radius + projectile.radius) {
				// Enemy Health and Enemy Removal
				projectile.enemy.health -= 20
				if (projectile.enemy.health <= 0) {
					const enemyIndex = enemies.findIndex((enemy) => {
						return projectile.enemy == enemy
					})

					if (enemyIndex > -1) 
					{
						enemies.splice(enemyIndex, 1)
						coins += 25
						document.querySelector('#coins').innerHTML = coins
					}
				}
				
				

				console.log(projectile.enemy.health)
				explosions.push(new Sprite({position: {x:projectile.position.x,y:projectile.position.y}, imageSrc:'./img/Effects/Bullet_impact.png', frames:{max:3},offset:{x:0,y:0}}))
				building.projectiles.splice(i, 1)
			}
		}
	})
}
console.log(enemies)
const mouse = {
	x: undefined,
	y: undefined
}
/////////////////////////
canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
        coins -= 50
        document.querySelector('#coins').innerHTML = coins

        const newBuilding = new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        })

        buildings.push(newBuilding)

        // Mark the tile as occupied
        activeTile.isOccupied = true
        activeTile.occupiedBy = newBuilding // Save a reference to the building
    }
})

// Function to remove a building and update the tile status
function removeBuilding(buildingToRemove) {
    const index = buildings.indexOf(buildingToRemove)
    if (index !== -1) {
        buildings.splice(index, 1)

        // Find the tile occupied by this building and update its status
        for (let i = 0; i < placementTiles.length; i++) {
            const tile = placementTiles[i]
            if (tile.occupiedBy === buildingToRemove) {
                tile.isOccupied = false
                tile.occupiedBy = null // Reset the occupiedBy property
                break
            }
        }
    }
}

////////////////////////
window.addEventListener('mousemove', (event) => {
	mouse.x = event.clientX
	mouse.y = event.clientY

	activeTile = null
	for (let i = 0; i < placementTiles.length; i++) {
		const tile = placementTiles[i]
		if (mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
			mouse.y < tile.position.y + tile.size
		) {
			activeTile = tile
			break
		}
	}
})