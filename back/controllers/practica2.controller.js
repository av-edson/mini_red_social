const express = require("express");
const router = express.Router();
const sql = require("../config/mysqlConnection");
const fs = require("fs");
const uuid = require("uuid");
const s3 = require("./digital");
// PARA SUBIR IMAGENES

router.get("/", root);
// router.post("/upload", uploadFile);
router.post("/registry", registrarUsuario);
router.post("/obtenerUsuario", obtenerUsuario);
router.post("/login", ingresarUsuario);
router.post("/editarUsuario", editarUsuario);
router.post("/crearPublicacion", crearPublicacion);
router.post("/obtenerPublicaciones", obtenerPublicaciones);
router.post("/enviarSolicitud", enviarSolicitud);
router.post("/aceptarSolicitud", aceptarSolicitud);
router.post("/rechazarSolicitud", rechazarSolicitud);
router.post("/verSolicitudes", verSolicitudes);
router.post("/contarSolicitudes", contarSolicitudes);
router.post("/verAmigos", verAmigos);
router.post("/noAmigos", noAmigos);

async function uploadFile(req, res) {
  let { username, fullname, pass, photo } = req.body;
  let resultado = await s3.upload(photo, username);
  // let resultado = await s3.delete(username)
  if (resultado) {
    return res
      .status(200)
      .json({ status: 1, description: "Se subio correctamente" });
  } else
    return res
      .status(400)
      .json({ status: -1, description: "error en subir foto" });
}

async function root(req, res) {
  res.send(`Se accedio correctamente`);
}

