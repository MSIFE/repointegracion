var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');

/* GET home page. */
router.get('/', async function (req, res, next) {

  const novedades = await novedadesModel.getNovedades(); // 4 registros

  res.render('admin/novedades', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    novedades
  });
});

router.get('/agregar', (req,res, next) => {
  res.render('admin/agregar',{ 
    layout: 'admin/layout'
  })//Cierra render
})// Cierra Get


router.post('/agregar', async( req, res, next ) =>{
  try{
    if (req.body.titulo != '' && req.body.subtitulo != '' && req.body.cuerpo != '' ){
      await novedadesModel.insertNovedades(req.body);
      res.redirect('/admin/novedades')
    }else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true, message: 'Todo los campos son requeridos'
      })
    }
  }catch (error){
    console.log(error)
    res.render('admin/agregar',{
      layout: 'admnin/layout',
      error: true, message:' No se cargo la novedad'
    });
  }
});

/* Para eliminar novedades */
router.get('/eliminar/:id',async (req,res, next) => {
  var id = req.params.id;
  await novedadesModel.deleteNovedadById(id);
  res.redirect('/admin/novedades');
})

/* Para mostrar el formulario listar una sola novedad x ID */

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var novedades = await novedadesModel.getNovedadById(id);

  res.render('admin/modificar',{
    layout: 'admin/layout',
    novedades
  })
})
/* Para modificar la novedad */
router.post('/modificar', async(req, res, next) => {
  
try{ 
  var obj = {
    titulo: req.body.titulo,
    subtitulo: req.body.subtitulo,
    cuerpo: req.body.cuerpo
  }

  await novedadesModel.modifivarNovedadesById(obj, req.body.id);
  res.redirect('/admin/novedades');
} catch (error) {
  res.render('admin/modificar', {
    layout: 'admin/layout',
    error:true,
    message: ' No se modifico la novedad'
  })
}

})


module.exports = router;