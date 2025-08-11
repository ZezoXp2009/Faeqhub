document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const themeToggle = document.getElementById('theme-toggle');
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeBtns = document.querySelectorAll('.close-btn');
    const registerLink = document.getElementById('register-link');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const commentForm = document.getElementById('comment-form');
    const commentsContainer = document.getElementById('comments-container');
    
    // حالة المستخدم
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // تهيئة الوضع (فاتح/غامق)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
    updateUI();
    
    // تبديل الوضع الفاتح/الغامق
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
    
    // فتح نافذة تسجيل الدخول
    loginBtn.addEventListener('click', function() {
        if (currentUser) {
            logout();
        } else {
            loginModal.style.display = 'flex';
        }
    });
    
    // إغلاق النوافذ المنبثقة
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // الانتقال إلى نافذة التسجيل
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }
    
    // تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // هنا يجب التحقق من صحة بيانات المستخدم (في تطبيق حقيقي يتم التواصل مع الخادم)
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUI();
                showAlert('تم تسجيل الدخول بنجاح!', 'success');
                loginModal.style.display = 'none';
                loginForm.reset();
            } else {
                showAlert('اسم المستخدم أو كلمة المرور غير صحيحة!', 'error');
            }
        });
    }
    
    // التسجيل
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('new-username').value;
            const email = document.getElementById('new-email').value;
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (password !== confirmPassword) {
                showAlert('كلمة المرور غير متطابقة!', 'error');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            if (users.some(u => u.username === username)) {
                showAlert('اسم المستخدم موجود مسبقًا!', 'error');
                return;
            }
            
            const newUser = {
                username,
                email,
                password
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showAlert('تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.', 'success');
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
            registerForm.reset();
        });
    }
    
    // إضافة تعليق
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const commentText = document.getElementById('comment-text').value;
            
            if (!currentUser) {
                showAlert('يجب تسجيل الدخول لإضافة تعليق!', 'error');
                loginModal.style.display = 'flex';
                return;
            }
            
            const newComment = {
                id: Date.now(),
                author: currentUser.username,
                text: commentText,
                date: new Date().toLocaleString()
            };
            
            comments.unshift(newComment);
            localStorage.setItem('comments', JSON.stringify(comments));
            
            renderComments();
            commentForm.reset();
            showAlert('تم إضافة تعليقك بنجاح!', 'success');
        });
    }
    
    // عرض التعليقات
    function renderComments() {
        if (!commentsContainer) return;
        
        commentsContainer.innerHTML = '';
        
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p>لا توجد تعليقات بعد. كن أول من يعلق!</p>';
            return;
        }
        
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            
            const firstLetter = comment.author.charAt(0).toUpperCase();
            
            commentEl.innerHTML = `
                <div class="comment-header">
                    <div class="comment-avatar">${firstLetter}</div>
                    <div>
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                </div>
                <div class="comment-text">${comment.text}</div>
            `;
            
            commentsContainer.appendChild(commentEl);
        });
    }
    
    // تسجيل الخروج
    function logout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateUI();
        showAlert('تم تسجيل الخروج بنجاح!', 'success');
    }
    
    // تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
    function updateUI() {
        if (loginBtn) {
            if (currentUser) {
                loginBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> تسجيل الخروج`;
                loginBtn.title = currentUser.username;
            } else {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> تسجيل الدخول`;
                loginBtn.removeAttribute('title');
            }
        }
        
        renderComments();
    }
    
    // عرض رسائل التنبيه
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
    
    // إغلاق النوافذ عند النقر خارجها
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // تحميل التعليقات عند بدء التشغيل
    renderComments();
});