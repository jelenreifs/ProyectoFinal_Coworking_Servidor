const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const ObjectId = require("mongodb").ObjectID; 

/*******************************************/
/*              GET USUARIOS              */
/******************************************/

router.get("/", (req, res) => {
  let db = req.app.locals.db;
  db.collection("users")
        .find()
        .toArray((err, datos) => {
        if(err!=null) {
            res.send(err);
        } else {
            res.send(datos);
        }
    });
}); 


/*******************************************/
/*          REGISTRO: POST USER           */
/******************************************/

router.post("/add", function(req, res) {
    let dni = req.body.dni;
    let foto = req.body.foto;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let tfno = req.body.tfno;
    let email = req.body.email;
    let fechaAlta = req.body.fechaAlta;
    let fechaBaja = req.body.fechaBaja;
    let creditos = req.body.creditos;
    let password = bcrypt.hashSync( req.body.password, 10 );
    let administrador = req.body.administrador;

  
   

    let db = req.app.locals.db;
    db.collection("users")
        .insertOne({
            dni: dni,
            foto:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBmfaerMMCR6jgdXwmlfYFycBhBCBKAXftOw&usqp=CAU",
            nombre : nombre,
            apellido : apellido,
            tfno : tfno,
            email : email,
            fechaAlta : fechaAlta,
            fechaBaja : fechaBaja,
            creditos : creditos,
            password : password,
            administrador : false
        }, function (err, datos) {
     if(err !== null){
       res.send({error:true, mensaje: "Error al registrar el usuario"} )
     }else{
       res.send({ error:false, mensaje: "Usuario registrado correctamente", datos:datos })
     }
   })
})



/*******************************************************/
/*                MODIFICACION USER               */
/*******************************************************/

router.put("/update", function (req, res) {
    const usuario = req.body
  
    let dni = req.body.dni;
    let foto = req.body.foto;
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
  let email = req.body.email;
  let tfno = req.body.tfno;
    let password = bcrypt.hashSync( req.body.password, 10 ); 

  
let db = req.app.locals.db;
console.log(req.body)
  db.collection("users")
    .updateOne(
      {
        email:email
      }, { $set:
              {
                dni:dni,
                foto:foto,
                nombre:nombre,
                apellido:apellido,
                tfno:tfno,
                password: password
              }
      },function (err, datos) {
        if (err != null) {
            console.log("error")
            res.send({error: true, mensaje: "Los datos no se han actualizado", err: err });

        } else { 
           console.log("sin error")
            res.send({ error: false, mensaje: "Los datos se han actualizado correctamente", datos: datos });
          
       }
    }
  );
});



/*******************************************************/
/*               ELIMINAR USUARIO              */
/*******************************************************/

router.delete("/delete", function (req, res) {
    const id = ObjectId(req.body.id)
  
  let db = req.app.locals.db;
   db.collection("users")
    .deleteOne({ _id: id },function (err, datos) {
    if (err !== null) {
      res.send(err);
    } else {
      res.send({ error: false, mensaje: "El usuario de ha dado de baja", datos:datos });
    }
  })
});


module.exports = router;