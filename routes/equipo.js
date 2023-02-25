const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require ('../services/checkRole');


router.post('/add',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let equipo = req.body;
    query = "select equipo_id,num_inventario,num_serie from equipo where num_inventario=?"
    connection.query(query,[equipo.num_inventario],(err, results)=>{
        if(!err){
            if(results.length <= 0){
                query = "insert into equipo (tipo_id,area_id,marca,modelo,procesador,generacion,ram,tipo_disco,num_serie,num_inventario,monitor,teclado,conexion,tipo_nodo,ancho_banda,num_telefono,garantia,v_antivirus,v_office,sistema_o,observaciones,status) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'true')";

                connection.query(query,[equipo.tipo_id,equipo.area_id,equipo.marca,equipo.modelo,equipo.procesador,equipo.generacion,equipo.ram,equipo.tipo_disco,equipo.num_serie,equipo.num_inventario,equipo.monitor,equipo.teclado,equipo.conexion,equipo.tipo_nodo,equipo.ancho_banda,equipo.num_telefono,equipo.garantia,equipo.v_antivirus,equipo.v_office,equipo.sistema_o,equipo.observaciones,equipo.status],(err,results)=>{
                if(!err){
                    return res.status(200).json({message: "Equipment Add Successfully."});
                }
                else{
                    return res.status(500).json(err);
                }
            })

            }
            else {
                return res.status(400).json({message:"Equiment Already Exist"})
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
}) 

router.post('/prueba', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;

    // Insertar equipo
    let query = "INSERT INTO equipos (serie, inventario, monitor, teclado, typeId, areaId) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, [equipo.serie, equipo.inventario, equipo.monitor, equipo.teclado, equipo.typeId, equipo.areaId], (err, result) => {
        if (err) return res.status(500).json(err);

        // Obtener el ID del equipo recién insertado
        const equipoId = result.insertId;

        // Insertar software
        query = "INSERT INTO software (equipoId, v_antivirus, v_office, system_o) VALUES (?, ?, ?, ?)";
        connection.query(query, [equipoId, equipo.v_antivirus, equipo.v_office, equipo.system_o], (err, result) => {
            if (err) return res.status(500).json(err);

            // Insertar hardware
            query = "INSERT INTO hardware (equipoId, brand, model, processor, generation, ram, hdd_ssd, connection, node_type, bandwidth, warranty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(query, [equipoId, equipo.brand, equipo.model, equipo.processor, equipo.generation, equipo.ram, equipo.hdd_ssd, equipo.connection, equipo.node_type, equipo.bandwidth, equipo.warranty], (err, result) => {
                if (err) return res.status(500).json(err);

                return res.status(200).json({ message: "Equipment, Hardware, and Software added successfully." });
            });
        });
    });
});


router.get('/get',auth.authenticationToken,(req,res,next)=>{
    var query = "SELECT e.marca,e.modelo,e.procesador,e.generacion,e.ram,e.tipo_disco,e.num_serie,e.num_inventario,e.monitor,e.teclado,e.conexion,e.tipo_nodo,e.ancho_banda,e.num_telefono,e.garantia,e.v_antivirus,e.v_office,e.sistema_o,e.observaciones,e.status,t.tipo_id,t.descripcion,a.area_id, a.nombre FROM equipo as e inner join tipo_equipo as t on e.tipo_id = t.tipo_id inner join area as a on e.area_id = a.area_id where e.status='true'";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


router.get('/getByArea/:id',auth.authenticationToken,(req,res,next)=>{
    const id = req.params.id;
    var query = "SELECT e.marca,e.modelo,e.procesador,e.generacion,e.ram,e.tipo_disco,e.num_serie,e.num_inventario,e.monitor,e.teclado,e.conexion,e.tipo_nodo,e.ancho_banda,e.num_telefono,e.garantia,e.v_antivirus,e.v_office,e.sistema_o,e.observaciones,e.status,t.tipo_id,t.descripcion,a.area_id, a.nombre FROM equipo as e inner join tipo_equipo as t on e.tipo_id = t.tipo_id inner join area as a on e.area_id = a.area_id where a.area_id=? and e.status='true'";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.get('/getById/:id',auth.authenticationToken,(req,res,next)=>{
    const id =req.params.id;
    var query ="SELECT e.marca,e.modelo,e.procesador,e.generacion,e.ram,e.tipo_disco,e.num_serie,e.num_inventario,e.monitor,e.teclado,e.conexion,e.tipo_nodo,e.ancho_banda,e.num_telefono,e.garantia,e.v_antivirus,e.v_office,e.sistema_o,e.observaciones,e.status,t.tipo_id,t.descripcion,a.area_id, a.nombre FROM equipo as e inner join tipo_equipo as t on e.tipo_id = t.tipo_id inner join area as a on e.area_id = a.area_id where e.equipo_id=? and status='true'";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results[0]);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let equipo = req.body;
    var query = "update equipo set tipo_id=?,area_id=?,marca=?,modelo=?,procesador=?,generacion=?, ram=?,tipo_disco=?,num_serie=?,num_inventario=?,monitor=?,teclado=?,conexion=?, tipo_nodo=?, ancho_banda=?, num_telefono=?, garantia=?, v_antivirus=?, v_office=?, sistema_o=?,observaciones=? where equipo_id=?";
    connection.query(query,[equipo.tipo_id,equipo.area_id,equipo.marca,equipo.modelo,equipo.procesador,equipo.generacion,equipo.ram,equipo.tipo_disco,equipo.num_serie,equipo.num_inventario,equipo.monitor,equipo.teclado,equipo.conexion,equipo.tipo_nodo,equipo.ancho_banda,equipo.num_telefono,equipo.garantia,equipo.v_antivirus,equipo.v_office,equipo.sistema_o,equipo.observaciones,equipo.equipo_id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Equipment Id does not found"});
            }
            
            return res.status(200).json({message:"Equipment Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }

        

    })
})


router.patch('/updateStatus',auth.authenticationToken,checkRole.checkRole,(req,res,next)=>{
    let user = req.body;
    var query = "update equipo set status=? where equipo_id=?";
    connection.query(query,[user.status,user.equipo_id],(err,results)=>{
        if(!err){
            if(results.affetedRows == 0){
                return res.status(404).json({message:"Equipment id does not found"});
            }
            return res.status(200).json({message: "Equipment Status Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})


module.exports = router;