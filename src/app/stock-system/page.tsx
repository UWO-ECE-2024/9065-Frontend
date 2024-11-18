"use client";
import Footer from "@/components/Footer";
import ProductStockCard from "@/components/ProductStockCard";
import NavbarStocking from "@/components/NavbarStocking";
import AddItemCard from "@/components/AddItemCard";
import {SetStateAction, useEffect, useState} from "react";


const page = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8888/v1/products/list')
            .then(response => response.json())
            .then(data => {
                // 检查返回的数据是否是数组
                setProducts(data.data)
            });
    }, []);

    if (products.length === 0) {
        return <div>loading...</div>;
    }
    return (

        <div className="min-h-screen flex flex-col">
            <NavbarStocking/>
            <script src="http://localhost:8097"></script>
            <main className="flex-grow container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6">Stock Tracking</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductStockCard key={product.productId} {...product} />
                    ))}
                    <AddItemCard/>
                </div>
            </main>

            <Footer/>
        </div>
    );
}
export default page;

