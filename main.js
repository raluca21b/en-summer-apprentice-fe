import { addLoader,removeLoader } from "./src/components/loader";
import { createEventElement } from "./src/components/createEventElement";
import { createOrderElement } from "./src/components/createOrderElement";

let events = [];
const BASEURL = 'http:localhost:8080/events';

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
      <h1>Search Events</h1>
      <div class = "filters flex flex-row items-center justify-center flex-wrap">
        <input type = "text" id="filter-name" placeholder="Filter by name" class = "px-4 mt-4 mb-4  py-2 border rounded-md"/>
        <select id = "filter-venue-select" class = "mt-4 ml-4 px-4 py-3 rounded-lg bg-orange-200"></select>
        <select id = "filter-type-select" class = "mt-4 ml-4 px-4 py-3 rounded-lg bg-orange-200"></select>
        <button id = "filter-button" class = "filter-btn mt-4 ml-4 px-4 py-3 text-white rounded-lg"><i class="fa-solid fa-magnifying-glass"></i></button>
      </div>
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

function liveSearch(){
  const filterInput = document.querySelector('#filter-name');

  if (filterInput){
    const searchValue = filterInput.value;

    if (searchValue !== undefined){
      const filteredEvents = events.filter((event)=>
        event.eventName.toLowerCase().includes(searchValue.toLowerCase())
      );

      addEventsOnPage(filteredEvents);
    }
  }
}

function setupFilterEvents(){
  const nameFilterInput = document.querySelector('#filter-name');
  const eventTypeSelect = document.querySelector('#filter-type-select');
  const venueSelect = document.getElementById('filter-venue-select');

  if (nameFilterInput){
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup',()=>{
      eventTypeSelect.value = eventTypeSelect.options[0].value;
      venueSelect.value = venueSelect.options[0].value;
      setTimeout(liveSearch,filterInterval);
    });
  }
}

function setupSelectsForFilters(){
  const eventTypeSelect = document.querySelector('#filter-type-select');
  const venueSelect = document.getElementById('filter-venue-select');
  venueSelect.innerHTML = getEventsVenues();
  eventTypeSelect.innerHTML = getEventsTypes();
}

async function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
  const filterButton = document.getElementById('filter-button');
  const eventTypeSelect = document.querySelector('#filter-type-select');
  const venueSelect = document.getElementById('filter-venue-select');
  setupFilterEvents();
  addLoader();

  await fetchEvets();

  setupSelectsForFilters();
  setTimeout(()=>{
    removeLoader();
  },200);

  addEventsOnPage(events);

  filterButton.addEventListener('click',()=>{
    setTimeout(filterEventsVenueAndType(),500);
  });
}

function filterEventsVenueAndType(){
  const eventTypeSelected = document.querySelector('#filter-type-select').value;
  const venueSelected = document.getElementById('filter-venue-select').value;
  let queryParams = [];

  if (eventTypeSelected !== null && eventTypeSelected !== "") {
    queryParams.push(`eventTypeName=${eventTypeSelected}`);
  }

  if (venueSelected !== null && venueSelected !== "") {
      queryParams.push(`venueID=${venueSelected}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

  const url = new URL(`${BASEURL}${queryString}`);
  fetchFilteredEvents(url).then((data)=>{
    addEventsOnPage(data);
  });
}

async function fetchEvets(){
  const response = await fetch('http://localhost:8080/events');
  events = await response.json();
}

async function fetchFilteredEvents(url){
  const response = await fetch(url);
  const filteredEvents = await response.json();
  return filteredEvents;
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

function getEventsVenues(){
  const venueSet = new Set(events.map((event)=>event.venueDTO));
  let select_options = '<option value="">Venue...</option>';
  venueSet.forEach(venue => {
    select_options += `<option value="${venue.venueID}">${venue.type}</option>`
  });
  return select_options;
}

function getEventsTypes(){
  const eventTypeSet = new Set(events.map((event)=>event.eventType));
  let select_options_types = '<option value="">Type...</option>';
  eventTypeSet.forEach(eventType => {
    select_options_types += `<option value="${eventType}">${eventType}</option>`
  });
  return select_options_types;
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
