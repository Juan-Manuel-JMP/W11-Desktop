// --- para el archivo de texto y el wordpad ---
let virtualFS = JSON.parse(localStorage.getItem('win11_fs')) || [
    { name: "Hola_Mundo!!", content: "¡Bienvenido a Windows 11!", type: "file" }
];

// --- papelera de reciclado ---
let recycleBin = JSON.parse(localStorage.getItem('win11_recycle')) || [];

// --- explorador de archivos ---
const systemFileSystem = {
    "C:\\": [
        { name: "Disco Local (C:)", type: "dir", path: "C:\\Disco Local (C:)" }
    ],
    "C:\\Dispositivos y Unidades": [
        { name: "Disco Local (C:)", type: "dir", path: "C:\\Disco Local (C:)" }
    ],
    "C:\\Disco Local (C:)": [
        { name: "Archivos de programa", type: "dir", path: "C:\\Archivos de programa" },
        { name: "Windows", type: "dir", path: "C:\\Windows" },
        { name: "Usuarios", type: "dir", path: "C:\\Usuarios" }
    ],
    "C:\\Windows": [
        { name: "System32", type: "dir", path: "C:\\Windows\\System32" },
        { name: "explorer.exe", type: "file", content: "Explorador de Windows" }
    ],
    "C:\\Windows\\System32": [
        { name: "cmd.exe", type: "file", content: "Símbolo del sistema" },
        { name: "notepad.exe", type: "file", content: "Bloc de notas" }
    ],
    "C:\\Archivos de programa": [
        { name: "VSCode", type: "dir", path: "C:\\Archivos de programa\\VSCode" },
        { name: "Google Chrome", type: "dir", path: "C:\\Archivos de programa\\Google Chrome" }
    ],
    "C:\\Archivos de programa\\VSCode": [
        { name: "Code.exe", type: "file", content: "Visual Studio Code" }
    ],
    "C:\\Archivos de programa\\Google Chrome": [
        { name: "chrome.exe", type: "file", content: "Navegador Google Chrome" }
    ],
    "C:\\Usuarios": [
        { name: "Usuario", type: "dir", path: "C:\\Usuarios\\Usuario" }
    ],
    "C:\\Usuarios\\Usuario": [
        { name: "Mis documentos", type: "dir", path: "C:\\Usuarios\\Usuario\\Mis documentos" },
        { name: "Imágenes", type: "dir", path: "C:\\Usuarios\\Usuario\\Imágenes" },
        { name: "Música", type: "dir", path: "C:\\Usuarios\\Usuario\\Música" },
        { name: "Descargas", type: "dir", path: "C:\\Usuarios\\Usuario\\Descargas" }
    ],
    "C:\\Usuarios\\Usuario\\Mis documentos": typeof virtualFS !== 'undefined' ? virtualFS : [
        { name: "Nota.txt", type: "file", content: "Hola mundo" }
    ],
    "C:\\Usuarios\\Usuario\\Imágenes": [
        { name: "wallpaper.jpg", type: "file", content: "[Imagen]" }
    ],
    "C:\\Usuarios\\Usuario\\Música": [
        { name: "cancion.mp3", type: "file", content: "[Audio]" }
    ],
    "C:\\Usuarios\\Usuario\\Descargas": [
        { name: "setup.exe", type: "file", content: "Instalador" }
    ]
};

let currentFolderPath = "C:\\Disco Local (C:)";
let highestZIndex = 10;

// funcion de navegacion para actualizar visualmente la pestaña y la ruta
function navigateExplorer(path) {
    if (systemFileSystem[path]) {
        currentFolderPath = path;
        document.getElementById("explorer-address").value = path;
        
        // actualizo el titulo de la pestaña superior
        const pathParts = path.split('\\');
        const currentFolderTitle = pathParts[pathParts.length - 1] || "Este equipo";
        document.getElementById("win11-tab-title").innerText = currentFolderTitle;

        renderExplorerGrid();
    } else {
        console.warn("Ruta no encontrada:", path);
    }
}

function navigateExplorerUp() {
    if (currentFolderPath === "C:\\" || currentFolderPath === "C:\\Dispositivos y Unidades") return;
    
    let parentPath = currentFolderPath.substring(0, currentFolderPath.lastIndexOf('\\'));
    if (parentPath === "C:") parentPath = "C:\\";
    if (parentPath === "") parentPath = "C:\\";
    
    navigateExplorer(parentPath);
}

function refreshExplorer() {
    navigateExplorer(currentFolderPath);
}

function renderExplorerGrid() {
    const grid = document.getElementById("explorer-grid");
    if (!grid) return;
    grid.innerHTML = "";

    const items = systemFileSystem[currentFolderPath] || [];

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "grid-item";
        
        // asigno los iconos según el tipo
        let iconSrc = "https://img.icons8.com/fluency/48/document.png";
        if (item.type === "dir") {
            iconSrc = "https://img.icons8.com/fluency/48/folder-invoices.png";
            if(item.name.includes("Imágenes")) iconSrc = "https://img.icons8.com/3d-fluency/94/image-gallery.png";
            if(item.name.includes("Música")) iconSrc = "https://img.icons8.com/fluency/48/windows-media-player.png";
            if(item.name.includes("Documentos")) iconSrc = "https://img.icons8.com/fluency/48/documents--v1.png";
            if(item.name.includes("Windows")) iconSrc = "https://img.icons8.com/color/48/windows-11.png";
            if(item.name.includes("Disco")) iconSrc = "https://img.icons8.com/color/48/c-drive.png";
        } else {
            if(item.name.endsWith(".exe")) iconSrc = "https://img.icons8.com/fluency/48/exe.png";
            if(item.name.endsWith(".txt")) iconSrc = "https://img.icons8.com/fluency/48/txt.png";
            if(item.name.endsWith(".jpg") || item.name.endsWith(".png")) iconSrc = "https://img.icons8.com/fluency/48/image-file.png";
        }

        div.innerHTML = `
            <img width="36" height="36" src="${iconSrc}" alt="${item.name}"/>
            <span>${item.name}</span>
        `;

        div.onclick = () => {
            document.querySelectorAll(".grid-item").forEach(el => el.classList.remove("selected"));
            div.classList.add("selected");
        };

        if (item.type === "dir") {
            div.ondblclick = () => {
                navigateExplorer(item.path);
            };
        }

        grid.appendChild(div);
    });
}

// inicializo la primera vista al cargar
document.addEventListener("DOMContentLoaded", () => {
    navigateExplorer("C:\\Disco Local (C:)");
});

