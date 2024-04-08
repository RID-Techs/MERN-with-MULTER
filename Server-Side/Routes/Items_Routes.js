const express = require('express')
const auth = require('../Middlewares/auth')
const multer = require('../Middlewares/multer')
const {All_items, Sell_Item, Specific_item, Modify_Item, Delete_Item} = require('../Controllers/Items_Controllers')
const router = express.Router()

router.get("/", auth, All_items)
router.post("/sell", auth, multer, Sell_Item)
router.get("/:id", auth, Specific_item)
router.put("/modify/:id", auth, multer, Modify_Item)
router.delete("/delete/:id", auth, Delete_Item)

module.exports = router