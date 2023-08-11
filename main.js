import { addLoader,removeLoader } from "./src/components/loader";
import { createEventElement } from "./src/components/createEventElement";
import { createOrderElement } from "./src/components/createOrderElement";
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
<<<<<<< HEAD
      <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
      <div class = "purchases ml-6 mr-6">
          <div class="bg-white px-4 py-3 fap-x-4 flex font-bold">
            <button class="flex flex-1 text-center justify-center" id="sorting-button-1">
              <span >Name</span>
            </button>
            <span class="flex-1">No of Tickets</span>
            <span class="flex-1">Category</span>
            <span class="flex-1 hidden md:flex">Ordered At</span>
            <button class="hidden md:flex text-center" id="sorting-button-2">
              <span >Total Price</span>
            </button>
            <span class="w-28 sm:w-8"></span>
          </div>
          <div id="purchases-content">
          </div>
      </div>
=======
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
>>>>>>> main
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

  addLoader();

  fetchEvets().then(data =>{
    setTimeout(()=>{
      removeLoader();
    },200);
    addEventsOnPage(data);
  })
}

async function fetchEvets(){
  const response = await fetch('http://localhost:8080/events');
  const data = await response.json();
  return data;
}

const addEventsOnPage = (events) => {
  const eventsContainer = document.querySelector('.events');
  eventsContainer.innerHTML = 'No events to show';
  if (events.length){
    eventsContainer.innerHTML = '';
    events.forEach(event => {
      eventsContainer.appendChild(createEventElement(event))
    })
  }
}

<<<<<<< HEAD
async function fetchOrders(){
  const response = await fetch("http://localhost:8080/orders");
  const orders = await response.json();
  return orders;
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
  const purchaseDiv = document.querySelector('.purchases')
  const purchasesContent = document.getElementById('purchases-content');
  
  addLoader();
  if (purchaseDiv){
    fetchOrders().then((orders) =>{
      if(orders.length){
        setTimeout(()=>{
          removeLoader();
        },200);
        orders.forEach((order) =>{
          const newOrder = createOrderElement(order);
          purchasesContent.appendChild(newOrder);
        });
        purchaseDiv.appendChild(purchasesContent);
      } else{
        removeLoader();
        mainContentDiv.innerHTML = 'no orders yet';
      }
    })
  }
}
=======
const createEventElement = (eventData)=>{
  const {eventID, eventName, eventDescription, venueDTO, startDate,endDate, ticketsCategory} = eventData;
  const eventDiv = document.createElement('div');
  const img = `./src/assets/${eventID}.png`;
  eventDiv.classList.add('event-card');

  //Create the event content markup
  const contentMarkup = `
      <header>
         <h2 class="event-title text-2xl font-bold">${eventName}</h2>
      </header>
      <div class="content">
        <img src="${img}" alt="${eventName}" class="event-image">
        <h3 class="description text-gray-700">${eventDescription}</h3>
        <p  class="description text-gray-700">Location: ${venueDTO.location}</p>
        <p  class="description text-gray-700">Capacity: ${venueDTO.capacity}</p>
        <p  class="description text-gray-700">Period: ${startDate}   -   ${endDate} </p>
        <p  class="description text-gray-700"></p>
      </div>
  `;
  eventDiv.innerHTML = contentMarkup;

  const radioGroup = document.createElement('div');

  const radioButtonsMarkup = eventData.ticketsCategory.map((ticket) => `
                            <label>
                              <input type="radio" name="ticketCategory-${eventID}" value="${ticket.ticketCategoryID}">
                              ${ticket.description} - $${ticket.price.toFixed(2)}
                            </label><br>
                            `)
                            .join('');

  radioGroup.innerHTML = radioButtonsMarkup;  

  eventDiv.appendChild(radioGroup);

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0';
  input.max = '20';
  input.value = '0';

  input.addEventListener('blur',()=>{
    if (!input.value){
      input.value = 0;
    }
  });

  input.addEventListener('input',()=>{
    const currentQuantity = parseInt(input.value);
    if (currentQuantity > 0){
        addToCartButton.disabled = false;
    } else{
        addToCartButton.disabled = true;
    }
  })

  const label = document.createElement('label');
  label.textContent = 'Number of tickets: ';
  label.appendChild(input);

  eventDiv.appendChild(label);

  const addToCartButton = document.createElement('button');
  addToCartButton.classList.add('add-to-cart-btn');
  addToCartButton.textContent="Buy";

  eventDiv.appendChild(addToCartButton);

  addToCartButton.addEventListener('click', () => {
    const selectedTicketCategoryRadio = document.querySelector(`input[name="ticketCategory-${eventID}"]:checked`);
    if (!selectedTicketCategoryRadio) {
      alert('Please select a ticket category');
      return;
    } else{
      handleAddToCart(eventID,input,selectedTicketCategoryRadio,addToCartButton);
    }
  });

  return eventDiv;
}

const handleAddToCart = (eventID,input,selectedTicketCategoryRadio,addToCartButton) =>{
  const quantity = input.value;
  const ticketCategoryID = selectedTicketCategoryRadio.value;
  if (parseInt(quantity)){
      fetch('http://localhost:8080/orders',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          eventID:eventID,
          ticketCategoryID:+ticketCategoryID,
          numberOfTickets:+quantity
        })
      }).then((response) => {
        return response.json().then((data) =>{
          if(!response.ok){
            console.log("Something went wrong...");
          }
          return data;
        })
      }).then((data) =>{
        console.log("Added successfully!");
        input.value = 0;
        addToCartButton.disabled = true;
        selectedTicketCategoryRadio.checked = false;
      })
  } else{
    alert('Please enter a valid number!!!');
  }
};

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

>>>>>>> main
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
