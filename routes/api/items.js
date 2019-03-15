const express = require("express");
const router = express.Router();

// Item model
const Item = require("../../models/Item");

// Get all items
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// Get an item
router.get("/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  Item.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// Create an item
router.post("/", (req, res) => {
  const newItem = new Item({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity
  });

  newItem
    .save()
    .then(item => res.json(item))
    .catch(err => console.log(err));
});

// Update an item
router.patch("/:itemId", (req, res, next) => {
  const id = req.params.itemId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Item.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// Delete an item
router.delete("/:itemId", (req, res) => {
  Item.findById(req.params.id)
    .then(item => item.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
