        // Game constants and variables
        const width = 28;
        const grid = document.querySelector('.grid');
        let squares = [];
        const scoreDisplay = document.querySelector('.score');
        let score = 0;
        let pacmanDirection = 'right';
        let pacmanIndex = 490;
        let pacmanInterval;
        let ghostIntervals = [];
        const startButton = document.getElementById('start-button');
        const restartButton = document.getElementById('restart-button');

        // Game board layout
        // 0 - pac-dot
        // 1 - wall
        // 2 - ghost lair
        // 3 - power-pellet
        // 4 - empty
        const layout = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
            4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
            1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
            1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
            1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
            1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
            1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
            1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
            1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
            1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
        ];

        // Function to create the game board
        function createBoard() {
            // Loop through the layout array
            for (let i = 0; i < layout.length; i++) {
                // Create a div element for each cell
                const square = document.createElement('div');
                grid.appendChild(square);
                squares.push(square);

                // Add appropriate CSS classes based on the layout
                if (layout[i] === 0) {
                    squares[i].classList.add('pac-dot');
                } else if (layout[i] === 1) {
                    squares[i].classList.add('wall');
                } else if (layout[i] === 2) {
                    squares[i].classList.add('ghost-lair');
                } else if (layout[i] === 3) {
                    squares[i].classList.add('power-pellet');
                }
            }
        }

        createBoard();

        // Function to handle Pac-Man's movement based on key presses
        function control(e) {
            switch (e.key) {
                case 'ArrowLeft':
                    pacmanDirection = 'left';
                    break;
                case 'ArrowUp':
                    pacmanDirection = 'up';
                    break;
                case 'ArrowRight':
                    pacmanDirection = 'right';
                    break;
                case 'ArrowDown':
                    pacmanDirection = 'down';
                    break;
            }
        }

        // Function to handle Pac-Man eating pac-dots
        function pacDotEating() {
            if (squares[pacmanIndex].classList.contains('pac-dot')) {
                squares[pacmanIndex].classList.remove('pac-dot');
                score++;
                scoreDisplay.innerHTML = score;
            }
        }

        // Function to handle Pac-Man eating power pellets
        function powerPelletEating() {
            if (squares[pacmanIndex].classList.contains('power-pellet')) {
                squares[pacmanIndex].classList.remove('power-pellet');
                score += 10;
                ghosts.forEach(ghost => ghost.isScared = true);
                setTimeout(unScareGhosts, 10000);
                scoreDisplay.innerHTML = score;
            }
        }

        // Function to return ghosts to normal state after power pellet effect
        function unScareGhosts() {
            ghosts.forEach(ghost => ghost.isScared = false);
        }

        // Function to move Pac-Man and handle interactions
        function movePacman() {
            // Remove Pac-Man from current position
            squares[pacmanIndex].classList.remove('pacman');

            // Determine new position based on current direction
            switch (pacmanDirection) {
                case 'left':
                    // Move left if not at left edge and not a wall
                    if (!squares[pacmanIndex - 1].classList.contains('wall') && pacmanIndex % width !== 0) pacmanIndex -= 1;
                    // Wrap around to right side if at left edge
                    if (pacmanIndex === 364) pacmanIndex = 391;
                    break;
                case 'up':
                    // Move up if not at top edge and not a wall
                    if (!squares[pacmanIndex - width].classList.contains('wall') && pacmanIndex - width >= 0) pacmanIndex -= width;
                    break;
                case 'right':
                    // Move right if not at right edge and not a wall
                    if (!squares[pacmanIndex + 1].classList.contains('wall') && pacmanIndex % width < width - 1) pacmanIndex += 1;
                    // Wrap around to left side if at right edge
                    if (pacmanIndex === 391) pacmanIndex = 364;
                    break;
                case 'down':
                    // Move down if not at bottom edge and not a wall
                    if (!squares[pacmanIndex + width].classList.contains('wall') && pacmanIndex + width < width * width) pacmanIndex += width;
                    break;
            }

            // Place Pac-Man in new position
            squares[pacmanIndex].classList.add('pacman');

            // Check for pac-dot eating
            pacDotEating();

            // Check for power pellet eating
            powerPelletEating();

            // Check if game is over
            checkForGameOver();
        }

        // Ghost class definition
        class Ghost {
            constructor(className, startIndex, speed) {
                this.className = className;
                this.startIndex = startIndex;
                this.speed = speed;
                this.currentIndex = startIndex;
                this.isScared = false;
                this.timerId = NaN;
            }
        }

        // Create ghost instances
        const ghosts = [
            new Ghost('blinky', 348, 250),
            new Ghost('pinky', 376, 300),
            new Ghost('inky', 351, 275),
            new Ghost('clyde', 379, 325)
        ];

        // Function to move ghosts
        function moveGhost(ghost) {
            ghost.timerId = setInterval(function() {
                // Get valid directions
                const directions = [-1, +1, -width, +width];
                let direction = directions[Math.floor(Math.random() * directions.length)];

                // Move ghost if the new position is not a wall and not another ghost
                if (!squares[ghost.currentIndex + direction].classList.contains('wall') &&
                    !squares[ghost.currentIndex + direction].classList.contains('ghost')) {
                    // Remove ghost from current position
                    squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost');
                    // Move ghost to new position
                    ghost.currentIndex += direction;
                    // Add ghost to new position
                    squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
                } else {
                    // If can't move, get new random direction
                    direction = directions[Math.floor(Math.random() * directions.length)];
                }

                // If ghost is scared, add scared-ghost class
                if (ghost.isScared) {
                    squares[ghost.currentIndex].classList.add('scared-ghost');
                }

                // If Pac-Man eats a scared ghost
                if (ghost.isScared && squares[ghost.currentIndex].classList.contains('pacman')) {
                    // Remove ghost
                    squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost');
                    // Reset ghost position
                    ghost.currentIndex = ghost.startIndex;
                    // Increase score
                    score += 100;
                    // Place ghost back in starting position
                    squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
                }

                // Check if game is over
                checkForGameOver();
            }, ghost.speed);
            ghostIntervals.push(ghost.timerId);
        }

        // Function to check if the game is over (win or lose)
        function checkForGameOver() {
            if (squares[pacmanIndex].classList.contains('ghost') &&
                !squares[pacmanIndex].classList.contains('scared-ghost')) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId));
                clearInterval(pacmanInterval);
                document.removeEventListener('keydown', control);
                scoreDisplay.innerHTML = 'GAME OVER';
                restartButton.style.display = 'inline-block';
            }

            if (score === 274) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId));
                clearInterval(pacmanInterval);
                document.removeEventListener('keydown', control);
                scoreDisplay.innerHTML = 'YOU WIN!';
                restartButton.style.display = 'inline-block';
            }
        }

        // Function to initialize and start the game
        function startGame() {
            // Reset game state
            score = 0;
            pacmanIndex = 490;
            pacmanDirection = 'right';
            scoreDisplay.innerHTML = score;

            // Clear the board
            squares.forEach(square => {
                square.classList.remove('pacman', 'ghost', 'scared-ghost', 'blinky', 'pinky', 'inky', 'clyde');
            });

            // Recreate the board
            createBoard();

            // Place Pac-Man
            squares[pacmanIndex].classList.add('pacman');

            // Place ghosts
            ghosts.forEach(ghost => {
                ghost.currentIndex = ghost.startIndex;
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
            });

            // Start game loops
            pacmanInterval = setInterval(movePacman, 200);
            ghosts.forEach(ghost => moveGhost(ghost));

            // Add event listener for Pac-Man control
            document.addEventListener('keydown', control);

            // Hide start button, show restart button
            startButton.style.display = 'none';
            restartButton.style.display = 'none';
        }

        // Function to restart the game
        function restartGame() {
            // Clear all intervals
            clearInterval(pacmanInterval);
            ghostIntervals.forEach(interval => clearInterval(interval));
            ghostIntervals = [];

            // Start a new game
            startGame();
        }

        // Event listeners for start and restart buttons
        startButton.addEventListener('click', startGame);
        restartButton.addEventListener('click', restartGame);
  