// --- inicio general ---
document.addEventListener('DOMContentLoaded', () => {
    updateClockAndDate();
    setInterval(updateClockAndDate, 1000);
    renderFS();
    renderRecycleBin();
    renderExplorerFolder("C:\\");
    initWordPad();
    initPaint();
    initVscode();
    initSolitaire();
    initChess();
    initMusicPlayer();

    // cargar fondo de pantalla por defecto
    const wallpaperSelect = document.getElementById("wallpaper-select");
    changePresetWallpaper("./img/win11.jpg");
    if (wallpaperSelect) {
        wallpaperSelect.value = "./img/win11.jpg";
    }

    // cierro menu al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.desktop-icon') && !e.target.closest('.grid-item')) {
            document.querySelectorAll('.desktop-icon, .grid-item').forEach(el => el.classList.remove('selected'));
        }
        if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
            document.getElementById('start-menu').classList.remove('open');
        }
        document.getElementById('desktop-context-menu').style.display = 'none';
    });

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const menu = document.getElementById('desktop-context-menu');
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.style.display = 'block';
    });
});

/* --- reloj y fecha --- */
function updateClockAndDate() {
    const now = new Date();
    document.getElementById('clock-time').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clock-date').innerText = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function selectDesktopIcon(el) {
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    el.classList.add('selected');
}

function toggleStartMenu() {
    document.getElementById('start-menu').classList.toggle('open');
}

/* --- gestion de ventanas --- */
function openApp(id) {
    const win = document.getElementById(`win-${id}`);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    }
}

function closeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

function minimizeWindow(id) {
    document.getElementById(id).style.display = 'none';
}

function toggleMaximize(id) {
    document.getElementById(id).classList.toggle('maximized');
}

function bringToFront(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
}

/* --- apagado y reinicio --- */
function shutdownPC() {
    const screenOff = document.getElementById('screen-off');
    const text = document.getElementById('screen-off-text');
    const powerBtn = document.getElementById('power-on-btn');

    sessionStorage.removeItem('logueado');  
    screenOff.style.display = 'flex';
    text.innerText = 'Apagando...';
    powerBtn.style.display = 'none';

    setTimeout(() => {
        text.innerText = 'El equipo está apagado.';
        powerBtn.style.display = 'inline-block';
    }, 2000);
}

function restartPC() {
    const screenOff = document.getElementById('screen-off');
    const text = document.getElementById('screen-off-text');
    const powerBtn = document.getElementById('power-on-btn');

    sessionStorage.removeItem('logueado'); 
    screenOff.style.display = 'flex';
    text.innerText = 'Reiniciando...';
    powerBtn.style.display = 'none';

    setTimeout(() => {
        location.href = 'iniciow11.html';   
    }, 2500);
}

function powerOnPC() {
    location.href = 'iniciow11.html';   
}

/* --- arrastre de ventanas drag and drop --- */
let currentDragWin = null, dragX = 0, dragY = 0;

function dragStart(e, id) {
    currentDragWin = document.getElementById(id);
    bringToFront(currentDragWin);
    dragX = e.clientX - currentDragWin.offsetLeft;
    dragY = e.clientY - currentDragWin.offsetTop;
    document.addEventListener('mousemove', dragging);
    document.addEventListener('mouseup', dragEnd);
}

function dragging(e) {
    if (currentDragWin) {
        currentDragWin.style.left = `${e.clientX - dragX}px`;
        currentDragWin.style.top = `${e.clientY - dragY}px`;
    }
}

function dragEnd() {
    currentDragWin = null;
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', dragEnd);
}

/* --- vs code --- */
const vscProject = {
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- tarjeta contenedora principal -->
  <div class="card">
    <h1>Hola Mundo!</h1>
    <p>Presiona el botón para interactuar:</p>
    <button onclick="saludar()">Ver Saludo</button>
    <h2 id="msg"></h2>
  </div>
  <script src="script.js"></script>
</body>
</html>`,

css: `/* estilos */
body { 
  font-family: 'Segoe UI', sans-serif; 
  text-align: center; 
  padding: 40px; 
  background: #4e83b8;
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 75vh; 
  margin: 0; 
}

/* tarjeta */
.card { 
  background: #ffffff; 
  padding: 40px; 
  border-radius: 12px; 
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); 
  max-width: 400px; 
  width: 100%; 
}

/* título principal */
h1 { 
  color: #0078d4; 
  font-size: 24px; 
  margin-bottom: 10px; 
}

/* parrafo */
p { 
  color: #8f1111; 
  margin-bottom: 24px; 
}

/* boton */
button { 
  padding: 10px 20px; 
  background: #c6d400; 
  color: white; 
  border: none; 
  border-radius: 6px; 
  cursor: pointer; 
  font-weight: 600; 
  transition: background 0.2s; 
}

/* hover en el boton */
button:hover { 
  background: #106ebe; 
}

