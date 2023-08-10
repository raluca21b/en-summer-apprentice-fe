import { useStyle } from "./src/components/styles";
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

  fetchEvets().then(data =>{
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

const createEventElement = (eventData)=>{
  const {eventID, eventName, eventDescription, venueDTO, startDate,endDate, ticketsCategory} = eventData;
  const eventDiv = document.createElement('div');
  const img = `./src/assets/${eventID}.png`;
  const addToCartBttnClasses = useStyle('addToCartBttn');
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
  addToCartButton.classList.add(...addToCartBttnClasses);
  addToCartButton.textContent="Buy";
  addToCartButton.disabled=true;

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

// !!!!!!!!!!!!!!!!!!!!! get orders !!!!!!!!!!!!!!
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
  
  if (purchaseDiv){
    fetchOrders().then((orders) =>{
      if(orders.length){
        console.log("Here comes the loader with timeout");
        orders.forEach((order) =>{
          const newOrder = createOrderElement(order);
          purchasesContent.appendChild(newOrder);
        });
        purchaseDiv.appendChild(purchasesContent);
      } else{
        console.log("Here comes the remove loader without timeout");
        mainContentDiv.innerHTML = 'no orders yet';
      }
    })
  }
}


const createOrderElement = (order) =>{
  const purchase = document.createElement('div');
  purchase.id = `purchase-${order.orderID}`;
  purchase.classList.add(...useStyle('purchase'));

  const purchaseTitle = document.createElement('p');
  purchaseTitle.classList.add(...useStyle('purchaseTitle'));
  purchaseTitle.innerHTML = `${order.eventID}`;
  purchase.appendChild(purchaseTitle);

  const purchaseQuantity = document.createElement('input');
  purchaseQuantity.classList.add(...useStyle('purchaseQuantity'));
  purchaseQuantity.type = 'number';
  purchaseQuantity.min = '1';
  purchaseQuantity.value = `${order.numberOfTickets}`;
  purchaseQuantity.disabled = true;

  const purchaseQuantityWrapper = document.createElement('div');
  purchaseQuantityWrapper.classList.add(...useStyle('purchaseQuantityWrapper'));
  purchaseQuantityWrapper.append(purchaseQuantity);
  purchase.appendChild(purchaseQuantityWrapper);

  const purchaseType = document.createElement('select');
  purchaseType.classList.add('purchaseType');
  purchaseType.setAttribute('disabled','true');
  
  const defaultOption = document.createElement('option');
  defaultOption.value = `${order.ticketCategory.description}`;
  defaultOption.textContent = `${order.ticketCategory.description}`;

  const standardOption = document.createElement('option');
  standardOption.value = 'Standard';
  standardOption.textContent = 'Standard';

  const vipOption = document.createElement('option');
  vipOption.value = 'VIP';
  vipOption.textContent = 'VIP';

  purchaseType.appendChild(defaultOption);
  purchaseType.appendChild(standardOption);
  purchaseType.appendChild(vipOption);

  const purchaseTypeWrapper = document.createElement('div');
  purchaseTypeWrapper.classList.add(...useStyle('purchaseTypeWrapper'));
  purchaseTypeWrapper.appendChild(purchaseType);
  purchase.appendChild(purchaseTypeWrapper);

  const purchaseDate = document.createElement('div');
  purchaseDate.classList.add(...useStyle('purchaseDate'));
  purchaseDate.innerText = new Date(order.orderedAt).toLocaleDateString();
  purchase.appendChild(purchaseDate);

  const purchasePrice = document.createElement('div');
  purchasePrice.classList.add(...useStyle('purchasePrice'));
  purchasePrice.innerText = order.totalPrice;
  purchase.appendChild(purchasePrice);

  const actions = document.createElement('div');
  actions.classList.add(...useStyle('actions'));

  const editButton = document.createElement('button');
  editButton.classList.add(...useStyle(['actionButton','editButton']));
  editButton.innerHTML="Edit";
  actions.appendChild(editButton);

  const saveButton = document.createElement('button');
  saveButton.classList.add(...useStyle(['actionButton','hiddenButton','saveButton']));
  saveButton.innerHTML="Save";
  actions.appendChild(saveButton);

  const cancelButton = document.createElement('button');
  cancelButton.classList.add(...useStyle(['actionButton','hiddenButton','cancelButton']));
  cancelButton.innerHTML="Cancel";
  actions.appendChild(cancelButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add(...useStyle(['actionButton','deleteButton']));
  deleteButton.innerHTML="Delete";
  actions.appendChild(deleteButton);

  purchase.appendChild(actions);

  return purchase;
}

// !!!!!!!!!!!!!!!!!!!!! get orders !!!!!!!!!!!!!!

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
