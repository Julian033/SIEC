const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;
    let query = "INSERT INTO equipos (sn, inventory, monitor, keyboard, status, typeId, areaId) VALUES (?, ?, ?, ?,'false', ?, ?)";
    connection.query(query, [equipo.sn, equipo.inventory, equipo.monitor, equipo.keyboard, equipo.typeId, equipo.areaId], (err, result) => {
        if (err) return res.status(500).json(err);

        // Obtener el ID del equipo recién insertado
        const equipoId = result.insertId;

        // Insertar software
        query = "INSERT INTO software (equipoId, antivirus, office, systemo) VALUES (?, ?, ?, ?)";
        connection.query(query, [equipoId, equipo.antivirus, equipo.office, equipo.systemo], (err, result) => {
            if (err) return res.status(500).json(err);

            // Insertar hardware
            query = "INSERT INTO hardware (equipoId, brand, model, processor, generation, ram, hddssd, connection, nodetype, bandwidth, warranty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            connection.query(query, [equipoId, equipo.brand, equipo.model, equipo.processor, equipo.generation, equipo.ram, equipo.hddssd, equipo.connection, equipo.nodetype, equipo.bandwidth, equipo.warranty], (err, result) => {
                if (err) return res.status(500).json(err);

                return res.status(200).json({ message: "Equipment, Hardware, and Software added successfully." });
            });
        });
    });
});


router.get('/get', auth.authenticationToken, (req, res, next) => {
    var query = "SELECT e.equipoId, e.sn, e.inventory,e.monitor,e.keyboard,e.status,h.brand, h.model,h.processor,h.generation,h.ram,h.hddssd,h.connection,h.nodetype,h.bandwidth,h.warranty,s.antivirus, s.office, s.systemo,t.name as Type,a.name as Area FROM equipos e INNER JOIN hardware h ON e.equipoId = h.equipoId INNER JOIN type t ON e.typeId = t.typeId INNER JOIN area a ON e.areaId = a.areaId INNER JOIN software s ON e.equipoId = s.equipoId;";
    connection.query(query, (err, results) => {
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
    let query = "UPDATE equipos e INNER JOIN hardware h ON e.equipoId = h.equipoId INNER JOIN software s ON e.equipoId = s.equipoId SET e.sn = ?, e.inventory = ?, e.monitor = ?, e.keyboard = ?, e.typeId = ?, e.areaId = ?, h.brand = ?, h.model = ?, h.processor = ?, h.generation = ?, h.ram = ?, h.hddssd = ?, h.connection = ?, h.nodetype = ?, h.bandwidth = ?, h.warranty = ?, s.antivirus = ?, s.office = ?, s.systemo = ? WHERE e.equipoId = ?";
    connection.query(query, [equipo.sn, equipo.inventory, equipo.monitor, equipo.keyboard, equipo.typeId, equipo.areaId, equipo.brand, equipo.model, equipo.processor, equipo.generation, equipo.ram, equipo.hddssd, equipo.connection, equipo.nodetype, equipo.bandwidth, equipo.warranty, equipo.antivirus, equipo.office, equipo.systemo, equipo.equipoId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Equipment Id does not found" });
            }
            return res.status(200).json({ message: "Equipment Update Sucessfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "update equipos set status=? where equipoId=?";
    connection.query(query, [user.status, user.equipoId], (err, results) => {
        if (!err) {
            if (results.affetedRows == 0) {
                return res.status(404).json({ message: "Equipment id does not found" });
            }
            return res.status(200).json({ message: "Equipment Status Updated Successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:equipoId', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.equipoId;
    console.log(id);
    var query = "delete from equipos where equipoId=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Equipment id does not found " });
            }
            return res.status(200).json({ message: "Equipment Delete Successfully" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;