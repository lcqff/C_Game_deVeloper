import Player from "../Player.js";
import Inventory from "../Inventory.js";
import Dialog from "../Dialog.js";
import Command from "../Command.js";

export default class FirstStage extends Phaser.Scene {   
    constructor(){ 
        super("first_stage"); //identifier for the scene
    }

    preload() {
        this.load.tilemapTiledJSON("stage1", "./assets/stage1.json");
    }
    
    create () {
        //this.inventory = new Inventory(this);
        this.dialog = new Dialog(this);

        /** x 키 입력 받기**/
        this.keyX = this.input.keyboard.addKey('X');
        this.key2 = this.input.keyboard.addKey('TWO');
        this.key3 = this.input.keyboard.addKey('THREE');
        this.key4 = this.input.keyboard.addKey('FOUR');
        this.key5 = this.input.keyboard.addKey('FIVE');
        this.key6 = this.input.keyboard.addKey('SIX');

        this.anims.create({
            key: "fire",
            frames: this.anims.generateFrameNumbers('fireBackground',{ start: 0, end: 2}), 
            frameRate: 5,
            repeat: -1
        });

        this.background1 = this.add.sprite( 0, 550, 'fireBackground', 0).setOrigin(0,1);
        this.background2 = this.add.sprite( 1100, 550, 'fireBackground', 0).setOrigin(0,1);

        this.background1.play('fire',true);
        this.background2.play('fire',true);
        
        /*** 맵 만들기 Create Map ***/
        const map = this.make.tilemap({ key: "stage1" });

        /***스폰 포인트 설정하기 locate spawn point***/
        const spawnPoint = map.findObject("spawn", obj => obj.name === "spawnPoint");

        /*** 플레이어 스폰 위치에 스폰 Spawn player at spawn point ***/
        //this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player');
        this.player = new Player(this, spawnPoint.x, 430);

        /** 집 이미지 add **/
        this.add.image(0,0,"house").setOrigin(0,0);
        
        const tileset = map.addTilesetImage("map", "tiles"); //name of tileset(which is same as Png tileset) , source
        this.worldLayer = map.createLayer("world", tileset, 0, 0);// Parameters: layer name (or index) from Tiled, tileset, x, y


        this.anims.create({
            key: "exclam",
            frames: this.anims.generateFrameNumbers('exp_exclam',{ start: 0, end: 4}), 
            frameRate: 8,
            repeat: 0,
            hideOnComplete: true
        });
        this.exclamMark = this.add.sprite( 600, 330, 'exp_exclam', 0);
        this.exclamMark.setVisible(false);

        this.anims.create({
            key: "devil_walk",
            frames: this.anims.generateFrameNumbers('npc_devil',{ start: 0, end: 3}), 
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: "devil_touch_phone",
            frames: this.anims.generateFrameNumbers('npc_devil',{ start: 4, end: 5}), 
            frameRate: 2,
            repeat: -1,
        });
        this.devil = this.physics.add.sprite(600 ,430,'npc_devil');
        this.devil.setFrame(1);
        
        
        /*** 화면이 플레이어 따라 이동하도록 Make screen follow player ***/
        this.cameras.main.startFollow(this.player.player); // 현재 파일의 player . player.js 의 player
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setDeadzone(map.widthInPixels/16, map.heightInPixels); //config.width 대신 map.widthInPixels 쓰기

        /*** 충돌 설정하기 Set Collision ***/
        this.worldLayer.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.player, this.worldLayer); //충돌 하도록 만들기
        this.physics.add.collider(this.devil, this.worldLayer);

        /*** 카메라가 비추는 화면 변수 선언 ***/
        this.worldView = this.cameras.main.worldView;


        /*** 명령창 불러오기 ***/
        this.command = new Command(this, map, "first_stage");

        // 드래그앤드랍
        //this.draganddrop_1 = new DragAndDrop(this, 300, 20, 100, 30).setRectangleDropZone(100, 30).setName("1");
        //this.draganddrop_2 = new DragAndDrop(this, 500, 20, 100, 30).setRectangleDropZone(100, 30).setName("2");
        //this.draganddrop_3 = new DragAndDrop(this, 700, 20, 100, 30).setRectangleDropZone(100, 30).setName("3");
        
        /** 인벤토리 만들기 **/     
        //this.inven = this.inventory.create(this);


        /** 플레이어 위치 확인용 **/
        this.playerCoord = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

        /*** 미니맵버튼 활성화 ***/ //@@@@@@@@@@@
        this.minimap_button = this.add.image(20,300,'map_button').setOrigin(0,0);
        this.minimap_button.setInteractive();
        this.minimap_button.on("pointerdown",function(){
            this.scene.sleep('first_stage'); 
            this.scene.run("minimap");
        },this);

