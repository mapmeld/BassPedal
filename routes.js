module.exports = function(app, models, mongoose){

  /**
   *  Index
   */
  app.get('/', function(req, res){
    res.render('kickpedal.jade');
  });
  
  
  /**
   *  Listing
   */
  app.get('/list', function(req, res){

    //get all the examples
    models.examples.find({}, function(err, docs){
      
      //render the index page
      res.render('list.jade', {
          locals: {
            title: 'Node.js Express MVR Template',
            page: 'list',
            examples: docs
          }
      });

    });
  });


  /**
   *  View
   */
  app.get('/view/:id', function(req, res){

    //get the example
    models.examples.findById(req.params.id, function(err, doc){
      
      //render the view page
      res.render('view.jade', {
          locals: {
            title: 'Node.js Express MVR Template',
            page: 'view',
            example: doc
          }
      });

    });
  });

  /**
   *  Add View
   */
  app.get('/add', function(req, res){
      
      //render the add page
      res.render('add.jade', {
          locals: {
            title: 'Node.js Express MVR Template',
            page: 'add'
          }
      });
  });
  
  /**
   *  Add test doc
   */
   
  app.post('/posts', function(req, res){
     var now = new Date();
     var Post = models.examples;
     var post = new Post();
     post.name = req.param('doc');
     post.date = now;
     post.save(function(err) {
         console.log('error check');
         if(err) { throw err; }
         console.log('saved');
     });
     res.redirect('/list');
  });
  
};