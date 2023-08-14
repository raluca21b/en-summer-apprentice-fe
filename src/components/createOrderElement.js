import { useStyle } from "./styles";


export const createOrderElement = (order) =>{
    const purchase = document.createElement('div');
    purchase.id = `purchase-${order.orderID}`;
    purchase.classList.add(...useStyle('purchase'));

    const eventId = order.eventID;
    fetchEventDetailsByEventId(eventId).then((eventData)=>{
        if(eventData){
            const eventNameData = eventData.eventName;
            const purchaseTitle = document.createElement('p');
            purchaseTitle.classList.add(...useStyle('purchaseTitle'));
            purchaseTitle.innerHTML = eventNameData;
            purchase.insertBefore(purchaseTitle, purchase.firstChild);
        }
    });
  
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
    if (defaultOption.value === 'Standard'){
        purchaseType.appendChild(vipOption);
    }else{
        purchaseType.appendChild(standardOption);
    }
    
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
    editButton.innerHTML='<i class="fa-solid fa-pen-to-square"></i>';
    actions.appendChild(editButton);
  
    const saveButton = document.createElement('button');
    saveButton.classList.add(...useStyle(['actionButton','hiddenButton','saveButton']));
    saveButton.innerHTML='<i class="fa-solid fa-square-check"></i>';
    actions.appendChild(saveButton);
  
    const cancelButton = document.createElement('button');
    cancelButton.classList.add(...useStyle(['actionButton','hiddenButton','cancelButton']));
    cancelButton.innerHTML='<i class="fa-solid fa-square-xmark"></i>';
    actions.appendChild(cancelButton);
  
    const deleteButton = document.createElement('button');
    deleteButton.classList.add(...useStyle(['actionButton','deleteButton']));
    deleteButton.innerHTML='<i class="fa-solid fa-trash"></i>';
    actions.appendChild(deleteButton);
  
    purchase.appendChild(actions);

    deleteButton.addEventListener('click',()=>{
        deleteButton.classList.add(...useStyle('hiddenButton'));
        saveButton.classList.remove(...useStyle('hiddenButton'));
        cancelButton.classList.remove(...useStyle('hiddenButton'));
    });
    
    saveButton.addEventListener('click', () => {
        deleteOrder(order.orderID);
    });
    cancelButton.addEventListener('click', () => {
        deleteButton.classList.remove(...useStyle('hiddenButton'));
        saveButton.classList.add(...useStyle('hiddenButton'));
        cancelButton.classList.add(...useStyle('hiddenButton'));
    });

    return purchase;
}

const deleteOrder = (orderID) => {
    fetch(`http://localhost:7071/api/Order/Delete?id=${orderID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
        if (response.status === 204) {
        setTimeout(()=>{
            location.reload();
          },200);
        } 
      });
};
  
async function fetchEventDetailsByEventId(eventID){
    const response = await fetch(`http://localhost:8080/events/${eventID}`);
    const eventData = await response.json();
    return eventData;
}