        stagenum = 1;

        /** 초반 대사 **/
        this.cameras.main.fadeIn(1000,0,0,0);
        this.player.playerPaused = true; //대사가 다 나오면 플레이어가 다시 움직이도록
        this.stage1_1();

        this.quiz_running = false;
    }

    update() {
        this.player.update();
        //this.inventory.update();
        this.command.update(this);
                
         /* 플레이어 위치 알려줌*/
         this.playerCoord.setText([
            '플레이어 위치',
            'x: ' + this.player.player.x,
            'y: ' + this.player.player.y,
        ]);
        this.playerCoord.x = this.worldView.x + 900;
        this.playerCoord.y = this.worldView.y + 10;

        if(this.key2.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run('second_stage');
        }
        if(this.key3.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("third_stage");
        }if(this.key4.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fourth_stage");
        }if(this.key5.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("fifth_stage");
        }if(this.key6.isDown) {
            console.log('맵이동');
            this.scene.sleep('first_stage'); //방으로 돌아왔을 때 플레이어가 문 앞에 있도록 stop 말고 sleep (이전 위치 기억)
            this.scene.run("sixth_stage");
        }

        if(!this.scene.isActive('quiz') && this.quiz_running ) this.stage1_6();

    }

    stage1_1() {
        this.player.player.setVelocityY(-300)    //플레이어 프래임도 바꾸고 싶은데 안바뀌네..

        this.time.delayedCall( 1000, () => {  
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_1, this.dialog)
            .start();
            seq.on('complete', () => {
                //악마를 플레이어 방향을 보게 하고, 그 위에 느낌표 표시를 한 뒤 stage2 대사로 넘어간다
                this.devil.setFlipX(true);
                this.exclamMark.setVisible(true);
                this.exclamMark.play('exclam');
                this.time.delayedCall( 1000, () => { this.stage1_2() }, [] , this);
            });    
        }, [], this);
    }

    stage1_2() {
        var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_2, this.dialog)
            .start();
            seq.on('complete', () => {
                this.devil.play('devil_walk',true);
                this.devil.setVelocityX(-200);
                this.time.delayedCall( 1000, () => {
                    this.devil.anims.stop();
                    this.devil.setVelocityX(0);
                    this.stage1_3();
                 }, [] , this);
            });  
    }

    stage1_3() {
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_3, this.dialog)
        .start();
        seq.on('complete', () => {
            this.devil.play('devil_touch_phone',true);
            this.time.delayedCall( 2000, () => {
                this.stage1_4();
             }, [] , this);
        });  
    }

    stage1_4() {
        this.devil.anims.stop();
        this.devil.setFrame(1);
        this.phoneLocked = this.add.image(this.worldView.x+1110,50,'locked').setOrigin(0,0).setInteractive();
        this.tweens.add({
            targets: this.phoneLocked,
            x: 350, //위치 이동
            duration: 500,
            ease: 'Power1', 
            repeat: 0,
            onComplete: ()=>{console.log('done')}
        }, this);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.time.delayedCall( 2000, () => { 
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_4, this.dialog)
            .start();
            seq.on('complete', () => {
                this.stage1_5();
            }); 
        }, [] , this);
    }

    stage1_5() {
        this.devil.setFlipX(false);
        this.devil.play('devil_walk');
        this.devil.setVelocityX(500);
        var seq = this.plugins.get('rexsequenceplugin').add();
        this.dialog.loadTextbox(this);
        seq
        .load(this.dialog.stage1_5, this.dialog)
        .start();
        seq.on('complete', () => {
            this.devil.destroy();
            console.log('대화 끝');
            this.click = this.add.text(500, 400, 'Click!', { font: 'Courier', fill: '#ffffff', fontSize: '100px' })
            this.phoneLocked.on('pointerdown', function() {
                this.scene.run('quiz');
                this.quiz_running = true;
            }, this);
        }); 
    }

    stage1_6() {
        this.quiz_running = false;
        this.phoneLocked.destroy();
        this.click.destroy();

        var phoneUnlocked = this.add.image(350,50,'unlocked').setOrigin(0,0);

        this.time.delayedCall( 1000, () => { 
            var seq = this.plugins.get('rexsequenceplugin').add();
            this.dialog.loadTextbox(this);
            seq
            .load(this.dialog.stage1_6, this.dialog)
            .start();
            seq.on('complete', () => {
                this.tweens.add({
                    targets: phoneUnlocked,
                    x: 1100, //위치 이동
                    duration: 500,
                    ease: 'Power1',
                    repeat: 0,
                    onComplete: ()=>{phoneUnlocked.destroy();}
                }, this);
            }); 
        }, [], this);

       
        
    }
}
