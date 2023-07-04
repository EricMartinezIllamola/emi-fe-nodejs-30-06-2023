const express = require('express');
const app = express();
const port = 3000;
const db = require("./db");

app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

//Home
app.get("/", (req, res) => {
    res.render("home");
});

//Seleccionar todos los prodcutos (Read)
app.get("/index_productos", (req, res) => {
    sql = "SELECT * FROM productos";
    db.query(sql, (error, results) => {
        if (error) throw error;
        res.render("index_productos", { productos: results });
    });
});

//Seleccionar todos los prodcutos + Join (Read)
app.get("/index_total", (req, res) => {
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id";
    db.query(sql, (error, results) => {
        if (error) throw error;
        res.render("index_total", { productos: results });
    });
});

// Seleccionar los prodcutos con filtros (Read)
app.post("/index_total", (req, res) => {
    const { categoria, fabricante } = req.body;
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id WHERE c.nombre = ? AND f.nombre = ?";
    db.query(sql, [categoria, fabricante], (error, results) => {
        if (error) throw error;
        res.render("index_total", { productos: results });
    });
});

//Seleccionar todos los prodcutos + Join (Read)
app.get("/index_rango_precios", (req, res) => {
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id";
    db.query(sql, (error, results) => {
        if (error) throw error;
        res.render("index_rango_precios", { productos: results });
    });
});

// Seleccionar los prodcutos rango precios (Read)
app.post("/index_rango_precios", (req, res) => {
    const { min, max } = req.body;
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id WHERE p.precio BETWEEN ? AND ?";
    db.query(sql, [min, max], (error, results) => {
        if (error) throw error;
        res.render("index_rango_precios", { productos: results });
    });
});

//Seleccionar todos los prodcutos + Join (Read)
app.get("/index_asc_desc", (req, res) => {
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id";
    db.query(sql, (error, results) => {
        if (error) throw error;
        res.render("index_asc_desc", { productos: results });
    });
});

// Seleccionar los prodcutos ordenados (Read)
app.post("/index_asc_desc", (req, res) => {
    const { campo, orden } = req.body;
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id ORDER BY ? ?";
    db.query(sql, [campo, orden], (error, results) => {
        if (error) throw error;
        res.render("index_asc_desc", { productos: results });
    });
});

//Seleccionar todos los prodcutos + Join + Selectores (Read)
app.get("/index_filtros", (req, res) => {
    db.query("SELECT nombre FROM fabricantes", (error, results) => {
        if (error) throw error;
        res.render("index_filtros", { fabricantes: results });
    });
    db.query("SELECT nombre FROM categorias", (error, results2) => {
        if (error) throw error;
        res.render("index_filtros", { categorias: results2 });
    });
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id";
    db.query(sql, (error, results3) => {
        if (error) throw error;
        res.render("index_filtros", { productos: results3 });
    });
});

//Seleccionar todos los prodcutos + Join + Selectores (Read)
// const Selectores = (req, res) => {
//     Promise.all([
//         db.query("SELECT nombre FROM fabricantes"),
//         db.query("SELECT nombre FROM categorias"),
//         db.query("SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id")
//     ]).then(function ([f_results, c_results, p_results]) {
//         res.render('index_filtros', {
//             fabricantes: f_results,
//             categorias: c_results,
//             productos: p_results
//         });
//     }, function (error) {
//         throw error;
//     });
// };

// Seleccionar los prodcutos con filtros (Read)
app.post("/index_filtros", (req, res) => {
    const { categoria, fabricante } = req.body;
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id WHERE c.nombre = ? AND f.nombre = ?";
    db.query(sql, [categoria, fabricante], (error, results) => {
        if (error) throw error;
        res.render("index_filtros", { productos: results });
    });
});

//Eliminar un producto de la base de datos (Delete)
app.get("/eliminar_productos/:id", (req, res) => {
    const id = req.params.id;
    sql = "DELETE FROM productos WHERE id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.redirect("/index_productos");
    });
});

//Mostrar formulario para agregar un producto (Pre_Create)
app.get("/agregar_productos", (req, res) => {
    res.render("agregar_productos");
});


//Agregar un producto a la base de datos (Create)
app.post("/agregar_productos", (req, res) => {
    const { categoria_id, fabricante_id, nombre, precio, stock } = req.body;
    sql = "INSERT INTO productos SET ?";
    db.query(sql, { categoria_id, fabricante_id, nombre, precio, stock }, (error, results) => {
        if (error) throw error;
        res.redirect("/index_productos");
    });
});

//Mostrar formulario para editar un producto (Pre_Update)
app.get("/editar_productos/:id", (req, res) => {
    const id = req.params.id;
    sql = "SELECT * FROM productos WHERE id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.render("editar_productos", { producto: results[0] });
    });
});

