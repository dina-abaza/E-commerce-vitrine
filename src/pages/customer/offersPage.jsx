import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import useCartStore from "../../store/customerStore/cartStore";
import useAuthStore from "../../store/customerStore/authStore";

function OffersPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const categorySlug = searchParams.get("categorySlug");
  const maxPrice = searchParams.get("maxPrice");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://e-commece-vitrine-api.vercel.app/api/offers?categorySlug=${categorySlug}&maxPrice=${maxPrice}`
        );
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [categorySlug, maxPrice]);

  return (
    <div className="animate-slideInFromLeft p-6 m-10 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer h-full flex flex-col w-full sm:w-64"
          >
            {/* حاوية الصورة */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* الطبقة السوداء الشفافة عند الهوفر */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300 z-10 pointer-events-none"></div>

              {/* كلمة عرض التفاصيل: بدون خلفية، تحت شوية، وخط مفتوح وعريض */}
              <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <Link
                  to={`/product/${product._id}`}
                  className="text-yellow-700 text-md font-bold tracking-widest hover:text-yellow-500 transition-colors bg-transparent border-none"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>

            {/* بيانات المنتج السفلى */}
            <div className="p-4 bg-white flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-400 line-through text-sm">{product.price} جنيه</span>
                  <span className="text-gray-900 font-bold">
                    {product.offer.discountedPrice} جنيه
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!user) {
                    toast.info("يرجى تسجيل الدخول أولاً لإضافة المنتجات إلى السلة");
                    navigate("/login");
                    return;
                  }
                  toast.success("✅ تم إضافة المنتج إلى السلة");
                  addToCart(product);
                }}
                className="text-yellow-700 font-bold hover:text-yellow-500 transition duration-300 text-right w-full border-t border-gray-50 pt-3"
              >
                أضف إلى السلة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OffersPage;