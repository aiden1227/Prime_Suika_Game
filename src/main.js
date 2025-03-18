import Phaser from 'phaser'

import GameScene from './GameScene'

const config = {
	type: Phaser.AUTO,
	parent: 'game-container',
	width: 400,
	height: 694,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 5000 },
			//debug: true
		},
	},
	scene: [GameScene],
}

export default new Phaser.Game(config)
