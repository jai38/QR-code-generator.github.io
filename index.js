const displayQR = () => {
  const productNames = JSON.parse(
    sessionStorage.getItem("currentProductNames")
  );
  const productLinks = JSON.parse(
    sessionStorage.getItem("currentProductLinks")
  );
  //   const qrCodeContainer = document.getElementById("qr-code-container");
  let qrCodes = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
      crossorigin="anonymous"
    />
    <script
      src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
      integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
      integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
      crossorigin="anonymous"
    ></script>
    <title>QR code Generator</title>
    <style>
      .qr-code-col {
        display: flex;
        width: 150px;
        height: 350px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /* margin: 30px; */
      }
      .img-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        height: 200px;
        background-color: #f0efef;
        border-radius: 10px 10px 0px 0px;
      }
      .img-container img {
        width: 140px;
        height: 140px;
      }
      .product-text {
        text-align: center;
        border-radius: 10px;
        font-weight: 500;
        background-color: #ffdb15;
        width: 220px;
        padding: 8px;
      }
      .brand-text {
        margin-top: 10px;
        font-weight: 500;
      }
    </style>
  </head>
  <body onload="displayQR()">
    <div id="qr-code-container" class="row">`;
  productNames.forEach((name, index) => {
    qrCodes += `<div class="col-3 qr-code-col">
      <div class="img-container">
        <img
          src="${productLinks[index]}"
          alt=""
        />
      </div>
      <div class="product-text">${
        name.length <= 45 ? name : name.substring(0, 45) + " . . ."
      }</div>
      <div class="brand-text">MATERIAL DEPOT</div>
    </div>`;
  });
  qrCodes += `</div>
</body>
</html>`;
  //   qrCodeContainer.innerHTML = qrCodes;
  const win = window.open("", "", "");
  win.document.write(qrCodes);
  win.document.close();
  win.print();
};
const generateQR = async (productTitle) => {
  let currentProductNames = [];
  let currentProductLinks = [];
  let names = [];
  let links = [];
  const res = await fetch(
    "https://www.material-depot-backend.materialdepot.in/api/products/all-products",
    {
      method: "GET",
    }
  );
  const json = await res.json();
  const products = json.products;
  products.forEach((product) => {
    names.push(product.name);
    links.push(product.imageURL);
  });

  productTitle.forEach((title) => {
    if (title)
      names.forEach((name, index) => {
        if (title.includes(name) && !currentProductNames.includes(name)) {
          currentProductNames.push(name);
          currentProductLinks.push(links[index]);
        }
      });
    sessionStorage.setItem(
      "currentProductNames",
      JSON.stringify(currentProductNames)
    );
    sessionStorage.setItem(
      "currentProductLinks",
      JSON.stringify(currentProductLinks)
    );
  });
  //   window.location.href = "/qrCodes.html";
  displayQR();
  console.log(currentProductLinks);
};
const handleOrderData = (event) => {
  let productTitle = [];
  const rows = event.target.result.split("\n");
  const headingRow = rows[0];
  const headingCell = headingRow.split(",");
  const productTitleIndex = headingCell.indexOf("Lineitem name");
  rows.shift();
  rows.forEach((row) => {
    const cell = row.split(",");
    productTitle.push(cell[productTitleIndex]);
  });
  generateQR(productTitle);
};
const handleOrderCSV = (event) => {
  const fileList = event.target.files;
  console.log(fileList);
  const reader = new FileReader();
  console.log(reader);
  reader.onload = handleOrderData;
  const data = reader.readAsText(fileList[0]);
};
const ordersCSV = document.getElementById("orders-csv");
ordersCSV.addEventListener("change", handleOrderCSV);
