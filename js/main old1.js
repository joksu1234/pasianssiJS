//Luodaan korteille oma luokka
class Kortti {
    constructor(maa, arvo) {
        this.maa = maa;
        this.arvo = arvo;
        this.isFaceDown = false;
    }
}

//Muuttujia ja muita vastaavia
const korttiPakka = [];
const alaPinot = [[], [], [], [], [], [], []];
const ylaPinot = [[], [], [], []];
const varaPino = [];
const nostetutKortit = [];
let painettuKortti = null;
let korttiIndex;
let pinoIndex;
let kohdePinoIndex;
let siirtoPino;
let painettuIndex;


//Funktio joka luo tarvittavat kortit (52 kpl)
function luoKortit() {
    for (let i = 0; i < 4; i++) {
        if (i == 0) {
            for (let i = 1; i < 14; i++) {
                const uusiKortti = new Kortti("Hertta", i);
                korttiPakka.push(uusiKortti);
            }
        }
        if (i == 1) {
            for (let i = 1; i < 14; i++) {
                const uusiKortti = new Kortti("Pata", i);
                korttiPakka.push(uusiKortti);
            }
        }
        if (i == 2) {
            for (let i = 1; i < 14; i++) {
                const uusiKortti = new Kortti("Ruutu", i);
                korttiPakka.push(uusiKortti);
            }
        }
        if (i == 3) {
            for (let i = 1; i < 14; i++) {
                const uusiKortti = new Kortti("Risti", i);
                korttiPakka.push(uusiKortti);
            }
        }
    }
}

//Fuktio, jolla sekoitetaan nykyinen pakka Fisher-Yates algoritmillä
function sekoita(pakka) {
    for (let i = 51; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pakka[i], pakka[j]] = [pakka[j], pakka[i]];
    }
}

//Funktio, jolla renderöidään peli aluetta tarvittaessa
function renderGame() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";

    const maaPinot = ['hertta', 'pata', 'ruutu', 'risti'];
    maaPinot.forEach((maa) => {
        const maaPinoElementti = document.createElement('div');
        maaPinoElementti.classList.add('maa-pino')
        maaPinoElementti.id = `${maa}-pino`;
        gameBoard.appendChild(maaPinoElementti);
    });

    alaPinot.forEach((pino, pinoIndex) => {
        const pinoElementti = document.createElement("div");
        pinoElementti.classList.add("pino");
        pinoElementti.id = `pino${pinoIndex}`;

        pino.forEach((kortti, korttiIndex) => {
            const korttiElementti = luoKorttiElementti(kortti);

            if (painettuKortti && pinoIndex === painettuKortti.pinoIndex && korttiIndex === painettuKortti.korttiIndex) {
                korttiElementti.classList.add("selected");
            }
            
            /* const arvoElementti = document.createElement("div");
            arvoElementti.textContent = kortti.arvo;
            korttiElementti.appendChild(arvoElementti);

            const maaElementti = document.createElement("div");
            maaElementti.classList.add(kortti.maa);
            maaElementti.textContent = kortti.maa;
            korttiElementti.appendChild(maaElementti); */

            //klikkaus kuuntelija
            korttiElementti.addEventListener("click", () => kortinPainaus(pinoIndex, korttiIndex));

            pinoElementti.appendChild(korttiElementti);
        });

        gameBoard.appendChild(pinoElementti);
    });
}

function renderVaraPino() {
    const varaPinoElementti = document.getElementById("vara-pino");
    varaPinoElementti.innerHTML = "";

    //Näytetään vain päälimmäinen kortti
    if (varaPino.length > 0) {
        const ylinKortti = varaPino[varaPino.length - 1];
        const korttiElementti = luoKorttiElementti(ylinKortti);
        varaPinoElementti.appendChild(korttiElementti);

        korttiElementti.addEventListener("click", () => nostaKortti());
    } else {
        const tyhjaViesti = document.createElement("div");
        tyhjaViesti.textContent = "Tyhjä";
        varaPinoElementti.appendChild(tyhjaViesti);
    }
}

//Antaa korteille kuvat.
function luoKorttiElementti(kortti) {
    const korttiElementti = document.createElement("div");
    korttiElementti.classList.add("kortti");

    if (!kortti.isFaceDown) {
        const takaKuva = `url("img/back_card.png")`;
        korttiElementti.style.backgroundImage = takaKuva;
    } else {
        const etuKuva = `url("img/${kortti.maa}${kortti.arvo}.png")`;
        korttiElementti.style.backgroundImage = etuKuva;
    }
    
    /* const arvoElementti = document.createElement("div");
    arvoElementti.textContent = kortti.arvo;
    korttiElementti.appendChild(arvoElementti);

    const maaElementti = document.createElement("div");
    maaElementti.classList.add(kortti.maa.toLowerCase());
    maaElementti.textContent = kortti.maa;
    korttiElementti.appendChild(maaElementti);
 */
    return korttiElementti;
}

