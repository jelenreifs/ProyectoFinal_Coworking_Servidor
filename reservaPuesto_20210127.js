const express = require("express");
const router = express.Router()


/********************************************/
/*          REALIZAR UNA RESERVA          */
/******************************************/
const puestos = [
    { id: "M1-1", estado: "libre" },
    { id: "M1-2", estado: "libre" },
    { id: "M1-3", estado: "libre" },
    { id: "M1-4", estado: "libre" },
    { id: "M1-5", estado: "libre" },
    { id: "M1-6", estado: "libre" },
    { id: "M2-1", estado: "libre" },
    { id: "M2-2", estado: "libre" },
    { id: "M2-3", estado: "libre" },
    { id: "M2-4", estado: "libre" },
    { id: "M2-5", estado: "libre" },
    { id: "M2-6", estado: "libre" },
    { id: "M3-1", estado: "libre" },
    { id: "M3-2", estado: "libre" },
    { id: "M3-3", estado: "libre" },
    { id: "M3-4", estado: "libre" },
    { id: "M3-5", estado: "libre" },
    { id: "M3-6", estado: "libre" },
    { id: "M4-1", estado: "libre" },
    { id: "M4-2", estado: "libre" },
    { id: "M4-3", estado: "libre" },
    { id: "M4-4", estado: "libre" },
    { id: "M4-5", estado: "libre" },
    { id: "M4-6", estado: "libre" },
    { id: "M5-1", estado: "libre" },
    { id: "M5-2", estado: "libre" },
    { id: "M5-3", estado: "libre" },
    { id: "M5-4", estado: "libre" },
    { id: "M5-5", estado: "libre" },
    { id: "M5-6", estado: "libre" },
    { id: "M6-1", estado: "libre" },
    { id: "M6-2", estado: "libre" },
    { id: "M6-3", estado: "libre" },
    { id: "M6-4", estado: "libre" },
    { id: "M6-5", estado: "libre" },
    { id: "M6-6", estado: "libre" },
    { id: "M7-1", estado: "libre" },
    { id: "M7-2", estado: "libre" },
    { id: "M7-3", estado: "libre" },
    { id: "M7-4", estado: "libre" },
    { id: "M7-5", estado: "libre" },
    { id: "M7-6", estado: "libre" },
    { id: "M7-7", estado: "libre" },
]


router.post("/add", (req, res) => {
    const reserva = req.body
    const fecha = req.body.fecha
    

    let db = req.app.locals.db;
    
    db.collection("reservaPuesto")
        .insertOne({
            puestos: puestos,
            fecha: fecha
        }, ((err, data) => {
                if (err != null) {
                    res.send(err);
                } else {
                    db.collection("reservaPuesto")
                        .find({ fecha: fecha }).toArray((err, dia) => {
                            if (dia.length !== 0) {
                                res.send({ error: true, mensaje: "No sé qué poner aquí" });
                            } else {
                                db.collection("reservaPuesto")
                                    .find({ puesto: puesto }).toArray((err, asiento) => { 
                                        if (asiento[0].estado === "ocupado") {
                                            res.send({ error: true, mensaje: "El puesto está ocupado" });
                                        } else {
                                            db.collection("users")
                                                .find({ dni: reserva.dni }).toArray((err, usuario) => { 
                                                    if (err != null) {
                                                        res.send(err);
                                                    } else { 
                                                        db.collection("reservaPuesto")
                                                            .insertOne({
                                                                dni: usuario.dni,
                                                                nombre: usuario.nombre,
                                                                apellido: usuario.apellido
                                                            }, ((err, data) => {
                                                                    if (err != null) {
                                                                        res.send(err);
                                                                    } else { 
                                                                        db.collection("users")
                                                                            .updateOne({ dni: reserva.dni }, {
                                                                                $set: { creditos: data.creditos - 5 }
                                                                            }, (err, alta) => { 
                                                                                    if (err != null) {
                                                                                        res.send(err);
                                                                                    } else {
                                                                                        res.send({ error: true, mensaje: "Su puesto se ha reservado", alta:alta });
                                                                                    }
                                                                                })
                                                                           }
                                                                    }))
                                                                 }
                                                           })
                                                        }
                                                    })
                                                }
                                            })
                                        }   
                                 })
                            ) 
                    })
                            
      


/*******************************************/
/*          REALIZAR UNA RESERVA          */
/******************************************/
/* router.post("/add", (req, res) => { 
    const reserva = req.body
   //const fecha = new Date(req.body.fecha)
    //const fecha = new Date()
    const fecha = req.body.fecha
    //const usuario = req.body.uusuario

    let db = req.app.locals.db;
    
    db.collection("reservaPuesto")
        .find({ fecha: fecha}).toArray((err, dia) => {
            if (err != null) {
                res.send(err)
            } else {
                console.log(dia)
                if (dia.length !== 0) {
                    res.send({ error: true, mensaje: "No hay puestos disponibles" });
                } else {
                    db.collection("puestos")
                        .find({ puesto: reserva.id }).toArray((err, puesto) => { 
                            if (err != null) {
                                res.send(err)
                            } else { 
                                if (reserva.estado === "ocupado") {
                                    res.send({ error: true, mensaje: "El puesto está ocupado" });
                                } else { 
                                    db.collection("reservaPuesto")
                                        .insertOne({
                                            dni: reserva.dni,
                                            nombre: reserva.nombre,
                                            apellido: reserva.apellido,
                                        //id: puesto[0].id,
                                            id: reserva.id,
                                            fecha: fecha
                                        }, ((err, data) => { 
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
                                                                        $set: { creditos: datos.creditos - 5 }
                                                                    }, (err, alta) => {
                                                                        if (err != null) {
                                                                            res.send(err);
                                                                        } else {
                                                                            res.send({ error: true, mensaje: "Su puesto se ha reservado", alta:alta });
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
                            }
                        }
                    })
                })  */
             
    /************************************************/
    /*            MOSTRAR TODAS RESERVAS            */
    /************************************************/

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
                .toArray((err, datos) => {
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