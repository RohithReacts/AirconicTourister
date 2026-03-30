import { ReusableCarousel } from "@/components/ReusableCarousel";
import banner1 from "@/assets/banner.webp";
import banner2 from "@/assets/banner1.webp";
import banner3 from "@/assets/banner2.webp";
import banner4 from "@/assets/banner3.webp";
import brandBg from "@/assets/brandat.webp";
import collectionImage from "@/assets/product.jpg";
import newArrivalsImage from "@/assets/product1.webp";
import { ShopProducts, ProductCard } from "@/components/ShopProducts";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function Home() {
  useDocumentTitle("Home");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.Products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const bestsellers = products.length > 0 ? products.slice(0, 6) : [];
  const whatsNew =
    products.length > 6 ? products.slice(6, 12) : products.slice(0, 6);

  const shopTabs = [
    {
      value: "bestseller",
      label: "Bestseller",
      items: [
        <ProductCard
          key="col-1"
          isCollection
          title={`${products.length} products`}
          buttonText="VIEW ALL"
          image={collectionImage}
          link="/luggage"
        />,
        ...bestsellers.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            title={product.title}
            badge={product.discount > 0 ? `Save ${product.discount}%` : null}
            icon={true}
            image={product.image || "https://placehold.co/400x400"}
            price={product.salePrice}
            mrp={product.pricemrp}
            color={product.color}
          />
        )),
      ],
    },
    {
      value: "whats-new",
      label: "What's New",
      items: [
        <ProductCard
          key="col-2"
          isCollection
          title="New Arrivals"
          buttonText="DISCOVER"
          image={newArrivalsImage}
          link="/luggage"
        />,
        ...whatsNew.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            title={product.title}
            badge="New"
            icon={true}
            image={product.image || "https://placehold.co/400x400"}
            price={product.salePrice}
            mrp={product.pricemrp}
            color={product.color}
          />
        )),
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pb-24 lg:pb-40 pt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto mb-8 lg:mb-16 animate-in fade-in zoom-in-95 duration-1000 px-4">
            <div className="sm:px-12 lg:px-16 w-full mt-4 mb-10">
              <ReusableCarousel
                items={[
                  <img
                    key="1"
                    src={banner1}
                    alt="Airconic Tourister Banner"
                    className="w-full aspect-4/3 sm:aspect-video md:aspect-2.5/1 rounded-3xl object-cover shadow-2xl border border-border/50 block"
                  />,
                  <img
                    key="2"
                    src={banner2}
                    alt="Explore Collection"
                    className="w-full aspect-4/3 sm:aspect-video md:aspect-2.5/1 rounded-3xl object-cover shadow-2xl border border-border/50 block"
                  />,
                  <img
                    key="3"
                    src={banner3}
                    alt="Our Journey"
                    className="w-full aspect-4/3 sm:aspect-video md:aspect-2.5/1 rounded-3xl object-cover shadow-2xl border border-border/50 block"
                  />,
                  <img
                    key="4"
                    src={banner4}
                    alt="Our Journey"
                    className="w-full aspect-4/3 sm:aspect-video md:aspect-2.5/1 rounded-3xl object-cover shadow-2xl border border-border/50 block"
                  />,
                ]}
                opts={{
                  loop: true,
                  align: "center",
                  autoplay: true,
                  autoplayInterval: 1000,
                }}
              />
            </div>
            <ShopProducts tabs={shopTabs} />
          </div>
          <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-border/50 mt-12 mb-8">
            <img
              src={brandBg}
              alt="Airconic Tourister Brand"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.4] scale-105 hover:scale-100 transition-transform duration-1000"
            />
            <div className="relative z-10 px-6 py-16 md:py-24 max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-[400px]">
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-wider text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 drop-shadow-xl">
                Welcome To The World Of Airconic Tourister
              </h1>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] animate-pulse delay-700" />
        </div>
      </section>
    </div>
  );
}

export default Home;