function nostaKortti() {
    if (varaPino.length === 0) {
        varaPino.push(...nostetutKortit);
        nostetutKortit.length = 0;
    }

    if (varaPino.length > 0) {
        const nostettuKortti = varaPino.pop(0);
        nostetutKortit.push(nostettuKortti);
        renderVaraPino();

        /* const alaPinoIndex = painettuKortti ? painettuKortti.pinoIndex : null; //Tarkistetaan, ettei painetun kortin arvo ole null
        if (alaPinoIndex !== null && tarkistaSiirto(alaPinoIndex, null, null)) {
            alaPinot[alaPinoIndex].push(nostettuKortti);
            renderVaraPino();
            renderGame();
        } */
    }
}

function painausKuuntelija() {
    const kortit = document.querySelectorAll(".kortti");

    kortit.forEach(kortti => {
        kortti.addEventListener("click", () => {
            const pinoIndex = [...kortti.parentNode.parentNode.children].indexOf(kortti.parentNode);
            const korttiIndex = [...kortti.parentNode.children].indexOf(kortti);
            kortinPainaus(pinoIndex, korttiIndex);
        });
    });

    const pinot = document.querySelectorAll(".pino");

    pinot.forEach((pino, kohdePinoIndex) => {
        pino.addEventListener("click", () => {
            pinonPainaus(kohdePinoIndex);
        });
    });
}

//Funktio, joka käsittelee korttien painamisen
function kortinPainaus(pinoIndex, korttiIndex) {
    if (painettuKortti == null) {
        painettuKortti = alaPinot[pinoIndex][korttiIndex];
        painettuIndex = alaPinot[pinoIndex];
        console.log(painettuKortti);
        renderGame();
    } else {
        kohdePinoIndex = korttiIndex;
        console.log(kohdePinoIndex)
        siirraKorttia(painettuKortti, kohdePinoIndex);
    }
}

//Fukntio, jolla liikutetaan kortteja
function siirraKorttia(painettuKortti, kohdePinoIndex) {
    const kohdePino = alaPinot[kohdePinoIndex];

    if (tarkistaSiirto(painettuKortti, kohdePinoIndex)) {
        const siirtoPino = alaPinot[pinoIndex];
        kohdePino.push(siirtoKortti);
        alaPinot.splice(korttiIndex, 1);
        
        //Tarkistetaan voidaanko kääntää kortti oikeinpäin.
        if (siirtoPino.length > 0) {
            siirtoPino[siirtoPino.length - 1].isFaceDown = true;
        }
        renderGame();
    }
}

//Funktio, joka tarkistaa onko siirto sallittu
function tarkistaSiirto(painettuKortti, kohdePinoIndex) {
    const siirtoPino = painettuKortti;
    const kohdePino = alaPinot[kohdePinoIndex];

    if (kohdePino !== null) {
        const kohdePino = alaPinot[kohdePinoIndex];
        //Tarkistaa onko pino tyhjä tai null, vain kuninkaan (13) voi laittaa tyhjään paikkaan.
        if (kohdePino.length === 0) {
            return korttiIndex !== null && siirtoPino[korttiIndex].arvo === 13;
        }
    
    
        const siirtoKortti = painettuKortti;
    
        const kohdeKortti = kohdePino[kohdePino.length - 1];
    
        const oikeaVariJarjestus = 
            siirtoKortti && (
            (siirtoKortti.maa === "Hertta" || siirtoKortti.maa === "Ruutu") &&
            (kohdeKortti.maa === "Pata" || kohdeKortti.maa === "Risti") ||
            (siirtoKortti.maa === "Pata" || siirtoKortti.maa === "Risti") &&
            (kohdeKortti.maa === "Hertta" || kohdeKortti.maa === "Ruutu")
            );
    
        const oikeaArvoJarjestus = 
            siirtoKortti && Number(siirtoKortti.arvo) + 1 === Number(kohdeKortti.arvo);
        
        return oikeaVariJarjestus && oikeaArvoJarjestus;
    }

    return true;
}

function jaaKortit() {
    alaPinot.forEach(pino => pino.length = 0);
    ylaPinot.forEach(pino => pino.length = 0);
    varaPino.length = 0;

    for (let i = 0; i < alaPinot.length; i++) {
        for (let j = 0; j <= i; j++) {
            const kortti = korttiPakka.pop();
            kortti.isFaceDown = j === i; //Vain ylin kortti on näkyvillä
            alaPinot[i].push(kortti);
        }
    }

    varaPino.push(...korttiPakka);

    varaPino.forEach(kortti => {
        kortti.isFaceDown = true;
    });

    renderGame();
}

//Alustetaan peli
luoKortit();
sekoita(korttiPakka);
renderGame();
painausKuuntelija();

jaaKortit();
renderVaraPino();

