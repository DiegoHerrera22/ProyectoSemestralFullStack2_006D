// Categorías 
window.CATEGORIAS = [
  "Tortas Cuadradas",
  "Tortas Circulares",
  "Postres Individuales",
  "Productos Sin Azúcar",
  "Pastelería Tradicional",
  "Productos Sin Gluten",
  "Productos Vegana",
  "Tortas Especiales"
];

// Catálogo inicial 
window.PRODUCTOS = [
  // Tortas Cuadradas
  { codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada Chocolate", precio: 45000, stock: 10, img: "assets/img/products/TC001.jpg", descripcion: "Bizcocho cacao, relleno manjar y ganache." },
  { codigo: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada Frutas",    precio: 50000, stock: 8,  img: "assets/img/products/TC002.jpg", descripcion: "Vainilla y frutas frescas de temporada." },

  // Tortas Circulares
  { codigo: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular Vainilla",  precio: 40000, stock: 12, img: "assets/img/products/TT001.jpg", descripcion: "Bizcocho vainilla y crema pastelera." },
  { codigo: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular Manjar",    precio: 42000, stock: 9,  img: "assets/img/products/TT002.jpg", descripcion: "Rellena de manjar y nueces." },

  // Postres Individuales
  { codigo: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate",   precio: 5000,  stock: 25, img: "assets/img/products/PI001.jpg", descripcion: "Mousse 70% cacao." },
  { codigo: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico",      precio: 5500,  stock: 20, img: "assets/img/products/PI002.jpg", descripcion: "Café, mascarpone y cacao." },

  // Productos Sin Azúcar
  { codigo: "SA001", categoria: "Productos Sin Azúcar", nombre: "Cheesecake Sin Azúcar", precio: 5200, stock: 18, img: "assets/img/products/SA001.jpg", descripcion: "Endulzado con sustituto permitido." },
  { codigo: "SA002", categoria: "Productos Sin Azúcar", nombre: "Brownie Sin Azúcar",    precio: 4800, stock: 22, img: "assets/img/products/SA002.jpg", descripcion: "Cacao intenso sin azúcar añadida." },

  // Pastelería Tradicional
  { codigo: "PT001", categoria: "Pastelería Tradicional", nombre: "Alfajor Maicena",     precio: 1200, stock: 100, img: "assets/img/products/PT001.jpg", descripcion: "Clásico con coco y manjar." },
  { codigo: "PT002", categoria: "Pastelería Tradicional", nombre: "Empolvado",           precio: 1500, stock: 80,  img: "assets/img/products/PT002.jpg", descripcion: "Relleno manjar y espolvoreado azúcar." },

  // Productos Sin Gluten
  { codigo: "SG001", categoria: "Productos Sin Gluten",  nombre: "Queque Limón (SG)",    precio: 6200, stock: 15, img: "assets/img/products/SG001.jpg", descripcion: "Harinas certificadas sin gluten." },
  { codigo: "SG002", categoria: "Productos Sin Gluten",  nombre: "Galletas Avena (SG)",  precio: 3500, stock: 30, img: "assets/img/products/SG002.jpg", descripcion: "Avena certificada." },

  // Productos Vegana
  { codigo: "VG001", categoria: "Productos Vegana",      nombre: "Torta Vegana Frutos Rojos", precio: 47000, stock: 7, img: "assets/img/products/VG001.jpg", descripcion: "Sin lácteos ni huevos." },
  { codigo: "VG002", categoria: "Productos Vegana",      nombre: "Brownie Vegano",       precio: 4800, stock: 24, img: "assets/img/products/VG002.jpg", descripcion: "Sin ingredientes de origen animal." },

  // Tortas Especiales
  { codigo: "TE001", categoria: "Tortas Especiales",     nombre: "Torta Cumpleaños Personalizada", precio: 60000, stock: 5, img: "assets/img/products/TE001.jpg", descripcion: "Decoración personalizada básica." },
  { codigo: "TE002", categoria: "Tortas Especiales",     nombre: "Torta de Novios (pequeña)",      precio: 95000, stock: 3, img: "assets/img/products/TE002.jpg", descripcion: "2 pisos, decoración sencilla." }
];