/* mensaje */
#msg { 
  margin-top: 20px; 
  color: #0c18c0; 
  font-size: 18px; 
}`,

js: `/* funcion saludar */
function saludar() {
  document.getElementById('msg').innerText = 'Bienvenidos Compañero/as del IFTS N°4!';
}`
};

let currentVscTab = 'html';

function initVscode() {
    const editor = document.getElementById('vscode-code-editor');
    if (editor) {
        editor.value = vscProject['html'];
        runVscodeLiveWeb();
    }
}

function switchVscTab(tab) {
    vscProject[currentVscTab] = document.getElementById('vscode-code-editor').value;
    currentVscTab = tab;
    document.getElementById('vscode-code-editor').value = vscProject[tab];
    document.getElementById('vsc-tab-title').innerText = `${tab === 'html' ? 'index.html' : tab === 'css' ? 'style.css' : 'app.js'}`;

    document.querySelectorAll('.vsc-file').forEach(el => {
        el.classList.toggle('active', el.innerText.toLowerCase().includes(tab));
    });
}

function runVscodeLiveWeb() {
    vscProject[currentVscTab] = document.getElementById('vscode-code-editor').value;
    const fullCode = `
        ${vscProject.html}
        <style>${vscProject.css}</style>
        <script>${vscProject.js}<\/script>
    `;
    const iframe = document.getElementById('vscode-live-preview');
    if (iframe) iframe.srcdoc = fullCode;
}

/* --- solitario --- */
let solDeck = [];
let solWaste = [];
let solFoundations = [[], [], [], []];
let solTableau = [[], [], [], [], [], [], []];
let solSel = null;                       
let solMoves = 0;
let solLast = { key: '', time: 0 };
const SOL_CARD_H = 112;
const SOL_DOWN = 10;
const SOL_UP = 26;
const SOL_AVAIL = 290;

function initSolitaire() {
    const suits = ['♠', '♥', '♣', '♦'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    solDeck = [];
    solWaste = [];
    solFoundations = [[], [], [], []];
    solTableau = [[], [], [], [], [], [], []];
    solSel = null;
    solMoves = 0;

    suits.forEach(s => {
        values.forEach((v, idx) => {
            solDeck.push({
                suit: s,
                value: v,
                num: idx + 1,
                isRed: s === '♥' || s === '♦',
                faceUp: false
            });
        });
    });

    // para barajar
    for (let i = solDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [solDeck[i], solDeck[j]] = [solDeck[j], solDeck[i]];
    }

    // para repartir columna i recibe i+1 cartas, la ultima boca arriba
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = solDeck.pop();
            card.faceUp = (j === i);
            solTableau[i].push(card);
        }
    }
    renderSolitaire();
}

/* ---------- renderizado ---------- */
function renderSolitaire() {
    // Stock
    const stock = document.getElementById('sol-stock');
    if (stock) {
        stock.innerHTML = '';
        if (solDeck.length > 0) {
            const back = document.createElement('div');
            back.className = 'sol-card back';
            stock.appendChild(back);
        } else {
            stock.innerText = '↻';
        }
        stock.onclick = drawSolitaireStock;
    }

    // residuos cartas
    const wasteElem = document.getElementById('sol-waste');
    if (wasteElem) {
        wasteElem.innerHTML = '';
        const drawN = getDrawCount();
        const visible = solWaste.slice(-drawN);
        visible.forEach((card, i) => {
            const isTop = (i === visible.length - 1);
            const selected = isTop && solSel && solSel.source === 'waste';
            const el = createCardElem(card, selected, isTop ? () => onSolCardClick('waste', 0, solWaste.length - 1) : null);
            el.style.left = `${-2 + i * 18}px`;
            wasteElem.appendChild(el);
        });
    }

    for (let i = 0; i < 4; i++) {
        const foundElem = document.getElementById(`sol-found-${i}`);
        if (!foundElem) continue;
        foundElem.innerHTML = '';
        foundElem.onclick = () => onSolFoundationSlotClick(i);

        const pile = solFoundations[i];
        if (pile.length > 0) {
            const top = pile[pile.length - 1];
            const selected = solSel && solSel.source === 'foundation' && solSel.col === i;
            foundElem.appendChild(createCardElem(top, selected, () => onSolCardClick('foundation', i, pile.length - 1)));
        } else {
            foundElem.innerText = 'A';
        }
    }

    const tabElem = document.getElementById('solitaire-tableau');
    if (tabElem) {
        tabElem.innerHTML = '';
        solTableau.forEach((col, colIdx) => {
            const colDiv = document.createElement('div');
            colDiv.className = 'sol-col';

            
            colDiv.onclick = () => {
                if (solSel && tryMoveToTableau(colIdx)) finishMove();
            };

            const downN = col.filter(c => !c.faceUp).length;
            const upN = col.length - downN;
            let down = SOL_DOWN, up = SOL_UP;
            const needed = downN * down + Math.max(upN - 1, 0) * up;
            if (needed > SOL_AVAIL) {
                const f = SOL_AVAIL / needed;
                down *= f; up *= f;
            }

            let top = 0;
            col.forEach((card, cardIdx) => {
                const selected = solSel && solSel.source === 'tableau' &&
                                 solSel.col === colIdx && cardIdx >= solSel.index;
                const el = createCardElem(card, selected, () => onSolCardClick('tableau', colIdx, cardIdx));
                el.style.top = `${top}px`;
                colDiv.appendChild(el);
                if (cardIdx < col.length - 1) top += card.faceUp ? up : down;
            });
            colDiv.style.height = `${(col.length ? top : 0) + SOL_CARD_H}px`;

            tabElem.appendChild(colDiv);
        });
    }

    const status = document.getElementById('sol-status');
    if (status) {
        status.innerText = isSolitaireWon()
            ? `🎉 ¡Ganaste en ${solMoves} movimientos!`
            : `Movimientos: ${solMoves}`;
    }
}

function createCardElem(card, selected, clickFn) {
    const div = document.createElement('div');
    if (!card.faceUp) {
        div.className = 'sol-card back';
    } else {
        div.className = `sol-card ${card.isRed ? 'red' : ''}`;
        div.innerHTML = `<div class="c-top">${card.value}${card.suit}</div><div class="c-mid">${card.suit}</div>`;
        if (selected) div.classList.add('selected-card');
    }
    if (clickFn) {
        div.onclick = (e) => {
            e.stopPropagation();
            clickFn();
        };
    }
    return div;
}

function getDrawCount() {
    const sel = document.getElementById('sol-draw-mode');
    return sel ? parseInt(sel.value, 10) : 1;
}

/* ---------- mazo ---------- */
function drawSolitaireStock() {
    solSel = null;
    if (solDeck.length > 0) {
        const n = getDrawCount();
        for (let i = 0; i < n && solDeck.length > 0; i++) {
            const card = solDeck.pop();
            card.faceUp = true;
            solWaste.push(card);
        }
    } else {
        // reciclado del descarte conservando el orden original
        while (solWaste.length > 0) {
            const card = solWaste.pop();
            card.faceUp = false;
            solDeck.push(card);
        }
    }
    renderSolitaire();
}

/* ---------- selección y clicks ---------- */
function getSolCard(source, col, index) {
    if (source === 'tableau') return solTableau[col][index];
    if (source === 'waste') return solWaste[solWaste.length - 1];
    if (source === 'foundation') return solFoundations[col][solFoundations[col].length - 1];
    return null;
}

function getSelectedCards() {
    if (!solSel) return [];
    const { source, col, index } = solSel;
    if (source === 'tableau') return solTableau[col].slice(index);
    const c = getSolCard(source, col, index);
    return c ? [c] : [];
}

function onSolCardClick(source, col, index) {
    const card = getSolCard(source, col, index);
    if (!card || !card.faceUp) return;

    
    const now = Date.now();
    const key = `${source}-${col}-${index}`;
    const isDouble = solLast.key === key && now - solLast.time < 350;
    solLast = { key, time: now };

    if (isDouble) {
        solSel = { source, col, index };
        if (source !== 'foundation' && getSelectedCards().length === 1) {
            for (let f = 0; f < 4; f++) {
                if (tryMoveToFoundation(f)) { finishMove(); return; }
            }
        }
        solSel = null;
        renderSolitaire();
        return;
    }

    if (solSel) {
  
        if (solSel.source === source && solSel.col === col && solSel.index === index) {
            solSel = null;
            renderSolitaire();
            return;
        }
        // Intentar mover lo seleccionado hacia donde se hizo clic
        let moved = false;
        if (source === 'tableau') moved = tryMoveToTableau(col);
        else if (source === 'foundation') moved = tryMoveToFoundation(col);
        if (moved) { finishMove(); return; }
    }


    solSel = { source, col, index };
    renderSolitaire();
}

function onSolFoundationSlotClick(i) {
    if (solSel && tryMoveToFoundation(i)) finishMove();
}

/* ---------- movimientos ---------- */
function tryMoveToTableau(targetIdx) {
    const cards = getSelectedCards();
    if (cards.length === 0) return false;
    if (solSel.source === 'tableau' && solSel.col === targetIdx) return false;

    const first = cards[0];
    const target = solTableau[targetIdx];
    const top = target[target.length - 1];

    const valid = top
        ? (top.faceUp && top.isRed !== first.isRed && top.num === first.num + 1)
        : first.num === 13; 

    if (!valid) return false;

    removeSelectedFromSource();
    target.push(...cards);
    return true;
}

function tryMoveToFoundation(fIdx) {
    const cards = getSelectedCards();
    if (cards.length !== 1) return false;         
    if (solSel.source === 'foundation') return false;

    const card = cards[0];
    const pile = solFoundations[fIdx];
    const top = pile[pile.length - 1];

    const valid = top
        ? (top.suit === card.suit && top.num + 1 === card.num)
        : card.num === 1;                          

    if (!valid) return false;

    removeSelectedFromSource();
    pile.push(card);
    return true;
}

function removeSelectedFromSource() {
    const { source, col, index } = solSel;
    if (source === 'waste') {
        solWaste.pop();
    } else if (source === 'foundation') {
        solFoundations[col].pop();
    } else if (source === 'tableau') {
        const column = solTableau[col];
        column.splice(index);                      
        if (column.length > 0) column[column.length - 1].faceUp = true;
    }
}

function finishMove() {
    solSel = null;
    solMoves++;
    renderSolitaire();
}

function isSolitaireWon() {
    return solFoundations.every(f => f.length === 13);
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSolitaire);
} else {
    initSolitaire();
}

/* --- ajedrez --- */
const initialBoard = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖']
];
let selectedPiece = null;

function initChess() {
    const boardElem = document.getElementById('chess-board');
    if (!boardElem) return;
    boardElem.innerHTML = '';
    selectedPiece = null;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            const isWhite = (r + c) % 2 === 0;
            cell.className = `chess-cell ${isWhite ? 'white' : 'black'}`;
            cell.innerText = initialBoard[r][c];

            cell.onclick = () => {
                if (selectedPiece) {
                    cell.innerText = selectedPiece.innerText;
                    selectedPiece.innerText = '';
                    selectedPiece.classList.remove('selected');
                    selectedPiece = null;
                } else if (cell.innerText !== '') {
                    selectedPiece = cell;
                    cell.classList.add('selected');
                }
            };
            boardElem.appendChild(cell);
        }
    }
}

/* --- eplorador de archivos --- */
function saveFS() {
    localStorage.setItem('win11_fs', JSON.stringify(virtualFS));
    localStorage.setItem('win11_recycle', JSON.stringify(recycleBin));
    systemFileSystem["C:\\Usuarios\\Usuario\\Mis documentos"] = virtualFS;
    renderFS();
    renderRecycleBin();
    renderExplorerFolder(currentFolderPath);
}

function renderFS() {
    const list = document.getElementById('file-list');
    if (!list) return;
    list.innerHTML = '';
    if (virtualFS.length === 0) {
        list.innerHTML = '<div style="color:#666;">Carpeta vacía.</div>';
        return;
    }
    virtualFS.forEach((file, idx) => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.innerHTML = `
            <div style="font-size:28px;">${file.type === 'img' ? '🖼️' : '📄'}</div>
            <div>${file.name}</div>
            <button onclick="event.stopPropagation(); moveToRecycleBin(${idx})">🗑️ Borrar</button>
        `;
        item.onclick = () => {
            document.querySelectorAll('#file-list .grid-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
        };
        item.ondblclick = () => openFile(file);
        list.appendChild(item);
    });
}

function renderRecycleBin() {
    const list = document.getElementById('recycle-list');
    if (!list) return;
    list.innerHTML = '';
    if (recycleBin.length === 0) {
        list.innerHTML = '<div style="color:#666;">La papelera está vacía.</div>';
        return;
    }
    recycleBin.forEach((file, idx) => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        item.innerHTML = `
            <div style="font-size:28px;">${file.type === 'img' ? '🖼️' : '📄'}</div>
            <div>${file.name}</div>
            <button onclick="event.stopPropagation(); restoreFromFile(${idx})">↩️ Restaurar</button>
        `;
        list.appendChild(item);
    });
}

function moveToRecycleBin(index) {
    const file = virtualFS.splice(index, 1)[0];
    recycleBin.push(file);
    saveFS();
}

function restoreFromFile(index) {
    const file = recycleBin.splice(index, 1)[0];
    virtualFS.push(file);
    saveFS();
}

function emptyRecycleBin() {
    if (recycleBin.length === 0) return;
    if (confirm('¿Deseas eliminar permanentemente los archivos de la papelera?')) {
        recycleBin = [];
        saveFS();
    }
}

function navigateExplorer(path) {
    renderExplorerFolder(path);
}

function renderExplorerFolder(path) {
    currentFolderPath = path;
    const addr = document.getElementById('explorer-address');
    if (addr) addr.value = path;
    const grid = document.getElementById('explorer-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const items = systemFileSystem[path] || [];
    if (items.length === 0) {
        grid.innerHTML = '<div style="color:#888;">Carpeta vacía.</div>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `<div style="font-size:28px;">${item.type === 'dir' ? '📁' : '📄'}</div><div>${item.name}</div>`;
        div.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('#explorer-grid .grid-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
        };
        div.ondblclick = () => {
            if (item.type === 'dir') renderExplorerFolder(item.path);
            else openFile(item);
        };
        grid.appendChild(div);
    });
}

function navigateExplorerUp() {
    if (currentFolderPath === "C:\\") return;
    renderExplorerFolder("C:\\");
}

function createNewFilePrompt() {
    const name = prompt('Nombre del archivo:', 'Nuevo_Documento.txt');
    if (name) {
        virtualFS.push({ name, content: '', type: 'file' });
        saveFS();
    }
}

function openFile(file) {
    if (file.type === 'img') {
        document.getElementById('photo-viewer-title').innerText = `🖼️ Visor de Fotos - ${file.name}`;
        document.getElementById('photo-viewer-img').src = file.content;
        openApp('photoviewer');
    } else {
        document.getElementById('doc-filename').value = file.name;
        document.getElementById('wordpad-editor').innerHTML = file.content;
        openApp('wordpad');
    }
}

// --- wordpad ---
let savedSelection = null;
let wpDirty = false;
let wpPendingPt = null;
let wpZoom = 100;
const WP_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

const wpEditor = () => document.getElementById('wordpad-editor');
const wpEsc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function saveWordpadSelection() {
    const ed = wpEditor();
    const sel = window.getSelection();
    if (ed && sel.rangeCount && ed.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        savedSelection = sel.getRangeAt(0).cloneRange();
    }
}

function restoreWordpadSelection() {
    const ed = wpEditor();
    if (!ed) return;
    ed.focus({ preventScroll: true });
    if (savedSelection && ed.contains(savedSelection.commonAncestorContainer)) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedSelection);
    }
}

/* ---------- formato ---------- */
function applyWordpadStyle(cmd, val = null) {
    restoreWordpadSelection();
    document.execCommand('styleWithCSS', false, true);
    document.execCommand(cmd, false, val);
    afterWordpadChange();
}

function applyWordpadHighlight(color) {
    restoreWordpadSelection();
    document.execCommand('styleWithCSS', false, true);
    if (!document.execCommand('hiliteColor', false, color)) {
        document.execCommand('backColor', false, color);
    }
    afterWordpadChange();
}

function afterWordpadChange() {
    saveWordpadSelection();
    updateWordpadToolbar();
    updateWordpadStats();
    wpMarkDirty();
}

function setWordpadFontSize(pt) {
    pt = parseFloat(pt);
    if (!pt || pt < 1 || pt > 400) return;
    wpPendingPt = pt;
    restoreWordpadSelection();
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('fontSize', false, '7');
    document.execCommand('styleWithCSS', false, true);
    fixWordpadFontTags();
    afterWordpadChange();
}

function fixWordpadFontTags() {
    const ed = wpEditor();
    if (!ed || wpPendingPt == null) return;
    const tags = ed.querySelectorAll('font[size="7"]');
    tags.forEach(f => {
        f.removeAttribute('size');
        f.style.fontSize = wpPendingPt + 'pt';
        f.querySelectorAll('[style*="font-size"]').forEach(e => e.style.fontSize = '');
    });
    if (tags.length) wpPendingPt = null;
}

function stepWordpadFontSize(dir) {
    const input = document.getElementById('word-font-size');
    if (!input) return;
    const cur = parseFloat(input.value) || 12;
    let next;
    if (dir > 0) next = WP_SIZES.find(s => s > cur) || cur + 8;
    else next = [...WP_SIZES].reverse().find(s => s < cur) || Math.max(1, cur - 1);
    input.value = next;
    setWordpadFontSize(next);
}

function setWordpadLineSpacing(v) {
    restoreWordpadSelection();
    const ed = wpEditor();
    const sel = window.getSelection();
    if (!sel.rangeCount) return;
    const r = sel.getRangeAt(0);
    Array.from(ed.children).forEach(b => {
        if (r.intersectsNode(b)) b.style.lineHeight = v;
    });
    afterWordpadChange();
}

function updateWordpadToolbar() {
    document.querySelectorAll('#win-wordpad [data-cmd]').forEach(b => {
        let on = false;
        try { on = document.queryCommandState(b.dataset.cmd); } catch (e) {}
        b.classList.toggle('active', !!on);
    });

    const famSel = document.getElementById('word-font-family');
    if (famSel && document.activeElement !== famSel) {
        let fam = '';
        try { fam = document.queryCommandValue('fontName') || ''; } catch (e) {}
        fam = fam.replace(/["']/g, '').split(',')[0].trim();
        if ([...famSel.options].some(o => o.value === fam)) famSel.value = fam;
    }

    const sizeInput = document.getElementById('word-font-size');
    const sel = window.getSelection();
    if (sizeInput && document.activeElement !== sizeInput && sel.rangeCount) {
        let n = sel.anchorNode;
        if (n && n.nodeType === 3) n = n.parentElement;
        if (n && wpEditor().contains(n)) {
            const px = parseFloat(getComputedStyle(n).fontSize);
            if (px) sizeInput.value = Math.round(px * 0.75 * 2) / 2;
        }
    }
}

function normalizeWordpad() {
    const ed = wpEditor();
    const blocks = /^(P|DIV|UL|OL|H[1-6]|BLOCKQUOTE|TABLE|PRE|HR)$/;
    let cur = null;
    Array.from(ed.childNodes).forEach(n => {
        if (n.nodeType === 3 && !n.data.trim()) { n.remove(); return; }
        if (n.nodeType === 1 && blocks.test(n.tagName)) { cur = null; return; }
        if (!cur) { cur = document.createElement('p'); ed.insertBefore(cur, n); }
        cur.appendChild(n);
    });
    if (!ed.firstChild) ed.innerHTML = '<p><br></p>';
}

function wpSanitize(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,iframe,object,embed,link,meta,style,base,form').forEach(e => e.remove());
    doc.body.querySelectorAll('*').forEach(el => {
        [...el.attributes].forEach(a => {
            const n = a.name.toLowerCase();
            if (n.startsWith('on') || ((n === 'href' || n === 'src') && /^\s*javascript:/i.test(a.value))) {
                el.removeAttribute(a.name);
            }
        });
    });
    return doc.body.innerHTML;
}

function wpLoadContent(raw) {
    let html = raw || '';
    if (!/<[a-z!][\s\S]*>/i.test(html)) {
        html = wpEsc(html).split(/\r?\n/).map(l => `<p>${l || '<br>'}</p>`).join('');
    }
    wpEditor().innerHTML = wpSanitize(html);
    normalizeWordpad();
}

function updateWordpadStats() {
    const editor = wpEditor();
    if (!editor) return;
    const text = editor.innerText.trim();
    const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
    const chars = text.length;
    const statsElem = document.getElementById('wordpad-stats');
    if (statsElem) statsElem.innerText = `Palabras: ${words} | Caracteres: ${chars}`;
}

function setWordpadState(text) {
    const el = document.getElementById('wordpad-saved-state');
    if (el) el.innerText = text || '';
}

function wpMarkDirty() {
    wpDirty = true;
    setWordpadState('● Sin guardar');
}

function wpConfirmDiscard() {
    return !wpDirty || confirm('Hay cambios sin guardar. ¿Deseas continuar?');
}

/* ---------- archivo ---------- */
function newWordpadDoc() {
    if (!wpConfirmDiscard()) return;
    const editor = wpEditor();
    editor.innerHTML = '<p><br></p>';
    document.getElementById('doc-filename').value = 'Documento.txt';
    wpDirty = false;
    setWordpadState('');
    editor.focus();
    updateWordpadStats();
}

function saveDocument(asNew = false) {
    if (typeof virtualFS === 'undefined') { alert('No se encontró el sistema de archivos virtual.'); return; }
    const input = document.getElementById('doc-filename');
    let name = input.value.trim() || 'Documento.txt';

    if (asNew === true) {
        const n = prompt('Guardar como:', name);
        if (!n || !n.trim()) return;
        name = n.trim();
        input.value = name;
    }

    const existing = virtualFS.findIndex(f => f.name === name);
    if (asNew === true && existing >= 0 && !confirm(`"${name}" ya existe. ¿Deseas reemplazarlo?`)) return;

    const fileObj = { name, content: wpEditor().innerHTML, type: 'file' };
    if (existing >= 0) virtualFS[existing] = fileObj;
    else virtualFS.push(fileObj);
    if (typeof saveFS === 'function') saveFS();

    wpDirty = false;
    setWordpadState(`✔ Guardado ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
}

