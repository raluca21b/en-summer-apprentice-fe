export function removeDeleteWindow(){
    const loader = document.querySelector('#delete-confirm');
    const header = document.querySelector('header');
    const container = document.querySelector('.main-content-component');
    loader.classList.add('hidden');
    header.classList.remove('opacity-25');
    header.classList.remove('z-[-1]');
    container.classList.remove('hidden');
}

export function addDeleteConfirmationWindow(){
    const loader = document.querySelector('#delete-confirm');
    const header = document.querySelector('header');
    const container = document.querySelector('.main-content-component');
    loader.classList.remove('hidden');
    header.classList.add('opacity-25');
    header.classList.add('z-[-1]');
    container.classList.add('hidden');
}
