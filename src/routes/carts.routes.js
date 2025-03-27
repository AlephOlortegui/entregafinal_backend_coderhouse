import {Router} from 'express'
import Cart from '../models/Cart.js';
const router = Router();

// Obtener un carrito por ID con los productos populados
router.get('/:cid', async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});

/* 
    DELETE api/carts/:cid/products/:pid 
    deberá eliminar del carrito el producto seleccionado.
 */

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);

  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json(cart);
});

/* 
  PUT api/carts/:cid 
  deberá actualizar todos los productos del 
  carrito con un arreglo de productos. 
*/

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  
  const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
  res.json(cart);
});

/* 
  PUT api/carts/:cid/products/:pid 
  deberá poder actualizar SÓLO la 
  cantidad de ejemplares del producto 
  por cualquier cantidad pasada desde req.body
*/

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

/* 
DELETE api/carts/:cid 
deberá eliminar todos los productos del carrito */

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  await Cart.findByIdAndUpdate(cid, { products: [] });
  res.sendStatus(204);
});

export default router;