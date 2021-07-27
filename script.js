let seuVotoPara = document.querySelector('.d-1-1 span');
let titulo = document.querySelector('.d-1-2');
let infos = document.querySelector('.d-1-4');
let images = document.querySelector('.d-1-right');
let warning = document.querySelector('.d-2');
let numeros = document.querySelector('.d-1-3');
let tecla_sound = new Audio('sounds/tecla_sound.mp3');
let vote_sound = new Audio('sounds/vote_sound.mp3')


let etapaAtual = 0; //0 para vereador, 1 para prefeito
let numero = '';
let votoBranco = false;
let votos = [];
let teclado = document.querySelectorAll('.teclado--botao').forEach( item=>{
    item.addEventListener('click', clicou);
});


function comecarEtapa(){
    let etapa = etapas[etapaAtual];
    let numeroHtml = '';
    numero = '';
    votoBranco = false;

    for (let i=0; i<etapa.numeros; i++){
        if(i === 0){
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
            numeroHtml += '<div class="numero"></div>';
        }
    }
    seuVotoPara.style.display = 'none';
    titulo.innerHTML = etapa.titulo;
    infos.innerHTML = '';
    images.innerHTML = '';
    warning.style.display = 'none';
    numeros.innerHTML = numeroHtml;
}
function clicou(e){
    sound(e);
    let at = e.target.getAttribute('data-btn');
    if(at === 'BRANCO'){
        btnBranco();
    } else if(at === 'CONFIRMA'){
        confirmar(at);
    }
    let elNumero = document.querySelector('.numero.pisca');
    if(elNumero !== null && at !== 'CONFIRMA'){
        elNumero.innerHTML = at;
        numero = `${numero}${at}`;
        elNumero.classList.remove('pisca');
        if(elNumero.nextElementSibling !== null){
            elNumero.nextElementSibling.classList.add('pisca');
        } else{
            atualizaInterface();
        }
    }
}
function sound(e){
   let teclaS = e.target.getAttribute('data-btn');
   if(teclaS !== 'CONFIRMA'){
       tecla_sound.currentTime = 0;
       tecla_sound.play();
   } else if(teclaS === 'CONFIRMA'){
        confirmar();
        
   }
}
function atualizaInterface(){
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item)=>{
        if(item.numero === numero){
            return true;
        } else {
            return false
        }
    });
    if(candidato.length > 0){
        candidato = candidato[0];
        seuVotoPara.style.display = 'block';
        infos.innerHTML = `Nome: ${candidato.nome} <br/>
        Partido: ${candidato.partido} <br/>`;
        warning.style.display = 'block';
        for(let i in candidato.fotos){
            if(candidato.fotos[i].small === true){
                images.innerHTML += `<div class="d-1-image small">
                <img src="images/${candidato.fotos[i].url}" alt=""/>
                ${candidato.fotos[i].legenda}
            </div>`;
            }else {
                images.innerHTML += `<div class="d-1-image"><img src="images/${candidato.fotos[i].url}" alt=""/>${candidato.fotos[i].legenda}</div>`;
            } 
        }
    } else {
        infos.innerHTML = '<div>NÚMERO ERRADO</div><div class="aviso--grande pisca">VOTO NULO</div>'
    }
}

function corrige(){
    document.querySelector('.btn-corrige').addEventListener('click',(e)=>{
       let naruto = e.target.getAttribute('data-btn');
       if(naruto){
           comecarEtapa();
       }
    });
}

function btnBranco(e){
    /*document.querySelector('.btn-branco').addEventListener('click', (e)=>{
        let br = e.target.getAttribute('data-btn');
        console.log(br === 'BRANCO'); */
        if(numero === '' || numero){ //gambiarra
            votoBranco = true;
            numero = '';
            seuVotoPara.style.display = 'block';
            warning.style.display = 'block';
            images.innerHTML = '';
            numeros.innerHTML = '';
            infos.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>'
        }     
}

function confirmar(botao){
    
    let etapa = etapas[etapaAtual];

    let votoConfirmado = false;
    
    if(votoBranco === true){
        votoConfirmado = true;
        vote_sound.currentTime = 0;
        vote_sound.play();
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'BRANCO',
        });
    } else if(numero.length === etapa.numeros){
        votoConfirmado = true;
        vote_sound.currentTime = 0;
        vote_sound.play();
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero,
        });
    } else{
        tecla_sound.currentTime = 0;
        tecla_sound.play();
    }
    if(votoConfirmado){
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined){ 
            comecarEtapa();
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
            etapaAtual--;
            etapaAtual--;
            if(votos.length > etapas.length){
                votos.splice(etapas.length - 1);
            }
            alert(`Seu voto para ${votos[0].etapa} foi: ${votos[0].voto} e seu voto para ${votos[1].etapa} foi: ${votos[1].voto}`);
        }
    }
}


comecarEtapa();
corrige();