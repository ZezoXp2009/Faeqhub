document.addEventListener('DOMContentLoaded', function() {
    const storeGrid = document.getElementById('store-grid');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // بيانات المتجر (يمكن استبدالها ببيانات حقيقية من قاعدة بيانات)
    const storeItems = [
        {
            id: 1,
            title: "Hell Mode v1.5.7",
            image: "Photos/Hell mode.jpg",
            description: "لعبة مثيرة رعب واكشن في عالم الجحيم",
            price: 100,
            discount: 100,
            isNew: true
        },
        {
            id: 2,
            title: "معركة الأبطال",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة أكشن متعددة اللاعبين",
            price: 19.99,
            discount: 0,
            isNew: false
        },
        {
            id: 3,
            title: "مملكة السحر",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة تقمص أدوار إستراتيجية",
            price: 39.99,
            discount: 30,
            isNew: true
        },
        {
            id: 4,
            title: "مدينة الأحلام",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة محاكاة بناء مدينة",
            price: 24.99,
            discount: 15,
            isNew: false
        },
        {
            id: 5,
            title: "كأس العالم 2023",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة كرة القدم الرسمية",
            price: 49.99,
            discount: 10,
            isNew: false
        },
        {
            id: 6,
            title: "الفضاء الغامض",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة مغامرات فضائية",
            price: 34.99,
            discount: 25,
            isNew: true
        },
        {
            id: 7,
            title: "حرب الروبوتات",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة إستراتيجية مستقبلية",
            price: 27.99,
            discount: 0,
            isNew: false
        },
        {
            id: 8,
            title: "مزرعة العائلة",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة محاكاة مزرعة",
            price: 14.99,
            discount: 20,
            isNew: false
        }
    ];
    
    // عرض عناصر المتجر
    function renderStoreItems() {
        storeGrid.innerHTML = '';
        
        storeItems.forEach(item => {
            const storeItem = document.createElement('div');
            storeItem.className = 'store-item';
            
            const discountBadge = item.discount > 0 ? 
                `<span class="discount-badge">-${item.discount}%</span>` : '';
            const newBadge = item.isNew ? '<span class="new-badge">جديد</span>' : '';
            const originalPrice = item.discount > 0 ? 
                `<span class="original-price">${item.price.toFixed(2)} $</span>` : '';
            const finalPrice = item.discount > 0 ? 
                (item.price * (1 - item.discount / 100)).toFixed(2) : item.price.toFixed(2);
            
            storeItem.innerHTML = `
                <div class="item-badges">
                    ${discountBadge}
                    ${newBadge}
                </div>
                <img src="${item.image}" alt="${item.title}">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <div class="item-price">
                    ${originalPrice}
                    <span class="final-price">${finalPrice} $</span>
                </div>
                <button class="add-to-cart-btn" data-id="${item.id}">
                    <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                </button>
            `;
            
            storeGrid.appendChild(storeItem);
        });
        
        // إضافة حدث لأزرار إضافة إلى السلة
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const item = storeItems.find(i => i.id === itemId);
                addToCart(item);
            });
        });
    }
    
    // إضافة إلى عربة التسوق
    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                title: item.title,
                price: item.discount > 0 ? 
                    (item.price * (1 - item.discount / 100)) : item.price,
                image: item.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showAlert(`تمت إضافة ${item.title} إلى عربة التسوق`, 'success');
    }
    
    // عرض عربة التسوق
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>عربة التسوق فارغة</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h5>${item.title}</h5>
                    <p>${item.price.toFixed(2)} $ × ${item.quantity} = ${itemTotal.toFixed(2)} $</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // إضافة الأحداث لأزرار الكمية والإزالة
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const isPlus = this.classList.contains('plus');
                updateCartItemQuantity(itemId, isPlus);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                removeFromCart(itemId);
            });
        });
    }
    
    // تحديث كمية العنصر في عربة التسوق
    function updateCartItemQuantity(itemId, isPlus) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === itemId);
        
        if (itemIndex !== -1) {
            if (isPlus) {
                cart[itemIndex].quantity += 1;
            } else {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                } else {
                    cart.splice(itemIndex, 1);
                }
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    }
    
    // إزالة عنصر من عربة التسوق
    function removeFromCart(itemId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== itemId);
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
    
    // تحديث عدد العناصر في عربة التسوق
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // إتمام عملية الشراء
    function checkout() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            showAlert('عربة التسوق فارغة', 'error');
            return;
        }
        
        if (!currentUser) {
            showAlert('يجب تسجيل الدخول لإتمام عملية الشراء', 'error');
            document.getElementById('login-modal').style.display = 'flex';
            return;
        }
        
        // هنا يجب إضافة عملية الدفع الحقيقية
        // في هذا المثال سنقوم فقط بحفظ المشتريات وتفريغ عربة التسوق
        
        // حفظ المشتريات
        const purchases = JSON.parse(localStorage.getItem('purchases')) || [];
        const newPurchases = cart.map(item => ({
            ...item,
            purchaseDate: new Date().toISOString()
        }));
        
        localStorage.setItem('purchases', JSON.stringify([...purchases, ...newPurchases]));
        
        // تفريغ عربة التسوق
        localStorage.removeItem('cart');
        
        // تحديث الواجهة
        renderCart();
        updateCartCount();
        
        // إغلاق نافذة عربة التسوق
        cartModal.style.display = 'none';
        
        showAlert('تمت عملية الشراء بنجاح! شكرًا لشرائك من GameHub', 'success');
    }
    
    // الأحداث
    cartBtn.addEventListener('click', function() {
        renderCart();
        cartModal.style.display = 'flex';
    });
    
    checkoutBtn.addEventListener('click', checkout);
    
    // إغلاق نافذة عربة التسوق عند النقر خارجها
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // التهيئة الأولية
    renderStoreItems();
    updateCartCount();
});