import React, { useEffect, useState } from "react";
import axios from "axios";
import useCartStore from "../../store/customerStore/cartStore";
import useAuthStore from "../../store/customerStore/authStore";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductByCategory() {
  const {id}=useParams()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    const storedData = localStorage.getItem("products");
    if (storedData) {
      setProducts(JSON.parse(storedData));
      setLoading(false); 
    }

    async function fetchData() {
      try {
        const url = `https://e-commece-vitrine-api.vercel.app/api/product/${id}`;
        const res = await axios.get(url);
        localStorage.setItem("products", JSON.stringify(res.data));
        setProducts(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  return (
    <div className="animate-slideInFromLeft p-6 m-10">
      {loading && <p>جاري التحميل...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && products.length === 0 && (
        <p className="text-gray-500">لا توجد منتجات</p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {products.map((product) => (

          <div className="relative group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer w-full sm:w-64">
              <img
              src={product.image || "https://via.placeholder.com/300"}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none z-20">

          </div>
          
          
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-auto">
    <Link
      to={`/product/${product._id}`}
      className="text-yellow-700 px-5 py-2 rounded shadow-lg font-bold hover:text-yellow-500"
    >
      عرض التفاصيل
    </Link>
  </div>
  
  
  <div className="p-4 bg-white relative z-40">
    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
    <p className="text-gray-700 font-bold mb-3">{product.price} جنيه</p>
    <button
      onClick={() => {
        if (!user) {
          toast.info("يرجى تسجيل الدخول أولاً لإضافة المنتجات إلى السلة");
          navigate("/login");
          return;
        }
        toast.success("✅ تم إضافة المنتج إلى السلة");
        console.log("Adding product to cart:", product);
        addToCart(product);
      }}
      className="text-yellow-700 font-bold hover:text-yellow-500 transition duration-300"
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
