const bookOfStyles = {
    purchase:[
        'bg-white',
        'px-4',
        'py-4',
        'gap-x-4',
        'sm:border-b',
        'sm:border-gray-200',
        'flex',
    ],
    purchaseTitle: [
        'text-lg',
        'font-medium',
        'text-orange-700',
        'flex-1'
    ],
    purchaseQuantity:[
        
    ]
}

export function useStyle(type){
    if (typeof type =='string') return bookOfStyles[type];
    else{
        const allStyles = type.map((t) => bookOfStyles[t]);
        return allStyles.flat();
    }
}
