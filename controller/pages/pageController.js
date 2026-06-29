const dashboardControllerRender = (req,res)=>{

    console.log("Dashboard Loaded Successfully!");
    res.render('index')
}

const userdetailsController = (req,res)=>{

    console.log("User Details Page Loaded Successfuly !");
    res.render('user-details')
}

module.exports = {
    dashboardControllerRender , userdetailsController
}