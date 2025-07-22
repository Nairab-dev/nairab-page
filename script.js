document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();

                document.querySelector(this.getAttribute("href")).scrollIntoView({
                    behavior: "smooth"
                });
            });
        });

        const cart = {};
        const productItems = document.querySelectorAll(".product-item");
        const cartItemsContainer = document.getElementById("cart-items");
        const totalValueSpan = document.getElementById("total-value");
        const checkoutForm = document.getElementById("checkout-form");

        function updateCartDisplay() {
            cartItemsContainer.innerHTML = "";
            let total = 0;

            for (const productName in cart) {
                const item = cart[productName];
                if (item.quantity > 0) {
                    const itemTotal = item.quantity * item.price;
                    total += itemTotal;

                    const cartItemDiv = document.createElement("div");
                    cartItemDiv.classList.add("cart-item");
                    cartItemDiv.innerHTML = `
                        <div class="cart-item-info">
                            <span>${item.name}</span>
                            <small>${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${itemTotal.toFixed(2)}</small>
                        </div>
                        <div class="cart-item-actions">
                            <button class="remove-from-cart-button" data-name="${item.name}">-</button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(cartItemDiv);
                }
            }

            totalValueSpan.textContent = `R$ ${total.toFixed(2)}`;
            updateProductQuantities();
        }

        function updateProductQuantities() {
            productItems.forEach(item => {
                const productName = item.dataset.name;
                const quantitySpan = item.querySelector(".quantity");
                quantitySpan.textContent = cart[productName] ? cart[productName].quantity : 0;
            });
        }

        productItems.forEach(item => {
            const productName = item.dataset.name;
            const productPrice = parseFloat(item.dataset.price);

            const addButton = item.querySelector(".add-to-cart-button");
            const removeButton = item.querySelector(".remove-from-cart-button");

            addButton.addEventListener("click", () => {
                if (!cart[productName]) {
                    cart[productName] = { name: productName, price: productPrice, quantity: 0 };
                }
                cart[productName].quantity++;
                updateCartDisplay();
            });

            removeButton.addEventListener("click", () => {
                if (cart[productName] && cart[productName].quantity > 0) {
                    cart[productName].quantity--;
                    updateCartDisplay();
                }
            });
        });

        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const customerName = document.getElementById("customer-name").value;
            const customerPhone = document.getElementById("customer-phone").value;
            const customerAddress = document.getElementById("customer-address").value;
            const customerComplement = document.getElementById("customer-complement").value;
            const customerNotes = document.getElementById("customer-notes").value;

            let orderDetails = "";
            let totalOrderValue = 0;

            for (const productName in cart) {
                const item = cart[productName];
                if (item.quantity > 0) {
                    orderDetails += `${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)} cada) - Total: R$ ${(item.quantity * item.price).toFixed(2)}\n`;
                    totalOrderValue += item.quantity * item.price;
                }
            }

            if (orderDetails === "") {
                alert("Seu carrinho está vazio. Adicione produtos antes de finalizar o pedido.");
                return;
            }

            const whatsappMessage = `Olá, Nairab! Gostaria de fazer o seguinte pedido:\n\n` +
                        `*Itens do Pedido:*\n${orderDetails}\n` +
                        `*Valor Total:* R$ ${totalOrderValue.toFixed(2)}\n\n` +
                        `*Dados para Entrega:*\n` +
                        `Nome: ${customerName}\n` +
                        `Telefone: ${customerPhone}\n` +
                        `Endereço: ${customerAddress}\n` +
                        (customerComplement ? `Complemento: ${customerComplement}\n` : ``) +
                        (customerNotes ? `Observações: ${customerNotes}\n` : ``) +
                        `\nObrigado!`;

            const whatsappUrl = `https://wa.me/5521971342883?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, "_blank"); // "_blank" é o correto aqui
        });

        updateCartDisplay(); // Inicializa a exibição do carrinho