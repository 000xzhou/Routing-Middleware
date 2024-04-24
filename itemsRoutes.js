const express = require("express");
const router = new express.Router();

const items = require("./fakeDb");
const ExpressError = require("./expressError");

router.get("/", function (req, res) {
  // GET /items - this should render a list of shopping items.
  return res.json(items);
});

router.post("/", function (req, res) {
  // POST /items - this route should accept JSON data and add it to the shopping list.
  try {
    const newItem = req.body;

    if (!newItem.name || !newItem.price) {
      throw { message: "Name and price are required.", status: 400 };
    }
    items.push(newItem);
    return res.json({ added: newItem });
  } catch (error) {
    next(error);
  }
});

router.get("/:name", function (req, res) {
  // GET /items/:name - this route should display a single item’s name and price.
  try {
    const name = req.params.name;
    const item = items.find((item) => item.name === name);
    if (!item) {
      throw { message: "Item not found", status: 404 };
    }
    return res.json(item);
  } catch (error) {
    next(error);
  }
});

router.patch("/:name", function (req, res, next) {
  // PATCH /items/:name, this route should modify a single item’s name and/or price.
  try {
    const name = req.params.name;
    const findItem = items.find((item) => item.name === name);
    if (!findItem) {
      throw { message: "Item not found", status: 404 };
    }
    if (req.body.name) {
      findItem.name = req.body.name;
    }
    if (req.body.price) {
      findItem.price = req.body.price;
    }
    return res.json({ updated: findItem });
  } catch (error) {
    next(error);
  }
});

router.delete("/:name", function (req, res, next) {
  // DELETE /items/:name - this route should allow you to delete a specific item from the array.
  try {
    const name = req.params.name;
    const indexToRemove = items.findIndex((item) => item.name === name);
    if (indexToRemove === -1) {
      // return res.status(404).json({ error: "Item not found" });
      throw new ExpressError("Item not found", 404);
    }
    items.splice(indexToRemove, 1);
    return res.json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
