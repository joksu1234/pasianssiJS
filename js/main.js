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
const varaPino = [];
const nostetutKortit = [];
const maaPinot = [[], [], [], []]
let korttiRyhmaIndexit = [];
let korttiRyhma = [];
let painettuKortti = null;
let painettuKorttiNosto = null;
let painettuIndex = null;
let maaPinoKortti = null;
let painettuKorttiIndex = null;
let korttiIndex;
let kortinIndex;
let pinoIndex;
let kohdePinoIndex;
let siirtoPino;
let maaIndex;
let voittoLaskuri = 0;


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

    maaPinot.forEach((maaPino, maaPinoIndex) => {
        const maaPinoElementti = document.createElement('div');
        maaPinoElementti.classList.add('maa-pino')
        maaPinoElementti.id = `maa-pino${maaPinoIndex}`;
        maaPinoElementti.addEventListener("click", () => maaPinonPainaus(maaPinoIndex));

        /* if (maaPinot[maaPinoIndex].length > 0) {
            const ylinKortti = maaPinot[maaPinoIndex][maaPinot[maaPinoIndex].length - 1];
            const korttiElementti = luoKorttiElementti(ylinKortti);
            maaPinoElementti.appendChild(korttiElementti);
        } else {
            const tyhjaKorttiElementti = document.createElement("div");
            tyhjaKorttiElementti.classList.add("kortti", "tyhja");
            tyhjaKorttiElementti.style.backgroundImage = `url("img/blank_card.png")`;
            maaPinoElementti.appendChild(tyhjaKorttiElementti);
        } */

        gameBoard.appendChild(maaPinoElementti);

        maaPino.forEach((kortti) => {
            const korttiElementti = luoKorttiElementti(kortti);
            korttiElementti.classList.add('maa-kortti');
            maaPinoElementti.appendChild(korttiElementti);
        });
    });
    
    alaPinot.forEach((pino, pinoIndex) => {
        const pinoElementti = document.createElement("div");
        pinoElementti.classList.add("pino");
        pinoElementti.id = `pino${pinoIndex}`;

        if (painettuKortti === null) {
            let valitutKortit = document.querySelectorAll(".selected");
            valitutKortit.forEach(function(element) {
                element.classList.remove("selected");
            });
        }

        if (pino.length > 0) {
            pino.forEach((kortti, korttiIndex) => {
                const korttiElementti = luoKorttiElementti(kortti);
                korttiElementti.classList.toggle("selected", painettuKortti === kortti);
                korttiElementti.addEventListener("click", () => kortinPainaus(pinoIndex, korttiIndex));
                pinoElementti.appendChild(korttiElementti);
            });
        } else {
            //Näytetään tyhjä kortti tyhjän pinon kohdalla.
            const tyhjaKorttiElementti = document.createElement("div");
            tyhjaKorttiElementti.classList.add("kortti", "tyjha");
            tyhjaKorttiElementti.style.backgroundImage = `url("img/blank_card.png")`;

            tyhjaKorttiElementti.addEventListener("click", () => kortinPainaus(pinoIndex, korttiIndex));

            pinoElementti.appendChild(tyhjaKorttiElementti);
        }

        

        gameBoard.appendChild(pinoElementti);
    });
    korttiRyhma = [];
    korttiRyhmaIndexit = [];
    renderVaraPino();
}