function openWordpadFile(name) {
    const f = (typeof virtualFS !== 'undefined') && virtualFS.find(x => x.name === name);
    if (!f) return;
    wpLoadContent(f.content);
    document.getElementById('doc-filename').value = name;
    wpDirty = false;
    setWordpadState('');
    wpEditor().focus();
    updateWordpadStats();
}

function openWordpadDialog() {
    if (typeof virtualFS === 'undefined') { alert('No se encontró el sistema de archivos virtual.'); return; }
    const files = virtualFS.filter(f => f.type === 'file');
    const body = document.createElement('div');
    body.className = 'wp-filelist';
    if (!files.length) body.textContent = 'No hay documentos guardados.';
    files.forEach(f => {
        const d = document.createElement('div');
        d.className = 'wp-file';
        d.textContent = '📄 ' + f.name;
        d.onclick = () => {
            if (!wpConfirmDiscard()) return;
            wpCloseDialog();
            openWordpadFile(f.name);
        };
        body.appendChild(d);
    });
    wpShowDialog('Abrir documento', body);
}

function printWordpadDoc() {
    const name = document.getElementById('doc-filename').value;
    const f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(f);
    const d = f.contentWindow.document;
    d.open();
    d.write(`<!doctype html><html><head><meta charset="utf-8"><title>${wpEsc(name)}</title>
        <style>body{font-family:'Segoe UI',sans-serif;font-size:12pt;line-height:1.5;margin:2cm}</style></head><body>${wpEditor().innerHTML}</body></html>`);
    d.close();
    setTimeout(() => {
        f.contentWindow.focus();
        f.contentWindow.print();
        setTimeout(() => f.remove(), 1500);
    }, 300);
}

