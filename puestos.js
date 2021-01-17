const express = require("express");
const router = express.Router()



/*******************************************/
/*         REGISTRO: POST PUESTOS         */
/******************************************/

router.post("/add", function(req, res) {
    let id = req.body.id;

    let db = req.app.locals.db;
    db.collection("puestos")
        .insertOne({
            id: id,
        }, function (err, result) {
     if(err !== null){
       res.send({error:true, mensaje: "Error al registrar el puesto"} )
     }else{
       res.send({ error:false, mensaje: "Puesto registrado correctamente"})
     }
   })
})



module.exports = router;