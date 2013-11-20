$ ->
  console.log 'hi!'

initialize = ->
  mapOptions =
    center: new google.maps.LatLng(44.5452, -78.5389)
    zoom: 5

  @map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions)
  @bounds = new google.maps.LatLngBounds(new google.maps.LatLng(40.490, -78.649), new google.maps.LatLng(44.599, -70.443))
  
  # Define a rectangle and set its editable property to true.
  @rectangle = new google.maps.Rectangle(
    bounds: bounds
    editable: true
    draggable: true
    suppressUndo: true
    strokeColor: '#FF0000'
    fillColor: '#FF0000'
  )
  @rectangle.setMap map

  # Construct the circle
  circleOptions = {
    strokeColor: '#FF0000'
    fillColor: '#FF0000'
    map: map
    editable: true
    draggable: true
    suppressUndo: true
    center: new google.maps.LatLng(38.5452, -78.5389)
    radius: 250000
  }

  @demoCircle = new google.maps.Circle(circleOptions)

  # Construct the polygon.
  triangleCoords = [
    new google.maps.LatLng(25.774252, -80.190262), 
    new google.maps.LatLng(18.466465, -66.118292), 
    new google.maps.LatLng(32.321384, -64.75737), 
    new google.maps.LatLng(25.774252, -80.190262)
  ]

  @bermudaTriangle = new google.maps.Polygon(
    paths: triangleCoords
    strokeColor: "#FF0000"
    strokeOpacity: 0.8
    strokeWeight: 2
    fillColor: "#FF0000"
    fillOpacity: 0.35
    editable: true
    draggable: true
    suppressUndo: true
  )
  @bermudaTriangle.setMap map

  @bermudaTriangleShape = @bermudaTriangle.getPath()

  ## icon styles
  @delete_icon = {
    anchor: new google.maps.Point(-10, 11)
    size: new google.maps.Size(30, 27)
    origin: new google.maps.Point(0, 0)
    url: 'img/undo_poly.png'
  }

  @delete_hover_icon = {
    anchor: new google.maps.Point(-10, 11)
    size: new google.maps.Size(30, 27)
    origin: new google.maps.Point(30, 0)
    url: 'img/undo_poly.png'
  }

  @delete_active_icon = {
    anchor: new google.maps.Point(-10, 11)
    size: new google.maps.Size(30, 27)
    origin: new google.maps.Point(60, 0)
    url: 'img/undo_poly.png'
  }

  ## polygon control
  @polygon_control = new google.maps.Marker(
    position: new google.maps.LatLng(32.321384, -64.75737)
    icon: delete_icon
  )

  ## marker polygon
  google.maps.event.addListener polygon_control, 'mouseover', ->
    @setIcon delete_hover_icon

  google.maps.event.addListener polygon_control, 'mouseout', ->
    @setIcon delete_icon unless info_box_dropdown.getVisible()    

  google.maps.event.addListener polygon_control, 'mousedown', ->
    @setIcon delete_active_icon

  google.maps.event.addListener polygon_control, 'mouseup', ->
    @setIcon delete_icon

  google.maps.event.addListener polygon_control, 'click', ->
    if info_box_dropdown.getVisible()
      info_box_dropdown.close()
      @setIcon delete_icon
    else
      info_box_dropdown.open map, polygon_control
      @setIcon delete_active_icon
    # alert "clicked! action nedeed"

  ## event listeners for rectangle
  google.maps.event.addListener rectangle, 'mousedown', ->
    polygon_control.setMap map unless polygon_control.getMap()
    polygon_control.setPosition @getBounds().getNorthEast()

  google.maps.event.addListener rectangle, "bounds_changed", ->
    polygon_control.setMap map unless polygon_control.getMap()
    polygon_control.setPosition @getBounds().getNorthEast()

  google.maps.event.addListener rectangle, "mouseover", ->
    info_box_dropdown.close()
    polygon_control.setIcon delete_icon
    polygon_control.setMap map unless polygon_control.getMap()
    polygon_control.setPosition @getBounds().getNorthEast()

  ## event listeners for circle
  demo_circle_processor = ->
    center = demoCircle.getCenter()
    right  = demoCircle.getBounds().getNorthEast()

    polygon_control.setMap map unless polygon_control.getMap()
    polygon_control.setPosition new google.maps.LatLng(center.lat(), right.lng())

  google.maps.event.addListener demoCircle, 'mouseover', ->
    info_box_dropdown.close()
    polygon_control.setIcon delete_icon
    demo_circle_processor()

  google.maps.event.addListener demoCircle, "mouseup", ->
    demo_circle_processor()

  google.maps.event.addListener demoCircle, "drag", ->
    demo_circle_processor()

  google.maps.event.addListener demoCircle, "center_changed", ->
    demo_circle_processor()

  google.maps.event.addListener demoCircle, "radius_changed", ->
    demo_circle_processor()

  ## event listeners for polygon
  google.maps.event.addListener bermudaTriangle, 'mousedown', ->
    polygon_control.setMap map unless polygon_control.getMap()

  polygon_event_processor = (polygon)->
    poins_array = []
    # first of all - create points array
    bermudaTriangle.getPath().forEach (latLng) ->
      poins_array.push latLng
    # next sort points arrayaccording to longtitude of point to find the eastern point
    poins_array.sort (a, b) ->
      if a.lng() > b.lng()
        -1
      else if a.lng() < b.lng()
        1
      else
        0
    # position control to found point
    polygon_control.setPosition poins_array[0]

  google.maps.event.addListener bermudaTriangle, "mouseover", -> 
    info_box_dropdown.close()
    polygon_control.setIcon delete_icon
    polygon_event_processor()

  google.maps.event.addListener bermudaTriangle, "drag", -> 
    polygon_event_processor()

  google.maps.event.addListener bermudaTriangleShape, "set_at", ->
    polygon_event_processor()

  google.maps.event.addListener bermudaTriangleShape, "insert_at", ->
    polygon_event_processor()

  # map listeners
  google.maps.event.addListener map, "click", ->
    polygon_control.setMap undefined if polygon_control.getMap()
    polygon_control.setIcon delete_icon
    info_box_dropdown.close()

  ## infobox

  #demo puprose hack
  @menu_click = () ->
    polygon_control.setIcon delete_icon
    info_box_dropdown.close()

  boxText = document.createElement("div")
  boxText.style.cssText = "background: #fff"
  boxText.innerHTML = """
    <a href="javascript:menu_click()" class="polygon-control delete">
      <i class="icon-trash"></i>
      &nbsp;Delete trigger zone
    </a>
    <a href="javascript:menu_click()" class="polygon-control circle">
      <i class="icon-circle-blank"></i>
      &nbsp;Convert to circle
    </a>
    <a href="javascript:menu_click()" class="polygon-control smile">
      <i class="icon-star-empty"></i>
      &nbsp;Convert to polygon
    </a>
  """
  myOptions =
    content: boxText
    disableAutoPan: false
    # maxWidth: 250
    pixelOffset: new google.maps.Size(17, 10)
    zIndex: null
    boxStyle:
      pading: "5px"
      width: "150px"
    isHidden: false
    pane: "floatPane"
    closeBoxURL: ""
    enableEventPropagation: false

  @info_box_dropdown = new InfoBox(myOptions)


google.maps.event.addDomListener window, "load", initialize
