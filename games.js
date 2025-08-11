document.addEventListener('DOMContentLoaded', function() {
    const gamesGrid = document.getElementById('games-grid');
    const gameSearch = document.getElementById('game-search');
    const genreFilter = document.getElementById('genre-filter');
    const sortBy = document.getElementById('sort-by');
    
    // بيانات الألعاب (يمكن استبدالها ببيانات حقيقية من قاعدة بيانات)
    const games = [
        {
            id: 1,
            title: "Hell mode v1.5.7",
            image: "Photos/Hell mode.jpg",
            description: "لعبة مغامرات مثيرة في الجحيم الابدي رعب مغامرات",
            genre: "adventure",
            price: 100,
            rating: 4.7,
            releaseDate: "2023-05-15",
            isOwned: true
        },
        {
            id: 2,
            title: "معركة الأبطال",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة أكشن متعددة اللاعبين",
            genre: "action",
            price: 19.99,
            rating: 4.2,
            releaseDate: "2023-07-20",
            isOwned: true
        },
        {
            id: 3,
            title: "مملكة السحر",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة تقمص أدوار إستراتيجية",
            genre: "rpg",
            price: 39.99,
            rating: 4.8,
            releaseDate: "2023-01-10",
            isOwned: false
        },
        {
            id: 4,
            title: "مدينة الأحلام",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة محاكاة بناء مدينة",
            genre: "strategy",
            price: 24.99,
            rating: 4.3,
            releaseDate: "2023-03-30",
            isOwned: false
        },
        {
            id: 5,
            title: "كأس العالم 2023",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة كرة القدم الرسمية",
            genre: "sports",
            price: 49.99,
            rating: 4.6,
            releaseDate: "2023-06-01",
            isOwned: false
        },
        {
            id: 6,
            title: "الفضاء الغامض",
            image: "Photos/Cooming Soon.jpg",
            description: "لعبة مغامرات فضائية",
            genre: "adventure",
            price: 34.99,
            rating: 4.4,
            releaseDate: "2023-04-22",
            isOwned: false
        }
    ];
    
    // عرض الألعاب
    function renderGames(filteredGames = games) {
        gamesGrid.innerHTML = '';
        
        if (filteredGames.length === 0) {
            gamesGrid.innerHTML = '<p>لا توجد ألعاب متطابقة مع بحثك.</p>';
            return;
        }
        
        filteredGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.title}">
                <h4>${game.title}</h4>
                <div class="game-info">
                    <span class="genre">${getGenreName(game.genre)}</span>
                    <span class="rating"><i class="fas fa-star"></i> ${game.rating}</span>
                </div>
                <p>${game.description}</p>
                <div class="game-footer">
                    <span class="price">${game.price} $</span>
                    ${game.isOwned ? 
                        '<button class="play-btn"><i class="fas fa-play"></i> تشغيل</button>' : 
                        '<button class="buy-btn" data-id="${game.id}"><i class="fas fa-shopping-cart"></i> شراء</button>'}
                </div>
            `;
            
            gamesGrid.appendChild(gameCard);
        });
        
        // إضافة حدث لزر الشراء
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const gameId = parseInt(this.getAttribute('data-id'));
                const game = games.find(g => g.id === gameId);
                addToCart(game);
            });
        });
    }
    
    // الحصول على اسم النوع
    function getGenreName(genre) {
        const genres = {
            'action': 'أكشن',
            'adventure': 'مغامرات',
            'rpg': 'ألعاب تقمص أدوار',
            'strategy': 'إستراتيجية',
            'sports': 'رياضة'
        };
        return genres[genre] || genre;
    }
    
    // تصفية الألعاب
    function filterGames() {
        const searchTerm = gameSearch.value.toLowerCase();
        const genre = genreFilter.value;
        const sort = sortBy.value;
        
        let filtered = games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm) || 
                                game.description.toLowerCase().includes(searchTerm);
            const matchesGenre = !genre || game.genre === genre;
            return matchesSearch && matchesGenre;
        });
        
        // ترتيب الألعاب
        switch(sort) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            default: // الأكثر شعبية
                filtered.sort((a, b) => b.rating - a.rating);
        }
        
        renderGames(filtered);
    }
    
    // إضافة إلى عربة التسوق
    function addToCart(game) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === game.id);
        
        if (!existingItem) {
            cart.push({
                id: game.id,
                title: game.title,
                price: game.price,
                image: game.image,
                quantity: 1
            });
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showAlert(`تمت إضافة ${game.title} إلى عربة التسوق`, 'success');
        } else {
            showAlert('هذه اللعبة موجودة بالفعل في عربة التسوق', 'error');
        }
    }
    
    // تحديث عدد العناصر في عربة التسوق
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }
    
    // أحداث البحث والتصفية
    gameSearch.addEventListener('input', filterGames);
    genreFilter.addEventListener('change', filterGames);
    sortBy.addEventListener('change', filterGames);
    
    // التهيئة الأولية
    renderGames();
    updateCartCount();
});