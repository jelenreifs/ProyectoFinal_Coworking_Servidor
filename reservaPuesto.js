const express = require("express");
const router = express.Router()


      
/*******************************************/
/*          REALIZAR UNA RESERVA          */
/******************************************/
router.post("/add", (req, res) => { 
    const reserva = req.body
    const fecha = new Date(req.body.fecha)
    let db = req.app.locals.db;
    
    db.collection("reservaPuesto")
        .find({ fecha: fecha}).toArray((err, dia) => {
            if (err != null) {
                res.send(err)
            } else {
                console.log(dia)
                if (dia.length !== 0) {
                    res.send({ error: true, mensaje: "El puesto está ocupado" });
                } else {
                    db.collection("reservaPuesto")
                        .insertOne({
                            dni: reserva.dni,
                            nombre: reserva.nombre,
                            apellido: reserva.apellido,
                            puesto: reserva.id,
                            fecha: fecha
                        }, ((err, datos) => { 
                                if (err != null) {
                                    res.send(err);
                                } else {
                                    db.collection("users")
                                        .find({ dni: reserva.dni }).toArray((err, datos) => { 
                                            if (err != null) {
                                                res.send(err)
                                            } else {
                                                db.collection("users")
                                                    .updateOne({ dni: reserva.dni }, {
                                                        $set: { creditos: datos[0].creditos - 5 }
                                                    }, (err, alta) => {
                                                        if (err != null) {
                                                            res.send(err);
                                                        } else {
                                                            res.send({ error: true, mensaje: "Su puesto se ha reservado" });
                                                        }
                                                    }
                                                )
                                            }
                                        })
                                    }
                                })
                            )
                        }
                    }
                })
            }) 
            
             
    /*******************************************/
    /*          MOSTRAR TODAS RESERVAS              */
    /******************************************/

    router.get("/", (req, res) => {
        let db = req.app.locals.db;
        db.collection("reservaPuesto")
            .find()
            .toArray((err, datos) => {
            if(err!=null) {
                console.log(err);
                res.send(err);
            } else {
                res.send(datos);
            }
        });
    });


        /************************************************/
        /*         MOSTRAR LOS PUESTOS LIBRES           */
        /************************************************/

    router.get("/", (req, res) => {
        const reserva = req.body
        const fecha = new Date(req.body.fecha)

        let db = req.app.locals.db;
        db.collection("reservaPuesto")
            .find({ fecha: fecha })
                .toArray((err, dia) => {
                if(err!=null) {
                    console.log(err);
                    res.send(err);
                } else {
                    if (dia.length !== 0) {
                        res.send({ error: true, mensaje: "El puesto está ocupado" });
                    } else { 
                         res.send({ error: true, mensaje: "El puesto está libre" });
                    }
                }
            });
        });

                    

module.exports = router;