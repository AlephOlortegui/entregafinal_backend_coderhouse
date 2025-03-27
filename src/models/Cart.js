import mongoose from "mongoose";

/* Esta vez, para el modelo de Carts, en su propiedad products, 
el id de cada producto generado dentro del array tiene que 
hacer referencia al modelo de Products. 
Modificar la ruta /:cid para que al traer todos 
los productos, los traiga completos mediante 
un “populate”. De esta manera almacenamos 
sólo el Id, pero al solicitarlo podemos 
desglosar los productos asociados. */

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ]
});

export default mongoose.model("Cart", cartSchema);
