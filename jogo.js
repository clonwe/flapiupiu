console.log('[CLONWE] Flappyupiu');

let frames = 0;
let score = 0;

const som_MORTE = new Audio();
som_MORTE.src = './efeitos/die.wav';

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const som_SCORE = new Audio();
som_SCORE.src = './efeitos/ponto.wav';

const som_Asa = new Audio();
som_Asa.src = './efeitos/wing.wav';

const sprites = new Image();
sprites.src = './sprites/sprites.png';

const bg_night = new Image();
bg_night.src = './sprites/background-night.png';

const bg_day = new Image();
bg_day.src = './sprites/background-day.png';


const numbers = [];

for(var n=0; n < 10; n++ ) {
  numbers[n] = new Image();
  numbers[n].src = './sprites/'+n+'.png';
}


const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


// [Plano de Fundo]
const planoFundoDia = {
  sprite: bg_day, 
  spriteX: 0,
  spriteY: 0,
  largura: 287,
  altura: 511,
  x: 0,
  y: canvas.height - 484,
}
const planoFundoNoite = {
  sprite: bg_night,
  spriteX: 0,
  spriteY: 0,
  largura: 287,
  altura: 511,
  x: 0,
  y: canvas.height - 484,
}

const planoDeFundo = {
  backgrounds: [planoFundoDia,planoFundoNoite] ,
  fig : Math.floor(Math.random() *2) ,

  
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      planoDeFundo.backgrounds[planoDeFundo.fig].sprite,
      planoDeFundo.backgrounds[planoDeFundo.fig].spriteX, planoDeFundo.backgrounds[planoDeFundo.fig].spriteY,
      planoDeFundo.backgrounds[planoDeFundo.fig].largura, planoDeFundo.backgrounds[planoDeFundo.fig].altura,
      planoDeFundo.backgrounds[planoDeFundo.fig].x, planoDeFundo.backgrounds[planoDeFundo.fig].y,
      planoDeFundo.backgrounds[planoDeFundo.fig].largura, planoDeFundo.backgrounds[planoDeFundo.fig].altura,
    );

    contexto.drawImage(
      planoDeFundo.backgrounds[planoDeFundo.fig].sprite,
      planoDeFundo.backgrounds[planoDeFundo.fig].spriteX, planoDeFundo.backgrounds[planoDeFundo.fig].spriteY,
      planoDeFundo.backgrounds[planoDeFundo.fig].largura, planoDeFundo.backgrounds[planoDeFundo.fig].altura,
      (planoDeFundo.backgrounds[planoDeFundo.fig].x + planoDeFundo.backgrounds[planoDeFundo.fig].largura), planoDeFundo.backgrounds[planoDeFundo.fig].y,
      planoDeFundo.backgrounds[planoDeFundo.fig].largura, planoDeFundo.backgrounds[planoDeFundo.fig].altura,
    );
  },
};

// [Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 110,
    x: 0,
    y: canvas.height - 95,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      
      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}

function fazColisao(flappyBird, chao) {

  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }

  return false;
}

function criaFlappyBird() {
  const flappyBird_red = {
    spriteX: 38,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 3.5,
  };
  const flappyBird_yellow = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 3.5,
  };
  const flappyBird_blue = {
    spriteX: 76,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 3.5,
  };

  movimentos = [
    { spriteX: 0, spriteY: 0, }, // asa pra cima
    { spriteX: 0, spriteY: 26, }, // asa no meio 
    { spriteX: 0, spriteY: 52, }, // asa pra baixo
    { spriteX: 0, spriteY: 26, }, // asa no meio 
  ];

  const flappyBird = {
    flapp : [flappyBird_red,flappyBird_yellow,flappyBird_blue],
    fig : Math.floor(Math.random() *3) ,
       
    gravidade: 0.18,
    velocidade: 0,
    
    frameAtual: 0,
    
    pula() {

    flappyBird.velocidade =  - flappyBird.flapp[flappyBird.fig].pulo;
    },

      
    atualiza() {
      if(fazColisao(flappyBird.flapp[flappyBird.fig], globais.chao)) {
        console.log('Fez colisao');
        som_HIT.play();

        setTimeout(() => {
          mudaParaTela(Telas.FIM);
        }, 100);
        return;
      }
  
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.flapp[flappyBird.fig].y = flappyBird.flapp[flappyBird.fig].y + flappyBird.velocidade;
    },
    
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      // console.log('passouOIntervalo', passouOIntervalo)

      if(passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao
      }

    },
    desenha() {
      flappyBird.atualizaOFrameAtual();
      let { spriteX, spriteY } = movimentos[flappyBird.frameAtual];
      spriteX = flappyBird.flapp[flappyBird.fig].spriteX;
//      console.log('movimentos', flappyBird.movimentos), //DEBUG

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.flapp[flappyBird.fig].largura, flappyBird.flapp[flappyBird.fig].altura, // Tamanho do recorte na sprite
        flappyBird.flapp[flappyBird.fig].x, flappyBird.flapp[flappyBird.fig].y,
        flappyBird.flapp[flappyBird.fig].largura, flappyBird.flapp[flappyBird.fig].altura,
      );
    },
    caiMorto() {
      flappyBird.atualizaOFrameAtual();
      let { spriteX, spriteY } = movimentos[flappyBird.frameAtual];
      spriteX = flappyBird.flapp[flappyBird.fig].spriteX;
      
//      console.log('CaiMorto') //DEBUG

      if (!fazColisao(flappyBird.flapp[flappyBird.fig], globais.chao)) { // Desenha Flap Caindo
        flappyBird.flapp[flappyBird.fig].y = flappyBird.flapp[flappyBird.fig].y +3; 
        contexto.drawImage(
          sprites,
          spriteX, spriteY, // Sprite X, Sprite Y
          flappyBird.flapp[flappyBird.fig].largura, flappyBird.flapp[flappyBird.fig].altura, // Tamanho do recorte na sprite
          flappyBird.flapp[flappyBird.fig].x, flappyBird.flapp[flappyBird.fig].y ,
          flappyBird.flapp[flappyBird.fig].largura, flappyBird.flapp[flappyBird.fig].altura,
        );
      }else {
        contexto.drawImage(
          sprites,
          spriteX, spriteY, // Sprite X, Sprite Y
          flappyBird.flapp[flappyBird.fig].largura, flappyBird.flapp[flappyBird.fig].altura, // Tamanho do recorte na sprite
          flappyBird.flapp[flappyBird.fig].x, flappyBird.flapp[flappyBird.fig].y ,
          flappyBird.flapp[flappyBird.fig].largura, flappyBird.flapp[flappyBird.fig].altura,
        );

      }

    }
  }
  return flappyBird;  
}


