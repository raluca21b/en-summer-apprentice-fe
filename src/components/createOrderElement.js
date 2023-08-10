import { addLoader, removeLoader } from "./loader";
import { useStyle } from "./styles";


export const createOrderElement = (order) =>{
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
  
    return purchase;
  }
  