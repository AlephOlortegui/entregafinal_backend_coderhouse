import {Router} from 'express'
import Cart from '../models/Cart.js';
const router = Router();

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);

  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json(cart);
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  
  const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  res.json(cart);
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
  if (productIndex === -1) return res.status(404).json({ error: "Producto no encontrado en el carrito" });

  cart.products[productIndex].quantity = quantity;
  await cart.save();
  res.json(cart);
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  await Cart.findByIdAndUpdate(cid, { products: [] });
  res.sendStatus(204);
});
