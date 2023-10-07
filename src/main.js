
document.addEventListener("DOMContentLoaded",()=>{
    
    //Declaration
    const { ipcRenderer } = require("electron");
    const playerDisplayer = document.getElementById('currentPlayer');
    const resetBtn = document.querySelector('a#btn');
    const holders = document.querySelectorAll('.ext')
    const gameContainer = document.getElementById('game')
    const githubBtn = document.getElementById('github')
    const discordBtn = document.getElementById('discord')
    var cells = document.querySelectorAll('.int');
    var currentPlayer = 'X'


    //allowing All squares
    const activeAll = () => holders.forEach(element => {
        element.classList.add('active');
    });

    const removeAll = () => holders.forEach(element => {
        element.classList.remove('active');
    })

    //Click event
    cells.forEach(element => {
        element.addEventListener('click',clickCell)
    });

    function clickCell(event) {

        const div = event.target;
        const nextHolder = div.getAttribute('id').split('-')[1];
        const holder = document.querySelector(`#${nextHolder}`)

        //Checking if cell is empty and the square is allowed to be played in
        if (div.parentElement.classList.contains('active') && div.innerHTML == '') {
            div.innerHTML = currentPlayer;
            removeAll();

            var result = checkWinner(div.parentElement,false)
            if(result == true){
                div.parentElement.classList.add('disable');
                div.parentElement.innerHTML = currentPlayer
            }

            result = checkWinner(gameContainer,true)
            if (result == true) 
                playerDisplayer.textContent = `Player ${currentPlayer} wins!`;
            else if(document.querySelectorAll('.disable').length == 9)
                playerDisplayer.textContent = `Its a Draw`;
            else {
            //chaning player
            currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
            playerDisplayer.textContent = `Player ${currentPlayer}`;

            if(holder.classList.contains('disable'))
                activeAll()
            else
                holder.classList.add('active')
            }
        }

    }

    function checkWinner(holder,bool) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]            // Diagonals
          ];
        const holderCells =  holder.querySelectorAll(`#${holder.getAttribute('id')} > div`)

        for (const pattern of winPatterns) {
          const [a, b, c] = pattern;

          if (bool && (!holderCells[a].classList.contains('disable') || !holderCells[b].classList.contains('disable') || !holderCells[c].classList.contains('disable')) ) 
            continue;

          if (holderCells[a].textContent.trim() && holderCells[a].textContent.trim() === holderCells[b].textContent.trim() && holderCells[a].textContent.trim() === holderCells[c].textContent.trim()) {
            return true
          }
        }
        return false
    }

    // Reset function
    function resetGame() {

        // Reset game state
        currentPlayer = 'X';
        playerDisplayer.textContent = 'Player 1 "X"';

        // Clear all cell contents
        // Enable all holders and cells 
        holders.forEach(holder => {
            holder.classList.remove('disable');
            holder.innerHTML = ''
            for (let index = 0; index < 9; index++) {
                const cell = document.createElement('div')
                cell.classList.add('int')
                cell.id = `${holder.getAttribute('id')}-a${index+1}`
                cell.addEventListener('click',clickCell);
                holder.appendChild(cell)
            }
        });

        // Re-enable all cells
        activeAll();
    }

    // Event listener for reset button click
    resetBtn.addEventListener('click', resetGame);


    githubBtn.addEventListener('click', () => {
        ipcRenderer.send('openURL', 'https://github.com/PLMohamed');
    });

    discordBtn.addEventListener('click',()=>{
        ipcRenderer.send('show-success-box',{title:'Discord id',message:'Discord : plmohamed \nPLMohamed#5354'})
    })
    activeAll();
})