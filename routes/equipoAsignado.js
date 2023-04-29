const express = require('express');
const pool = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');



router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;
    const checkQuery = "select e.inventory, ea.equipoId from equipo_usuario as ea INNER JOIN equipos e ON e.equipoId=ea.equipoId where inventory=?";
    pool.query(checkQuery, [equipo.inventory], (err, results) => {
      if (err) return res.status(500).json(err);
  
      if (results.length > 0) {
        return res.status(400).json({ message: "El equipo ya está asignado." });
      }
  
      const query = "SELECT equipoId FROM equipos WHERE inventory = ?";
      pool.query(query, [equipo.inventory], (err, results) => {
        if (err) return res.status(500).json(err);
  
        if (results.length === 0) {
          return res.status(404).json({ message: "No se encontró el equipo con el número de inventario dado." });
        }
  
        const equipoId = results[0].equipoId;
  
        const insertQuery = "INSERT INTO equipo_usuario (equipoId, userId) VALUES (?, ?)";
        pool.query(insertQuery, [equipoId, equipo.userId], (err, result) => {
          if (err) return res.status(500).json(err);
  
          return res.status(200).json({ message: "Asignación de equipo exitosa." });
        });
      });
    });
  });
  

router.get('/get', auth.authenticationToken, (req, res, next) => {
    const query = "select ea.asignadoId, e.inventory ,u.name as userId, a.name as areaId from equipo_usuario AS ea INNER JOIN equipos e ON ea.equipoId=e.equipoId INNER JOIN usuarios u ON ea.userId=u.userId INNER JOIN area a ON u.areaId=a.areaId";
    pool.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:areaId', auth.authenticationToken, (req, res, next) => {
    const areaId = req.params.areaId;
    const query = "select * from usuarios where areaId=?";
    pool.query(query, [areaId], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})


router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;
    const query = "SELECT equipoId FROM equipos WHERE inventory = ?";
    pool.query(query, [equipo.inventory], (err, results) => {
        
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ message: "No se encontró el equipo con el número de inventario dado." });
        }

        const equipoId = results[0].equipoId;

        const query = "UPDATE equipo_usuario SET equipoId = ?,userId=? WHERE asignadoId = ?";
        pool.query(query, [equipoId, equipo.userId,equipo.asignadoId], (err, result) => {
            if (err) return res.status(500).json(err);

            return res.status(200).json({ message: "Actualización de asignación de equipo exitosa." });
        });
    });
});


router.delete('/delete/:asignadoId',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    const id= req.params.asignadoId;
    const query = "delete from equipo_usuario where asignadoId=?";
    console.log(id);
    pool.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0 ){
                return res.status(404).json({message:"ID no encontrado "});
            }
            return res.status(200).json({message:"Area eliminada exitosamente"})
        }
        else{
            return res.status(500).json(err);
        }
    })
})



module.exports = router;