export const calculateTotals = (items) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const gst = subtotal * 0.18;

  return {
    subtotal,
    gst,
    total: subtotal + gst,
  };
};
