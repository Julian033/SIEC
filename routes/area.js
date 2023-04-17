const express = require('express');
const pool = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require ('../services/checkRole');

//api para agregar nueva categoria solo administrador
router.post('/add',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let area = req.body;
    const query = "select areaId,name from area where name=?"
    pool.query(query,[area.name],(err, results)=>{
        if(!err){
            if(results.length <= 0){
                const query = "insert into area (name) values(?)";
                pool.query(query,[area.name],(err,results)=>{
                if(!err){
                    return res.status(200).json({message: "Area Add Successfully."});
                }
                else{
                    return res.status(500).json(err);
                }
            })

            }
            else {
                return res.status(400).json({message:"Area Already Exist"})
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
}) 

//api para buscar todas las areas
router.get('/get',auth.authenticationToken,(req,res,next)=>{
    const query = "select * from area order by name ASC";
    pool.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})



//api para modificar areas solo administrador
router.patch('/update',auth.authenticationToken,checkRole.checkRole, (req,res,next)=>{
    let area = req.body;
    const query = "update area set name=? where areaId=?";
    pool.query(query,[area.name,area.areaId],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "Area Id does not found"});
            }
            return res.status(200).json({message: "Area Update Sucessfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:areaId',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    const id= req.params.areaId;
    const query = "delete from area where areaId=?";
    pool.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0 ){
                return res.status(404).json({message:"Area id does not found "});
            }
            return res.status(200).json({message:"Area Delete Successfully"})
        }
        else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;