//Editar los datos de un producto (Update)
app.post("/editar_productos/:id", (req, res) => {
    const id = req.params.id;
    const { categoria_id, fabricante_id, nombre, precio, stock } = req.body;
    sql = "UPDATE productos SET categoria_id = ?, fabricante_id = ?, nombre = ?, precio = ?, stock = ? WHERE id = ?";
    db.query(sql, [categoria_id, fabricante_id, nombre, precio, stock, id], (error, results) => {
        if (error) throw error;
        res.redirect("/index_productos");
    });
});

//Seleccionar todos los fabricantes (Read)
app.get("/index_fabricantes", (req, res) => {
    sql = "SELECT * FROM fabricantes";
    db.query(sql, (error, results) => {
        if (error) throw error;
        res.render("index_fabricantes", { fabricantes: results });
    });
});

//Filtar los productos por fabricante (Read)
app.get("/listar_fabricantes/:id", (req, res) => {
    const id = req.params.id;
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id WHERE fabricante_id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.render("listar_fabricantes", { productos: results });
    });
});

//Eliminar un fabricante de la base de datos (Delete)
app.get("/eliminar_fabricantes/:id", (req, res) => {
    const id = req.params.id;
    sql = "DELETE FROM fabricantes WHERE id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.redirect("/index_fabricantes");
    });
});

//Mostrar formulario para agregar un fabricante (Pre_Create)
app.get("/agregar_fabricantes", (req, res) => {
    res.render("agregar_fabricantes");
});


//Agregar un fabricante a la base de datos (Create)
app.post("/agregar_fabricantes", (req, res) => {
    const { nombre } = req.body;
    sql = "INSERT INTO fabricantes SET ?";
    db.query(sql, { nombre }, (error, results) => {
        if (error) throw error;
        res.redirect("/index_fabricantes");
    });
});

//Mostrar formulario para editar un fabricante (Pre_Update)
app.get("/editar_fabricantes/:id", (req, res) => {
    const id = req.params.id;
    sql = "SELECT * FROM fabricantes WHERE id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.render("editar_fabricantes", { fabricante: results[0] });
    });
});

//Editar los datos de un fabricante (Update)
app.post("/editar_fabricantes/:id", (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    sql = "UPDATE fabricantes SET nombre = ? WHERE id = ?";
    db.query(sql, [nombre, id], (error, results) => {
        if (error) throw error;
        res.redirect("/index_fabricantes");
    });
});

//Seleccionar todas las categorias (Read)
app.get("/index_categorias", (req, res) => {
    sql = "SELECT * FROM categorias";
    db.query(sql, (error, results) => {
        if (error) throw error;
        res.render("index_categorias", { categorias: results });
    });
});

//Filtar los productos por categoría (Read)
app.get("/listar_categorias/:id", (req, res) => {
    const id = req.params.id;
    sql = "SELECT p.id, c.nombre AS categoria, f.nombre AS fabricante, p.nombre, p.precio, p.stock FROM productos AS p JOIN categorias AS c ON p.categoria_id = c.id JOIN fabricantes AS f ON p.fabricante_id = f.id WHERE categoria_id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.render("listar_categorias", { productos: results });
    });
});

//Eliminar un fabricante de la base de datos (Delete)
app.get("/eliminar_categorias/:id", (req, res) => {
    const id = req.params.id;
    sql = "DELETE FROM categorias WHERE id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.redirect("/index_categorias");
    });
});

//Mostrar formulario para agregar una categoria (Pre_Create)
app.get("/agregar_categorias", (req, res) => {
    res.render("agregar_categorias");
});


//Agregar una categoria a la base de datos (Create)
app.post("/agregar_categorias", (req, res) => {
    const { nombre } = req.body;
    sql = "INSERT INTO categorias SET ?";
    db.query(sql, { nombre }, (error, results) => {
        if (error) throw error;
        res.redirect("/index_categorias");
    });
});

//Mostrar formulario para editar una categoria (Pre_Update)
app.get("/editar_categorias/:id", (req, res) => {
    const id = req.params.id;
    sql = "SELECT * FROM categorias WHERE id = ?";
    db.query(sql, id, (error, results) => {
        if (error) throw error;
        res.render("editar_categorias", { categoria: results[0] });
    });
});

//Editar los datos de un categoria (Update)
app.post("/editar_categorias/:id", (req, res) => {
    const id = req.params.id;
    const { nombre } = req.body;
    sql = "UPDATE categorias SET nombre = ? WHERE id = ?";
    db.query(sql, [nombre, id], (error, results) => {
        if (error) throw error;
        res.redirect("/index_categorias");
    });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`)
});