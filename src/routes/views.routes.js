import express from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Ruta para mostrar todos los productos con paginación
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      lean: true, // Para devolver objetos simples y no documentos de Mongoose
    };

    const products = await Product.paginate({}, options);

    res.render("products", {
      products: products.docs,
      pagination: {
        totalPages: products.totalPages,
        currentPage: products.page,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
        nextPage: products.nextPage,
        prevPage: products.prevPage,
      },
    });
  } catch (error) {
    res.status(500).send("Error al obtener productos");
  }
});

// Ruta para ver un producto específico con detalles
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");

    res.render("product", { product });
  } catch (error) {
    res.status(500).send("Error al obtener el producto");
  }
});

// Ruta para visualizar un carrito específico con sus productos
router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send("Error al obtener el carrito");
  }
});

export default router;
