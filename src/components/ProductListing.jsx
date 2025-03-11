import { useState, useEffect } from "react";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let updatedProducts = [...products];

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOrder === "lowToHigh") {
      updatedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      updatedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, selectedCategory, sortOrder, products]);

  return (
    <div className="p-4 w-full  min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center">Productss List</h1>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 w-full">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded w-full md:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full md:w-1/4"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="" className="text-black">
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category} value={category} className="text-black">
              {category}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded w-full md:w-1/4"
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value="" className="text-black">
            Sort by Price
          </option>
          <option value="lowToHigh" className="text-black">
            Low to High
          </option>
          <option value="highToLow" className="text-black">
            High to Low
          </option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <div className="h-40 w-full bg-gray-300 animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-300 animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 animate-pulse mb-2 w-1/2"></div>
              <div className="h-6 bg-gray-300 animate-pulse w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length !== 0 ? (
            <>
              {filteredProducts.map((product) => (
                <div
                  key={product?.id}
                  className="border p-4 rounded shadow hover:shadow-lg transition"
                >
                  <img
                    src={product?.image}
                    alt={product?.title}
                    className="h-40 w-full object-contain mb-4"
                  />
                  <h2 className="text-lg font-bold truncate">
                    {product?.title}
                  </h2>
                  <p className="text-gray-500">{product?.category}</p>
                  <p className="text-xl font-semibold">${product?.price}</p>
                </div>
              ))}
            </>
          ) : (
            <div className="text-white text-2xl">Product Not found !!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
