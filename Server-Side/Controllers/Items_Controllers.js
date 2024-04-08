const Items = require('../Models/Items_Model')
const fs = require('fs');
const path = require('path');

const All_items = async (req, res) => {
    try {
        const allItems = await Items.find()
        res.status(200).json(allItems)
    } catch (error) {
        res.status(500).json({Error: error})
    }
}

const Sell_Item = async (req, res) => {
    try {
    
        const { pseudo, contact, name, description, price } = req.body;

        if (!name || !description || !price || !pseudo || !contact) {
            return res.status(400).json({ error: 'Name, description, and price are required fields' });
        }

        const sellingItem = new Items({
            pseudo,
            contact,
            name,
            description,
            price,
            _userId: req.user._id,
            image: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
        });

        await sellingItem.save();

        return res.status(201).json({ message: 'Item published!' });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// const Sell_Item = async (req, res) => {
//     try {
//         const sell_Item = JSON.parse(req.body.Items)
//         delete sell_Item._id
//         delete sell_Item._userId

//         const sellingItem = new Items({
//             ...sell_Item,
//             _userId: req.auth._userId,
//             image: `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
//         })

//         await sellingItem.save()
//         res.status(201).json({ message: 'Items published !' });
        
//     } catch (error) {
//         console.log("Wrong:", error)
//         res.status(500).json({mes: error})
//     }
// } 

const Specific_item = async(req, res) => {
    try {
        const oneItem = await Items.findById(req.params.id)
        if(!oneItem){
            res.status(404).json({mes: "Item not found"})
        }
        res.status(200).json(oneItem)
    } catch (error) {
        res.status(500).json({error})
    }
}

const Modify_Item = async (req, res) => {
    try {
        const { pseudo, contact, name, description, price } = req.body;
        const item = await Items.findOne({ _id: req.params.id, _userId: req.user._id });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (pseudo) {
            item.pseudo = pseudo;
        }

        if (contact) {
            item.contact = contact;
        }

        if (name) {
            item.name = name;
        }
        
        if (description) {
            item.description = description;
        }

        if (price) {
            item.price = price;
        }

        if (req.file) {
            item.image = `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`;
        }

        await item.save();
        return res.status(200).json({ message: 'Item updated!', item });
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const Delete_Item = async (req, res) => {
    try {
        const item = await Items.findOne({ _id: req.params.id, _userId: req.user._id });

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const filename = item.image.split('/Images/')[1];
        fs.unlink(`Images/${filename}`, (error) => {
            if (error) {
                return res.status(500).json({ error });
            }
        })

        await item.deleteOne({_id: req.params.id});
        return res.status(200).json({ message: 'Item deleted!', item });
        
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = { All_items, Sell_Item, Specific_item, Modify_Item, Delete_Item }