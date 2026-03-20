export const validateInvoice = (req, res, next) => {
  const { clientName } = req.body;

  if (!clientName) {
    return res.status(400).json({ msg: "Client name required" });
  }

  next();
};