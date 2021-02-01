const express = require("express");
const router = express.Router()





/*******************************************/
/*          REALIZAR UNA RESERVA          */
/******************************************/
    
router.post("/add", (req, res) => {
    const fecha = req.body.fecha;
    const puestos = req.body.puestos;
    const usuario = req.body.dataUser;
    console.log(usuario)

    let db = req.app.locals.db;
        db.collection("reservaPuesto")
            .find({ fecha: fecha })
            .toArray((err, data) => {
            console.log(data);
            if (err !== null) {
                res.send(err);
            } else {
                if (data.length === 0) {
                db.collection("reservaPuesto").insertOne(
                    { fecha: fecha, puestos: puestos },
                    (err, info) => {
                    if (err !== null) {
                        res.send(err);
                    } else {
                        res.send(info);
                    }
                    }
                );
                } else {
                const newArray = [];
                for (let i = 0; i < puestos.length; i++) {
                    if (puestos[i].estado === "ocupado") {
                    newArray.push(puestos[i]);
                    } else if (data[0].puestos[i].estado === "ocupado") {
                    newArray.push(data[0].puestos[i]);
                    } else {
                    newArray.push(puestos[i]);
                    }
                
                }
                db.collection("reservaPuesto").updateOne(
                    { fecha: fecha },
                    { $set: { puestos: newArray } },
                    (err, infoUpdate) => {
                    if (err !== null) {
                        res.send(err);
                    } else {
                        res.send(infoUpdate);
                    }
                    }
                );
                }
            }
            });
        });





/************************************************/
/*         MOSTRAR LOS PUESTOS POR DIA           */
/************************************************/

router.post("/get", (req, res) => {
    const fecha = req.body.fecha;
    const puestos = req.body.puestos;
  

    let db = req.app.locals.db;
        db.collection("reservaPuesto")
            .find({ fecha: fecha }).toArray((err, data) => {
            console.log(data);
            if (err !== null) {
                res.send(err);
            } else {
              res.send(data);
                }
            });
        });















                    

module.exports = router;