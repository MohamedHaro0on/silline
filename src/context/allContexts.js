import { CategroiesContextProvider } from "./categories";
import { MenueContextProvider } from "./menue";
import { OrdersContextProvider } from "./order";

const AllContextsProvider = ({ children }) => {
  return (
    <CategroiesContextProvider>
      <MenueContextProvider>
        <OrdersContextProvider>{children}</OrdersContextProvider>
      </MenueContextProvider>
    </CategroiesContextProvider>
  );
};

export default AllContextsProvider;
