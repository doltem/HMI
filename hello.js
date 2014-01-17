       $("nav > ul").kendoMenu({orientation: "vertical"});

        var carsViewModel = new kendo.observable(
            {
                name: "Audi",
                model: "A8",
                cost: 200000,
                pictureUrl: "http://d3403mtifmmdhn.cloudfront.net/new_experience_touts/images/49/original/1MYCO_A8_Photos_Tout_13TDI_A8b002x_r8_RGB.jpg?1342493775"        
            });

        var viewHome = new kendo.View("#home");
        var viewCars = new kendo.View("#myCars", {model: carsViewModel});
        var viewAboutMe = new kendo.View("#aboutMe");

        var layout = new kendo.Layout("<section id='content'></section>");

        layout.render($("#application"));

        $("#showHome").on("click", function (){layout.showIn("#content", viewHome);});
        $("#showCars").on("click", function (){layout.showIn("#content", viewCars);});
        $("#showAboutme").on("click", function (){layout.showIn("#content", viewAboutMe);});

        var router = new kendo.Router();
            router.route("/", function() {
                layout.showIn("#content", viewHome);
            });
            router.route("/mycars", function() {
                layout.showIn("#content", viewCars);
            });
            router.route("/aboutme", function() {
                layout.showIn("#content", viewAboutMe);
            });

        $(function() {
            router.start();
        });