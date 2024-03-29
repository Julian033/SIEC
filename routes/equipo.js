const express = require('express');
const pool = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

router.post('/add', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;
    const query = "SELECT * FROM equipos WHERE inventory = ?";
    pool.query(query, [equipo.inventory], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length > 0) {
            return res.status(409).json({ message: "El equipo ya existe." });
        }

        // Si el equipo no existe, se puede proceder con la inserción
        const query = "INSERT INTO equipos (sn, inventory, monitor, keyboard, status, typeId, areaId) VALUES (?, ?, ?,'false',?, ?, ?)";
        pool.query(query, [equipo.sn, equipo.inventory, equipo.monitor, equipo.keyboard, equipo.typeId, equipo.areaId], (err, result) => {
            if (err) return res.status(500).json(err);

            // Obtener el ID del equipo recién insertado
            const equipoId = result.insertId;

            // Insertar software
            const query = "INSERT INTO software (equipoId, antivirus, office, systemo, fechaInstalacion) VALUES (?, ?, ?, ?, ?)";
            pool.query(query, [equipoId, equipo.antivirus, equipo.office, equipo.systemo, equipo.fechaInstalacion], (err, result) => {
                if (err) return res.status(500).json(err);

                // Insertar hardware
                const query = "INSERT INTO hardware (equipoId, brand, model, processor, generation, ram, hddssd, connection, nodetype, bandwidth, warranty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                pool.query(query, [equipoId, equipo.brand, equipo.model, equipo.processor, equipo.generation, equipo.ram, equipo.hddssd, equipo.connection, equipo.nodetype, equipo.bandwidth, equipo.warranty], (err, result) => {
                    if (err) return res.status(500).json(err);

                    return res.status(200).json({ message: "Equipo, Hardware y Software agregados exitosamente." });
                });
            });
        });
    });
});


router.get('/get', auth.authenticationToken, (req, res, next) => {
    const query = "SELECT e.equipoId, e.sn, e.inventory,e.monitor,e.keyboard,e.status,h.brand, h.model,h.processor,h.generation,h.ram,h.hddssd,h.connection,h.nodetype,h.bandwidth,h.warranty,s.antivirus, s.office, s.systemo,s.fechaInstalacion,t.name as typeId,a.name as areaId FROM equipos e INNER JOIN hardware h ON e.equipoId = h.equipoId INNER JOIN type t ON e.typeId = t.typeId INNER JOIN area a ON e.areaId = a.areaId INNER JOIN software s ON e.equipoId = s.equipoId;";
    pool.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.get('/getSoftware', auth.authenticationToken, (req, res, next) => {
    const query = "select e.inventory, s.softwareId,s.antivirus, s.office, s.systemo from software as s INNER JOIN equipos e ON s.equipoId = e.equipoId ";
    pool.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateSoftware', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;
    const query = "update software set antivirus=?, office=?, systemo=?  WHERE softwareId=?";
    pool.query(query, [equipo.antivirus,equipo.office,equipo.systemo,equipo.softwareId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "No se encuentra el ID" });
            }
            return res.status(200).json({ message: "Software actualizado exitosamente" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})



router.patch('/update', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let equipo = req.body;
    const query = "UPDATE equipos e INNER JOIN hardware h ON e.equipoId = h.equipoId INNER JOIN software s ON e.equipoId = s.equipoId SET e.sn = ?, e.inventory = ?, e.monitor = ?, e.keyboard = ? ,e.typeId = ?, e.areaId = ?, h.brand = ?, h.model = ?, h.processor = ?, h.generation = ?, h.ram = ?, h.hddssd = ?, h.connection = ?, h.nodetype = ?, h.bandwidth = ?, h.warranty = ?, s.antivirus = ?, s.office = ?, s.systemo = ?, s.fechaInstalacion = ? WHERE e.equipoId = ?";
    pool.query(query, [equipo.sn, equipo.inventory, equipo.monitor, equipo.keyboard, equipo.typeId, equipo.areaId, equipo.brand, equipo.model, equipo.processor, equipo.generation, equipo.ram, equipo.hddssd, equipo.connection, equipo.nodetype, equipo.bandwidth, equipo.warranty, equipo.antivirus, equipo.office, equipo.systemo,equipo.fechaInstalacion, equipo.equipoId], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "No se encuentra el ID" });
            }
            return res.status(200).json({ message: "Equipo actualizado exitosamente" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    let user = req.body;
    const query = "update equipos set status=? where equipoId=?";
    pool.query(query, [user.status, user.equipoId], (err, results) => {
        if (!err) {
            if (results.affetedRows == 0) {
                return res.status(404).json({ message: "No se encuentra el ID del equipo" });
            }
            return res.status(200).json({ message: "El estatus del equipo se actualizo exitosamente" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:equipoId', auth.authenticationToken, checkRole.checkRole, (req, res, next) => {
    const id = req.params.equipoId;
    const query = "delete from equipos where equipoId=?";
    pool.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "No se encuentra el ID del equipo " });
            }
            return res.status(200).json({ message: "Equipo eliminado exitosamente" })
        }
        else {
            return res.status(500).json(err);
        }
    })
})


module.exports = router;