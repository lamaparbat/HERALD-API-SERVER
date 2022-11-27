const lostFoundModel = require('../../../models/lostFoundModel');
const { StatusCodes } = require("http-status-codes");

const ReportLostFoundData = (req, res) => {
    const { firstName, lastName, phoneNumber, itemCategory, description, lostDate, block } = req.body;

    // validation
    if (Object.keys(req.body).length !== 7) {
        return res.status(422).json({
            message: "some fields are missing!"
        })
    }

    if (!firstName || !lastName || !phoneNumber){
        return res.status(422).json({
            message : "provide your personal description => [firstName, lastName, phoneNumber]"
        })
    }
    if (!itemCategory.length) {
        return res.status(422).json({
            message: "empty items field!"
        })
    }

    if (description.length <= 8) {
        return res.status(422).json({
            message: "maybe describe the item a bit more than 8 character??"
        })
    }

    if (!block || !lostDate) {
        return res.status(422).json({
            message: "either lost date or block is not provided"
        })
    }


    //db insertion
    const data = new lostFoundModel({
        ...req.body,
        isVictimRecievedData: false,
        createdAt: new Date().toLocaleDateString(),
    });

    //save the data
    data
        .save()
        .then((data) => {
            res.status(StatusCodes.OK).send({
                message: "Report posted successfully !!"
            });
        })
        .catch(err => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                message: "500 BACKEND SERVER ERROR !!"
            });
        })
}


module.exports = ReportLostFoundData;
