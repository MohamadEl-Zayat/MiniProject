let Student = require('../models/Student');
let Pfolio = require('../models/Pfolio');
let Work = require('../models/Work');

let projectController = {

    getHomePage:function(req, res){
        /*
        Student.find(function(err, students){

            if(err)
                res.send(err.message);
            else
                res.render('homepage', {students});
        }) 
        var test = req.param('test')
        var name = req.param('name')
        var page = req.param('page')
        console.log(test)
        console.log(name)
        console.log(page)*/
        req.session.destroy();
        res.render('homepage')

    },

    studentfirstpage:function(req,res){
        Student.find(function(err,students){
            if(err)
                res.send(err.message);
            else
                res.render('student',{error:"",success:""});
        })
    },

   /* studentrecod:function(db, callback) {
   db.collection('students').insertOne( {
     username:{
        
     }
      function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  };
};*/
    studentregister:function(req, res){

        let student = new Student({
            username: req.body.username,
            password: req.body.password
        });

        student.save(function(err, student){
            if(err){
                if(err.code == 11001){
                     res.render('student',{error:"This username is already taken, press back and try something else.",success:""});
                 }
                 else {
                    res.render('student',{error:"Please enter username and password.",success:""});
                }
            }
            else{
                res.render('myportfolio',{success:"successfully registered"});
                }
        })

 },

    studentlogin:function(req,res){
        Student.findOne({username:req.body.user},function(err,student){
            if(!student){
                res.send("Wrong Username!!  Press back and try again");
            }
            else{
                if(req.body.pass===student.password){
                    req.session.student = student;
                    res.redirect('/viewmypfolio');
                }
                else{
                   res.render('student',{error:"Wrong Password!! Try again",success:""}) 
}
            }
        });
    },

    getMyPortfolio:function(req,res){
         Pfolio.find(function(err,pfolios){
            if(err)
                res.send(err.message);
            else
                res.render('myportfolio',{pfolios});
        })
    },

    createPortfolio:function(req,res){
         let pfolio = new Pfolio({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
        });
         pfolio.save(function(err, pfolio){
            if(err){
                    res.send('Something went wrong!! please try again.');
            }
            else {
                for(var key in req.body.work){
                    var value = req.body.work[key]
                    let work = new Work({
                        work: value,
                        portfolioid: pfolio._id
                    })

                    work.save(function(err,work){
                        if(err){
                                res.send('Something went wrong!! please try again.');
                        }

                    })
                }
                }
            
            
        

                
                var options = { multi: true };
                Student.findOne({ username: req.body.username }, function (err, student){
                    student.portfolioid = pfolio._id;
                    student.save();
                });
                res.render('student',{success:"Portfolio Successfully created!",error:""});
            })
    },

    showPortfolio:function(req,res){
        if(req.session && req.session.student){
            Student.findOne({username:req.session.student.username},function(err,student){
                if(!student){
                    req.session.reset();
                    res.redirect('/student');
                }
                else{
                    Pfolio.findOne({_id:req.session.student.portfolioid},function(err,pfolio){
                        if(pfolio){
                            req.session.pfolio = pfolio;
                            Work.find({portfolioid:req.session.student.portfolioid},function(err,work){
                                if(work){
                                req.session.work = work;
                                res.render('viewmypfolio',{pfolio:pfolio , work:work});
                                }
                            })
                        }
                       
                        else{}   
                        
                        
                    })
                }
            })
        }
        else{
            console.log('req.student does not exist')
            res.redirect('/student');
        }
    },
    addWork:function(req,res){
        for(var key in req.body.work){
            var value = req.body.work[key]
            if (value && value !== "") {
                let work = new Work({
                work: value,
                portfolioid: req.session.pfolio._id
            })
            work.save(function(err,work){
                if(err){
                        res.send('Something went wrong!! please try again.');
                }

             })
            }
            
        }
        res.redirect('viewmypfolio')
        /*
        Pfolio.findOne({_id:req.session.student.portfolioid},function(err,pfolio){
            if(pfolio){
                req.session.pfolio = pfolio;
                Work.find({portfolioid:req.session.student.portfolioid},function(err,work){
                    if(work){
                    req.session.work = work;
                    res.redirect('viewmypfolio',{pfolio:pfolio , work:work});
                    }
                })
            }
           
            else{

            }   
            
            
        }) */
},
   clientPage:function(req,res){
    var page = req.param('page')
    /*
    Pfolio.find({},function(err,pfolio){
        if(page==null || page == ""){
            page = 1;
        }
        else if (pfolio.length > (page-1*10) || pfolio.length<=(page*10-1)){
            for(i=0 ; i<10; i++){

            }
        }
    }) */
    Pfolio.find().skip(((page||1)-1)*10).limit(10).exec(function(err, pfolios) {
        if (err) {
            res.send('No avalaible Portfolios')
        }
        else {
            if (pfolios && pfolios.length > 0) {
                var ids = []
                for (var i = 0; i < pfolios.length; i++) {
                    ids.push(pfolios[i]._id)
                }
                Work.find({portfolioid: {$in: ids}}, function(err, works) {
                    for (var i = 0; i < pfolios.length; i++) {
                        pfolios[i].works = []
                        for (var j = 0; j < works.length; j++ ) {
                            if (pfolios[i]._id == works[j].portfolioid) {
                                pfolios[i].works.push(works[j])
                            }
                        }
                    }
                    res.render('client', {pfolios: pfolios,error:""})
                })
                //res.render('client', {pfolios: pfolios})
            }
            else {
                if (page == 1) {
                    res.render('client',{pfolios: pfolios,error:"No portfolios available"})
                }
                else {
                    console.log("Redirecting")
                    res.redirect('client?page=1')
                }
            }
        }
    })
   },
   viewDetailed:function(req,res){
     Pfolio.findOne({_id:req.body.view},function(err,pfolio){
                        if(pfolio){
                            req.session.pfolio = pfolio;
                            Work.find({portfolioid:req.body.view},function(err,work){
                                if(work){
                                req.session.work = work;
                                res.render('DetailedView',{pfolio:pfolio , work:work});
                                }
                            })
                        }
                       
                        else{}   
                        
                        
                    })

   }


}


module.exports = projectController;
