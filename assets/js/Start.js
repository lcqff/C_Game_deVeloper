var stagenum;

class Start extends Phaser.Scene {
    constructor() {
      super("startGame");
      this.i = 0;
    }

    preload() {
      

      
      /*** 시작화면 image 로드 ***/
      this.load.image("title_menu", "./assets/images/menu/title_menu.png");
    
      /*** command 관련 image 로드 ***/
      this.load.image("entire_code_button", "./assets/images/command/entire_code_button.png");
      this.load.image("commandbox", "./assets/images/command/commandbox.png");
      this.load.image("compile_button", "./assets/images/command/execute_button.png");  //==============================================
      this.load.image("map_button", "./assets/images/command/map_button.png");

      //나중에 지우기 ======================================
              this.load.image("tiles", "./assets/images/map.png");

              /** FROM Player.js**/
              this.load.spritesheet('player', './assets/images/heroin.png', {
                frameWidth: 80,
                frameHeight: 140
            });
    
            /** 텍스트 박스에 사용하는 플러그인 rexUI preload **/
            this.load.scenePlugin({
                key: 'rexuiplugin',
                url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
                sceneKey: 'rexUI'
            });
            this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
            
            /** 순차진행에 필요한 플러그인 **/
            var url;
            url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexsequenceplugin.min.js';
            this.load.plugin('rexsequenceplugin', url, true);
      //나중에 지우기 ======================================


      /*** inventory 관련 image 로드 ***/
      this.load.image("inventory_button", "./assets/images/inventory_button.png");

      /*** textbox 이미지 로드***/
      this.load.image('textbox', "./assets/images/textbox.png");

      /** 플레이어 얼굴 이미지 로드 **/
      this.load.spritesheet('face', './assets/images/face.png', {
        frameWidth: 134,
        frameHeight: 130,
    });
      /*** minibox 관련 image 로드 ***/
      this.load.image("minibox", "./assets/images/command/mini_commandbox.png");

      /** 아이템 이미지 로드 **/
      this.load.image("item", "./assets/images/item.png");
      this.load.image("itemGet", "./assets/images/itemget.png");

      /**휴대폰, npc 로드 */
      this.load.image("phone", "./assets/images/phone.png");
      this.load.image("npc3", "./assets/images/npc/npc3.png");

      /*** 휴대폰 앱 로드 ***/
      this.load.image("app_code", "./assets/images/app_code.png");
      this.load.image("app_map", "./assets/images/app_map.png");
      this.load.image("app_tutorial", "./assets/images/app_tutorial.png");

      /*** 뒤로가기 버튼 로드 ***/
      this.load.image("back_button", "./assets/images/back_button.png");
      this.load.image("back_button_on", "./assets/images/back_button_on.png");

      /** 드랍 리셋 버든 로드 **/
      this.load.image("reset_button", "./assets/images/reset_button.png");
      /** 미니맵 이미지 로드 **/
      this.load.image("map_background", "./assets/images/map/minimap.png");
      this.load.image("stage_1_button", "./assets/images/map/stage_1.png");
      this.load.image("stage_2_button", "./assets/images/map/stage_2.png");
      this.load.image("stage_3_button", "./assets/images/map/stage_3.png");

      /** 불타는 배경 로드 **/
      this.load.spritesheet('fireBackground', './assets/images/fireBackground.png', {
        frameWidth: 1100,
        frameHeight: 552
    });

    /** 느낌표 말풍선 로드 **/
    this.load.spritesheet('exp_exclam', './assets/images/exp_exclam.png', {
      frameWidth: 55,
      frameHeight: 50
    });

    /** 첫번째 스테이지의 집 이미지 로드 **/
      this.load.image("house", "./assets/images/house.png");
    /**첫번째 스테이지 npc 로드  **/
    this.load.spritesheet('npc_devil', './assets/images/npc/npc3.png', {
      frameWidth: 79,
      frameHeight: 140,
    });
    /** 첫번째 스테이지의 잠긴 휴대폰 화면 로드 **/
      this.load.image("locked", "./assets/images/commandbox_locked.png");
      this.load.image('unlocked', './assets/images/commandbox_unlocked.png')

    /** 2번째 스테이지 타일 **/
      this.load.image("stage2_tiles", "./assets/images/test.png");
    /** 3번째 스테이지의 npc 로드 **/
      this.load.image("npc_chef", "./assets/images/npc/npc1.png");
      this.load.image("stage3_tiles", "./assets/images/stage3/map_stage3.png");

    /** 3번째 스테이지 이미지 로드 **/
      this.load.image("bread", "./assets/images/stage3/bread.png");
      this.load.image("full_bread", "./assets/images/stage3/full_bread.png");
      this.load.image("oven", "./assets/images/stage3/oven.png");
      this.load.image("oven_open", "./assets/images/stage3/oven_open.png");
    } 

    create() {
      this.hsv = Phaser.Display.Color.HSVColorWheel();

      var title = this.add.image(170, 100, 'title_menu').setOrigin(0, 0);
      this.NEW_GAME_button = this.add.text(385, 345, 'NEW GAME', { font: "30px Arial Black", fill: "#000" });
      this.CONTINUE_button = this.add.text(386, 420, 'CONTINUE', { font: "30px Arial Black", fill: "#fff" });

      // 버튼 활성화
      this.NEW_GAME_button.setInteractive();
      this.CONTINUE_button.setInteractive();

      // 색 그라데이션 넣기 위한 초석?
      this.NEW_GAME_button.setStroke('#fff', 5);
      this.NEW_GAME_button.setShadow(2, 2, "#333333", 2, true, true);
      this.CONTINUE_button.setStroke('#00f', 5);
      this.CONTINUE_button.setShadow(2, 2, "#333333", 2, true, true);

      // 틀 만들어줘서 마우스 올리고 내릴 때 색변화 주기
      var graphics = this.add.graphics();
      graphics.lineStyle(3, 0x483D8B);
      graphics.strokeRect(380, 340, 202, 50);
      graphics.strokeRect(380, 415, 202, 50);
      // 마우스 올렸을 때 색변화
      this.NEW_GAME_button.on('pointerover', function () {
        graphics.lineStyle(3, 0x00ffff);
        graphics.strokeRect(380, 340, 202, 50);
      });
      this.CONTINUE_button.on('pointerover', function () {
        graphics.lineStyle(3, 0x00ffff);
        graphics.strokeRect(380, 415, 202, 50);
      });
      // 마우스 안 올렸을 때 원래 색으로
      this.NEW_GAME_button.on('pointerout', function () {
        graphics.lineStyle(3, 0x483D8B);
        graphics.strokeRect(380, 340, 202, 50);
      });
      this.CONTINUE_button.on('pointerout', function () {
        graphics.lineStyle(3, 0x483D8B);
        graphics.strokeRect(380, 415, 202, 50);
      });

      // 클릭하면 게임 시작
      this.NEW_GAME_button.once("pointerup", function () {
        this.scene.start("bootGame");
      }, this);
      this.CONTINUE_button.once("pointerup", function () {
        this.scene.start("quiz");
      }, this);

    }

    // 색 그라데이션 계속해서 바뀜
    update() {
      const top = this.hsv[this.i].color;
      const bottom = this.hsv[359 - this.i].color;

      this.NEW_GAME_button.setTint(top, top, bottom, bottom);
      this.CONTINUE_button.setTint(top, top, bottom, bottom);

      this.i++;

      if (this.i === 360) {
        this.i = 0;
      }
    }
}