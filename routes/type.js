const express = require('express');
const pool = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require ('../services/checkRole');


//api para agregar un nuevo equipo donde se valida antes si esta ingresado con anterioridad
router.post('/add',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let equipo = req.body;
    const query = "select name from type where name=?"
    pool.query(query,[equipo.name],(err, results)=>{
        if(!err){
            if(results.length <= 0){
               const query = "insert into type (name) values(?)";
                pool.query(query,[equipo.name],(err,results)=>{
                if(!err){
                    return res.status(200).json({message: "Type Equipment Add Successfully."});
                }
                else{
                    return res.status(500).json(err);
                }
            })

            }
            else {
                return res.status(400).json({message:"Type Equipment Already Exist"})
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
}) 

//api para buscar todas los equipos
router.get('/get',auth.authenticationToken,(req,res,next)=>{
    const query = "select * from type order by name";
    pool.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


//api para modificar equipos solo administrador
router.patch('/update',auth.authenticationToken,checkRole.checkRole, (req,res,next)=>{
    let equipo = req.body;
    const query = "update type set name=? where typeId=?";
    pool.query(query,[equipo.name,equipo .typeId],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Type Id does not found"});
            }
            return res.status(200).json({message: "Type Update Sucessfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.delete('/delete/:typeId',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    const id= req.params.typeId;
    const query = "delete from type where typeId=?";
    pool.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0 ){
                return res.status(404).json({message:"Type id does not found "});
            }
            return res.status(200).json({message:"Type Delete Successfully"})
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router; 