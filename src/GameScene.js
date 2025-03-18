import Phaser from 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game-scene')
    }

    preload() {
        this.load.image('background', 'assets/background.png')
        this.load.image('2', 'assets/2.png')
        this.load.image('3', 'assets/3.png')
        this.load.image('5', 'assets/5.png')
        this.load.image('7', 'assets/7.png')
        this.load.image('11', 'assets/11.png')
        this.load.image('13', 'assets/13.png')
        this.load.image('17', 'assets/17.png')
        this.load.image('19', 'assets/19.png')
        this.load.image('23', 'assets/23.png')
        this.load.image('29', 'assets/29.png')
        this.load.image('31', 'assets/31.png')
        this.load.image('line', 'assets/line.png')
        this.load.image('line2', 'assets/line2.png')
    }

    create() {
        this.dict={}
        this.dict['2']=3
        this.dict['3']=5
        this.dict['5']=7
        this.dict['7']=11
        this.dict['11']=13
        this.dict['13']=17
        this.dict['17']=19
        this.dict['19']=23
        this.dict['23']=29
        this.dict['29']=31
        
        this.add.image(200, 347, 'background')
        this.add.image(200, 80, 'line')
        
        this.speed=600
        this.finished=true
        this.gamefinished=false
        this.gamefinished_real=false

        this.ball1=2
        
        this.balls=this.physics.add.group({
            collideWorldBounds: true
        })
        this.physics.add.collider(this.balls,this.balls,this.ballCollide,null,this)
        
        //마우스 입력 관리
        window.addEventListener('pointerdown', () => {
            this.clicked=true
        });
        window.addEventListener('pointerup', () => {
            if(this.clicked){
                this.clickfinished = true;
            }
        });
        
        //점수 관리
        this.score=0;
        this.scoreText=this.add.text(390,15,`${this.score}`, { fontSize: '30px', color: '#000000', fontFamily: 'Arial', align: 'right'}).setOrigin(1,0);
        this.scoreText.setDepth(101);

        //next 띄우기
        this.nextText_t=this.add.text(19,24,`next`, { fontSize: '15px', color: '#000000', fontFamily: 'Arial', align: 'left'}).setOrigin(0,0);
        this.nextText=this.add.text(60,15,`2`, { fontSize: '30px', color: '#000000', fontFamily: 'Arial', align: 'left'}).setOrigin(0,0);
        this.nextText_t.setDepth(100);
        this.nextText.setDepth(100);
    }

    ballCollide(ball1,ball2){
        if(ball1.getData("num")==ball2.getData("num")){
            this.score+=Number(ball1.getData("num"))
            this.scoreText.setText(`${this.score}`);
            if(ball1.getData("num")=='31'){
                ball1.setVisible(false)
                ball1.setActive(false)
                ball2.setVisible(false)
                ball2.setActive(false)
                //this.balls.remove(ball1,true,true);
                //this.balls.remove(ball2,true,true);
            }
            else{
                var newN=this.dict[ball1.getData("num")];
                this.newBall = this.physics.add.sprite((ball1.x+ball2.x)/2,(ball1.y+ball2.y)/2, newN);
                this.newBall.setCircle((230/29*newN+(30-230/29*2))/2);
                this.newBall.setData("num",newN)
                this.newBall.setData("collided",true)
                
                this.newBall.setBounce(0.2);
                
                this.balls.remove(ball1,true,true);
                this.balls.remove(ball2,true,true);
                this.balls.add(this.newBall)
            }
        }
        else{
            ball1.setData("collided",true)
            ball2.setData("collided",true)
        }
    }

    update() {
        if(this.gamefinished){
            if(!this.gamefinished_real){
                this.gamefinished_real=true
                alert('Game Over!')
            }
            else{
                return
            }
        }
        if(this.finished){
            this.player = this.physics.add.sprite(200, 30, this.ball1.toString())
            this.player.setCircle((230/29*this.ball1+(30-230/29*2))/2)
            this.player.setBounce(0.2)
            this.player.body.setAllowGravity(false)
            this.player.setData("num",this.ball1.toString())
            this.player.setData("collided",false)
            this.clicked=false
            this.arrived=false
            this.clickfinished=false
            this.targetX=200
            this.finished=false

            this.ball1=[2,3,5,7,11][Math.floor(Math.random()*5)]
            this.nextText.setText(`${this.ball1}`)
        }
        if(!this.finished){
            this.player.x=Phaser.Math.Clamp(this.player.x, (230/29*Number(this.player.getData("num"))+(30-230/29*2))/2, 400-(230/29*Number(this.player.getData("num"))+(30-230/29*2))/2);
            this.targetX=Phaser.Math.Clamp(this.targetX, (230/29*Number(this.player.getData("num"))+(30-230/29*2))/2, 400-(230/29*Number(this.player.getData("num"))+(30-230/29*2))/2);
            if(this.input.activePointer.isDown && !this.arrived && !this.clickfinished){ //&& this.input.activePointer.x<=400 && this.input.activePointer.x>=0
                //slow follow
                this.targetX = Phaser.Math.Clamp(this.input.activePointer.x, (230/29*Number(this.player.getData("num"))+(30-230/29*2))/2, 400-(230/29*Number(this.player.getData("num"))+(30-230/29*2))/2);
                const playerX = this.player.x;
                if (Math.abs(this.targetX - playerX) > 10) {
                    if (this.targetX < playerX) {
                        this.player.setVelocityX(-this.speed);
                    } else {
                        this.player.setVelocityX(this.speed);
                    }
                } else {
                    this.arrived=true
                    this.player.setVelocityX(0);
                }
            }
            else if(this.input.activePointer.isDown && this.arrived){
                //fast follow
                this.targetX = Phaser.Math.Clamp(this.input.activePointer.x, (230/29*Number(this.player.getData("num"))+(30-230/29*2))/2, 400-(230/29*Number(this.player.getData("num"))+(30-230/29*2))/2);
                this.player.x=this.targetX;
            }
            else if(this.clicked && !this.arrived){
                //Target Finished, slow follow
                this.targetX = Phaser.Math.Clamp(this.targetX, (230/29*Number(this.player.getData("num"))+(30-230/29*2))/2, 400-(230/29*Number(this.player.getData("num"))+(30-230/29*2))/2)
                const playerX = this.player.x;
                if (Math.abs(this.targetX - playerX) > 10) {
                    if (this.targetX < playerX) {
                        this.player.setVelocityX(-this.speed);
                    } else {
                        this.player.setVelocityX(this.speed);
                    }
                } else {
                    this.arrived=true
                    this.player.setVelocityX(0);
                }
            }
            if(this.clickfinished && this.arrived){
                this.finished=true
                this.player.body.setAllowGravity(true);
                this.balls.add(this.player)
            }
        }
        this.balls.getChildren().forEach(ball => {
            if((ball.y-(230/29*Number(ball.getData("num"))+(30-230/29*2))/2)<70 && ball.getData("collided")){
                this.add.image(200, 80, 'line2')
                this.gamefinished=true
                this.scene.pause();
            }
        });        
    }
}