// FUNCION DE REGISTRAR
async function registrarUsuario(req, res) {
  const { username, fullname, pass, photo } = req.body;
  var pathRender = `profiles/profile-${username}.jpg`;

  if (await s3.upload(photo, username)) {
    sql.query(
      `INSERT INTO Usuario(usuario, nombre, contra, foto) VALUES('${username}', '${fullname}', '${pass}', '${pathRender}')`,
      (err, result) => {
        if (!err) {
          return res
            .status(200)
            .json({ status: 1, description: "Usuario creado con exito" });
        } else {
          console.log(err);
          s3.delete(username);
          return res
            .status(400)
            .json({ status: 1, description: "error en creacion" });
        }
      }
    );
  } else
    return res
      .status(400)
      .json({ status: 1, description: "error en creacion" });
}
// FUNCION DE GET USER DATA
async function obtenerUsuario(req, res) {
  const { id } = req.body;
  sql.query(`SELECT * FROM Usuario WHERE id = ${id};`, (err, result) => {
    if (err) return res.status(400).json({ error: err });
    if (result.length == 0) {
      return res.status(400).json({ description: "No user found" });
    }
    jsonres = {
      id: result[0].id,
      usuario: result[0].usuario,
      nombre: result[0].nombre,
      contra: result[0].contra,
      foto: result[0].foto,
    };
    return res.status(200).send(jsonres);
  });
}
// FUNCION LOGIN
async function ingresarUsuario(req, res) {
  const { usuario, contra } = req.body;

  sql.query(
    `SELECT * FROM Usuario
        WHERE usuario = '${usuario}' and contra = '${contra}'`,
    (err, result) => {
      if (result.length == 0) {
        return res.status(400).json({ id: -1 });
      }
      let data = result[0];
      if (!err) {
        return res.status(200).json({ id: data["id"] });
      }
    }
  );
}
// FUNCION EDITAR USUARIO
async function editarUsuario(req, res) {
  const { id, username, fullname, pass, photo } = req.body;

  var pathRender = `profiles/profile-${username}.jpg`;
  if (await s3.upload(photo, username)) {
    sql.query(
      `UPDATE Usuario Set usuario = '${username}', nombre = '${fullname}', contra = '${pass}',
      foto = '${pathRender}'
      WHERE id = ${id}`,
      (err, result) => {
        if (!err) return res.status(200).json({ status: 200 });
        else {
          s3.delete(username);
          return res.status(400).json({ status: 400 });
        }
      }
    );
  } else {
    return res.status(400).json({ status: 400 });
  }
}
// FUNCION PARA CREAR PUBLICACIONES
async function crearPublicacion(req, res) {
  let { id, contenido, imagen } = req.body;

  if (imagen != "") {
    var imgPath = "publications/" + id + "/" + uuid.v4() + ".jpg";
    if (await s3.uploadPublication(imagen, imgPath)) {
      sql.query(
        `INSERT INTO Publicacion(descripcion, foto, fecha) 
                  VALUES('${contenido}', '${imgPath}', NOW())`,
        (err, result) => {
          if (err) return res.status(400).json({ status: 400 });

          sql.query(
            `INSERT INTO Publicaciones VALUES(${id}, ${result.insertId})`,
            (err, result) => {
              if (!err) return res.status(200).json({ status: 200 });
              return res.status(400).json({ status: 400 });
            }
          );
        }
      );
    } else {
      console.log("error al subir la imagen");
      return res.status(400).json({ status: 400 });
    }
  } else {
    sql.query(
      `INSERT INTO Publicacion(descripcion, foto, fecha) 
            VALUES('${contenido}', '', NOW())`,
      (err, result) => {
        if (err) return res.status(400).json({ status: 400 });

        sql.query(
          `INSERT INTO Publicaciones VALUES(${id}, ${result.insertId})`,
          (err, result) => {
            if (!err) return res.status(200).json({ status: 200 });
            return res.status(400).json({ status: 400 });
          }
        );
      }
    );
  }
}
// FUNCION PARA OBTENER LAS PUBLICACIONES
async function obtenerPublicaciones(req, res) {
  const { id } = req.body;
  sql.query(
    `SELECT u.usuario, p.descripcion as contenido, p.foto as imagen, DATE_FORMAT(p.fecha, '%d/%m/%Y') as fecha
                FROM Usuario u, Publicacion p, Publicaciones ps
                    WHERE ps.idUsuario = u.id AND ps.idPublicacion = p.id
                        AND u.id in 
                        (
                            SELECT u.id FROM Solicitud s INNER JOIN Usuario u ON (u.id = s.usuarioEmisor OR u.id = s.usuarioReceptor)
                            WHERE (s.usuarioEmisor = ${id} OR s.usuarioReceptor = ${id}) AND u.id != ${id} AND s.estado = 1
                            
                            UNION
                            
                            SELECT ${id}
                        )
                        ORDER BY p.fecha DESC;`,
    (err, result) => {
      if (err) return res.status(400).json({ error: err });
      return res.status(200).json({ data: result });
    }
  );
}
// SOLICITUDES DE AMISTAD
async function enviarSolicitud(req, res) {
  const { id, userAmigo } = req.body;

  sql.query(
    `INSERT INTO Solicitud(usuarioEmisor, usuarioReceptor, estado) SELECT ${id}, id, 0 FROM Usuario WHERE usuario='${userAmigo}';`,
    (err, result) => {
      if (!err) return res.status(200).json({ status: 200 });
      return res.status(400).json({ status: 400 });
    }
  );
}
// FUNCION ACEPTAR SOLICITUD
async function aceptarSolicitud(req, res) {
  const { id, userAmigo } = req.body;

  sql.query(
    `UPDATE Solicitud SET estado = 1 WHERE usuarioReceptor = ${id} AND usuarioEmisor = (
        SELECT id FROM Usuario WHERE usuario='${userAmigo}');`,
    (err, result) => {
      if (!err) return res.status(200).json({ status: 200 });
      return res.status(400).json({ status: 400 });
    }
  );
}
// FUNCION RECHAZAR SOLICITUD
async function rechazarSolicitud(req, res) {
  const { id, userAmigo } = req.body;

  sql.query(
    `DELETE FROM Solicitud WHERE usuarioReceptor = ${id} AND usuarioEmisor = (
        SELECT id FROM Usuario WHERE usuario = '${userAmigo}') AND estado = 0;`,
    (err, result) => {
      if (!err) return res.status(200).json({ status: 200 });
      return res.status(400).json({ status: 400 });
    }
  );
}
// FUNCION PARA VER LAS SOLICITUDES Y FOTOS
async function verSolicitudes(req, res) {
  const { id } = req.body;

  sql.query(
    `SELECT u.usuario, u.nombre, u.foto FROM Solicitud s INNER JOIN Usuario u ON u.id = s.usuarioEmisor WHERE s.usuarioReceptor = ${id} AND s.estado = 0;`,
    (err, result) => {
      if (!err) {
        return res.status(200).json({ data: result });
      } else {
        return res.status(400).json({ data: err });
      }
    }
  );
}
// FUNCION PARA CONTAR SOLICITUDES
async function contarSolicitudes(req, res) {
  const { id } = req.body;

  sql.query(
    `SELECT COUNT(*) as nuevas FROM Solicitud WHERE usuarioReceptor = ${id} AND estado = 0;`,
    (err, result) => {
      if (!err) return res.status(200).json({ data: result });
      return res.status(400).json({ data: err });
    }
  );
}

// VER AMIGOS/NO AMIGOS
async function verAmigos(req, res) {
  const { id } = req.body;

  sql.query(
    `SELECT u.usuario, u.nombre, u.foto FROM Solicitud s INNER JOIN Usuario u ON (u.id = s.usuarioEmisor OR u.id = s.usuarioReceptor)
        WHERE (s.usuarioEmisor = ${id} OR s.usuarioReceptor = ${id}) AND u.id != ${id} AND s.estado = 1;`,
    (err, result) => {
      if (!err) {
        return res.status(200).json({ data: result });
      } else {
        return res.status(400).json({ data: err });
      }
    }
  );
}

async function noAmigos(req, res) {
  const { id } = req.body;

  sql.query(
    `SELECT u.usuario, u.nombre, u.foto
        FROM Usuario u WHERE
        u.id not in (
        SELECT (CASE WHEN s.usuarioEmisor = ${id} THEN s.usuarioReceptor ELSE s.usuarioEmisor END)
        FROM Usuario u, Solicitud s
        WHERE s.usuarioEmisor = ${id} OR s.usuarioReceptor = ${id}
        UNION
        SELECT ${id} )
        ORDER BY u.usuario asc;`,
    (err, result) => {
      if (!err) {
        return res.status(200).json({ data: result });
      } else {
        return res.status(400).json({ data: err });
      }
    }
  );
}

module.exports = router;
