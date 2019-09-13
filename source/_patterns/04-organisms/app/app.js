define([
  "js/config/config",
  "js/config/planningDefinitions",
  "js/config/zoningDescriptions",
  "js/config/ripZoningDescriptions",
  "js/config/centralCityDefinitions",
  "js/config/tspClassificationDescriptions",
  "js/widgets/ui/ui",
  "js/widgets/mcs/mcs",
  "js/widgets/commentController/commentControllerNew",
  "js/widgets/popups/ripPopup",
  "js/widgets/popups/mdzPopup",
  "js/widgets/popups/dozaPopup",
  "dijit/registry",
  "dojo/_base/lang",
  "dojo/_base/declare",
  "dojo/Stateful",
  "dojo/debounce",
  "dojo/query",
  "dojo/on",
  "dojo/hash",
  "dojo/topic",
  "dojo/io-query",
  "dojo/dom",
  "dojo/dom-class",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/dom-attr",
  "dojo/store/Memory",
  "dojo/promise/all",
  "dojo/Deferred",
  "dojo/request/xhr",
  "dojox/mobile/compat",
  "dojox/mobile/ContentPane",
  "dojox/mobile/Switch",
  "dojox/mobile/EdgeToEdgeList",
  "dojox/mobile/ListItem",
  "esri/map",
  "esri/dijit/PopupMobile",
  "esri/SpatialReference",
  "esri/Color",
  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/CartographicLineSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/Font",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/UniqueValueRenderer",
  "esri/dijit/Geocoder",
  "esri/dijit/Legend",
  "esri/geometry/Polygon",
  "esri/geometry/Point",
  "esri/geometry/Circle",
  "esri/layers/LayerDrawingOptions",
  "esri/layers/GraphicsLayer",
  "esri/layers/WebTiledLayer",
  'esri/layers/VectorTileLayer',
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/LabelClass",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "esri/tasks/GeometryService",
  "dojo-bootstrap/Button",
  "dojo-bootstrap/Collapse",
  "dojo-bootstrap/Dropdown",
  "dojo-bootstrap/Tab",
  "dojo/domReady!"
],
function (config, planningDefinitions, zoningDescriptions, ripZoningDescriptions, centralCityDefinitions, tspClassificationDescriptions, ui, mcs, commentController2, residentialInfillPopup,betterHousingPopup, dozaPopupWidget,registry, lang, declare, Stateful, debounce, query, on, hash, topic, ioQuery, dom, domClass, domConstruct, domStyle, domAttr, Memory, all, Deferred, xhr, compat, ContentPane, Switch, E2EList, ListItem, Map, PopupMobile, SpatialReference, Color, Graphic, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, CartographicLineSymbol, TextSymbol, Font, SimpleRenderer, UniqueValueRenderer, Geocoder, Legend, Polygon, Point, Circle, layerDrawingOptions, GraphicsLayer, WebTiledLayer, VectorTileLayer, dynamicLayer, FeatureLayer, LabelClass, QueryTask, esriQuery, GeometryService) {
  esri.config.defaults.io.corsEnabledServers.push('www.portlandmaps.com');
  //logic to reload page when testimony period closes. set target to next testimony close date
  var target = new Date('August 22, 2018 14:00:00');
  var offset = target.getTimezoneOffset() * 60000; // to milliseconds
  var targetUTC = target.getTime()+offset;
  var today = new Date();
  var todayUTC = today.getTime() + offset;
  var refreshInterval = (targetUTC - todayUTC)
  // console.log(target, offset,targetUTC,today,todayUTC,refreshInterval)
  if (refreshInterval > 1){setTimeout(function(){window.location.reload(true);},refreshInterval);}
//
  var h = window.location.hash;
  if (h.indexOf('?')>-1){
    var x = h.split('?');
    window.location.hash = x[0];
    location.reload();
  }
  window.zoneReferences = null;
  topic.subscribe('/zone/references',function(obj){
    // console.log(obj)
    window.zoneReferences = obj.zones;
  })
  window.zonesAndComp = null;
  topic.subscribe('/zonesandcomp/',function(obj){
    window.zonesAndComp = obj.zones;
  })
  function instantiateDependencies() {
    query(".disabled-nav-link").forEach(function(node){
      on(node, 'click', function(event){
        event.preventDefault();
      });
    });
    Array.max = function(array){return Math.max.apply(Math,array);};
    window.widgetUI = new ui({}).placeAt(document.body);
    widgetUI.startup();
    on(widgetUI.closePopup,'click',function(){
      query('a[href="#mapInfo"]').tab('show');
    })
    window.configOptions = config;
    window.planningDefinitions = planningDefinitions;
    window.zoningDescriptions = zoningDescriptions;
    window.ripZoningDescriptions = ripZoningDescriptions;
    window.centralCityDefinitions = centralCityDefinitions;
    window.tspClassificationDescriptions = tspClassificationDescriptions;
    domAttr.set('myDropdown','innerHTML',"");
    domAttr.set('myDropdown','innerHTML',configOptions.mapDropdownString);
    var configObj = declare([Stateful],{
      uiConfig:null,
      mapTheme:"",
      zoningFeatures:[],
      mapXY:[],
      stateID:null,
      ccBoundary:null,
      cityBoundary:null,
      proposals:null,
      _uiConfigGetter:function(){
        return this.uiConfig;
      },
      _uiConfigSetter:function(value){
        this.uiConfig = value;
      },
      _mapThemeGetter:function(){
        return this.mapTheme;
      },
      _mapThemeSetter:function(value){
        this.mapTheme = value;
      },
      _zoningFeaturesSetter:function(features){
        this.zoningFeatures = features;
      },
      _zoningFeaturesGetter:function(){
        return this.zoningFeatures;
      },
      _mapXYSetter:function(xyArray){
        this.mapXY = xyArray;
      },
      _mapXYGetter:function(){
        return this.mapXY;
      },
      _stateIDSetter:function(val){
        this.stateID = val;
      },
      _stateIDGetter:function(){
        return this.stateID;
      },
      _ccBoundarySetter:function(val){
        this.ccBoundary = val;
      },
      _ccBoundaryGetter:function(val){
        return this.ccBoundary;
      },
      _cityBoundarySetter:function(val){
        this.cityBoundary = val;
      },
      _cityBoundaryGetter:function(val){
        return this.cityBoundary;
      }
    });
    window.uiController = new configObj({
      uiConfig:null
    });
    xhr('../testify/testify.cfm',{
      method:'POST',
      data:{
        action:'getProposals',
        api_key:'30484247C7E23B267F4A4C24D9664097'
      }
    }).then(function(results){
      var r = JSON.parse(results);
      // console.log(r);
      if (r.status === 'success'){
        uiController.set('proposals',r.proposals)
      }
    },function(error){
      console.log(error);
      // alert(error);
    });
    getUSBBoundary();
    uiController.watch('uiConfig',function(name, oldValue, value){configUI(name, oldValue, value);});
    var ccProposalObject = declare([],{
      subdistricts:[],
      heightProposals:[],
      farProposals:[],
      viewCorridors:[],
      landUseProposals:[],
      _clear:function(){
        this.subdistricts = [];
        this.heightProposals = [];
        this.farProposals = [];
        this.viewCorridors = [];
        this.landUseProposals = [];
      }
    });
    window.ccResultObject = new ccProposalObject({});
    lang.extend(Switch, {
      layerArray:[],
      query:"",
      disabled: false,
      events: {},
      disableSwitch: function() {
        //remove events (but hold on to them for later).. there may be a better dojo way of doing this
        this.events._onClick = this._onClick;
        this.events.onClick = this.onClick;
        this.events.onTouchStart = this.onTouchStart;
        this.events.onTouchMove = this.onTouchMove;
        this._onClick = function(){};
        this.onClick = function(){};
        this.onTouchStart = function(){};
        this.onTouchMove = function(){};

        //TODO: better styling to make it look disabled?
        // this.domNode.style.opacity = '0.5';
        // this.domNode.style['-webkit-filter'] = 'grayscale(1)';
        this.domNode.style['opacity'] = '0.5';
        domClass.add(this.domNode, "disabled");

        this.disabled = true;
      },
      enableSwitch: function() {
        //reattach events
        this._onClick = this.events._onClick;
        this.onClick = this.events.onClick;
        this.onTouchStart = this.events.onTouchStart;
        this.onTouchMove = this.events.onTouchMove;

        // this.domNode.style.opacity = '1';
        // this.domNode.style['-webkit-filter'] = 'grayscale(0)';
        this.domNode.style['opacity'] = '1';
        domClass.remove(this.domNode, "disabled");

        this.disabled = false;
      }
    });
    lang.extend(Map,{
      center:{},
      selectedParcel:{},
      setSelectedParcel:function(obj){
        this.selectedParcel = obj;
      },
      getSelectedParcel:function(){
        return this.selectedParcel;
      }
    });
    on(window, 'resize',debounce(function(event){
      if (map.getSelectedParcel().geometry === null || map.getSelectedParcel().geometry === undefined) {
        map.centerAt(map.center);
      } else {
        var centerTo = new Point({'x':map.getSelectedParcel().geometry.getCentroid().x,'y':map.getSelectedParcel().geometry.getCentroid().y,'spatialReference':{'wkid':102100}});
        map.centerAt(centerTo);
      }
      uiController.set('uiConfig', (domStyle.get(document.body, 'width')<= 769) ? 'mbl' : 'dsk');
    },500));
    topic.subscribe("/dojo/hashchange", function(changedHash){
      if (uiController.get('uiConfig') === 'mbl'){
        query('#collapseNav').collapse('toggle');
      }
      mapConfig();
    });
    query(".disabled-nav-link").forEach(function(node){
      on(node, 'click', function(event){
        event.preventDefault();
      });
    });
    var mapDescriptionData = [
      {id:'rip',description:configOptions.maps[15].mapDescription},
      {id:'mdz',description:configOptions.maps[17].mapDescription},
      {id:'doza',description:configOptions.maps[21].mapDescription}
    ];
    window.mapDescriptionStore = new Memory({data:mapDescriptionData});
    on(dom.byId('mblPanelClose'), "click", function(){
      // console.log('mblPanelClose click')
      toggleMobilePanel(false);
      switch(window.uriQueryObject.mapTheme) {
        case 'rip':
          ripPopup.clearProposals();
          break;
        default:
          break;
      }
    });
    //ADDED 11/2/15 TO ACCOMMODATE ADDRESS ON MAP CLICK FOR LANDUSE AND ZONING
    window.mapPopup = new PopupMobile(null, dojo.create('div'));
    // var popupTemplate1 = new InfoTemplate();
    var defaultFillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color ([255, 255, 0, 1]), 3));
    var defaultLineSymbol = new SimpleLineSymbol(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color ([255, 255, 0, .5]), 3));
    var defaultPointSymbol = new SimpleMarkerSymbol({
      "color": [230,101,230,125],
      "size": 18,
      "angle": 0,
      "xoffset": 0,
      "yoffset": 0,
      "type": "esriSMS",
      "style": "esriSMSSquare",
      "outline": {
        "color": [230,101,0,255],
        "width": 1,
        "type": "esriSLS",
        "style": "esriSLSSolid"
      }
    });
    var sr = new SpatialReference(102100);
    window.map = new Map('mapDiv',{
      id:'map',
      center:[-122.653, 45.538],
      zoom:12,
      scrollWheelZoom:true,
      spatialReference:sr,
      infoWindow:mapPopup,
      showLabels:true,
      sliderPosition:'bottom-left'
    });
    mapPopup.resize(262,32);

    // recenter on mobile click
    on(map, 'resize',debounce(function(event){
      if (map.getSelectedParcel().geometry === null || map.getSelectedParcel().geometry === undefined) {
        map.centerAt(map.center);
      } else {
        var centerTo = new Point({'x':map.getSelectedParcel().geometry.getCentroid().x,'y':map.getSelectedParcel().geometry.getCentroid().y,'spatialReference':{'wkid':102100}});
        map.centerAt(centerTo);
      }
    },500));
    //ADDED 11/2/15 TO ACCOMMODATE ADDRESS ON MAP CLICK FOR LANDUSE AND ZONING
    /* remove hard coded img references in the MobilePopup */
    on(mapPopup, "show", function (event){
      if (query(".esriMobileNavigationItem.left > img[src]")) {
        query(".esriMobileNavigationItem.left > img").removeAttr("src");
      }
      if (query(".esriMobileNavigationItem.right > img[src]")) {
        query(".esriMobileNavigationItem.right > img").removeAttr("src");
      }
    });

    /* remove hard coded img references in the MobilePopup */
    on(mapPopup, "selection-change", function (event){
      if (query(".esriMobileNavigationItem.right1 > img[src]")) {
        query(".esriMobileNavigationItem.right1 > img").removeAttr("src");
      }
      if (query(".esriMobileNavigationItem.right2 > img[src]")) {
        query(".esriMobileNavigationItem.right2 > img").removeAttr("src");
      }
    });
    on(mapPopup.domNode, 'click', function(){mapPopup.hide();});

    map.on('load', function(){
      map.center = map.extent.getCenter();
      domConstruct.destroy('loader');
    });
    map.on('click', function(e){
      map.getLayer('taxlotHighlightLayer').clear();
      mapPopup.hide();
      preprocessPopup(e, null);
      widgetUI._closeBustedAddressAlert();
    });
    map.on('zoom-end',function(){
      map.center = map.extent.getCenter();
    });
    map.on('pan-end',function(){
      map.center = map.extent.getCenter();
    });
    //create layer modal
    var layerModal = '<div id="layerModal" class="modal fade" role="dialog" data-backdrop="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Map Controls</h4></div><div id="layer-modal-container" class="modal-body"><div id="modalWidgets"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>';
    domConstruct.place(layerModal, document.body);
    query('#layerModal').on('click',function(evt){
      hideModals(evt);
    });
    var mblSearchModal = '<div id="mblSearchModal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Address Search</h4></div><div class="modal-body"><div id="mblSearchWidgets"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>';
    domConstruct.place(mblSearchModal, document.body);
    query('#mblSearchModal').on('click',function(evt){
      hideModals(evt);
    });
    var mblInfoModal = '<div id="mblInfoModal" class="modal fade" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">About this Map</h4></div><div class="modal-body"><div id="mblInfoWidgets"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>';
    domConstruct.place(mblInfoModal, document.body);
    query('#mblInfoModal').on('click',function(evt){
      hideModals(evt);
    });
    //create button for legend/layer controls
    var btnWrapper = domConstruct.create('div',{id:'btnWrapper'},'mapDiv_root');
    var btn = '<button type="button" class="btn btn-default btn-sm modalBtn" data-toggle="modal" data-target="#layerModal" title="Legend and Layer Controls"><span class="icon-list"></span></button>';
    var toggle = new ContentPane({
      id:'modalToggle',
      content:btn
    }, 'btnWrapper');
    var mapControls = new mcs({id:'mapControls'},"modalWidgets");
    //buttons to control search & info modals on mobile
    var mblSearchBtnWrapper = domConstruct.create('div',{id:'mblSearchBtnWrapper'},'mapDiv_root');
    var mblInfoBtnWrapper = domConstruct.create('div',{id:'mblInfoBtnWrapper'},'mapDiv_root');
    var mblSearchBtn = '<button type="button" class="btn btn-default btn-sm modalBtn" data-toggle="modal" data-target="#mblSearchModal"><span class="icon-search"></span></button>';
    var mblInfoBtn = '<button type="button" class="btn btn-default btn-sm modalBtn" data-toggle="modal" data-target="#mblInfoModal"><span class="icon-info"></span></button>';
    var mblSearchToggle = new ContentPane({
      id:'modalSearchToggle',
      content:mblSearchBtn
    }, 'mblSearchBtnWrapper');
    var mblInfoToggle = new ContentPane({
      id:'modalInfoToggle',
      content:mblInfoBtn
    }, 'mblInfoBtnWrapper');

    var geocoderDiv = domConstruct.create('div',{id:'geocoderDiv'},'mapDiv_root');

    //set up geocoder
    var cgisSuggest = [{
      url: '../../api/suggest.cfm',
      name:'CGIS',
      singleLineFieldName:'query',
      placeholder:'Address Search',
      centerline:1
    }];
    window.geocoder = new Geocoder({
      // id:'geocoder',
      map:map,
      autoComplete:true,
      autoNavigate:false,
      showResults:true,
      arcgisGeocoder:false,
      highlightLocation:false,
      geocoders:cgisSuggest
    },'geocoderDiv');
    geocoder.startup();
    topic.subscribe('/bustedAddress/close',function(){
      geocoder.clear();
    });
    //add params to suggest request
    esri.setRequestPreCallback(function(ioArgs){
      // if (ioArgs.url === window.location.origin + '/api/suggest.cfm/findAddressCandidates'){
        ioArgs.content['api_key'] = '30484247C7E23B267F4A4C24D9664097';
        ioArgs.content['id_matches'] = 1;
        ioArgs.content['alt_ids'] = 1;
        ioArgs.content['units'] = 1;
        ioArgs.content['centerline'] = 0;
      // }
      return ioArgs;
    });
    var node = dom.byId('geocoderDiv_input');
    on(node,'keydown',function(evt){
      // console.log(evt)
      if(evt.keyCode === 13){
        geocoder.find().then(function(response){
          // console.log('input keydown, ', response);
          if (response.results.hasOwnProperty('length')){
            // console.log('has length')
            if (response.results.length === 0){
              // console.log('length is 0')
              domAttr.set(widgetUI.bustedAddress,'innerHTML',response.value);
              showBustedAddressAlert();
            }
          }
        },function(error){
          console.error(error);
        })
      }
    });
    geocoder.on('keydown',function(evt){
      // console.log(evt)
      if (evt.keyCode === 13){
        geocoder.find().then(function(response){
          // console.log('response', response);
        },function(error){
          console.error(error);
        });
      }
    });
    geocoder.on('select', function(result){
      // console.log('geocoder select..... ')
      // console.log(result.result.feature.geometry);
      if (uiController.get('uiConfig')==='mbl'){
        // query('#mblSearchModal').hide();
      }
      window.result = result;
      var o = {
        mapPoint:{
          x:result.result.feature.geometry.x,
          y:result.result.feature.geometry.y
        }
      };
      switch(uriQueryObject.mapTheme) {
        case 'rip':
        case 'mdz':
          usbTest(null,result.result.feature.geometry);
          break;
        default:
          break;
      }
      if (result.result.feature){
        map.centerAndZoom(result.result.feature.geometry, 18);
      }
    });
    geocoder.on('clear', function(){map.getLayer('taxlotHighlightLayer').clear();});
    // window.cController = new commentController({id:'cController'});
    window.ccDSK = new commentController2({id:'ccDSK'}) // ccDSK = commentControllerDesktop
    window.ccMBL = new commentController2({id:'ccMBL'})// ccMBL = commentControllMobile
    // cController.on('validating',debounce(function(event){cController._validate();},1000));
    // cController.startup();
    // cController.placeAt('commentContent');
    ccDSK.startup();
    ccMBL.startup();
    ccDSK.placeAt(widgetUI.commentController1);
    ccMBL.placeAt(widgetUI.commentController2);

    dozaPopup = new dozaPopupWidget({id:'dozaPopup',graphicsLayer:'planningGraphics'});
    dozaPopup.on('featureChange',function(evt){
      if (evt.testimonyID != null){
        window.ccDSK.set('testimonyID',evt.testimonyID);
        window.ccMBL.set('testimonyID',evt.testimonyID);
        toggleMobilePanel(true);
      } else {
        window.ccDSK.set('testimonyID',undefined);
        window.ccMBL.set('testimonyID',undefined);
        toggleMobilePanel(false);
      }
    })
    dozaPopup.startup();
    dozaPopup.placeAt('featureInfo');

    mdzPopup = new betterHousingPopup({id:'mdzPopup',graphicsLayerID:'planningGraphics'});
    mdzPopup.on('proposalChange',function(evt){
      // console.log('proposalChange',evt)
      window.ccDSK.set('testimonyID',evt.testimonyID);
      window.ccMBL.set('testimonyID',evt.testimonyID);
      toggleMobilePanel(true);
    });
    mdzPopup.startup();
    mdzPopup.placeAt('featureInfo');

    ripPopup = new residentialInfillPopup({id:'ripPopup',graphicsLayerID:'planningGraphics'});
    ripPopup.on('featureChange',function(evt){
      if (evt.testimonyID != null){
        window.ccDSK.set('testimonyID',evt.testimonyID);
        window.ccMBL.set('testimonyID',evt.testimonyID);
        toggleMobilePanel(true);
      } else {
        window.ccDSK.set('testimonyID',undefined);
        window.ccMBL.set('testimonyID',undefined);
        toggleMobilePanel(false);
      }
    });
    ripPopup.startup();
    ripPopup.placeAt('featureInfo');

    buildMapControls();
  };
  function buildMapControls(){
    var e2e = new E2EList({
      id:'e2e'
    }).placeAt(registry.byId('mapControls').layerControlNode);
    var iLi = new ListItem({
      id:'iLi',
      label:'Aerial Imagery',
      class:'imageryLI'
    });
    e2e.addChild(iLi);
    var iSW = new Switch({
      id:'iSW',
      value:'off',
      shape:'mblSwRoundShape1',
      style:{
        width:"60px"
      },
      layerArray:['imagery'],
      query:null,
      onStateChanged: function(newValue){
        if (newValue === "on") {
          map.getLayer('imagery').show();
          map.getLayer('tiles').hide();
        } else {
          map.getLayer('tiles').show();
          map.getLayer('imagery').hide();
        }
      }
    }).placeAt(iLi.containerNode);
    iSW.resize();
    iSW.startup();
    configOptions.maps.forEach(function(map){
      if (map.active) {
        map.layerControls.forEach(function(lc){
          var li = new ListItem({
            label:lc.label,
            class:lc.mapLayer
          });
          e2e.addChild(li);
          if(map.mapTheme != 'cc2035') {
            var sw = new Switch({
              id:lc.swID,
              value:'on',
              shape:'mblSwRoundShape1',
              style:{
                width:"60px"
              },
              layerArray:lc.subLayers,
              query:lc.query,
              linkLayers:lc.linkLayers,
              onStateChanged: function(newValue){
                layerConfig((newValue === "on" ? true: false), this.layerArray, this.query, this.linkLayers);
              }
            }).placeAt(li.containerNode);
            sw.resize();
            sw.startup();
            if (!lc.active) {
              sw.disableSwitch();
            }
          } else {
            var sw = new Switch({
              id:lc.swID,
              value:'off',
              shape:'mblSwRoundShape1',
              style:{
                width:"60px"
              },
              layerArray:lc.subLayers,
              query:lc.query,
              linkLayers:lc.linkLayers,
              onStateChanged: function(newValue){
                ccLayerConfig((newValue === "on" ? true: false), this.layerArray, this.query, this.linkLayers, this.id);
              }
            }).placeAt(li.containerNode);
            sw.resize();
            sw.startup();
            if (!lc.active) {
              sw.disableSwitch();
            }
          }
        });
      }
    });
    buildMap();
  };
  function buildMap() {
    //null symbols for layers that need selection layers added to the map
    var polygonSelectionSymbol = new SimpleFillSymbol({
      type: "esriSFS",
      style: "esriSFSNull",
      color: null,
      outline: null
    });
    var lineSelectionSymbol = new SimpleLineSymbol({
      type: "esriSLS",
      style: "esriSLSNull",
      color: null,
      width: 0
    });
    var pointSelectionSymbol = new SimpleMarkerSymbol({
      type: "esriSMS",
      style: "esriSMSCircle",
      size: 0
    });
    var polyNullRenderer = new SimpleRenderer(polygonSelectionSymbol);
    var lineNullRenderer = new SimpleRenderer(lineSelectionSymbol);
    var pointNullRenderer = new SimpleRenderer(pointSelectionSymbol);
    //basemap //high contrast - 138bce19 // standard basemap - iad0135m
    //published map bpsgis.iad0l35m
    //new bps basemap bpsgis.f648781b
    //new bpsBasemap 170824 - bpsgis.f648781bhttps://api.mapbox.com/styles/v1/bpsgis/cj6r5ga6t45ri2rqsg5xm3tep/wmts?access_token=pk.eyJ1IjoiYnBzZ2lzIiwiYSI6IkJWaF93c0EifQ.su1KsHV9gej_bEUpZ5A8QA

    var tiles = new WebTiledLayer("https://${subDomain}.tiles.mapbox.com/v3/bpsgis.iad0l35m/${level}/${col}/${row}.png", {
        id: "tiles",
        subDomains: ["a", "b", "c"],
        copyright: "City of Portland via Mapbox"
    });

    //--removed vector tile layer on 180508 -- suspected source of bug on certain platforms

    // VectorTileLayer.ACCESS_TOKEN = 'pk.eyJ1IjoiYnBzZ2lzIiwiYSI6IkJWaF93c0EifQ.su1KsHV9gej_bEUpZ5A8QA';
    // var tiles = new  VectorTileLayer('mapbox://styles/bpsgis/cj6r5ga6t45ri2rqsg5xm3tep',{
    //   id:'tiles'
    // });
    var imagery = new WebTiledLayer("https://${subDomain}.tiles.mapbox.com/v3/bpsgis.h2p5h951/${level}/${col}/${row}.png", {
      id:'imagery',
      subDomains: ["a", "b", "c"],
      copyright: "City fo Portland via Mapbox"
    });
    imagery.setVisibility(false);
    var gLayer = new GraphicsLayer({id:'gLayer'});
    var taxlotHighlightLayer = new GraphicsLayer({id:'taxlotHighlightLayer'});

    var planningGraphics = new GraphicsLayer({id:'planningGraphics'});
    var ccGraphics = new GraphicsLayer({id:'ccGraphics'});

    var node = registry.byId('mapControls').legendContainerNode;
    if (node != "") {
      var legendNode = domConstruct.create('div',{id:'legendNode'},node);
      var ripLegendNode = domConstruct.create('div',{id:'ripLegendNode',class:'hidden'},'legendNode');
      domAttr.set('ripLegendNode','innerHTML',configOptions.ripLegendString);
      var mdzLegendNode = domConstruct.create('div',{id:'mdzLegendNode',class:'hidden'},'legendNode');
      domAttr.set('mdzLegendNode','innerHTML',configOptions.mdzLegendString);
    };
    window.graphicsLayerArray = ['gLayer','taxlotHighlightLayer','planningGraphics'];

    //doza proposal
    var designSymbol1 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([101,105,115]))
    var designSymbol2 = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([143,148,160]))
    var designRenderer = new UniqueValueRenderer(null,'NAME');
    designRenderer.addValue('CENTRAL CITY',designSymbol1)
    designRenderer.addValue('CENTRAL CITY - EASTSIDE',designSymbol1)
    designRenderer.addValue('CENTRAL CITY - RUSSELL ST',designSymbol1)
    designRenderer.addValue('GATEWAY REGIONAL CENTER',designSymbol1)
    designRenderer.addValue('MACADAM',designSymbol2)
    designRenderer.addValue('MARQUAM HILL',designSymbol2)
    designRenderer.addValue('TERWILLIGER',designSymbol2)
    designRenderer.addValue('TERWILLIGER/MARQUAM HILL',designSymbol2)
    var dozaDesignDistricts = new FeatureLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/COP_OpenData_ZoningCode/MapServer/151',{
      id:'dozaDesignDistricts',
      definitionExpression:configOptions.maps[21].layers[3].query
    });
    dozaDesignDistricts.setRenderer(designRenderer)
    var dozaBHDSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([78,205,253]));
    var dozaBHDRenderer = new SimpleRenderer(dozaBHDSymbol);
    var dozaBHD = new FeatureLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/75',{
      id:'dozaBHD',
      definitionExpression:configOptions.maps[21].layers[0].query
    });
    dozaBHD.setRenderer(dozaBHDRenderer)
    var dozaSDZDOverlaySymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,null,new Color([253,126,78]));
    var dozaSDZOverlayRenderer = new SimpleRenderer(dozaSDZDOverlaySymbol);
    var dozaSDZDOverlay = new FeatureLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/75',{
      id:'dozaSDZOverlay',
      definitionExpression:configOptions.maps[21].layers[1].query
    });
    dozaSDZDOverlay.setRenderer(dozaSDZOverlayRenderer)
    var dozaDSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1),new Color([0,0,0]));
    var dozaDRenderer = new SimpleRenderer(dozaDSymbol)
    var dozaDOverlay = new FeatureLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_Thematic_Layers/MapServer/52',{
      id:'dozaDOverlay',
      definitionExpression:configOptions.maps[21].layers[2].query
    });
    dozaDOverlay.setRenderer(dozaDRenderer);
    window.dozaLayers = [dozaDesignDistricts,dozaSDZDOverlay,dozaBHD,dozaDOverlay]

    //RIP proposal
    // var ripLayerDefinitions = [];
    // ripLayerDefinitions[configOptions.maps[15].layers[0].mapServiceLayerID] = configOptions.maps[15].layers[0].layerDef;
    var ripLayer = new dynamicLayer(configOptions.dynamicServiceURL,{
      id:'ripLayer',
      opacity:0.66
    });
    ripLayer.setVisibleLayers([81,82]);
    // ripLayer.setLayerDefinitions(ripLayerDefinitions);

    var ripZoning = new dynamicLayer('https://www.portlandmaps.com/arcgis/rest/services/Public/Zoning/MapServer',{
      id:'ripZoning',
      opacity:0.66
    });
    ripZoning.setVisibleLayers([3])
    ripZoning.setMinScale(150000);
    ripZoningLayerDefinitions = [];
    ripZoningLayerDefinitions[3] = "(PLDIST NOT IN ('CC','CCSA') OR PLDIST IS NULL) AND ZONE IN ('RF','R20','R10','R7','R5','R2.5')";
    ripZoning.setLayerDefinitions(ripZoningLayerDefinitions);
    window.ripLayers = [ripZoning,ripLayer]

    // var mdzOverlayDefinitions = [];
    // mdzOverlayDefinitions[configOptions.maps[17].layers[0].mapServiceLayerID] = configOptions.maps[17].layers[0].query;
    // var mdzOverlays = new dynamicLayer(configOptions.dynamicServiceURL,{
    //   id:'mdzOverlays',
    //   opacity:0.66
    // });
    // mdzOverlays.setVisibleLayers([configOptions.maps[17].layers[0].mapServiceLayerID]);
    // mdzOverlays.setLayerDefinitions(mdzOverlayDefinitions);
    // mdzOverlays.setMinScale(150000);

    var removeASymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_FORWARD_DIAGONAL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1),new Color([0,0,0]));
    var addDSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,0,0]), 1),new Color([0,0,0]));
    var removeARenderer = new SimpleRenderer(removeASymbol)
    var addDRenderer = new SimpleRenderer(addDSymbol)
    var ldo1 = new layerDrawingOptions();
    var ldo2 = new layerDrawingOptions();
    ldo1.renderer = removeARenderer;
    ldo2.renderer = addDRenderer;
    var mdzOverlayDefinitions = [];
    mdzOverlayDefinitions[configOptions.maps[17].layers[0].mapServiceLayerID] = configOptions.maps[17].layers[0].query;
    var mdzOverlays_removeA = new dynamicLayer(configOptions.dynamicServiceURL,{
      id:'mdzOverlays_removeA',
      opacity:0.66
    });
    mdzOverlays_removeA.setVisibleLayers([configOptions.maps[17].layers[0].mapServiceLayerID]);
    mdzOverlays_removeA.setLayerDefinitions(mdzOverlayDefinitions);
    mdzOverlays_removeA.setMinScale(150000);
    var l = []
    l[configOptions.maps[17].layers[0].mapServiceLayerID] = ldo1
    mdzOverlays_removeA.setLayerDrawingOptions(l)

    var mdzOverlayDefinitions2 = [];
    mdzOverlayDefinitions2[configOptions.maps[17].layers[2].mapServiceLayerID] = configOptions.maps[17].layers[2].query;
    var mdzOverlays_addD = new dynamicLayer(configOptions.dynamicServiceURL,{
      id:'mdzOverlays_addD',
      opacity:0.66
    });
    mdzOverlays_addD.setVisibleLayers([configOptions.maps[17].layers[2].mapServiceLayerID]);
    mdzOverlays_addD.setLayerDefinitions(mdzOverlayDefinitions2);
    mdzOverlays_addD.setMinScale(150000);
    var l2 = []
    l2[configOptions.maps[17].layers[2].mapServiceLayerID] = ldo2
    mdzOverlays_addD.setLayerDrawingOptions(l2)

    var mdzBaseZonesDefinitions = [];
    mdzBaseZonesDefinitions[configOptions.maps[17].layers[1].mapServiceLayerID] = configOptions.maps[17].layers[1].query;
    var mdzBaseZones = new dynamicLayer(configOptions.dynamicServiceURL,{
      id:'mdzBaseZones',
      opacity:0.66
    });
    mdzBaseZones.setVisibleLayers([configOptions.maps[17].layers[1].mapServiceLayerID]);
    mdzBaseZones.setLayerDefinitions(mdzBaseZonesDefinitions);
    mdzBaseZones.setMinScale(150000);

    // window.mdzLayers = [mdzBaseZones,mdzOverlays];
    window.mdzLayers = [mdzBaseZones,mdzOverlays_removeA,mdzOverlays_addD]

    //add layers to the map
    map.addLayer(tiles);
    map.addLayer(imagery);
    dozaLayers.forEach(function(layer){
      map.addLayer(layer);
    });
    ripLayers.forEach(function(layer){map.addLayer(layer);});
    mdzLayers.forEach(function(layer){map.addLayer(layer);});
    map.addLayer(gLayer);
    map.addLayer(taxlotHighlightLayer);
    map.addLayer(planningGraphics);
    window.ininitialMapLoadHandler = map.on('layer-add-result',function(e){
      if (e.layer.id === 'ccGraphics'){
        mapConfig();
      }
    });
    map.addLayer(ccGraphics);
  };
  function mapConfig() {
    window.ininitialMapLoadHandler.remove();
    window.geocoder.clear();
    domClass.add('ripLegendNode','hidden');
    domClass.add('mdzLegendNode','hidden');
    registry.byId('ripPopup').hide();
    registry.byId('mdzPopup').hide();
    registry.byId('dozaPopup').hide();
    window.map.getLayersVisibleAtScale().forEach(function(layer){
      if (layer.id != 'tiles' && layer.id != 'gLayer' && layer.id != 'taxlotHighlightLayer' && layer.id != 'imagery'){
        layer.hide();
      }
    });
    window.uriQueryObject = ioQuery.queryToObject(hash());
    if (uriQueryObject.hasOwnProperty('mapTheme')) {
      //set mapTheme on uiConfig obj
      uiController.set('mapTheme',uriQueryObject.mapTheme);
      //hide non-relevant map controls
      registry.byId('e2e').getChildren().forEach(function(child){
        if(domClass.contains(child.domNode, uriQueryObject.mapTheme) || child.id === "iLi"){
          domClass.remove(child.domNode, 'disappear');
        } else {
          domClass.add(child.domNode, 'disappear');
        }
      });
      if (uriQueryObject.adopted){
        window.location = '../mapapp';
      }
      switch (uriQueryObject.mapTheme) {
        case 'majorTrails':
        case 'landUse':
        case 'csp':
        case 'tsp':
        case 'rz':
        case 'az':
        case 'mrp':
        case 'tspBike':
        case 'tspStreets':
        case 'tspTraffic':
        case 'tspTransit':
        case 'tspEmergency':
        case 'cc2035':
        case 'cc2035TSP':
        case 'cc2035TSPClass':
        case 'mdp':
        case 'ncc':
        case '82nd':
          window.location = '../mapapp';
          break;
        case 'mdz':
          domClass.remove('mdzLegendNode','hidden');
          registry.byId('mdzPopup').show();
          window.mdzLayers.forEach(function(layer){
            layer.show();
          });
          break;
        case 'rip':
          domClass.remove('ripLegendNode','hidden');
          registry.byId('ripPopup').show();
          window.ripLayers.forEach(function(layer){
            layer.show();
          });
          break;
        case 'doza':
          // domClass.remove('dozaLegendNode','hidden');
          registry.byId('dozaPopup').show();
          console.log('show doza')
          window.dozaLayers.forEach(function(layer){
            layer.show();
          });
          break;
        default:
          //not a valid hash
          window.location = '../mapapp';
          break;
      }
    } else {
      window.location = '../mapapp';
    }
    window.ccDSK.set('testimonyID',undefined);
    window.ccMBL.set('testimonyID',undefined);
    var mapConfigObject = dojo.filter(configOptions.maps, function(item){return item.mapTheme === uriQueryObject.mapTheme;});
    domAttr.set(widgetUI.proposalTitle,'innerHTML',(mapConfigObject[0].hasOwnProperty('fullTitle') ? mapConfigObject[0].fullTitle : mapConfigObject[0].mapTitle +', '+ mapConfigObject[0].currentDraft + ' Draft'));
    domAttr.set(query('.btn-doc')[0],'innerHTML',(mapConfigObject[0].hasOwnProperty('documentButtonLabel')? mapConfigObject[0].documentButtonLabel : 'Explore the '+ mapConfigObject[0].currentDraft + ' Draft Documents'));
    domAttr.set(query('.btn-doc')[0],'title',(mapConfigObject[0].hasOwnProperty('documentButtonTitle')? mapConfigObject[0].documentButtonTitle : 'Explore the '+ mapConfigObject[0].currentDraft + ' Draft Documents'));
    domAttr.set(widgetUI.rtfd,'href',mapConfigObject[0].docURL);
    domAttr.set(widgetUI.testimony1Instruction, 'innerHTML',(mapConfigObject[0].hasOwnProperty('testimony1Instruction') ? mapConfigObject[0].testimony1Instruction : configOptions.defaultTestimony1Instruction));
    //replacing the commentable logic with values from the proposal table
    if (uiController.get('proposals') === null || uiController.get('proposals') === undefined){
      //response hasn't returned from xhr call to get proposals on uiController
      //have to send it from here to prevent meltdown
      xhr('../testify/testify.cfm',{
        method:'POST',
        data:{
          action:'getProposals',
          api_key:'30484247C7E23B267F4A4C24D9664097'
        }
      }).then(function(results){
        var r = JSON.parse(results);
        // console.log(r);
        if (r.status === 'success'){
          // uiController.set('proposals',r.proposals)
          var commentableObject = dojo.filter(r.proposals,function(item){return item.proposal === uriQueryObject.mapTheme;});
          var commentable = commentableObject[0].commentable;
          if (commentable){
            domAttr.set(widgetUI.testify1,'href','../testify/#/'+commentableObject[0].proposal)
            domAttr.set(widgetUI.testify1,'title',(mapConfigObject[0].hasOwnProperty('testimony1Title') ? mapConfigObject[0].testimony1Title : ('Testify on the '+mapConfigObject[0].mapTitle +', '+ mapConfigObject[0].currentDraft + ' Draft')));
            domClass.remove('testify1Row','hidden');
          } else {
            domClass.add('testify1Row','hidden');
          }
        }
      },function(error){
        console.log(error);
        // alert(error);
      });
    } else {
      //proposal response has been set -- continue
      var commentableObject = dojo.filter(uiController.get('proposals'),function(item){return item.proposal === uriQueryObject.mapTheme;});
      var commentable = commentableObject[0].commentable;
      if (commentable){
        domAttr.set(widgetUI.testify1,'href','../testify/#/'+commentableObject[0].proposal)
        domAttr.set(widgetUI.testify1,'title',(mapConfigObject[0].hasOwnProperty('testimony1Title') ? mapConfigObject[0].testimony1Title : ('Testify on the '+mapConfigObject[0].mapTitle +', '+ mapConfigObject[0].currentDraft + ' Draft')));
        domClass.remove('testify1Row','hidden');
      } else {
        domClass.add('testify1Row','hidden');
      }
    }
    if (mapConfigObject[0].hasOwnProperty('newTimeline')){
      if (mapConfigObject[0].newTimeline){
        buildTimeline(true,mapConfigObject[0].timelineContent)
      } else {
        buildTimeline(false,[])
      }
    } else {
      buildTimeline(false,[])
    }
    query('a[href="#mapInfo"]').tab('show');
    window.graphicsLayerArray.forEach(function(layer){map.getLayer(layer).clear();});
    var uri = window.location.href;
    if (uriQueryObject.hasOwnProperty('x')) {
      var point = new Point(parseFloat(uriQueryObject.x),parseFloat(uriQueryObject.y), new SpatialReference({wkid:102100}));
      var circleSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new CartographicLineSymbol(CartographicLineSymbol.STYLE_SOLID, new Color ([22, 129, 232]), 3, CartographicLineSymbol.CAP_ROUND, CartographicLineSymbol.JOIN_ROUND, 5));
      var circle = new Circle({
        center:point,
        geodesic:false,
        radius:0.25,
        radiusUnit:"esriMiles"
      });
      var circleGraphic = new Graphic(circle,circleSymbol);
      map.getLayer('gLayer').add(circleGraphic);
      map.setExtent(circle.getExtent());
    }
    var description = window.mapDescriptionStore.query({id:uriQueryObject.mapTheme});
    domAttr.set(dom.byId('mapInfoContent'), 'innerHTML', description[0].description);
    var initialConfig = domStyle.get(document.body, 'width')<= 769 ? 'mbl' : 'dsk';
    uiController.set('uiConfig',initialConfig);
  };
  function preprocessPopup(e, geoObj) {
    switch (uriQueryObject.mapTheme) {
      case 'mdz':
      case 'rip':
      case 'doza':
        usbTest(e,null);
        break;
      default:
        break;
    }
  };

  function usbTest(e,geoObj){
    //if user doesn't select inside USB, bail
    var xy = [];
    var xy = [];
    if (e != null & e != undefined){
      xy.push(e.mapPoint.x);
      xy.push(e.mapPoint.y);
      // console.log(xy);
    } else {
      xy.push(geoObj.x);
      xy.push(geoObj.y);
    }
    if (uiController.get('cityBoundary') === null || uiController.get('cityBoundary') === undefined){
      var cqt = new QueryTask(configOptions.usbQueryURL);
      var cq = new esriQuery();
      cq.returnGeometry = true;
      // cq.where = '1=1';
      cq.where = "CITYNAME = 'Portland'"
      cq.outFields = ['OBJECTID'];
      cqt.execute(cq).then(function(result){
        // console.log(result);
        uiController.set('cityBoundary',result.features[0].geometry);
        validateUSBTest(xy);
      },function(error){
        console.log(error);
      });
    } else {
      validateUSBTest(xy);
    }
  };
  function validateUSBTest(xy){
    //construct fake mapPoint obj to send to getParcel if test passes -- fails in this case

    require(["esri/geometry/geometryEngine"],function(geometryEngine){
      var testPoint = new Point([xy[0],xy[1]],new SpatialReference({wkid:102100}));
      var fakeMapPoint = {
        mapPoint:testPoint
      };
      var testPoly = uiController.get('cityBoundary');
      var polyJSON = {
        "rings":testPoly.rings,
        'spatialReference':testPoly.spatialReference
      }
      var p = new Polygon(polyJSON);
      // var test = geometryEngine.within(testPoint,testPoly);
      // console.log(testPoint,testPoly)
      var test = geometryEngine.intersects(testPoint,testPoly);
      if (test){
        //user clicked usb -- success
        getParcel(fakeMapPoint,null);
      } else {
        // showUSBAlert();
        // alert('non-usb click');
        processParcel({features:[]});
      }
    });
  };
  function closeBustedAddressAlert(){
    console.log('bustedAddress close')
    domClass.add(widgetUI.bustedAddressAlert,'hidden')
  }
  function showBustedAddressAlert(){

    domClass.remove(widgetUI.bustedAddressAlert,'hidden');
  };
  function showCCAlert(){
    query('a[href="#mapInfo"]').tab('show');
    domClass.remove(widgetUI.cc2035Alert,'hidden');
  };

  function getParcel(e, geoObj) {
    if (e != null && e != undefined) {
      uiController.set('mapXY',[e.mapPoint.x,e.mapPoint.y]);
    } else {
      uiController.set('mapXY',[geoObj.x,geoObj.y]);
    }
    window.map.getLayer('taxlotHighlightLayer').clear();
    var taxlotQueryTask = new QueryTask(configOptions.taxlotQueryURL);
    var taxlotQuery = new esriQuery();
    taxlotQuery.outFields = ["STATE_ID","PROPERTYID", "SITEADDR"];
    taxlotQuery.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
    var queryGeo = '';
    if (geoObj === null) {
      taxlotQuery.geometry = e.mapPoint;
      queryGeo = JSON.stringify(e.mapPoint);
    } else {
      taxlotQuery.geometry = geoObj;
      queryGeo = JSON.stringify(geoObj);
    }
    taxlotQuery.returnGeometry = true;
    taxlotQueryTask.execute(taxlotQuery, processParcel, getParcelError);
  };
  function getParcelError(error) {
    console.log('An error occured while selecting a tax parcel', error);
  };
  function processParcel(result) {
    // console.log(result);
    if (result.features.length > 0) {
      window.map.setSelectedParcel(result.features[0]);
      var addr = result.features[0].attributes.SITEADDR;
      if (addr === null || addr === undefined || addr === ""){
        var value = result.features[0].attributes.PROPERTYID;
        addr = '<a target="_blank" href="https://www.portlandmaps.com/detail/zoning/'+value+'_did/">'+ result.features[0].attributes.PROPERTYID + "</a> has no address.";
      } else {
        var value = result.features[0].attributes.SITEADDR;
        addr = value;
      }
      mapPopup.setTitle(addr);
      window.anchor = new Point(result.features[0].geometry.getExtent().getCenter().x, result.features[0].geometry.getExtent().getCenter().y, new SpatialReference({wkid: 102100}));
      mapPopup.show(window.anchor);
      window.ccDSK.set('testimonyID',undefined);
      window.ccMBL.set('testimonyID',undefined);
      var parcelSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,new CartographicLineSymbol(CartographicLineSymbol.STYLE_SHORTDASH, new Color ([255, 255, 255]), 3, CartographicLineSymbol.CAP_ROUND, CartographicLineSymbol.JOIN_ROUND, 5));
      var parcelGraphic = new Graphic(result.features[0].geometry, parcelSymbol);
      // if (uiController.get('mapTheme') != 'az'){window.map.getLayer('taxlotHighlightLayer').add(parcelGraphic);}
      window.map.getLayer('taxlotHighlightLayer').add(parcelGraphic);
      getProposals(result.features[0].geometry,result.features[0].attributes.PROPERTYID);
      switch(uiController.get('mapTheme')){
        case 'rip':
          registry.byId('ripPopup').set('propertyID',result.features[0].attributes.PROPERTYID);
          break;
        case 'mdz':
          registry.byId('mdzPopup').set('propertyID',result.features[0].attributes.PROPERTYID);
          break;
        case 'doza':
          registry.byId('dozaPopup').set('propertyID',result.features[0].attributes.PROPERTYID);
          break;
        default:
          break;
      }
      var centerTo = new Point({'x':map.getSelectedParcel().geometry.getExtent().getCenter().x,'y':map.getSelectedParcel().geometry.getExtent().getCenter().y,'spatialReference':{'wkid':102100}});
      map.centerAt(centerTo);
      toggleMobilePanel(true);
    }
    else {
      switch (uiController.get('mapTheme')){
        case 'doza':
          registry.byId('dozaPopup').set('propertyID','');
          registry.byId('dozaPopup').setFeatures([]);
          window.map.setSelectedParcel(null)
          break;
        case 'rip':
          registry.byId('ripPopup').set('propertyID','');
          registry.byId('ripPopup').setFeatures([]);
          window.map.setSelectedParcel(null);
          break;
        case 'mdz':
          registry.byId('mdzPopup').set('propertyID','');
          registry.byId('mdzPopup').set('proposal',undefined)
          window.map.setSelectedParcel(null);
          break;
        default:
          break;
      }
    }
  };
  function getProposals(geometry,propertyid) {
    //doza popup processes proposals
    var geometry = geometry;
    var mapTheme = uiController.get('mapTheme');
    require(["esri/geometry/geometryEngine"],function(geometryEngine){
      var parcelBuffer = geometryEngine.geodesicBuffer(geometry, -2, "feet",false);
      switch (mapTheme){
        case 'mdz':
          // var qt1 = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/56');/*proposed overlays*/
          var qt1x = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/75'); /*overlays -- recommended draft*/
          var qt2 = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/57');/*proposed zoning*/
          var qt2x = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/75'); /*base zone & comp plan -- recommended draft*/
          var qt3 = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/59');/*special use areas*/
          var qt3x = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/87'); /*special use areas -- recommended draft*/
          var qt4 = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_Proposal_Archive/MapServer/39');/*adopted zoning -- overlays*/
          var q1x = new esriQuery();
          q1x.where = "proposal = 'bhd' and proposal_draft = 'recommended' and ((ex_ovrly_zone <> pr_ovrly_zone) OR (ex_ovrly_zone IS NULL AND pr_ovrly_zone IS NOT NULL) OR (ex_ovrly_zone IS NOT NULL AND pr_ovrly_zone IS NULL))";
          q1x.returnGeometry = false;
          q1x.geometry = parcelBuffer;
          q1x.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
          q1x.outFields = ['pr_zone','pr_ovrly_zone','ex_ovrly_zone'];
          var q2x = new esriQuery();
          q2x.where = "proposal = 'bhd' and proposal_draft = 'recommended' and (ex_zone <> pr_zone or ex_cp <> pr_cp)";
          q2x.returnGeometry = false;
          q2x.geometry = parcelBuffer;
          q2x.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
          q2x.outFields = ['ex_cp','ex_zone','pr_cp','pr_zone'];
          var q3x = new esriQuery();
          q3x.where = "feature_type IN ('corridor','eastern neighborhood pattern area')";
          q3x.returnGeometry = false;
          q3x.geometry = parcelBuffer;
          q3x.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
          q3x.outFields = ['feature_type'];
          var q3x2 = new esriQuery();
          q3x2.where = "feature_type NOT IN ('corridor','eastern neighborhood pattern area')";
          q3x2.returnGeometry = false;
          q3x2.geometry = parcelBuffer;
          q3x2.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
          q3x2.outFields = ['feature_type'];
          var q4x = new Deferred();
          xhr('../../api/detail/',{
            method:"POST",
            data:{
              detail_type:'zoning',
              sections:'general',
              detail_id:propertyid,
              api_key:configOptions.api_key
            }
          }).then(function(response){
            var r = JSON.parse(response);
            if (r.status === 'success'){
              q4x.resolve(r.zoning)
            } else {
              q4x.reject('there was an error getting existing zoning',true)
            }
          },function(error){
            q4x.reject(error,true);
          });
          var d1x = qt1x.execute(q1x);
          var d2x = qt2x.execute(q2x);
          var d3x = qt3x.execute(q3x);
          var d3x2 = qt3x.execute(q3x2);
          all([d1x,d2x,d3x,q4x,d3x2]).then(function(response){processMDZProposals(response)},function(error){console.log('error');});
          break;
        case 'rip':
          //use dojo/promise/all to test against all proposal layers -- build combined result object
          var ripQT1 = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/81')
          var ripQT2 = new QueryTask('https://www.portlandmaps.com/arcgis/rest/services/Public/BPS_ReadOnly/MapServer/82')
          var ripQuery = new esriQuery();
          ripQuery.returnGeometry = true;
          ripQuery.geometry = parcelBuffer;
          ripQuery.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
          ripQuery.outFields = ['*'];
          var d1 = ripQT1.execute(ripQuery);
          var ripQuery2 = new esriQuery();
          ripQuery2.returnGeometry = true;
          ripQuery2.geometry = parcelBuffer;
          ripQuery2.spatialRelationship = esriQuery.SPATIAL_REL_INTERSECTS;
          ripQuery2.outFields = ['*'];
          var d2 = ripQT2.execute(ripQuery2);
          var d3 = new Deferred();
          xhr('../../api/detail/',{
            method:"POST",
            data:{
              detail_type:'zoning',
              sections:'general',
              detail_id:propertyid,
              api_key:configOptions.api_key
            }
          }).then(function(response){
            var r = JSON.parse(response);
            if (r.status === 'success'){
              d3.resolve(r.zoning)
            }
          },function(error){
            d3.reject(error);
          });
          all([d1,d2,d3]).then(function(response){
            //successful
            processRIPProposals(response);
          },function(error){
            console.error(error)
          });
          break;
        default:
          break;
      }
    });
  };
  function processMDZProposals(response){
    var cp = window.zonesAndComp.filter(function(o){
      return o.zone_type == 'comp plan';
    })
    var overlays = window.zoneReferences.filter(function(o){
      return o.zonetype=='overlay';
    })
    var valueTest = function(v1,v2){

    }
    var processOverlays = function(f){
      var overlayArray = []
      f.forEach(function(x){
        var action = '';
        var attrs = x.attributes;
        if (attrs.ex_ovrly_zone === null && attrs.pr_ovrly_zone != null){
          action = 'add';
        } else if (attrs.ex_ovrly_zone != null && attrs.pr_ovrly_zone === null){
          action = 'remove';
        } else if (attrs.ex_ovrly_zone != null && attrs.pr_ovrly_zone != null){
          if (attrs.ex_ovrly_zone.split(',').length < attrs.pr_ovrly_zone.split(',').length){
            action = 'add';
          } else if (attrs.ex_ovrly_zone.split(',').length > attrs.pr_ovrly_zone.split(',').length){
            action = 'remove'
          } else if (attrs.ex_ovrly_zone.split(',').length === attrs.pr_ovrly_zone.split(',').length) {
            if (attrs.ex_ovrly_zone.split(',').indexOf('a')>0 && attrs.pr_ovrly_zone.split(',').indexOf('d'>0)){
              action = 'combo'
            }
          }
        }
        switch(action){
          case 'remove':
            overlayArray.push({attributes:{action:action,overlay:'a',overlay_name:'Alternative Design Density (a)'}});
            break;
          case 'add':
            overlayArray.push({attributes:{action:action,overlay:'d',overlay_name:'Design (d)'}});
            break;
          case 'combo':
            overlayArray.push({attributes:{action:action,overlay:'a',overlay_name:'Alternative Design Density (a)'}});
            overlayArray.push({attributes:{action:action,overlay:'d',overlay_name:'Design (d)'}});
            break;
          default:
            break;
        }
      })
      return overlayArray;
    };
    var processBase = function(f){
      var baseArray = [];
      f.forEach(function(x){
        var a = x.attributes;
        var c1 = cp.filter(function(cc){return cc.zone_code == a.ex_cp;});
        var c2 = cp.filter(function(cc){return cc.zone_code == a.pr_cp;});
        var o = {
          EXISTCMP:a.ex_cp,
          EXISTZONE:a.ex_zone,
          Existing_CP_Des:c1[0].zone_name,
          NEWDESIG:a.pr_cp,
          NEWZONE:a.pr_zone,
          Proposed_CP_Des:c2[0].zone_name,
          RECID:0
        }
        if (a.ex_zone === a.pr_zone) {
          o.RECID = 2
        } else {
          o.RECID = 1
        }
        baseArray.push({attributes:o});
      })
      return baseArray;
    };
    var processPMaps = function(a,state){
      if (state === 'overlay'){
        var returnArray = []
            a.forEach(function(o){
              o.code.split(',').forEach(function(oo){
                var n = overlays.filter(function(x){
                  return x.zone == oo
                })
                returnArray.push({attributes:{OVRLY:oo,OVRLY_DESC:n[0].label}})
              })
            })
            return returnArray;
      }
    }

    //response is an array of response from esri query tasks against the bps_readonly map server
    //[proposed-overlays, proposed-zoning, special-use-areas, adopted-overlays]
    // if ()
    // console.log('processMDZProposals');
    // console.log(response);
    //new response for recommended draft
    //[{overlay},{zone & comp plan},{special use areas},{pmaps zoning}]
    //transform new response to match old
    //empty array if nothing returned for a specific query
    var proposalObject = {}
    //proposalObject.overlayChanges = response[0].features; //[{attributes:{action:'',overlay:'',overlay_name:''}}] -- proposed draft data model
    proposalObject.overlayChanges = processOverlays(response[0].features);
    // proposalObject.zoningChanges = response[1].features;//[{attributes:{EXISTCMP:'R1',EXISTZONE:'R1',Existing_CP_Des:'Multi-Dwelling 1,000',NEWDESIG:'MD-C',NEWZONE:'RM2',Proposed_CP_Des:'Multi-Dwelling - Corridor',RECID:1}}] -- proposed draft data model
    proposalObject.zoningChanges = processBase(response[1].features)
    // proposalObject.specialUses = response[2].features;//[{attributes:{feature_type:'eastern neighborhood pattern area'}}] -- proposed draft data model
    proposalObject.specialUses = response[2].features;
    // proposalObject.existingOverlay = response[3].features;//[{OVRLY:'a',OVRYL_DESC:'Alternative Design Density'}] -- proposed draft data model
    proposalObject.existingOverlay = processPMaps(response[3].overlay,'overlay');
    proposalObject.historic_district = (response[3].historic_district.length > 0 ? true : false);
    proposalObject.farHeightSwap = response[4].features;
    // debugger;
    registry.byId('mdzPopup').set('proposal',proposalObject)
    // proposalObject.
    // console.log(response)
  };
  function processRIPProposals(response){
    var r = response;
    //response looks like [{},{},{}]
    //each obj in response has a features attr that looks like [{},{}...]
    //response[0] is the rip rezone proposal
    //response[1] is the rip z overlay
    //response[2] is existing zoning
    //going to build a fake result.features object
    var parcel = map.getSelectedParcel();
    var f = {
      attributes:{
        rezone:false,
        zOverlay:false,
        zoning:{base:null,overlay:null},
        zOverlayFeatures:null
      },
      geometry:parcel.geometry
    };
    if (r[0].features.length >= 1){
      f.attributes.rezone = true;
    }
    if (r[1].features.length >= 1){
      f.attributes.zOverlay = true;
      f.attributes.zOverlayFeatures = r[1].features;
    }
    var baseZoneArray = [];
    r[2].base.forEach(function(z){
      baseZoneArray.push(z.code);
    })
    var overlayArray = [];
    r[2].overlay.forEach(function(o){
      var oo = o.code.split(',');
      oo.forEach(function(x){overlayArray.push(x)})
    });
    f.attributes.zoning.base = baseZoneArray;
    f.attributes.zoning.overlay = overlayArray;
    ripPopup.setRevisedProposals(f);
  };
  function layerConfig(val, layerArray, query, linkLayers) {
    map.getLayer('gLayer').clear();
    map.getLayer('planningGraphics').clear();
    if (query === null) {
      layerArray.forEach(function(layer){
        map.getLayer(layer).setVisibility(val);
      });
    } else {
    }
  };
  function pointToExtent(mapPoint, toleranceInPixel) {
    var pixelWidth = window.map.extent.getWidth() / window.map.width;
    var toleranceInMapCoords = toleranceInPixel * pixelWidth;
    return new esri.geometry.Extent(mapPoint.x - toleranceInMapCoords,
      mapPoint.y - toleranceInMapCoords,
      mapPoint.x + toleranceInMapCoords,
      mapPoint.y + toleranceInMapCoords,
      window.map.spatialReference);
  };
  function configUI(foo, bar, baz){
    domStyle.set(dom.byId('geocoderDiv'),'width',(domStyle.get('mapWrapper','width')*0.75).toString()+'px')
    // domStyle.set(dom.byId('themerDiv2'), 'width', (domStyle.get(registry.byId('zThemer').domNode, 'width') + 2).toString() + "px");
    if (bar === baz) {
      return;
    } else {
      if (baz === 'dsk') {
        if (domStyle.get('mblInfoModal', 'display') === 'block'){
          // query('#mblInfoModal').modal('toggle');
          $('#mblInfoModal').modal('toggle');
        }
        if (domStyle.get('mblSearchModal'),'display' === 'block') {
          // query('#mblSearchModal').modal('toggle');
          $('#mblSearchModal').modal('toggle');
        }
        // console.log('config desktop');
        //config desktop ui
        domClass.add('mblPanel', 'disappear');
        domStyle.set('mapWrapper', 'height', '100%');

        domConstruct.place(ripPopup.domNode,'featureInfo');
        domConstruct.place(mdzPopup.domNode,'featureInfo');
        domConstruct.place(dozaPopup.domNode,'featureInfo')
        domConstruct.place('mapInfo','tabContent');
        document.getElementById("contentWrapper").style.overflowY = "hidden";
      } else {
        // console.log('config mbl');
        //config mbl ui
        domConstruct.place(ripPopup.domNode, 'mblFeatureInfo');
        domConstruct.place(mdzPopup.domNode, 'mblFeatureInfo');
        domConstruct.place(dozaPopup.domNode,'mblFeatureInfo')
        domConstruct.place('mapInfo','mblInfoWidgets');
        document.getElementById("contentWrapper").style.overflowY = "auto";
      }
    }
  };
  function toggleMobilePanel(foo) {
    if (uiController.get('uiConfig')=== 'mbl') {
      if (foo) {
        //open
        domStyle.set('mapWrapper', 'height', '50%');
        domClass.remove('mblPanel', 'disappear');
        if (map.getSelectedParcel().hasOwnProperty('geometry') === true){
          var centerTo = new Point({'x':map.getSelectedParcel().geometry.getExtent().getCenter().x,'y':map.getSelectedParcel().geometry.getExtent().getCenter().y,'spatialReference':{'wkid':102100}});
        }
        map.reposition();
        map.resize();
        map.centerAt(centerTo);
      } else {
        //close
        domClass.add('mblPanel', 'disappear');
        domStyle.set('mapWrapper', 'height', '100%');
      }
    }
  };
  function hideModals(evt){
    if (evt.target) {
      if (evt.target.id === 'layerModal') {
        // query('#layerModal').modal('hide');
        $('#layerModal').modal('hide');
      }
      if (evt.target.id === 'mblSearchModal') {
        // query('#mblSearchModal').modal('hide');
        $('#mblSearchModal').modal('hide');
      }
      if (evt.target.id === 'mblInfoModal') {
        // query('#mblInfoModal').modal('hide');
        $('#mblInfoModal').modal('hide');
      }
    }
  };
  function getUSBBoundary(){
    var usbQT = new QueryTask(configOptions.usbQueryURL);
    var usbQ = new esriQuery();
    usbQ.returnGeometry = true;
    // usbQ.where = "1=1";
    usbQ.where = "CITYNAME = 'Portland'"
    usbQ.outFields = ["OBJECTID"];
    usbQT.execute(usbQ).then(function(response){
      // console.log(response);
      uiController.set('cityBoundary',response.features[0].geometry);
    },function(error){
      console.log(error);
    });
  };
  function buildTimeline(v,timelineContent){
    domAttr.set(query('.timeline-new')[0],'innerHTML','');
    var tTitle = widgetUI.timelineTitle;
    if (v){
      timelineContent.forEach(function(x){
        // var entry = domConstruct.toDom("<div class='timeline-item'><div class='col-xs-4 timeline-icon "+x[0]+"'></div><div class='col-xs-8 timeline-entry'>"+x[1]+"</div></div>");
        var entry = domConstruct.toDom("<div class='row timeline-entry'><div class='col-xs-2 tli'><div class='timeline-icon "+x[0]+"'></div></div><div class='col-xs-10 timeline-entry'>"+x[1]+"</div></div>");
        domConstruct.place(entry,query('.timeline-new')[0]);
      });
      domClass.remove(tTitle,'hidden');
      domClass.remove(query('.timeline-new')[0],'hidden');
    } else {
      domClass.add(tTitle,'hidden');
      domClass.add(query('.timeline-new')[0],'hidden');
    }
  };
  document.dojoClick = false;
  return {
    instantiateDependencies: instantiateDependencies
  };
});