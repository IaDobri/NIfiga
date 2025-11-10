class TechStoreApp {
    constructor() {
        this.cart = new ProductCart();
        this.validator = new FormValidator();
        this.products = [
            {
                id: "1",
                name: "Наушники Apple AirPods Pro 2 generation MagSafe Case USB-C (MTJV3)",
                description: "Наушники Apple AirPods Pro (MTJV3) — модель типа вкладыши в корпус из пластика, амбушюры сделаны из силикона.",
                price: 22999,
                image: "images/airpods.avif"
            },
            {
                id: "2",
                name: "Наушники студийные Axelvox AX81",
                description: "Студийные наушники Axelvox AX81 подключаются к совместимым устройствам с помощью провода 2,5 м.",
                price: 4607,
                image: "images/dj.avif"
            },
            {
                id: "3",
                name: "Наушники накладные Bluetooth HIPER HTW-QTX27",
                description: "Наушники накладные Bluetooth Hiper HTW-QTX27 подключаются через Bluetooth 5.3.",
                price: 1499,
                image: "images/hiper.avif"
            },
            {
                id: "4",
                name: "Наушники True Wireless HUAWEI FreeBuds SE 2 T0016 White",
                description: "Наушники True Wireless HUAWEI FreeBuds SE 2 T0016 White с полуоткрытым акустическим оформлением оборудованы микрофоном для использования в качестве гарнитуры.",
                price: 2199,
                image: "images/huawei.avif"
            },
            {
                id: "5",
                name: "Игровые наушники Logitech G733 Lightspeed Black",
                description: "Игровые наушники Logitech G733 Lightspeed Black (981-000864) закрытого типа с чувствительностью 87,5 дБ.",
                price: 12799,
                image: "images/mgame.avif"
            },
            {
                id: "6",
                name: "Наушники Sony WH-1000XM5 Silver",
                description: "Накладные наушники Sony WH-1000XM5 Silver с оголовьем и амбушюрами серебристого цвета для подключения к устройствам технологии Bluetooth 5.2.",
                price: 34223,
                image: "images/sony.avif"
            }
        ];
        this.init();
    }

    init() {
        this.renderProducts();
        this.setupEventListeners();
        this.setup404Handlers();
    }

    renderProducts() {
        const productsGrid = document.getElementById("productsGrid");
        productsGrid.innerHTML = "";
        
        this.products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price.toLocaleString()} руб.</div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        this.addProductEventListeners();
    }

    addProductEventListeners() {
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.getAttribute("data-id");
                const product = this.products.find(p => p.id === productId);
                
                if (product) {
                    this.cart.addProduct(product);
                    e.target.textContent = "Добавлено!";
                    e.target.style.backgroundColor = "#28a745";
                    
                    setTimeout(() => {
                        e.target.textContent = "Добавить в корзину";
                        e.target.style.backgroundColor = "";
                    }, 1000);
                }
            });
        });
    }

    setupEventListeners() {
        // Открытие корзины
        document.getElementById("cartIcon").addEventListener("click", () => {
            document.getElementById("cartModal").style.display = "flex";
        });

        document.getElementById("cartIcon").addEventListener("keypress", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                document.getElementById("cartModal").style.display = "flex";
            }
        });

        // Закрытие корзины
        document.getElementById("closeCart").addEventListener("click", () => {
            document.getElementById("cartModal").style.display = "none";
        });

        document.getElementById("cartModal").addEventListener("click", (e) => {
            if (e.target === document.getElementById("cartModal")) {
                document.getElementById("cartModal").style.display = "none";
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                document.getElementById("cartModal").style.display = "none";
            }
        });

        // Поиск товаров
        document.getElementById("searchInput").addEventListener("input", (e) => {
            this.filterProducts(e.target.value);
        });

        // Оформление заказа
        document.getElementById("checkoutBtn").addEventListener("click", () => {
            if (this.cart.items.length !== 0) {
                document.getElementById("cartModal").style.display = "none";
                this.showSection('checkout');
            } else {
                alert("Корзина пуста");
            }
        });

        // Форма заказа
        document.getElementById("checkoutForm").addEventListener("submit", (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                address: document.getElementById("address").value
            };
            
            this.validator.clearErrors();
            
            if (this.validator.validateForm(formData)) {
                alert("Заказ успешно оформлен! Спасибо за покупку.");
                this.cart.clearCart();
                this.showSection('catalog');
                document.getElementById("checkoutForm").reset();
            }
        });

        // Валидация полей формы
        document.querySelectorAll("#checkoutForm .form-input").forEach(input => {
            input.addEventListener("blur", () => {
                this.validateField(input);
            });
            
            input.addEventListener("input", () => {
                const fieldId = input.id;
                const errorElement = document.getElementById(`${fieldId}Error`);
                
                if (errorElement) {
                    errorElement.style.display = "none";
                    input.classList.remove("error");
                }
            });
        });
    }

    setup404Handlers() {
        const goHomeBtn = document.getElementById('goHomeBtn');
        const goCatalogBtn = document.getElementById('goCatalogBtn');
        
        if (goHomeBtn) {
            goHomeBtn.addEventListener('click', () => {
                this.showSection('catalog');
            });
        }
        
        if (goCatalogBtn) {
            goCatalogBtn.addEventListener('click', () => {
                this.showSection('catalog');
            });
        }
    }

    showSection(sectionId) {
        // Скрыть все секции
        document.getElementById('catalog').style.display = 'none';
        document.getElementById('checkout').style.display = 'none';
        document.getElementById('error404').style.display = 'none';
        
        // Показать нужную секцию
        document.getElementById(sectionId).style.display = 'block';
    }

    filterProducts(searchTerm) {
        const filteredProducts = searchTerm 
            ? this.products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : this.products;
        
        const productsGrid = document.getElementById("productsGrid");
        productsGrid.innerHTML = "";
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<div class="no-products">Товары не найдены</div>';
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${product.price.toLocaleString()} руб.</div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        this.addProductEventListeners();
    }

    validateField(input) {
        const fieldId = input.id;
        const value = input.value.trim();
        
        switch (fieldId) {
            case "name":
                if (!value) {
                    this.validator.showFieldError(fieldId, "Имя обязательно для заполнения");
                }
                break;
            case "email":
                if (!value) {
                    this.validator.showFieldError(fieldId, "Email обязателен для заполнения");
                } else if (!this.validator.isValidEmail(value)) {
                    this.validator.showFieldError(fieldId, "Введите корректный email");
                }
                break;
            case "phone":
                if (!value) {
                    this.validator.showFieldError(fieldId, "Телефон обязателен для заполнения");
                } else if (!this.validator.isValidPhone(value)) {
                    this.validator.showFieldError(fieldId, "Введите корректный номер телефона");
                }
                break;
            case "address":
                if (!value) {
                    this.validator.showFieldError(fieldId, "Адрес обязателен для заполнения");
                }
                break;
        }
    }
}

// Функция для показа страницы 404 (можно вызвать из консоли для тестирования)
function show404Page() {
    document.getElementById('catalog').style.display = 'none';
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('error404').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    new TechStoreApp();
});
