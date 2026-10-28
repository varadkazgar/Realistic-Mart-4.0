import { supabase } from "../config/supabase";

export async function getActiveProducts() {
const { data, error } = await supabase
.from("products")
.select("*")
.eq("is_active", true)
.order("created_at", { ascending: false });

if (error) {
console.error("Failed to load products:", error.message);
throw error;
}

return (data ?? []).map((product) => ({
...product,
oldPrice: product.compare_at_price ?? product.price,
imageUrls:
product.image_urls ??
(product.image_url ? [product.image_url] : []),
badge: product.tags?.[0] ?? "",
rating: product.rating ?? null,
}));
}

export async function getProductById(id) {
const { data, error } = await supabase
.from("products")
.select("*")
.eq("id", id)
.eq("is_active", true)
.maybeSingle();

if (error) {
console.error("Failed to load product:", error.message);
throw error;
}

if (!data) return null;

return {
...data,
oldPrice: data.compare_at_price ?? data.price,
imageUrls:
data.image_urls ??
(data.image_url ? [data.image_url] : []),
badge: data.tags?.[0] ?? "",
rating: data.rating ?? null,
};
}