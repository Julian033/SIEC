const express = require('express');
const pool = require ('../connection');
const router = express.Router();
var auth = require('../services/authentication');

router.get('/details', auth.authenticationToken,(req,res,next)=>{
   var areaCount;
    var equipoCount;
    var typeCount;
    var userCount;

    var query = "select count(areaId) as Areas from area";
    pool.query(query,(err,results)=>{
        if(!err){
            areaCount= results[0].Areas;
        }
        else{
            return res.status(500).json(err);
        }
    })

    var query = "select count(typeId) as Types from type";
    pool.query(query,(err,results)=>{
        if(!err){
            typeCount= results[0].Types;
        }
        else{
            return res.status(500).json(err);
        }
    })

    var query = "select count(userId) as Users from usuarios";
    pool.query(query,(err,results)=>{
        if(!err){
            userCount= results[0].Users;
        }
        else{
            return res.status(500).json(err);
        }
    })

        var query = "select count(equipoId) as Equipos from equipos";
    pool.query(query,(err,results)=>{
        if(!err){
            equipoCount = results[0].Equipos;
            var data = {
                area:areaCount,
                equipos:equipoCount,
                type:typeCount,
                user:userCount
            };
            return res.status(200).json(data);
        }
        else{
            return res.status(500).json(err);
        }
    })
    


    


})

module.exports = router;