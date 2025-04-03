let loadItemsClicked = false;

const form = document.querySelector('form');
form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendData(); // Call sendData on form submission
    console.log("Form submitted and default prevented");
});

// Toggle load items
const getItems = () => {
    loadItemsClicked = !loadItemsClicked;
    let table = document.querySelector('table');

    if (loadItemsClicked) {
        table.classList.remove("hide");
        loadInventory();
    } else {
        table.classList.add('hide');
    }
}

// Load items into the table
const loadInventory = () => {
    let tableBody = document.getElementById("inventory-body");
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const items = JSON.parse(xhr.response);
        tableBody.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            let row = `<tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td><button onclick="deleteItem('${item.id}')">Delete</button></td>
            </tr>`;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
        console.log("Inventory loaded");
    });
    xhr.open("GET", "https://zeyo5kqwog.execute-api.us-east-2.amazonaws.com/items");
    xhr.send();
}

// Send new data to the inventory
const sendData = () => {
    const inputs = document.querySelectorAll('input');
    const id = inputs[0].value;
    const name = inputs[1].value;
    const price = parseFloat(inputs[2].value);

    // Input validation
    if (!id || !name || isNaN(price)) {
        document.getElementById("error").classList.remove('hide');
        return;
    } else {
        document.getElementById("error").classList.add("hide");
    }

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://zeyo5kqwog.execute-api.us-east-2.amazonaws.com/items");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        "id": id,
        "price": price,
        "name": name
    }));

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(`Item added: ID=${id}, Price=${price}, Name=${name}`);
        
            inputs[0].value = '';
            inputs[1].value = '';
            inputs[2].value = '';
            if (loadItemsClicked) loadInventory(); 
        } else {
            console.error("Failed to add item");
        }
    };
}

// Delete an item from the inventory
const deleteItem = (id) => {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", `https://zeyo5kqwog.execute-api.us-east-2.amazonaws.com/items/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(`Item deleted: ID=${id}`);
            if (loadItemsClicked) loadInventory(); // Refresh the table after deletion
        } else {
            console.error("Failed to delete item");
        }
    };
}