function renderVaraPino() {
    const gameBoard = document.getElementById("game-board");
    const varaPinoElementti = document.createElement("div");
    varaPinoElementti.setAttribute('id', 'vara-pino');
    varaPinoElementti.innerHTML = "";
    const nostoPinoElementti = document.createElement("div");
    nostoPinoElementti.setAttribute('id', 'nosto-pino');
    nostoPinoElementti.innerHTML = "";

    if (painettuKorttiNosto === null && painettuKortti === null) {
        let valitutKortit = document.querySelectorAll(".selected");
        valitutKortit.forEach(function(element) {
            element.classList.remove("selected");
        });
    }

    //Näytetään vain päälimmäinen kortti
    if (varaPino.length > 0) {
        const ylinKortti = varaPino[varaPino.length - 1];
        const korttiElementti = luoKorttiElementti(ylinKortti);
        korttiElementti.classList.add("vara-pino-kortti");
        korttiElementti.addEventListener("click", () => nostaKortti());
        varaPinoElementti.appendChild(korttiElementti);
    } else {
        const tyhjaNostoKortti = document.createElement("div");
        tyhjaNostoKortti.classList.add("kortti", "tyhja", "vara-pino-kortti");
        tyhjaNostoKortti.style.backgroundImage = `url("img/blank_card.png")`;
        tyhjaNostoKortti.addEventListener("click", () => jaaUudelleen());
        varaPinoElementti.appendChild(tyhjaNostoKortti);
    }

    for (const nostoKortti of nostetutKortit) {
        const nostettuKorttiElementti = luoKorttiElementti(nostoKortti);
        nostettuKorttiElementti.classList.toggle("selected", painettuKorttiNosto === nostoKortti);
        nostettuKorttiElementti.classList.add("nostettu-kortti");
        nostettuKorttiElementti.addEventListener("click", () => nostoPinoPainaus(nostoKortti));


        nostoPinoElementti.appendChild(nostettuKorttiElementti);
    }
    gameBoard.appendChild(varaPinoElementti);
    gameBoard.appendChild(nostoPinoElementti);
}

function nostoPinoPainaus(nostoKortti) {
    if (painettuKorttiNosto === null) {
        painettuKorttiNosto = nostetutKortit[nostetutKortit.length - 1];
        console.log(painettuKorttiNosto);
        renderGame();
    }
}

