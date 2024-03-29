const express = require('express');
const pool = require('../connection');
const router = express.Router();


const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', (req, res) => {
    let user = req.body;
    const query = "select email,password,name,role,status,areaId from usuarios where email=?";
    pool.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
               const query = "insert into usuarios (name,password,email,role,status,areaId) values (?,?,?,?,?,?)";
                pool.query(query, [user.name, user.password, user.email,user.role,user.status,user.areaId], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Registrado Exitosamente" });
                    }

                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "El correo ingresado ya existe." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,name,role,status,areaId from usuarios where email=?";
    pool.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into usuarios (name,password,email,role,status,areaId) values (?,?,?,'user','false','1')";
                pool.query(query, [user.name, user.password, user.email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Registrado Exitosamente" });
                    }

                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "El correo ingresado ya existe." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/update',auth.authenticationToken,checkRole.checkRole, (req,res,next)=>{
    let area = req.body;
    const query = "update usuarios set name=?,email=?,password=?,role=?,status=?,areaId=? where userId=?";
    pool.query(query,[area.name,area.email,area.password,area.role,area.status,area.areaId,area.userId],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Usuario no encontrado"});
            }
            return res.status(200).json({message: "Actualización de usuario correctamente"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.post('/login', (req, res) => {
    const user = req.body
    const query = "select email,name,password,role,status from usuarios where email=?";
    pool.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Usuario o contraseña incorrectos " });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Espere la aprobación del administrador" });
            }

            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8hr' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Algo salió mal. Inténtalo de nuevo." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })

})


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotpassword', (req, res) => {
    const user = req.body;
    const query = "select email,password from usuarios where email=?";
    pool.query(query, [user.email], (err, results) => {
        if (!err) {

            if (results.length <= 0) {
                return res.status(200).json({ message: "Contraseña enviada con éxito. " });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Password by SIEC Centro',
                    html: '<p><b> Your login details for SIEC Centro </b><br><b>Email:</b>' + results[0].email + '<br><b>Password: </b>' + results[0].password + '<br><a href="http://localhost:4200/">Click here to login</p>'
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: "Contraseña enviada con éxito. " });

            }
        }

        else {
            return res.status(500).json(err);
        }
    })
})
/*
router.get('/get', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    var query = "select u.userId,u.name,u.email,u.role,u.status,a.name as area from usuarios u inner join area a on u.areaId= a.areaId";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})
*/

router.get('/get', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    const query = "select u.userId,u.name,u.email,u.role,u.status,a.name as area from usuarios u inner join area a on u.areaId= a.areaId";
    pool.query(query, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json(results);
    });
});


router.get('/checkToken', auth.authenticationToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword', auth.authenticationToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    const query = "select * from usuarios where email=? and password=?";
    pool.query(query, [email, user.oldPassword], (err, results) => {

        if (!err) {
            if (results.length <= 0) {
                
                return res.status(400).json({ message: "Contraseña antigua incorrecta" });

            }
            else if (results[0].password == user.oldPassword) {
                query = "update usuarios set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Contraseña actualizada exitosamente." })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Algo salió mal. Por favor, inténtelo de nuevo más tarde" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:userId', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.userId;
    const query = "delete from usuarios where userId=?";
    pool.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "ID de usuario no encontrado " });
            }
            return res.status(200).json({ message: "Usuario eliminado con exito" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.patch('/updateStatus', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "update usuarios set status=? where userId=?";
    pool.query(query, [user.status, user.userId], (err, results) => {
        if (!err) {
            if (results.affetedRows == 0) {
                return res.status(404).json({ message: "ID de usuario no encontrado" });
            }
            return res.status(200).json({ message: "Estado de usuario actualizado con éxito" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})



module.exports = router;
