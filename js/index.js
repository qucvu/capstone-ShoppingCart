/**
 * Shopping cart online
 * 1. Hiển thị danh sách
 * 2. Render sản phẩm theo tìm kiếm
 * 3. Thêm sản phẩm vào cart, tạo thêm thuộc tính quantity cart
 * 4. In giỏ hàng
 * 5. Chỉnh sửa số lượng
 * 6. Tổng tiền
 * 7. Nút thanh toán giỏ hàng
 * 8. Lưu giỏ hàng về localStorage
 * 9. Xóa sản phẩm khỏi giỏ hàng
 */

// import { Product } from "../Models/Product.js";
let productList = [];
let carts = [];

const fetchProducts = async () => {
  try {
    const result = await axios({
      url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
      method: "GET",
    });
    productList = mapProdudct(result.data);
    renderProducts();
  } catch (error) {
    console.log(error);
  }
};

const renderProducts = (listData) => {
  listData = listData || productList;
  let productHtml = ``;
  listData.forEach((item) => {
    productHtml += `
      <div class="col-lg-4 col-md-6 mb-lg-4 mb-md-3">
        <div class="card item pt-3">
          <div class="text-center"><img src=${item.img} alt=${item.name} class="img-fluid product-img"  ></div>
          <div class="card-body">
            <h1 class="card-title product-title">${item.name}</h1>
            <p class="card-text product-desc">
              ${item.desc}
            </p>
          </div>
          <button class="btn btn-success m-3" onclick="selectedProduct('${item.id}')"> Add to cart <i class="fa fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;
  });
  document.getElementById("product-list").innerHTML = productHtml;
};

const filterProducts = (e) => {
  // let samsungList = [];
  // let iphoneList =
  if (e.target.value === "0") renderProducts();
  else {
    let productTypeList = productList.filter((product) => {
      if (product.type === e.target.value) return product;
    });
    renderProducts(productTypeList);
  }
};

const findProductById = (id, listData) => {
  return listData.find((item) => {
    return item.id === id;
  });
};

const selectedProduct = (id) => {
  const product = findProductById(id, productList);
  const productCart = findProductById(id, carts);
  if (!productCart) {
    carts.push({ ...product, quantityCart: 1 });
    renderCarts();
  } else {
    productCart.quantityCart += 1;
    renderCarts();
  }
};

const renderCarts = () => {
  let cartHtml = "";
  carts.forEach((item) => {
    console.log(item.quantityCart, item.quantity);
    if (item.quantityCart === 1) {
      cartHtml += `
    <tr>
      <td><img src=${item.img} alt=${item.name} class = "img-carts"></td>
      <td>${item.name}</td>
      <td>${item.price}đ</td>
      <td>
      <button id="btn-cart-decrease-${
        item.id
      }" class="btn btn-info" disabled onclick="adjustProductCart('${
        item.id
      }', -1)">-</button>
      ${item.quantityCart}
      <button id="btn-cart-increase-${
        item.id
      }" class="btn btn-info" onclick="adjustProductCart('${
        item.id
      }', 1)">+</button>
      </td>
      <td>${item.price * item.quantityCart}đ</td>
      <td><button class="btn btn-danger" onclick="handleDeleteItem('${
        item.id
      }')">X</button></td>
    </tr>
    `;
    } else if (item.quantityCart === parseInt(item.quantity)) {
      cartHtml += `
    <tr>
      <td><img src=${item.img} alt=${item.name} class = "img-carts"></td>
      <td>${item.name}</td>
      <td>${item.price}đ</td>
      <td>
      <button id="btn-cart-decrease-${
        item.id
      }" class="btn btn-info"  onclick="adjustProductCart('${
        item.id
      }', -1)">-</button>
      ${item.quantityCart}
      <button id="btn-cart-increase-${
        item.id
      }" disabled class="btn btn-info" onclick="adjustProductCart('${
        item.id
      }', 1)">+</button>
      </td>
      <td>${item.price * item.quantityCart}đ</td>
      <td><button class="btn btn-danger" onclick="handleDeleteItem('${
        item.id
      }')">X</button></td>
    </tr>
    `;
    } else {
      cartHtml += `
    <tr>
      <td><img src=${item.img} alt=${item.name} class = "img-carts"></td>
      <td>${item.name}</td>
      <td>${item.price}đ</td>
      <td>
      <button id="btn-cart-decrease-${
        item.id
      }" class="btn btn-info" onclick="adjustProductCart('${
        item.id
      }', -1)">-</button>
      ${item.quantityCart}
      <button id="btn-cart-increase-${
        item.id
      }" class="btn btn-info" onclick="adjustProductCart('${
        item.id
      }', 1)">+</button>
      </td>
      <td>${item.price * item.quantityCart}đ</td>
      <td><button class="btn btn-danger" onclick="handleDeleteItem('${
        item.id
      }')">X</button></td>
    </tr>
    `;
    }
  });
  if (carts.length === 0) {
    document.getElementById("carts").style.display = "none";
  } else {
    document.getElementById("carts").style.display = "block";
  }

  document.getElementById("js-carts-list").innerHTML = cartHtml;
  document.getElementById("js-total-money").innerHTML = totalMoney() + "đ";
  saveData(carts);
};

// const checkDisabled = (params) => {
//   return Boolean(params);
// };

const mapProdudct = (data) => {
  return data.map((product) => {
    return new Product(
      product.name,
      product.price,
      product.screen,
      product.backCamera,
      product.frontCamera,
      product.img,
      product.desc,
      product.type,
      product.id,
      product.quantity
    );
  });
};

const adjustProductCart = (id, mode) => {
  const productCart = findProductById(id, carts);
  if (productCart) {
    productCart.quantityCart += mode;
  }
  renderCarts();
};

const handleDeleteItem = (id) => {
  const productCart = findProductById(id, carts);
  if (confirm(`Sản phẩm ${productCart.name} sẽ được xóa khỏi giỏ hàng!!`)) {
    const index = carts.findIndex((item) => item.id === id);
    carts.splice(index, 1);
    renderCarts();
  }
};

const saveData = (carts) => {
  localStorage.setItem("cartList", JSON.stringify(carts));
};

const loadData = () => {
  if (localStorage.getItem("cartList")) {
    carts = JSON.parse(localStorage.getItem("cartList"));
    renderCarts();
  }
  document.getElementById("carts").style.display = "block";
};

const totalMoney = () => {
  return carts.reduce((total, item) => {
    return (total += item.price * item.quantityCart);
  }, 0);
};

document
  .getElementById("js-selectFilter")
  .addEventListener("change", filterProducts);
document.getElementById("btn-payment").addEventListener("click", () => {
  if (confirm("Bạn có chắc là muốn thanh toán không?")) {
    carts = [];
    renderCarts();
  }
});

fetchProducts();
loadData();
renderCarts();
