(function() {
  var initialize;

  $(function() {
    return console.log('hi!');
  });

  initialize = function() {
    var boxText, circleOptions, demo_circle_processor, mapOptions, myOptions, polygon_event_processor, triangleCoords;
    mapOptions = {
      center: new google.maps.LatLng(44.5452, -78.5389),
      zoom: 5
    };
    this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    this.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(40.490, -78.649), new google.maps.LatLng(44.599, -70.443));
    this.rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true,
      suppressUndo: true,
      strokeColor: '#FF0000',
      fillColor: '#FF0000'
    });
    this.rectangle.setMap(map);
    circleOptions = {
      strokeColor: '#FF0000',
      fillColor: '#FF0000',
      map: map,
      editable: true,
      draggable: true,
      suppressUndo: true,
      center: new google.maps.LatLng(38.5452, -78.5389),
      radius: 250000
    };
    this.demoCircle = new google.maps.Circle(circleOptions);
    triangleCoords = [new google.maps.LatLng(25.774252, -80.190262), new google.maps.LatLng(18.466465, -66.118292), new google.maps.LatLng(32.321384, -64.75737), new google.maps.LatLng(25.774252, -80.190262)];
    this.bermudaTriangle = new google.maps.Polygon({
      paths: triangleCoords,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      editable: true,
      draggable: true,
      suppressUndo: true
    });
    this.bermudaTriangle.setMap(map);
    this.bermudaTriangleShape = this.bermudaTriangle.getPath();
    this.delete_icon = {
      anchor: new google.maps.Point(-10, 11),
      size: new google.maps.Size(30, 27),
      origin: new google.maps.Point(0, 0),
      url: 'img/undo_poly.png'
    };
    this.delete_hover_icon = {
      anchor: new google.maps.Point(-10, 11),
      size: new google.maps.Size(30, 27),
      origin: new google.maps.Point(30, 0),
      url: 'img/undo_poly.png'
    };
    this.delete_active_icon = {
      anchor: new google.maps.Point(-10, 11),
      size: new google.maps.Size(30, 27),
      origin: new google.maps.Point(60, 0),
      url: 'img/undo_poly.png'
    };
    this.polygon_control = new google.maps.Marker({
      position: new google.maps.LatLng(32.321384, -64.75737),
      icon: delete_icon
    });
    google.maps.event.addListener(polygon_control, 'mouseover', function() {
      return this.setIcon(delete_hover_icon);
    });
    google.maps.event.addListener(polygon_control, 'mouseout', function() {
      if (!info_box_dropdown.getVisible()) {
        return this.setIcon(delete_icon);
      }
    });
    google.maps.event.addListener(polygon_control, 'mousedown', function() {
      return this.setIcon(delete_active_icon);
    });
    google.maps.event.addListener(polygon_control, 'mouseup', function() {
      return this.setIcon(delete_icon);
    });
    google.maps.event.addListener(polygon_control, 'click', function() {
      if (info_box_dropdown.getVisible()) {
        info_box_dropdown.close();
        return this.setIcon(delete_icon);
      } else {
        info_box_dropdown.open(map, polygon_control);
        return this.setIcon(delete_active_icon);
      }
    });
    google.maps.event.addListener(rectangle, 'mousedown', function() {
      if (!polygon_control.getMap()) {
        polygon_control.setMap(map);
      }
      return polygon_control.setPosition(this.getBounds().getNorthEast());
    });
    google.maps.event.addListener(rectangle, "bounds_changed", function() {
      if (!polygon_control.getMap()) {
        polygon_control.setMap(map);
      }
      return polygon_control.setPosition(this.getBounds().getNorthEast());
    });
    google.maps.event.addListener(rectangle, "mouseover", function() {
      info_box_dropdown.close();
      polygon_control.setIcon(delete_icon);
      if (!polygon_control.getMap()) {
        polygon_control.setMap(map);
      }
      return polygon_control.setPosition(this.getBounds().getNorthEast());
    });
    demo_circle_processor = function() {
      var center, right;
      center = demoCircle.getCenter();
      right = demoCircle.getBounds().getNorthEast();
      if (!polygon_control.getMap()) {
        polygon_control.setMap(map);
      }
      return polygon_control.setPosition(new google.maps.LatLng(center.lat(), right.lng()));
    };
    google.maps.event.addListener(demoCircle, 'mouseover', function() {
      info_box_dropdown.close();
      polygon_control.setIcon(delete_icon);
      return demo_circle_processor();
    });
    google.maps.event.addListener(demoCircle, "mouseup", function() {
      return demo_circle_processor();
    });
    google.maps.event.addListener(demoCircle, "drag", function() {
      return demo_circle_processor();
    });
    google.maps.event.addListener(demoCircle, "center_changed", function() {
      return demo_circle_processor();
    });
    google.maps.event.addListener(demoCircle, "radius_changed", function() {
      return demo_circle_processor();
    });
    google.maps.event.addListener(bermudaTriangle, 'mousedown', function() {
      if (!polygon_control.getMap()) {
        return polygon_control.setMap(map);
      }
    });
    polygon_event_processor = function(polygon) {
      var poins_array;
      poins_array = [];
      bermudaTriangle.getPath().forEach(function(latLng) {
        return poins_array.push(latLng);
      });
      poins_array.sort(function(a, b) {
        if (a.lng() > b.lng()) {
          return -1;
        } else if (a.lng() < b.lng()) {
          return 1;
        } else {
          return 0;
        }
      });
      return polygon_control.setPosition(poins_array[0]);
    };
    google.maps.event.addListener(bermudaTriangle, "mouseover", function() {
      info_box_dropdown.close();
      polygon_control.setIcon(delete_icon);
      return polygon_event_processor();
    });
    google.maps.event.addListener(bermudaTriangle, "drag", function() {
      return polygon_event_processor();
    });
    google.maps.event.addListener(bermudaTriangleShape, "set_at", function() {
      return polygon_event_processor();
    });
    google.maps.event.addListener(bermudaTriangleShape, "insert_at", function() {
      return polygon_event_processor();
    });
    google.maps.event.addListener(map, "click", function() {
      if (polygon_control.getMap()) {
        polygon_control.setMap(void 0);
      }
      polygon_control.setIcon(delete_icon);
      return info_box_dropdown.close();
    });
    this.menu_click = function() {
      polygon_control.setIcon(delete_icon);
      return info_box_dropdown.close();
    };
    boxText = document.createElement("div");
    boxText.style.cssText = "background: #fff";
    boxText.innerHTML = "<a href=\"javascript:menu_click()\" class=\"polygon-control delete\">\n  <i class=\"icon-trash\"></i>\n  &nbsp;Delete trigger zone\n</a>\n<a href=\"javascript:menu_click()\" class=\"polygon-control circle\">\n  <i class=\"icon-circle-blank\"></i>\n  &nbsp;Convert to circle\n</a>\n<a href=\"javascript:menu_click()\" class=\"polygon-control smile\">\n  <i class=\"icon-star-empty\"></i>\n  &nbsp;Convert to polygon\n</a>";
    myOptions = {
      content: boxText,
      disableAutoPan: false,
      pixelOffset: new google.maps.Size(17, 10),
      zIndex: null,
      boxStyle: {
        pading: "5px",
        width: "150px"
      },
      isHidden: false,
      pane: "floatPane",
      closeBoxURL: "",
      enableEventPropagation: false
    };
    return this.info_box_dropdown = new InfoBox(myOptions);
  };

  google.maps.event.addDomListener(window, "load", initialize);

}).call(this);
