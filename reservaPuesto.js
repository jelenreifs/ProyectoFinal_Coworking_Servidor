const express = require("express");
const router = express.Router()





/*******************************************/
/*          REALIZAR UNA RESERVA          */
/******************************************/
    
router.post("/add", (req, res) => {
    const fecha = req.body.fecha;
    const puestos = req.body.puestos;
    const dni = req.body.usuario.dni;
    const creditos = req.body.usuario.creditos;
    const nuevosCreditos = creditos - 5;
    console.log(nuevosCreditos)
  

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
                         res.send({error: true, mensaje: "No se ha realizado la reserva", err: err });
                    } else {
                         db.collection("users")
                            .updateOne({ dni: dni }, {
                                $set: { creditos: nuevosCreditos }
                            }, (err, alta) => { 
                                    if (err != null) {
                                        res.send({error: true, mensaje: "No se ha realizado la reserva", err: err });
                                    } else { 
                                        res.send({ error: false, mensaje: "Su puesto se ha reservado", info:info });
                                    }
                            })
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
                        //res.send(infoUpdate);
                        db.collection("users")
                            .updateOne({ dni: dni }, {
                                $set: { creditos: nuevosCreditos }
                            }, (err, alta) => { 
                                    if (err != null) {
                                        res.send({error: true, mensaje: "No se ha realizado la reserva", err: err });
                                    } else { 
                                        res.send({ error: false, mensaje: "Su puesto se ha reservado", alta:alta });

                                    }
                            })
                        
                    }
                    }
                );
                }
            }
            });
        });



/************************************************/
/*         MOSTRAR TODAS LAS RESERVAS          */
/************************************************/

router.get("/", (req, res) => {
    let db = req.app.locals.db;
        db.collection("reservaPuesto")
            .find().toArray((err, data) => {
            if (err !== null) {
                res.send(err);
            } else {
              res.send(data);
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