/* ---------- portapapeles e insercion ---------- */
async function pasteWordpad() {
    restoreWordpadSelection();
    try {
        const t = await navigator.clipboard.readText();
        if (t) document.execCommand('insertText', false, t);
        afterWordpadChange();
    } catch (e) {
        alert('Ctrl+V para pegar.');
    }
}

function insertWordpadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => applyWordpadStyle('insertImage', evt.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
}

function insertWordpadDate() {
    const now = new Date();
    const loc = navigator.language || 'es-ES';
    const formats = [
        now.toLocaleDateString(loc),
        now.toLocaleDateString(loc, { dateStyle: 'long' }),
        now.toLocaleTimeString(loc, { timeStyle: 'short' })
    ];
    const body = document.createElement('div');
    body.className = 'wp-filelist';
    formats.forEach(f => {
        const d = document.createElement('div');
        d.className = 'wp-file';
        d.textContent = f;
        d.onclick = () => { wpCloseDialog(); applyWordpadStyle('insertText', f); };
        body.appendChild(d);
    });
    wpShowDialog('Fecha y hora', body);
}

/* ---------- dialogos y zoom---------- */
function wpShowDialog(title, bodyEl, buttons = [{ label: 'Cancelar' }]) {
    document.getElementById('wp-dialog-title').textContent = title;
    const body = document.getElementById('wp-dialog-body');
    body.innerHTML = '';
    body.appendChild(bodyEl);
    const act = document.getElementById('wp-dialog-actions');
    act.innerHTML = '';
    buttons.forEach(b => {
        const btn = document.createElement('button');
        btn.className = 'win-btn';
        btn.textContent = b.label;
        btn.onclick = () => { wpCloseDialog(); if (b.fn) b.fn(); };
        act.appendChild(btn);
    });
    document.getElementById('wp-overlay').style.display = 'flex';
}

