const fetch = require("node-fetch");
const { db } = require("../models/Counts");
const Counts = require("../models/Counts");

const Masters = require("../models/Master");
exports.getIndex = (req, res, next) => {
    res.render("index", {
        path: "/",
    });
};

exports.getCounts = (req, res, next) => {
    fetch("http://assignment.envanterium.com/inputs/counts.json")
        .then((res) => res.json())
        .then((json) => {
            const contentsMain = [];
            for (let i = 0; i < json.length; i++) {
                // console.log(json[i].completedCounts[0].contents)

                for (
                    let j = 0;
                    j < json[i].completedCounts[0].contents.length;
                    j++
                ) {
                    const contentsObject = {
                        barcode: json[i].completedCounts[0].contents[j].barcode,
                        amount: json[i].completedCounts[0].contents[j].amount,
                    };

                    contentsMain.push(contentsObject);
                    // console.log(json[i].completedCounts[0].contents.length);
                    // console.log(json[i].completedCounts[0].contents[j])
                    // console.log(json[i].completedCounts[0].totalAmount);
                }

                // const contentsObject = {
                //     barcode: json[0].completedCounts[0].contents[i].barcode,
                //     amount: json[0].completedCounts[0].contents[i].amount,
                // };

                // contentsMain.push(contentsObject);
                const count = new Counts({
                    id: json[i].id,
                    locationCode: json[i].locationCode,
                    completedCounts: [
                        {
                            totalAmount: json[i].completedCounts[0].totalAmount,
                            contents: contentsMain,
                        },
                    ],
                });
                console.log(count);
                count.save();
            }
        })
        .then(() => {
            res.render("index", {
                path: "/",
            });
        });
};

exports.getMaster = (req, res, next) => {
    fetch("http://assignment.envanterium.com/inputs/master.json")
        .then((res) => res.json())
        .then((masterData) => {
            for (let i = 0; i < masterData.length; i++) {
                const masters = new Masters({
                    barcode: masterData[i].barcode,
                    sku: masterData[i].sku,
                    urun_adi: masterData[i]["urun adi"],
                });

                masters.save();
            }
        })
        .then((json) => {
            res.render("index", {
                path: "/",
            });

        });
};

exports.getFirstTxtData = (req, res, next) => {
    const fs = require("fs");
    Counts.find(
        {},
        { locationCode: 1, completedCounts: 1 },
        function (err, result) {
            if (err) throw err;
            let total = 0;
            for (let k = 0; k < result.length; k++) {
                for (
                    let j = 0;
                    j < result[k].completedCounts[0].contents.length;
                    j++
                ) {
                    let locationCode = result[k].locationCode;
                    let barcode =
                        result[k].completedCounts[0].contents[j].barcode;
                    let amount =
                        result[k].completedCounts[0].contents[j].amount;
                    let data =
                        locationCode + ";" + barcode + ";" + amount + "\n";

                    fs.appendFile("test.txt", data, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The data added");
                    });
                    total++;
                }
            }
            console.log(total);
        }
    );
};

exports.getSecondTxtData = (req, res, next) => {
    Counts.find(
        {},
        { locationCode: 1, completedCounts: 1 },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                for (let i = 0; i < data.length; i++) {
                    console.log("birinci for");
                    for (
                        let j = 0;
                        j < data[i].completedCounts[0].contents.length;
                        j++
                    ) {
                        Counts.find(
                            {},
                            {
                                completedCounts: {
                                    $elemMatch: {
                                        contents: {
                                            $elemMatch: {
                                                barcode:
                                                    data[i].completedCounts[0]
                                                        .contents[j].barcode,
                                            },
                                        },
                                    },
                                },
                            },
                            function (err, result) {
                                console.log(result);
                            }
                        );
                        
                    }
                }
            }
        }
    );
};

exports.getThirdTxtData = (req, res, next) => {
    Counts.aggregate([
        {
            $lookup: {
                from: "masters",
                localField: "barcode",
                foreignField: "barcode",
                as: "custom_barcode",
            },
        },
    ]).exec((err, result) => {
        if (err) {
            console.log("error", err);
        }
        if (result) {
            console.log(result.length);
            console.log(result[0].locationCode);
            console.log(result[0].id);
        }
    });

    // Masters.find({}, function (err, data) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         for (let i = 0; i < data.length; i++) {
    //             const contentsObject = {
    //                 sku: data[i].sku,
    //                 urun_adi: data[i].urun_adi,
    //             };

    //             contentsMainMaster.push(contentsObject);
    //         }
    //         console.log(contentsMainMaster);
    //     }
    // });
};
