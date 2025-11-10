class ProductCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("cart")) || [];
        this.updateCartDisplay();
    }

    addProduct(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    removeProduct(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeProduct(productId);
        } else {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem("cart", JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById("cartCount");
        const cartBody = document.getElementById("cartBody");
        const cartTotal = document.getElementById("cartTotal");
        const checkoutBtn = document.getElementById("checkoutBtn");
        
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) cartCount.textContent = totalItems;
        
        if (cartBody) {
            cartBody.innerHTML = "";
            
            if (this.items.length === 0) {
                cartBody.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
                if (cartTotal) cartTotal.textContent = "0 руб.";
                if (checkoutBtn) checkoutBtn.disabled = true;
                return;
            }
            
            if (checkoutBtn) checkoutBtn.disabled = false;
            
            this.items.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-title">${this.escapeHtml(item.name)}</div>
                        <div class="cart-item-price">${item.price} руб.</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Удалить</button>
                `;
                cartBody.appendChild(cartItem);
            });
            
            if (cartTotal) cartTotal.textContent = `${this.calculateTotal()} руб.`;
            this.addCartEventListeners();
        }
    }

    addCartEventListeners() {
        // Кнопки уменьшения количества
        document.querySelectorAll(".quantity-btn.minus").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Кнопки увеличения количества
        document.querySelectorAll(".quantity-btn.plus").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Поля ввода количества
        document.querySelectorAll(".quantity-input").forEach(input => {
            input.addEventListener("change", (e) => {
                const productId = e.target.getAttribute("data-id");
                const newQuantity = parseInt(e.target.value);
                
                if (!isNaN(newQuantity) && newQuantity > 0) {
                    this.updateQuantity(productId, newQuantity);
                } else {
                    const item = this.items.find(item => item.id === productId);
                    if (item) {
                        e.target.value = item.quantity;
                    }
                }
            });
        });

        // Кнопки удаления
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");
                this.removeProduct(productId);
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}