//==================================VARIABLES====================================

//==================================MODELS===================================
//Model for Area Dropdown List
var areaModel = kendo.observable({
    dataSource: new kendo.data.DataSource({
      schema: { model: {} },
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
      }

    }),

    onSelect: function(e){
      var index = e.item.index();
      console.log(index);
      var data = this.dataSource.view()[index];
      this.trigger("area:selected", data.area);
    },

    onEdit: function(data){
      var index = e.sender.select().index();
      
      this.trigger("area:edit", { 
        name : this.dataSource.view()[index],
        type : "area"
      });
    }
});

//Model for Device List
var deviceModel = kendo.observable({

    dataSource: new kendo.data.DataSource({
      schema: { model: {} },
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

      filter: { field: "area", operator: "eq", value: "Bangunan" }

    }),

    onClick: function(e){
      var index = e.sender.select().index();
      var data = this.dataSource.view()[index];
      this.trigger("device:clicked", data);
    },

    setFilter: function(e){
      this.dataSource.filter({ field: "area", operator: "eq", value: e });
    },

    onEdit: function(data){
      var index = e.sender.select().index();
      
      this.trigger("device:edit", { 
        name : this.dataSource.view()[index],
        type : "device"
      });
    }
});


//Model for Zone Dropdown List
var zoneModel = kendo.observable({

    dataSource: new kendo.data.DataSource({
      schema: { model: {} },
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

      filter: { field: "address", operator: "eq", value: "" }

    }),

    setFilter: function(e){
      this.dataSource.filter({ field: "address", operator: "eq", value: e });
    },

    getFirstData: function(){

    },

    onSelect: function(e){
      var index = e.item.index();
      var data = this.dataSource.view()[index];
      console.log(index);
      console.log(data);
      this.trigger("zone:selected", data.id);
    },

    onEdit: function(data){
      var index = e.sender.select().index();
      
      this.trigger("zone:edit", { 
        name : this.dataSource.view()[index],
        type : "zone"
      });
    }
  });


//Model for Status List
var statusModel = kendo.observable({

    dataSource: new kendo.data.DataSource({
      /*schema: {
        model: { id: "id"}
      }, ??????*/
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

      filter: { field: "id", operator: "eq", value: "" }

    }),

    setFilter: function(e){
      this.dataSource.filter({ field: "id", operator: "eq", value: e });
    },

    onClick: function(e){
      var index = e.sender.select().index();
      var data = this.dataSource.view()[index];
      
      this.trigger("status:save", {
        zone : data.zone,
        address : data.address,
        mode : data.mode,
        setpoint : data.setpoint,
        errorband : data.erroband,
        lamp : data.lamp
      });
    }
});

//=================================MODEL-BINDER===========================

areaModel.bind("area:selected", AreaChange);
//areaModel.bind("area:edit", EditName);

deviceModel.bind("device:clicked", deviceSelect);
//deviceModel.bind("device:edit", EditName);

zoneModel.bind("zone:selected", ZoneChange);
//zoneModel.bind("zone:edit", EditName);

statusModel.bind("status:save", SendCommand);

//==================================CONTROLLER==============================
  //controller for areaModel
  function AreaChange(data){
      deviceModel.setFilter(data);;
      layout.showIn("#content", deviceView);
  }

  //controller for deviceModel
  function deviceSelect(data){
    zoneModel.setFilter(data.address);
    layout.showIn("#dropdown", zoneView);
    zoneModel.dataSource.fetch(function(){
        var data = zoneModel.dataSource.view();
        statusModel.setFilter(data[0].id);
    });
    appRouter.navigate("/status");
    layout.showIn("#content", statusView);
  }

  //controller for zoneModel
  function ZoneChange(zone){
    statusModel.setFilter(zone.id);
    layout.showIn("#content", statusView);
  }

  //controller for statusModel
  function SendCommand(){

  }

//==================================VIEWS====================================
var layout = new kendo.Layout("#layout-template");

var areaView = new kendo.View("#area-template", {
		model: areaModel
});

var deviceView = new kendo.View("#device-template", {
		model: deviceModel
});

var zoneView= new kendo.View("#zone-template", {
    model: zoneModel
});

var statusView = new kendo.View("status-template", {
    model: statusModel
});

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
$(function () {
    appRouter.start();
    appRouter.navigate("/home");
    console.log("apps loaded");
});