import React from "react";

type PropsType = {
  viewCard: boolean;
  setViewCard: React.Dispatch<React.SetStateAction<boolean>>;
};

const Nav = ({ viewCard, setViewCard }: PropsType) => {
  const button = viewCard ? (
    <button onClick={() => setViewCard(false)}>View Products</button>
  ) : (
    <button onClick={() => setViewCard(true)}>View Cart</button>
  );

  const content = <nav className="nav">{button}</nav>;

  return content;
};

export default Nav;
