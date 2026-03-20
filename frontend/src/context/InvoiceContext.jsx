import { createContext, useContext, useState } from "react";

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);

  return (
    <InvoiceContext.Provider value={{ invoices, setInvoices }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => useContext(InvoiceContext);