/// [mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  }
}

// [GAMEOVER]
const gameover = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      gameover.sX, gameover.sY,
      gameover.w, gameover.h,
      gameover.x, gameover.y,
      gameover.w, gameover.h
    );
  }

}

// [PLACAR]

const placar = {

  sX: 154,
  sY: 153,
  w: 187,
  h: 38,
  x: (canvas.width / 2) ,
  y: 50,
  digit: [],

   desenha() {
 
    s = score.toString();
    digit = s.split('');
   
    for ( x= 0; x < digit.length ; x++){
      contexto.drawImage(
        numbers[parseInt(digit[x])],
        placar.x + x * 20, placar.y,
      ); 
//      console.log('Desenhou o :', parseInt(digit[x]) );
     }
  
   }
}

// 
// [Moedas]
// 
const moeda = {}



// 
// [Canos]
// 

function criaCanos() {
  const canos = {
    largura: 50, // antes: 52
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 90,
    desenha() {
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
  
        const canoCeuX = par.x;
        const canoCeuY = yRandom; 

        // [Cano do Céu]
        contexto.drawImage(
          sprites, 
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
        
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom; 
        contexto.drawImage(
          sprites, 
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },

    passandoPeloCano(par) {
      if(globais.flappyBird.flapp[globais.flappyBird.fig].x == par.x) {
        return true
      }
      else return false

    },

    checkScore() {

      score = score + 1
      // toca som
      som_SCORE.play();
      console.log('Aumentou Score')
      
    } ,

    temColisaoComOFlappyBird(par) {
      
      const cabecaDoFlappy = globais.flappyBird.flapp[globais.flappyBird.fig].y;
      const peDoFlappy = globais.flappyBird.flapp[globais.flappyBird.fig].y + globais.flappyBird.flapp[globais.flappyBird.fig].altura;
     
      if(globais.flappyBird.flapp[globais.flappyBird.fig].x + globais.flappyBird.flapp[globais.flappyBird.fig].largura >= par.x) {
  
        if(cabecaDoFlappy <= par.canoCeu.y) {
          return true;
        }

        if(peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }
      return false;
    },

    pares: [],
    flag: false,

    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames) {
        console.log('Passou 100 frames');
        
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }
     
      canos.pares.forEach(function(par) {
        par.x = par.x - 2;


        if(canos.temColisaoComOFlappyBird(par)) {
          console.log('Você perdeu!');
          som_MORTE.play();
          setTimeout(() => {
            mudaParaTela(Telas.FIM);
          }, 100);
           
        }

        if(par.x + canos.largura <= 0) {  //Apaga o Cano quando sai da Tela
          canos.pares.shift();
        }

        if(canos.passandoPeloCano(par)) {
          
          if (canos.flag == false){
            canos.checkScore(); // Verifica pontuação
            canos.flag = true
          }
        }else{ 
            canos.flag = false;
        }
      });

    }
  }

  return canos;
}


// 
// [Telas]
// 
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;

  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      
      globais.chao.desenha();
      mensagemGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
    som_Asa.play();
  },
  keypress() {
    globais.flappyBird.pula();
    som_Asa.play();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    placar.desenha();
  }
};

Telas.FIM = {
flag : false,
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.caiMorto();
    gameover.desenha();
    score = 0;
    setTimeout(() => { //Flag pra retardar o menu final
      flag = true;
    }, 1000);
    
    
  },
  click() {
    if (flag) 
      mudaParaTela(Telas.INICIO);
  },
  atualiza() {

  }
};



function loop() {

  telaAtiva.desenha();
  telaAtiva.atualiza();


  frames = frames + 1;
  requestAnimationFrame(loop);
}


window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

window.addEventListener('keypress', function(e) {
  if(telaAtiva.keypress) {
    if (e.keyCode == 32)
      telaAtiva.keypress();
  }
});

mudaParaTela(Telas.INICIO);
loop();