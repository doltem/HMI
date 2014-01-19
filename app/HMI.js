//==================================VARIABLES====================================

//==================================MODELS===================================
//Model for Area Dropdown List
var areaModel = kendo.observable({
    area: "Tes",
    areaSource: new kendo.data.DataSource({
      transport: {
        read: {
          url: "http://localhost:80/service/area",
          dataType: "json",
          type: "GET"
        },
        create: {
          url: "http://localhost:80/service/area",
          dataType: "json",
          type: "POST"
        },
        update:{
          url: "http://localhost:80/service/area",
          dataType: "json",
          type: "PUT"          
        }
      },

      requestStart: function (e){
        console.log("areaSource request START");
      },

      requestEnd: function (e){
        console.log("areaSource request END");
      }

    }),

    deviceSource: new kendo.data.DataSource({
      transport: {
        read: {
          url: "http://localhost:80/service/location",
          dataType: "json",
          type: "GET"
        },
        update:{
          url: "http://localhost:80/service/location",
          dataType: "json",
          type: "PUT"          
        }
      },

      requestStart: function (e){
        console.log("deviceSource request START");
      },

      requestEnd: function (e){
        console.log("deviceSource request END");
      }

    }),


    init: function(data){
      this.deviceSource.filter({ field: "area", operator: "eq", value: data });
      this.set("area",data);
    },

    onSelect: function(e){
      var index = e.item.index();
      var data = this.areaSource.view()[index];
      this.deviceSource.filter({ field: "area", operator: "eq", value: data.area });
      console.log("masuk di onSelect")
      $("#modalview-area").data("kendoMobileModalView").close();
    },

});


//Model for Zone Dropdown List
var zoneModel = kendo.observable({
    zone:"",
    occ: 1,
    lux:800,
    lamp:true,
    mode:false,
    setpoint: 900,
    errorband:50,

    zoneSource: new kendo.data.DataSource({
      transport: {
        read: {
          url: "http://localhost:80/service/zone",
          dataType: "JSON",
          type: "GET"
        },
        update:{
          url: "http://localhost:80/service/zone",
          dataType: "JSON",
          type: "PUT"          
        }
      },

      requestStart: function (e){
        console.log("zoneSource request START");
      },

      requestEnd: function (e){
        setTimeout(function(){
        
          var data = zoneModel.zoneSource.at(0);
          zoneModel.setStatusFilter(data);
          console.log(data);
          console.log("zoneSource request END");
        }, 2000);
      },


      filter: { field: "address", operator: "eq", value: "" }

    }),

    commandSource: new kendo.data.DataSource({
      transport: {
        create:{
          url: "http://localhost:80/service/zone",
          dataType: "JSON",
          type: "POST"          
        }
      },

      requestStart: function (e){
        console.log("commandSource request START");
      },

      requestEnd: function (e){
        console.log("commandSource request END");
      },

      filter: { field: "id", operator: "eq", value: "1" }

    }),


    setZoneFilter: function(data){
      this.zoneSource.filter({ field: "address", operator: "eq", value: data });
    },

    setStatusFilter: function(data){
      this.set("occ",data.zone);
      this.set("occ",data.occ);
      this.set("lux",data.lux);
      this.set("lamp",(data.lamp==0)?false:true);
      this.set("mode",(data.mode==0)?false:true);
      this.set("setpoint",data.setpoint);
      this.set("errorband",data.errorband);
      console.log("data [ occ, lux, lamp, mode, setpoint,errorband] : ["+this.occ+", "+this.lux+", "+this.lamp+", "+this.mode+", "+this.setpoint+", "+this.errorband+"]");
    },

    onSelect: function(e){
      var index = e.item.index();
      var data = this.zoneSource.view()[index];
      this.setStatusFilter(data);
      $("#modalview-zone").data("kendoMobileModalView").close();
    },

    onChange: function(){
      var data = this.zoneSource.view()[0];
      var command={
        zone: data.zone,
        address:data.address, 
        lamp : (this.lamp==true)?1:0, 
        mode : (this.mode==true)?1:0, 
        setpoint : this.setpoint,
        errorband : this.errorband
      };
      this.commandSource.add(command);
      console.log(this.commandSource.at(0));
      this.commandSource.sync();
      this.commandSource.remove(this.commandSource.at(0));
    },

    onEdit: function(data){
      var index = e.sender.select().index();
      
      this.trigger("zone:edit", { 
        name : this.zoneSource.view()[index],
        type : "zone"
      });
    }
  });

//=================================MODEL-BINDER===========================


//==================================CONTROLLER==============================
  //controller for areaModel
  function setFilter(e){
    zoneModel.setZoneFilter(e.view.params.address);
    //zoneModel.zoneSource.fetch(function(){
    zoneModel.zoneSource.read();
      var data = zoneModel.zoneSource.view();
      zoneModel.setStatusFilter(data[0]);
    //})
  }

  function viewInit(){
    areaModel.areaSource.read()
      setTimeout(function(){
        var data = areaModel.areaSource.at(0);
        console.log(data);
        areaModel.init(data.area);
      }, 200);
  }

  function closeModalArea(){
    $("#modalview-area").kendoMobileModalView("close")
  }

  function closeModalZone(){
    $("#modalview-zone").kendoMobileModalView("close")
  }

  //controller for zoneModel
  function ZoneChange(zone){
    statusModel.setFilter(zone);
    layout.showIn("#content", statusView);
  }


(function pollZone(){
   setTimeout(function(){
      zoneModel.zoneSource.read();

      pollZone();
  }, 1000);
})();

(function pollArea(){
   setTimeout(function(){
      areaModel.deviceSource.read()
      pollArea();
  }, 1000);
})();

//==================================VIEWS====================================

//==================================CONTROLLERS====================================

//==================================ROUTER================================
var appRouter = new kendo.Router({
  init: function(){
    layout.render($("#application"));
    console.log("route initiated");
  }
});

appRouter.route("/home",function(){
  layout.showIn("#dropdown", areaView);
  layout.showIn("#content", deviceView);
  console.log("navigated to /home");
});

appRouter.route("/status",function(){

});

//==================================ONLOAD FUNCTIONS====================================
/*$(function () {
    appRouter.start();
    appRouter.navigate("/home");
    console.log("apps loaded");
});*/
