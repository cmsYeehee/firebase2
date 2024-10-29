// Initialize the voting container and UI
function createVotingUI() {
    // Create container div
    const container = document.createElement('div');
    container.className = 'voting-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.7);
        padding: 20px;
        border-radius: 10px;
        color: white;
        font-family: Arial, sans-serif;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(79, 156, 255, 0.3);
        z-index: 1000;
        min-width: 300px;
        text-align: center;
    `;

    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Vote For Your Favorite Planet';
    title.style.cssText = `
        color: #4f9cff;
        margin-bottom: 15px;
        font-size: 18px;
    `;
    container.appendChild(title);

    // Create vote buttons for each planet
    const planets = ['OceanWorld', 'JungleWorld', 'MountainWorld'];
    
    planets.forEach(planet => {
        const voteOption = document.createElement('div');
        voteOption.className = 'vote-option';
        voteOption.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            background: rgba(79, 156, 255, 0.1);
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        `;
        
        const planetName = document.createElement('span');
        planetName.textContent = planet;
        
        const voteCount = document.createElement('span');
        voteCount.className = `vote-count-${planet.replace(' ', '-')}`;
        voteCount.textContent = '0';
        voteCount.style.color = '#4f9cff';
        
        voteOption.appendChild(planetName);
        voteOption.appendChild(voteCount);
        
        // Add hover effect
        voteOption.addEventListener('mouseenter', () => {
            voteOption.style.background = 'rgba(79, 156, 255, 0.2)';
        });
        
        voteOption.addEventListener('mouseleave', () => {
            voteOption.style.background = 'rgba(79, 156, 255, 0.1)';
        });
        
        // Add click handler
        voteOption.addEventListener('click', () => {
            handleVote(planet);
        });
        
        container.appendChild(voteOption);
    });

    // Add total votes display
    const totalVotes = document.createElement('div');
    totalVotes.className = 'total-votes';
    totalVotes.style.cssText = `
        margin-top: 15px;
        font-size: 14px;
        color: #4f9cff;
    `;
    totalVotes.textContent = 'Total Votes: 0';
    container.appendChild(totalVotes);

    document.body.appendChild(container);
}

// Handle the voting process
async function handleVote(planetName) {
    // Check if user has already voted
    if (localStorage.getItem('hasVoted')) {
        alert('You have already voted! Thank you for participating.');
        return;
    }

    try {
        // Get the document reference
        const planetRef = db.collection('planetVotes').doc(planetName);
        
        // Update vote count in Firestore using atomic increment
        await planetRef.update({
            votes: firebase.firestore.FieldValue.increment(1)
        });

        // Mark that this user has voted
        localStorage.setItem('hasVoted', 'true');
        localStorage.setItem('votedPlanet', planetName);

        // Visual feedback
        const voteOption = document.querySelector(`.vote-option:has(span:text-content(${planetName}))`);
        if (voteOption) {
            voteOption.style.background = 'rgba(79, 156, 255, 0.3)';
        }

    } catch (error) {
        console.error("Error casting vote:", error);
        alert('Error casting vote. Please try again.');
    }
}

// Update vote counts in real-time
function setupVoteListeners() {
    db.collection('planetVotes').onSnapshot((snapshot) => {
        let totalVotes = 0;
        
        snapshot.forEach((doc) => {
            const planetName = doc.id;
            const votes = doc.data().votes;
            totalVotes += votes;
            
            // Update individual planet vote count
            const voteCount = document.querySelector(`.vote-count-${planetName.replace(' ', '-')}`);
            if (voteCount) {
                voteCount.textContent = votes;
            }
        });
        
        // Update total votes
        const totalVotesElement = document.querySelector('.total-votes');
        if (totalVotesElement) {
            totalVotesElement.textContent = `Total Votes: ${totalVotes}`;
        }
    }, (error) => {
        console.error("Error getting vote updates:", error);
    });
}

// Initialize the voting system
async function initializeVoting() {
    try {
        // Check if documents exist, if not create them
        const planets = ['OceanWorld', 'JungleWorld', 'MountainWorld'];
        
        for (const planet of planets) {
            const docRef = db.collection('planetVotes').doc(planet);
            const doc = await docRef.get();
            
            if (!doc.exists) {
                await docRef.set({
                    votes: 0
                });
            }
        }

        // Create the UI
        createVotingUI();
        
        // Setup real-time listeners
        setupVoteListeners();
        
        // If user has voted before, show it
        const votedPlanet = localStorage.getItem('votedPlanet');
        if (votedPlanet) {
            const voteOption = document.querySelector(`.vote-option:has(span:text-content(${votedPlanet}))`);
            if (voteOption) {
                voteOption.style.background = 'rgba(79, 156, 255, 0.3)';
                voteOption.style.cursor = 'default';
            }
        }

    } catch (error) {
        console.error("Error initializing voting system:", error);
        alert('Error initializing voting system. Please refresh the page.');
    }
}

// Handle errors gracefully
function handleError(error) {
    console.error('Error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        z-index: 1001;
    `;
    errorMessage.textContent = 'An error occurred. Please try again later.';
    document.body.appendChild(errorMessage);
    setTimeout(() => errorMessage.remove(), 5000);
}

// Initialize everything when the page loads
window.addEventListener('load', () => {
    try {
        initializeVoting();
    } catch (error) {
        handleError(error);
    }
});