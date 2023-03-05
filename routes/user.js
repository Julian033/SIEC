const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


//consulta para registros
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,name,role,status,areaId from usuarios where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into usuarios (name,password,email,role,status,areaId) values (?,?,?,'user','false','1')";
                connection.query(query, [user.name, user.password, user.email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered" });
                    }

                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Email Already Exist." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//consulta login para inicio de sesion con validacion
router.post('/login', (req, res) => {
    const user = req.body
    query = "select email,name,password,role,status from usuarios where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect Username or Password " });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for admin approval" });
            }

            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8hr' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again exist." });
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
    query = "select email,password from usuarios where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {

            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your email. " });
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
                return res.status(200).json({ message: "Password sent successfully to your email. " });

            }
        }

        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/get', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    var query = "select user,name,email,status,areaId from usuarios";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update usuarios set status=? where user=?";
    connection.query(query, [user.status, user.user], (err, results) => {
        if (!err) {
            if (results.affetedRows == 0) {
                return res.status(404).json({ message: "User does not exist" });
            }
            return res.status(200).json({ message: "User Update Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.get('/checkToken', auth.authenticationToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

router.post('/changePassword', auth.authenticationToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    var query = "select * from usuarios where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {

        if (!err) {
            if (results.length <= 0) {
                
                return res.status(400).json({ message: "Incorrect Old Password" });

            }
            else if (results[0].password == user.oldPassword) {
                query = "update usuarios set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Updated Successfully." })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Something went wrong. Please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:user', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.user;
    const ls = req.body
    console.log(ls);
    var query = "delete from usuarios where user=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User id does not found " });
            }
            return res.status(200).json({ message: "User Delete Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})



module.exports = router;
