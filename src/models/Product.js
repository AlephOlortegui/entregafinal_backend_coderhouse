import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true }, // Índice en categoría
  stock: { type: Number, required: true },
  available: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productSchema);
