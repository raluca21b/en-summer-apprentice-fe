import { useStyle } from "./styles";
import { addLoader,removeLoader } from "./loader";

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
    purchaseType.setAttribute('disabled', 'true');
    
    const categories = [
        { value: 'Standard', text: 'Standard' },
        { value: 'VIP', text: 'VIP' }
    ];
    
    const options = categories.map(
        (category) =>
            `<option class="text-sm font-bold text-black" value="${category.value}"
            ${category.value === order.ticketCategory.description ? 'selected' : ''}>
             ${category.text}</option>`
    ).join('\n');
    
    purchaseType.innerHTML = options;

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

    editButton.addEventListener('click',() =>{
        editButton.classList.add(...useStyle('hiddenButton'));
        saveButton.classList.remove(...useStyle('hiddenButton'));
        cancelButton.classList.remove(...useStyle('hiddenButton'));
        purchaseQuantity.removeAttribute('disabled');
        purchaseType.removeAttribute('disabled');
    });

    deleteButton.addEventListener('click',()=>{
        const response = confirm("Are you sure you want to delete the order?");
        if (response){
             deleteOrder(order.orderID);
        }
    });
    
    saveButton.addEventListener('click', () => {
       const newCategory = purchaseType.value;
       const newQuantity = purchaseQuantity.value;
       if (newCategory != order.ticketCategory.description || newQuantity != order.numberOfTickets){
          addLoader();
          updateOrder(order,newCategory,newQuantity)
            .then((res)=>{
                if (res.status === 200){
                    res.json().then((data) =>{
                        order = data;
                        purchasePrice.innerHTML = order.totalPrice;
                    }); 
                }
            })
            .catch((err) =>{
                console.error(err);
            })
            .finally(()=>{
                setTimeout(() => 
                {
                    removeLoader()
                },200);
            });
        }
        editButton.classList.remove(...useStyle('hiddenButton'));
        saveButton.classList.add(...useStyle('hiddenButton'));
        cancelButton.classList.add(...useStyle('hiddenButton'));
        purchaseQuantity.setAttribute('disabled','true');
        purchaseType.setAttribute('disabled','true');
    });

    cancelButton.addEventListener('click', () => {
        editButton.classList.remove(...useStyle('hiddenButton'));
        saveButton.classList.add(...useStyle('hiddenButton'));
        cancelButton.classList.add(...useStyle('hiddenButton'));
        purchaseQuantity.setAttribute('disabled','true');
        purchaseType.setAttribute('disabled','true');

        purchaseQuantity.value = order.numberOfTickets;
        Array.from(purchaseType.options).forEach(function(element,index){
            if (element.value == order.ticketCategory.description){
                purchaseType.options.selectedIndex = index;
                return;
            }
        })
    });

    return purchase;
}

const deleteOrder = (orderID) => {
    addLoader();
    fetch(`http://localhost:7071/api/Order/Delete?id=${orderID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
        if (response.status === 204) {
            const purchaseToRemove = document.getElementById(`purchase-${orderID}`);
            purchaseToRemove.remove();
        } 
    }).catch((err)=>{
        console.error(err);
    }).finally(()=>{
        removeLoader();
    });
};

function updateOrder(order, newCategory, newQuantity){
   return fetch(`http://localhost:7071/api/Order/Patch`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: order.orderID,
                eventID: order.eventID,
                ticketDescription: newCategory,
                numberOfTickets: newQuantity
            })
        })
        .then((res) => {
            if (res.status === 200) {
                //here comes toastr for success
            } else {
                //here comes toastr for
            }
            return res;
        })
        .catch((err) =>{
            throw new Error(err);
        });
}
  
async function fetchEventDetailsByEventId(eventID){
    const response = await fetch(`http://localhost:8080/events/${eventID}`);
    const eventData = await response.json();
    return eventData;
}