function wpCloseDialog() {
    const o = document.getElementById('wp-overlay');
    if (o) o.style.display = 'none';
}

function setWordpadZoom(z) {
    wpZoom = Math.min(200, Math.max(50, Math.round(z)));
    const wrap = document.getElementById('wordpad-zoomwrap');
    const range = document.getElementById('wordpad-zoom');
    const label = document.getElementById('wordpad-zoom-label');
    
    if (wrap) wrap.style.zoom = wpZoom / 100;
    if (range) range.value = wpZoom;
    if (label) label.innerText = wpZoom + '%';
}

/* ---------- busqueda y reemplazo ---------- */
function toggleWordpadFind(show, focusReplace = false) {
    const bar = document.getElementById('wordpad-findbar');
    const find = document.getElementById('wp-find-input');
    const rep = document.getElementById('wp-replace-input');
    bar.style.display = show ? 'flex' : 'none';
    if (show) {
        const t = savedSelection ? savedSelection.toString() : '';
        if (t && !t.includes('\n') && t.length < 100) find.value = t;
        document.getElementById('wp-find-msg').innerText = '';
        (focusReplace ? rep : find).focus();
    } else {
        restoreWordpadSelection();
    }
}

function wpFindMsg(t) {
    document.getElementById('wp-find-msg').innerText = t || '';
}

function wpTextIndex(ed, container, offset) {
    const r = document.createRange();
    r.selectNodeContents(ed);
    r.setEnd(container, offset);
    return r.toString().length;
}

function wpSelectRange(ed, start, end) {
    const w = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT);
    let pos = 0, n, sN = null, sO = 0, eN = null, eO = 0;
    while ((n = w.nextNode())) {
        const len = n.data.length;
        if (!len) continue;
        if (!sN && start < pos + len) { sN = n; sO = start - pos; }
        if (!eN && end <= pos + len) { eN = n; eO = end - pos; }
        pos += len;
        if (sN && eN) break;
    }
    if (!sN || !eN) return;
    const r = document.createRange();
    r.setStart(sN, sO);
    r.setEnd(eN, eO);
    ed.focus({ preventScroll: true });
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    if (sN.parentElement) sN.parentElement.scrollIntoView({ block: 'center' });
}

