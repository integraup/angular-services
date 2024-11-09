const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.get("/api/products", (req, res) => {
  let productsArray = fetchProductsFromDatabase();
  res.send(productsArray);
});

function fetchProductsFromDatabase() {
  return [
    {
      id: 1,
      description:
        "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
      name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
      imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Heads",
      price: 1220.5,
      discount: 0.2,


    },
    {
      id: 17,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Bases",
      price: 1190.5,
      discount: 0,
    },
    {
      id: 6,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Arms",
      price: 275,
      discount: 0,
    },
    {
      id: 2,
      description:
        "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
      name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
      imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Heads",
      price: 945.0,
      discount: 0.2,
    },
    {
      id: 3,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Heads",
      price: 1275.5,
      discount: 0,
    },
    {
      id: 16,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Bases",
      price: 1190.5,
      discount: 0.1,
    },
    {
      id: 13,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Torsos",
      price: 785,
      discount: 0,
    },
    {
      id: 7,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Arms",
      price: 285,
      discount: 0,
    },

    {
      id: 4,
      description:
        "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
      name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
      imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Heads",
      price: 750.0,
      discount: 0,
    },
    {
      id: 9,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Arms",
      price: 230,
      discount: 0.1,
    },
    {
      id: 15,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Bases",
      price: 1520.5,
      discount: 0,
    },
    {
      id: 10,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Arms",
      price: 125,
      discount: 0,
    },
    {
      id: 11,
      description:
        "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
      name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
      imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Torsos",
      price: 1575,
      discount: 0,
    },
    {
      id: 14,
      description:
        "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
      name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
      imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Bases",
      price: 895,
      discount: 0,
    },
    {
      id: 5,
      description:
        "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
      name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
      imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Heads",
      price: 1255.5,
      discount: 0,
    },
    {
      id: 8,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Arms",
      price: 205.5,
      discount: 0,
    },
    {
      id: 12,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Torsos",
      price: 1385,
      discount: 0,
    },
    {
      id: 18,
      description:
      "Composição do produto:Espelho orgânico gota Moldura em couro costurado ou sem costura Suporte em metal p/ fixação Cores disponíveis: Moldura:Caramelo, Preto Medidas:60x40cm",
    name: "ESPELHO ORGÂNICO GOTA MOLDURA EM COURO - VB941",
    imageName: "item/ESPELHOGOTAMOLDURAECOURO.jpg",
      category: "Bases",
      price: 700.5,
      discount: 0,
    },
  ];
}

app.listen(8081, () => console.log("API Server listening on port 8081!"));
