var CreateRDPDesktop=function(e){var a={m:{KeyAction:{NONE:0,DOWN:1,UP:2,SCROLL:3,EXUP:4,EXDOWN:5,DBLCLICK:6}},State:0};a.canvas=Q(e),"string"==typeof(a.CanvasId=e)&&(a.CanvasId=Q(e)),a.Canvas=a.CanvasId.getContext("2d"),a.ScreenWidth=a.width=1280,a.ScreenHeight=a.height=1024,a.m.onClipboardChanged=null;var o=!(a.onConsoleMessageChange=null),i="default";function n(e){return(!0===a.m.SwapMouse?[2,0,1,0,0]:[1,0,2,0,0])[e]}function r(e){a.State!=e&&(a.State=e,null!=a.onStateChanged&&a.onStateChanged(a,a.State))}function s(e){var t=a.Canvas.canvas.height/a.CanvasId.clientHeight,n=a.Canvas.canvas.width/a.CanvasId.clientWidth,s=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t}(a.Canvas.canvas),n=(e.pageX-s[0])*n,t=(e.pageY-s[1])*t;return e.addx&&(n+=e.addx),e.addy&&(t+=e.addy),{x:n,y:t}}a.mouseCursorActive=function(e){o!=e&&(o=e,a.CanvasId.style.cursor=1==e?i:"default")},a.Start=function(e,t,n){r(1),a.nodeid=e,a.port=t;var s={savepass:(a.credentials=n).savecred,useServerCreds:n.servercred,width:n.width,height:n.height,flags:n.flags,workingDir:n.workdir,alternateShell:n.altshell};n.width&&n.height&&(s.width=a.ScreenWidth=a.width=n.width,s.height=a.ScreenHeight=a.height=n.height,delete n.width,delete n.height),a.render=new Mstsc.Canvas.create(a.canvas),a.socket=new WebSocket("wss://"+window.location.host+"/mstscrelay.ashx"),a.socket.binaryType="arraybuffer",a.socket.onopen=function(){r(2),a.socket.send(JSON.stringify(["infos",{ip:a.nodeid,port:a.port,screen:{width:a.width,height:a.height},domain:n.domain,username:n.username,password:n.password,options:s,locale:Mstsc.locale()}]))},a.socket.onmessage=function(e){if("string"==typeof e.data){var t=JSON.parse(e.data);switch(t[0]){case"rdp-connect":r(3),a.rotation=0,a.Canvas.setTransform(1,0,0,1,0,0),a.Canvas.canvas.width=a.ScreenWidth,a.Canvas.canvas.height=a.ScreenHeight,a.Canvas.fillRect(0,0,a.ScreenWidth,a.ScreenHeight),null!=a.m.onScreenSizeChange&&a.m.onScreenSizeChange(a,a.ScreenWidth,a.ScreenHeight,a.CanvasId);break;case"rdp-bitmap":if(null==a.bitmapData)break;var n=t[1];n.data=a.bitmapData,delete a.bitmapData,a.render.update(n);break;case"rdp-pointer":n=t[1];i=n,o&&(a.CanvasId.style.cursor=n);break;case"rdp-close":a.Stop();break;case"rdp-error":switch(a.consoleMessageTimeout=5,a.consoleMessage=t[1],delete a.consoleMessageArgs,2<t.length&&(a.consoleMessageArgs=[t[2]]),t[1]){case"NODE_RDP_PROTOCOL_X224_NEG_FAILURE":1==t[2]?a.consoleMessageId=9:2==t[2]?a.consoleMessageId=10:3==t[2]?a.consoleMessageId=11:4==t[2]?a.consoleMessageId=12:5==t[2]?a.consoleMessageId=13:6==t[2]?a.consoleMessageId=14:a.consoleMessageId=7;break;case"NODE_RDP_PROTOCOL_X224_NLA_NOT_SUPPORTED":a.consoleMessageId=8;break;default:a.consoleMessageId=null}a.onConsoleMessageChange&&a.onConsoleMessageChange(),a.Stop();break;case"rdp-clipboard":a.lastClipboardContent=t[1],a.m.onClipboardChanged&&a.m.onClipboardChanged(t[1]);break;case"ping":a.socket.send('["pong"]')}}else a.bitmapData=e.data},a.socket.onclose=function(){r(0)},r(1)},a.Stop=function(){a.Canvas.fillRect(0,0,a.ScreenWidth,a.ScreenHeight),a.socket&&a.socket.close()},a.m.setClipboard=function(e){a.socket&&a.socket.send(JSON.stringify(["clipboard",e]))},a.m.getClipboard=function(){return a.lastClipboardContent},a.m.mousemove=function(e){if(a.socket&&3==a.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>a.ScreenWidth||t.y>a.ScreenHeight))return a.mouseNagleData=["mouse",t.x,t.y,0,!1],null==a.mouseNagleTimer&&(a.mouseNagleTimer=setTimeout(function(){a.socket.send(JSON.stringify(a.mouseNagleData)),a.mouseNagleTimer=null},50)),e.preventDefault(),!1}},a.m.mouseup=function(e){if(a.socket&&3==a.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>a.ScreenWidth||t.y>a.ScreenHeight))return null!=a.mouseNagleTimer&&(clearTimeout(a.mouseNagleTimer),a.mouseNagleTimer=null),a.socket.send(JSON.stringify(["mouse",t.x,t.y,n(e.button),!1])),e.preventDefault(),!1}},a.m.mousedown=function(e){if(a.socket&&3==a.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>a.ScreenWidth||t.y>a.ScreenHeight))return null!=a.mouseNagleTimer&&(clearTimeout(a.mouseNagleTimer),a.mouseNagleTimer=null),a.socket.send(JSON.stringify(["mouse",t.x,t.y,n(e.button),!0])),e.preventDefault(),!1}},a.m.handleKeyUp=function(e){if(a.socket&&3==a.State)return a.socket.send(JSON.stringify(["scancode",Mstsc.scancode(e),!1])),e.preventDefault(),!1},a.m.handleKeyDown=function(e){if(a.socket&&3==a.State)return a.socket.send(JSON.stringify(["scancode",Mstsc.scancode(e),!0])),e.preventDefault(),!1},a.m.mousewheel=function(e){if(a.socket&&3==a.State){var t=s(e);if(!(t.x<0||t.y<0||t.x>a.ScreenWidth||t.y>a.ScreenHeight)){null!=a.mouseNagleTimer&&(clearTimeout(a.mouseNagleTimer),a.mouseNagleTimer=null);var n=0;return e.detail?n=120*e.detail:e.wheelDelta&&(n=3*e.wheelDelta),a.m.ReverseMouseWheel&&(n*=-1),0!=n&&a.socket.send(JSON.stringify(["wheel",t.x,t.y,n,!1,!1])),e.preventDefault(),!1}}},a.m.SendStringUnicode=function(e){a.socket&&3==a.State&&a.socket.send(JSON.stringify(["utype",e]))},a.m.SendKeyMsgKC=function(e,t,n){if(3==a.State)if("object"==typeof e)for(var s in e)a.m.SendKeyMsgKC(e[s][0],e[s][1],e[s][2]);else{t=c[t];null!=t&&a.socket.send(JSON.stringify(["scancode",t,0!=(1&e)]))}},a.m.mousedblclick=function(){},a.m.handleKeyPress=function(){},a.m.setRotation=function(){},a.m.sendcad=function(){a.socket.send(JSON.stringify(["scancode",29,!0])),a.socket.send(JSON.stringify(["scancode",56,!0])),a.socket.send(JSON.stringify(["scancode",57427,!0])),a.socket.send(JSON.stringify(["scancode",57427,!1])),a.socket.send(JSON.stringify(["scancode",56,!1])),a.socket.send(JSON.stringify(["scancode",29,!1]))};var c={9:15,16:42,17:29,18:56,27:1,33:57417,34:57425,35:57423,36:57415,37:57419,38:57416,39:57421,40:57424,44:57399,45:57426,46:57427,65:30,66:48,67:46,68:32,69:18,70:33,71:34,72:35,73:23,74:36,75:37,76:38,77:50,78:49,79:24,80:25,81:16,82:19,83:31,84:20,85:22,86:47,87:17,88:45,89:21,90:44,91:57435,112:59,113:60,114:61,115:62,116:63,117:64,118:65,119:66,120:67,121:68,122:87,123:88};return a}