import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import ProductList from "./components/ProductList";

function App() {
  const [viewCart, setViewCart] = useState<boolean>(false);

  const pageContent = viewCart ? <Card /> : <ProductList />;

  const content = (
    <>
      <Header viewCart={viewCart} setViewCart={setViewCart}></Header>
      {pageContent}
      <Footer viewCart={viewCart}></Footer>
    </>
  );
  return content;
}

export default App;
