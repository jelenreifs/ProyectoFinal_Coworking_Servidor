const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router()

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
/*          CONFIGURACION: MODIFICACION USER           */
/*******************************************************/

router.put("/update", function(req, res) {
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
    .find({
      dni: dni,
      foto: foto,
      nombre: nombre,
      apellido: apellido,
      tfno: tfno,
      email: email,
      fechaAlta: fechaAlta,
      fechaBaja: fechaBaja,
      creditos: creditos,
      password: password,
      administrador: administrador
    }).toArray((err, reserva) => {
      if (err != null) {
        res.send(err);
      } else {
        db.collection("users")
          .updateMany({
            dni: dni,
            foto: foto,
            nombre: nombre,
            apellido: apellido,
            tfno: tfno,
            email: email,
            fechaAlta: fechaAlta,
            fechaBaja: fechaBaja,
            creditos: creditos,
            password: password,
            administrador: administrador
          }, function (err, datos) {
              if (err != null) {
                res.send(err);
              } else { 
                 res.send({ error:true, mensaje: "Los datos se han actualizado correctamente", datos:datos });
              }
           })
       }
     })

})



/*******************************************/
/*               LOGIN            */
/******************************************/

router.post("/login", function (req,res) {
    let email = req.body.tfno;
    let password = req.body.password;

    let db = req.app.locals.db;
  db.collection("users")
    .find({ email: email })
    .toArray(function (err,arrayUsuario) {
      if (err !== null) {
        res.send({ error:true, mensaje: "Ha habido un error" });
      } else {
        if (arrayUsuario.length > 0) { 
          if (bcrypt.compareSync(password,arrayUsuario[0].password)) {
            res.send({ error:false , mensaje: "Logueado correctamente" , usuario: arrayUsuario});

          } else {
            res.send({ error:true, mensaje: "Contraseña incorrecta" });
          }
        } else {
          res.send({  error:true, mensaje: "El usuario no existe" });
        }
      }
    });
});



module.exports = router;