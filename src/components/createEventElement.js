import { addLoader, removeLoader } from "./loader";
import { useStyle } from "./styles";

export const createEventElement = (eventData)=>{
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
        addLoader();
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
        .finally(()=>{
          removeLoader();
        })
    } else{
      alert('Please enter a valid number!!!');
    }
  };
  