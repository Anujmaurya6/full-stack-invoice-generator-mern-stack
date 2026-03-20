export const generateInvoiceId = () => {
  const date = new Date().getTime();
  return `INV-${date}`;
};