function wordpadFind(backwards = false, wrap = true) {
    const ed = wpEditor();
    const term = document.getElementById('wp-find-input').value;
    if (!term) { wpFindMsg('Escribe algo que buscar'); return false; }

    const full = document.createRange();
    full.selectNodeContents(ed);
    const text = full.toString();
    const hay = text.toLowerCase();
    const needle = term.toLowerCase();

    let from = 0;
    const sel = window.getSelection();
    let r = null;
    if (sel.rangeCount && ed.contains(sel.getRangeAt(0).commonAncestorContainer)) r = sel.getRangeAt(0);
    else if (savedSelection && ed.contains(savedSelection.commonAncestorContainer)) r = savedSelection;
    if (r) {
        from = backwards ? wpTextIndex(ed, r.startContainer, r.startOffset) : wpTextIndex(ed, r.endContainer, r.endOffset);
    }

    let found = !backwards ? hay.indexOf(needle, from) : hay.lastIndexOf(needle, from - 1);
    if (found === -1 && wrap) {
        found = !backwards ? hay.indexOf(needle, 0) : hay.lastIndexOf(needle, hay.length);
    }

    if (found === -1) { wpFindMsg(`No se encontró "${term}"`); return false; }
    wpSelectRange(ed, found, found + needle.length);
    wpFindMsg('');
    return true;
}

function wordpadReplace() {
    const ed = wpEditor();
    const term = document.getElementById('wp-find-input').value;
    const rep = document.getElementById('wp-replace-input').value;
    if (!term) { wpFindMsg('Escribe algo que buscar'); return; }

    const current = (savedSelection && ed.contains(savedSelection.commonAncestorContainer)) ? savedSelection.toString() : '';
    if (current.toLowerCase() === term.toLowerCase()) {
        restoreWordpadSelection();
        document.execCommand('insertText', false, rep);
        saveWordpadSelection();
        wpMarkDirty();
    }
    wordpadFind(false, true);
}

/* ---------- inicializacion ---------- */
function initWordPad() {
    const ed = wpEditor();
    if (!ed || window._wpInit) return;
    window._wpInit = true;

    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (e) {}
    if (!ed.textContent.trim() && !ed.querySelector('img')) ed.innerHTML = '<p><br></p>';
    else normalizeWordpad();

    setWordpadZoom(100);

    new MutationObserver(fixWordpadFontTags).observe(ed, { childList: true, subtree: true });

    document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        if (sel.rangeCount && ed.contains(sel.getRangeAt(0).commonAncestorContainer)) {
            saveWordpadSelection();
            updateWordpadToolbar();
        }
    });

    ed.addEventListener('input', () => {
        if (!ed.firstElementChild) {
            ed.innerHTML = '<p><br></p>';
        }
        wpMarkDirty();
        updateWordpadStats();
    });

    ed.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '\t');
        }
    });

    const winWordpad = document.getElementById('win-wordpad');
    if (winWordpad) {
        winWordpad.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') { wpCloseDialog(); toggleWordpadFind(false); return; }
            if (e.key === 'F3') { e.preventDefault(); wordpadFind(e.shiftKey); return; }
            if (!(e.ctrlKey || e.metaKey)) return;
            const k = e.key.toLowerCase();
            if (k === 's') { e.preventDefault(); saveDocument(e.shiftKey); }
            else if (k === 'o') { e.preventDefault(); openWordpadDialog(); }
            else if (k === 'p') { e.preventDefault(); printWordpadDoc(); }
            else if (k === 'f') { e.preventDefault(); toggleWordpadFind(true); }
        });
    }

    updateWordpadStats();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWordPad);
} else {
    initWordPad();
}

/* --- paint --- */
let currentPaintTool = 'pencil';
let currentPaintColor = '#000000';

function initPaint() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffffff'];
    const palette = document.getElementById('paint-palette');
    if (palette) {
        palette.innerHTML = '';
        colors.forEach(c => {
            const s = document.createElement('div');
            s.className = 'color-swatch';
            s.style.background = c;
            s.onclick = () => currentPaintColor = c;
            palette.appendChild(s);
        });
    }

    function getCoords(e) {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    canvas.onmousedown = (e) => {
        isDrawing = true;
        const p = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    };

    canvas.onmousemove = (e) => {
        if (!isDrawing) return;
        const p = getCoords(e);
        const size = document.getElementById('paint-size').value;
        ctx.lineCap = 'round';
        ctx.lineWidth = size;
        ctx.strokeStyle = currentPaintTool === 'eraser' ? '#ffffff' : currentPaintColor;
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };

    canvas.onmouseup = () => isDrawing = false;
    const saveBtn = document.getElementById('paint-save-btn');
    if (saveBtn) saveBtn.onclick = savePaintImage;
}

function setPaintTool(tool) {
    currentPaintTool = tool;
}

function clearCanvas() {
    const canvas = document.getElementById('paint-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function savePaintImage() {
    const canvas = document.getElementById('paint-canvas');
    let name = prompt('Nombre de la imagen:', 'Mi_Dibujo.png');
    if (!name) return;
    if (!name.toLowerCase().endsWith('.png')) name += '.png';
    const imageData = canvas.toDataURL();
    virtualFS.push({ name, content: imageData, type: 'img' });
    saveFS();
    document.getElementById('photo-viewer-title').innerText = `🖼️ Visor de Fotos - ${name}`;
    document.getElementById('photo-viewer-img').src = imageData;
    openApp('photoviewer');
}

/* --- chrome y youtube --- */
function navigateChrome(url) {
    const frame = document.getElementById('chrome-frame');
    const input = document.getElementById('chrome-url');
    if (!frame || !input) return;
    if (url === 'home') url = 'https://www.google.com/search?igu=1';
    else if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    input.value = url;
    frame.src = url;
}

function reloadChrome() {
    const frame = document.getElementById('chrome-frame');
    if (frame) frame.src = frame.src;
}

/* --- fondos de pantallas --- */
function changePresetWallpaper(val) {
    if (val.startsWith("linear-gradient")) {
        document.body.style.background = val;
    } else {
        document.body.style.backgroundImage = `url("${val}")`;
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundAttachment = "fixed";
    }
}

function handleWallpaperUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            document.body.style.backgroundImage = `url("${evt.target.result}")`;
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundRepeat = "no-repeat";
            document.body.style.backgroundAttachment = "fixed";
        };
        reader.readAsDataURL(file);
    }
}

/* --- calculadora --- */
let calcExpression = "0";
function calcAppend(val) {
    if (calcExpression === "0" && val !== '.') calcExpression = val;
    else calcExpression += val;
    updateCalcDisplay();
}

function calcClear() {
    calcExpression = "0";
    updateCalcDisplay();
}

function calcBackspace() {
    calcExpression = calcExpression.length > 1 ? calcExpression.slice(0, -1) : "0";
    updateCalcDisplay();
}

function calcCompute() {
    try {
        let sanitized = calcExpression.replace(/×/g, '*').replace(/÷/g, '/');
        calcExpression = String(eval(sanitized));
    } catch (e) {
        calcExpression = "Error";
    }
    updateCalcDisplay();
}

function updateCalcDisplay() {
    const display = document.getElementById('calc-display');
    if (display) display.value = calcExpression;
}

