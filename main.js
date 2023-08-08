// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content" >
      <img src="./src/assets/ticket.png" alt="ticket-sale" class="main-image">
      <h1>All Events</h1>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}

function setupNavigationEvents() {
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  // Sample hardcoded event data
  const eventData = {
    eventID: 1,
    img: "https://asset.brandfetch.io/idGVfES5Xz/idpmuZ_bwR.jpeg",
        venueDTO: {
            venueID: 1,
            location: "Aleea Stadionului 2, Cluj-Napoca",
            type: "Stadion",
            capacity: 1000
        },
        eventType: "Festival de Muzica",
        eventDescription: "muzica buna",
        eventName: "Untold",
        startDate: "2023-07-18T10:00:00",
        endDate: "2023-07-22T23:59:59",
        ticketsCategory: [
            {
                ticketCategoryID: 1,
                description: "Standard",
                price: 800.00
            },
            {
                ticketCategoryID: 5,
                description: "VIP",
                price: 1500.00
            }
        ]
    
  };
  // Create the event card element
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');

  // Create the radio buttons markup
  const radioButtonsMarkup = eventData.ticketsCategory.map(ticket => `
  <label>
    <input type="radio" name="ticketCategory" value="${ticket.ticketCategoryID}">
    ${ticket.description} - $${ticket.price.toFixed(2)}
  </label><br>`)
  .join('');

  // Create the event content markup
  const contentMarkup = `
    <header>
      <h2 class="event-title text-2xl font-bold">${eventData.eventName}</h2>
    </header>
    <div class="content">
      <img src="${eventData.img}" alt="${eventData.eventName}" class="event-image w-full h-200 rounded object-cover mb-6">
      <h3 class="description text-gray-700">${eventData.eventDescription}</h3>
      <p  class="description text-gray-700">Location: ${eventData.venueDTO.location}</p>
      <p  class="description text-gray-700">Capacity: ${eventData.venueDTO.capacity}</p>
      <p  class="description text-gray-700">Period: ${eventData.startDate}   -   ${eventData.endDate} </p>
      <p  class="description text-gray-700"></p>
      <div class="radio-group">${radioButtonsMarkup}</div> 
      <label for="numberOfTickets">Number of Tickets:  </label>
      <input type="number" id="numberOfTickets" name="numberOfTickets" min="1" value="1"  max="20">
      <button class="add-to-cart-btn"> Buy </button>
    </div>
  `; 

  eventCard.innerHTML = contentMarkup;
  const eventsContainer = document.querySelector('.events');
  // Append the event card to the events container
  eventsContainer.appendChild(eventCard);
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
