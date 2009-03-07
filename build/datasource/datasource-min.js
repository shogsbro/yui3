YUI.add("datasource-base",function(D){D.namespace("DataSource");var C=D.DataSource;D.mix(C,{_tId:0,ERROR_DATANULL:0,ERROR_DATAINVALID:1});var A=D.Lang,B=function(){B.superclass.constructor.apply(this,arguments);};D.mix(B,{NAME:"DataSource.Base",ATTRS:{source:{value:null},ERROR_DATAINVALID:{value:"Invalid data"},ERROR_DATANULL:{value:"Null data"}},issueCallback:function(I,H,F){if(I){var G=I.scope||window,E=(F&&I.failure)||I.success;if(E){E.apply(G,H.concat([I.argument]));}}}});D.extend(B,D.Base,{_queue:null,initializer:function(){this._queue={interval:null,conn:null,requests:[]};this._initEvents();},destructor:function(){},_initEvents:function(){this.publish("requestEvent",{defaultFn:this._makeConnection});this.publish("responseEvent",{defaultFn:this._handleResponse});},_makeConnection:function(E){this.fire("responseEvent",D.mix(E.details[0],{response:this.get("source")}));},_handleResponse:function(E){this.returnData(E.tId,E.request,E.callback,{results:E.response});},sendRequest:function(E,G){var F=C._tId++;this.fire("requestEvent",{tId:F,request:E,callback:G});return F;},returnData:function(H,F,G,E){if(!E){E={error:true};}if(E.error){this.fire("errorEvent",{tId:H,request:F,callback:G,response:E});}E.tId=H;if(!E.results){E.results=[];}if(!E.meta){E.meta={};}B.issueCallback(G,[F,E,(G&&G.argument)],E.error);}});C.Base=B;},"@VERSION@",{requires:["base"]});YUI.add("datasource-local",function(B){var A=B.Lang,C=function(){C.superclass.constructor.apply(this,arguments);};B.mix(C,{NAME:"DataSource.Local",ATTRS:{}});B.extend(C,B.DataSource.Base,{});B.DataSource.Local=C;},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource-xhr",function(C){var A=C.Lang,B=function(){B.superclass.constructor.apply(this,arguments);};C.mix(B,{NAME:"DataSource.XHR",ATTRS:{io:{value:C.io}}});C.extend(B,C.DataSource.Base,{_makeConnection:function(E){var F=this.get("source"),D={on:{complete:function(I,G,H){this.fire("responseEvent",C.mix(H,{response:G}));}},context:this,arguments:{tId:E.tId,request:E.request,callback:E.callback}};this.get("io")(F,D);return E.tId;}});C.DataSource.XHR=B;},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource-cache",function(D){var C=D.Lang,B=D.DataSource.Base,A=function(){};A.ATTRS={cache:{value:null,validator:function(E){return((E instanceof D.Cache)||(E===null));},set:function(G){var F=0,E=this._cacheHandlers;if(G!==null){if(E===null){E=[];E.push(D.before(this._beforeSendRequest,this,"sendRequest"));E.push(D.before(this._beforeReturnData,this,"returnData"));this._cacheHandlers=E;}}else{if(E!==null){for(;F<E;F++){D.detach(E[F]);}this._cacheHandlers=null;}}}}};A.prototype={_cacheHandlers:null,_beforeSendRequest:function(F,G){var E=(this.get("cache")&&this.get("cache").retrieve(F,G))||null;if(E&&E.response){B.issueCallback(G,[F,E.response]);return new D.Do.Halt("msg","newRetVal");}},_beforeReturnData:function(H,F,G,E){if(this.get("cache")){this.get("cache").add(F,E,(G&&G.argument));}}};D.Base.build(B,[A],{dynamic:false});},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource-dataparser",function(D){var C=D.Lang,B=D.DataSource.Base,A=function(){};A.ATTRS={parser:{value:null,validator:function(E){return((E instanceof D.DataParser.Base)||(E===null));}}};A.prototype={_handleResponse:function(F){var E=F.response;E=(this.get("parser")&&this.get("parser").parse(E))||{results:E};this.returnData(F.tId,F.request,F.callback,E);}};D.Base.build(B,[A],{dynamic:false});},"@VERSION@",{requires:["datasource","dataparser"]});YUI.add("datasource-polling",function(D){var B=D.Lang,A=D.DataSource.Base,C=function(){};C.prototype={_intervals:null,setInterval:function(G,F,I){if(B.isNumber(G)&&(G>=0)){var E=this,H=setInterval(function(){E.sendRequest(F,I);},G);if(!this._intervals){this._intervals=[];}this._intervals.push(H);return H;}else{}},clearInterval:function(G){var F=this._intervals||[],E=F.length-1;for(;E>-1;E--){if(F[E]===G){F.splice(E,1);clearInterval(G);}}}};D.Base.build(A,[C],{dynamic:false});},"@VERSION@",{requires:["datasource-base"]});YUI.add("datasource",function(A){},"@VERSION@",{use:["datasource-base","datasource-local","datasource-xhr","datasource-cache","datasource-dataparser","datasource-polling"]});