function maaPinonPainaus(kohdePinoIndex) {
    //Tarkistaa kortin siirron alapinosta maapinoon
    if (painettuKortti) {
        console.log("Type of maaPino:", typeof kohdePinoIndex);
        maaIndex = maaPinot[kohdePinoIndex];
        console.log(maaIndex);
        const siirtoPino = alaPinot[painettuIndex];
        if (painettuKortti.arvo === 1) {
            maaIndex.push(siirtoPino.pop());
            if (siirtoPino.length > 0) {
                siirtoPino[siirtoPino.length - 1].isFaceDown = true;
            }
            painettuKortti = null;
            painettuIndex = null;
            pinoIndex = null;
            korttiIndex = null;
            painettuKorttiNosto = null;
            painettuKorttiIndex = null;
            kortinIndex = null;
            maaPinoKortti = null;
            renderGame();
            return;
        }
        siirraKorttiaMaaPinoon(painettuKortti, maaIndex);
        if (siirtoPino.length > 0) {
            siirtoPino[siirtoPino.length - 1].isFaceDown = true;
        }
        painettuKortti = null;
        painettuKorttiIndex = null;
        painettuKorttiNosto = null;
        painettuIndex = null;
        pinoIndex = null;
        korttiIndex = null;
        maaIndex = null;
        kortinIndex = null;
        maaPinoKortti = null;
        renderGame();
        tarkistaVoitto();
        return;
    }

    //Tarkistaa siirron nostopinosta maapinoon
    if (painettuKorttiNosto) {
        maaIndex = maaPinot[kohdePinoIndex];
        const siirtoPino = nostetutKortit;
        if (painettuKorttiNosto.arvo === 1) {
            maaIndex.push(siirtoPino.pop());
            painettuKortti = null;
            painettuIndex = null;
            pinoIndex = null;
            korttiIndex = null;
            painettuKorttiNosto = null;
            painettuKorttiIndex = null;
            maaPinoKortti = null;
            kortinIndex = null;
            renderGame();
            return;
        }
        siirraKorttiaNostoPinostaMaaPinoon(painettuKorttiNosto, maaIndex);
        painettuKortti = null;
        painettuKorttiNosto = null;
        painettuIndex = null;
        painettuKorttiIndex = null;
        pinoIndex = null;
        korttiIndex = null;
        maaIndex = null;
        maaPinoKortti = null;
        kortinIndex = null;
        renderGame();
        tarkistaVoitto();
        return;
    } else if (!painettuKortti && !painettuKorttiNosto) {
        //Jos muita kortteja ei ole painettu, valitaan maapinon kortti.
        maaPinoKortti = maaPinot[kohdePinoIndex];
        console.log(painettuKortti);
        kortinIndex = kohdePinoIndex;
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
    if (varaPino.length > 0) {
        const ylinNostoKortti = varaPino.pop();
        ylinNostoKortti.isFaceDown = true;
        nostetutKortit.push(ylinNostoKortti);
        painettuKorttiNosto = null;
        renderGame();
    }
}

function jaaUudelleen() {
    if (varaPino.length === 0) {
        //Käännetään kortit väärinpäin
        for (let i = 0; i < nostetutKortit.length; i++) {
            nostetutKortit[i].isFaceDown = false;
        }
        //Laitetaan nostetut kortit takaisin varapinoon
        varaPino.push(...nostetutKortit.reverse());
        nostetutKortit.length = 0;
        renderGame();
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
    //Tarkistetaan onko ensimmäinen valittu kortti alaPinossa
    if (painettuKortti == null && painettuKorttiNosto == null && maaPinoKortti == null) {
        painettuKortti = alaPinot[pinoIndex][korttiIndex];
        kortinIndex = korttiIndex;
        painettuIndex = pinoIndex;
        painettuKorttiIndex = pinoIndex;
        console.log(painettuKortti);
        renderGame();
    } else {
        painettuIndex = pinoIndex
        console.log(painettuKortti)
        siirraKorttia(painettuKortti, kohdePinoIndex);
        painettuKortti = null;
        painettuIndex = null;
        kortinIndex = null;
        pinoIndex = null;
        korttiIndex = null;
        siirtoPino = null;
        painettuKorttiNosto = null;
        painettuKorttiIndex = null;
        maaPinoKortti = null;
        renderGame();
    }
}



function siirraKorttiaMaaPinoon(painettuKortti, maaIndex) {
    const siirtoPino = alaPinot[painettuIndex];

    if (tarkistaSiirtoMaaPinoon(painettuKortti, maaIndex)) {
        maaIndex.push(siirtoPino.pop());
    }
}

function siirraKorttiaNostoPinostaMaaPinoon(painettuKortti, maaIndex) {
    const siirtoKortti = nostetutKortit;

    if (tarkistaSiirtoMaaPinoon(painettuKortti, maaIndex)) {
        maaIndex.push(siirtoKortti.pop());
    }
}

//Fukntio, jolla liikutetaan kortteja
function siirraKorttia(painettuKortti, kohdePinoIndex) {
    const siirtoPino = alaPinot[painettuKorttiIndex];
    const kohdePino = alaPinot[painettuIndex];

    if (maaPinoKortti !== null) {
        const siirtoPinoMaa = maaPinot[kortinIndex];
        if (tarkistaSiirto(maaPinoKortti, kohdePinoIndex)) {
            kohdePino.push(siirtoPinoMaa.pop());
        }
        renderGame();
        return;
    }

    //Tarkistetaan onko siirrettävä kortti varapinossa vai alapinossa
    if (painettuKorttiNosto !== null) {
        const siirtoPinoNosto = nostetutKortit;
        if (kohdePino.length === 0 && painettuKorttiNosto.arvo === 13) {
            kohdePino.push(siirtoPinoNosto.pop());
        } else if (tarkistaSiirto(painettuKorttiNosto, kohdePinoIndex)) {
            kohdePino.push(siirtoPinoNosto.pop());
        }
        renderGame();
        return;
    }

    if (kohdePino.length === 0 && painettuKortti.arvo === 13) {
        for (let i = 0; i < siirtoPino.length; i++) {
            if (siirtoPino[i].isFaceDown) {
                korttiRyhmaIndexit.push(i);
            }
        }
        const indexMaarat = korttiRyhmaIndexit.length;
        for (let i = 0; i < indexMaarat; i++) {
            let siirrettavaKohde = alaPinot[painettuKorttiIndex].splice(korttiRyhmaIndexit[0], 1)[0];
            alaPinot[painettuIndex].push(siirrettavaKohde);
            
        }

        /* let siirrettavaKohde = alaPinot[painettuKorttiIndex].splice(kortinIndex, 1)[0];
        alaPinot[painettuIndex].push(siirrettavaKohde); */
        if (siirtoPino.length > 0) {
            siirtoPino[siirtoPino.length - 1].isFaceDown = true;
        }
    } else if (tarkistaSiirto(painettuKortti, kohdePinoIndex)) {
        for (let i = 0; i < siirtoPino.length; i++) {
            if (siirtoPino[i].isFaceDown && i >= kortinIndex) {
                korttiRyhmaIndexit.push(i);
            }
        }
        const indexMaarat = korttiRyhmaIndexit.length;
        for (let i = 0; i < indexMaarat; i++) {
            let siirrettavaKohde = alaPinot[painettuKorttiIndex].splice(korttiRyhmaIndexit[0], 1)[0];
            alaPinot[painettuIndex].push(siirrettavaKohde);
            
        }
        
        /* let siirrettavaKohde = alaPinot[painettuKorttiIndex].splice(kortinIndex, 1)[0];
        alaPinot[painettuIndex].push(siirrettavaKohde); */
        
        //Tarkistetaan voidaanko kääntää kortti oikeinpäin.
        if (siirtoPino.length > 0) {
            siirtoPino[siirtoPino.length - 1].isFaceDown = true;
        }

        
    } else {
        alert('Et voi siirtää korttia tuohon!');
    }
    
    

}

//Funktio, joka tarkistaa onko siirto sallittu
function tarkistaSiirto(painettuKortti) {
    const kohdePino = alaPinot[painettuIndex];
    console.log('kohdePino', kohdePino);

    if (maaPinoKortti !== null) {
        const siirtoKortti = maaPinot[kortinIndex][maaPinot[kortinIndex].length - 1];
        const kohdeKortti = kohdePino[kohdePino.length - 1];
        console.log('siirtoKortti', siirtoKortti);
        console.log('kohdeKortti', kohdeKortti);
        
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
    
    if (painettuKorttiNosto !== null) {

        
        const siirtoKortti = painettuKorttiNosto;
        const kohdeKortti = kohdePino[kohdePino.length - 1];
        console.log('siirtoKortti', siirtoKortti);
        console.log('kohdeKortti', kohdeKortti);
        
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
    
    const siirtoKortti = painettuKortti;
    console.log('siirtoKortti', siirtoKortti);

    if (kohdePino.length === 0) {
        return siirtoKortti && siirtoKortti.arvo === 13;
    }

    const maaPinoIndex = maaPinot.findIndex((maaPino) => maaPino.includes(kohdePino[0]));

    if (kohdePino !== null) {
        const kohdeKortti = kohdePino[kohdePino.length - 1];
        //Tarkistaa onko pino tyhjä tai null, vain kuninkaan (13) voi laittaa tyhjään paikkaan.
        if (kohdePino.length === 0) {
            return korttiIndex !== null && siirtoPino[korttiIndex].arvo === 13;
        }
    
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

    return false;
}

function tarkistaSiirtoMaaPinoon(siirtoKortti, kohdePino) {
    return (
        (kohdePino.length === 0 && siirtoKortti.arvo === 1) || 
        (kohdePino.length > 0 && siirtoKortti.maa === kohdePino[0].maa && siirtoKortti.arvo === kohdePino.length + 1)
    );
}

/* Funktio, joka tarkistaa onko pelaaja voittanut */
function tarkistaVoitto() {
    if (varaPino.length === 0) {
        for (let i = 0; i < 7; i++) {
            if (alaPinot[i].length === 0) {
                voittoLaskuri = voittoLaskuri + 1;
            }
        } if (voittoLaskuri === 7) {
            alert("Voitit pelin! Onneksi olkoon!");
        } else {
            voittoLaskuri = 0;
        }
    }
}

function jaaKortit() {
    alaPinot.forEach(pino => pino.length = 0);
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
        kortti.isFaceDown = false;
    });

    renderGame();
}

//Debug funktio, joka tulostaa kaikki indexit ja tallennetut arvot
function tulostaMuuttujat() {
    console.log(
        "painettuKortti = ", painettuKortti,
        "painettuKorttiNosto = ", painettuKorttiNosto,
        "painettuKorttiIndex = ", painettuKorttiIndex,
        "painettuIndex = ", painettuIndex,
        "korttiIndex = ", korttiIndex,
        "kortinIndex = ", kortinIndex,
        "kohdePinoIndex = ", kohdePinoIndex,
        "siirtoPino = ", siirtoPino,
        "pinoIndex = ", pinoIndex,
        "maaPinoKortti = ", maaPinoKortti,
        "maaIndex = ", maaIndex);
}

//Alustetaan peli
luoKortit();
sekoita(korttiPakka);
renderGame();
painausKuuntelija();

jaaKortit();

