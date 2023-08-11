import { ReactElement, createContext, useMemo, useReducer } from "react";
import { act } from "react-dom/test-utils";

type CartItemType = {
  sku: string;
  name: string;
  price: number;
  qty: number;
};

type CartStateType = { cart: CartItemType[] };

const initCartState: CartStateType = { cart: [] };

type ChildrenType = {
  children: ReactElement | ReactElement[];
};

const REDUCER_ACTION_TYPE = {
  ADD: "ADD",
  REMOVE: "REMOVE",
  SUBMIT: "SUBMIT",
  QUANTITY: "QUANTITY",
} as const;

type ReducerActionType = typeof REDUCER_ACTION_TYPE;

type ReducerAction = {
  type: string;
  payload?: CartItemType;
};

const reducer = (state: CartStateType, action: ReducerAction) => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.ADD: {
      if (!action.payload) {
        throw new Error("action.payload is missing in ADD action");
      }

      const { sku, name, price } = action.payload;

      const filteredItems = state.cart.filter((item) => item.sku !== sku);

      const itemExists = state.cart.find((item) => item.sku === sku);

      const qty = itemExists ? itemExists.qty + 1 : 1;

      return { ...state, cart: [...filteredItems, { sku, name, price, qty }] };
    }

    case REDUCER_ACTION_TYPE.QUANTITY: {
      if (!action.payload) {
        throw new Error("action.payload is missing in QUANTITY action");
      }

      const { sku, qty } = action.payload;

      const itemExists = state.cart.find((item) => item.sku === sku);

      if (!itemExists)
        throw new Error("In order to change quantity item must exist");

      const filteredItems = state.cart.filter((item) => item.sku !== sku);

      const updatedItem = { ...itemExists, qty };

      return {
        ...state,
        cart: { ...filteredItems, cart: updatedItem },
      };
    }

    case REDUCER_ACTION_TYPE.REMOVE: {
      if (!action.payload) {
        throw new Error("action.payload is missing in QUANTITY action");
      }

      const { sku } = action.payload;

      const filteredItems = state.cart.filter((item) => item.sku !== sku);

      return { ...state, cart: [...filteredItems] };
    }

    case REDUCER_ACTION_TYPE.SUBMIT: {
      return { ...state, cart: [] };
    }

    default:
      throw new Error("Unidentified reducer action type");
  }
};

const useCartContext = (initCartState: CartStateType) => {
  const [state, dispatch] = useReducer(reducer, initCartState);

  const totalItems = state.cart.reduce((previousValue, cartItem) => {
    return previousValue + cartItem.qty;
  }, 0);

  const REDUCER_ACTIONS = useMemo(() => {
    return REDUCER_ACTION_TYPE;
  }, []);

  const totalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(
    state.cart.reduce((previousValue, cartItem) => {
      return previousValue + cartItem.qty * cartItem.price;
    }, 0)
  );

  const cart = state.cart.sort((a, b) => {
    const itemA = Number(a.sku.slice(-4));
    const itemB = Number(b.sku.slice(-4));

    return itemA - itemB;
  });

  return { dispatch, totalItems, REDUCER_ACTIONS, totalPrice, cart };
};

type UseCartContextType = ReturnType<typeof useCartContext>;

const initCartContextState: UseCartContextType = {
  dispatch: () => {},
  totalItems: 0,
  totalPrice: "",
  cart: [],
  REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
};

const CartContext = createContext<UseCartContextType>(initCartContextState);

const CartProvider = ({ children }: ChildrenType) => {
  return (
    <CartContext.Provider value={useCartContext(initCartState)}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
