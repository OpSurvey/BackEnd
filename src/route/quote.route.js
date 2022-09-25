const {
  getByQuoterId,
  createQuote,
  updateQuote,
  deleteQuote,
  toPDF,
} = require("../usecases/quote.usecase");
const fs = require("fs");
const express = require("express");
const authMiddleware = require("../middlewares/auth.middlewares");

const router = express.Router();

//Middleware de auth
router.use(authMiddleware);

router.get("/", async (request, response) => {
  try {
    const quotes = await getByQuoterId(request.quoter.id);
    response.json({
      success: true,
      data: {
        quotes,
      },
    });
  } catch (err) {
    response.status(err.status || 500);
    response.json({
      succes: false,
      message: err.message,
    });
  }
});

router.get("/:id/pdf", async (request, response) => {
  try {
    const { id } = request.params;

    const pdfPath = await toPDF(id);

    const file = fs.createReadStream(pdfPath);
    const stat = fs.statSync(pdfPath);
    response.setHeader("Content-Length", stat.size);
    response.setHeader("Content-Type", "application/pdf");
    response.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
    file.pipe(response);
  } catch (err) {
    response.status(err.status || 500);
    response.json({
      succes: false,
      message: err.message,
    });
  }
});

router.post("/", async (request, response) => {
  try {
    const quote = await createQuote(request.quoter.id, request.body);
    response.json({
      success: true,
      data: {
        quote,
      },
    });
  } catch (err) {
    response.status(err.status || 500);
    response.json({
      succes: false,
      message: err.message,
    });
  }
});

router.patch("/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const quote = await updateQuote(id, request.body);
    response.json({
      success: true,
      data: {
        quote,
      },
    });
  } catch (err) {
    response.status(err.status || 400);
    response.json({
      success: false,
      message: err.message,
    });
  }
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;
  try {
    const quote = await deleteQuote(id);
    response.status(200);
    response.json({
      success: true,
      message: "Quote Deleted",
    });
  } catch (err) {
    response.status(error.status || 500);
    response.json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