/* --- block de notas --- */
function saveNotepadFile() {
    const textarea = document.getElementById('notepad-textarea');
    if (!textarea) return;
    const content = textarea.value;
    if (!content.trim()) {
        alert("El bloc de notas está vacío.");
        return;
    }
    let name = prompt("Nombre del archivo de texto:", "Nota.txt");
    if (!name) return;
    if (!name.endsWith('.txt')) name += '.txt';
    virtualFS.push({ name, content, type: 'file' });
    saveFS();
    alert(`Guardado como "${name}" en Mis Documentos.`);
}

/* --- simbolo del sistema cmd --- */
function handleCmdInput(e) {
    if (e.key === 'Enter') {
        const input = document.getElementById('cmd-input');
        const output = document.getElementById('cmd-output');
        if (!input || !output) return;
        const cmdText = input.value.trim();

        output.innerHTML += `<span style="color:#61afef;">C:\\Users\\Usuario></span> ${cmdText}<br>`;
        const args = cmdText.split(' ');
        const command = args[0].toLowerCase();

        if (command === 'help') {
            output.innerHTML += `Comandos disponibles:<br>  <b>dir</b>    - Muestra archivos <br>  <b>cls</b>    - Limpia la pantalla<br>  <b>ver</b>    - Versión de Windows<br>  <b>date</b>   - Fecha actual<br><br>`;
        } else if (command === 'cls') {
            output.innerHTML = '';
        } else if (command === 'dir') {
            output.innerHTML += ` Directorio de C:\\Usuarios\\Usuario\\Mis documentos<br><br>`;
            virtualFS.forEach(f => { output.innerHTML += ` ${f.name}<br>`; });
            output.innerHTML += `<br>`;
        } else if (command === 'ver') {
            output.innerHTML += `Microsoft Windows [Versión 11.0.22631]<br><br>`;
        } else if (command === 'date') {
            output.innerHTML += `${new Date().toLocaleDateString()}<br><br>`;
        } else if (cmdText !== '') {
            output.innerHTML += `'${command}' no se reconoce como un comando.<br><br>`;
        }

        input.value = '';
        output.parentElement.scrollTop = output.parentElement.scrollHeight;
    }
}

/* --- reproductor de musica --- */
function bringToFront(win) {
    highestZIndex++;
    win.style.zIndex = highestZIndex;
}
function openApp(id) {
    const win = document.getElementById(`win-${id}`);
    if (win) {
        win.style.display = 'flex';
       
    } else {
        console.error(`No se encontro la ventana con ID: win-${id}`);
    }
}
const playlist = [
    {
        title: "Enjoy the Silence",
        artist: "Depeche Mode",
        src: "./mp3/depeche-mode-Enjoy-the-Silence.mp3"
    },
    {
        title: "What is Love",
        artist: "Haddaway",
        src: "./mp3/haddaway-what-is-love.mp3"
    },
    {
        title: "Don't You...",
        artist: "Simple Minds",
        src: "./mp3/Simple-Minds-Don't-You.mp3"
    }
];

let currentTrackIndex = 0;
let audioElement = new Audio();
let isPlayingMusic = false;

function initMusicPlayer() {
    const container = document.getElementById('playlist-container');
    if (!container) return;
    container.innerHTML = '';
    
    playlist.forEach((track, idx) => {
        const item = document.createElement('div');
        item.style.padding = '4px 8px';
        item.style.cursor = 'pointer';
        item.style.borderRadius = '4px';
        item.style.fontSize = '12px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.innerHTML = `<span>🎵 ${track.title}</span><span style="color:#888;">${track.artist}</span>`;
        
        item.onmouseover = () => item.style.background = '#333';
        item.onmouseout = () => item.style.background = 'transparent';
        item.onclick = () => loadAndPlayTrack(idx);
        container.appendChild(item);
    });

    audioElement.ontimeupdate = () => {
        const progress = document.getElementById('music-progress');
        const currentTimeElem = document.getElementById('music-current-time');
        const durationElem = document.getElementById('music-duration');

        if (audioElement.duration && progress) {
            progress.value = (audioElement.currentTime / audioElement.duration) * 100;
            if (currentTimeElem) currentTimeElem.innerText = formatTime(audioElement.currentTime);
            if (durationElem) durationElem.innerText = formatTime(audioElement.duration);
        }
    };

    audioElement.onended = () => nextTrack();
}

function loadAndPlayTrack(index) {
    currentTrackIndex = index;
    const track = playlist[index];
    audioElement.src = track.src;
    const titleElem = document.getElementById('music-title');
    const artistElem = document.getElementById('music-artist');
    if (titleElem) titleElem.innerText = track.title;
    if (artistElem) artistElem.innerText = track.artist;
    
    audioElement.play().catch(e => console.log("Reproducción bloqueada:", e));
    isPlayingMusic = true;
    const playBtn = document.getElementById('play-pause-btn');
    if (playBtn) playBtn.innerText = "⏸";
}

function togglePlayMusic() {
    if (!audioElement.src) {
        loadAndPlayTrack(0);
        return;
    }
    const playBtn = document.getElementById('play-pause-btn');
    if (isPlayingMusic) {
        audioElement.pause();
        isPlayingMusic = false;
        if (playBtn) playBtn.innerText = "▶";
    } else {
        audioElement.play();
        isPlayingMusic = true;
        if (playBtn) playBtn.innerText = "⏸";
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadAndPlayTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack(currentTrackIndex);
}

function seekAudio(val) {
    if (audioElement.duration) {
        audioElement.currentTime = (val / 100) * audioElement.duration;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function uploadLocalMusic(e) {
    const file = e.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        const newTrack = {
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Archivo Local",
            src: fileURL
        };
        playlist.push(newTrack);
        initMusicPlayer();
        loadAndPlayTrack(playlist.length - 1);
    }
}
function setVolume(val) {
   
    audioElement.volume = val / 100;
}
// --- visor de fotos---
let photoZoomLevel = 1;

function zoomPhoto(amount) {
    photoZoomLevel += amount;
    if (photoZoomLevel < 0.4) photoZoomLevel = 0.4;
    if (photoZoomLevel > 3) photoZoomLevel = 3;
    const img = document.getElementById('photo-viewer-img');
    if (img) img.style.transform = `scale(${photoZoomLevel})`;
}

function resetPhotoZoom() {
    photoZoomLevel = 1;
    const img = document.getElementById('photo-viewer-img');
    if (img) img.style.transform = `scale(1)`;
}

function loadLocalPhoto(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const titleElem = document.getElementById('photo-viewer-title');
            const imgElem = document.getElementById('photo-viewer-img');
            if (titleElem) titleElem.innerText = `🖼️ Visor de Fotos - ${file.name}`;
            if (imgElem) imgElem.src = evt.target.result;
            resetPhotoZoom();
        };
        reader.readAsDataURL(file);
    }
}